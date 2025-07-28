import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import MapView, { Marker } from "react-native-maps";

const { width } = Dimensions.get("window");

const dummyEventDetails = {
  e1: {
    id: "e1",
    clubName: "Cafe Ideal Bar",
    eventType: "Rock / Party",
    price: "30 €",
    distance: "20km",
    rating: 4.8,
    reviewCount: 25,
    image: require("../../../assets/dummy_event.png"),
    firstDrinkFree: true,
    locationName: "Musterstraße, 53474 Ahrweiler",
    latitude: 37.769,
    longitude: -122.427,
    conditions: ["Über 18 Jahre alt und 2 Jahre Alkoholherfahrung"],
    organizerId: "org1",
  },
};

export default function EventDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const event = dummyEventDetails[id as string];

  if (!event) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50 p-5">
        <Text className="text-xl font-bold text-red-500">
          Event nicht gefunden!
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 px-4 py-2 bg-blue-500 rounded-md"
        >
          <Text className="text-white">Zurück</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

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

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <Image source={event.image} style={styles.eventImage} />

        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => console.log("Heart Pressed")}
          >
            <Ionicons name="heart-outline" size={30} color="#FF6347" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
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

          <Text className="text-lg font-semibold text-gray-700 mt-4 mb-3">
            Standort
          </Text>
          <Text className="text-base text-gray-800 mb-2">
            {event.locationName}
          </Text>
          <View style={styles.smallMapContainer}>
            <MapView
              style={styles.smallMap}
              initialRegion={{
                latitude: event.latitude,
                longitude: event.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
            >
              <Marker
                coordinate={{
                  latitude: event.latitude,
                  longitude: event.longitude,
                }}
              />
            </MapView>
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
              <Text className="text-base text-gray-800 ml-2">{condition}</Text>
            </View>
          ))}

          <TouchableOpacity className="w-full p-4 bg-black rounded-lg mt-8 mb-20 items-center justify-center">
            <Text className="text-white font-bold text-lg">Teilnehmen</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  eventImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  headerIcons: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconButton: {
    backgroundColor: "white",
    borderRadius: 50,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  smallMapContainer: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 10,
  },
  smallMap: {
    ...StyleSheet.absoluteFillObject,
  },
});
