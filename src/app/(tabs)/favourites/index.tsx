import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuthState } from "../../../hooks/auth";
import { useFavorites, useEvents } from "../../../hooks/events";

export default function FavouritesScreen() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthState();
  const {
    favoriteEventIds,
    loading: favLoading,
    error: favError,
  } = useFavorites(user);
  const { events, loading: eventsLoading, error: eventsError } = useEvents();

  const favoriteEvents = events.filter((event) =>
    favoriteEventIds.includes(event.id)
  );

  if (authLoading || favLoading || eventsLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-lg text-gray-700">
          Favoriten werden geladen...
        </Text>
      </View>
    );
  }

  if (favError || eventsError) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100 p-5">
        <Text className="text-lg text-red-500 text-center">
          Fehler beim Laden der Favoriten: {favError || eventsError}
        </Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100 p-5">
        <Text className="text-lg text-gray-700 text-center mb-5">
          Bitte melden Sie sich an, um Ihre Favoriten zu sehen.
        </Text>
        <TouchableOpacity
          className="bg-blue-500 py-3 px-6 rounded-lg"
          onPress={() => router.replace("/(auth)/login")}
        >
          <Text className="text-white font-bold">Jetzt einloggen</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="p-5">
        <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Deine Favoriten
        </Text>

        {favoriteEvents.length === 0 ? (
          <View className="flex-1 justify-center items-center p-10">
            <Ionicons
              name="heart-dislike-outline"
              size={80}
              color="gray"
              className="mb-4"
            />
            <Text className="text-lg text-gray-600 text-center">
              Du hast noch keine Favoriten hinzugefügt.
            </Text>
            <Text className="text-md text-gray-500 text-center mt-2">
              Finde Events, die dir gefallen, und füge sie hier hinzu!
            </Text>
            <TouchableOpacity
              className="bg-blue-500 py-3 px-6 rounded-lg mt-6"
              onPress={() => router.replace("/(tabs)/events")}
            >
              <Text className="text-white font-bold">Events entdecken</Text>
            </TouchableOpacity>
          </View>
        ) : (
          favoriteEvents.map((event) => (
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
                  <Ionicons name="location-outline" size={16} color="gray" />
                  <Text className="text-xs text-gray-600 ml-1">
                    {event.distance}
                  </Text>
                </View>
                <View className="flex-row items-center mt-1">
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text className="text-sm text-gray-700 ml-1">
                    {event.rating} ({event.reviewCount})
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
