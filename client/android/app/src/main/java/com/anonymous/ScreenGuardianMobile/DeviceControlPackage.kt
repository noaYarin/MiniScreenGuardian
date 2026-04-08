package com.screenguardianmobile

/**
 * DeviceControlPackage
 *
 * This class is responsible for registering native modules with React Native.
 * It acts as a bridge entry point that tells React Native which native modules
 * are available on the Android side.
 *
 * Main responsibilities:
 * - Register all custom Native Modules (non-UI logic) so they can be accessed from JavaScript.
 * - Optionally register custom native UI components (ViewManagers), if needed.
 *
 * How it works:
 * - React Native calls createNativeModules() during app initialization.
 * - The returned list contains all native modules that will be exposed to JS.
 * - In this case, we register DeviceControlModule, which handles screen-time logic.
 *
 * UI components:
 * - createViewManagers() is used only if we build custom native UI views.
 * - Since this project does not include custom native UI components, it returns an empty list.
 *
 * Important:
 * - This package must be added to MainApplication.kt to be recognized by React Native.
 * - Without this registration, the DeviceControlModule would not be accessible from JS.
 */

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

// This class registers our native module so React Native can use it
class DeviceControlPackage : ReactPackage {

    // Register native modules (non-UI logic)
    override fun createNativeModules(
        reactContext: ReactApplicationContext
    ): List<NativeModule> {

        return listOf(
            DeviceControlModule(reactContext) // our module
        )
    }

    // We are not creating any custom native UI components
    override fun createViewManagers(
        reactContext: ReactApplicationContext
    ): List<ViewManager<*, *>> {
        return emptyList()
    }
}