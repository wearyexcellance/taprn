import React from "react";
import CategoryListScreen from "./CategoryListScreen";
import { PRO_CATEGORIES } from "../utils/exerciseData";

export default function WorkoutsProScreen({ navigation }) {
  return (
    <CategoryListScreen
      navigation={navigation}
      title="Workouts Pro"
      categories={PRO_CATEGORIES}
      activeTab="WorkoutsPro"
    />
  );
}
