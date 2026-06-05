# App Store & Google Play Submission Pipeline

Moving from a web prototype to a native mobile app requires strict adherence to deployment pipelines and app store guidelines.

## 1. Technical Build Pipeline (Expo Application Services - EAS)

We utilize Expo application services for seamless over-the-air (OTA) updates and cloud builds.

### Step 1: Initialize EAS
```bash
cd apps/mobile
eas build:configure
```

### Step 2: Configure `eas.json`
Define environments: Development (Simulator), Preview (TestFlight/Internal), Production (App Store).
```json
{
  "build": {
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "distribution": "store"
    }
  }
}
```

### Step 3: Trigger Builds
```bash
eas build --platform ios --profile production
eas build --platform android --profile production
```

## 2. Apple App Store Submission (iOS)

### Prerequisites
* Apple Developer Account ($99/yr)
* App Identifier (Bundle ID) mapped to your Expo config.
* Provisioning Profiles & Certificates (managed automatically by EAS).

### App Guidelines Compliance Focus (Saphira AI)
* **Microphone Permissions:** You **must** provide a crystal-clear `NSMicrophoneUsageDescription` in `app.json`. Wait until the user intends to speak before requesting permission. Example: *"Saphira requires microphone access to hear your voice commands and generate responses."*
* **In-App Purchases (IAP):** If you charge for subscriptions (Elite, Pro), Apple requires you to use their In-App Purchase system (and they take 15-30%). Stripe cannot be used for digital goods on the iOS app.
* **Content Moderation:** Since Saphira connects to an LLM, Apple will require proof of content filtering (NSFW/Hate speech blocks). Anthropic's Claude inherently handles this well, but you must note it in the review notes.

## 3. Google Play Store Submission (Android)

### Prerequisites
* Google Play Console Developer Account ($25 one-time)
* Android Keystore (managed automatically by EAS).

### App Guidelines Compliance Focus
* **Background Execution:** If Saphira listens for the "Okay Sophia" wake word while the app is backgrounded, it requires a Foreground Service declaration. Google scrutinizes this closely.
* **Billing System:** Like Apple, Google requires Google Play Billing for digital AI subscriptions. 

## 4. Over-The-Air (OTA) Updates
Fixing prompt logic or UI tweaks does not require full App Store reviews. Using Expo Updates:
```bash
eas update --branch production --message "Tuned Logic Agent prompt response time"
```
Users will receive the update the next time they open the app natively.
