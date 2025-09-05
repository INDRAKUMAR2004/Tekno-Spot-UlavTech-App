// app/PaymentScreen.tsx
import React from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useRouter } from "expo-router";

export default function PaymentScreen() {
  const { firebaseUser } = useAuth();
  const { cartItems, cartItems: items, clearCart } = useCart();
  const totalCost = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const router = useRouter();

  if (!firebaseUser) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loginText}>Please login to checkout</Text>
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => router.push("/LoginScreen")}
        >
          <Text style={styles.btnText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handlePay = async () => {
    try {
     
      clearCart();
      Alert.alert("Payment succeeded");
      router.push("/(tabs)/Home");
    } catch (err: any) {
      Alert.alert("Payment failed", err.message || String(err));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Summary</Text>

      <View style={styles.card}>
        <Text style={styles.totalLabel}>Order Total</Text>
        <Text style={styles.totalPrice}>₹{totalCost}</Text>
      </View>

      <TouchableOpacity style={styles.payBtn} onPress={handlePay}>
        <Text style={styles.payText}>Pay Now (Simulated)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#333",
  },
  card: {
    backgroundColor: "#f7f7f7",
    padding: 20,
    borderRadius: 12,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalLabel: {
    fontSize: 18,
    color: "#555",
    fontWeight: "600",
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#416944",
  },
  payBtn: {
    backgroundColor: "#416944",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  payText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loginText: {
    fontSize: 16,
    marginBottom: 20,
    color: "#444",
  },
  loginBtn: {
    backgroundColor: "#416944",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
