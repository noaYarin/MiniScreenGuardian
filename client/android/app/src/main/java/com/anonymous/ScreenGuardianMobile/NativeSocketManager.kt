package com.screenguardianmobile

import android.content.Context
import android.util.Log
import io.socket.client.IO
import io.socket.client.Socket
import org.json.JSONObject

/**
 * NativeSocketManager
 *
 * This object is responsible for managing the native Socket.IO connection
 * on the Android side for the child device.
 *
 * Main responsibilities:
 * - Create and maintain a single socket connection
 * - Join the correct child room on the backend
 * - Listen for real-time policy updates from the server
 * - Listen for forced logout / device removal events
 * - Apply incoming policy updates to PolicyStore
 * - Trigger a callback so the service can immediately re-evaluate lock state
 *
 * Why this exists:
 * - HTTP policy sync is still kept as a fallback
 * - Socket allows important policy changes to arrive in real time
 *   without waiting for the next polling cycle
 *
 * Expected server-side events:
 * - "POLICY_UPDATED"
 *   Sent when the parent changes something that affects enforcement
 *   (lock/unlock, daily limit, extra minutes, blocked apps, etc.)
 *
 * - "FORCE_CHILD_LOGOUT"
 *   Sent when the child device should be disconnected or cleared
 *   (for example after device deletion / unlink)
 *
 * How it works:
 * 1. Reads baseUrl, childId, and parentId from PolicyStore
 * 2. Opens a socket connection if needed
 * 3. Emits JOIN_CHILD when connected
 * 4. Applies policy updates when POLICY_UPDATED arrives
 * 5. Clears local state when FORCE_CHILD_LOGOUT arrives
 *
 * Notes:
 * - This manager keeps only one socket instance at a time
 * - If already connected for the same child, it does nothing
 * - Reconnection is enabled through Socket.IO options
 * - This object does not calculate usage and does not enforce lock by itself
 *   It only updates local policy and notifies the caller
 */
object NativeSocketManager {

    private const val TAG = "NativeSocketManager"

    // Single active socket instance
    private var socket: Socket? = null

    // Tracks which child this socket is currently bound to
    private var boundChildId: String? = null

    /**
     * Ensures the socket is connected for the current child.
     *
     * If already connected for the same childId, nothing happens.
     * Otherwise, disconnects the previous socket (if any),
     * creates a new connection, and registers event listeners.
     *
     * @param context Used to read saved config from PolicyStore
     * @param onPolicyUpdated Optional callback invoked after policy changes arrive
     */
    fun ensureConnected(
        context: Context,
        onPolicyUpdated: (() -> Unit)?
    ) {
        val baseUrl = PolicyStore.getHeartbeatBaseUrl(context) ?: return
        val childId = PolicyStore.getChildId(context) ?: return
        val parentId = PolicyStore.getParentId(context) ?: return

        // Already connected for this child -> nothing to do
        if (socket?.connected() == true && boundChildId == childId) {
            return
        }

        // Clean previous connection before creating a new one
        disconnect()

        try {
            val options = IO.Options.builder()
                .setReconnection(true)
                .setForceNew(false)
                .build()

            socket = IO.socket(baseUrl.trimEnd('/'), options)
            boundChildId = childId

            // When socket connects, join the child room on the backend
            socket?.on(Socket.EVENT_CONNECT) {
                Log.d(TAG, "Socket connected")

                val payload = JSONObject().apply {
                    put("childId", childId)
                    put("parentId", parentId)
                }

                socket?.emit("JOIN_CHILD", payload)
            }

            // Real-time policy update from server
            socket?.on("POLICY_UPDATED") { args ->
                try {
                    val payload = args.firstOrNull() as? JSONObject ?: return@on

                    // Save incoming policy into local PolicyStore
                    DevicePolicySyncHelper.applyPolicyData(context, payload)

                    // Notify caller so it can re-evaluate lock immediately
                    onPolicyUpdated?.invoke()

                } catch (e: Exception) {
                    Log.e(TAG, "Failed to handle POLICY_UPDATED", e)
                }
            }

            // Forced logout / device unlink event
            socket?.on("FORCE_CHILD_LOGOUT") {
                try {
                    // Clear all locally cached policy/session state
                    PolicyStore.clearAll(context)

                    // Clear local usage sync cache as well
                    DeviceServerSyncHelper.clearSessionCache()

                    // Notify caller so it can react immediately
                    onPolicyUpdated?.invoke()

                } catch (e: Exception) {
                    Log.e(TAG, "Failed to handle FORCE_CHILD_LOGOUT", e)
                }
            }

            socket?.connect()

        } catch (e: Exception) {
            Log.e(TAG, "Socket connection failed", e)
        }
    }

    /**
     * Disconnects the current socket and clears local socket references.
     */
    fun disconnect() {
        try {
            socket?.off()
            socket?.disconnect()
        } catch (_: Exception) {
            // Ignore socket cleanup errors
        } finally {
            socket = null
            boundChildId = null
        }
    }

    /**
     * Returns true if the socket is currently connected.
     */
    fun isConnected(): Boolean {
        return socket?.connected() == true
    }
}