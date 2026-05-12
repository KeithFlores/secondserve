import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

export default function AddPostScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [store, setStore] = useState('');
  const [category, setCategory] = useState('Meals');
  const [image, setImage] = useState<string | null>(null);
  const [coords, setCoords] = useState<any>(null);

  const categories = ['Meals', 'Drinks', 'Snacks', 'Breads'];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let loc = await Location.getCurrentPositionAsync({});
        setCoords(loc.coords);
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ 
      allowsEditing: true, 
      aspect: [4, 3], 
      quality: 0.5 
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handlePost = async () => {
    if (!title || !store || !image || !coords) {
      return Alert.alert("Error", "Please provide a photo, title, store, and allow GPS.");
    }
    
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // 1. Process Image for Supabase
      const ext = image.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}.${ext}`;
      
      // Convert URI to ArrayBuffer (Supabase JS preferred method)
      const response = await fetch(image);
      const blob = await response.blob();
      const arrayBuffer = await new Response(blob).arrayBuffer();

      const { error: uploadError } = await supabase.storage
        .from('food_uploads')
        .upload(fileName, arrayBuffer, {
          contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
          upsert: true
        });

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: urlData } = supabase.storage.from('food_uploads').getPublicUrl(fileName);

      // 3. Insert to Database
      const { error: dbError } = await supabase.from('donations').insert([{ 
        title, 
        store, 
        category, 
        latitude: coords.latitude, 
        longitude: coords.longitude, 
        user_id: user?.id, 
        status: 'Available', 
        image_url: urlData.publicUrl 
      }]);

      if (dbError) throw dbError;
      
      Alert.alert("Success", "Food listed for rescue!");
      router.replace('/(tabs)');
    } catch (e: any) { 
      Alert.alert("Error", e.message); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="close" size={28} /></TouchableOpacity>
        <Text style={styles.title}>New Post</Text>
        <View style={{ width: 28 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <TouchableOpacity style={styles.imgPicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={{ width: '100%', height: '100%', borderRadius: 20 }} />
          ) : (
            <View style={{ alignItems: 'center' }}>
              <Ionicons name="camera" size={40} color="#00B14F" />
              <Text style={{ color: '#00B14F', fontWeight: '600', marginTop: 5 }}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>
        <TextInput placeholder="Food Name (e.g. 3 Bento Boxes)" style={styles.input} value={title} onChangeText={setTitle} />
        <TextInput placeholder="Store Name" style={styles.input} value={store} onChangeText={setStore} />
        <Text style={{ marginBottom: 10, fontWeight: '600' }}>Category</Text>
        <View style={styles.catRow}>
          {categories.map(cat => (
            <TouchableOpacity key={cat} style={[styles.catBtn, category === cat && styles.catBtnActive]} onPress={() => setCategory(cat)}>
              <Text style={{ color: category === cat ? 'white' : 'gray', fontWeight: '600' }}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.btn} onPress={handlePost} disabled={loading}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.btnText}>POST FOR RESCUE</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center', paddingTop: 40 },
  title: { fontSize: 20, fontWeight: 'bold' },
  imgPicker: { width: '100%', height: 220, backgroundColor: '#F0F9F4', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderStyle: 'dashed', borderWidth: 2, borderColor: '#00B14F' },
  input: { backgroundColor: '#F8F9FA', padding: 18, borderRadius: 12, marginBottom: 15, fontSize: 16 },
  catRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  catBtn: { paddingVertical: 10, paddingHorizontal: 15, backgroundColor: '#EEE', borderRadius: 20, marginRight: 10, marginBottom: 10 },
  catBtnActive: { backgroundColor: '#00B14F' },
  btn: { backgroundColor: '#00B14F', padding: 20, borderRadius: 15, alignItems: 'center', marginTop: 10 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});