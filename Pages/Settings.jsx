import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import Material from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getMainBusiness } from "../SqlSetup/db.jsx";

const { width } = Dimensions.get("window");
const cardWidth = (width - 60) / 2; // 20 padding on each side, 20 between cards

const SettingsCard = ({
  title,
  icon,
  IconComponent,
  subtitle,
  route,
  navigation,
  mainBusiness, // Receive mainBusiness as a prop
}) => (
  <TouchableOpacity
    style={styles.card}
    onPress={() => navigation.navigate(route, { item: mainBusiness })} // Pass correctly
  >
    <Text style={styles.cardTitle}>{title}</Text>
    <View style={styles.cardSubtitleContainer}>
      <Text style={{ color: "gray" }}>{subtitle}</Text>
      <View style={styles.iconContainer}>
        <IconComponent name={icon} size={20} color="#3567E4" />
      </View>
    </View>
  </TouchableOpacity>
);

const Settings = () => {
  const navigation = useNavigation();
  const [mainBusiness, setMainBusiness] = useState(null);

  // Fetch main business
  const fetchMainBusiness = useCallback(async () => {
    try {
      const data = await getMainBusiness();
      if (data.length > 0) {
        setMainBusiness(data[0]);
      }
    } catch (error) {
      console.error("Error fetching main business:", error);
    }
  }, [setMainBusiness]);

  // Fetch data when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchMainBusiness();
    }, [fetchMainBusiness])
  );

  console.log(mainBusiness);

  const settingsData = [
    {
      title: mainBusiness ? mainBusiness.businessName : "Business",
      subtitle: "Edit",
      icon: "office-building",
      IconComponent: Material,
      route: "Business Edit",
      mainBusiness: mainBusiness,
    },
    {
      title: "Change Business",
      subtitle: "Create",
      icon: "briefcase",
      IconComponent: FontAwesome,
      route: "My Business",
    },
    {
      title: "Tax Settings",
      subtitle: "Create",
      icon: "percent",
      IconComponent: FontAwesome,
      route: "Tax Creation",
    },
    {
      title: "Payment Methods",
      subtitle: "Create",
      icon: "credit-card",
      IconComponent: FontAwesome,
      route: "Payment Creation",
    },
    {
      title: "Terms & Conditions",
      subtitle: "Create",
      icon: "file-document-outline",
      IconComponent: Material,
      route: "Terms&Condition Creation",
    },
    {
      title: "Signatures",
      subtitle: "Create",
      icon: "draw",
      IconComponent: Material,
      route: "Signature Creation",
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <FlatList
        data={settingsData}
        renderItem={({ item }) => (
          <SettingsCard {...item} navigation={navigation} />
        )}
        keyExtractor={(_, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
    paddingTop: 50,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    color: "#2D3748",
    fontFamily: "Poppins-Bold",
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    width: cardWidth,
    height: 200,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardSubtitleContainer: {
    width: "100%",
    backgroundColor: "#EDF2F7",
    height: 40,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 20,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: "#A1B4E7",
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontFamily: "Poppins-Medium",
    fontSize: 18,
    color: "#4A5568",
    textAlign: "left",
    marginBottom: 8,
    width: "100%",
  },
});

export default Settings;
