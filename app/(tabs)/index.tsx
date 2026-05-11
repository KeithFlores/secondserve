import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const CATEGORIES = ['All', 'Meals', 'Pastries', 'Salads', 'Drinks'];
const FOOD_DATA = [
  { id: '1', title: 'Mixed Pastries (10pcs)', store: 'Bakery Delight', timeLeft: '15m', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=500', category: '🥐 Pastries' },
  { id: '2', title: 'Chicken Rice Bento', store: 'Uncle Wong Kitchen', timeLeft: '30m', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500', category: '🍱 Meals' },
  { id: '3', title: 'Surprise Veggie Bag', store: 'Green Grocer', timeLeft: '1h', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=500', category: '🥗 Salads' },
];

export default function HomeScreen() {
  const router = useRouter();
  // 1. Added state to track active category
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Food Rescue 🌿</Text>
          <Text style={styles.location}>Davao City, Philippines ▾</Text>
        </View>
        <View style={styles.avatar} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Every meal saved is a step for the planet.</Text>
          <Text style={styles.bannerSub}>1,240 meals saved today!</Text>
        </View>

        {/* 2. Updated Category Scroll with clickable logic */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity 
              key={cat} 
              onPress={() => setActiveCategory(cat)}
              style={[
                styles.catPill, 
                activeCategory === cat && styles.activePill // Apply green style if active
              ]}
            >
              <Text style={[
                styles.catText, 
                activeCategory === cat && styles.activeCatText // Make text white if active
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ padding: 20 }}>
          <Text style={styles.sectionTitle}>
            {activeCategory === 'All' ? 'Available Near You' : `${activeCategory} Near You`}
          </Text>
          
          {FOOD_DATA
            .filter(item => activeCategory === 'All' || item.category === activeCategory)
            .map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.card} 
              activeOpacity={0.9}
              onPress={() => router.push({
                pathname: '/food-details',
                params: { title: item.title, store: item.store, image: item.image }
              })}
            >
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <View style={styles.timeBadge}>
                <Text style={styles.timeText}>{item.timeLeft} left</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardStore}>{item.store}</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.freeBadge}>FREE</Text>
                  <View style={styles.claimBtn}>
                    <Text style={styles.claimBtnText}>Claim Now</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E0E0E0' },
  banner: { margin: 20, padding: 20, backgroundColor: '#00B14F', borderRadius: 20 },
  bannerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  bannerSub: { color: 'rgba(255,255,255,0.8)', marginTop: 5 },
  catScroll: { paddingLeft: 20, marginBottom: 10, height: 50 },
  catPill: { paddingHorizontal: 15, height: 40, justifyContent: 'center', backgroundColor: 'white', borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#E0E0E0' },
  activePill: { backgroundColor: '#00B14F', borderColor: '#00B14F' },
  catText: { fontWeight: '600', color: '#1C1C1C' },
  activeCatText: { color: 'white' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15 },
  card: { backgroundColor: '#FFF', borderRadius: 20, marginBottom: 20, overflow: 'hidden', elevation: 4 },
  cardImage: { width: '100%', height: 180 },
  timeBadge: { position: 'absolute', top: 15, right: 15, backgroundColor: 'rgba(0,0,0,0.7)', padding: 6, borderRadius: 10 },
  timeText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  cardContent: { padding: 15 },
  cardTitle: { fontSize: 18, fontWeight: '700' },
  cardStore: { color: '#8E8E93', marginTop: 4 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 },
  freeBadge: { color: '#00B14F', fontWeight: '900', fontSize: 20 },
  claimBtn: { backgroundColor: '#00B14F', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  claimBtnText: { color: '#FFF', fontWeight: 'bold' }
});