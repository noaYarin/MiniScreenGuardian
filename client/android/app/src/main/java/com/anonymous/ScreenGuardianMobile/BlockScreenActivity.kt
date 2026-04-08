package com.screenguardianmobile

/**
 * BlockScreenActivity
 *
 * This Activity represents a full-screen blocking UI that is displayed on the child's device
 * when access should be restricted based on parental control policies.
 *
 * Main responsibilities:
 * - Show a lock screen when the device is blocked (either manually by parent or due to daily limit).
 * - Display the reason for blocking (LOCK_NOW / DAILY_LIMIT_REACHED / default).
 * - Present usage information (used time vs allowed time) when relevant.
 * - Prevent the user from exiting the screen (disables back button and uses immersive mode).
 * - Continuously monitor the device policy and automatically close the screen when the device is unlocked.
 *
 * Key behaviors:
 * - Uses PolicyStore.shouldLockDevice() to determine if the device should remain blocked.
 * - Runs a periodic check (every 1 second) to detect unlock state.
 * - Supports dynamic updates via onNewIntent (e.g., when policy changes while screen is open).
 * - Uses a static flag (isOpen) to indicate whether the block screen is currently active.
 *
 *
 */
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.TextView
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity

class BlockScreenActivity : AppCompatActivity() {

    companion object {
        @Volatile
        var isOpen: Boolean = false
    }

    private lateinit var titleText: TextView
    private lateinit var messageText: TextView
    private lateinit var hintText: TextView
    private lateinit var timeDetailsText: TextView
    private lateinit var iconText: TextView

    private var isMonitoring = false // prevent multiple loops

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        window.decorView.systemUiVisibility = (
                View.SYSTEM_UI_FLAG_FULLSCREEN
                        or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                )

        setContentView(R.layout.activity_block_screen)

        // Disable back button while blocked
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                // Block back navigation
            }
        })

        bindViews()
        updateUIFromIntent(intent)

      
    }

    override fun onResume() {
        super.onResume()
        isOpen = true
        startMonitoringUnlockState()
    }

  override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    setIntent(intent)
    updateUIFromIntent(intent)
  }

    override fun onStop() {
        super.onStop()
        isOpen = false
        isMonitoring = false // stop loop
    }

    override fun onDestroy() {
        super.onDestroy()
        isOpen = false
        isMonitoring = false
    }

    private fun bindViews() {
        titleText = findViewById(R.id.titleText)
        messageText = findViewById(R.id.messageText)
        hintText = findViewById(R.id.hintText)
        timeDetailsText = findViewById(R.id.timeDetailsText)
        iconText = findViewById(R.id.iconText)
    }

    private fun updateUIFromIntent(intent: Intent) {
        val blockReason = intent.getStringExtra("blockReason") ?: ""
        val usedToday = intent.getIntExtra("usedTodayMinutes", 0)
        val dailyLimit = intent.getIntExtra("dailyLimitMinutes", 0)
        val extraMinutes = intent.getIntExtra("extraMinutes", 0)

        val effectiveLimit = dailyLimit + extraMinutes

        when (blockReason) {

            //  Full lock → no buttons, no usage
            "LOCK_NOW" -> {
                iconText.text = "🔒"
                titleText.text = "Device locked by parent"
                messageText.text = "This device has been locked by your parent."
                hintText.text = "Please wait until your parent unlocks it."

                timeDetailsText.visibility = View.GONE
            }

            //  Daily limit → show usage + request button
            "DAILY_LIMIT_REACHED" -> {
                iconText.text = "⏳"
                titleText.text = "Daily screen time limit reached"
                messageText.text = "You have used all your screen time for today."
                hintText.text =  "Please wait until tomorrow or until your parent unlocks the device."

                timeDetailsText.visibility = View.VISIBLE
                timeDetailsText.text = "Used today: $usedToday / $effectiveLimit minutes"

            }

            //  Default block
            else -> {
                iconText.text = "⛔"
                titleText.text = "Device is currently blocked"
                messageText.text = "Access is temporarily restricted."
                hintText.text = "Please try again later."

                timeDetailsText.visibility = View.GONE
            }
        }
    }

    //  Auto-close when unlocked (safe loop)
    private fun startMonitoringUnlockState() {
        if (isMonitoring) return
        isMonitoring = true

        checkUnlockLoop()
    }

    private fun checkUnlockLoop() {
        window.decorView.postDelayed({
            if (!isMonitoring) return@postDelayed

            if (!PolicyStore.shouldLockDevice(this)) {
                finish()
                return@postDelayed
            }

            checkUnlockLoop()
        }, 1000)
    }


}