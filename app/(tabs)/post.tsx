import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MY_POSTS = [
  { id: '1', title: '6x Glazed Donuts', status: 'Available', color: '#00B14F' },
  { id: '2', title: 'Vegetable Salad Box', status: 'Claimed', color: '#8E8E93' },
];

export default function PostFoodScreen() {
  const [title, setTitle] = useState('');
  const [store, setStore] = useState('');
  const [description, setDescription] = useState('');

  const handlePost = () => {
    if (!title || !store) {
      return Alert.alert("Missing Info", "Please provide a title and store name.");
    }
    Alert.alert("Success!", "Your food donation is now live.");
    setTitle('');
    setStore('');
    setDescription('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Restaurant Dashboard 🏪</Text>
          <Text style={styles.subtitle}>Upload donations and manage listings</Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionHeader}>Post New Donation</Text>
          
          {/* Photo Upload Section */}
          <Text style={styles.inputLabel}>Food Photo</Text>
          <TouchableOpacity style={styles.photoUpload} onPress={() => Alert.alert("Upload", "Open Camera/Gallery")}>
            <View style={styles.cameraCircle}>
              <Ionicons name="camera" size={32} color="#00B14F" />
            </View>
            <Text style={styles.uploadText}>Add Photo</Text>
          </TouchableOpacity>

          {/* Food Name Input */}
          <Text style={styles.inputLabel}>Food Name</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g. 1 Dozen Cupcakes" 
            value={title}
            onChangeText={setTitle}
          />
          
          {/* Store Name Input */}
          <Text style={styles.inputLabel}>Restaurant / Store Name</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g. Bakewell Davao" 
            value={store}
            onChangeText={setStore}
          />

          {/* Description Input */}
          <Text style={styles.inputLabel}>Short Description (Optional)</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            placeholder="e.g. Freshly baked this morning, chocolate flavor." 
            value={description}
            onChangeText={setDescription}
            multiline={true}
            numberOfLines={3}
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handlePost}>
            <Text style={styles.submitText}>List for Rescue</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.manageSection}>
          <Text style={styles.sectionHeader}>Your Active Listings</Text>
          {MY_POSTS.map((item) => (
            <View key={item.id} style={styles.manageCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <View style={[styles.statusBadge, { backgroundColor: item.color + '15' }]}>
                  <View style={[styles.dot, { backgroundColor: item.color }]} />
                  <Text style={[styles.statusText, { color: item.color }]}>{item.status}</Text>
                </View>
              </View>
              
              {item.status === 'Available' ? (
                <TouchableOpacity 
                  style={styles.claimActionBtn} 
                  onPress={() => Alert.alert("Update", "Mark as claimed?")}
                >
                  <Text style={styles.claimActionText}>Mark Claimed</Text>
                </TouchableOpacity>
              ) : (
                <Ionicons name="checkmark-circle" size={28} color="#8E8E93" />
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { padding: 20, paddingTop: 50, backgroundColor: 'white' },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: 'gray', marginTop: 5 },
  
  formSection: { padding: 20, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  sectionHeader: { fontWeight: '800', marginBottom: 20, fontSize: 18, color: '#1C1C1C' },
  
  // Label Styles
  inputLabel: { fontSize: 14, fontWeight: '700', color: '#444', marginBottom: 8, marginLeft: 2 },

  photoUpload: { 
    height: 140, 
    backgroundColor: '#F9F9F9', 
    borderRadius: 15, 
    borderWidth: 1.5, 
    borderColor: '#00B14F', 
    borderStyle: 'dashed', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 20 
  },
  cameraCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center' },
  uploadText: { color: '#00B14F', fontWeight: 'bold', marginTop: 8, fontSize: 14 },

  input: { backgroundColor: '#F5F5F5', padding: 15, borderRadius: 12, fontSize: 16, marginBottom: 20, color: '#333' },
  textArea: { height: 80, textAlignVertical: 'top' },
  
  submitBtn: { backgroundColor: '#00B14F', padding: 18, borderRadius: 15, marginTop: 5, alignItems: 'center' },
  submitText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  
  manageSection: { padding: 20 },
  manageCard: { 
    backgroundColor: 'white', 
    padding: 15, 
    borderRadius: 18, 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 12, 
    elevation: 2 
  },
  itemTitle: { fontSize: 16, fontWeight: '700', color: '#333' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginTop: 6, alignSelf: 'flex-start' },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  
  claimActionBtn: { backgroundColor: '#FF3B30', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  claimActionText: { color: 'white', fontWeight: 'bold', fontSize: 12 }
});