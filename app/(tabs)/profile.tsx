import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarPlaceholder} />
        <Text style={styles.userName}>Keith Isiah B. Flores</Text>
        <Text style={styles.userSub}>Food Rescuer since 2026</Text>
      </View>

      <View style={styles.impactCard}>
        <Text style={styles.impactTitle}>Your Impact 🌍</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>12</Text>
            <Text style={styles.statLabel}>Meals Saved</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNum}>5kg</Text>
            <Text style={styles.statLabel}>CO2 Reduced</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  profileHeader: { alignItems: 'center', padding: 40, backgroundColor: 'white' },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#E0E0E0', marginBottom: 15 },
  userName: { fontSize: 22, fontWeight: 'bold' },
  userSub: { color: 'gray', marginTop: 5 },
  impactCard: { margin: 20, padding: 20, backgroundColor: '#00B14F', borderRadius: 20 },
  impactTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  stat: { alignItems: 'center' },
  statNum: { color: 'white', fontSize: 24, fontWeight: '900' },
  statLabel: { color: 'white', fontSize: 12 }
});