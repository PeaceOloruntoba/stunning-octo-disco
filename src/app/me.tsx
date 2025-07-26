import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Stack, Tabs, Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox'; // For checkboxes

// Firebase imports
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

// Define global variables for Firebase config and app ID
declare const __firebase_config: string;
declare const __app_id: string;
declare const __initial_auth_token: string;

// Initialize Firebase App and Services
let app;
let auth;
let db;

try {
  const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (e) {
  console.error("Failed to initialize Firebase:", e);
  Alert.alert("Error", "Failed to initialize Firebase. Please check your configuration.");
}

// Auth Context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Root Layout Component
export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    // Sign in with custom token or anonymously
    const signIn = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Firebase initial sign-in error:", error);
        Alert.alert("Authentication Error", "Failed to sign in. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    signIn();

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Set loading to false once auth state is determined
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error("Login error:", error);
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (email, password, firstName, lastName) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Optionally store additional user data in Firestore
      if (userCredential.user && db) {
        await setDoc(doc(db, `artifacts/${__app_id}/users/${userCredential.user.uid}/profile`, 'data'), {
          firstName,
          lastName,
          email,
          createdAt: new Date(),
        });
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      Alert.alert("Signup Failed", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error("Logout error:", error);
      Alert.alert("Logout Failed", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <SafeAreaProvider>
        <View className="flex-1 justify-center items-center bg-indigo-50">
          <ActivityIndicator size="large" color="#6366F1" />
          <Text className="mt-4 text-lg text-indigo-700 font-semibold">App wird geladen...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack>
          {user ? (
            // Authenticated user: show main app tabs
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          ) : (
            // Unauthenticated user: show landing and auth screens
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          )}
          {/* Index is the landing page before authentication */}
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </AuthContext.Provider>
  );
}

// Index (Landing Page)
export function Index() {
  return (
    <SafeAreaView className="flex-1">
      <StatusBar style="light" />
      <ImageBackground
        source={{ uri: 'https://placehold.co/720x1280/6366F1/FFFFFF?text=Welcome+to+Our+App' }} // Placeholder image with indigo color
        className="flex-1 justify-end"
        resizeMode="cover"
      >
        <View className="p-6 pb-10">
          <View className="bg-white/90 rounded-2xl overflow-hidden shadow-xl flex-row">
            <Link href="/login" asChild>
              <TouchableOpacity
                className="flex-1 p-4 items-center justify-center border-r border-gray-200 active:bg-gray-100"
                activeOpacity={0.7}
              >
                <Text className="text-lg font-bold text-indigo-700">Login</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/signup" asChild>
              <TouchableOpacity
                className="flex-1 p-4 items-center justify-center active:bg-gray-100"
                activeOpacity={0.7}
              >
                <Text className="text-lg font-bold text-indigo-700">Registrieren</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

// Auth Group Layout
export function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
    </Stack>
  );
}

// Login Screen
export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Fehler", "Bitte geben Sie sowohl E-Mail als auch Passwort ein.");
      return;
    }
    await login(email, password);
  };

  return (
    <SafeAreaView className="flex-1 bg-indigo-50">
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center items-center p-6"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
          showsVerticalScrollIndicator={false}
          className="w-full"
        >
          <View className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-lg">
            <Text className="text-4xl font-extrabold text-center text-gray-800 mb-4">Hello Again!</Text>
            <Text className="text-base text-center text-gray-500 mb-8 px-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. urna, a, fusce
            </Text>

            <View className="mb-4">
              <TextInput
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-lg text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="Dein Benutzername"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View className="mb-2">
              <TextInput
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-lg text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="Dein Passwort"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            <TouchableOpacity className="self-end mb-8">
              <Text className="text-indigo-600 text-sm font-semibold">Passwort vergessen?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-full bg-indigo-600 p-4 rounded-xl items-center justify-center shadow-md active:bg-indigo-700"
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.7}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-xl font-bold">Login</Text>
              )}
            </TouchableOpacity>

            <Text className="text-center text-gray-400 my-6">Oder Login mit</Text>

            <View className="flex-row justify-around mb-8">
              <TouchableOpacity className="bg-gray-100 p-3 rounded-full w-16 h-16 items-center justify-center shadow-sm active:bg-gray-200">
                <Ionicons name="logo-facebook" size={32} color="#4267B2" />
              </TouchableOpacity>
              <TouchableOpacity className="bg-gray-100 p-3 rounded-full w-16 h-16 items-center justify-center shadow-sm active:bg-gray-200">
                <Ionicons name="logo-google" size={32} color="#DB4437" />
              </TouchableOpacity>
              <TouchableOpacity className="bg-gray-100 p-3 rounded-full w-16 h-16 items-center justify-center shadow-sm active:bg-gray-200">
                <Ionicons name="logo-apple" size={32} color="#000000" />
              </TouchableOpacity>
            </View>

            <Link href="/signup" asChild>
              <TouchableOpacity className="mt-4">
                <Text className="text-gray-600 text-center text-base">
                  Du hast keine Account?{' '}
                  <Text className="text-indigo-600 font-semibold">Jetzt Registrieren</Text>
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Signup Screen
export function SignupScreen() {
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [newsletterChecked, setNewsletterChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);

  const { signup, loading } = useAuth();

  const handleSignup = async () => {
    if (!lastName || !firstName || !email || !password || !repeatPassword) {
      Alert.alert("Fehler", "Bitte füllen Sie alle Felder aus.");
      return;
    }
    if (password !== repeatPassword) {
      Alert.alert("Fehler", "Passwörter stimmen nicht überein.");
      return;
    }
    if (!privacyChecked) {
        Alert.alert("Fehler", "Bitte akzeptieren Sie die Datenschutzbestimmungen.");
        return;
    }

    await signup(email, password, firstName, lastName);
  };

  return (
    <SafeAreaView className="flex-1 bg-indigo-50">
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center items-center p-6"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
          showsVerticalScrollIndicator={false}
          className="w-full"
        >
          <View className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg">
            <Text className="text-4xl font-extrabold text-center text-gray-800 mb-8">Registriere dich!</Text>

            <View className="flex-row justify-between mb-4">
              <TextInput
                className="flex-1 p-4 mr-2 bg-gray-50 border border-gray-200 rounded-xl text-lg text-gray-800 focus:border-indigo-500"
                placeholder="Nachname"
                placeholderTextColor="#9CA3AF"
                value={lastName}
                onChangeText={setLastName}
              />
              <TextInput
                className="flex-1 p-4 ml-2 bg-gray-50 border border-gray-200 rounded-xl text-lg text-gray-800 focus:border-indigo-500"
                placeholder="Vorname"
                placeholderTextColor="#9CA3AF"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>

            <View className="relative mb-4">
              <TextInput
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-lg text-gray-800 focus:border-indigo-500"
                placeholder="E-Mail"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Ionicons name="mail-outline" size={24} color="#9CA3AF" className="absolute left-4 top-1/2 -mt-3" />
            </View>

            <TextInput
              className="w-full p-4 mb-4 bg-gray-50 border border-gray-200 rounded-xl text-lg text-gray-800 focus:border-indigo-500"
              placeholder="Passwort"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TextInput
              className="w-full p-4 mb-6 bg-gray-50 border border-gray-200 rounded-xl text-lg text-gray-800 focus:border-indigo-500"
              placeholder="Passwort wiederholen"
              placeholderTextColor="#9CA3AF"
              value={repeatPassword}
              onChangeText={setRepeatPassword}
              secureTextEntry
            />

            <View className="flex-row justify-between mb-8">
              <View className="flex-1 bg-gray-100 p-4 rounded-xl mr-2 shadow-sm">
                <Text className="text-lg font-semibold text-gray-800 mb-2">Newsletter</Text>
                <Text className="text-sm text-gray-600 mb-3">Datenschutz blab blab bla bla</Text>
                <View className="flex-row items-center">
                  <Checkbox
                    value={newsletterChecked}
                    onValueChange={setNewsletterChecked}
                    color={newsletterChecked ? '#6366F1' : '#D1D5DB'}
                    className="rounded-md w-6 h-6"
                  />
                  <Text className="ml-2 text-base text-gray-700">Checkbox</Text>
                </View>
              </View>
              <View className="flex-1 bg-gray-100 p-4 rounded-xl ml-2 shadow-sm">
                <Text className="text-lg font-semibold text-gray-800 mb-2">Datenschutz</Text>
                <Text className="text-sm text-gray-600 mb-3">Datenschutz blab blab bla bla</Text>
                <View className="flex-row items-center">
                  <Checkbox
                    value={privacyChecked}
                    onValueChange={setPrivacyChecked}
                    color={privacyChecked ? '#6366F1' : '#D1D5DB'}
                    className="rounded-md w-6 h-6"
                  />
                  <Text className="ml-2 text-base text-gray-700">Checkbox</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              className="w-full bg-indigo-600 p-4 rounded-xl items-center justify-center shadow-md active:bg-indigo-700"
              onPress={handleSignup}
              disabled={loading}
              activeOpacity={0.7}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-xl font-bold">Jetzt registrieren</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Tabs Layout
export function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Hide header for all tab screens, can be overridden per screen
        tabBarShowLabel: false, // Hide labels
        tabBarStyle: {
          height: 80, // Adjust height as needed
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 10, // Shadow for Android
          shadowColor: '#000', // Shadow for iOS
          shadowOffset: { width: 0, height: -5 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
          paddingBottom: 10, // Adjust padding to lift icons
        },
        tabBarActiveTintColor: '#4F46E5', // Active icon color (indigo-600)
        tabBarInactiveTintColor: '#6B7280', // Inactive icon color (gray-500)
      }}
    >
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => (
            <Ionicons name="search" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar-outline" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="car"
        options={{
          title: 'Car',
          tabBarIcon: ({ color }) => (
            <Ionicons name="car-outline" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

// Search Screen
export function SearchScreen() {
  const { user } = useAuth();
  return (
    <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center p-4">
      <StatusBar style="dark" />
      <View className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md items-center">
        <Ionicons name="search" size={60} color="#4F46E5" className="mb-4" />
        <Text className="text-3xl font-bold text-gray-800 mb-4">Search Screen</Text>
        <Text className="text-lg text-gray-600 text-center">
          Hello, {user?.email || 'Guest'}! This is your search dashboard.
        </Text>
      </View>
    </SafeAreaView>
  );
}

// Calendar Screen
export function CalendarScreen() {
  const { user } = useAuth();
  return (
    <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center p-4">
      <StatusBar style="dark" />
      <View className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md items-center">
        <Ionicons name="calendar-outline" size={60} color="#4F46E5" className="mb-4" />
        <Text className="text-3xl font-bold text-gray-800 mb-4">Calendar Screen</Text>
        <Text className="text-lg text-gray-600 text-center">
          Manage your events and schedule here.
        </Text>
      </View>
    </SafeAreaView>
  );
}

// Car Screen
export function CarScreen() {
  const { user } = useAuth();
  return (
    <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center p-4">
      <StatusBar style="dark" />
      <View className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md items-center">
        <Ionicons name="car-outline" size={60} color="#4F46E5" className="mb-4" />
        <Text className="text-3xl font-bold text-gray-800 mb-4">Car Screen</Text>
        <Text className="text-lg text-gray-600 text-center">
          View your vehicle information and services.
        </Text>
      </View>
    </SafeAreaView>
  );
}

// Profile Screen
export function ProfileScreen() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
  };

  // Display userId for debugging/identification in multi-user apps
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
  const userId = auth.currentUser?.uid || 'Not Authenticated';

  return (
    <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center p-4">
      <StatusBar style="dark" />
      <View className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md items-center">
        <Ionicons name="person-outline" size={60} color="#4F46E5" className="mb-4" />
        <Text className="text-3xl font-bold text-gray-800 mb-4">Profile Screen</Text>
        <Text className="text-lg text-gray-600 text-center mb-2">
          Welcome, {user?.email || 'Guest'}!
        </Text>
        {user && (
          <View className="mb-6 w-full items-center">
            <Text className="text-sm text-gray-500 text-center break-all">
              User ID: {userId}
            </Text>
            <Text className="text-sm text-gray-500 text-center break-all">
              App ID: {appId}
            </Text>
          </View>
        )}
        <TouchableOpacity
          className="w-full bg-red-500 p-4 rounded-xl items-center justify-center shadow-md active:bg-red-600"
          onPress={handleLogout}
          disabled={loading}
          activeOpacity={0.7}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-xl font-bold">Logout</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

