import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Platform, Animated, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
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
const NUM_TABS = 5;

const TAB_ICONS: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  Dashboard: 'home',
  Achievement: 'trophy',
  Game: 'gamepad-variant',
  Reward: 'gift-outline',
  Profile: 'account-circle',
};

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const floatingAnim = useRef(new Animated.Value(0)).current;
  // activeAnim: index of currently active tab (animated)
  const activeIndexAnim = useRef(new Animated.Value(state.index)).current;
  const [barWidth, setBarWidth] = useState(Dimensions.get('window').width - 32);

  // Floating (bob) animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(floatingAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Animate bubble to new tab on change
  useEffect(() => {
    Animated.timing(activeIndexAnim, {
      toValue: state.index,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [state.index]);

  const tabWidth = barWidth / NUM_TABS;

  // Horizontal position of bubble center: centers on the active tab
  const bubbleTranslateX = activeIndexAnim.interpolate({
    inputRange: state.routes.map((_, i) => i),
    outputRange: state.routes.map((_, i) => i * tabWidth + tabWidth / 2 - CENTER_BUTTON_SIZE / 2),
  });

  const floatTranslateY = floatingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  return (
    <Animated.View
      style={[styles.tabBarContainer, { transform: [{ translateY: floatTranslateY }] }]}
      onLayout={e => setBarWidth(e.nativeEvent.layout.width)}
    >
      {/* Floating bubble */}
      <Animated.View
        style={[styles.bubble, { transform: [{ translateX: bubbleTranslateX }] }]}
        pointerEvents="none"
      >
        <View style={styles.bubbleCircle}>
          <MaterialCommunityIcons
            name={TAB_ICONS[state.routes[state.index].name]}
            size={28}
            color={colors.text.white}
          />
        </View>
      </Animated.View>

      {/* Tab buttons */}
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.8}
            style={styles.tabButton}
          >
            {!isFocused && (
              <MaterialCommunityIcons
                name={TAB_ICONS[route.name]}
                size={26}
                color={colors.text.secondary}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
}

export default function HomeScreen() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Achievement" component={LeaderboardScreen} />
      <Tab.Screen name="Game" component={GameScreen} />
      <Tab.Screen name="Reward" component={RewardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  activeDot: {
    backgroundColor: colors.primary,
    borderRadius: ACTIVE_DOT_SIZE / 2,
    height: ACTIVE_DOT_SIZE,
    marginTop: 6,
    width: ACTIVE_DOT_SIZE,
  },
  bubble: {
    position: 'absolute',
    top: CENTER_BUTTON_TOP,
    zIndex: 10,
  },
  bubbleCircle: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: CENTER_BUTTON_SIZE / 2,
    elevation: 8,
    height: CENTER_BUTTON_SIZE,
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    width: CENTER_BUTTON_SIZE,
  },
  tabBarContainer: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 28,
    bottom: Platform.OS === 'ios' ? 24 : 16,
    elevation: 12,
    flexDirection: 'row',
    height: TAB_BAR_HEIGHT + (Platform.OS === 'ios' ? 24 : 12),
    left: 16,
    overflow: 'visible',
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingTop: 15,
    position: 'absolute',
    right: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  tabButton: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
