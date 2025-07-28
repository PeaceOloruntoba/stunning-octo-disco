// app/(auth)/login.tsx
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { useLogin } from "../../hooks/auth";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, loading } = useLogin();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
        Alert.alert("Fehler", "Bitte E-Mail und Passwort eingeben.");
        return;
    }
    await login(email, password);
  };

  return (
    <View className="flex-1 bg-gray-100 justify-center items-center p-5">
      <Text className="text-2xl font-bold mb-5 text-gray-800">Willkommen bei Eventura</Text>
      <Text className="text-center mb-10 text-gray-600">
        Finde spontane Events, entdecke neue Orte und gestalte deinen Tag - oder
        die Nacht.
      </Text>
      <TextInput
        className="w-full p-3 mb-4 bg-white rounded-lg border border-gray-300 text-base"
        placeholder="Deine E-Mail"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="w-full p-3 mb-4 bg-white rounded-lg border border-gray-300 text-base"
        placeholder="Dein Passwort"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error && <Text className="text-red-500 mb-5 text-center">{error}</Text>}
      <View className="w-full mb-5 flex-row justify-end">
        <TouchableOpacity onPress={() => Alert.alert("Passwort vergessen?", "Funktion noch nicht implementiert.")}>
            <Text className="text-blue-500 text-sm">Passwort vergessen?</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        className="w-full p-3 bg-blue-500 rounded-lg flex-row justify-center items-center"
        onPress={handleLogin}
        disabled={loading}
      >
        <Text className="text-white text-center font-bold text-lg">
          {loading ? "Einloggen..." : "Login"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="mt-5"
        onPress={() => router.push("/(auth)/signup")}
      >
        <Text className="text-gray-700">
          Du hast keinen Account?{" "}
          <Text className="text-blue-500 font-bold">Jetzt Registrieren</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
