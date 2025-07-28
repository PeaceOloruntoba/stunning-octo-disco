// app/(tabs)/events/preferences.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Define categories and interests
const interestsData = [
  {
    category: "Techno / Elektro",
    tags: [
      "Rock",
      "Romantik",
      "Orgie",
      "Date",
      "GOA",
      "EDM",
      "Party",
      "Business",
      "Sport",
    ],
  },
  {
    category: "Konzerte und Festivals",
    tags: [
      "Rock",
      "Romantik",
      "Orgie",
      "Date",
      "GOA",
      "EDM",
      "Party",
      "Business",
      "Sport",
    ],
  },
  // Add more categories as needed
];

export default function EventPreferencesScreen() {
  const router = useRouter();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

  const handleSave = () => {
    // Here you would typically save these preferences to your backend
    Alert.alert(
      "Interessen gespeichert",
      `Ausgewählte Interessen: ${selectedInterests.join(", ")}`
    );
    router.back(); // Or navigate to another screen
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="p-5">
        {/* Close Button (already defined in _layout, but keeping here for context if needed for standalone) */}
        {/* <View className="absolute top-5 right-5 z-10">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-gray-200 rounded-full">
            <Ionicons name="close-outline" size={24} color="black" />
          </TouchableOpacity>
        </View> */}

        <Text className="text-3xl font-bold text-gray-800 mb-4 mt-8">
          Welche Events mache dir Spaß?
        </Text>

        {/* Info Box */}
        <View className="flex-row items-center bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
          <Ionicons
            name="information-circle-outline"
            size={20}
            color="#D97706"
            className="mr-3"
          />
          <Text className="text-sm text-yellow-800 flex-1">
            Du kannst jederzeit deine Interessen erweitern oder abwählen.
          </Text>
        </View>

        {/* Interest Categories */}
        {interestsData.map((categoryData, index) => (
          <View key={index} className="mb-8">
            <Text className="text-xl font-semibold text-gray-800 mb-4">
              {categoryData.category}
            </Text>
            <View className="flex-row flex-wrap">
              {categoryData.tags.map((tag) => {
                const isSelected = selectedInterests.includes(tag);
                return (
                  <TouchableOpacity
                    key={tag}
                    className={`px-4 py-2 rounded-full border-2 mr-3 mb-3 ${
                      isSelected
                        ? "bg-blue-500 border-blue-500"
                        : "bg-white border-gray-300"
                    }`}
                    onPress={() => toggleInterest(tag)}
                  >
                    <Text
                      className={`font-semibold ${
                        isSelected ? "text-white" : "text-gray-700"
                      }`}
                    >
                      {tag}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        {/* Save Button */}
        <TouchableOpacity
          className="w-full p-4 bg-blue-500 rounded-lg flex-row justify-center items-center mt-10 mb-20"
          onPress={handleSave}
        >
          <Text className="text-white text-center font-bold text-lg mr-2">
            Speichern
          </Text>
          <Ionicons name="arrow-forward-outline" size={20} color="white" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
