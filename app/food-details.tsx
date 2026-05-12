import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { supabase } from '../lib/supabase';

export default function FoodDetailsScreen() {
  const router = useRouter();
  const mapRef = useRef<WebView>(null);
  const params = useLocalSearchParams();
  
  const [loading, setLoading] = useState(false);
  // This state tracks the claim status locally so the code shows up instantly
  const [currentStatus, setCurrentStatus] = useState(params.status);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);

  const isClaimed = currentStatus === 'Claimed';
  // Generates a code like "RESCUE-A1B2C" based on the entry ID
  const claimCode = `RESCUE-${String(params.id).substring(0, 5).toUpperCase()}`;

  const storeLat = params.lat ? parseFloat(params.lat as string) : 7.0707;
  const storeLng = params.lng ? parseFloat(params.lng as string) : 125.6092;

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;
        let location = await Location.getCurrentPositionAsync({});
        setUserLocation({ lat: location.coords.latitude, lng: location.coords.longitude });
      } catch (e) {
        console.error(e);
      } finally {
        setLocationLoading(false);
      }
    })();
  }, []);

  const handleReserve = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('donations')
        .update({ status: 'Claimed' })
        .eq('id', params.id);
      
      if (error) throw error;

      // Update local state so the "RESCUE-XXX" code appears immediately
      setCurrentStatus('Claimed');
      Alert.alert("Claimed!", "Show your rescue code at the counter.");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  const mapHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>body { margin: 0; } #map { height: 100vh; }</style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map', { zoomControl: false });
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
          L.marker([${storeLat}, ${storeLng}]).addTo(map);
          map.setView([${storeLat}, ${storeLng}], 15);
        </script>
      </body>
    </html>
  `;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: params.image as string }} style={styles.mainImage} />
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{params.title}</Text>
            <Text style={styles.freeBadge}>FREE</Text>
          </View>
          <Text style={styles.storeName}>{params.store}</Text>

          {/* THE CLAIM CODE BOX (Type Shi) */}
          {isClaimed && (
            <View style={styles.claimCodeContainer}>
              <Text style={styles.claimCodeLabel}>YOUR CLAIM CODE</Text>
              <Text style={styles.claimCodeValue}>{claimCode}</Text>
              <View style={styles.dashedLine} />
              <Text style={styles.claimInstruction}>Show this to the store staff upon pickup</Text>
            </View>
          )}

          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.locationCard}>
            <WebView ref={mapRef} originWhitelist={['*']} source={{ html: mapHtml }} style={styles.map} />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.reserveBtn, isClaimed && styles.disabledBtn]} 
          onPress={handleReserve}
          disabled={loading || isClaimed}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.reserveBtnText}>{isClaimed ? 'ALREADY CLAIMED' : 'RESERVE FOR RESCUE'}</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  imageContainer: { width: '100%', height: 300 },
  mainImage: { width: '100%', height: '100%' },
  backBtn: { position: 'absolute', top: 50, left: 20, backgroundColor: 'white', padding: 10, borderRadius: 25, elevation: 5 },
  content: { padding: 20, paddingBottom: 100 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
  freeBadge: { fontSize: 22, fontWeight: '900', color: '#00B14F' },
  storeName: { fontSize: 16, color: '#8E8E93', marginTop: 5 },
  
  // Claim Code Styles
  claimCodeContainer: { 
    backgroundColor: '#F0F9F4', 
    padding: 25, 
    borderRadius: 20, 
    marginTop: 20, 
    alignItems: 'center', 
    borderWidth: 2, 
    borderColor: '#00B14F', 
    borderStyle: 'dashed' 
  },
  claimCodeLabel: { color: '#00B14F', fontWeight: 'bold', fontSize: 12, letterSpacing: 1 },
  claimCodeValue: { fontSize: 36, fontWeight: '900', color: '#1C1C1E', marginVertical: 10 },
  dashedLine: { width: '100%', height: 1, backgroundColor: '#00B14F', opacity: 0.2, marginVertical: 10 },
  claimInstruction: { color: '#666', fontSize: 13, textAlign: 'center' },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 30, marginBottom: 15 },
  locationCard: { height: 200, borderRadius: 20, overflow: 'hidden', marginBottom: 20 },
  map: { flex: 1 },
  footer: { position: 'absolute', bottom: 0, width: '100%', padding: 20, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#EEE' },
  reserveBtn: { backgroundColor: '#00B14F', padding: 20, borderRadius: 15, alignItems: 'center' },
  disabledBtn: { backgroundColor: '#CCC' },
  reserveBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});