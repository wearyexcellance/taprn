import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { colors } from "../theme/colors";
import TapHeader from "../components/TapHeader";
import ProfileBanner from "../components/ProfileBanner";
import BottomTabBar from "../components/BottomTabBar";
import { useAuth } from "../context/AuthContext";

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();

  return (
    <View style={styles.screen}>
      <TapHeader title="Home" onSettingsPress={() => navigation.navigate("Settings")} />
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        <ProfileBanner user={user} />
      </ScrollView>
      <BottomTabBar
        active="Home"
        onNavigate={(route) => navigation.navigate(route)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.base },
});
