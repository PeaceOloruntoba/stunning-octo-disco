import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import {
  useEvent,
  useFavorites,
  useParticipatedEvents,
} from "../../../hooks/events";
import { useAuthState } from "../../../hooks/auth";

const { width } = Dimensions.get("window");

const localStyles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default function EventDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const eventId = typeof id === "string" ? id : undefined;

  const { event, loading, error } = useEvent(eventId);
  const { user } = useAuthState();
  const {
    favoriteEventIds,
    loading: favLoading,
    toggleFavorite,
  } = useFavorites(user);
  const {
    addParticipatedEvent,
    loading: participateLoading,
    error: participateError,
  } = useParticipatedEvents(user);

  const isFavorite = eventId ? favoriteEventIds.includes(eventId) : false;

  const handleToggleFavorite = async () => {
    if (!user) {
      Alert.alert(
        "Anmeldung erforderlich",
        "Bitte melden Sie sich an, um Events zu favorisieren."
      );
      router.push("/(auth)/login");
      return;
    }
    if (eventId) {
      await toggleFavorite(eventId);
    }
  };

  const handleParticipate = async () => {
    if (!user) {
      Alert.alert(
        "Anmeldung erforderlich",
        "Bitte melden Sie sich an, um an Events teilzunehmen."
      );
      router.push("/(auth)/login");
      return;
    }
    if (!eventId) return;

    Alert.alert(
      "Zahlung für Event",
      `Möchtest du für "${event?.clubName}" teilnehmen? Preis: ${event?.price}`,
      [
        {
          text: "Abbrechen",
          style: "cancel",
        },
        {
          text: "Bezahlen (Simuliert)",
          onPress: async () => {
            console.log(`Simulating payment for event: ${eventId}`);

            await new Promise((resolve) => setTimeout(resolve, 1500));

            const success = await addParticipatedEvent(eventId, "upcoming");
            if (success) {
              Alert.alert(
                "Erfolg",
                "Du nimmst jetzt an diesem Event teil! Es wurde zu deinem Kalender hinzugefügt."
              );
              router.push("/(tabs)/calendar");
            } else {
              Alert.alert(
                "Fehler",
                participateError || "Teilnahme konnte nicht hinzugefügt werden."
              );
            }
          },
        },
      ]
    );
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={20}
          color="#FFD700"
        />
      );
    }
    return <View className="flex-row">{stars}</View>;
  };

  if (loading || favLoading || participateLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-lg text-gray-700">
          Eventdetails werden geladen...
        </Text>
      </View>
    );
  }

  if (error || !event) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50 p-5">
        <Text className="text-xl font-bold text-red-500">
          Event nicht gefunden!
        </Text>
        <Text className="text-gray-600 mt-2">{error}</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 px-4 py-2 bg-blue-500 rounded-md"
        >
          <Text className="text-white">Zurück</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView>
        {/* Event Image */}
        <Image
          source={{ uri: event.image }}
          className="w-full h-80 resize-cover"
        />

        {/* Top Header Icons (Heart and Close) */}
        <View className="absolute top-12 left-5 right-5 flex-row justify-between items-center z-10">
          <TouchableOpacity
            className="bg-white rounded-full p-2 shadow-md"
            onPress={handleToggleFavorite}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={30}
              color={isFavorite ? "#FF6347" : "black"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-white rounded-full p-2 shadow-md"
            onPress={() => router.back()}
          >
            <Ionicons name="close-circle" size={30} color="black" />
          </TouchableOpacity>
        </View>

        <View className="p-5 -mt-20 z-10 bg-gray-50 rounded-t-3xl">
          <Text className="text-3xl font-bold text-gray-800 mb-2">
            {event.clubName}
          </Text>
          <Text className="text-base text-gray-600 mb-4">
            {event.eventType}
          </Text>

          {/* Price, Distance, Rating */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-2xl font-bold text-gray-800">
              {event.price}
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="location-outline" size={20} color="gray" />
              <Text className="text-base text-gray-600 ml-1">
                {event.distance}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                router.push(`/events/organizer/${event.organizerId}`)
              }
            >
              <View className="flex-row items-center">
                {renderStars(event.rating)}
                <Text className="text-sm text-gray-600 ml-2">
                  {event.reviewCount} Bewertungen
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Event Information */}
          <Text className="text-lg font-semibold text-gray-700 mb-3">
            Eventinformationen
          </Text>
          {event.firstDrinkFree && (
            <View className="flex-row items-center mb-2">
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="green"
              />
              <Text className="text-base text-gray-800 ml-2">
                Erstes Getränk ist kostenlos
              </Text>
            </View>
          )}
          <Text className="text-base text-gray-700 mt-2">
            {event.description}
          </Text>

          {/* Standort (Location) */}
          <Text className="text-lg font-semibold text-gray-700 mt-4 mb-3">
            Standort
          </Text>
          <Text className="text-base text-gray-800 mb-2">
            {event.locationName}
          </Text>
          <View className="w-full h-52 rounded-md overflow-hidden border border-gray-200 mb-4">
            <MapView
              style={localStyles.map}
              initialRegion={{
                latitude: event.latitude,
                longitude: event.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
            >
              {typeof event.latitude === "number" &&
                typeof event.longitude === "number" && (
                  <Marker
                    coordinate={{
                      latitude: event.latitude,
                      longitude: event.longitude,
                    }}
                  />
                )}
            </MapView>
          </View>

          {/* Bedingungen (Conditions) */}
          <Text className="text-lg font-semibold text-gray-700 mt-4 mb-3">
            Bedingungen
          </Text>
          {event.conditions.map((condition, index) => (
            <View key={index} className="flex-row items-center mb-2">
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="green"
              />
              <Text className="text-base text-gray-800 ml-2">{condition}</Text>
            </View>
          ))}

          {/* Participate Button */}
          <TouchableOpacity
            className="w-full p-4 bg-black rounded-lg mt-8 mb-20 items-center justify-center"
            onPress={handleParticipate}
            disabled={participateLoading}
          >
            {participateLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">Teilnehmen</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
