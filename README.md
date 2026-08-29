# OfflineAid

An app for disaster relief coordination that works without the internet. Built for the SIH 2026 hackathon.

## What it does

When cell towers go down during a natural disaster, relief workers still need to coordinate and rescue people. 

OfflineAid lets users log emergency requests (like food, water, or medical help) completely offline. When two phones running the app get close to each other, they automatically sync their databases using a peer-to-peer mesh network. This way, critical information hops from phone to phone and eventually spreads across the disaster zone without ever needing cell service or wifi.

## Features

- **Offline First**: The app works without an internet connection using local SQLite storage.
- **Peer-to-Peer Sync**: Phones share data directly with each other to merge requests.
- **Emergency Tracking**: Quickly ask for medical aid, water, food, shelter, or rescue.
- **Map View**: See all synced local requests on a map to know where to go.

## Tech Stack

- React Native / Expo
- SQLite (local storage)
- React Navigation

## How to run it

Make sure you have Node and Android Studio installed, then run:

```bash
npm install
npx expo run:android
```
