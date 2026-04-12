package com.screenguardianmobile

import android.content.Context
import android.os.Handler
import android.os.Looper
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

    /**
     * Applies policy data from the backend payload into PolicyStore.
     *
     * This method is shared by:
     * - HTTP policy sync
     * - future socket-based policy updates
     *
     * Expected payload shape:
     * {
     *   "isLocked": true/false,
     *   "screenTime": {
     *      "isLimitEnabled": true/false,
     *      "dailyLimitMinutes": number,
     *      "extraMinutesToday": number
     *   }
     * }
     */
    fun applyPolicyData(context: Context, data: JSONObject) {
        val screenTime = data.optJSONObject("screenTime") ?: JSONObject()

        val isLocked = data.optBoolean("isLocked", false)
        val isLimitEnabled = screenTime.optBoolean("isLimitEnabled", false)

        val dailyLimitMinutesRaw = screenTime.optInt("dailyLimitMinutes", 0)
        val dailyLimitMinutes = max(0, min(dailyLimitMinutesRaw, MAX_MINUTES_PER_DAY))

        val extraMinutesRaw = screenTime.optInt("extraMinutesToday", 0)
        val extraMinutesToday = max(0, min(extraMinutesRaw, MAX_MINUTES_PER_DAY))

        PolicyStore.setServerLocked(context, isLocked)
        PolicyStore.setLimitEnabled(context, isLimitEnabled)
        PolicyStore.setDailyLimit(context, dailyLimitMinutes)
        PolicyStore.setExtraMinutes(context, extraMinutesToday)

        Log.d(
            TAG,
            "Policy applied: locked=$isLocked limitEnabled=$isLimitEnabled daily=$dailyLimitMinutes extra=$extraMinutesToday"
        )
    }

    fun fetchAndSavePolicy(
        context: Context,
        onFinished: (() -> Unit)? = null
    ) {
        val baseUrl = PolicyStore.getHeartbeatBaseUrl(context)
        val deviceId = PolicyStore.getHeartbeatDeviceId(context)
        val token = PolicyStore.getHeartbeatToken(context)

        if (baseUrl.isNullOrBlank() || deviceId.isNullOrBlank() || token.isNullOrBlank()) {
            finishOnMain(onFinished)
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

                applyPolicyData(context, data)

            } catch (e: Exception) {
                Log.e(TAG, "Failed to fetch policy", e)
            } finally {
                connection?.disconnect()
                finishOnMain(onFinished)
            }
        }.start()
    }

    private fun finishOnMain(onFinished: (() -> Unit)?) {
        if (onFinished == null) return

        if (Looper.myLooper() == Looper.getMainLooper()) {
            onFinished.invoke()
        } else {
            Handler(Looper.getMainLooper()).post {
                onFinished.invoke()
            }
        }
    }

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