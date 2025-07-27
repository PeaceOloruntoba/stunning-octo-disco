import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useSignup } from "../../hooks/auth";
import CheckBox from "@react-native-community/checkbox";

export default function SignupScreen() {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const { signup, error } = useSignup();

  const handleSignup = () => {
    signup(email, password, confirmPassword);
  };

  return (
    <View className="flex-1 bg-gray-100 justify-center items-center p-5">
      <Text className="text-2xl font-bold mb-5">Registriere dich!</Text>
      <TextInput
        className="w-1/2 p-3 mb-4 bg-white rounded-lg"
        placeholder="Nachname"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        className="w-1/2 p-3 mb-4 bg-white rounded-lg"
        placeholder="Vorname"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        className="w-full p-3 mb-4 bg-white rounded-lg"
        placeholder="E-Mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
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
        <View className="flex-1 p-3 bg-white rounded-lg mr-2">
          <CheckBox
            value={newsletter}
            onValueChange={setNewsletter}
            tintColors={{ true: "#6b46c1", false: "#a0aec0" }} // Optional: Customize colors
          />
          <Text>Newsletter</Text>
          <Text>Daten Schutz blab bla bla</Text>
        </View>
        <View className="flex-1 p-3 bg-white rounded-lg">
          <CheckBox
            value={false}
            tintColors={{ true: "#6b46c1", false: "#a0aec0" }} // Optional: Customize colors
          />
          <Text>Daten Schutz blab bla bla</Text>
        </View>
      </View>
      {error && <Text className="text-red-500 mb-5">{error}</Text>}
      <TouchableOpacity
        className="w-full p-3 bg-purple-500 rounded-lg"
        onPress={handleSignup}
      >
        <Text className="text-white text-center">Jetzt registrieren</Text>
      </TouchableOpacity>
    </View>
  );
}
