# QuickLink

**Find climbing partners.** A Tinder-style **mobile app** for rock climbers to discover potential partners. Swipe through profiles, see how far away other climbers are, and view their climbing styles (sport, bouldering, trad) and bios. iOS and Android only (Expo Go or native build).

## What it does

- **Swipe stack**: Browse climber profiles with a card stack. Swipe left to pass, right to like, or use the X and check buttons.
- **Distance**: Shows how far each person is from you (e.g. “5 km away”) using your device location. Exact locations are not shown.
- **Profile detail**: Tap a card to open a full profile with multiple photos, full bio, and climbing types.
- **Edit profile**: Set your own bio, photos (URLs), gender, and climbing types. Profile is saved locally on the device.
- **Filter**: From the main screen, filter who you see by age range, gender (show me: women, men, non-binary, everyone), and climbing types (match with climbers who do any of the selected types). Filter is saved locally.

The app uses dummy data (well-known climbers with real photos from Wikimedia Commons) so you can try the flow without a backend.

## Prerequisites

- **Node.js** (v18 or newer) and **npm**
- **Expo Go** on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)) — or **Xcode** (Mac) for iOS Simulator, or **Android Studio** for Android Emulator

## First-time setup

### 1. Clone and install

```bash
cd frontend
npm install
```

### 2. Start the app (mobile)

```bash
npm start
```

A terminal UI opens with a QR code and options. The app talks to **Supabase directly** from the device; no backend server is required.

- **On your phone:** Install Expo Go, then scan the QR code (iOS Camera or Android Expo Go). Your phone and computer must be on the same Wi‑Fi. If you see “Could not connect to development server,” run **`npm run start:tunnel`** instead.
- **iOS Simulator (Mac):** Press **`i`** in the terminal after `npm start`.
- **Android Emulator:** Start the emulator, run `npm start`, then press **`a`** in the terminal.

When the app loads on a device, allow **location** when prompted so distance (“X km away”) works.

---

## Scripts

| Command              | Description                                  |
|----------------------|----------------------------------------------|
| `npm start`          | Start Expo (QR code, simulators)             |
| `npm run start:tunnel` | Start with tunnel (phone on different network) |
| `npm run ios`        | Start and open iOS simulator                 |
| `npm run android`    | Start and open Android emulator              |
| `npm run lint`       | Run ESLint                                   |

---

## Tech stack

- **Expo** (SDK 54) with **React Native**
- **expo-router** for file-based routing
- **react-native-gesture-handler** and **react-native-reanimated** for swipe gestures
- **expo-location** for distance from current location
- **expo-image** for images; **AsyncStorage** for saving the user’s edit profile
