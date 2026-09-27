import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import { colors, radii } from "../theme/colors";

function BarbellIcon({ active }) {
  const c = active ? colors.primary : colors.textMuted;
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Path d="M2 10h2v4H2zM4 9h2v6H4zM18 9h2v6h-2zM20 10h2v4h-2z" fill={c} />
      <Path d="M6 11h12v2H6z" fill={c} />
      <Path d="M7 8h1.5v8H7zM15.5 8H17v8h-1.5z" fill={c} />
    </Svg>
  );
}

function HomeIcon({ active }) {
  const c = active ? colors.primary : colors.textMuted;
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Path d="M12 3l9 8h-2.5v9h-5v-6h-3v6h-5v-9H3l9-8z" fill={c} />
    </Svg>
  );
}

// "Winged weight" — a dumbbell with small wing strokes for Express mode.
function WingedWeightIcon({ active }) {
  const c = active ? colors.primary : colors.textMuted;
  return (
    <Svg width={26} height={24} viewBox="0 0 26 24">
      <Circle cx={7} cy={12} r={4} fill={c} />
      <Circle cx={19} cy={12} r={4} fill={c} />
      <Path d="M11 12h4" stroke={c} strokeWidth={2} />
      <Path d="M4 8c-2-1-3-3-2-5M22 8c2-1 3-3 2-5" stroke={c} strokeWidth={1.6} fill="none" />
    </Svg>
  );
}

export default function BottomTabBar({ active, onNavigate }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.pill}>
        <TouchableOpacity style={styles.tab} onPress={() => onNavigate("WorkoutsPro")}>
          <BarbellIcon active={active === "WorkoutsPro"} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => onNavigate("Home")}>
          <HomeIcon active={active === "Home"} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => onNavigate("WorkoutsExpress")}>
          <WingedWeightIcon active={active === "WorkoutsExpress"} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  pill: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingVertical: 14,
    paddingHorizontal: 28,
    gap: 36,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
  },
});
