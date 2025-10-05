// app/Orders.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebaseConfig";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { useUser } from "@/UserContext";

export default function Orders() {
  const { firebaseUser } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

  useEffect(() => {
    const fetchOrders = async () => {
      if (!firebaseUser) {
        setLoading(false);
        return;
      }
      try {
        const q = query(
          collection(db, "orders"),
          where("uid", "==", firebaseUser.uid),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setOrders(data);
      } catch (err) {
        console.warn("Orders fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [firebaseUser]);

  if (loading)
    return (
      <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/Home")}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <TouchableOpacity onPress={() => router.push("/Profile")}>
          <View style={styles.profileCircle}>
            <Text style={styles.profileText}>{initial}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#416944" />
        <Text style={{ marginTop: 10, color: "#555" }}>Loading orders...</Text>
      </View>
      </SafeAreaView>
    );

  if (!firebaseUser)
    return (
      <View style={styles.centered}>
        <Text style={{ fontSize: 16, color: "#444" }}>
          Please login to view your orders
        </Text>
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
        <Text style={styles.headerTitle}>My Orders</Text>
        <TouchableOpacity onPress={() => router.push("/Profile")}>
          <View style={styles.profileCircle}>
            <Text style={styles.profileText}>{initial}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {orders.length === 0 ? (
        <View style={styles.centered}>
          <Text style={{ color: "#777", fontSize: 16 }}>No orders found</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(order) => order.id}
          renderItem={({ item }) => (
            <View style={styles.orderCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.orderId}>Order ID: {item.id}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        item.status === "Delivered"
                          ? "#3B7C3C"
                          : item.status === "Pending"
                            ? "#F2A900"
                            : "#416944",
                    },
                  ]}
                >
                  <Text style={styles.statusText}>{item.status || "Processing"}</Text>
                </View>
              </View>

              <Text style={styles.total}>Total: ₹{item.totalAmount}</Text>

              {item.createdAt?.toDate && (
                <Text style={styles.date}>
                  Ordered on: {item.createdAt.toDate().toLocaleString()}
                </Text>
              )}

              <View style={styles.itemsContainer}>
                <Text style={styles.itemsTitle}>Items:</Text>
                {item.items?.map((prod: any, index: number) => (
                  <View key={index} style={styles.itemRow}>
                    <Text style={styles.itemName}>{prod.name}</Text>
                    <Text style={styles.itemQty}>x{prod.quantity}</Text>
                    <Text style={styles.itemPrice}>
                      ₹{(prod.price * prod.quantity).toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FDF8",
  },
  container: {
    flex: 1,
    backgroundColor: "#F3F7F3",
    paddingHorizontal: 12,
    paddingTop: 10,
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#416944",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderId: {
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
    fontSize: 15,
  },
  total: {
    fontSize: 16,
    fontWeight: "700",
    color: "#416944",
    marginTop: 5,
  },
  date: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  itemsContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingTop: 8,
  },
  itemsTitle: {
    fontWeight: "700",
    marginBottom: 6,
    color: "#333",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F9FFF9",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 4,
  },
  itemName: { flex: 1, color: "#333", fontWeight: "500" },
  itemQty: { width: 50, textAlign: "center", color: "#555" },
  itemPrice: { width: 80, textAlign: "right", color: "#416944", fontWeight: "600" },
});
