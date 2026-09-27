import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

export default function SettingsScreen({ navigation }) {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.body}>
        <Text style={styles.row}>Signed in as {user?.displayName ?? 'Athlete'}</Text>
        <Pressable
          style={styles.logoutButton}
          onPress={async () => {
            await logout();
            navigation.goBack();
          }}
        >
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
      </View>
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
  body: { paddingHorizontal: spacing(5), paddingTop: spacing(4) },
  row: { color: colors.textDim, marginBottom: spacing(5) },
  logoutButton: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing(4),
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  logoutText: { color: colors.danger, fontWeight: '700' },
});
