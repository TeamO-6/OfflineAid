<div align="center">
  <h1>🚨 OfflineAid</h1>
  <p><strong>Disaster Relief Coordination Without Internet</strong></p>
  <p>
    <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
    <img src="https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
    <img src="https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
  </p>
</div>

## 🌍 The Problem

During natural disasters, internet infrastructure is often the first thing to fail. Relief workers and affected individuals are left completely disconnected, unable to coordinate emergency requests, distribute supplies, or report critical needs.

## 💡 The Solution

**OfflineAid** is a local-first, peer-to-peer disaster relief coordination application. It empowers relief workers to create and manage emergency requests entirely offline, and uses **Mesh Networking** principles to synchronize data between devices when they come into close proximity.

### 🚀 Key Features

- **100% Offline Capability**: Built on an `expo-sqlite` foundation. Zero internet required to function.
- **P2P Synchronization Engine**: Custom CRDT-inspired Conflict Resolver merges decentralized data flawlessly when devices connect.
- **Emergency Triage**: Categorize requests by priority (Critical, High, Medium, Low) and type (Medical, Water, Food, Shelter).
- **Geospatial Mapping**: Integrated `react-native-maps` to plot local and synchronized emergency requests geographically.

## 🏗 Architecture

Our system relies on a decentralized, eventually-consistent architecture:

1. **Data Layer**: Local `SQLite` database persisting all states on the device.
2. **Sync Layer**: A `SyncManager` that listens for peer connections and broadcasts deltas.
3. **Resolution Layer**: Deterministic vector-clock style versioning ensuring that the most recent updates propagate correctly across the mesh.

## 💻 Tech Stack

- **Frontend**: React Native, Expo (SDK 57)
- **Navigation**: React Navigation (Bottom Tabs & Native Stack)
- **Database**: SQLite (Local persistence)
- **Icons & UI**: Lucide React Native, Custom Design System

## 🛠 Local Setup & Running

To run the project locally via Expo and EAS:

```bash
# Install dependencies
npm install

# Run the application locally (Android)
npx expo run:android
```

## 🏆 Built for SIH 2026

This project was developed for the Smart India Hackathon 2026. It serves as a proof of concept for decentralized emergency response software that can save lives when traditional infrastructure fails.
