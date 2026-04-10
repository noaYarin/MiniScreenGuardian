package com.screenguardianmobile

/**
 * DevicePolicySyncHelper
 *
 * This helper is responsible for synchronizing the device policy from the backend server
 * to the local Android device storage.
 *
 * Main responsibilities:
 * - Fetch the latest policy for the current device from the server.
 * - Parse the server response safely.
 * - Save the relevant policy values into PolicyStore.
 * - Keep the local device aligned with the server, while still supporting offline enforcement.
 *
 * What policy data is synced:
 * - Whether the device is currently locked by the parent
 * - Whether daily limit enforcement is enabled
 * - The configured daily screen-time limit
 * - Extra minutes approved for the current day
 *
 * How it works:
 * - Reads the base URL, device ID, and child token from PolicyStore.
 * - Sends an authenticated GET request to:
 *   /api/v1/devices/{deviceId}/policy
 * - Parses the JSON response from the backend.
 * - Stores the policy locally so other native components can enforce it.
 *
 * Safety and validation:
 * - Uses optJSONObject / optBoolean / optInt to avoid crashes when fields are missing.
 * - Clamps numeric values to a valid range (0 to 1440 minutes).
 * - Handles both success and error responses safely.
 *
 * Architecture notes:
 * - The server is treated as the source of truth for policy values.
 * - PolicyStore acts as the local cache for native enforcement.
 * - This helper is typically used by native services/modules that need fresh policy data.
 *
 * Offline behavior:
 * - If syncing fails, the device keeps using the last saved local policy.
 * - This supports continued enforcement even when the device is temporarily offline.
 */

import android.content.Context
import android.util.Log
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL
import kotlin.math.max
import kotlin.math.min

object DevicePolicySyncHelper {

    private const val TAG = "DevicePolicySync"

    private const val MAX_MINUTES_PER_DAY = 24 * 60

    fun fetchAndSavePolicy(
        context: Context,
        onFinished: (() -> Unit)? = null
    ) {
        val baseUrl = PolicyStore.getHeartbeatBaseUrl(context) ?: run {
            onFinished?.invoke()
            return
        }

        val deviceId = PolicyStore.getHeartbeatDeviceId(context) ?: run {
            onFinished?.invoke()
            return
        }

        val token = PolicyStore.getHeartbeatToken(context) ?: run {
            onFinished?.invoke()
            return
        }

        Thread {
            var connection: HttpURLConnection? = null

            try {
                val url = URL("${baseUrl.trimEnd('/')}/api/v1/devices/$deviceId/policy")
                connection = url.openConnection() as HttpURLConnection

                connection.requestMethod = "GET"
                connection.setRequestProperty("Authorization", "Bearer $token")
                connection.setRequestProperty("Content-Type", "application/json")
                connection.connectTimeout = 10000
                connection.readTimeout = 10000

                val responseCode = connection.responseCode
                val responseBody = readResponse(connection)

                if (responseCode !in 200..299) {
                    Log.e(TAG, "Policy fetch failed. code=$responseCode body=$responseBody")
                    return@Thread
                }

                val root = JSONObject(responseBody)
                val data = root.optJSONObject("data") ?: JSONObject()

                // Use optJSONObject to avoid crashes if field missing
                val screenTime = data.optJSONObject("screenTime") ?: JSONObject()

                val isLocked = data.optBoolean("isLocked", false)
                val isLimitEnabled = screenTime.optBoolean("isLimitEnabled", false)

                // Clamp values to valid range
                val dailyLimitMinutesRaw = screenTime.optInt("dailyLimitMinutes", 0)
                val dailyLimitMinutes = max(0, min(dailyLimitMinutesRaw, MAX_MINUTES_PER_DAY))

                val extraMinutesRaw = screenTime.optInt("extraMinutesToday", 0)
                val extraMinutesToday = max(0, min(extraMinutesRaw, MAX_MINUTES_PER_DAY))

                // Save to PolicyStore (server is source of truth)
                PolicyStore.setServerLocked(context, isLocked)
                PolicyStore.setLimitEnabled(context, isLimitEnabled)
                PolicyStore.setDailyLimit(context, dailyLimitMinutes)
                PolicyStore.setExtraMinutes(context, extraMinutesToday)

                Log.d(
                    TAG,
                    "Policy synced: locked=$isLocked limitEnabled=$isLimitEnabled daily=$dailyLimitMinutes extra=$extraMinutesToday"
                )

            } catch (e: Exception) {
                Log.e(TAG, "Failed to fetch policy", e)
            } finally {
                connection?.disconnect()
                onFinished?.invoke()
            }
        }.start()
    }

    // Read both success and error responses safely
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