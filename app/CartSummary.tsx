import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from 'expo-router';


const router = useRouter();
const CartSummary = ({ totalItems, totalCost, onClearCart }: { totalItems: number, totalCost: number, onClearCart: () => void }) => {
  return (
    <View style={styles.cartBar}>
      <View style={styles.leftContainer}>
        <Text style={styles.totalItemsText}>
          {totalItems} items
        </Text>
        <Text style={styles.totalCostText}>
          ₹{totalCost}
        </Text>
      </View>
      <TouchableOpacity onPress={() => router.push("/(tabs)/Cart")} style={styles.rightContainer}>
        <Text style={styles.viewCartText}>
          View Cart
        </Text>
        <FontAwesome name="shopping-cart" size={18} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onClearCart}>
         <FontAwesome name="times-circle" size={18} color="white" style={styles.cancelIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cartBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#416944',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalItemsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  totalCostText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#37573A',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  viewCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  cancelIcon: {
    marginLeft: 8,
  }
});

export default CartSummary;
