package com.screenguardianmobile

/**
 * ScreenGuardianAccessibilityService
 *
 * This is the core enforcement engine of the application.
 * It runs as an Android AccessibilityService and is responsible for:
 * - Monitoring foreground app changes
 * - Evaluating lock state in real time
 * - Syncing policy from server
 * - Sending usage + heartbeat back to server
 * - Supporting realtime policy updates via socket
 *
 * Main responsibilities:
 *
 * 1. Real-time monitoring:
 *    - Listens to foreground app changes (TYPE_WINDOW_STATE_CHANGED)
 *    - Re-evaluates lock state when the visible app changes
 *
 * 2. Periodic sync loop:
 *    - Keeps a fallback sync from the backend
 *    - Updates usage stats in one central place only
 *    - Evaluates lock decision after latest data
 *    - Sends usage (only if changed) + heartbeat to server
 *
 * 3. Socket integration:
 *    - Tries to stay connected for real-time policy updates
 *    - Re-evaluates lock immediately when socket policy arrives
 *
 * 4. Lock enforcement:
 *    - Decides whether device should be locked using PolicyStore
 *    - Opens BlockScreenActivity if lock is required
 *
 * 5. Block logic:
 *    - Prevents blocking allowed/system apps (whitelist)
 *    - Uses debounce to avoid repeated lock triggers
 *    - Ensures only one blocking screen is shown at a time
 *
 * 6. Offline support:
 *    - Even without network, enforcement works using PolicyStore
 *    - Periodic sync remains as fallback if socket is unavailable
 *
 * Important notes:
 * - CHECK_INTERVAL_MS controls fallback sync frequency
 * - Usage is updated only from the periodic loop (not from every event)
 * - Socket does not replace local enforcement, it only updates policy faster
 */

import android.accessibilityservice.AccessibilityService
import android.content.Intent
import android.os.Handler
import android.os.Looper
import android.os.SystemClock
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import android.content.ComponentName
import android.provider.Settings
import android.content.Context

class ScreenGuardianAccessibilityService : AccessibilityService() {

    companion object {
        private const val TAG = "ScreenGuardianService"

        // Reduced polling frequency: keep fallback sync, but avoid aggressive 5-second loop
        private const val CHECK_INTERVAL_MS = 15000L

        // Prevent opening multiple lock screens in a very short time
        private const val LOCK_DEBOUNCE_MS = 2000L

        
     // Checks whether this accessibility service is currently enabled in Android settings
     fun isServiceEnabled(context: Context): Boolean {
        val expectedComponent = ComponentName(
            context,
            ScreenGuardianAccessibilityService::class.java
        ).flattenToString()

        val enabledServices = Settings.Secure.getString(
            context.contentResolver,
            Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
        ) ?: return false

        return enabledServices
            .split(':')
            .any { it.equals(expectedComponent, ignoreCase = true)
        }
    }
 }
    




    private val handler = Handler(Looper.getMainLooper())

    private var lastLockTime = 0L

    // Keep the last foreground package so we can re-evaluate lock after sync/socket updates
    private var lastForegroundPackage: String? = null

    // List of packages that should not be blocked
    private val allowedPackages = setOf(
        "com.screenguardianmobile",
        "com.google.android.dialer",
        "com.samsung.android.dialer",
        "com.android.dialer",
        "com.android.server.telecom",
        "com.android.incallui"
    )

    /**
     * Main periodic loop responsible for:
     * 1. Ensuring socket is connected (realtime path)
     * 2. Fetching latest policy from server (fallback path)
     * 3. Updating usage stats in one single place
     * 4. Evaluating lock state
     * 5. Syncing usage + heartbeat back to server
     */
    private val lockChecker = object : Runnable {
        override fun run() {
            try {
                // Reconnect socket if needed.
                // Socket is the preferred real-time path for policy updates.
                NativeSocketManager.ensureConnected(applicationContext) {
                    handler.post {
                        evaluateLock(lastForegroundPackage)
                    }
                }

                // Keep HTTP policy sync as fallback in case socket is unavailable
                DevicePolicySyncHelper.fetchAndSavePolicy(applicationContext) {
                    try {
                        // Do not keep recalculating usage while already blocked.
                        // This prevents unnecessary updates and inflated usage while block screen is active.
                        val shouldTrackUsage =
                            !PolicyStore.shouldLockDevice(applicationContext) &&
                            !BlockScreenActivity.isOpen

                        if (shouldTrackUsage) {
                            UsageStatsHelper.updateTodayUsage(applicationContext)
                        }

                        // Re-evaluate lock after latest policy + usage data
                        evaluateLock(lastForegroundPackage)

                        // Send usage only if it actually changed
                        DeviceServerSyncHelper.sendUsageIfChanged(applicationContext, 1)

                        // Heartbeat remains periodic
                        DeviceServerSyncHelper.sendHeartbeat(applicationContext)

                    } catch (e: Exception) {
                        Log.e(TAG, "Error after policy sync", e)
                    }
                }

            } catch (e: Exception) {
                Log.e(TAG, "Error in lockChecker", e)
            }

            // Schedule next fallback execution
            handler.postDelayed(this, CHECK_INTERVAL_MS)
        }
    }

    override fun onServiceConnected() {
        super.onServiceConnected()
        Log.d(TAG, "Accessibility service connected")

        // Connect realtime socket once service starts.
        // If a policy update arrives immediately, re-evaluate lock on main thread.
        NativeSocketManager.ensureConnected(applicationContext) {
            handler.post {
                evaluateLock(lastForegroundPackage)
            }
        }

        // Start fallback periodic loop
        handler.post(lockChecker)
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event == null) return
        if (event.eventType != AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) return

        val currentPackage = event.packageName?.toString()
        lastForegroundPackage = currentPackage

        Log.d(TAG, "Window changed: $currentPackage")

        try {
            // Do not update usage here.
            // Usage should be updated only from the periodic loop to avoid duplicated calculations.
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

        // Stop periodic loop
        handler.removeCallbacks(lockChecker)

        // Disconnect socket when service is destroyed
        NativeSocketManager.disconnect()
    }

    /**
     * Centralized lock decision logic.
     *
     * Important:
     * - This method reads already-saved state from PolicyStore
     * - It does NOT update usage itself anymore
     * - This keeps lock evaluation pure and avoids duplicated usage calculations
     */
    private fun evaluateLock(currentPackage: String?) {
        val now = SystemClock.elapsedRealtime()

        // Read current state from PolicyStore
        val usedToday = PolicyStore.getUsedToday(applicationContext)
        val remaining = PolicyStore.getRemainingMinutes(applicationContext)
        val dailyLimit = PolicyStore.getDailyLimit(applicationContext)
        val extraMinutes = PolicyStore.getExtraMinutes(applicationContext)

        val isLockNow = PolicyStore.isLockNow(applicationContext)
        val isServerLocked = PolicyStore.isServerLocked(applicationContext)
        val isLimitEnabled = PolicyStore.isLimitEnabled(applicationContext)

        // Determine block reason based on priority
        val blockReason = when {
            isLockNow -> "LOCK_NOW"
            isLimitEnabled && remaining <= 0 -> "DAILY_LIMIT_REACHED"
            isServerLocked -> "LOCK_NOW"
            else -> ""
        }

        // Persist block reason so BlockScreenActivity can show correct explanation
        PolicyStore.setBlockReason(applicationContext, blockReason)

        // Final decision from PolicyStore
        val shouldLock = PolicyStore.shouldLockDevice(applicationContext)

        Log.d(
            TAG,
            "used=$usedToday remaining=$remaining limit=$dailyLimit extra=$extraMinutes shouldLock=$shouldLock reason=$blockReason pkg=$currentPackage"
        )

        // No lock needed
        if (!shouldLock) return

        // Do not block whitelisted/system/self packages
        if (currentPackage != null && isPackageAllowed(currentPackage)) {
            Log.d(TAG, "Allowed package: $currentPackage")
            return
        }

        // Debounce repeated launches
        if (now - lastLockTime < LOCK_DEBOUNCE_MS) {
            Log.d(TAG, "Skipping lock (debounce)")
            return
        }

        // Avoid opening multiple block screens
        if (BlockScreenActivity.isOpen) {
            Log.d(TAG, "Block screen already open")
            return
        }

        lastLockTime = now

        val intent = Intent(this, BlockScreenActivity::class.java).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
            addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)

            putExtra("blockReason", blockReason)
            putExtra("usedTodayMinutes", usedToday)
            putExtra("dailyLimitMinutes", dailyLimit)
            putExtra("extraMinutes", extraMinutes)
        }

        Log.d(TAG, "Opening BlockScreenActivity")
        startActivity(intent)
    }

    /**
     * Check whether a package is safe to allow even when device is blocked.
     */
    private fun isPackageAllowed(packageName: String): Boolean {
        val selfPackage = applicationContext.packageName

        return packageName == selfPackage ||
            allowedPackages.contains(packageName)
    }
}
