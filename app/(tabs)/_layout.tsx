import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        tabBarActiveTintColor: '#00B14F', 
        headerShown: false,
        tabBarStyle: { height: 65, paddingBottom: 10 } 
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }) => <Ionicons name="fast-food" size={24} color={color} /> }} />
      <Tabs.Screen name="reserved" options={{ title: 'Reserved', tabBarIcon: ({ color }) => <Ionicons name="bookmark" size={24} color={color} /> }} />
      <Tabs.Screen name="explore" options={{ title: 'Nearby', tabBarIcon: ({ color }) => <Ionicons name="map" size={24} color={color} /> }} />
      <Tabs.Screen name="post" options={{ title: 'Post', tabBarIcon: ({ color }) => <Ionicons name="add-circle" size={32} color={color} /> }} />
      <Tabs.Screen name="activity" options={{ title: 'Activity', tabBarIcon: ({ color }) => <Ionicons name="receipt" size={24} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Account', tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} /> }} />
    </Tabs>
  );
}