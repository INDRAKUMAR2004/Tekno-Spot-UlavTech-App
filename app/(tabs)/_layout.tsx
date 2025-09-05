import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { AntDesign, Feather, MaterialCommunityIcons, Octicons } from "@expo/vector-icons";


export default function TabsLayout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: '#416944',
            tabBarInactiveTintColor: '#000000ff',
            tabBarLabelStyle: { fontWeight: 'bold'}}}>
            <Tabs.Screen
                name="Home"
                options={
                    {
                        tabBarIcon: ({ color }) => <Octicons name="home" size={25} color={color} />,

                    }
                }
            />
            <Tabs.Screen
                name="Category"
                options={
                    {
                        tabBarIcon: ({ color }) => <Feather name="grid" size={25} color={color} />,

                    }
                }
            />
            <Tabs.Screen
                name="Cart"
                options={
                    {
                        tabBarIcon: ({ color }) => <MaterialCommunityIcons name="cart-outline" size={25} color={color} />,

                    }
                }
            />
            <Tabs.Screen
                name="Order"
                options={
                    {
                        tabBarIcon: ({ color }) => <AntDesign name="filetext1" size={25} color={color} />,

                    }
                }
            />
        </Tabs>
    );
}