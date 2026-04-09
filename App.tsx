import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthNavigator, AppNavigator } from './src/navigation';
import { paperLightTheme } from './src/theme';
import { useFonts } from 'expo-font';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAudioBootstrap } from './src/hooks/useAudioBootstrap';
import ApiIncidentOverlay from './src/components/common/ApiIncidentOverlay';

import { useAuthStore } from './src/store/authStore';
import { View, ActivityIndicator, AppState, AppStateStatus } from 'react-native';

const USER_SYNC_INTERVAL_MS = 10000;

function AppContent() {
  const { isAuthenticated, loadUser, refreshCurrentUser } = useAuthStore();
  const [isInitializing, setIsInitializing] = React.useState(true);

  React.useEffect(() => {
    const initAuth = async () => {
      await loadUser();
      setIsInitializing(false);
    };
    initAuth();
  }, [loadUser]);

  React.useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    void refreshCurrentUser(true);

    const intervalId = setInterval(() => {
      void refreshCurrentUser(true);
    }, USER_SYNC_INTERVAL_MS);

    const appStateSubscription = AppState.addEventListener(
      'change',
      (nextState: AppStateStatus) => {
        if (nextState === 'active') {
          void refreshCurrentUser(true);
        }
      }
    );

    return () => {
      clearInterval(intervalId);
      appStateSubscription.remove();
    };
  }, [isAuthenticated, refreshCurrentUser]);

  if (isInitializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  useAudioBootstrap();
  useFonts({
    ...MaterialCommunityIcons.font,
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={paperLightTheme}>
          <AppContent />
          <ApiIncidentOverlay />
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
