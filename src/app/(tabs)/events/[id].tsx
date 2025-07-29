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
import MapView, { Marker } from "react-native-maps";
import {
  useEvent,
  useFavorites,
  useParticipatedEvents,
  checkPaymentExists,
} from "../../../hooks/events";
import { useAuthState } from "../../../hooks/auth";
import { StripeProvider, usePaymentSheet } from "@stripe/stripe-react-native";
import { loadStripe } from "@stripe/stripe-js";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";

const { width } = Dimensions.get("window");

const localStyles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

// Initialize Stripe.js with your secret key (FOR EDUCATIONAL PURPOSES ONLY)
const stripePromise = loadStripe("[your-stripe-publishable-key]");

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
  const { initPaymentSheet, presentPaymentSheet } = usePaymentSheet();
  const [mapExpanded, setMapExpanded] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);

  const isFavorite = eventId ? favoriteEventIds.includes(eventId) : false;

  useEffect(() => {
    const checkIfPaid = async () => {
      if (user && eventId) {
        const paid = await checkPaymentExists(user.uid, eventId);
        setHasPaid(paid);
      }
    };
    checkIfPaid();
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
    if (!eventId || !event) return;

    if (hasPaid || participatedEvents.some((pe) => pe.eventId === eventId)) {
      Alert.alert(
        "Fehler",
        "Du hast bereits für dieses Event bezahlt oder bist bereits teilnehmend."
      );
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
            setPaymentLoading(true);
            try {
              // Create Payment Intent in frontend (FOR EDUCATIONAL PURPOSES ONLY)
              const stripe = await stripePromise;
              if (!stripe) {
                throw new Error("Stripe.js konnte nicht initialisiert werden.");
              }

              const amount = Math.round(
                parseFloat(event.price.replace(/[^0-9.]/g, "")) * 100
              ); // Convert to cents
              const response = await fetch(
                "https://api.stripe.com/v1/payment_intents",
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer [your-stripe-secret-key]`, // INSECURE: DO NOT USE IN PRODUCTION
                    "Content-Type": "application/x-www-form-urlencoded",
                  },
                  body: new URLSearchParams({
                    amount: amount.toString(),
                    currency: "eur",
                    payment_method_types: "card",
                  }).toString(),
                }
              );

              const { client_secret: clientSecret } = await response.json();

              if (!clientSecret) {
                Alert.alert(
                  "Fehler",
                  "Zahlung konnte nicht initialisiert werden."
                );
                return;
              }

              // Initialize PaymentSheet
              const { error: initError } = await initPaymentSheet({
                paymentIntentClientSecret: clientSecret,
                merchantDisplayName: "Eventura",
              });

              if (initError) {
                Alert.alert(
                  "Fehler",
                  `Zahlung initialisieren fehlgeschlagen: ${initError.message}`
                );
                return;
              }

              // Present PaymentSheet
              const { error: paymentError } = await presentPaymentSheet();

              if (paymentError) {
                Alert.alert(
                  "Fehler",
                  `Zahlung fehlgeschlagen: ${paymentError.message}`
                );
                return;
              }

              // Store payment details in Firebase
              const paymentDocRef = doc(db, "payments", clientSecret);
              await setDoc(paymentDocRef, {
                paymentId: clientSecret,
                userId: user.uid,
                eventId,
                amount: amount / 100, // Store in euros
                currency: "eur",
                status: "succeeded",
                timestamp: new Date().toISOString(),
              });

              // Add to participated events
              const success = await addParticipatedEvent(eventId, "upcoming", {
                paymentId: clientSecret,
                amount: amount / 100,
                currency: "eur",
                status: "succeeded",
              });

              if (success) {
                Alert.alert(
                  "Erfolg",
                  "Du nimmst jetzt an diesem Event teil! Es wurde zu deinem Kalender hinzugefügt."
                );
                router.push("/(tabs)/calendar");
              } else {
                Alert.alert(
                  "Fehler",
                  participateError ||
                    "Teilnahme konnte nicht hinzugefügt werden."
                );
              }
            } catch (err) {
              Alert.alert(
                "Fehler",
                `Zahlungsprozess fehlgeschlagen: ${(err as Error).message}`
              );
            } finally {
              setPaymentLoading(false);
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
  };

  if (loading || favLoading || participateLoading || paymentLoading) {
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
    <StripeProvider publishableKey="[your-stripe-publishable-key]">
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
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
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
                    />
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
