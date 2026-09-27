import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radii } from '../theme/colors';

export default function ProgressBar({ progress = 0, streak = 0 }) {
  const pct = Math.max(0, Math.min(1, progress));
  return (
    <View>
      <View style={styles.headerRow}>
        <Text style={styles.label}>This week</Text>
        <View style={styles.streakPill}>
          <Text style={styles.streakText}>🔥 {streak} day streak</Text>
        </View>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct * 100}%` }]} />
      </View>
      <Text style={styles.pctText}>{Math.round(pct * 100)}% of weekly goal</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: { color: colors.textDim, fontSize: 13, fontWeight: '600' },
  streakPill: {
    backgroundColor: colors.surfaceRaised,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
  },
  streakText: { color: colors.text, fontSize: 12, fontWeight: '700' },
  track: {
    height: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceRaised,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
  },
  pctText: { color: colors.textFaint, fontSize: 11, marginTop: 6 },
});
