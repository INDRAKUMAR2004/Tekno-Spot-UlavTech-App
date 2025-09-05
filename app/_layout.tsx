// app/_layout.tsx
import { Stack, useRouter } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { View, Text, ActivityIndicator } from "react-native";
import { UserProvider } from "@/UserContext";

function RootNavigation() {
  const { firebaseUser, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack screenOptions={{headerShown: false}}>
      {!firebaseUser ? (
        <>
          <Stack.Screen name="LoginScreen" options={{ headerShown: false }} />
          <Stack.Screen name="SignUpScreen" options={{ headerShown: false }} />
        </>
      ) : (
        <>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="Profile" />
          <Stack.Screen name="PersonalInfo" />
          <Stack.Screen name="PaymentScreen" />
          <Stack.Screen name="Order" />
        </>
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <UserProvider>
      <CartProvider>
        <RootNavigation />
      </CartProvider>
      </UserProvider>
    </AuthProvider>
  );
}
