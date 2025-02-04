import React from "react";
import { StyleSheet, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Invoice from "./Pages/Invoice";
import Clients from "./Pages/Clients";
import Items from "./Pages/Items";
import Estimate from "./Pages/Estimate";
import Ionicons from "react-native-vector-icons/Ionicons";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const TabNavigationContainer = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Invoice") {
            iconName = focused ? "document-text" : "document-text-outline";
          } else if (route.name === "Estimate") {
            iconName = focused ? "calculator" : "calculator-outline";
          } else if (route.name === "Items") {
            iconName = focused ? "pricetag" : "pricetag-outline";
          } else if (route.name === "Clients") {
            iconName = focused ? "people" : "people-outline";
          }

          return (
            <View
              style={{
                backgroundColor: focused ? "#668FE9" : "transparent",
                width: 60,
                height: 40,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 20,
              }}
            >
              <Ionicons name={iconName} size={size} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#A1B4E7",
        tabBarLabel: () => null,
        tabBarStyle: {
          paddingTop: 15,
          paddingHorizontal: 20, // Adjust horizontal padding
          height: 70, // Adjust height to accommodate padding
          marginHorizontal: 20,
          marginBottom: 20,
          borderRadius: 40,
          backgroundColor: "#3567E4",
          elevation: 20,
        },
        tabBarButton: (props) => <TouchableWithoutFeedback {...props} />, // Remove ripple effect
      })}
    >
      <Tab.Screen name="Invoice" component={Invoice} />
      <Tab.Screen name="Estimate" component={Estimate} />
      <Tab.Screen name="Items" component={Items} />
      <Tab.Screen name="Clients" component={Clients} />
    </Tab.Navigator>
  );
};

export default TabNavigationContainer;

const styles = StyleSheet.create({});
