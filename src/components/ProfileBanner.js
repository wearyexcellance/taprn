import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { colors, radii, spacing } from "../theme/colors";
import { type } from "../theme/typography";

export default function ProfileBanner({ user }) {
  // user is already normalized upstream (AuthContext) so displayName and
  // streak are never NaN/undefined by the time they reach this component.
  const name = user?.displayName ?? "Athlete";
  const streak = user?.streak ?? 0;
  const progress = Math.max(0, Math.min(1, user?.weeklyProgress ?? 0));

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.avatarWrap}>
          {user?.avatarUrl ? (
            <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Text style={styles.avatarInitial}>{name.charAt(0).toUpperCase()}</Text>
            </View>
          )}
        </View>
        <View style={{ flex: 1, marginLeft: spacing.md }}>
          <Text style={styles.welcome}>Welcome back</Text>
          <Text style={styles.name}>{name}</Text>
        </View>
        <View style={styles.streakPill}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <Text style={styles.streakText}>{streak}</Text>
        </View>
      </View>

      <View style={styles.progressRow}>
        <Text style={styles.progressLabel}>Weekly progress</Text>
        <Text style={styles.progressPct}>{Math.round(progress * 100)}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  topRow: { flexDirection: "row", alignItems: "center" },
  avatarWrap: {},
  avatar: { width: 52, height: 52, borderRadius: 26 },
  avatarFallback: {
    backgroundColor: colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: { ...type.h3, color: colors.text },
  welcome: { ...type.caption, color: colors.textMuted },
  name: { ...type.h3, color: colors.text, marginTop: 2 },
  streakPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
  },
  streakEmoji: { fontSize: 14 },
  streakText: { ...type.bodySemi, color: colors.streak },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  progressLabel: { ...type.caption, color: colors.textMuted },
  progressPct: { ...type.caption, color: colors.glow },
  track: {
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
  },
});
