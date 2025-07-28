// app/(tabs)/events/_layout.tsx
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { TouchableOpacity, View } from "react-native"; // Import View for headerRight/Left

export default function EventsStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: true,
          title: "Clubname", // Placeholder, ideally dynamic from event data
          headerTitleStyle: { fontWeight: "bold" }, // Still a direct style property for React Navigation
          headerRight: () => (
            // Heart icon on the top right
            // The `TouchableOpacity` already handles the `onPress` for the favorite toggle
            // The actual icon's size and color are set directly, and margin applied via className
            <View className="mr-4">
              <Ionicons name="heart-outline" size={24} color="black" />
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="organizer/[id]"
        options={{
          headerShown: true,
          title: "Veranstalter", // As per 4.png
          headerTitleStyle: { fontWeight: "bold" }, // Still a direct style property
          headerRight: () => (
            // Plus icon on the top right (for adding review via modal)
            // The `TouchableOpacity` for opening the modal will be handled in the screen component
            <View className="mr-4">
              <Ionicons name="add-circle-outline" size={30} color="black" />
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="preferences"
        options={{
          headerShown: true,
          title: "Welche Events mache dir Spaß?", // As per Step 05.png
          headerTitleStyle: { fontWeight: "bold" }, // Still a direct style property
          headerLeft: () => null, // Hide back button as per design, shows 'X' button
          headerRight: () => (
            // Close (X) button on the top right as seen in Step 05.png
            <TouchableOpacity
              onPress={() => router.back()} // Or navigate to a specific screen
              className="mr-4" // Apply margin with Tailwind
            >
              <Ionicons name="close-circle" size={30} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
