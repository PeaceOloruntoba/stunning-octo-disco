import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
} from "react-native";
import { useSignup } from "../../hooks/auth";
import { useRouter } from "expo-router";
import Checkbox from "expo-checkbox";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useUserProfile } from "../../hooks/userProfile";

export default function SignupScreen() {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date(2000, 0, 1));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState("prefer_not_to_say");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [datenschutzAccepted, setDatenschutzAccepted] = useState(false);

  const { signup, error: signupError } = useSignup();
  const {
    createUserProfile,
    loading: profileLoading,
    error: profileError,
  } = useUserProfile();
  const router = useRouter();

  const handleSignup = async () => {
    if (
      !lastName.trim() ||
      !firstName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim() ||
      gender === "prefer_not_to_say" ||
      !datenschutzAccepted
    ) {
      Alert.alert(
        "Fehler",
        "Bitte füllen Sie alle Pflichtfelder aus und akzeptieren Sie die Datenschutzbestimmungen."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Fehler", "Passwörter stimmen nicht überein.");
      return;
    }
    if (password.length < 6) {
      Alert.alert(
        "Fehler",
        "Das Passwort muss mindestens 6 Zeichen lang sein."
      );
      return;
    }

    const today = new Date();
    const minAgeDate = new Date(
      today.getFullYear() - 16,
      today.getMonth(),
      today.getDate()
    );
    if (dateOfBirth > minAgeDate) {
      Alert.alert(
        "Fehler",
        "Sie müssen mindestens 16 Jahre alt sein, um sich zu registrieren."
      );
      return;
    }

    const { userCredential, emailExists } = await signup(
      email,
      password,
      confirmPassword
    );

    if (emailExists) {
      router.replace("/(auth)/login");
      return;
    }

    if (userCredential && userCredential.user) {
      const profileCreated = await createUserProfile(
        userCredential.user,
        firstName,
        lastName,
        dateOfBirth,
        gender,
        newsletter,
        datenschutzAccepted
      );

      if (profileCreated) {
        Alert.alert("Erfolg", "Konto erfolgreich erstellt!");
        router.replace("/preferences");
      } else if (profileError) {
        Alert.alert(
          "Fehler beim Profil",
          `Profil konnte nicht erstellt werden: ${profileError}`
        );
      }
    } else if (signupError) {
      Alert.alert("Registrierungsfehler", signupError);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || dateOfBirth;

    setShowDatePicker(Platform.OS === "ios" ? true : false);
    setDateOfBirth(currentDate);
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      className="bg-gray-100 p-5"
    >
      <View className="items-center">
        <Text className="text-2xl font-bold mb-5 text-gray-800">
          Registriere dich!
        </Text>
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
        <TextInput
          className="w-full p-3 mb-4 bg-white rounded-lg border border-gray-300 text-base"
          placeholder="E-Mail"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
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
            maximumDate={new Date()}
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
        <TextInput
          className="w-full p-3 mb-4 bg-white rounded-lg border border-gray-300 text-base"
          placeholder="Passwort"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          className="w-full p-3 mb-4 bg-white rounded-lg border border-gray-300 text-base"
          placeholder="Passwort wiederholen"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
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
          {/* Datenschutz Checkbox */}
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
        <Text>
          {(signupError || profileError) && (
            <Text className="text-red-500 mb-5 text-center">
              {signupError || profileError}
            </Text>
          )}
        </Text>
        <TouchableOpacity
          className="w-full p-3 bg-blue-500 rounded-lg flex-row justify-center items-center mt-4"
          onPress={handleSignup}
          disabled={profileLoading}
        >
          <Text className="text-white text-center font-bold text-lg">
            {profileLoading ? "Registrieren..." : "Jetzt registrieren"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="mt-5 mb-10"
          onPress={() => router.push("/(auth)/login")}
        >
          <Text className="text-blue-500 text-base">
            Bereits ein Account? Jetzt einloggen
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
