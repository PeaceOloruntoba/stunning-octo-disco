import { Stack } from "expo-router";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuthState } from "../../hooks/auth";

export default function AuthLayout() {
  const router = useRouter();
  const { user, loading } = useAuthState();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/(tabs)");
    }
  }, [user, loading, router]);

  if (loading) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
    </Stack>
  );
}
