package com.screenguardianmobile


/**
 * DeviceControlModule
 *
 * This is a React Native Native Module that acts as a bridge between the JavaScript (React Native)
 * layer and the native Android layer.
 *
 * Main responsibilities:
 * - Expose native device control and screen-time functionality to the React Native app.
 * - Allow the client (parent/child app) to control device policies such as locking, limits, and extensions.
 * - Provide real-time device state data (usage, limits, lock status) back to the JS layer.
 *
 * Key features:
 * - Lock / Unlock device instantly (lockNow / unlockNow)
 * - Set daily screen time limits
 * - Approve extra screen time (extensions)
 * - Sync policy from server to local device (syncPolicyNow)
 * - Save heartbeat configuration for background communication with the server
 * - Retrieve current usage and remaining time (getRemainingTime)
 *
 * Architecture notes:
 * - Uses PolicyStore (SharedPreferences) to persist local policy state on device.
 * - Uses UsageStatsHelper to calculate actual device usage.
 * - Uses DevicePolicySyncHelper to fetch updated policy from backend.
 *
 * Communication:
 * - All methods are exposed to React Native via @ReactMethod.
 * - Results are returned using Promise (resolve / reject).
 *
 * Important:
 * - This module enables offline enforcement of screen-time rules (based on locally stored policy).
 * - It is critical for syncing between server policy and native enforcement logic.
 */

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class DeviceControlModule(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "DeviceControl"
    }

    @ReactMethod
    fun lockNow(promise: Promise) {
        try {
            PolicyStore.setLockNow(reactApplicationContext, true)
            PolicyStore.setBlockReason(reactApplicationContext, "LOCK_NOW")
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("LOCK_NOW_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun unlockNow(promise: Promise) {
        try {
            PolicyStore.setLockNow(reactApplicationContext, false)
            PolicyStore.setBlockReason(reactApplicationContext, "")
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("UNLOCK_NOW_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun setDailyLimit(minutes: Int, promise: Promise) {
        try {
            PolicyStore.setDailyLimit(reactApplicationContext, minutes)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("SET_DAILY_LIMIT_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun approveExtraMinutes(minutes: Int, promise: Promise) {
        try {
            PolicyStore.addExtraMinutes(reactApplicationContext, minutes)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("APPROVE_EXTRA_MINUTES_ERROR", e.message, e)
        }
    }


   @ReactMethod
  fun saveHeartbeatConfig(
    baseUrl: String,
    deviceId: String,
    childToken: String,
    childId: String,
    parentId: String,
    promise: Promise
   ) {
    try {
        PolicyStore.setHeartbeatBaseUrl(reactApplicationContext, baseUrl)
        PolicyStore.setHeartbeatDeviceId(reactApplicationContext, deviceId)
        PolicyStore.setHeartbeatToken(reactApplicationContext, childToken)
        PolicyStore.setChildId(reactApplicationContext, childId)
        PolicyStore.setParentId(reactApplicationContext, parentId)

        promise.resolve(true)
    } catch (e: Exception) {
        promise.reject("SAVE_HEARTBEAT_CONFIG_ERROR", e.message, e)
    }
  }

   
    @ReactMethod
    fun syncPolicyNow(promise: Promise) {
        try {
            DevicePolicySyncHelper.fetchAndSavePolicy(reactApplicationContext)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("SYNC_POLICY_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun getRemainingTime(promise: Promise) {
        try {

            val result = Arguments.createMap().apply {
                putInt("dailyLimitMinutes", PolicyStore.getDailyLimit(reactApplicationContext))
                putInt("usedTodayMinutes", PolicyStore.getUsedToday(reactApplicationContext))
                putInt("extraMinutes", PolicyStore.getExtraMinutes(reactApplicationContext))
                putInt("remainingMinutes", PolicyStore.getRemainingMinutes(reactApplicationContext))
                putBoolean("lockNow", PolicyStore.isLockNow(reactApplicationContext))
                putBoolean("shouldLock", PolicyStore.shouldLockDevice(reactApplicationContext))
                putBoolean("limitEnabled", PolicyStore.isLimitEnabled(reactApplicationContext))
            }

            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("GET_REMAINING_TIME_ERROR", e.message, e)
        }
    }
}