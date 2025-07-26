import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Page() {
  return (
    <View className="flex flex-1">
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold">Welcome to Expo Router!</Text>
        <Link href="/(tabs)/home" className="mt-4 text-blue-500">
          Go to Home
        </Link>
      </View>
      <View className="p-4 bg-gray-100">
        <Text className="text-sm text-gray-600">
          This is a simple example of using Expo Router with React Native.
        </Text>
      </View>
    </View>
  );
}

