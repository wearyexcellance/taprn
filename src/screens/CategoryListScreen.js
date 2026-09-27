import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { colors, spacing } from "../theme/colors";
import TapHeader from "../components/TapHeader";
import CategoryCard from "../components/CategoryCard";
import BottomTabBar from "../components/BottomTabBar";

// Generic list of dark-photo category cards. Used for both "Workouts Pro"
// (combat/heavy) and "Workouts Express" (quick routines) — the two only
// differ in title, catalog, and which tab is highlighted.
export default function CategoryListScreen({ navigation, title, categories, activeTab }) {
  return (
    <View style={styles.screen}>
      <TapHeader title={title} />
      <ScrollView contentContainerStyle={styles.list}>
        {categories.map((cat) => (
          <CategoryCard
            key={cat.id}
            title={cat.title}
            photo={cat.photo}
            onPress={() =>
              navigation.navigate("RoutineDetail", { categoryId: cat.id, categoryTitle: cat.title })
            }
          />
        ))}
      </ScrollView>
      <BottomTabBar active={activeTab} onNavigate={(route) => navigation.navigate(route)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.base },
  list: { paddingHorizontal: spacing.lg, paddingBottom: 140 },
});
