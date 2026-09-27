import React from "react";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { colors } from "../theme/colors";
import { useAuth } from "../context/AuthContext";

import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import WorkoutsProScreen from "../screens/WorkoutsProScreen";
import WorkoutsExpressScreen from "../screens/WorkoutsExpressScreen";
import RoutineDetailScreen from "../screens/RoutineDetailScreen";
import ExecutionScreen from "../screens/ExecutionScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Stack = createNativeStackNavigator();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.base,
    card: colors.base,
    primary: colors.primary,
    text: colors.text,
    border: colors.cardBorder,
  },
};

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) return null; // could render a splash/loader here

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="WorkoutsPro" component={WorkoutsProScreen} />
            <Stack.Screen name="WorkoutsExpress" component={WorkoutsExpressScreen} />
            <Stack.Screen name="RoutineDetail" component={RoutineDetailScreen} />
            <Stack.Screen
              name="Execution"
              component={ExecutionScreen}
              options={{ presentation: "fullScreenModal" }}
            />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
