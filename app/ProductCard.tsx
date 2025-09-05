import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

interface Product {
    source: any;
    name: string;
    weight: string;
    price: string;
}


export default function ProductCard({ item, onAddToCart }: { item: Product, onAddToCart: () => void }) {
    return (
        <View style={styles.card}>
            <Text style={styles.price}>₹ {item.price}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Image source={item.source} style={styles.image} resizeMode="contain" />
            <Text style={styles.weight}>{item.weight}</Text>
            <TouchableOpacity style={styles.button} onPress={onAddToCart}>
                <Text style={styles.buttonText}>Add To Cart</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 10,
        margin: 10,
        width: 150,
        backgroundColor: "#F2F2F2",
        borderRadius: 12,
        alignItems: "center",
        borderColor: "#7C994C",
        borderWidth: 2,
    },
    image: {
        width: 80,
        height: 80,
    },
    name: {
        fontWeight: "bold",
        marginTop: 8,
        fontSize: 20,
        paddingBottom: 5
    },
    weight: {
        color: "#000",
    },
    price: {
        backgroundColor: "#416944",
        color: "#fff",
        paddingVertical: 8,
        borderRadius: 12,
        paddingHorizontal: 15,
        fontWeight: "bold",
    },
    button: {
        backgroundColor: "#416944",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
        marginTop: 8,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});
