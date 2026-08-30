import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Text, View, ActivityIndicator } from 'react-native';

import { initializeDatabase } from './src/database/database';
import { AppNavigator } from './src/navigation/AppNavigator';
import { colors } from './src/config/theme';
import { meshTransportManager } from './src/services/p2p/MeshTransportManager';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function setupApp() {
      try {
        await initializeDatabase();
        await meshTransportManager.start();
        setIsReady(true);
      } catch (e) {
        console.error('App initialization error:', e);
        setError(String(e));
      }
    }

    setupApp();

    return () => {
      meshTransportManager.stop();
    };
  }, []);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: colors.error, fontSize: 18, textAlign: 'center' }}>
          Failed to initialize app:\n{error}
        </Text>
      </View>
    );
  }

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor={colors.primaryDark} />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
