import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useCart } from "../../context/CartContext";
import { useUser } from "@/UserContext";

export default function CartScreen() {
  const { cartItems, updateQty, removeFromCart } = useCart();
  const router = useRouter();
  const { user } = useUser();
  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

  const total = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );

  const renderCartItem = ({ item }: any) => (
    <View style={styles.cartItem}>
      {item.image && <Image source={item.image} style={styles.image} />}
      <View style={{ flex: 1, marginHorizontal: 10 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.qtyPrice}>₹ {item.price}</Text>
      </View>
      <View style={styles.qtyRow}>
        <TouchableOpacity
          onPress={() => updateQty(item.id, Math.max(1, item.quantity - 1))}
          style={styles.qtyBtn}
        >
          <Text style={styles.qtyBtnText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.qtyCount}>{item.quantity}</Text>
        <TouchableOpacity
          onPress={() => updateQty(item.id, item.quantity + 1)}
          style={styles.qtyBtn}
        >
          <Text style={styles.qtyBtnText}>+</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => removeFromCart(item.id)}>
        <Ionicons name="trash" size={20} color="#d9534f" style={{ marginLeft: 8 }} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/Home")}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        <TouchableOpacity onPress={() => router.push("/Profile")}>
          <View style={styles.profileCircle}>
            <Text style={styles.profileText}>{initial}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Cart Items */}
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={70} color="#ccc" />
          <Text style={styles.emptyText}>No items in your cart</Text>
        </View>
      ) : (
        <View style={{ flex: 1, paddingHorizontal: 12 }}>
          <Text style={styles.sectionTitle}>Grocery Staples</Text>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            renderItem={renderCartItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Total Bill</Text>
            <Text style={styles.totalPrice}>₹ {total}</Text>
          </View>
        </View>
      )}

      {/* Checkout */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.payBtn,
            { backgroundColor: cartItems.length === 0 ? "#ccc" : "#416944" },
          ]}
          disabled={cartItems.length === 0}
          onPress={() => router.push("../PaymentScreen")}
        >
          <Text style={styles.payText}>Proceed To Pay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FDF8",
  },
  header: {
    paddingTop: 45,
    paddingBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#416944",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  backButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    padding: 6,
  },
  profileCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  profileText: { color: "#416944", fontWeight: "bold", fontSize: 16 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginVertical: 12,
    color: "#416944",
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 5,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  image: {
    width: 55,
    height: 55,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  name: {
    fontWeight: "600",
    fontSize: 14,
    color: "#333",
  },
  qtyPrice: {
    color: "#666",
    fontSize: 13,
    marginTop: 2,
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  qtyBtn: {
    borderWidth: 1,
    borderColor: "#416944",
    padding: 5,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  qtyBtnText: {
    color: "#416944",
    fontWeight: "700",
    fontSize: 16,
  },
  qtyCount: {
    fontWeight: "600",
    color: "#333",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#eaeaea",
  },
  totalText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#333",
  },
  totalPrice: {
    fontSize: 17,
    fontWeight: "700",
    color: "#416944",
  },
  footer: {
    padding: 14,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  payBtn: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    elevation: 3,
  },
  payText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: "gray",
    fontWeight: "500",
  },
});
