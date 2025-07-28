// app/(tabs)/profile/_layout.tsx
import { Stack } from "expo-router";

export default function ProfileStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
      <Stack.Screen name="impressum" options={{ headerShown: false }} />
      <Stack.Screen name="language" options={{ headerShown: false }} />
      <Stack.Screen name="payment-method" options={{ headerShown: false }} />
      <Stack.Screen name="receipts" options={{ headerShown: false }} />
      <Stack.Screen name="rechtliches" options={{ headerShown: false }} />
    </Stack>
  );
}
