import React from "react";
import CategoryListScreen from "./CategoryListScreen";
import { EXPRESS_CATEGORIES } from "../utils/exerciseData";

export default function WorkoutsExpressScreen({ navigation }) {
  return (
    <CategoryListScreen
      navigation={navigation}
      title="Workouts Express"
      categories={EXPRESS_CATEGORIES}
      activeTab="WorkoutsExpress"
    />
  );
}
