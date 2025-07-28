import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuthState, useLogout } from "../../../hooks/auth";
import { useUserProfile, UserProfile } from "../../../hooks/userProfile";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthState();
  const {
    profile,
    loading: profileLoading,
    error: profileError,
    getUserProfile,
  } = useUserProfile();
  const { logout, error: logoutError } = useLogout();

  const [internalLoading, setInternalLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!authLoading && user) {
        setInternalLoading(true);
        await getUserProfile(user.uid);
        setInternalLoading(false);
      } else if (!authLoading && !user) {
        router.replace("/(auth)/login");
      }
    };
    fetchProfile();
  }, [user, authLoading]);

  const handleLogout = async () => {
    Alert.alert("Abmelden", "Möchtest du dich wirklich abmelden?", [
      {
        text: "Abbrechen",
        style: "cancel",
      },
      {
        text: "Ja",
        onPress: async () => {
          await logout();
          if (!logoutError) {
            router.replace("/(auth)/login");
          } else {
            Alert.alert("Fehler beim Abmelden", logoutError);
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Konto löschen",
      "Bist du sicher, dass du dein Konto dauerhaft löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.",
      [
        {
          text: "Abbrechen",
          style: "cancel",
        },
        {
          text: "Ja, Konto löschen",
          onPress: () =>
            Alert.alert(
              "Löschen",
              "Konto löschen Funktion noch nicht implementiert."
            ),
        },
      ]
    );
  };

  if (authLoading || internalLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-lg text-gray-700">
          Profil wird geladen...
        </Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-lg text-red-500">
          Benutzer nicht angemeldet. Weiterleitung...
        </Text>
      </View>
    );
  }

  if (!profile && !profileLoading && !profileError) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100 p-5">
        <Text className="text-lg text-gray-700 text-center mb-5">
          Dein Profil konnte nicht gefunden werden. Bitte vervollständige deine
          Daten.
        </Text>
        <TouchableOpacity
          className="bg-blue-500 py-3 px-6 rounded-lg"
          onPress={() => router.push("/preferences")}
        >
          <Text className="text-white font-bold">Profil jetzt erstellen</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="p-5">
        <View className="items-center mb-8 mt-5">
          <Image
            source={require("../../../assets/default-profile.png")}
            className="w-28 h-28 rounded-full mb-4 border-2 border-gray-200"
          />
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            {profile?.firstName || "Vorname"} {profile?.lastName || "Nachname"}
          </Text>
          <TouchableOpacity
            className="flex-row items-center px-4 py-2 bg-blue-100 rounded-full"
            onPress={() => router.push("/profile/edit-profile")}
          >
            <Text className="text-blue-600 font-semibold mr-2">
              Profil bearbeiten
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#2563EB" />
          </TouchableOpacity>
        </View>
        <Text className="text-lg font-semibold text-gray-700 mb-3">
          Zahlungen
        </Text>
        <View className="bg-white rounded-lg shadow-sm mb-6 border border-gray-200">
          <TouchableOpacity
            className="flex-row items-center justify-between p-4 border-b border-gray-200"
            onPress={() => router.push("/profile/receipts")}
          >
            <View className="flex-row items-center">
              <Ionicons
                name="receipt-outline"
                size={24}
                color="#555"
                className="mr-3"
              />
              <Text className="text-base text-gray-800">Zahlungsbelege</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center justify-between p-4"
            onPress={() => router.push("/profile/payment-method")}
          >
            <View className="flex-row items-center">
              <Ionicons
                name="card-outline"
                size={24}
                color="#555"
                className="mr-3"
              />
              <Text className="text-base text-gray-800">
                Zahlungsart angeben
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="gray" />
          </TouchableOpacity>
        </View>
        <Text className="text-lg font-semibold text-gray-700 mb-3">
          Einstellungen
        </Text>
        <View className="bg-white rounded-lg shadow-sm mb-6 border border-gray-200">
          <TouchableOpacity
            className="flex-row items-center justify-between p-4 border-b border-gray-200"
            onPress={() => router.push("/profile/language")}
          >
            <View className="flex-row items-center">
              <Ionicons
                name="language-outline"
                size={24}
                color="#555"
                className="mr-3"
              />
              <Text className="text-base text-gray-800">Sprache</Text>
            </View>
            <Text className="text-base text-gray-500 mr-2">Deutsch</Text>
            <Ionicons name="chevron-forward" size={20} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center justify-between p-4 border-b border-gray-200"
            onPress={() => router.push("/profile/impressum")}
          >
            <View className="flex-row items-center">
              <Ionicons
                name="information-circle-outline"
                size={24}
                color="#555"
                className="mr-3"
              />
              <Text className="text-base text-gray-800">Impressum</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center justify-between p-4"
            onPress={() => router.push("/profile/rechtliches")}
          >
            <View className="flex-row items-center">
              <Ionicons
                name="document-text-outline"
                size={24}
                color="#555"
                className="mr-3"
              />
              <Text className="text-base text-gray-800">Rechtliches</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="gray" />
          </TouchableOpacity>
        </View>
        <View className="bg-white rounded-lg shadow-sm mb-6 border border-gray-200">
          <TouchableOpacity
            className="flex-row items-center justify-between p-4 border-b border-gray-200"
            onPress={handleLogout}
          >
            <View className="flex-row items-center">
              <Ionicons
                name="log-out-outline"
                size={24}
                color="#555"
                className="mr-3"
              />
              <Text className="text-base text-gray-800">Abmelden</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center justify-center p-4"
            onPress={handleDeleteAccount}
          >
            <Text className="text-base text-red-500 font-bold">
              Konto löschen
            </Text>
          </TouchableOpacity>
        </View>

        {profileError && (
          <Text className="text-red-500 text-center mt-4 mb-20">
            Fehler beim Laden des Profils: {profileError}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
