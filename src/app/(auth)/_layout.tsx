import { Stack, usePathname } from "expo-router";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuthState } from "../../hooks/auth";
import { View, ActivityIndicator, Text } from "react-native";

export default function AuthLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, isEmailVerified } = useAuthState();

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (!isEmailVerified) {
          router.replace("/(auth)/verify-email");
        } else {
          router.replace("/(auth)/check-profile");
        }
      } else {
        const currentPath = pathname;
        if (
          currentPath !== "/(auth)/login" &&
          currentPath !== "/(auth)/signup" &&
          currentPath !== "/(auth)/verify-email"
        ) {
          router.replace("/(auth)/login");
        }
      }
    }
  }, [user, loading, isEmailVerified, router]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-lg text-gray-700">
          Authentifizierung wird überprüft...
        </Text>
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="verify-email" options={{ headerShown: false }} />
      <Stack.Screen name="check-profile" options={{ headerShown: false }} />
    </Stack>
  );
}
