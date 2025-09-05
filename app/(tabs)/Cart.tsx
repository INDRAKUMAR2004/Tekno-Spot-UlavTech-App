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

export default function CartScreen() {
  const {cartItems, updateQty, removeFromCart } = useCart();
  const router = useRouter();

type CartItem = {
  id: string;
  price: number | string;
  qty: number;
  name: string;
  image: any;
};


 const total = cartItems.reduce((sum, item) => {
  return sum + (item.price || 0) * (item.quantity || 0);
}, 0);


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
          <Text>-</Text>
        </TouchableOpacity>
        <Text>{item.quantity}</Text>
        <TouchableOpacity
          onPress={() => updateQty(item.id, item.quantity + 1)}
          style={styles.qtyBtn}
        >
          <Text>+</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => removeFromCart(item.id)}>
        <Ionicons name="trash" size={20} color="red" style={{ marginLeft: 8 }} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Cart</Text>
      </View>

      {/* Cart Items */}
      {cartItems.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 16, fontWeight: "600", color: "gray" }}>
            No items in the cart
          </Text>
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
          onPress={() => {
            // console.log("Proceeding to Pay...");
            router.push("../PaymentScreen");
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
            Proceed To Pay
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 30,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", marginLeft: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginVertical: 10 },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FFF9",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  image: { width: 50, height: 50, borderRadius: 25 },
  name: { fontWeight: "600" },
  qtyPrice: { color: "gray", fontSize: 13 },
  qtyRow: { flexDirection: "row", alignItems: "center" },
  qtyBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 4,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  totalText: { fontSize: 16, fontWeight: "700" },
  totalPrice: { fontSize: 16, fontWeight: "700", color: "#416944" },
  footer: {
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  payBtn: {
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
});
