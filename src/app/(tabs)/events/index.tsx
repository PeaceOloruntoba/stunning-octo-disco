import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, Polyline } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEvents } from "../../../hooks/events";
import * as Location from "expo-location";

const { width } = Dimensions.get("window");

const localStyles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default function EventsScreen() {
  const router = useRouter();
  const { events, loading, error } = useEvents();
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [routes, setRoutes] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Fehler", "Standortzugriff verweigert.");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      // Fetch routes for all events
      if (events.length > 0 && location) {
        const newRoutes = await Promise.all(
          events.map(async (event) => {
            try {
              const response = await fetch(
                `https://api.openrouteservice.org/v2/directions/foot-walking?api_key=${process.env.EXPO_PUBLIC_OPENROUTESERVICE_API_KEY}&start=${location.coords.longitude},${location.coords.latitude}&end=${event.longitude},${event.latitude}`
              );
              const data = await response.json();
              return {
                eventId: event.id,
                coordinates: data.features[0].geometry.coordinates.map(
                  ([lon, lat]: [number, number]) => ({
                    latitude: lat,
                    longitude: lon,
                  })
                ),
              };
            } catch (err) {
              console.error(`Error fetching route for event ${event.id}:`, err);
              return null;
            }
          })
        );
        setRoutes(newRoutes.filter((route) => route !== null));
      }
    })();
  }, [events]);

  if (loading || !userLocation) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-lg text-gray-700">
          Events oder Standort werden geladen...
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

  const initialMapRegion = userLocation
    ? {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    : {
        latitude: 37.773972,
        longitude: -122.431297,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 w-full h-full">
        <MapView style={[localStyles.map]} initialRegion={initialMapRegion}>
          {userLocation && (
            <Marker
              coordinate={userLocation}
              title="Ihr Standort"
              pinColor="blue"
            />
          )}
          {events.map((event) => (
            <React.Fragment key={event.id}>
              <Marker
                coordinate={{
                  latitude: event.latitude,
                  longitude: event.longitude,
                }}
                title={event.clubName}
                description={`${event.price} für ${event.duration}`}
              />
              {routes.find((route) => route.eventId === event.id) && (
                <Polyline
                  coordinates={
                    routes.find((route) => route.eventId === event.id)!
                      .coordinates
                  }
                  strokeColor="#FF0000"
                  strokeWidth={3}
                />
              )}
            </React.Fragment>
          ))}
        </MapView>
        <View className="absolute top-12 left-5 right-5 flex-row items-center justify-between bg-white rounded-lg p-3 shadow-md">
          <View className="flex-row items-center mr-2">
            <Ionicons name="location-outline" size={20} color="#333" />
            <Text className="ml-1 text-base text-gray-700">
              Aktueller Standort
            </Text>
          </View>
          <View className="flex-row items-center bg-gray-100 rounded-md py-1 px-2">
            <Ionicons name="time-outline" size={20} color="#333" />
            <Text className="ml-1 text-sm text-gray-700">Jetzt</Text>
            <Ionicons name="chevron-down" size={16} color="#333" />
          </View>
          <TouchableOpacity
            className="bg-black rounded-md p-2 ml-2"
            onPress={() => console.log("Filter Pressed")}
          >
            <Ionicons name="filter-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View className="absolute bottom-0 w-full pb-3 bg-transparent">
          <Text className="text-base font-bold text-gray-600 self-center mb-3">
            {events.length} Events
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          >
            {events.map((event) => (
              <TouchableOpacity
                key={event.id}
                className="w-72 bg-white rounded-lg mx-2 shadow-md overflow-hidden"
                onPress={() => router.push(`/events/${event.id}`)}
              >
                <Image
                  source={{ uri: event.image }}
                  className="w-full h-40 resize-cover"
                />
                <View className="p-4">
                  <Text className="text-lg font-bold mb-1">
                    {event.clubName}
                  </Text>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-base font-bold text-gray-800">
                      {event.price}
                    </Text>
                    <Text className="text-sm text-gray-500 ml-1 flex-1">
                      für {event.duration}
                    </Text>
                    <View className="flex-row items-center bg-yellow-400 rounded-md px-1 py-0.5">
                      <Ionicons name="star" size={16} color="white" />
                      <Text className="ml-0.5 text-sm font-bold text-white">
                        {event.rating}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}
