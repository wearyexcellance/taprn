import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing } from '../theme/colors';

// One screen powers both "Workouts Pro" and "Workouts Express" — the data
// and header title are passed in via navigation params.
export default function CategoryListScreen({ route, navigation }) {
  const { title, categories } = route.params;

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
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              navigation.navigate('RoutineDetail', { categoryId: item.id, title: item.title })
            }
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.scrim} />
            <View style={styles.cardContent}>
              <Text style={styles.tag}>{item.tag?.toUpperCase()}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
            </View>
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
  card: {
    height: 140,
    borderRadius: radii.lg,
    overflow: 'hidden',
    marginBottom: spacing(4),
  },
  image: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.cardScrim },
  cardContent: { position: 'absolute', left: 16, bottom: 14 },
  tag: { color: colors.primaryBright, fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  cardTitle: { color: colors.text, fontSize: 20, fontWeight: '800', marginTop: 2 },
});
