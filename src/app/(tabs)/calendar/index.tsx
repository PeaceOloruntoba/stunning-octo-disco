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
import { useParticipatedEvents, useEvents } from "../../../hooks/events";

export default function CalendarScreen() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthState();
  const {
    participatedEvents,
    loading: participatedLoading,
    error: participatedError,
  } = useParticipatedEvents(user);
  const { events, loading: eventsLoading, error: eventsError } = useEvents();

  const loading = authLoading || participatedLoading || eventsLoading;
  const error = participatedError || eventsError;

  const calendarEvents = React.useMemo(() => {
    if (!events.length || !participatedEvents.length) return [];
    return participatedEvents
      .map((pEvent) => {
        const fullEvent = events.find((e) => e.id === pEvent.eventId);
        return fullEvent
          ? {
              ...fullEvent,
              status: pEvent.status,
              participationDate: pEvent.participationDate,
            }
          : null;
      })
      .filter(Boolean)
      .sort(
        (a, b) =>
          new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
      );
  }, [participatedEvents, events]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: "upcoming" | "completed" | "cancelled") => {
    switch (status) {
      case "upcoming":
        return <Ionicons name="time-outline" size={24} color="blue" />;
      case "completed":
        return (
          <Ionicons name="checkmark-circle-outline" size={24} color="green" />
        );
      case "cancelled":
        return <Ionicons name="close-circle-outline" size={24} color="red" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-lg text-gray-700">
          Kalender wird geladen...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100 p-5">
        <Text className="text-lg text-red-500 text-center">
          Fehler beim Laden des Kalenders: {error}
        </Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100 p-5">
        <Text className="text-lg text-gray-700 text-center mb-5">
          Bitte melden Sie sich an, um Ihren Kalender zu sehen.
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
        {calendarEvents.length === 0 ? (
          <View className="flex-1 justify-center items-center p-10">
            <Ionicons
              name="calendar-outline"
              size={80}
              color="gray"
              className="mb-4"
            />
            <Text className="text-lg text-gray-600 text-center">
              Dein Kalender ist noch leer.
            </Text>
            <Text className="text-md text-gray-500 text-center mt-2">
              Nimm an Events teil, um sie hier zu sehen!
            </Text>
            <TouchableOpacity
              className="bg-blue-500 py-3 px-6 rounded-lg mt-6"
              onPress={() => router.replace("/(tabs)/events")}
            >
              <Text className="text-white font-bold">Events finden</Text>
            </TouchableOpacity>
          </View>
        ) : (
          calendarEvents.map((event) => (
            <TouchableOpacity
              key={event.id}
              className="flex-row bg-white rounded-lg shadow-sm mb-4 p-3 items-center border border-gray-200"
              onPress={() => router.push(`/calendar/${event.id}`)}
            >
              <View className="mr-3">{getStatusIcon(event.status)}</View>
              <Image
                source={{ uri: event.image }}
                className="w-20 h-20 rounded-lg mr-4"
              />
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-800 mb-1">
                  {event.clubName}
                </Text>
                <Text className="text-sm text-gray-600 mb-1">
                  {event.eventType}
                </Text>
                <View className="flex-row items-center mt-1">
                  <Ionicons name="calendar-outline" size={16} color="gray" />
                  <Text className="text-sm text-gray-700 ml-1">
                    {formatDate(event.eventDate)}
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
