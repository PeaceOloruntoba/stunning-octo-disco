import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUserProfile } from "../hooks/userProfile";
import { useAuthState } from "../hooks/auth";

const eventPreferencesData = [
  {
    category: "Techno / Elektro",
    subcategories: [
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
    subcategories: [
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
    category: "Ausstellungen & Museen",
    subcategories: [
      "Kunst",
      "Geschichte",
      "Wissenschaft",
      "Interaktiv",
      "Outdoor",
    ],
  },
  {
    category: "Sportevents",
    subcategories: [
      "Fußball",
      "Basketball",
      "Tennis",
      "Leichtathletik",
      "Wassersport",
      "Wintersport",
    ],
  },
  {
    category: "Kulinarisches & Gastronomie",
    subcategories: [
      "Streetfood",
      "Fine Dining",
      "Kochkurse",
      "Weinproben",
      "Bierfeste",
    ],
  },
  {
    category: "Workshops & Kurse",
    subcategories: ["Kreativ", "Business", "Sprachen", "Digital", "Gesundheit"],
  },
  {
    category: "Comedy & Kabarett",
    subcategories: ["Stand-Up", "Impro", "Politisch", "Musikalisch"],
  },
  {
    category: "Film & Kino",
    subcategories: [
      "Open Air Kino",
      "Film Festivals",
      "Dokumentationen",
      "Arthouse",
    ],
  },
];

export default function PreferencesScreen() {
  const router = useRouter();
  const { user } = useAuthState();
  const {
    updateUserProfile,
    loading: updateLoading,
    error: updateError,
  } = useUserProfile();

  const [selectedPreferences, setSelectedPreferences] = useState<{
    [category: string]: string[];
  }>({});

  const togglePreference = (category: string, subcategory: string) => {
    setSelectedPreferences((prev) => {
      const currentSelections = prev[category] || [];
      if (currentSelections.includes(subcategory)) {
        return {
          ...prev,
          [category]: currentSelections.filter((item) => item !== subcategory),
        };
      } else {
        return {
          ...prev,
          [category]: [...currentSelections, subcategory],
        };
      }
    });
  };

  const handleSavePreferences = async () => {
    if (!user) {
      Alert.alert("Fehler", "Benutzer nicht angemeldet.");
      router.replace("/(auth)/login");
      return;
    }

    const updates = {
      preferences: {
        categories: Object.keys(selectedPreferences).filter(
          (cat) => selectedPreferences[cat].length > 0
        ),
        subcategories: selectedPreferences,
      },
    };

    const success = await updateUserProfile(user.uid, updates);

    if (success) {
      Alert.alert("Erfolg", "Interessen gespeichert!");
      router.replace("/(tabs)/search");
    } else if (updateError) {
      Alert.alert(
        "Fehler",
        `Interessen konnten nicht gespeichert werden: ${updateError}`
      );
    } else {
      Alert.alert(
        "Fehler",
        "Unbekannter Fehler beim Speichern der Interessen."
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="p-5 pt-10">
        <TouchableOpacity
          className="self-end mb-5"
          onPress={() => router.replace("/(tabs)/search")}
        >
          <Ionicons name="close-circle-outline" size={30} color="gray" />
        </TouchableOpacity>

        <Text className="text-2xl font-bold mb-5 text-gray-800 text-left">
          Welche Events machen dir Spaß?
        </Text>
        <View className="flex-row items-center bg-yellow-50 rounded-lg p-4 mb-8 border border-yellow-200">
          <Ionicons
            name="information-circle-outline"
            size={20}
            color="#8A8A8A"
            className="mr-3"
          />
          <Text className="flex-1 text-sm text-gray-700">
            Du kannst jederzeit deine Interessen erweitern oder abwählen.
          </Text>
        </View>

        {eventPreferencesData.map((section, sectionIndex) => (
          <View key={sectionIndex} className="mb-6">
            <Text className="text-lg font-semibold mb-4 text-gray-700">
              {section.category}
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {section.subcategories.map((subcategory, subIndex) => {
                const isSelected = (
                  selectedPreferences[section.category] || []
                ).includes(subcategory);
                return (
                  <TouchableOpacity
                    key={subIndex}
                    className={`px-4 py-2 rounded-full border ${
                      isSelected
                        ? "bg-blue-200 border-blue-500"
                        : "bg-white border-gray-300"
                    }`}
                    onPress={() =>
                      togglePreference(section.category, subcategory)
                    }
                  >
                    <Text
                      className={`text-sm ${
                        isSelected ? "text-blue-800 font-bold" : "text-gray-700"
                      }`}
                    >
                      {subcategory}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        <TouchableOpacity
          className="bg-blue-600 py-4 rounded-lg items-center mt-8 mb-10 flex-row justify-center"
          onPress={handleSavePreferences}
          disabled={updateLoading}
        >
          <Text className="text-white text-lg font-bold mr-2">
            {updateLoading ? "Speichern..." : "Speichern"}
          </Text>
          <Ionicons name="chevron-forward" size={20} color="white" />
        </TouchableOpacity>

        {updateError && (
          <Text className="text-red-500 mt-4 text-center">{updateError}</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
