import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { firebaseUser } = useAuth();
  const router = useRouter();

  const handleChangePassword = async () => {
    if (!firebaseUser) {
      Alert.alert("Error", "User not logged in.");
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Missing Fields", "Please fill all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Mismatch", "New password and confirmation do not match.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      // Reauthenticate the user
      const credential = EmailAuthProvider.credential(firebaseUser.email, currentPassword);
      await reauthenticateWithCredential(firebaseUser, credential);

      // Update password
      await updatePassword(firebaseUser, newPassword);

      Alert.alert("Success", "Your password has been updated.");
      router.back(); // Navigate back to Profile
    } catch (err: any) {
      if (err.code === "auth/wrong-password") {
        Alert.alert("Incorrect Password", "The current password you entered is incorrect.");
      } else if (err.code === "auth/too-many-requests") {
        Alert.alert("Too Many Attempts", "Please try again later.");
      } else {
        Alert.alert("Error", err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>

      <TextInput
        placeholder="Current Password"
        secureTextEntry
        style={styles.input}
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />

      <TextInput
        placeholder="New Password"
        secureTextEntry
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <TextInput
        placeholder="Confirm New Password"
        secureTextEntry
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleChangePassword}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "Updating..." : "Update Password"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 30,
    color: "#416944",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#416944",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelText: {
    textAlign: "center",
    color: "#416944",
    fontWeight: "500",
    marginTop: 15,
  },
});
