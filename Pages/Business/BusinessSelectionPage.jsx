import React, { useCallback, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  SafeAreaView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  getBusinesses,
  updateMainBusiness,
  getMainBusiness,
  deleteBusiness,
} from "../../SqlSetup/db"; // Make sure updateBusinessMain is implemented

const BusinessSelectionPage = () => {
  const navigation = useNavigation();
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [businesses, setBusinesses] = useState([]);

  // Fetch and initialize the items when the component mounts or screen gains focus
  const fetchData = useCallback(async () => {
    const fetchedBusinesses = await getBusinesses(); // Get items from the database
    setBusinesses(fetchedBusinesses); // Update the state with the fetched items
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchBusinesses = async () => {
        await fetchData(); // Fetch data when the screen gains focus
      };

      fetchBusinesses(); // Call the async function immediately
    }, [fetchData]) // Re-run when fetchData changes
  );

  // Handle selecting a business
  const handleBusinessSelect = async (item) => {
    if (item.businessMain === 1) {
      alert("This is already the primary business");
      return;
    }

    const PreviousMainBusinessArray = await getMainBusiness();
    const previousMainBusiness = PreviousMainBusinessArray[0].businessName;
    const result = await updateMainBusiness(
      previousMainBusiness,
      item.businessName
    );
    if (result) {
      Alert.alert(
        `${item.businessName} is being selected as the primary business`
      );
      fetchData();
    }
  };

  const handleDelete = async (businessName, businessMain) => {
    const result = await deleteBusiness(businessName, businessMain);
    if (result) {
      Alert.alert("Business deleted successfully");
      fetchData();
    }
  };

  const renderBusinessCard = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.businessCard,
        item.businessMain === 1 && styles.mainBusinessCard, // Apply blue color if businessMain is 1
      ]}
      onPress={() => handleBusinessSelect(item)} // Select the business when pressed
    >
      <View style={styles.businessInfo}>
        <Image
          style={styles.businessImage}
          source={{ uri: item.businessPhoto }}
        />
        <Text style={styles.businessName}>{item.businessName}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.editButton}>
          <Icon
            name="edit"
            size={24}
            color="#757575"
            onPress={() => {
              navigation.navigate("Business Edit", { item });
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.editButton}>
          <MaterialIcons
            name="delete"
            size={24}
            color="#E53935"
            onPress={() => {
              handleDelete(item.businessName, item.businessMain);
            }}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Businesses</Text>
      <FlatList
        data={businesses}
        renderItem={renderBusinessCard}
        keyExtractor={(item) => item.businessName}
        contentContainerStyle={styles.businessList}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity style={styles.addButton}>
        <Icon
          name="plus"
          size={30}
          color="#fff"
          onPress={() => {
            navigation.navigate("Business Creation");
          }}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
  },
  businessList: {
    paddingBottom: 100,
  },
  businessCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  mainBusinessCard: {
    backgroundColor: "#E3F2FD", // Blue color for selected business
    borderWidth: 2,
    borderColor: "#2196F3", // Blue border
  },
  businessInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  businessImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  businessName: {
    fontSize: 18,
    color: "#333",
    fontWeight: "600",
    width: "80%",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    padding: 5,
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#3567E4",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
});

export default BusinessSelectionPage;
