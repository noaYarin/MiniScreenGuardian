package com.screenguardianmobile

/**
 * MainApplication
 *
 * This is the main Application class for the Android app.
 * It is responsible for initializing the React Native runtime and configuring
 * the native environment when the app process starts.
 *
 * Main responsibilities:
 * - Create and configure the React Native host.
 * - Register all React Native packages used by the app.
 * - Manually register custom native packages such as DeviceControlPackage.
 * - Load the React Native engine when the application starts.
 * - Integrate Expo lifecycle handling with the Android application lifecycle.
 *
 * Architecture notes:
 * - This class extends Application and implements ReactApplication.
 * - ReactNativeHost defines how the React Native environment is created.
 * - PackageList(this).packages loads auto-linked packages.
 * - Custom packages that are not auto-linked must be added manually.
 *
 * Custom native integration:
 * - DeviceControlPackage is manually added here so React Native can access
 *   the custom native module DeviceControlModule from JavaScript.
 *
 * New Architecture:
 * - Supports React Native New Architecture through BuildConfig flags.
 * - Sets the release level dynamically based on the build configuration.
 *
 * Expo integration:
 * - Uses ReactNativeHostWrapper and ApplicationLifecycleDispatcher
 *   to support Expo modules and lifecycle events correctly.
 *
 * Lifecycle behavior:
 * - onCreate() initializes the React Native runtime.
 * - onConfigurationChanged() forwards configuration changes
 *   (such as orientation / locale changes) to Expo modules.
 */

import android.app.Application
import android.content.res.Configuration
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.ReactHost
import com.facebook.react.common.ReleaseLevel
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint
import com.facebook.react.defaults.DefaultReactNativeHost

import expo.modules.ApplicationLifecycleDispatcher
import expo.modules.ReactNativeHostWrapper

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost = ReactNativeHostWrapper(
      this,
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
            // Manually register our custom native package
            add(DeviceControlPackage())
            }

          override fun getJSMainModuleName(): String = ".expo/.virtual-metro-entry"

          override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

          override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
      }
  )

  override val reactHost: ReactHost
    get() = ReactNativeHostWrapper.createReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    DefaultNewArchitectureEntryPoint.releaseLevel = try {
      ReleaseLevel.valueOf(BuildConfig.REACT_NATIVE_RELEASE_LEVEL.uppercase())
    } catch (e: IllegalArgumentException) {
      ReleaseLevel.STABLE
    }
    loadReactNative(this)
    ApplicationLifecycleDispatcher.onApplicationCreate(this)
  }

  override fun onConfigurationChanged(newConfig: Configuration) {
    super.onConfigurationChanged(newConfig)
    ApplicationLifecycleDispatcher.onConfigurationChanged(this, newConfig)
  }
}
