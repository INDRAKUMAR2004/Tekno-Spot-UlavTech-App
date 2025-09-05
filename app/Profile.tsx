import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { Stack, useRouter } from "expo-router";
import { FontAwesome, AntDesign, MaterialIcons, Ionicons } from "@expo/vector-icons";
import PaymentIcon from "./Components/SvgIcons/paymentIcon";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/firebaseConfig";

export default function Profile() {
  const router = useRouter();
  const { user, userData } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Logged out", "You have been signed out successfully.");
      router.replace("/LoginScreen");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f9f9f9", paddingTop: 30 }}>
      <Stack.Screen options={{ headerTitle: "" }} />

      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profileCircle}>
          <FontAwesome name="user" size={32} />
        </View>
        <AntDesign
          name="edit"
          size={20}
          style={{ paddingTop: 5 }}
          onPress={() => router.push("/PersonalInfo")}
        />
        <Text style={styles.profileName}>{userData?.name || "No Name"}</Text>
        <Text style={styles.profileEmail}>{userData?.email || user?.email}</Text>
        <Text style={styles.profilePhone}>{userData?.phone || "No Phone Added"}</Text>
      </View>

      {/* Account Settings */}
      <Text style={styles.proTitle}>Account Settings</Text>
      <View style={styles.accountSetting}>
        <ScrollView horizontal style={{ paddingVertical: 15 }}>
          <FontAwesome name="user" size={20} />
          <TouchableOpacity onPress={() => router.push("/PersonalInfo")}>
            <Text style={styles.menu}> Personal Information</Text>
          </TouchableOpacity>
        </ScrollView>
        <ScrollView horizontal style={{ paddingVertical: 15 }}>
          <MaterialIcons name="password" size={20} />
          <TouchableOpacity>
            <Text style={styles.menu}>Change Password</Text>
          </TouchableOpacity>
        </ScrollView>
        <ScrollView horizontal style={{ paddingVertical: 15 }}>
          <Ionicons name="location-outline" size={20} />
          <TouchableOpacity>
            <Text style={styles.menu}>Delivery Address</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Payment Method */}
      <Text style={styles.proTitle}>Payment Method</Text>
      <View style={styles.accountSetting}>
        <ScrollView horizontal>
          <PaymentIcon />
          <TouchableOpacity>
            <Text style={styles.menu}>Add Payment Method</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Logout */}
      <Text style={styles.proTitle}>Logout</Text>
      <View style={styles.accountSetting}>
        <ScrollView horizontal>
          <MaterialIcons name="logout" size={20} />
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.menu}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    margin: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 10,
  },
  profileCircle: {
    backgroundColor: "#ffe",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
    padding: 20,
    width: 70,
    height: 70,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontWeight: "600",
    fontSize: 20,
    paddingTop: 5,
  },
  profileEmail: {
    fontWeight: "300",
    color: "#666",
  },
  profilePhone: {
    fontWeight: "300",
    color: "#666",
  },
  proTitle: {
    color: "rgba(153, 153, 153, 1)",
    fontSize: 18,
    marginHorizontal: 20,
    marginTop: 10,
  },
  accountSetting: {
    margin: 20,
    padding: 20,
    alignItems: "flex-start",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 5,
  },
  menu: {
    fontWeight: "bold",
    paddingLeft: 20,
    fontSize: 15,
  },
});
