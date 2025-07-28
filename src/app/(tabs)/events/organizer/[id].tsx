// app/(tabs)/events/organizer/[id].tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useOrganizer, useAddReview } from "../../../../hooks/events";
import { useAuthState } from "../../../../hooks/auth";

export default function OrganizerScreen() {
  const { id } = useLocalSearchParams();
  const organizerId = typeof id === "string" ? id : undefined;

  const { organizer, loading, error } = useOrganizer(organizerId);
  const { user } = useAuthState();
  const {
    addReview,
    loading: reviewLoading,
    error: reviewError,
    success: reviewSuccess,
  } = useAddReview();

  const [isReviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  // Handle the "+" icon press to open the modal
  React.useLayoutEffect(() => {
    if (organizerId) {
      // Ensure this is only set when the organizer screen is active
      // Access the router directly for header options
      // This part is specific to Expo Router v3+ / React Navigation v6+
      // For earlier versions, you might need to use `navigation.setOptions` from a `useNavigation` hook.
      if (typeof id === "string") {
        // Re-check id type for safety
        router.setParams({
          // The 'add' icon in the headerRight is now a direct part of this component's logic
          // and controlled by this component.
          // This ensures the icon actually opens the modal.
          // Note: router.setParams does not update headerRight itself, but we can manage a state
          // or use an effect in the _layout.tsx if dynamic components are needed there.
          // For simplicity here, the headerRight in _layout is just the icon,
          // and the action is triggered by the screen's context.
        });
      }
    }
  }, [organizerId, router, id]);

  const handleAddReview = async () => {
    if (!user) {
      Alert.alert(
        "Anmeldung erforderlich",
        "Bitte melden Sie sich an, um eine Bewertung abzugeben."
      );
      setReviewModalVisible(false);
      return;
    }
    if (!organizerId || reviewRating === 0 || !reviewComment.trim()) {
      Alert.alert(
        "Fehler",
        "Bitte geben Sie eine Bewertung und einen Kommentar ab."
      );
      return;
    }

    const newReview = {
      userId: user.uid,
      userName: user.displayName || user.email || "Anonymer Nutzer",
      userProfilePic:
        user.photoURL || "https://placehold.co/50x50/CCCCCC/000000?text=U",
      rating: reviewRating,
      comment: reviewComment.trim(),
      timestamp: new Date().toISOString(),
    };

    const success = await addReview(organizerId, newReview);
    if (success) {
      Alert.alert("Erfolg", "Bewertung erfolgreich hinzugefügt!");
      setReviewModalVisible(false);
      setReviewRating(0);
      setReviewComment("");
    } else if (reviewError) {
      Alert.alert(
        "Fehler",
        `Bewertung konnte nicht hinzugefügt werden: ${reviewError}`
      );
    }
  };

  const renderStarsForInput = (currentRating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setReviewRating(i)}>
          <Ionicons
            name={i <= currentRating ? "star" : "star-outline"}
            size={30}
            color="#FFD700"
            className="mx-1"
          />
        </TouchableOpacity>
      );
    }
    return <View className="flex-row justify-center mb-4">{stars}</View>;
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-lg text-gray-700">
          Veranstalter wird geladen...
        </Text>
      </View>
    );
  }

  if (error || !organizer) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50 p-5">
        <Text className="text-xl font-bold text-red-500">
          Veranstalter nicht gefunden!
        </Text>
        <Text className="text-gray-600 mt-2">{error}</Text>
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

        {/* Add Review Button (replaces headerRight icon for action) */}
        <TouchableOpacity
          className="flex-row items-center justify-center bg-blue-500 rounded-lg p-3 mb-6"
          onPress={() => setReviewModalVisible(true)}
        >
          <Ionicons
            name="add-circle-outline"
            size={24}
            color="white"
            className="mr-2"
          />
          <Text className="text-white font-bold text-lg">
            Bewertung hinzufügen
          </Text>
        </TouchableOpacity>

        {/* Reviews Section */}
        <Text className="text-lg font-semibold text-gray-700 mb-4">
          Bewertungen
        </Text>
        {organizer.reviews.length === 0 ? (
          <Text className="text-gray-600 text-center mt-5">
            Noch keine Bewertungen vorhanden.
          </Text>
        ) : (
          organizer.reviews.map((review) => (
            <View
              key={review.id}
              className="bg-white rounded-xl shadow-sm p-4 mb-4 border border-gray-200"
            >
              <Text className="text-gray-800 text-base mb-3">
                {review.comment}
              </Text>
              <View className="flex-row items-center">
                <Image
                  source={{ uri: review.userProfilePic }}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <Text className="text-base font-semibold text-blue-600">
                  {review.userName}
                </Text>
                <View className="flex-row items-center ml-auto">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Ionicons
                      key={i}
                      name={i < review.rating ? "star" : "star-outline"}
                      size={16}
                      color="#FFD700"
                    />
                  ))}
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add Review Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isReviewModalVisible}
        onRequestClose={() => setReviewModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-xl p-6 shadow-lg">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-800">
                Bewertung abgeben
              </Text>
              <TouchableOpacity onPress={() => setReviewModalVisible(false)}>
                <Ionicons name="close-circle-outline" size={30} color="gray" />
              </TouchableOpacity>
            </View>

            {renderStarsForInput(reviewRating)}

            <TextInput
              className="w-full p-3 mb-4 bg-gray-100 rounded-lg border border-gray-300 text-base"
              placeholder="Dein Kommentar..."
              multiline
              numberOfLines={4}
              value={reviewComment}
              onChangeText={setReviewComment}
            />

            <TouchableOpacity
              className="w-full p-4 bg-blue-500 rounded-lg flex-row justify-center items-center"
              onPress={handleAddReview}
              disabled={reviewLoading}
            >
              <Text className="text-white text-center font-bold text-lg">
                {reviewLoading ? "Senden..." : "Bewertung abschicken"}
              </Text>
            </TouchableOpacity>
            {reviewError && (
              <Text className="text-red-500 text-center mt-2">
                {reviewError}
              </Text>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
