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
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/componentTabs/mainComponents",
            params: { category: item.name },
          })
        }
      >
        <View>
          <Image source={item.image} style={styles.imagePlaceholder} />
          <Text style={styles.categoryName}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderListItem = ({ item }: { item: Category }) => (
    <View>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/componentTabs/mainComponents",
            params: { category: item.name },
          })
        }
      >
        <View style={styles.listItem}>
          <Image source={item.image} style={styles.listImage} />
          <View style={{ flex: 1 }}>
            <Text style={styles.listCategoryName}>{item.name}</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#416944" />
        </View>
      </TouchableOpacity>
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
          <Ionicons name="search" size={18} color="#416944" />
          <TextInput
            placeholder="Search our products..."
            placeholderTextColor="#888"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity onPress={toggleView} style={styles.toggleBtn}>
          {isGrid ? (
            <MaterialIcons name="list" size={22} color="#416944" />
          ) : (
            <Ionicons name="grid" size={22} color="#416944" />
          )}
        </TouchableOpacity>
      </View>

      {/* Categories Section */}
      {noResults ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No items found</Text>
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
          renderItem={({ item }) => (!isGrid ? renderListItem({ item }) : null)}
          contentContainerStyle={{ paddingBottom: 20 }}
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
  profileCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  profileText: { color: "#416944", fontWeight: "bold", fontSize: 16 },

  // Search bar section
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 42,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchInput: {
    marginLeft: 8,
    flex: 1,
    color: "#333",
    fontSize: 14,
  },
  toggleBtn: {
    marginLeft: 10,
    padding: 8,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 2,
  },

  // Grid view
  gridItem: {
    flex: 1,
    margin: 6,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  imagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F0F0F0",
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },

  // List view
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  listImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },
  listCategoryName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },

  // Section header
  sectionHeader: {
    fontSize: 17,
    fontWeight: "700",
    marginTop: 14,
    marginBottom: 6,
    marginLeft: 8,
    color: "#416944",
  },

  // Empty view
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "gray",
    marginTop: 10,
  },
});
