import React, { useState, useEffect } from "react";
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
import MapView, { Marker, Polyline } from "react-native-maps";
import {
  useEvent,
  useFavorites,
  useParticipatedEvents,
  checkPaymentExists,
} from "../../../hooks/events";
import { useAuthState } from "../../../hooks/auth";
import { StripeProvider } from "@stripe/stripe-react-native";
import { useStripePayment } from "../../../hooks/useStripePayment";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";

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
    participatedEvents,
  } = useParticipatedEvents(user);
  const { handlePayment, paymentLoading, hasPaid } = useStripePayment();
  const [mapExpanded, setMapExpanded] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const isFavorite = eventId ? favoriteEventIds.includes(eventId) : false;

  useEffect(() => {
    console.log(
      "[Stripe] Checking Stripe publishable key:",
      process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ? "Present" : "Missing"
    );
    const checkIfPaid = async () => {
      if (user && eventId) {
        console.log(
          `[Firebase] Checking if user ${user.uid} has paid for event ${eventId}`
        );
        const paid = await checkPaymentExists(user.uid, eventId);
        console.log(`[Firebase] Payment exists for event ${eventId}: ${paid}`);
      }
    };
    checkIfPaid();

    const getUserLocation = async () => {
      console.log("[Location] Requesting user location");
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("[Location] Permission denied");
          setLocationError("Standortzugriff verweigert.");
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        console.log("[Location] User location obtained:", location.coords);
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (err) {
        console.log(
          "[Location] Failed to get user location:",
          (err as Error).message
        );
        setLocationError("Standort konnte nicht abgerufen werden.");
      }
    };
    getUserLocation();
  }, [user, eventId]);

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
      console.log(`[Firebase] Toggling favorite for event ${eventId}`);
      await toggleFavorite(eventId);
    }
  };

  const handleParticipate = async () => {
    if (!eventId || !event) {
      console.log("[Stripe] Event ID or event data missing");
      Alert.alert("Fehler", "Eventdaten fehlen.");
      return;
    }

    if (participatedEvents.some((pe) => pe.eventId === eventId)) {
      Alert.alert("Fehler", "Du bist bereits für dieses Event angemeldet.");
      console.log("[Stripe] User already participating in event", eventId);
      return;
    }

    Alert.alert(
      "Zahlung für Event",
      `Möchtest du für "${event.clubName}" teilnehmen? Preis: ${event.price}`,
      [
        {
          text: "Abbrechen",
          style: "cancel",
        },
        {
          text: "Bezahlen",
          onPress: async () => {
            const success = await handlePayment(
              { price: event.price, clubName: event.clubName, id: eventId },
              user,
              addParticipatedEvent,
              participateError
            );
            if (success) {
              router.push("/(tabs)/calendar");
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

  const toggleMapSize = () => {
    setMapExpanded(!mapExpanded);
    console.log(`[UI] Map ${mapExpanded ? "collapsed" : "expanded"}`);
  };

  if (loading || favLoading || participateLoading || paymentLoading) {
    console.log("[UI] Rendering loading state");
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
    console.log("[UI] Rendering error state:", error);
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

  console.log("[UI] Rendering event details for:", event.clubName);
  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""}
    >
      <SafeAreaView className="flex-1 bg-gray-50">
        <ScrollView>
          <Image
            source={{ uri: event.image }}
            className="w-full h-80 resize-cover"
          />
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
            <Text className="text-lg font-semibold text-gray-700 mt-4 mb-3">
              Standort
            </Text>
            <Text className="text-base text-gray-800 mb-2">
              {event.locationName}
            </Text>
            {locationError && (
              <Text className="text-red-500 mb-2">{locationError}</Text>
            )}
            <View
              className={`w-full ${
                mapExpanded ? "h-96" : "h-52"
              } rounded-md overflow-hidden border border-gray-200 mb-4 relative`}
            >
              <MapView
                style={localStyles.map}
                initialRegion={{
                  latitude: event.latitude,
                  longitude: event.longitude,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }}
                scrollEnabled={mapExpanded}
                zoomEnabled={mapExpanded}
                rotateEnabled={mapExpanded}
                pitchEnabled={mapExpanded}
              >
                {typeof event.latitude === "number" &&
                  typeof event.longitude === "number" && (
                    <Marker
                      coordinate={{
                        latitude: event.latitude,
                        longitude: event.longitude,
                      }}
                      title={event.locationName}
                      description="Event Location"
                    />
                  )}
                {userLocation &&
                  typeof event.latitude === "number" &&
                  typeof event.longitude === "number" && (
                    <>
                      <Marker
                        coordinate={userLocation}
                        title="Dein Standort"
                        description="Aktueller Standort"
                        pinColor="blue"
                      />
                      <MapViewDirections
                        origin={userLocation}
                        destination={{
                          latitude: event.latitude,
                          longitude: event.longitude,
                        }}
                        apikey={
                          process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || ""
                        }
                        strokeWidth={3}
                        strokeColor="blue"
                        onError={(error) => {
                          console.log("[Map] Route error:", error);
                          Alert.alert(
                            "Fehler",
                            "Route konnte nicht geladen werden."
                          );
                        }}
                      />
                    </>
                  )}
              </MapView>
              <TouchableOpacity
                className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md"
                onPress={toggleMapSize}
              >
                <Ionicons
                  name={mapExpanded ? "contract" : "expand"}
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </View>
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
                <Text className="text-base text-gray-800 ml-2">
                  {condition}
                </Text>
              </View>
            ))}
            <TouchableOpacity
              className="w-full p-4 bg-black rounded-lg mt-8 mb-20 items-center justify-center"
              onPress={handleParticipate}
              disabled={participateLoading || paymentLoading || hasPaid}
            >
              {participateLoading || paymentLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-lg">
                  {hasPaid ? "Bereits bezahlt" : "Teilnehmen"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </StripeProvider>
  );
}
