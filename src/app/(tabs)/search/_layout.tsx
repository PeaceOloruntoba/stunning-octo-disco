// app/(tabs)/search/_layout.tsx
import { Stack } from "expo-router";

export default function SearchStackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: true,
          title: "Event Details",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
    </Stack>
  );
}
