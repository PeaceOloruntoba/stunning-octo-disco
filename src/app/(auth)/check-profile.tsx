import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuthState } from "../../hooks/auth";
import { useUserProfile } from "../../hooks/userProfile";

export default function CheckProfileScreen() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthState();
  const { getUserProfile, loading: profileLoading, profile } = useUserProfile();

  useEffect(() => {
    const checkUserAndProfile = async () => {
      if (!authLoading && !profileLoading) {
        if (user) {
          const userProfile = profile || (await getUserProfile(user.uid));

          if (
            userProfile &&
            userProfile.preferences &&
            userProfile.preferences.categories.length > 0
          ) {
            router.replace("/(tabs)/search");
          } else {
            router.replace("/preferences");
          }
        } else {
          router.replace("/(auth)/login");
        }
      }
    };

    checkUserAndProfile();
  }, [user, authLoading, profileLoading, router, getUserProfile, profile]);

  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <ActivityIndicator size="large" color="#0000ff" />
      <Text className="mt-4 text-lg text-gray-700">
        Benutzerprofil wird geladen...
      </Text>
    </View>
  );
}
