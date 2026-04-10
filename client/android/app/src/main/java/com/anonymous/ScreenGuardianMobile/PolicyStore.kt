package com.screenguardianmobile

/**
 * PolicyStore
 *
 * This object is the local persistence layer for device policy and usage data.
 * It uses SharedPreferences to store and retrieve all enforcement-related data.
 *
 * Main responsibilities:
 * - Store policy data received from the server (lock state, limits).
 * - Store local usage data (used minutes, extra time).
 * - Provide calculated values (remaining time, effective limit).
 * - Decide whether the device should be locked.
 * - Support offline behavior when the server is unavailable.
 *
 * Architecture role:
 * - This is the single source of truth on the device.
 * - It allows the app to enforce restrictions even without network connectivity.
 * - It works together with:
 *   - DevicePolicySyncHelper (server → device)
 *   - DeviceServerSyncHelper (device → server)
 *
 * Key features:
 *
 * 1. Lock Management:
 *    - lockNow → manual lock triggered locally
 *    - serverLocked → lock triggered by backend
 *
 * 2. Screen Time Limits:
 *    - dailyLimit → base limit set by parent
 *    - extraMinutes → additional time granted (e.g. extension request)
 *    - effectiveLimit = dailyLimit + extraMinutes
 *
 * 3. Usage Tracking:
 *    - usedToday → minutes used today
 *    - automatically resets at the start of a new day
 *
 * 4. Daily Reset:
 *    - resetIfNewDay() ensures usage and extra time reset at midnight
 *    - based on device local time
 *
 * 5. Lock Decision Logic:
 *    shouldLockDevice() returns true if:
 *      - manual lock is active
 *      - server lock is active
 *      - OR limit is enabled AND usage reached the limit
 *
 * 6. Offline Support:
 *    - All data is stored locally
 *    - Device can enforce limits without server connection
 *    - Sync happens later when network is available
 *
 * Important notes:
 * - getRemainingMinutes() returns Int.MAX_VALUE if limit is disabled
 * - Values are clamped to avoid invalid states
 * - Always calls resetIfNewDay() before returning usage-related data
 *
 * Heartbeat configuration:
 * - Stores baseUrl, deviceId, token for server communication
 *
 * This class is critical for ensuring reliable and consistent behavior
 * across online and offline scenarios.
 */

import android.content.Context
import java.util.Calendar

object PolicyStore {

    private const val PREFS_NAME = "ScreenGuardianPolicy"

    private const val KEY_LOCK_NOW = "lockNow"
    private const val KEY_SERVER_LOCKED = "serverLocked"
    private const val KEY_LIMIT_ENABLED = "limitEnabled"
    private const val KEY_DAILY_LIMIT = "dailyLimit"
    private const val KEY_USED_TODAY = "usedToday"
    private const val KEY_EXTRA_MINUTES = "extraMinutes"
    private const val KEY_LAST_RESET = "lastReset"
    private const val KEY_BLOCK_REASON = "blockReason"

    private const val KEY_HEARTBEAT_BASE_URL = "heartbeatBaseUrl"
    private const val KEY_HEARTBEAT_DEVICE_ID = "heartbeatDeviceId"
    private const val KEY_HEARTBEAT_TOKEN = "heartbeatToken"

    private fun prefs(context: Context) =
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    // ---------- Lock State ----------

    fun setLockNow(context: Context, value: Boolean) {
        prefs(context).edit().putBoolean(KEY_LOCK_NOW, value).apply()
    }

    fun isLockNow(context: Context): Boolean {
        return prefs(context).getBoolean(KEY_LOCK_NOW, false)
    }

    fun setServerLocked(context: Context, value: Boolean) {
        prefs(context).edit().putBoolean(KEY_SERVER_LOCKED, value).apply()
    }

    fun isServerLocked(context: Context): Boolean {
        return prefs(context).getBoolean(KEY_SERVER_LOCKED, false)
    }

    // ---------- Limit ----------

    fun setLimitEnabled(context: Context, value: Boolean) {
        prefs(context).edit().putBoolean(KEY_LIMIT_ENABLED, value).apply()
    }

    fun isLimitEnabled(context: Context): Boolean {
        return prefs(context).getBoolean(KEY_LIMIT_ENABLED, false)
    }

    fun setDailyLimit(context: Context, minutes: Int) {
        prefs(context).edit().putInt(KEY_DAILY_LIMIT, minutes).apply()
    }

    fun getDailyLimit(context: Context): Int {
        return prefs(context).getInt(KEY_DAILY_LIMIT, 0)
    }

    // ---------- Usage ----------

    fun setUsedToday(context: Context, minutes: Int) {
        prefs(context).edit().putInt(KEY_USED_TODAY, minutes).apply()
    }

    fun getUsedToday(context: Context): Int {
        resetIfNewDay(context)
        return prefs(context).getInt(KEY_USED_TODAY, 0)
    }

    fun setExtraMinutes(context: Context, minutes: Int) {
        prefs(context).edit().putInt(KEY_EXTRA_MINUTES, minutes).apply()
    }

    fun addExtraMinutes(context: Context, minutes: Int) {
        val current = getExtraMinutes(context)
        val newValue = (current + minutes).coerceAtMost(600) 
        setExtraMinutes(context, newValue)
    }

    fun getExtraMinutes(context: Context): Int {
        resetIfNewDay(context)
        return prefs(context).getInt(KEY_EXTRA_MINUTES, 0)
    }

    // ---------- Block Reason ----------

    fun setBlockReason(context: Context, reason: String) {
        prefs(context).edit().putString(KEY_BLOCK_REASON, reason).apply()
    }

    fun getBlockReason(context: Context): String {
        return prefs(context).getString(KEY_BLOCK_REASON, "") ?: ""
    }

    // ---------- Reset ----------

    fun resetIfNewDay(context: Context) {
        val prefs = prefs(context)

        val calendar = Calendar.getInstance()
        calendar.set(Calendar.HOUR_OF_DAY, 0)
        calendar.set(Calendar.MINUTE, 0)
        calendar.set(Calendar.SECOND, 0)
        calendar.set(Calendar.MILLISECOND, 0)

        val todayStart = calendar.timeInMillis
        val lastReset = prefs.getLong(KEY_LAST_RESET, -1)

        if (lastReset < todayStart) { 
            prefs.edit()
                .putLong(KEY_LAST_RESET, todayStart)
                .putInt(KEY_USED_TODAY, 0)
                .putInt(KEY_EXTRA_MINUTES, 0)
                
                .apply()
        }
    }

    // ---------- Calculations ----------

    fun getEffectiveLimit(context: Context): Int {
        resetIfNewDay(context)
        return getDailyLimit(context) + getExtraMinutes(context)
    }

    fun getRemainingMinutes(context: Context): Int {
        resetIfNewDay(context)

        if (!isLimitEnabled(context)) {
            return Int.MAX_VALUE
        }

        val remaining = getEffectiveLimit(context) - getUsedToday(context)
        return remaining.coerceAtLeast(0) 
    }

    fun isLimitReached(context: Context): Boolean {
        return getRemainingMinutes(context) <= 0
    }

    fun shouldLockDevice(context: Context): Boolean {
        val manualLock = isLockNow(context)
        val serverLock = isServerLocked(context)
        val limitEnabled = isLimitEnabled(context)

        if (manualLock) return true
        if (serverLock) return true
        if (!limitEnabled) return false

        return isLimitReached(context)
    }

    // ---------- Heartbeat ----------

    fun setHeartbeatBaseUrl(context: Context, value: String) {
        prefs(context).edit().putString(KEY_HEARTBEAT_BASE_URL, value).apply()
    }

    fun getHeartbeatBaseUrl(context: Context): String? {
        return prefs(context).getString(KEY_HEARTBEAT_BASE_URL, null)
    }

    fun setHeartbeatDeviceId(context: Context, value: String) {
        prefs(context).edit().putString(KEY_HEARTBEAT_DEVICE_ID, value).apply()
    }

    fun getHeartbeatDeviceId(context: Context): String? {
        return prefs(context).getString(KEY_HEARTBEAT_DEVICE_ID, null)
    }

    fun setHeartbeatToken(context: Context, value: String) {
        prefs(context).edit().putString(KEY_HEARTBEAT_TOKEN, value).apply()
    }

    fun getHeartbeatToken(context: Context): String? {
        return prefs(context).getString(KEY_HEARTBEAT_TOKEN, null)
    }

    // ---------- Clear ----------

    fun clearAll(context: Context) {
        prefs(context).edit().clear().apply()
    }
}