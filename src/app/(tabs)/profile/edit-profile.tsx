// app/(tabs)/profile/edit-profile.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useUserProfile, UserProfile } from "../../../hooks/userProfile";
import { useAuthState } from "../../../hooks/auth";
import Checkbox from "expo-checkbox";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user } = useAuthState();
  const {
    profile,
    loading: profileLoading,
    error: profileError,
    updateUserProfile,
    getUserProfile,
  } = useUserProfile();

  // State for form fields, initialized with existing profile data or empty
  const [firstName, setFirstName] = useState(profile?.firstName || "");
  const [lastName, setLastName] = useState(profile?.lastName || "");
  const [dateOfBirth, setDateOfBirth] = useState<Date>(
    profile?.dateOfBirth ? new Date(profile.dateOfBirth) : new Date(2000, 0, 1) // Default or parse existing
  );
  const [gender, setGender] = useState(profile?.gender || "prefer_not_to_say");
  const [newsletter, setNewsletter] = useState(profile?.newsletter ?? false);
  const [datenschutzAccepted, setDatenschutzAccepted] = useState(
    profile?.datenschutzAccepted ?? false
  );

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // If profile data is already available, populate the form
    if (profile) {
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setDateOfBirth(
        profile.dateOfBirth
          ? new Date(profile.dateOfBirth)
          : new Date(2000, 0, 1)
      );
      setGender(profile.gender || "prefer_not_to_say");
      setNewsletter(profile.newsletter ?? false);
      setDatenschutzAccepted(profile.datenschutzAccepted ?? false);
    } else if (user && !profileLoading && !profileError) {
      // If no profile data, try to fetch it
      getUserProfile(user.uid);
    }
  }, [profile, user, profileLoading, profileError]);

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(Platform.OS === "ios");
    setDateOfBirth(currentDate);
  };

  const handleSave = async () => {
    if (!user) {
      Alert.alert("Fehler", "Benutzer nicht angemeldet.");
      router.replace("/(auth)/login");
      return;
    }

    if (!lastName.trim() || !firstName.trim() || !datenschutzAccepted) {
      Alert.alert(
        "Fehler",
        "Vorname, Nachname und Datenschutzbestimmungen sind Pflichtfelder."
      );
      return;
    }

    // Age validation (at least 16 years old) - re-validate on edit as well
    const today = new Date();
    const minAgeDate = new Date(
      today.getFullYear() - 16,
      today.getMonth(),
      today.getDate()
    );
    if (dateOfBirth > minAgeDate) {
      Alert.alert("Fehler", "Sie müssen mindestens 16 Jahre alt sein.");
      return;
    }

    setIsSaving(true);
    const updates: Partial<UserProfile> = {
      firstName,
      lastName,
      dateOfBirth: dateOfBirth.toISOString().split("T")[0], // Store as YYYY-MM-DD
      gender,
      newsletter,
      datenschutzAccepted,
    };

    const success = await updateUserProfile(user.uid, updates);
    setIsSaving(false);

    if (success) {
      Alert.alert("Erfolg", "Profil aktualisiert!");
      router.back(); // Go back to the profile screen
    } else if (profileError) {
      Alert.alert(
        "Fehler",
        `Profil konnte nicht aktualisiert werden: ${profileError}`
      );
    } else {
      Alert.alert("Fehler", "Unbekannter Fehler beim Speichern des Profils.");
    }
  };

  if (profileLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-lg text-gray-700">
          Profil wird geladen...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="p-5 pt-10">
        <Text className="text-2xl font-bold mb-5 text-gray-800 text-left">
          Profil bearbeiten
        </Text>

        {/* Name Inputs */}
        <View className="flex-row w-full mb-4 space-x-4">
          <TextInput
            className="flex-1 p-3 bg-white rounded-lg border border-gray-300 text-base"
            placeholder="Nachname"
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            className="flex-1 p-3 bg-white rounded-lg border border-gray-300 text-base"
            placeholder="Vorname"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>

        {/* Date of Birth Input */}
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          className="w-full p-3 mb-4 bg-white rounded-lg border border-gray-300"
        >
          <Text className="text-base text-gray-700">
            Geburtsdatum: {dateOfBirth.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={dateOfBirth}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onDateChange}
            maximumDate={new Date()} // Prevent selecting future dates
          />
        )}
        {Platform.OS === "ios" && showDatePicker && (
          <TouchableOpacity
            onPress={() => setShowDatePicker(false)}
            className="px-4 py-2 bg-blue-500 rounded-md mb-4 mt-2"
          >
            <Text className="text-white font-semibold">Datum bestätigen</Text>
          </TouchableOpacity>
        )}

        {/* Geschlecht (Gender) Dropdown */}
        <View className="w-full p-0 mb-4 bg-white rounded-lg border border-gray-300 overflow-hidden">
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue) => setGender(String(itemValue))}
            style={{ height: 50, width: "100%" }}
            itemStyle={{
              color: gender === "prefer_not_to_say" ? "gray" : "black",
            }}
          >
            <Picker.Item
              label="Geschlecht auswählen"
              value="prefer_not_to_say"
              enabled={false}
              style={{ color: "gray" }}
            />
            <Picker.Item label="Männlich" value="male" />
            <Picker.Item label="Weiblich" value="female" />
            <Picker.Item
              label="Möchte ich nicht angeben"
              value="prefer_not_to_say_selected"
            />
          </Picker>
        </View>

        {/* Checkboxes */}
        <View className="flex-col w-full mb-4 space-y-4">
          <View className="p-3 bg-white rounded-lg border border-gray-300 flex-row items-center">
            <Checkbox
              value={newsletter}
              onValueChange={setNewsletter}
              color={newsletter ? "#3B82F6" : undefined}
              className="mr-2"
            />
            <View className="flex-1">
              <Text className="text-sm text-gray-700">
                Newsletter abonnieren
              </Text>
            </View>
          </View>

          <View className="p-3 bg-white rounded-lg border border-gray-300 flex-row items-center">
            <Checkbox
              value={datenschutzAccepted}
              onValueChange={setDatenschutzAccepted}
              color={datenschutzAccepted ? "#3B82F6" : undefined}
              className="mr-2"
            />
            <View className="flex-1">
              <Text className="text-sm text-gray-700">
                Datenschutzbestimmungen akzeptieren
              </Text>
            </View>
          </View>
        </View>

        {profileError && (
          <Text className="text-red-500 mb-5 text-center">{profileError}</Text>
        )}

        {/* Save Button */}
        <TouchableOpacity
          className="w-full p-3 bg-blue-500 rounded-lg flex-row justify-center items-center mt-4 mb-10"
          onPress={handleSave}
          disabled={isSaving}
        >
          <Text className="text-white text-center font-bold text-lg">
            {isSaving ? "Speichern..." : "Profil speichern"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
