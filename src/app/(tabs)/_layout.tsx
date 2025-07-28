import { Tabs } from "expo-router";
import { Image, View, Text } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E0E0E0",
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="events/index"
        options={{
          title: "Events",
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../assets/tab 1.png")
                  : require("../../assets/tab 1.png")
              }
              style={{ width: 24, height: 24 }}
            />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="search/index"
        options={{
          title: "Suchen",
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../assets/tab 1.png")
                  : require("../../assets/tab 1.png")
              }
              style={{ width: 24, height: 24 }}
            />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="calendar/index"
        options={{
          title: "Kalender",
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../assets/tab 1.png")
                  : require("../../assets/tab 1.png")
              }
              style={{ width: 24, height: 24 }}
            />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="favourites/index"
        options={{
          title: "Favourites",
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../assets/tab 1.png")
                  : require("../../assets/tab 1.png")
              }
              style={{ width: 24, height: 24 }}
            />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profil",
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../assets/tab 1.png")
                  : require("../../assets/tab 1.png")
              }
              style={{ width: 24, height: 24 }}
            />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
