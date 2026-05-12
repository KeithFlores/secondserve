import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useFocusEffect } from 'expo-router';

export default function ActivityScreen() {
  const [activeTab, setActiveTab] = useState('Posted'); 
  const [items, setItems] = useState<any[]>([]);

  const fetchActivity = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    let query = supabase.from('donations').select('*');
    
    if (activeTab === 'Posted') query = query.eq('user_id', user?.id);
    else query = query.eq('claimed_by', user?.id);

    const { data } = await query.order('created_at', { ascending: false });
    setItems(data || []);
  };

  useFocusEffect(useCallback(() => { fetchActivity(); }, [activeTab]));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity style={[styles.tab, activeTab === 'Posted' && styles.activeTab]} onPress={() => setActiveTab('Posted')}>
          <Text style={activeTab === 'Posted' ? styles.activeTabText : styles.tabText}>You Posted</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'Claimed' && styles.activeTab]} onPress={() => setActiveTab('Claimed')}>
          <Text style={activeTab === 'Claimed' ? styles.activeTabText : styles.tabText}>You Reserved</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image_url }} style={styles.img} />
            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.status}>{item.status}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  tabBar: { flexDirection: 'row', backgroundColor: 'white', padding: 10, paddingTop: 50 },
  tab: { flex: 1, alignItems: 'center', padding: 10 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#00B14F' },
  tabText: { color: 'gray' },
  activeTabText: { color: '#00B14F', fontWeight: 'bold' },
  card: { flexDirection: 'row', backgroundColor: 'white', margin: 10, padding: 15, borderRadius: 10, elevation: 2 },
  img: { width: 50, height: 50, borderRadius: 5 },
  info: { marginLeft: 15 },
  title: { fontWeight: 'bold' },
  status: { color: '#00B14F', fontSize: 12 }
});