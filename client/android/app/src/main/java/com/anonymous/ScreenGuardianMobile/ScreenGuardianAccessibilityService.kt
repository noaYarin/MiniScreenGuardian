package com.screenguardianmobile

/**
 * ScreenGuardianAccessibilityService
 *
 * This is the core enforcement engine of the application.
 * It runs as an Android AccessibilityService and is responsible for:
 * - Monitoring foreground app changes
 * - Tracking real-time usage
 * - Enforcing lock conditions
 * - Syncing with the backend periodically
 *
 * Main responsibilities:
 *
 * 1. Real-time monitoring:
 *    - Listens to window/app changes (TYPE_WINDOW_STATE_CHANGED)
 *    - Updates usage immediately when the foreground app changes
 *
 * 2. Periodic sync loop:
 *    - Fetch latest policy from server (DevicePolicySyncHelper)
 *    - Update usage stats (UsageStatsHelper)
 *    - Evaluate lock decision
 *    - Send usage + heartbeat to server (DeviceServerSyncHelper)
 *
 * 3. Lock enforcement:
 *    - Decides whether device should be locked using PolicyStore
 *    - Opens BlockScreenActivity if lock is required
 *
 * 4. Block logic:
 *    - Prevents blocking allowed/system apps (whitelist)
 *    - Uses debounce to avoid repeated lock triggers
 *    - Ensures only one blocking screen is shown at a time
 *
 * 5. Offline support:
 *    - Even without network, enforcement works using PolicyStore
 *    - Sync resumes when connection is restored
 *
 * Key concepts:
 *
 * - Event-driven logic (onAccessibilityEvent)
 * - Polling loop (Handler + Runnable)
 * - Local decision making (PolicyStore.shouldLockDevice)
 *
 * Lock conditions:
 * - Manual lock (lockNow)
 * - Server lock (serverLocked)
 * - Daily limit reached (remaining <= 0)
 *
 * Important notes:
 * - CHECK_INTERVAL_MS controls sync frequency
 * - LOCK_DEBOUNCE_MS prevents rapid multiple launches
 * - Allowed packages prevent blocking critical apps (dialer, own app)
 *
 * This class is the heart of the parental control enforcement system.
 */

import android.accessibilityservice.AccessibilityService
import android.content.Intent
import android.os.Handler
import android.os.Looper
import android.os.SystemClock
import android.util.Log
import android.view.accessibility.AccessibilityEvent

class ScreenGuardianAccessibilityService : AccessibilityService() {

    companion object {
        private const val TAG = "ScreenGuardianService"
        private const val CHECK_INTERVAL_MS = 5000L // Interval for periodic sync loop
        private const val LOCK_DEBOUNCE_MS = 2000L // Prevent multiple lock triggers in short time
    }

    private val handler = Handler(Looper.getMainLooper())

    private var lastLockTime = 0L

    // List of packages that should not be blocked (e.g. dialer, system UI, own app)
    private val allowedPackages = setOf(
        "com.screenguardianmobile",
        "com.google.android.dialer",
        "com.samsung.android.dialer",
        "com.android.dialer",
        "com.android.server.telecom",
        "com.android.incallui"
    )

    // Main periodic loop responsible for:
    // 1. Fetching latest policy from server
    // 2. Updating usage stats
    // 3. Evaluating lock state
    // 4. Syncing data back to server
    private val lockChecker = object : Runnable {
        override fun run() {
            try {
                DevicePolicySyncHelper.fetchAndSavePolicy(applicationContext) {
                    try {
                        // Update today's usage from UsageStatsManager
                        UsageStatsHelper.updateTodayUsage(applicationContext)

                        // Evaluate lock decision after latest data
                        evaluateLock(null)

                        // Sync usage and heartbeat to server
                        DeviceServerSyncHelper.sendUsage(applicationContext)
                        DeviceServerSyncHelper.sendHeartbeat(applicationContext)

                    } catch (e: Exception) {
                        Log.e(TAG, "Error after policy sync", e)
                    }
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error in lockChecker", e)
            }

            // Schedule next execution
            handler.postDelayed(this, CHECK_INTERVAL_MS)
        }
    }

    override fun onServiceConnected() {
        super.onServiceConnected()
        Log.d(TAG, "Accessibility service connected")

        // Start periodic loop
        handler.post(lockChecker)
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event == null) return
        if (event.eventType != AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) return

        val currentPackage = event.packageName?.toString()
        Log.d(TAG, "Window changed: $currentPackage")

        try {
            // Update usage immediately when app changes
            UsageStatsHelper.updateTodayUsage(applicationContext)

            // Evaluate lock based on current foreground app
            evaluateLock(currentPackage)

        } catch (e: Exception) {
            Log.e(TAG, "Error in accessibility event", e)
        }
    }

    override fun onInterrupt() {
        Log.d(TAG, "Accessibility service interrupted")
    }

    override fun onDestroy() {
        super.onDestroy()

        // Stop periodic loop when service is destroyed
        handler.removeCallbacks(lockChecker)
    }

    // Centralized lock decision logic
    // This method determines whether the device should be locked
    private fun evaluateLock(currentPackage: String?) {

        val now = SystemClock.elapsedRealtime()

        // Retrieve current state from PolicyStore
        UsageStatsHelper.updateTodayUsage(applicationContext)

        val usedToday = PolicyStore.getUsedToday(applicationContext)
        val remaining = PolicyStore.getRemainingMinutes(applicationContext)
        val dailyLimit = PolicyStore.getDailyLimit(applicationContext)
        val extraMinutes = PolicyStore.getExtraMinutes(applicationContext)

        val isLockNow = PolicyStore.isLockNow(applicationContext)
        val isServerLocked = PolicyStore.isServerLocked(applicationContext)
        val isLimitEnabled = PolicyStore.isLimitEnabled(applicationContext)

        // Determine block reason based on priority
        val blockReason = when {
            isLockNow || isServerLocked -> "LOCK_NOW"
            isLimitEnabled && remaining <= 0 -> "DAILY_LIMIT_REACHED"
            else -> ""
        }

        // Persist block reason for UI usage
        PolicyStore.setBlockReason(applicationContext, blockReason)

        // Final decision if device should be locked
        val shouldLock = PolicyStore.shouldLockDevice(applicationContext)

        Log.d(
            TAG,
            "used=$usedToday remaining=$remaining limit=$dailyLimit extra=$extraMinutes shouldLock=$shouldLock reason=$blockReason pkg=$currentPackage"
        )

        // If no lock is required, exit early
        if (!shouldLock) return

        // Do not block allowed/system packages
        if (currentPackage != null && isPackageAllowed(currentPackage)) {
            Log.d(TAG, "Allowed package: $currentPackage")
            return
        }

        // Debounce to avoid rapid repeated launches
        if (now - lastLockTime < LOCK_DEBOUNCE_MS) {
            Log.d(TAG, "Skipping lock (debounce)")
            return
        }

        // Prevent opening multiple instances of block screen
        if (BlockScreenActivity.isOpen) {
            Log.d(TAG, "Block screen already open")
            return
        }

        lastLockTime = now

        // Launch blocking UI
        val intent = Intent(this, BlockScreenActivity::class.java).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
            addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)

            // Pass relevant data to UI
            putExtra("blockReason", blockReason)
            putExtra("usedTodayMinutes", usedToday)
            putExtra("dailyLimitMinutes", dailyLimit)
            putExtra("extraMinutes", extraMinutes)
        }

        Log.d(TAG, "Opening BlockScreenActivity")
        startActivity(intent)
    }

    // Check if package is allowed (whitelisted)
    private fun isPackageAllowed(packageName: String): Boolean {
    val selfPackage = applicationContext.packageName

    return packageName == selfPackage ||
           allowedPackages.contains(packageName)
   }


}