import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, radii, spacing } from "../theme/colors";
import { type } from "../theme/typography";
import { useAuth } from "../context/AuthContext";
import TapHeader from "../components/TapHeader";

export default function SettingsScreen({ navigation }) {
  const { user, logout } = useAuth();

  return (
    <View style={styles.screen}>
      <TapHeader title="Settings" />
      <View style={styles.content}>
        <Text style={styles.label}>Signed in as</Text>
        <Text style={styles.value}>{user?.displayName ?? "Athlete"}</Text>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={async () => {
            await logout();
            navigation.replace("Login");
          }}
        >
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.base },
  content: { paddingHorizontal: spacing.lg, marginTop: spacing.lg },
  label: { ...type.caption, color: colors.textMuted },
  value: { ...type.h3, color: colors.text, marginTop: 4, marginBottom: spacing.xl },
  logoutButton: {
    backgroundColor: colors.card,
    borderColor: colors.formBad,
    borderWidth: 1,
    borderRadius: radii.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  logoutText: { ...type.bodySemi, color: colors.formBad },
});
