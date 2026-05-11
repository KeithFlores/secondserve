import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="food-details" options={{ headerShown: false, presentation: 'modal' }} />
    </Stack>
  );
}