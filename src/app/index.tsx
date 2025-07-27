import { View, Image, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";

export default function LandingPage() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-100 justify-center items-center">
      <Image
        source={{ uri: "https://via.placeholder.com/300x200" }}
        className="w-3/4 h-1/3 mb-10"
        resizeMode="contain"
      />
      <TouchableOpacity className="flex-row w-3/4">
        <TouchableOpacity
          className="flex-1 bg-blue-500 p-4 rounded-l-lg"
          onPress={() => router.push("/(auth)/login")}
        >
          <View className="flex-1 bg-blue-500 p-4 rounded-l-lg">
            <Text className="text-white text-center">Login</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 bg-purple-500 p-4 rounded-r-lg"
          onPress={() => router.push("/(auth)/signup")}
        >
          <View className="flex-1 bg-purple-500 p-4 rounded-r-lg">
            <Text className="text-white text-center">Signup</Text>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
}
