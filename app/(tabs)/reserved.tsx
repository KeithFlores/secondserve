import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, SafeAreaView, Image, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Ionicons } from '@expo/vector-icons';

export default function ReservedScreen() {
  const [reservedItems, setReservedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReservedItems = async () => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('status', 'Claimed')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReservedItems(data || []);
    } catch (error: any) {
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchReservedItems();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchReservedItems();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reserved Food 🔒</Text>
      </View>
      <ScrollView 
        contentContainerStyle={{ padding: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00B14F" />}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#00B14F" />
        ) : reservedItems.length > 0 ? (
          reservedItems.map((item) => (
            <View key={item.id} style={styles.reservedCard}>
              <Image source={{ uri: item.image_url }} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.storeName}>{item.store}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={{ alignItems: 'center', marginTop: 100 }}>
            <Ionicons name="fast-food-outline" size={80} color="#E0E0E0" />
            <Text style={{ color: '#8E8E93', marginTop: 10 }}>No reserved items yet.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { padding: 20, paddingTop: 60, backgroundColor: '#FFF' },
  title: { fontSize: 24, fontWeight: 'bold' },
  reservedCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 15, padding: 12, marginBottom: 15, alignItems: 'center', elevation: 2 },
  itemImage: { width: 80, height: 80, borderRadius: 10 },
  itemInfo: { marginLeft: 15, flex: 1 },
  itemTitle: { fontSize: 16, fontWeight: 'bold' },
  storeName: { color: '#8E8E93', fontSize: 14 }
});