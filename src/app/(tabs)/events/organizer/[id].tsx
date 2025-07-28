import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";

const dummyOrganizers = {
  org1: {
    id: "org1",
    name: "Jackie Forman",
    rating: 5.0,
    reviewCount: 25,
    profilePic: require("../../../../assets/default-profile.png"),
    reviews: [
      {
        id: "rev1",
        reviewer: "User A",
        text: "Take as many pixel-perfect UI elements as you want and style them the way you need in a fraction of the time.",
        reviewerPic: require("../../../../assets/default-profile.png"),
      },
      {
        id: "rev2",
        reviewer: "User B",
        text: "Take as many pixel-perfect UI elements as you want and style them the way you need in a fraction of the time.",
        reviewerPic: require("../../../../assets/default-profile.png"),
      },
      {
        id: "rev3",
        reviewer: "User C",
        text: "Take as many pixel-perfect UI elements as you want and style them the way you need in a fraction of the time.",
        reviewerPic: require("../../../../assets/default-profile.png"),
      },
      {
        id: "rev4",
        reviewer: "User D",
        text: "Take as many pixel-perfect UI elements as you want and style them the way you need in a fraction of the time.",
        reviewerPic: require("../../../../assets/default-profile.png"),
      },
    ],
  },
};

export default function OrganizerScreen() {
  const { id } = useLocalSearchParams();
  const organizer = dummyOrganizers[id as string];

  if (!organizer) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50 p-5">
        <Text className="text-xl font-bold text-red-500">
          Veranstalter nicht gefunden!
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="p-5">
        <View className="items-center mb-8 mt-5">
          {/* Rating and Reviews Header */}
          <View className="flex-row justify-center items-center w-full mb-8">
            <View className="items-center mx-4">
              <Text className="text-4xl font-bold text-yellow-500 mb-1">
                {organizer.rating}
              </Text>
              <Text className="text-lg text-gray-700">Bewertung</Text>
            </View>
            <View className="items-center mx-4">
              <Text className="text-4xl font-bold text-gray-800 mb-1">
                {organizer.reviewCount}
              </Text>
              <Text className="text-lg text-gray-700">Stimmen</Text>
            </View>
          </View>
        </View>

        {/* Reviews Section */}
        <Text className="text-lg font-semibold text-gray-700 mb-4">
          Bewertungen
        </Text>
        {organizer.reviews.map((review) => (
          <View
            key={review.id}
            className="bg-white rounded-xl shadow-sm p-4 mb-4 border border-gray-200"
          >
            <Text className="text-gray-800 text-base mb-3">{review.text}</Text>
            <View className="flex-row items-center">
              <Image
                source={review.reviewerPic}
                className="w-10 h-10 rounded-full mr-3"
              />
              <Text className="text-base font-semibold text-blue-600">
                {review.reviewer}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
