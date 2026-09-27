import React from "react";
import { ImageBackground, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, radii, spacing } from "../theme/colors";
import { type } from "../theme/typography";

export default function CategoryCard({ title, subtitle, photo, onPress, height = 140 }) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={[styles.card, { height }]}>
      <ImageBackground
        source={{ uri: photo }}
        style={StyleSheet.absoluteFill}
        imageStyle={{ borderRadius: radii.md }}
      >
        <LinearGradient
          colors={[colors.overlayTop, colors.overlayBottom]}
          style={styles.scrim}
        >
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.md,
    overflow: "hidden",
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  scrim: {
    flex: 1,
    justifyContent: "flex-end",
    padding: spacing.md,
  },
  title: {
    ...type.h3,
    color: colors.text,
  },
  subtitle: {
    ...type.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
});
