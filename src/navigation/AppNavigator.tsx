import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/home';
import { AIScannerScreen } from '../screens/ai';
import { EditAvatarScreen, SettingsScreen } from '../screens/profile';
import { RewardHistoryScreen } from '../screens/reward';

export type AppStackParamList = {
  Home: undefined;
  AIScanner: undefined;
  EditAvatar: undefined;
  Settings: undefined;
  RewardHistory: undefined;
};

const Stack = createStackNavigator<AppStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="AIScanner"
        component={AIScannerScreen}
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="EditAvatar"
        component={EditAvatarScreen}
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="RewardHistory"
        component={RewardHistoryScreen}
        options={{
          presentation: 'card',
        }}
      />
    </Stack.Navigator>
  );
}
