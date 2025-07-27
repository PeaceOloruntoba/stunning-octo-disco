import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Logged in:", userCredential.user);
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
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
      <Text className="text-blue-500 mb-5">Passwort vergessen?</Text>
      <TouchableOpacity
        className="w-full p-3 bg-purple-500 rounded-lg"
        onPress={handleLogin}
      >
        <Text className="text-white text-center">Login</Text>
      </TouchableOpacity>
      <View className="flex-row justify-center mt-5">
        <TouchableOpacity className="p-3 bg-white mr-2 rounded-lg">
          <Text>f</Text> {/* Facebook icon */}
        </TouchableOpacity>
        <TouchableOpacity className="p-3 bg-white mr-2 rounded-lg">
          <Text>G</Text> {/* Google icon */}
        </TouchableOpacity>
        <TouchableOpacity className="p-3 bg-white rounded-lg">
          <Text></Text> {/* Apple icon */}
        </TouchableOpacity>
      </View>
      <Text className="mt-5 text-purple-500">
        Du hast keine Account? Jetzt Registrieren
      </Text>
    </View>
  );
}
