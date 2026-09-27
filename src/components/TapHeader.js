import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import { colors, spacing } from "../theme/colors";
import { type } from "../theme/typography";

// The bolt is drawn as a single angular path so it reads as "electric"
// without leaning on the generic bright-green-on-black lightning cliché —
// it's tinted to the app's own violet instead.
function TapBolt({ size = 22 }) {
  return (
    <Svg width={size} height={size * 1.2} viewBox="0 0 24 30">
      <Path
        d="M14 0 L2 17 H10.5 L8 30 L22 12 H13.5 L14 0 Z"
        fill={colors.primary}
      />
    </Svg>
  );
}

export default function TapHeader({ title, onSettingsPress }) {
  return (
    <View style={styles.row}>
      <View style={styles.brandRow}>
        <TapBolt />
        <Text style={styles.wordmark}>TAP</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      {onSettingsPress ? (
        <TouchableOpacity onPress={onSettingsPress} hitSlop={12}>
          <SettingsCog />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 22 }} />
      )}
    </View>
  );
}

function SettingsCog() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24">
      <Path
        d="M12 8a4 4 0 100 8 4 4 0 000-8zm9 4a7.1 7.1 0 00-.13-1.3l2-1.55-2-3.46-2.36.95a7.1 7.1 0 00-2.24-1.3L16 2h-4l-.27 2.34a7.1 7.1 0 00-2.24 1.3l-2.36-.95-2 3.46 2 1.55A7.1 7.1 0 003 12c0 .44.05.87.13 1.3l-2 1.55 2 3.46 2.36-.95c.66.56 1.42 1 2.24 1.3L8 22h4l.27-2.34c.82-.3 1.58-.74 2.24-1.3l2.36.95 2-3.46-2-1.55c.08-.43.13-.86.13-1.3z"
        fill={colors.textMuted}
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  wordmark: {
    ...type.h3,
    color: colors.primary,
    letterSpacing: 1,
  },
  title: {
    ...type.h2,
    color: colors.text,
  },
});
