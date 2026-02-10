import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DashboardScreen } from '../dashboard';
import { GameScreen } from '../game';
import { ProfileScreen } from '../profile';
import { LeaderboardScreen } from '../leaderboard';
import { RewardScreen } from '../reward';
import { colors } from '../../theme';

export type HomeTabParamList = {
  Dashboard: undefined;
  Achievement: undefined;
  Game: undefined;
  Reward: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<HomeTabParamList>();

export default function HomeScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.disabled,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: colors.surface,
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          height: 70,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          paddingTop: 10,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabItem}>
              <MaterialCommunityIcons name="home" size={focused ? 28 : 24} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Achievement"
        component={LeaderboardScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabItem}>
              <MaterialCommunityIcons name="trophy" size={focused ? 28 : 24} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Game"
        component={GameScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.centerTabContainer}>
              <View style={styles.centerTab}>
                <MaterialCommunityIcons name="gamepad-variant" size={32} color={colors.surface} />
              </View>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Reward"
        component={RewardScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabItem}>
              <MaterialCommunityIcons name="gift" size={focused ? 28 : 24} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabItem}>
              <MaterialCommunityIcons name="account-circle" size={focused ? 28 : 24} color={color} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  centerTab: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 35,
    elevation: 8,
    height: 65,
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    width: 65,
  },
  centerTabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -25,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
