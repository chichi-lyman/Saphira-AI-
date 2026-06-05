# Capacitor Android Configuration Manifest

Saphira ASI relies on cross-platform native hooks to maintain system presence across mobile architectures under the Nova Umbrella.

## 1. Initial Injection steps

Run the following commands in the terminal to initialize the Android build pipeline:
```bash
npx cap init com.saphira.ai "Saphira ASI" --web-dir dist
npx cap add android
```

## 2. Dependency Injection (Capacitor Plugins)
We must inject system-level networking and haptics to tie into Saphira's circuit breaker and telemetry:

```bash
npm install @capacitor/network @capacitor/haptics @capacitor/status-bar
npx cap sync android
```

## 3. Android Manifest Architectonics (`android/app/src/main/AndroidManifest.xml`)

We must patch the `AndroidManifest.xml` to allow cleartext traffic (for local sandbox routing in dev) and ensure proper deep linking for authorization handles:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.saphira.ai">

    <!-- Permissions for Saphira's Telemetry and Sync -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.VIBRATE" /> <!-- For Circuit Trip Feedback -->

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="true"> <!-- Required for Saphira's dev loops -->

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:label="@string/title_activity_main"
            android:theme="@style/AppTheme.NoActionBarLaunch">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

## 4. Native Bridge Execution

Once the structural assets are compiled:
```bash
npm run build
npx cap sync android
npx cap open android
```
From Android Studio, compile the bundle and run on an emulator to verify Saphira's liquid glassmorphic React design translates efficiently into the native Webview.
