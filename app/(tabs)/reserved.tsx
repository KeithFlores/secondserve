import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RESERVATIONS = [
  { id: '1', title: 'Mixed Pastries (10pcs)', store: 'Bakery Delight', code: 'RESCUE-77', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=500' },
];

export default function ReservedScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Reserved Food 🔒</Text>
        <Text style={styles.subtitle}>Present these at the counter</Text>
      </View>

      {RESERVATIONS.length > 0 ? (
        <FlatList
          data={RESERVATIONS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardStore}>{item.store}</Text>
                <View style={styles.codeBadge}>
                  <Text style={styles.codeText}>CODE: {item.code}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.checkBtn}>
                <Ionicons name="location-outline" size={24} color="#00B14F" />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <View style={styles.empty}>
          <Ionicons name="calendar-outline" size={60} color="#DDD" />
          <Text style={styles.emptyText}>No active reservations</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { padding: 20, paddingTop: 50, backgroundColor: 'white' },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: 'gray', marginTop: 5 },
  card: { backgroundColor: 'white', borderRadius: 15, flexDirection: 'row', padding: 12, marginBottom: 15, alignItems: 'center', elevation: 2 },
  cardImage: { width: 70, height: 70, borderRadius: 10 },
  cardInfo: { flex: 1, marginLeft: 15 },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  cardStore: { color: 'gray', fontSize: 13, marginTop: 2 },
  codeBadge: { backgroundColor: '#F0F9F4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5, marginTop: 5, alignSelf: 'flex-start' },
  codeText: { color: '#00B14F', fontWeight: 'bold', fontSize: 11 },
  checkBtn: { padding: 10 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#AAA', marginTop: 10, fontSize: 16 }
});