import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../lib/supabase';

const CATEGORIES = ['Meals', 'Pastries', 'Salads', 'Drinks'];

export default function PostFoodScreen() {
  const [title, setTitle] = useState('');
  const [store, setStore] = useState('');
  const [category, setCategory] = useState('Meals');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [myListings, setMyListings] = useState<any[]>([]);
  const [fetchingListings, setFetchingListings] = useState(true);

  const fetchMyListings = async () => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyListings(data || []);
    } catch (error: any) {
      console.error('Fetch error:', error.message);
    } finally {
      setFetchingListings(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Available' ? 'Claimed' : 'Available';
    try {
      const { error } = await supabase
        .from('donations')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      fetchMyListings();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    Alert.alert(
      "Delete Listing",
      "Are you sure you want to delete this donation? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              const fileName = imageUrl.split('/').pop();
              if (fileName) {
                await supabase.storage.from('food_uploads').remove([fileName]);
              }

              const { error } = await supabase
                .from('donations')
                .delete()
                .eq('id', id);

              if (error) throw error;
              fetchMyListings();
            } catch (error: any) {
              Alert.alert("Error", error.message);
            }
          } 
        }
      ]
    );
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Denied", "We need access to your photos!");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePost = async () => {
    if (!title || !store || !image) {
      return Alert.alert("Missing Info", "Please provide a photo, title, and store name.");
    }
    setLoading(true);
    try {
      const ext = image.split('.').pop();
      const fileName = `${Date.now()}.${ext}`;
      const formData = new FormData();
      formData.append('file', {
        uri: image,
        name: fileName,
        type: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
      } as any);

      const { error: uploadError } = await supabase.storage
        .from('food_uploads')
        .upload(fileName, formData);

      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from('food_uploads').getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('donations')
        .insert([{ title, store, category, image_url: urlData.publicUrl, status: 'Available' }]);

      if (dbError) throw dbError;
      Alert.alert("Success!", "Your food donation is now live.");
      setTitle(''); setStore(''); setImage(null); setCategory('Meals');
      fetchMyListings();
    } catch (error: any) {
      Alert.alert("Upload Error", error.message);
    } finally {
      setLoading(false);
    }
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
          
          <Text style={styles.inputLabel}>Food Photo</Text>
          <TouchableOpacity style={styles.photoUpload} onPress={pickImage} disabled={loading}>
            {image ? <Image source={{ uri: image }} style={styles.previewImage} /> : (
              <>
                <View style={styles.cameraCircle}><Ionicons name="camera" size={32} color="#00B14F" /></View>
                <Text style={styles.uploadText}>Add Photo</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.inputLabel}>Food Name</Text>
          <TextInput style={styles.input} placeholder="e.g. 1 Dozen Cupcakes" value={title} onChangeText={setTitle} />
          
          <Text style={styles.inputLabel}>Restaurant / Store Name</Text>
          <TextInput style={styles.input} placeholder="e.g. Bakewell Davao" value={store} onChangeText={setStore} />

          <Text style={styles.inputLabel}>Select Category</Text>
          <View style={styles.categoryContainer}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity 
                key={cat} 
                onPress={() => setCategory(cat)}
                style={[styles.catPill, category === cat && styles.activePill]}
              >
                <Text style={[styles.catText, category === cat && styles.activeCatText]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handlePost} disabled={loading}>
            {loading ? <ActivityIndicator color="white" /> : <Text style={styles.submitText}>List for Rescue</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.manageSection}>
          <Text style={styles.sectionHeader}>Your Active Listings</Text>
          
          {fetchingListings ? (
            <ActivityIndicator size="small" color="#00B14F" />
          ) : (
            myListings.map((item) => (
              <View key={item.id} style={styles.manageCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemCategory}>{item.category}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: item.status === 'Available' ? '#00B14F15' : '#8E8E9315' }]}>
                    <View style={[styles.dot, { backgroundColor: item.status === 'Available' ? '#00B14F' : '#8E8E93' }]} />
                    <Text style={[styles.statusText, { color: item.status === 'Available' ? '#00B14F' : '#8E8E93' }]}>{item.status}</Text>
                  </View>
                </View>
                
                <View style={styles.actionColumn}>
                  <TouchableOpacity 
                    style={[styles.toggleBtn, { backgroundColor: item.status === 'Available' ? '#FF3B30' : '#00B14F' }]} 
                    onPress={() => handleToggleStatus(item.id, item.status)}
                  >
                    <Text style={styles.toggleBtnText}>
                      {item.status === 'Available' ? 'Mark Claimed' : 'Set Available'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.deleteBtn} 
                    onPress={() => handleDelete(item.id, item.image_url)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
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
  inputLabel: { fontSize: 14, fontWeight: '700', color: '#444', marginBottom: 12, marginLeft: 2 },
  photoUpload: { height: 160, backgroundColor: '#F9F9F9', borderRadius: 15, borderWidth: 1.5, borderColor: '#00B14F', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', marginBottom: 20, overflow: 'hidden' },
  previewImage: { width: '100%', height: '100%' },
  cameraCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center' },
  uploadText: { color: '#00B14F', fontWeight: 'bold', marginTop: 8, fontSize: 14 },
  input: { backgroundColor: '#F5F5F5', padding: 15, borderRadius: 12, fontSize: 16, marginBottom: 20, color: '#333' },
  categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 25 },
  catPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F0F0F0', borderWidth: 1, borderColor: '#E0E0E0' },
  activePill: { backgroundColor: '#00B14F', borderColor: '#00B14F' },
  catText: { fontSize: 14, fontWeight: '600', color: '#666' },
  activeCatText: { color: 'white' },
  submitBtn: { backgroundColor: '#00B14F', padding: 18, borderRadius: 15, marginTop: 5, alignItems: 'center' },
  submitText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  manageSection: { padding: 20 },
  manageCard: { backgroundColor: 'white', padding: 15, borderRadius: 18, flexDirection: 'row', alignItems: 'center', marginBottom: 12, elevation: 2 },
  itemTitle: { fontSize: 16, fontWeight: '700', color: '#333' },
  itemCategory: { fontSize: 12, color: '#8E8E93', marginBottom: 4 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginTop: 2, alignSelf: 'flex-start' },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  actionColumn: { alignItems: 'flex-end', gap: 8 },
  toggleBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, minWidth: 110, alignItems: 'center' },
  toggleBtnText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  deleteBtn: { padding: 8, backgroundColor: '#FFF0F0', borderRadius: 8 }
});