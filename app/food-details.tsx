import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function FoodDetails() {
  const { title, store, image } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        
        {/* Header Image Section */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: image as string }} style={styles.mainImage} />
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.store}>{store}</Text>
          </View>
          
          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Pick-up Location</Text>
          <View style={styles.mapPlaceholder}>
             <Ionicons name="map" size={40} color="#CCC" />
             <Text style={styles.mapLabel}>Davao City, PH</Text>
             <TouchableOpacity style={styles.floatBtn}>
                <Text style={styles.floatBtnText}>View Map</Text>
             </TouchableOpacity>
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="time-outline" size={20} color="#00B14F" />
            <Text style={styles.infoText}>Pickup available for the next 30 minutes.</Text>
          </View>

          {/* This button will now take the user to the Reserved tab */}
          <TouchableOpacity 
            style={styles.claimBtn} 
            onPress={() => router.push('/(tabs)/reserved')}
          >
            <Text style={styles.claimBtnText}>Reserve This Item</Text>
          </TouchableOpacity>

          {/* Added a simple 'Go Back' text link at the bottom as a secondary exit */}
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.secondaryBack}
          >
            <Text style={styles.secondaryBackText}>Cancel and Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  imageContainer: { width: width, height: 350 },
  mainImage: { width: '100%', height: '100%' },
  content: { 
    padding: 25, 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    marginTop: -30, 
    backgroundColor: 'white',
    minHeight: 500 
  },
  titleSection: { marginBottom: 5 },
  title: { fontSize: 26, fontWeight: '800', color: '#1C1C1C' },
  store: { fontSize: 18, color: '#00B14F', fontWeight: '600', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  mapPlaceholder: { 
    height: 160, 
    backgroundColor: '#F5F5F5', 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EAEAEA'
  },
  mapLabel: { color: '#999', marginTop: 5, fontSize: 14 },
  floatBtn: { position: 'absolute', bottom: 12, right: 12, backgroundColor: 'white', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, elevation: 2 },
  floatBtnText: { fontSize: 12, fontWeight: 'bold', color: '#00B14F' },
  infoBox: { flexDirection: 'row', backgroundColor: '#F0F9F4', padding: 18, borderRadius: 15, alignItems: 'center', marginBottom: 35 },
  infoText: { marginLeft: 10, color: '#444', flex: 1, fontSize: 14, lineHeight: 20 },
  claimBtn: { backgroundColor: '#00B14F', padding: 20, borderRadius: 18, alignItems: 'center', elevation: 4 },
  claimBtnText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  secondaryBack: { marginTop: 20, alignItems: 'center', paddingBottom: 40 },
  secondaryBackText: { color: '#8E8E93', fontWeight: '600' }
});