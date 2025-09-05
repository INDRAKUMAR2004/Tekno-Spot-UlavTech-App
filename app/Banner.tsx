import React, { useRef, useEffect, useState } from "react";
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  FlatList as RNFlatList,
} from "react-native";

const { width } = Dimensions.get("window");

type ImageItem = { id: string; uri: any };

const images: ImageItem[] = [
  { id: "1", uri: require("./Components/Images/Banner1.png")},
  { id: "2", uri: require("./Components/Images/Banner2.png")},
  { id: "3", uri: require("./Components/Images/Banner3.png")},
];

export default function Banner() {
  const flatListRef = useRef<RNFlatList<ImageItem>>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (index + 1) % images.length;
      setIndex(nextIndex);

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [index]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.imageWrapper}>
    <Image
      source={typeof item.uri === "string" ? { uri: item.uri } : item.uri}
      style={styles.image}
    />
  </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 200 },
  image: {
     width: "92%",
    height: "90%",
    resizeMode: "contain",
    borderRadius: 12,
    borderBottomRightRadius: 32,
    borderTopLeftRadius: 32,
    borderBottomLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  imageWrapper: {
    width: width,
    height: 200,
    borderBottomRightRadius: 32,
    borderTopLeftRadius: 32,
    borderBottomLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "hidden",   
  },
});
