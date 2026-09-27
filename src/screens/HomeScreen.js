import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing } from '../theme/colors';
import TapLogo from '../components/TapLogo';
import ProgressBar from '../components/ProgressBar';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const { user, loginAsGuest } = useAuth();

  React.useEffect(() => {
    if (!user) loginAsGuest();
  }, [user, loginAsGuest]);

  const displayName = user?.displayName ?? 'Athlete';
  const progress = user ? (user.completedThisWeek ?? 0) / (user.weeklyGoal ?? 5) : 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
        <TapLogo size={20} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.banner}>
          <View style={styles.bannerTop}>
            <View style={styles.avatarRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarInitial}>{displayName.charAt(0).toUpperCase()}</Text>
              </View>
              <View>
                <Text style={styles.welcome}>Welcome back,</Text>
                <Text style={styles.name}>{displayName}</Text>
              </View>
            </View>
            <Pressable hitSlop={10} onPress={() => navigation.navigate('Settings')}>
              <Ionicons name="settings-outline" size={22} color={colors.textDim} />
            </Pressable>
          </View>

          <View style={styles.divider} />

          <ProgressBar progress={progress} streak={user?.streak ?? 0} />
        </View>

        <Text style={styles.sectionTitle}>Jump back in</Text>
        <View style={styles.quickRow}>
          <QuickCard
            title="Workouts Pro"
            subtitle="Combat & strength"
            onPress={() => navigation.navigate('WorkoutsProTab')}
            icon="barbell-outline"
          />
          <QuickCard
            title="Workouts Express"
            subtitle="Quick daily routines"
            onPress={() => navigation.navigate('WorkoutsExpressTab')}
            icon="flash-outline"
          />
        </View>

        <Text style={styles.sectionTitle}>Recommended</Text>
        <Pressable
          style={styles.featureCard}
          onPress={() =>
            navigation.navigate('RoutineDetail', { categoryId: 'full-body', title: 'Full Body Workout' })
          }
        >
          <Image source={{ uri: 'https://picsum.photos/seed/full-body/800/500' }} style={styles.featureImage} />
          <View style={styles.featureScrim} />
          <View style={styles.featureContent}>
            <Text style={styles.featureTag}>EXPRESS</Text>
            <Text style={styles.featureTitle}>Full Body Workout</Text>
            <Text style={styles.featureMeta}>5 exercises · MoCap tracked</Text>
          </View>
        </Pressable>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickCard({ title, subtitle, icon, onPress }) {
  return (
    <Pressable style={styles.quickCard} onPress={onPress}>
      <Ionicons name={icon} size={22} color={colors.primaryBright} />
      <Text style={styles.quickTitle}>{title}</Text>
      <Text style={styles.quickSubtitle}>{subtitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing(5),
    paddingVertical: spacing(3),
  },
  headerTitle: { color: colors.text, fontSize: 22, fontWeight: '800' },
  scroll: { paddingHorizontal: spacing(5), paddingBottom: spacing(10) },
  banner: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing(5),
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing(6),
  },
  bannerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarInitial: { color: colors.text, fontWeight: '800', fontSize: 18 },
  welcome: { color: colors.textFaint, fontSize: 12 },
  name: { color: colors.text, fontSize: 17, fontWeight: '700' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing(4) },
  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: spacing(3) },
  quickRow: { flexDirection: 'row', gap: 12, marginBottom: spacing(6) },
  quickCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing(4),
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickTitle: { color: colors.text, fontWeight: '700', marginTop: 10 },
  quickSubtitle: { color: colors.textFaint, fontSize: 12, marginTop: 2 },
  featureCard: {
    height: 160,
    borderRadius: radii.lg,
    overflow: 'hidden',
    marginBottom: spacing(4),
  },
  featureImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  featureScrim: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.cardScrim },
  featureContent: { position: 'absolute', left: 16, bottom: 14, right: 16 },
  featureTag: { color: colors.primaryBright, fontSize: 11, fontWeight: '800' },
  featureTitle: { color: colors.text, fontSize: 18, fontWeight: '800', marginTop: 2 },
  featureMeta: { color: colors.textDim, fontSize: 12, marginTop: 2 },
});
