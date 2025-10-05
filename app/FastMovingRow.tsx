import React from "react";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

const fastMovingProducts = [
  {
    id: "1",
    name: "Karuppukavini Rice",
    image: require("./Components/Images/karupukavuni.png"),
  },
  {
    id: "2",
    name: "Groundnut Oil",
    image: require("./Components/Images/grounnutoil.png"),
  },
  {
    id: "3",
    name: "White Rice",
    image: require("./Components/Images/wrice.png"),
  },
  {
    id: "4",
    name: "Brown Rice",
    image: require("./Components/Images/brice.png"),
  },
];

export default function FastMovingRow() {
  const router = useRouter();

  const handlePress = (product: { id?: string; name: any; image?: any; }) => {
    router.push({
      pathname: "/componentTabs/mainComponents",
      params: { productName: product.name },
    });
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.scrollRow}>
        {fastMovingProducts.map((product) => (
          <View key={product.id} style={styles.singleFoodContainer}>
            <Text style={styles.foodTitle}>{product.name}</Text>
            <TouchableOpacity onPress={() => handlePress(product)}>
              <Image
                source={product.image}
                style={styles.productImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollRow: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  singleFoodContainer: {
    padding: 10,
    marginHorizontal: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  foodTitle: {
    fontWeight: "700",
    color: "#333",
    fontSize: 14,
    marginBottom: 8,
    textAlign: "center",
  },
  productImage: {
    width: 100,
    height: 100,
  },
});
