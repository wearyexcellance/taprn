import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { colors, radii, spacing } from "../theme/colors";
import { type } from "../theme/typography";
import TapHeader from "../components/TapHeader";
import {
  PRO_CATEGORIES,
  EXPRESS_CATEGORIES,
  getExerciseById,
} from "../utils/exerciseData";

function findCategory(categoryId) {
  return (
    PRO_CATEGORIES.find((c) => c.id === categoryId) ||
    EXPRESS_CATEGORIES.find((c) => c.id === categoryId)
  );
}

export default function RoutineDetailScreen({ route, navigation }) {
  const { categoryId, categoryTitle } = route.params;
  const category = findCategory(categoryId);
  const exercises = (category?.exercises || []).map(getExerciseById).filter(Boolean);

  return (
    <View style={styles.screen}>
      <TapHeader title={categoryTitle} />
      <ScrollView contentContainerStyle={styles.list}>
        {exercises.map((ex) => (
          <TouchableOpacity
            key={ex.id}
            style={styles.row}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Execution", { exerciseId: ex.id })}
          >
            <View>
              <Text style={styles.name}>{ex.name}</Text>
              <Text style={styles.meta}>
                {ex.targetSets} sets × {ex.targetReps} reps
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.base },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, gap: spacing.sm },
  row: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  name: { ...type.h3, color: colors.text },
  meta: { ...type.caption, color: colors.textMuted, marginTop: 2 },
  chevron: { ...type.h2, color: colors.textFaint },
});
