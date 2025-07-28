import { Stack } from "expo-router";

export default function ProfileStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="edit-profile"
        options={{
          headerShown: true,
          title: "Profil bearbeiten",
          headerTitleStyle: {
            fontWeight: "bold",
          },
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
