import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform, Animated } from 'react-native';
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

const TAB_BAR_HEIGHT = 64;
const CENTER_BUTTON_SIZE = 56;
const CENTER_BUTTON_TOP = -24;
const ACTIVE_DOT_SIZE = 6;

function TabIcon({
  name,
  focused,
  activeColor,
  inactiveColor,
}: {
  name: keyof typeof MaterialCommunityIcons.glyphMap;
  focused: boolean;
  activeColor: string;
  inactiveColor: string;
}) {
  const color = focused ? activeColor : inactiveColor;
  return (
    <View style={styles.tabItem}>
      <MaterialCommunityIcons name={name} size={26} color={color} />
      {focused && <View style={styles.activeDot} />}
    </View>
  );
}

function CenterTabIcon({ focused }: { focused: boolean }) {
  return (
    <View style={styles.centerTabWrapper}>
      <View style={styles.centerTab}>
        <MaterialCommunityIcons name="gamepad-variant" size={28} color={colors.text.white} />
      </View>
      {focused && <View style={[styles.activeDot, styles.activeDotCenter]} />}
    </View>
  );
}

export default function HomeScreen() {
  const floatingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = floatingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: colors.surface,
          borderTopWidth: 0,
          height: TAB_BAR_HEIGHT + (Platform.OS === 'ios' ? 24 : 12),
          paddingBottom: Platform.OS === 'ios' ? 24 : 12,
          paddingTop: 8,
          borderRadius: 28,
          marginHorizontal: 16,
          marginBottom: Platform.OS === 'ios' ? 24 : 16,
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          transform: [{ translateY }],
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="home"
              focused={focused}
              activeColor={colors.primary}
              inactiveColor={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Achievement"
        component={LeaderboardScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="trophy"
              focused={focused}
              activeColor={colors.primary}
              inactiveColor={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Game"
        component={GameScreen}
        options={{
          tabBarIcon: ({ focused }) => <CenterTabIcon focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Reward"
        component={RewardScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="gift-outline"
              focused={focused}
              activeColor={colors.primary}
              inactiveColor={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="account-circle"
              focused={focused}
              activeColor={colors.primary}
              inactiveColor={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    width: ACTIVE_DOT_SIZE,
    height: ACTIVE_DOT_SIZE,
    borderRadius: ACTIVE_DOT_SIZE / 2,
    backgroundColor: colors.primary,
    marginTop: 6,
  },
  centerTabWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: CENTER_BUTTON_TOP,
  },
  centerTab: {
    width: CENTER_BUTTON_SIZE,
    height: CENTER_BUTTON_SIZE,
    borderRadius: CENTER_BUTTON_SIZE / 2,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  activeDotCenter: {
    marginTop: 4,
  },
});
