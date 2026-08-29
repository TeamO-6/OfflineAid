# OfflineAid

**Disaster Relief Coordination Without Internet**

OfflineAid is a local-first, peer-to-peer disaster relief coordination application built for hackathons (like SIH 2026). During natural disasters, internet infrastructure is often compromised. OfflineAid allows relief workers and affected individuals to coordinate emergency requests and sync data seamlessly using mesh networking principles, even when completely offline.

## Core Features

- **Offline First**: All data is stored locally via SQLite (`expo-sqlite`). No internet connection is required to create or view requests.
- **Emergency Requests**: Create critical requests for Medical aid, Water, Food, Shelter, and Rescue.
- **Mesh Network Simulation**: Includes a full Demo Mode that simulates peer-to-peer data synchronization (`SimulatedPeerTransport`).
- **Conflict Resolution**: Implements CRDT-inspired deterministic conflict resolution to merge requests when devices sync up.
- **Map View**: View local and synchronized requests on a geographic map.

## Tech Stack

- **Framework**: React Native with Expo (SDK 57)
- **Navigation**: React Navigation (Bottom Tabs & Native Stack)
- **Database**: SQLite (Local persistence)
- **Styling**: Custom Theme (`config/theme.ts`) with Lucide Icons

## Running the Project

Since this project targets Expo SDK 57, you can run it via Android Studio or EAS Build.

### Local Android Build (Recommended)

If you have Android Studio installed:

```bash
npx expo run:android
```
This will compile the native Android application and install it directly onto your connected device or emulator.

### Using Expo Development Client

Start the dev server:

```bash
npx expo start
```

## Project Structure

- `src/components/`: Reusable UI components (Buttons, Cards)
- `src/config/`: App branding and theme configuration
- `src/database/`: SQLite schema, initialization, and Repositories
- `src/models/`: TypeScript interfaces and types
- `src/navigation/`: AppNavigator defining tabs and screens
- `src/screens/`: Feature screens (Dashboard, Map, Mesh Network, etc.)
- `src/services/`: P2P Sync Manager and Conflict Resolver

## Hackathon Demo Mode

During a pitch, go to the **Mesh** tab to use the **Demo Controls**.
This allows you to simulate scanning for nearby devices, connecting to peers, and manually forcing a synchronization event without needing multiple physical devices.

---
*Built for SIH 2026.*
