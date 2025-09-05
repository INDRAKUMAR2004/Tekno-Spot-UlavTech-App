// app/Orders.tsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebaseConfig";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

export default function Orders() {
  const { firebaseUser } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!firebaseUser) { setLoading(false); return; }
      try {
        const q = query(collection(db, "orders"), where("uid", "==", firebaseUser.uid), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setOrders(data);
      } catch (err) {
        console.warn("Orders fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [firebaseUser]);

  if (loading) return <View style={{flex:1,justifyContent:"center",alignItems:"center"}}><Text>Loading...</Text></View>;
  if (!firebaseUser) return <View style={{flex:1,justifyContent:"center",alignItems:"center"}}><Text>Login to view orders</Text></View>;

  return (
    <View style={{flex:1,padding:12}}>
      {orders.length === 0 ? <Text>No orders</Text> : <FlatList data={orders} keyExtractor={o=>o.id} renderItem={({item})=>(
        <View style={{padding:12, backgroundColor:'#fff',marginBottom:8}}>
          <Text>Order: {item.id}</Text>
          <Text>Total: ₹{item.total}</Text>
        </View>
      )} />}
    </View>
  );
}
