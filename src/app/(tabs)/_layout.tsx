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
          fontSize: 0,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="events/index"
        options={{
          title: "",
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
          title: "",
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../assets/tab 2.png")
                  : require("../../assets/tab 2.png")
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
          title: "",
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../assets/tab 3.png")
                  : require("../../assets/tab 3.png")
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
          title: "",
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../assets/tab 4.png")
                  : require("../../assets/tab 4.png")
              }
              style={{ width: 24, height: 24 }}
            />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../assets/tab 5.png")
                  : require("../../assets/tab 5.png")
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
