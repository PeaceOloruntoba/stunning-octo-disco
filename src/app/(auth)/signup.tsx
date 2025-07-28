import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useSignup } from "../../hooks/auth";
import { useRouter } from "expo-router";
import Checkbox from "expo-checkbox";

export default function SignupScreen() {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [alter, setAlter] = useState("");
  const [geschlecht, setGeschlecht] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [datenschutz, setDatenschutz] = useState(false);
  const { signup, error } = useSignup();
  const router = useRouter();

  const handleSignup = () => {
    signup(email, password, confirmPassword);
  };

  return (
    <View className="flex-1 bg-gray-100 justify-center items-center p-5">
      <Text className="text-2xl font-bold mb-5">Registriere dich!</Text>
      <View className="flex-row w-full mb-4 gap-4">
        <TextInput
          className="flex-1 p-3 bg-white rounded-lg"
          placeholder="Nachname"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          className="flex-1 p-3 bg-white rounded-lg"
          placeholder="Vorname"
          value={firstName}
          onChangeText={setFirstName}
        />
      </View>
      <TextInput
        className="w-full p-3 mb-4 bg-white rounded-lg"
        placeholder="E-Mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        className="w-full p-3 mb-4 bg-white rounded-lg"
        placeholder="Alter"
        value={alter}
        onChangeText={setAlter}
      />
      <TextInput
        className="w-full p-3 mb-4 bg-white rounded-lg"
        placeholder="Geschlecht"
        value={geschlecht}
        onChangeText={setGeschlecht}
      />
      <TextInput
        className="w-full p-3 mb-4 bg-white rounded-lg"
        placeholder="Passwort"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        className="w-full p-3 mb-4 bg-white rounded-lg"
        placeholder="Passwort wiederholen"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <View className="flex-row w-full mb-4">
        <View className="flex-1 p-3 bg-white rounded-lg mr-2 flex-row items-center">
          <Checkbox
            value={newsletter}
            onValueChange={setNewsletter}
            color={newsletter ? "#3B82F6" : undefined}
          />
          <View className="ml-2">
            <Text>Newsletter</Text>
            <Text>Checkbox</Text>
          </View>
        </View>
        <View className="flex-1 p-3 bg-white rounded-lg mr-2 flex-row items-center">
          <Checkbox
            value={datenschutz}
            onValueChange={setDatenschutz}
            color={datenschutz ? "#3B82F6" : undefined}
          />
          <View className="ml-2">
            <Text>Datenschutz</Text>
            <Text>Checkbox</Text>
          </View>
        </View>
      </View>
      {error && <Text className="text-red-500 mb-5">{error}</Text>}
      <TouchableOpacity
        className="w-full p-3 bg-[#3B82F6] rounded-lg"
        onPress={handleSignup}
      >
        <Text className="text-white text-center">Jetzt registrieren</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="mt-5"
        onPress={() => router.push("/(auth)/login")}
      >
        <Text className="text-[#3B82F6]">
          Bereits ein Account? Jetzt einloggen
        </Text>
      </TouchableOpacity>
    </View>
  );
}
