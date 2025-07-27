import { View, Text, TouchableOpacity } from "react-native";
import { useLogout } from "../../../hooks/auth";

export default function ProfileScreen() {
  const { logout, error } = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <View className="flex-1 justify-center items-center">
      <Text>Profile Screen</Text>
      {error && <Text className="text-red-500 mb-5">{error}</Text>}
      <TouchableOpacity
        className="p-3 bg-red-500 rounded-lg"
        onPress={handleLogout}
      >
        <Text className="text-white text-center">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
