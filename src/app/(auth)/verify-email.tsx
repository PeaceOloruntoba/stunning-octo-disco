import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuthState, useSendVerificationEmail } from "../../hooks/auth";

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { user, loading, isEmailVerified } = useAuthState();
  const {
    sendVerificationEmail,
    loading: sending,
    error,
  } = useSendVerificationEmail();
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!loading && user && isEmailVerified) {
      router.replace("/(auth)/check-profile");
    }
  }, [user, loading, isEmailVerified, router]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResendEmail = async () => {
    if (user && countdown === 0) {
      await sendVerificationEmail();
      setCountdown(60);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-lg text-gray-700">Laden...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 justify-center items-center p-5">
      <Text className="text-2xl font-bold mb-5 text-gray-800">
        E-Mail-Verifizierung
      </Text>
      <Text className="text-center mb-10 text-gray-600">
        Wir haben eine Verifizierungs-E-Mail an {user?.email} gesendet. Bitte
        überprüfe deinen Posteingang und klicke auf den Link, um deine
        E-Mail-Adresse zu verifizieren.
      </Text>
      {error && <Text className="text-red-500 mb-5 text-center">{error}</Text>}
      <TouchableOpacity
        className="w-full p-3 bg-blue-500 rounded-lg flex-row justify-center items-center"
        onPress={handleResendEmail}
        disabled={sending || countdown > 0}
      >
        <Text className="text-white text-center font-bold text-lg">
          {sending
            ? "Senden..."
            : countdown > 0
            ? `Wieder senden (${countdown}s)`
            : "E-Mail erneut senden"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="mt-5"
        onPress={() => router.push("/(auth)/login")}
      >
        <Text className="text-blue-500 text-base">Zurück zum Login</Text>
      </TouchableOpacity>
    </View>
  );
}
