import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, SafeAreaView, Image, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

const CATEGORIES = ['All', 'Meals', 'Pastries', 'Salads', 'Drinks'];

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function HomeScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const isSubscribed = useRef(false);

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error: any) {
      console.error('Fetch Error:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const setupNotifications = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') return;
    };
    setupNotifications();

    if (!isSubscribed.current) {
      const channelId = `home_channel_${Math.floor(Math.random() * 10000)}`;
      const channel = supabase.channel(channelId)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'donations' },
          (payload) => {
            if (payload.new.status === 'Claimed') {
              Notifications.scheduleNotificationAsync({
                content: {
                  title: "Item Reserved! 🎁",
                  body: `${payload.new.title} has just been claimed from ${payload.new.store}.`,
                },
                trigger: null,
              });
              fetchListings();
            }
          }
        )
        .subscribe();

      isSubscribed.current = true;

      return () => {
        supabase.removeChannel(channel);
        isSubscribed.current = false;
      };
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchListings();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchListings();
  };

  const filteredListings = listings.filter(
    (item: any) => activeCategory === 'All' || item.category === activeCategory
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Food Rescue 🌿</Text>
          <Text style={styles.location}>Davao City, Philippines ▾</Text>
        </View>
        <View style={styles.avatar}>
           <Ionicons name="person-circle" size={40} color="#CCC" />
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00B14F" />
        }
      >
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Every meal saved is a step for the planet.</Text>
          <Text style={styles.bannerSub}>Real-time donations active!</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity 
              key={cat} 
              onPress={() => setActiveCategory(cat)}
              style={[styles.catPill, activeCategory === cat && styles.activePill]}
            >
              <Text style={[styles.catText, activeCategory === cat && styles.activeCatText]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ padding: 20 }}>
          <Text style={styles.sectionTitle}>
            {activeCategory === 'All' ? 'Available Near You' : `${activeCategory} Near You`}
          </Text>
          
          {loading ? (
            <ActivityIndicator size="large" color="#00B14F" style={{ marginTop: 50 }} />
          ) : filteredListings.length > 0 ? (
            filteredListings.map((item: any) => (
              <TouchableOpacity 
                key={item.id} 
                style={[styles.card, item.status !== 'Available' && { opacity: 0.8 }]} 
                activeOpacity={0.9}
                onPress={() => router.push({
                  pathname: '/food-details',
                  params: { 
                    id: String(item.id),
                    title: item.title, 
                    store: item.store, 
                    image: item.image_url,
                    status: item.status,
                    lat: item.latitude,   // IMPORTANT: Pass Latitude to the map
                    lng: item.longitude   // IMPORTANT: Pass Longitude to the map
                  }
                })}
              >
                <Image source={{ uri: item.image_url }} style={styles.cardImage} />
                <View style={styles.timeBadge}>
                  <Text style={styles.timeText}>{item.status === 'Available' ? 'Just posted' : 'Closed'}</Text>
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardStore}>{item.store}</Text>
                  <View style={styles.cardFooter}>
                    {item.status === 'Available' ? (
                      <>
                        <Text style={styles.freeBadge}>FREE</Text>
                        <View style={styles.claimBtn}>
                          <Text style={styles.claimBtnText}>Claim Now</Text>
                        </View>
                      </>
                    ) : (
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="checkmark-circle" size={22} color="#8E8E93" style={{ marginRight: 5 }} />
                        <Text style={[styles.freeBadge, { color: '#8E8E93' }]}>CLAIMED</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="fast-food-outline" size={60} color="#CCC" />
              <Text style={styles.emptyText}>No items found in this category.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20, backgroundColor: '#FFF', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 22, fontWeight: '800' },
  location: { color: '#00B14F', fontWeight: '600', fontSize: 14 },
  avatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  banner: { margin: 20, padding: 20, backgroundColor: '#00B14F', borderRadius: 20 },
  bannerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  bannerSub: { color: 'rgba(255,255,255,0.8)', marginTop: 5 },
  catScroll: { paddingLeft: 20, marginBottom: 10, height: 50 },
  catPill: { paddingHorizontal: 20, height: 40, justifyContent: 'center', backgroundColor: 'white', borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#E0E0E0' },
  activePill: { backgroundColor: '#00B14F', borderColor: '#00B14F' },
  catText: { fontWeight: '600', color: '#1C1C1C' },
  activeCatText: { color: 'white' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15 },
  card: { backgroundColor: '#FFF', borderRadius: 20, marginBottom: 20, overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  cardImage: { width: '100%', height: 180 },
  timeBadge: { position: 'absolute', top: 15, right: 15, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  timeText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  cardContent: { padding: 15 },
  cardTitle: { fontSize: 18, fontWeight: '700' },
  cardStore: { color: '#8E8E93', marginTop: 4 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 },
  freeBadge: { color: '#00B14F', fontWeight: '900', fontSize: 20 },
  claimBtn: { backgroundColor: '#00B14F', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  claimBtnText: { color: '#FFF', fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#8E8E93', marginTop: 10, fontSize: 16 }
});