import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

import HomeScreen from '../screens/HomeScreen';
import CategoryListScreen from '../screens/CategoryListScreen';
import { PRO_CATEGORIES, EXPRESS_CATEGORIES } from '../utils/content';

const Tab = createBottomTabNavigator();

// Thin wrapper screens so each tab can inject its own static params without
// the tab navigator needing to know about CategoryListScreen's generic shape.
function WorkoutsProTab(props) {
  return (
    <CategoryListScreen
      {...props}
      route={{ ...props.route, params: { title: 'Workouts Pro', categories: PRO_CATEGORIES } }}
    />
  );
}
function WorkoutsExpressTab(props) {
  return (
    <CategoryListScreen
      {...props}
      route={{ ...props.route, params: { title: 'Workouts Express', categories: EXPRESS_CATEGORIES } }}
    />
  );
}

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primaryBright,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
      }}
    >
      <Tab.Screen
        name="WorkoutsProTab"
        component={WorkoutsProTab}
        options={{
          title: 'Pro',
          tabBarIcon: ({ color, size }) => <Ionicons name="barbell-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Dashboard"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="WorkoutsExpressTab"
        component={WorkoutsExpressTab}
        options={{
          title: 'Express',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="weight-lifter" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
