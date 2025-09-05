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
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <MyHeader />
      </View>

      <ScrollView>
        <View style={styles.container}>
          {/* 🔍 Search Box */}
          <View style={styles.searchBoxContainer}>
            <FontAwesome
              name="search"
              size={20}
              color="#888"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchBox}
              placeholder="Search Our Products"
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
                <Text style={{ textAlign: "center", marginTop: 20 }}>
                  No items found.
                </Text>
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
                <Text style={styles.titleLeftText}>Fast Moving</Text>
                <TouchableOpacity
                  onPress={() => router.push("/componentTabs/mainComponents")}
                >
                  <Text style={styles.titleRightText}>
                    View All{" "}
                    <FontAwesome name="arrow-right" size={12} color={"#416944"} />
                  </Text>
                </TouchableOpacity>
              </View>
              <FastMovingRow />

              {/* Fruits & Veggies Section */}
              <View style={[styles.titlebar, { marginTop: 10 }]}>
                <Text style={styles.titleLeftText}>
                  24-Hours delivery-fresh fruits & vegetables
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/componentTabs/mainComponents")}
                >
                  <Text style={styles.titleRightText}>
                    View All{" "}
                    <FontAwesome name="arrow-right" size={12} color={"#416944"} />
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={{ padding: 15 }}>
                Get select items delivered within 24 hours!
              </Text>

              {/* Horizontal Scroll Products */}
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

      {/* Cart Summary */}
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 70,
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  profileCircle: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: "#416944",
    justifyContent: "center",
    alignItems: "center",
  },
  profileText: { color: "#fff", fontWeight: "bold" },
  searchBoxContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    backgroundColor: "#EFF2EB",
    borderColor: "#EFF2EB",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
    color: "#416944",
  },
  searchBox: {
    flex: 1,
    paddingVertical: 8,
    fontWeight: "700",
  },
  titlebar: {
    backgroundColor: "#DFE4D9",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  titleLeftText: {
    fontWeight: "900",
    fontSize: 13,
  },
  titleRightText: {
    fontWeight: "900",
    fontSize: 12,
    color: "#416944",
  },
});
