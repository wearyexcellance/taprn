import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing } from '../theme/colors';
import { ROUTINES } from '../utils/content';

export default function RoutineDetailScreen({ route, navigation }) {
  const { categoryId, title } = route.params;
  const exercises = ROUTINES[categoryId] ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No trackable exercises mapped to this routine yet.</Text>
        }
        renderItem={({ item, index }) => (
          <Pressable
            style={styles.row}
            onPress={() => navigation.navigate('Execution', { exercise: item })}
          >
            <View style={styles.indexCircle}>
              <Text style={styles.indexText}>{index + 1}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.exerciseName}>{item.name}</Text>
              <Text style={styles.exerciseMeta}>Target {item.targetReps} reps · MoCap tracked</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textFaint} />
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing(5),
    paddingVertical: spacing(3),
  },
  headerTitle: { color: colors.text, fontSize: 18, fontWeight: '800' },
  list: { paddingHorizontal: spacing(5), paddingBottom: spacing(10) },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing(4),
    marginBottom: spacing(3),
    borderWidth: 1,
    borderColor: colors.border,
  },
  indexCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  indexText: { color: colors.text, fontWeight: '800' },
  exerciseName: { color: colors.text, fontWeight: '700', fontSize: 15 },
  exerciseMeta: { color: colors.textFaint, fontSize: 12, marginTop: 2 },
  empty: { color: colors.textDim, textAlign: 'center', marginTop: spacing(10) },
});
