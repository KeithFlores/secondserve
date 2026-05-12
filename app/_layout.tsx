import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="food-details" options={{ presentation: 'modal' }} />
      <Stack.Screen name="add-post" options={{ presentation: 'modal' }} />
    </Stack>
  );
}