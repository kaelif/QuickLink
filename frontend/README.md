# QuickLink

**Find climbing partners.** A Tinder-style app for rock climbers to discover potential partners. Swipe through profiles, see how far away other climbers are, and view their climbing styles (sport, bouldering, trad) and bios.

## What it does

- **Swipe stack**: Browse climber profiles with a card stack. Swipe left to pass, right to like, or use the X and check buttons.
- **Distance**: Shows how far each person is from you (e.g. “5 km away”) using your device location. Exact locations are not shown.
- **Profile detail**: Tap a card to open a full profile with multiple photos, full bio, and climbing types.
- **Edit profile**: Set your own bio, photos (URLs), gender, climbing types, age preferences, and who you’d like to see (gender preferences). Profile is saved locally on the device.

The app uses dummy data (well-known climbers with real photos from Wikimedia Commons) so you can try the flow without a backend.

## Prerequisites

- **Node.js** (v18 or newer) and **npm**
- For **mobile**: the **Expo Go** app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
- Optional: **Xcode** (Mac) for iOS Simulator, or **Android Studio** for Android Emulator

## First-time setup

### 1. Clone and install

```bash
cd frontend
npm install
```

### 2. Start the dev server

```bash
npm start
```

A terminal UI will open. You’ll see a QR code and options to open the app in a browser or in a simulator.

---

## Running on desktop (web)

1. Run `npm start`, then press **`w`** in the terminal to open the app in your browser.
2. Or run:

   ```bash
   npm run web
   ```

3. The app will open at a URL like `http://localhost:8081`.  
   **Note:** Location-based distance may be limited or simulated in the browser.

---

## Running on a mobile device (first time)

### Option A: Expo Go (easiest)

1. Install **Expo Go** on your phone from the App Store (iOS) or Play Store (Android).
2. On your computer, run `npm start` in the project folder.
3. **iOS**: Open the Camera app and scan the QR code shown in the terminal.  
   **Android**: Open the Expo Go app and tap “Scan QR code,” then scan the code.
4. Your phone and computer must be on the same Wi‑Fi network. If it fails, try the “Tunnel” option in the terminal (press `s` to switch connection type).
5. When the app loads, allow **location** when prompted so distance (“X km away”) works.

### Option B: iOS Simulator (Mac only)

1. Install Xcode from the Mac App Store (includes the iOS Simulator).
2. Run `npm start`, then press **`i`** in the terminal.
3. The app opens in the simulator. To simulate location: in the simulator menu, **Features → Location** and choose a preset or custom location.

### Option C: Android Emulator

1. Install [Android Studio](https://developer.android.com/studio) and set up an Android Virtual Device (AVD).
2. Start the emulator, then run `npm start` and press **`a`** in the terminal.
3. The app opens in the emulator. You can set a mock location in the emulator’s Extended controls (e.g. “…” menu → Location).

---

## Scripts

| Command        | Description                    |
|----------------|--------------------------------|
| `npm start`    | Start Expo dev server          |
| `npm run web`  | Start and open in browser      |
| `npm run ios`  | Start and open iOS simulator   |
| `npm run android` | Start and open Android emulator |
| `npm run lint` | Run ESLint                     |

---

## Tech stack

- **Expo** (SDK 54) with **React Native**
- **expo-router** for file-based routing
- **react-native-gesture-handler** and **react-native-reanimated** for swipe gestures
- **expo-location** for distance from current location
- **expo-image** for images; **AsyncStorage** for saving the user’s edit profile
