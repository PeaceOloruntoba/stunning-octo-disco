import { Stack } from "expo-router";

export default function CalendarStackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "Kalender",
          headerTitleStyle: { fontWeight: "bold" },
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
