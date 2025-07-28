// app/(auth)/_layout.tsx
import { Stack } from "expo-router";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuthState } from "../../hooks/auth";
import { View, ActivityIndicator, Text } from "react-native"; // For loading indicator

export default function AuthLayout() {
  const router = useRouter();
  const { user, loading } = useAuthState();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // If user is logged in, direct them to the profile check screen
        // This screen will decide if they go to preferences or main tabs
        router.replace("/(auth)/check-profile");
      } else {
        // If no user and auth state is loaded, ensure they are on a public auth screen
        // This helps prevent infinite redirects if trying to access protected routes
        const currentPath = router.pathname;
        if (currentPath !== '/(auth)/login' && currentPath !== '/(auth)/signup') {
            router.replace("/(auth)/login"); // Redirect to login if not already there or signup
        }
      }
    }
  }, [user, loading, router]);

  if (loading) {
    // Show a loading indicator while auth state is being determined
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-lg text-gray-700">Authentifizierung wird überprüft...</Text>
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="check-profile" options={{ headerShown: false }} /> {/* Add this line */}
    </Stack>
  );
}