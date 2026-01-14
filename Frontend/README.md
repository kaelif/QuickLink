# QuickLink

A Tinder-like mobile app for matching climbing partners. Built with Expo (React Native) and Node.js/Express backend with PostgreSQL/Supabase.

## Features

- 🧗 Swipeable card interface for browsing climbing partners
- 📍 Location-based matching with distance filtering
- 🎯 Preference-based filtering (age, gender, climbing types)
- 💚 Match system for mutual likes
- 💬 Real-time messaging between matches
- 📱 Beautiful, modern React Native interface

## Tech Stack

### Frontend
- **Expo** - React Native framework
- **React Native** - Mobile app framework
- **TypeScript** - Type-safe JavaScript
- **React Navigation** - Navigation library
- **React Native Gesture Handler** - Swipe gestures
- **React Native Reanimated** - Animations

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Supabase/PostgreSQL** - Database
- **CORS** - Cross-origin resource sharing

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **Expo CLI** - `npm install -g expo-cli`
- **PostgreSQL** (v14 or higher) or **Supabase account** - [Download](https://www.postgresql.org/download/) or [Sign up](https://supabase.com/)
- **iOS Simulator** (for Mac) or **Android Emulator** - For testing

## Setup Instructions

### 1. Clone the Repository

```bash
cd QuickLink
```

### 2. Frontend Setup

#### 2.1 Install Dependencies

```bash
npm install
```

#### 2.2 Configure API Endpoint (if needed)

The frontend is configured to connect to `http://localhost:4000` by default. If your backend is running on a different address:

1. Open `src/Services/*.ts` files
2. Update the `BASE_URL` constant in each service file

**Note:** For physical devices (not simulator), you'll need to:
- Use your computer's IP address instead of `localhost`
- Ensure your computer and device are on the same network
- Make sure your firewall allows connections on port 4000

### 3. Backend Setup

#### 3.1 Install Dependencies

```bash
cd Backend
npm install
```

#### 3.2 Set Up Database

**Option A: Using Supabase (Recommended)**

1. Create a [Supabase account](https://supabase.com/)
2. Create a new project
3. Go to Settings → API to get your project URL and anon key
4. Run the SQL scripts from `Backend/db/` in the Supabase SQL Editor

**Option B: Using Local PostgreSQL**

1. Install PostgreSQL
2. Create a database: `psql -U postgres -c "CREATE DATABASE climblink;"`
3. Run the SQL scripts: `psql -U postgres -d climblink -f Backend/db/create_database.sql`

#### 3.3 Configure Environment Variables

Create a `.env` file in the `Backend` directory:

```env
# Supabase Configuration (if using Supabase)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# OR PostgreSQL Configuration (if using local PostgreSQL)
DATABASE_URL=postgresql://username:password@localhost:5432/climblink

# Server port
PORT=4000

# Environment
NODE_ENV=development
```

#### 3.4 Start the Backend Server

```bash
npm start
```

The server should start on `http://localhost:4000`. You should see:
```
QuickLink backend running on http://localhost:4000
```

**Test the API:**
```bash
curl http://localhost:4000/health
```

### 4. Run the Frontend

#### 4.1 Start Expo

```bash
# From the QuickLink root directory
npm start
```

This will open the Expo Dev Tools in your browser.

#### 4.2 Run on Simulator/Emulator

- **iOS Simulator**: Press `i` in the terminal or click "Run on iOS simulator" in Expo Dev Tools
- **Android Emulator**: Press `a` in the terminal or click "Run on Android device/emulator" in Expo Dev Tools

#### 4.3 Run on Physical Device

1. Install the **Expo Go** app on your device:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
2. Scan the QR code shown in the terminal or Expo Dev Tools
3. Make sure your device and computer are on the same network

## Running the Application

### Start Backend

```bash
cd Backend
npm start
```

### Start Frontend

```bash
# From QuickLink root directory
npm start
```

Then choose your platform (iOS, Android, or Web).

## Project Structure

```
QuickLink/
├── src/
│   ├── Models/          # Data models (TypeScript interfaces)
│   ├── Services/        # API service classes
│   ├── Views/           # React Native screens/components
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── Backend/
│   ├── db/              # Database SQL scripts
│   ├── src/
│   │   ├── config/      # Configuration files
│   │   ├── repositories/# Database query functions
│   │   └── routes/      # API route handlers
│   └── server.js        # Server entry point
├── App.tsx              # Main app component
└── package.json         # Frontend dependencies
```

## API Endpoints

### `GET /health`
Health check endpoint.

### `GET /getStack?deviceId=<deviceId>`
Returns a stack of profiles matching the user's criteria.

### `POST /swipes`
Record a swipe action (like or pass).

**Body:**
```json
{
  "swiperDeviceId": "string",
  "swipedProfileId": "string",
  "action": "like" | "pass"
}
```

### `GET /matches/:deviceId`
Get matches for a user (mutual likes).

### `GET /user/profile/:deviceId`
Get or create user profile.

### `PUT /user/profile/:deviceId`
Update user profile.

### `POST /messages`
Send a message.

### `GET /messages/conversation?deviceId1=<id1>&deviceId2=<id2>`
Get conversation between two users.

### `GET /messages/conversations/:deviceId`
Get all conversations for a user.

## Troubleshooting

### Backend Issues

**Database connection error:**
- Verify PostgreSQL/Supabase is running
- Check your `.env` file has the correct connection string
- Ensure the database exists
- Verify your credentials

**Port already in use:**
- Change the `PORT` in `.env` to a different port (e.g., 4001)
- Or kill the process: `lsof -ti:4000 | xargs kill`

### Frontend Issues

**Cannot connect to backend:**
- Ensure the backend server is running
- Check the `BASE_URL` in service files
- For physical devices, use your computer's IP address instead of `localhost`
- Verify both devices are on the same network

**Build errors:**
- Clear cache: `expo start -c`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check that you're using a compatible Node.js version

**No profiles showing:**
- Check backend logs for errors
- Verify database has data
- Test the API endpoint directly with `curl`

## Development

### Backend Development

```bash
cd Backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development

```bash
npm start  # Starts Expo dev server
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

[Add your license here]

## Support

For issues or questions, please open an issue on the repository.

