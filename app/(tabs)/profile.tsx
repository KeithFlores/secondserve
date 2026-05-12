import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar} />
        <Text style={styles.userName}>Keith Isiah B. Flores</Text>
        <Text style={{ color: 'gray' }}>Food Rescuer since 2026</Text>
      </View>
      <View style={styles.card}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Your Impact 🌍</Text>
        <Text style={{ color: 'white', fontSize: 24, fontWeight: '900', marginTop: 10 }}>12 Meals Saved</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  profileHeader: { alignItems: 'center', padding: 40, backgroundColor: 'white' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#EEE', marginBottom: 10 },
  userName: { fontSize: 20, fontWeight: 'bold' },
  card: { margin: 20, padding: 20, backgroundColor: '#00B14F', borderRadius: 20 }
});