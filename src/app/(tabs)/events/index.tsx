// app/(tabs)/events/index.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

// Dummy Event Data for demonstration
const dummyEvents = [
  {
    id: "e1",
    name: "Cafe Ideal Bar",
    price: "30 €",
    duration: "2 std",
    rating: 5.0,
    thumbnail: require("../../../assets/dummy_event.png"), // You'll need an image here
    latitude: 37.765, // Example coordinates within the map area
    longitude: -122.428,
  },
  {
    id: "e2",
    name: "Another Event",
    price: "25 €",
    duration: "3 std",
    rating: 4.5,
    thumbnail: require("../../../assets/dummy_event.png"), // Another image
    latitude: 37.77,
    longitude: -122.435,
  },
  {
    id: "e3",
    name: "Tech Night",
    price: "15 €",
    duration: "1 std",
    rating: 4.0,
    thumbnail: require("../../../assets/dummy_event.png"), // Another image
    latitude: 37.775,
    longitude: -122.42,
  },
];

export default function EventsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Map View Section */}
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.773972, // Centered around San Francisco, as in 1.jpg
            longitude: -122.431297,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {dummyEvents.map((event) => (
            <Marker
              key={event.id}
              coordinate={{
                latitude: event.latitude,
                longitude: event.longitude,
              }}
              title={event.name}
              description={`${event.price} for ${event.duration}`}
            />
          ))}
          {/* Example blue marker from 1.jpg */}
          <Marker
            coordinate={{ latitude: 37.772, longitude: -122.42 }}
            pinColor="blue" // Example for the blue dot
          />
        </MapView>

        {/* Top Header/Search Bar */}
        <View style={styles.header}>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={20} color="#333" />
            <Text style={styles.locationText}>Aktueller Standort</Text>
          </View>
          <View style={styles.dateTimeContainer}>
            <Ionicons name="time-outline" size={20} color="#333" />
            <Text style={styles.dateTimeText}>Jetzt</Text>
            <Ionicons name="chevron-down" size={16} color="#333" />
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => console.log("Filter Pressed")}
          >
            <Ionicons name="filter-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Event List at the Bottom */}
        <View style={styles.eventListContainer}>
          <Text style={styles.eventCountText}>3 Events</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.eventScrollViewContent}
          >
            {dummyEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={styles.eventCard}
                onPress={() => router.push(`/events/${event.id}`)} // Navigate to event details
              >
                <Image source={event.thumbnail} style={styles.eventThumbnail} />
                <View style={styles.eventCardContent}>
                  <Text style={styles.eventName}>{event.name}</Text>
                  <View style={styles.eventPriceRating}>
                    <Text style={styles.eventPrice}>{event.price}</Text>
                    <Text style={styles.eventDuration}>
                      für {event.duration}
                    </Text>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={16} color="#FFD700" />
                      <Text style={styles.ratingText}>{event.rating}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    position: "absolute",
    top: 50, // Adjust as needed for SafeAreaView
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  locationText: {
    marginLeft: 5,
    fontSize: 16,
    color: "#333",
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  dateTimeText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#555",
  },
  filterButton: {
    backgroundColor: "black",
    borderRadius: 8,
    padding: 8,
  },
  eventListContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingVertical: 10,
    backgroundColor: "transparent", // Make it transparent so map is visible
  },
  eventCountText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    alignSelf: "center",
    marginBottom: 10,
  },
  eventScrollViewContent: {
    paddingHorizontal: 10,
  },
  eventCard: {
    width: width * 0.7, // Card width, adjust as needed
    backgroundColor: "white",
    borderRadius: 15,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    overflow: "hidden", // Ensures image respects borderRadius
  },
  eventThumbnail: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  eventCardContent: {
    padding: 15,
  },
  eventName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  eventPriceRating: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  eventPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  eventDuration: {
    fontSize: 14,
    color: "gray",
    marginLeft: 5,
    flex: 1, // Allow duration to take remaining space
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFD700", // Gold background for rating
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  ratingText: {
    marginLeft: 3,
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
});
