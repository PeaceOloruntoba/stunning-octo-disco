import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function EventsStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />{" "}
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: true,
          title: "Clubname",
          headerTitleStyle: { fontWeight: "bold" },
          headerRight: () => (
            <Ionicons
              name="heart-outline"
              size={24}
              color="black"
              style={{ marginRight: 15 }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="organizer/[id]"
        options={{
          headerShown: true,
          title: "Veranstalter",
          headerTitleStyle: { fontWeight: "bold" },
          headerRight: () => (
            <Ionicons
              name="add-circle-outline"
              size={30}
              color="black"
              style={{ marginRight: 15 }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="preferences"
        options={{
          headerShown: true,
          title: "Welche Events mache dir Spaß?",
          headerTitleStyle: { fontWeight: "bold" },
          headerLeft: () => null,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginRight: 15 }}
            >
              <Ionicons name="close-circle" size={30} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
