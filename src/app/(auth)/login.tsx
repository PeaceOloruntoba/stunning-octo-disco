import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useLogin } from "../../hooks/auth";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error } = useLogin();
  const router = useRouter();

  const handleLogin = () => {
    login(email, password);
  };

  return (
    <View className="flex-1 bg-gray-100 justify-center items-center p-5">
      <Text className="text-2xl font-bold mb-5">Hello Again!</Text>
      <Text className="text-center mb-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet, urna, a,
        fusce
      </Text>
      <TextInput
        className="w-full p-3 mb-4 bg-white rounded-lg"
        placeholder="Dein Username"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        className="w-full p-3 mb-4 bg-white rounded-lg"
        placeholder="Dein Passwort"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error && <Text className="text-red-500 mb-5">{error}</Text>}
      <Text className="text-blue-500 mb-5">Passwort vergessen?</Text>
      <TouchableOpacity
        className="w-full p-3 bg-purple-500 rounded-lg"
        onPress={handleLogin}
      >
        <Text className="text-white text-center">Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="mt-5"
        onPress={() => router.push("/(auth)/signup")}
      >
        <Text className="text-purple-500">
          Du hast keine Account? Jetzt Registrieren
        </Text>
      </TouchableOpacity>
    </View>
  );
}
