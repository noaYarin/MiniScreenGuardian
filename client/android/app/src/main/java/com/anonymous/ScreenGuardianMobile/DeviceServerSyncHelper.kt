package com.screenguardianmobile

import android.content.Context
import android.util.Log
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL

/**
 * DeviceServerSyncHelper
 *
 * This helper is responsible for sending device state updates to the backend server.
 * It keeps the server informed about:
 * - Device heartbeat (online status + permissions)
 * - Screen time usage (used minutes today)
 *
 * Main responsibilities:
 * 1. sendHeartbeat():
 *    - Notifies the server that the device is alive.
 *    - Sends accessibility + usage permissions status.
 *    - Updates lastSeenAt on the server.
 *
 * 2. sendUsage():
 *    - Sends the current daily screen time usage.
 *    - Allows the server to stay in sync with the device.
 *
 * Architecture role:
 * - This is the "device → server" communication layer.
 * - Complements DevicePolicySyncHelper (which is server → device).
 *
 * Important notes:
 * - Runs in background threads (non-blocking).
 * - Uses HttpURLConnection (no external libraries).
 * - Values are clamped to avoid invalid data (e.g. > 24h usage).
 * - Works even if network is unstable (fails silently with logs).
 *
 * Offline behavior:
 * - If network fails → local policy still enforced (PolicyStore).
 * - Sync resumes automatically when connection is restored.
 */
object DeviceServerSyncHelper {

    private const val TAG = "DeviceServerSync"
    private const val MAX_MINUTES_PER_DAY = 24 * 60

    @Volatile
    private var lastSentUsageMinutes: Int? = null

    /**
     * Sends a heartbeat to the server.
     *
     * Purpose:
     * - Indicate that the device is online.
     * - Update permission status (accessibility + usage stats).
     *
     * Endpoint:
     * PATCH /api/v1/devices/{deviceId}/heartbeat
     */
    fun sendHeartbeat(context: Context) {
        try {
            val baseUrl = PolicyStore.getHeartbeatBaseUrl(context) ?: return
            val deviceId = PolicyStore.getHeartbeatDeviceId(context) ?: return
            val token = PolicyStore.getHeartbeatToken(context) ?: return
            val usageAccessEnabled = UsageStatsHelper.hasUsageAccess(context)
            val accessibilityEnabled = ScreenGuardianAccessibilityService.isServiceEnabled(context)

            Thread {
                var connection: HttpURLConnection? = null

                try {
                    val url = URL("${baseUrl.trimEnd('/')}/api/v1/devices/$deviceId/heartbeat")
                    connection = url.openConnection() as HttpURLConnection

                    connection.requestMethod = "PATCH"
                    connection.setRequestProperty("Content-Type", "application/json")
                    connection.setRequestProperty("Authorization", "Bearer $token")
                    connection.doOutput = true
                    connection.connectTimeout = 10000
                    connection.readTimeout = 10000

                    val body = """
                    {
                    "accessibilityEnabled": $accessibilityEnabled,
                      "usageAccessEnabled": $usageAccessEnabled
                    }
                    """.trimIndent()

                    connection.outputStream.use { it.write(body.toByteArray(Charsets.UTF_8)) }

                    val responseCode = connection.responseCode
                    val responseBody = readResponse(connection)

                    Log.d(TAG, "Heartbeat responseCode=$responseCode body=$responseBody")

                } catch (e: Exception) {
                    Log.e(TAG, "Failed to send heartbeat", e)
                } finally {
                    connection?.disconnect()
                }
            }.start()

        } catch (e: Exception) {
            Log.e(TAG, "Heartbeat error", e)
        }
    }

    /**
     * Sends current screen-time usage to the server.
     *
     * Purpose:
     * - Keep backend in sync with actual device usage.
     * - Used for analytics, limits, and parent dashboard.
     *
     * Endpoint:
     * PATCH /api/v1/devices/{deviceId}/usage
     */
    fun sendUsage(context: Context) {
        try {
            val baseUrl = PolicyStore.getHeartbeatBaseUrl(context) ?: return
            val deviceId = PolicyStore.getHeartbeatDeviceId(context) ?: return
            val token = PolicyStore.getHeartbeatToken(context) ?: return

            val usedTodayMinutesRaw = PolicyStore.getUsedToday(context)

            // Clamp to prevent invalid values
            val usedTodayMinutes = usedTodayMinutesRaw.coerceIn(0, MAX_MINUTES_PER_DAY)

            Thread {
                var connection: HttpURLConnection? = null

                try {
                    val url = URL("${baseUrl.trimEnd('/')}/api/v1/devices/$deviceId/usage")
                    connection = url.openConnection() as HttpURLConnection

                    connection.requestMethod = "PATCH"
                    connection.setRequestProperty("Content-Type", "application/json")
                    connection.setRequestProperty("Authorization", "Bearer $token")
                    connection.doOutput = true
                    connection.connectTimeout = 10000
                    connection.readTimeout = 10000

                    val body = """
                    {
                      "usedTodayMinutes": $usedTodayMinutes
                    }
                    """.trimIndent()

                    connection.outputStream.use { it.write(body.toByteArray(Charsets.UTF_8)) }

                    val responseCode = connection.responseCode
                    val responseBody = readResponse(connection)

                    Log.d(
                        TAG,
                        "Usage responseCode=$responseCode used=$usedTodayMinutes body=$responseBody"
                    )

                } catch (e: Exception) {
                    Log.e(TAG, "Failed to send usage", e)
                } finally {
                    connection?.disconnect()
                }
            }.start()

        } catch (e: Exception) {
            Log.e(TAG, "Usage error", e)
        }
    }

    /**
     * Sends usage only if the current value changed enough.
     *
     * This helps avoid unnecessary PATCH requests on every loop cycle.
     */
    fun sendUsageIfChanged(context: Context, minDeltaMinutes: Int = 1) {
        try {
            val current = PolicyStore.getUsedToday(context)
            val last = lastSentUsageMinutes

            if (last != null && kotlin.math.abs(current - last) < minDeltaMinutes) {
                return
            }

            lastSentUsageMinutes = current
            sendUsage(context)

        } catch (e: Exception) {
            Log.e(TAG, "sendUsageIfChanged error", e)
        }
    }

    /**
     * Clears local usage sync cache.
     *
     * Useful when device session is reset / disconnected / deleted.
     */
    fun clearSessionCache() {
        lastSentUsageMinutes = null
    }

    // Read response safely (handles both success and error streams)
    private fun readResponse(connection: HttpURLConnection): String {
        return try {
            val stream = if (connection.responseCode in 200..299) {
                connection.inputStream
            } else {
                connection.errorStream
            }

            stream?.let {
                BufferedReader(InputStreamReader(it)).use { reader ->
                    reader.readText()
                }
            } ?: ""
        } catch (e: Exception) {
            "Failed to read response"
        }
    }
}