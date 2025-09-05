import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '../UserContext';

const MyHeader = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();

  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

  
  if (isLoading) {
    return (
      <SafeAreaView>
        <View style={styles.topBar}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <View style={styles.topBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            justifyContent: "space-between",
            alignItems: "flex-end",
            alignContent: "space-between",
          }}
        >
          <View style={styles.leftContainer}>
            <MaterialIcons
              name="location-pin"
              size={24}
              color="#416944"
              style={styles.locationIcon}
            />
            <View>
  
              <View style={styles.locationTopRow}>
                <Text
                  onPress={() => router.push('/SelectAddress')}
                  style={styles.username}
                >
                  {user?.name || "User"}
                </Text>
                <FontAwesome
                  name="angle-down"
                  size={18}
                  style={{ paddingTop: 3, fontWeight: "bold" }}
                />
              </View>

              <Text
                style={styles.locationAddress}
                numberOfLines={1}
                ellipsizeMode="clip"
              >
                {user?.selectedAddress?.details ||
                  user?.addresses?.[0]?.details ||
                  "No address selected"}
              </Text>
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity onPress={() => router.push("/Profile")}>
          <View style={styles.profileIcon}>
            <Text style={styles.profileText}>{initial}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: "stretch",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    width: 300,
  },
  locationIcon: {
    marginRight: 8,
  },
  locationTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 5,
  },
  locationAddress: {
    fontSize: 10,
    color: 'gray',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#416944",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
  },
  profileText: {
    color: "#fff",
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default MyHeader;
