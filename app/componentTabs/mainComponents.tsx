// CategoryTabs.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/UserContext";
import CartSummary from "../CartSummary";

const { width } = Dimensions.get("window");

// 🔹 Product Type
type Product = {
  id: string;
  name: string;
  price: number;
  image: any;
};

// 🔹 Product Data 
const riceProducts: Product[] = [
  { id: "1", name: "White Rice", price: 60, image: require("../Components/Images/rice.png") },
  { id: "2", name: "Basmati Rice", price: 60, image: require("../Components/Images/rice.png") },
  { id: "3", name: "Brown Rice", price: 60, image: require("../Components/Images/rice.png") },
  { id: "4", name: "Matta Rice", price: 60, image: require("../Components/Images/rice.png") },
];

const flourProducts: Product[] = [
  { id: "5", name: "Wheat Flour", price: 55, image: require("../Components/Images/flour.png") },
  { id: "6", name: "Maida", price: 50, image: require("../Components/Images/flour.png") },
];

const nutsProducts: Product[] = [
  { id: "7", name: "Almonds", price: 120, image: require("../Components/Images/nuts.png") },
  { id: "8", name: "Cashews", price: 150, image: require("../Components/Images/nuts.png") },
];

const spicesProduct: Product[] = [
  { id: "9", name: "Cardomom", price: 50, image: "" },
  { id: "10", name: "Elachi", price: 30, image: "" },
  { id: "11", name: "Clove", price: 45, image: "" },
];

const milletsProducts: Product[] = [
  { id: "12", name: "Karuppukavini Rice", price: 50, image: require("../Components/Images/karupukavuni.png") },
  { id: "13", name: "Kuthiraivali Rice", price: 30, image: "" },
  { id: "14", name: "Samai Rice", price: 45, image: "" },
  { id: "15", name: "Ragi Rice", price: 45, image: "" },
];

const fruitsProducts: Product[] = [
  { id: "16", name: "Apple", price: 150, image: "" },
  { id: "17", name: "Mango", price: 30, image: "" },
  { id: "18", name: "Orange", price: 45, image: "" },
  { id: "19", name: "Grapes", price: 45, image: "" },
];

const vegetableProducts: Product[] = [
  { id: "20", name: "Carrot", price: 40, image: "" },
  { id: "21", name: "Beans", price: 80, image: "" },
  { id: "22", name: "Beetroot", price: 45, image: "" },
  { id: "23", name: "Brinjal", price: 50, image: "" },
];

// 🔹 Product Card
const renderProductCard = ({ item, onAddToCart }: { item: Product; onAddToCart: (item: Product) => void }) => (
  <View style={styles.card}>
    <View style={styles.priceTag}>
      <Text style={{ color: "#fff", fontWeight: "bold" }}>₹ {item.price}</Text>
    </View>
    {item.image ? (
      <Image source={typeof item.image === "string" ? { uri: item.image } : item.image} style={styles.productImage} />
    ) : (
      <View style={[styles.productImage, { backgroundColor: "#eee", justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ fontSize: 10, color: "#888" }}>No Image</Text>
      </View>
    )}
    <Text style={styles.productName}>{item.name}</Text>
    <TouchableOpacity style={styles.cartButton} onPress={() => onAddToCart(item)}>
      <Text style={{ fontWeight: "bold", color: "#333" }}>Add To Cart</Text>
    </TouchableOpacity>
  </View>
);

// 🔹 Grid Component
const ProductGrid = ({ data, onAddToCart }: { data: Product[]; onAddToCart: (item: Product) => void }) => (
  <FlatList
    data={data}
    renderItem={({ item }) => renderProductCard({ item, onAddToCart })}
    keyExtractor={(item) => item.id}
    numColumns={2}
    contentContainerStyle={{ padding: 10 }}
  />
);

export default function CategoryTabs() {
  const params = useLocalSearchParams<{ clearCart: string; category?: string }>();
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    { key: "Vegetables", title: "Vegetables", data: vegetableProducts },
    { key: "Fruits", title: "Fruits", data: fruitsProducts },
    { key: "Rice", title: "Rice", data: riceProducts },
    { key: "Flours", title: "Flours", data: flourProducts },
    { key: "Nuts", title: "Nuts", data: nutsProducts },
    { key: "Millets", title: "Millets", data: milletsProducts },
  ]);

  useEffect(() => {
    if (params?.category) {
      const idx = routes.findIndex(
        (r) => r.key.toLowerCase() === params.category?.toLowerCase()
      );
      if (idx !== -1) setIndex(idx);
    }
  }, [params]);

  const router = useRouter();
  const { cartItems, setCartItems } = useCart();
  const { user } = useUser();

  // Add to cart
  const addToCart = (item: Product) => {
    setCartItems((currentItems: any[]) => {
      const existingItem = currentItems.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return currentItems.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      } else {
        return [...currentItems, { ...item, quantity: 1 }];
      }
    });
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce(
    (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
    0
  );

  const totalItems = cartItems.reduce(
    (sum: number, item: { quantity: number }) => sum + item.quantity,
    0
  );

  
  const renderScene = ({ route }: { route: any }) => {
    return <ProductGrid data={route.data} onAddToCart={addToCart} />;
  };

  return (
    <>
      <TabView
        style={{ paddingTop: 30, backgroundColor: "#fff" }}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width }}
        renderTabBar={(props) =>
          <TabBar
            {...props}
            scrollEnabled
            indicatorStyle={{ backgroundColor: "#416944", height: 3 }}
            style={{ backgroundColor: "#fff", elevation: 0 }}
            tabStyle={{ width: 120 }}
            renderLabel={({ route, focused }) => (
              <Text style={{ color: focused ? "#416944" : "#000", fontWeight: focused ? "bold" : "normal" }}>
                {route.title}
              </Text>
            )}
          />
        }
      />

      {cartItems.length > 0 && (
        <CartSummary
          totalItems={totalItems}
          totalCost={Number(cartTotal)}
          onClearCart={clearCart}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
    alignItems: "center",
  },
  priceTag: {
    backgroundColor: "#416944",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    position: "absolute",
    top: 8,
    left: 8,
    zIndex: 1,
  },
  productImage: {
    width: 80,
    height: 80,
    marginBottom: 8,
    resizeMode: "contain",
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    textAlign: "center",
  },
  cartButton: {
    borderWidth: 1,
    borderColor: "#416944",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
});
