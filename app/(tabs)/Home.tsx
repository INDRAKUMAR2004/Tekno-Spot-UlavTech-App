import {
  Text,
  View,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import MyHeader from "../MyHeader";
import Banner from "../Banner";
import FastMovingRow from "../FastMovingRow";
import ProductCard from "../ProductCard";
import CartSummary from "../CartSummary";
import { useCart } from "../../context/CartContext";
import { useUser } from "../../UserContext";

const PRODUCT_DATA = [
  { id: "1", name: "Ginger", source: require("../Components/Images/ginger.png"), price: "25", weight: "250gm" },
  { id: "2", name: "Apple", source: require("../Components/Images/apple.png"), price: "180", weight: "1kg" },
  { id: "3", name: "Ladies Finger", source: require("../Components/Images/ladiesfinger.png"), price: "35", weight: "500gm" },
  { id: "4", name: "Cauliflower", source: require("../Components/Images/cauliflower.png"), price: "35", weight: "750gm" },
];

export default function Home() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [search, setSearch] = useState("");
  const { cartItems, addToCart, removeFromCart, clearCart } = useCart();
  const { user } = useUser();
  const initial = user?.name?.charAt(0).toUpperCase() || "M";

  useEffect(() => {
    if (params.clearCart === "true") {
      clearCart();
      router.setParams({ clearCart: undefined });
    }
  }, [params]);

  const cartTotal = cartItems.reduce(
    (sum: number, item: { price: number; quantity: number }) =>
      sum + item.price * item.quantity,
    0
  );

  const totalItems = cartItems.reduce(
    (sum: number, item: { quantity: number }) => sum + item.quantity,
    0
  );

  const filteredData = search
    ? PRODUCT_DATA.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      )
    : PRODUCT_DATA;

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <MyHeader />
      </View>

      <ScrollView>
        <View style={styles.container}>
          {/* 🔍 Search Box */}
          <View style={styles.searchBoxContainer}>
            <FontAwesome
              name="search"
              size={18}
              color="#416944"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchBox}
              placeholder="Search Our Products"
              placeholderTextColor="#6b6b6b"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {search.length > 0 ? (
            <FlatList
              data={filteredData}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ProductCard item={item} onAddToCart={() => addToCart(item)} />
              )}
              ListEmptyComponent={
                <Text style={styles.noItemsText}>No items found.</Text>
              }
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          ) : (
            <>
              <Banner />

              {/* Fast Moving Section */}
              <View style={styles.titlebar}>
                <Text style={styles.titleLeftText}>⚡ Fast Moving</Text>
                <TouchableOpacity
                  onPress={() => router.push("/componentTabs/mainComponents")}
                >
                  <Text style={styles.titleRightText}>
                    View All <FontAwesome name="arrow-right" size={12} color="#416944" />
                  </Text>
                </TouchableOpacity>
              </View>

              <FastMovingRow />

              {/* Fruits & Veggies Section */}
              <View style={[styles.titlebar, { marginTop: 16 }]}>
                <Text style={styles.titleLeftText}>
                  🥬 24-Hour Delivery – Fresh Fruits & Vegetables
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/componentTabs/mainComponents")}
                >
                  <Text style={styles.titleRightText}>
                    View All <FontAwesome name="arrow-right" size={12} color="#416944" />
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.subInfoText}>
                Get select items delivered within 24 hours!
              </Text>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {PRODUCT_DATA.map((item) => (
                  <ProductCard
                    key={item.id}
                    item={item}
                    onAddToCart={() => addToCart(item)}
                  />
                ))}
              </ScrollView>
            </>
          )}
        </View>
      </ScrollView>

      {/* 🛒 Cart Summary */}
      {cartItems.length > 0 && (
        <CartSummary
          totalItems={totalItems}
          totalCost={Number(cartTotal)}
          onClearCart={clearCart}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAF6",
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: "#e0e0e0",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 70,
  },
  searchBoxContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F4EE",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E0E7DA",
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchBox: {
    flex: 1,
    paddingVertical: 10,
    fontWeight: "600",
    fontSize: 14,
    color: "#2D2D2D",
  },
  titlebar: {
    backgroundColor: "#E8EFE6",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  titleLeftText: {
    fontWeight: "900",
    fontSize: 13,
    color: "#2E3B2E",
  },
  titleRightText: {
    fontWeight: "900",
    fontSize: 12,
    color: "#416944",
  },
  subInfoText: {
    color: "#6b6b6b",
    fontSize: 13,
    padding: 15,
    paddingBottom: 10,
  },
  noItemsText: {
    textAlign: "center",
    marginTop: 20,
    color: "gray",
    fontWeight: "600",
  },
});
