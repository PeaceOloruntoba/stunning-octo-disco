import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import CheckBox from "@react-native-community/checkbox";
const auth = getAuth();

export default function SignupScreen() {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newsletter, setNewsletter] = useState(false);

  const handleSignup = () => {
    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Signed up:", userCredential.user);
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
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
          <CheckBox value={newsletter} onValueChange={setNewsletter} />
          <Text>Newsletter</Text>
          <Text>Daten Schutz blab bla bla</Text>
        </View>
        <View className="flex-1 p-3 bg-white rounded-lg">
          <CheckBox value={false} />
          <Text>Daten Schutz blab bla bla</Text>
        </View>
      </View>
      <TouchableOpacity
        className="w-full p-3 bg-purple-500 rounded-lg"
        onPress={handleSignup}
      >
        <Text className="text-white text-center">Jetzt registrieren</Text>
      </TouchableOpacity>
    </View>
  );
}
