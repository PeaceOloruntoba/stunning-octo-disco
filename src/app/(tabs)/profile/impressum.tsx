import React from "react";
import { View, Text, SafeAreaView } from "react-native";

export default function ImpressumScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center p-5">
      <Text className="text-xl font-bold text-gray-800 mb-4">
        Zahlungsbelege
      </Text>
      <Text className="text-gray-600 text-center">
        Hier werden deine Zahlungsbelege angezeigt.
      </Text>
    </SafeAreaView>
  );
}
