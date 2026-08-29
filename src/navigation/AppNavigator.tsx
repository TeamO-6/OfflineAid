import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, List, Map as MapIcon, Network, Settings as SettingsIcon } from 'lucide-react-native';

import { colors } from '../config/theme';
import { APP_CONFIG } from '../config/appConfig';

import { DashboardScreen } from '../screens/Dashboard/DashboardScreen';
import { CreateRequestScreen } from '../screens/CreateRequest/CreateRequestScreen';
import { RequestsScreen } from '../screens/Requests/RequestsScreen';
import { RequestDetailScreen } from '../screens/RequestDetail/RequestDetailScreen';
import { MeshNetworkScreen } from '../screens/Mesh/MeshNetworkScreen';
import { MapScreen } from '../screens/Map/MapScreen';
import { SettingsScreen } from '../screens/Settings/SettingsScreen';



const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{ 
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: { paddingBottom: 4 },
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{
          title: APP_CONFIG.name,
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Requests" 
        component={RequestsScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <List color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Map" 
        component={MapScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <MapIcon color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Mesh" 
        component={MeshNetworkScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Network color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <SettingsIcon color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.primary }, headerTintColor: '#fff' }}>
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="CreateRequest" component={CreateRequestScreen} options={{ title: 'New Request', presentation: 'modal' }} />
        <Stack.Screen name="RequestDetail" component={RequestDetailScreen} options={{ title: 'Request Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
