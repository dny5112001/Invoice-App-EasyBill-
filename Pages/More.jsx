import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import Material from "react-native-vector-icons/MaterialCommunityIcons";
import SimpleLine from "react-native-vector-icons/SimpleLineIcons";

const More = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>More</Text>
      <ScrollView style={styles.scrollView}>
        <View style={styles.listContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => {
                const excludedLabels = [
                  "Share this App",
                  "Support Us",
                  "Rate Us",
                ];
                if (!excludedLabels.includes(item.label)) {
                  navigation.navigate(item.label);
                }
              }}
            >
              <View style={styles.menuItemContent}>
                <View style={styles.iconContainer}>
                  <item.icon name={item.iconName} size={24} color="#3567E4" />
                </View>
                <Text style={styles.menuText}>{item.label}</Text>
              </View>
              <Material name="chevron-right" size={20} color="#3567E4" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const menuItems = [
  { label: "My Business", icon: Material, iconName: "storefront-outline" },
  { label: "Dashboard", icon: Material, iconName: "view-dashboard-outline" },
  { label: "Report", icon: Material, iconName: "file-document-outline" },
  { label: "Settings", icon: SimpleLine, iconName: "settings" },
  {
    label: "Share this App",
    icon: Material,
    iconName: "share-variant-outline",
  },
  { label: "About Us", icon: Material, iconName: "information-outline" },
  { label: "Support Us", icon: Material, iconName: "email-open-outline" },
  { label: "Rate Us", icon: Material, iconName: "star-outline" },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    color: "#2D3748",
    marginBottom: 40,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EDF2F7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    color: "#4A5568",
  },
});

export default More;
