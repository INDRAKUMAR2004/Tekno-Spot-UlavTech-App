import React, { useState } from "react";
import {
  View,
  Text,
  SectionList,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  TextInput,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useUser } from "../../UserContext";

type Category = {
  id: string;
  name: string;
  image: any;
};

const groceryCategories: Category[] = [
  { id: "1", name: "Rice", image: require("../Components/Images/rice.png") },
  { id: "2", name: "Flours", image: require("../Components/Images/flour.png") },
  { id: "3", name: "Nuts", image: require("../Components/Images/nuts.png") },
  { id: "4", name: "Spices", image: require("../Components/Images/spices.png") },
  { id: "5", name: "Millets", image: require("../Components/Images/millets.png") },
  { id: "6", name: "Sugar", image: require("../Components/Images/sugar.png") },
];

const freshCategories: Category[] = [
  { id: "7", name: "Vegetables", image: require("../Components/Images/vegetables.png") },
  { id: "8", name: "Fruits", image: require("../Components/Images/fruits.png") },
];

const sections = [
  { title: "Fresh. Fast. Delivered 24/7", data: freshCategories },
  { title: "Grocery Staples", data: groceryCategories },
];

export default function CategoryScreen() {
  const [isGrid, setIsGrid] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const toggleView = () => setIsGrid(!isGrid);

  const filteredSections = search
    ? sections
      .map((section) => ({
        ...section,
        data: section.data.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        ),
      }))
      .filter((section) => section.data.length > 0)
    : sections;

  const noResults = search && filteredSections.length === 0;

  const { user } = useUser();
  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

  const renderGridItem = ({ item }: { item: Category }) => (
    <View style={styles.gridItem}>
      <TouchableOpacity onPress={() =>
        router.push({
          pathname: "/componentTabs/mainComponents",
          params: { category: item.name }, 
        })
      }>
        <View>
          <Image source={item.image} style={styles.imagePlaceholder} />
          <Text style={styles.categoryName}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderListItem = ({ item }: { item: Category }) => (
    <View //style={styles.listItem}
    >
      <TouchableOpacity onPress={() =>
        router.push({
          pathname: "/componentTabs/mainComponents",
          params: { category: item.name }, 
        })
      }>
        <View style={styles.listItem}>
          <Image source={item.image} style={styles.imagePlaceholder} />
      <View style={{ flex: 1 }}>
        <Text style={styles.categoryName}>{item.name}</Text>
      </View>
      <Ionicons name="chevron-forward" size={22} color="#333" />
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/Home")}>
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Categories</Text>
        <TouchableOpacity onPress={() => router.push("/Profile")}>
          <View style={styles.profileCircle}>
            <Text style={styles.profileText}>{initial}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Search Bar + Toggle */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="gray" />
          <TextInput
            placeholder="Search Our Products"
            value={search}
            onChangeText={setSearch}
            style={{ marginLeft: 8, flex: 1 }}
          />
        </View>
        <TouchableOpacity onPress={toggleView} style={styles.toggleBtn}>
          {isGrid ? (
            <MaterialIcons name="list" size={22} color="#333" />
          ) : (
            <Ionicons name="grid" size={22} color="#333" />
          )}
        </TouchableOpacity>
      </View>

      {/* Categories with Section Headers */}
      {noResults ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 16, fontWeight: "600", color: "gray" }}>
            Item not found
          </Text>
        </View>
      ) : (
        <SectionList
          sections={filteredSections}
          keyExtractor={(item) => item.id}
          renderSectionHeader={({ section: { title, data } }) => (
            <View>
              <Text style={styles.sectionHeader}>{title}</Text>
              {isGrid && (
                <FlatList
                  data={data}
                  keyExtractor={(it) => it.id}
                  numColumns={2}
                  renderItem={renderGridItem}
                  scrollEnabled={false}
                />
              )}
            </View>
          )}
          renderItem={({ item }) =>
            !isGrid ? renderListItem({ item }) : null
          }
          contentContainerStyle={{ padding: 12 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  profileCircle: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: "#416944",
    justifyContent: "center",
    alignItems: "center",
  },
  profileText: { color: "#fff", fontWeight: "bold" },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  toggleBtn: {
    marginLeft: 10,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
  },
  gridItem: {
    flex: 1,
    margin: 6,
    backgroundColor: "#F9FFF9",
    borderRadius: 12,
    alignItems: "center",
    padding: 14,
    elevation: 2,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FFF9",
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    elevation: 2,
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E0E0E0",
    marginBottom: 8,
  },
  categoryName: { fontSize: 15, fontWeight: "bold", textAlign: "center" },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 6,
    marginLeft: 6,
    color: "#333",
  },
});
