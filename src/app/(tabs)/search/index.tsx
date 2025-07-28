import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEvents } from "../../../hooks/events";

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { events, loading, error } = useEvents();

  const filteredEvents = useMemo(() => {
    if (!searchQuery) {
      return events;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return events.filter(
      (event) =>
        event.clubName.toLowerCase().includes(lowerCaseQuery) ||
        event.eventType.toLowerCase().includes(lowerCaseQuery) ||
        event.locationName.toLowerCase().includes(lowerCaseQuery)
    );
  }, [events, searchQuery]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-lg text-gray-700">
          Events werden geladen...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100 p-5">
        <Text className="text-lg text-red-500 text-center">
          Fehler beim Laden der Events: {error}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-5 pb-0">
        {/* Search Bar */}
        <View className="flex-row items-center bg-white rounded-lg p-3 shadow-md mb-5">
          <Ionicons name="search-outline" size={20} color="gray" />
          <TextInput
            className="flex-1 ml-2 text-base text-gray-800"
            placeholder="Eventname, Typ, Ort..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="gray" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView className="px-5">
        {filteredEvents.length === 0 && searchQuery.length > 0 ? (
          <View className="flex-1 justify-center items-center p-10 mt-10">
            <Ionicons
              name="alert-circle-outline"
              size={80}
              color="gray"
              className="mb-4"
            />
            <Text className="text-lg text-gray-600 text-center">
              Keine Ergebnisse gefunden für "{searchQuery}".
            </Text>
            <Text className="text-md text-gray-500 text-center mt-2">
              Versuche eine andere Suche.
            </Text>
          </View>
        ) : (
          filteredEvents.map((event) => (
            <TouchableOpacity
              key={event.id}
              className="flex-row bg-white rounded-lg shadow-sm mb-4 p-3 items-center border border-gray-200"
              onPress={() => router.push(`/events/${event.id}`)}
            >
              <Image
                source={{ uri: event.image }}
                className="w-24 h-24 rounded-lg mr-4"
              />
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-800 mb-1">
                  {event.clubName}
                </Text>
                <Text className="text-sm text-gray-600 mb-1">
                  {event.eventType}
                </Text>
                <View className="flex-row items-center">
                  <Ionicons name="calendar-outline" size={16} color="gray" />
                  <Text className="text-xs text-gray-600 ml-1">
                    {new Date(event.eventDate).toLocaleDateString("de-DE", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </Text>
                </View>
                <View className="flex-row items-center mt-1">
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text className="text-sm text-gray-700 ml-1">
                    {event.rating}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color="gray" />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
