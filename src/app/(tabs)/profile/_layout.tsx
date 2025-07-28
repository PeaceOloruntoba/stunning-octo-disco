// app/(tabs)/profile/_layout.tsx
import { Stack } from "expo-router";

export default function ProfileStackLayout() {
  return (
    <Stack>
      {/* The 'index' screen (profile/index.tsx) should not have a header */}
      <Stack.Screen name="index" options={{ headerShown: false }} />

      {/* All other sub-screens within the profile stack should have headers */}
      <Stack.Screen
        name="edit-profile"
        options={{
          headerShown: true, // Explicitly show header
          title: "Profil bearbeiten",
          headerTitleStyle: {
            fontWeight: "bold",
          }, // Hide "Back" text on iOS
        }}
      />
      <Stack.Screen
        name="impressum"
        options={{
          headerShown: true,
          title: "Impressum",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
      <Stack.Screen
        name="language"
        options={{
          headerShown: true,
          title: "Sprache",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
      <Stack.Screen
        name="payment-method"
        options={{
          headerShown: true,
          title: "Zahlungsart angeben",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
      <Stack.Screen
        name="receipts"
        options={{
          headerShown: true,
          title: "Zahlungsbelege",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
      <Stack.Screen
        name="rechtliches"
        options={{
          headerShown: true,
          title: "Rechtliches",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
    </Stack>
  );
}