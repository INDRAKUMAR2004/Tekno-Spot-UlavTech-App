// app/FindAddress.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useUser } from "../UserContext";

type Selected = {
  lat: number;
  lng: number;
  address?: string;
};

export default function FindAddress() {
  const { user, setUser } = useUser();
  const router = useRouter();
  const webRef = useRef<WebView | null>(null);

  const [loading, setLoading] = useState(true);
  const [html, setHtml] = useState<string | null>(null);
  const [selected, setSelected] = useState<Selected | null>(null);
  const [fetchingAddress, setFetchingAddress] = useState(false);

  
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        let lat = 20.5937;
        let lng = 78.9629;

        if (status === "granted") {
          const pos = await Location.getCurrentPositionAsync({});
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
        }

        
        setHtml(createLeafletHtml(lat, lng));
      } catch (err) {
        console.warn("Location error", err);
        setHtml(createLeafletHtml(20.5937, 78.9629));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  
  const onMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data && data.lat && data.lng) {
        setSelected({ lat: data.lat, lng: data.lng });
        await doReverseGeocode(data.lat, data.lng);
      }
    } catch (err) {
      console.warn("onMessage parse error", err);
    }
  };

  
  const doReverseGeocode = async (lat: number, lng: number) => {
    try {
      setFetchingAddress(true);
  
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1`;
      const res = await fetch(url, {
        headers: {
          "User-Agent": "MyApp/1.0 (contact@example.com)" 
        }
      });
      const json = await res.json();
      const display = json.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      setSelected({ lat, lng, address: display });
    } catch (err) {
      console.warn("reverse geocode failed", err);
      setSelected((s) => (s ? { ...s, address: "No Address Selected" } : { lat, lng, address: "No Address Selected" }));
    } finally {
      setFetchingAddress(false);
    }
  };

  
  const confirmAddress = () => {
    if (!selected) {
      Alert.alert("No location selected", "Tap on the map to pick a location first.");
      return;
    }
    const newAddr = {
      id: Date.now().toString(),
      label: selected.address ? selected.address.split(",")[0] : "Selected location",
      details: selected.address || `${selected.lat}, ${selected.lng}`,
    };

    setUser(prev => ({
      ...prev,
      addresses: [...prev.addresses, newAddr],
      selectedAddress: newAddr,
    }));

    router.back();
  };

  if (loading || !html) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Preparing map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tap map to pick a location</Text>
        <Text style={styles.subtitle}>Tap anywhere on the map to set marker</Text>
      </View>

      <WebView
        ref={webRef}
        originWhitelist={["*"]}
        source={{ html }}
        style={styles.webview}
        onMessage={onMessage}
      />

      <View style={styles.footer}>
        {selected ? (
          <>
            <Text numberOfLines={2} style={styles.addressText}>
              {fetchingAddress ? "Fetching address..." : selected.address || `${selected.lat.toFixed(6)}, ${selected.lng.toFixed(6)}`}
            </Text>

            <TouchableOpacity style={styles.confirmBtn} onPress={confirmAddress} disabled={fetchingAddress}>
              <Text style={styles.confirmBtnText}>Confirm Location</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.hint}>Tap on the map to place a marker and fetch address</Text>
        )}
      </View>
    </View>
  );
}

function createLeafletHtml(initialLat: number, initialLng: number) {
  return `<!doctype html>
<html>
<head>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
  <style>html,body,#map{height:100%;margin:0;padding:0} #map{height:100vh}</style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
  <script>
    (function(){
      const initialLat = ${initialLat};
      const initialLng = ${initialLng};

      const map = L.map('map').setView([initialLat, initialLng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      var marker = null;

      map.on('click', function(e) {
        if (marker) { map.removeLayer(marker); marker = null; }
        marker = L.marker(e.latlng).addTo(map);
        // send lat/lng back to React Native
        const msg = JSON.stringify({ lat: e.latlng.lat, lng: e.latlng.lng });
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(msg);
      });

      // optional: add a button to go to current location if available (web geolocation)
      function goTo(lat,lng){
        map.setView([lat,lng], 15);
      }

      // expose a function for RN to call if needed:
      window.goToLocation = goTo;
    })();
  </script>
</body>
</html>`;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingVertical: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { padding: 12, borderBottomWidth: 1, borderColor: "#eee" },
  title: { fontSize: 16, fontWeight: "700" },
  subtitle: { color: "#666", marginTop: 4 },
  webview: { flex: 1, backgroundColor: "#fff" },
  footer: { padding: 12, borderTopWidth: 1, borderColor: "#eee" },
  addressText: { fontSize: 14, marginBottom: 10, color: "#333" },
  hint: { color: "#666" },
  confirmBtn: {
    backgroundColor: "#2E7D32",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  confirmBtnText: { color: "#fff", fontWeight: "700" },
});
