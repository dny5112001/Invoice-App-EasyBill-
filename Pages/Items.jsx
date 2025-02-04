import React, { useState, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import ItemsCard from "../Components/ItemsCard"; // Ensure your ItemsCard component is ready to display each item
import { getItems, deleteItem } from "../SqlSetup/db"; // Import the database functions

const Items = () => {
  const navigation = useNavigation();
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch and initialize the items when the component mounts or screen gains focus
  const fetchData = useCallback(async () => {
    const fetchedItems = await getItems(); // Get items from the database
    setItems(fetchedItems); // Update the state with the fetched items
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Async function inside the effect
      const fetchItems = async () => {
        await fetchData(); // Fetch data when the screen gains focus
      };

      fetchItems(); // Call the async function immediately
    }, [fetchData]) // Re-run when fetchData changes
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleDelete = async (itemName) => {
    // Ask for confirmation before deleting
    Alert.alert("Delete Item", `Are you sure you want to delete ${itemName}?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          await deleteItem(itemName); // Delete the item from the database
          fetchData(); // Re-fetch the items after deletion to update the list
          Alert.alert("Success", `${itemName} has been deleted.`);
        },
      },
    ]);
  };

  // Filter items based on search query
  const filteredItems = items.filter((item) =>
    item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.container1}>
        <Text style={styles.header}>Items</Text>
        <Icon
          name="dots-three-vertical"
          size={24}
          color={"#000"}
          onPress={() => {
            navigation.navigate("More");
          }}
        />
      </View>
      <TextInput
        placeholder="Search Items"
        style={styles.searchBox}
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <TouchableOpacity
        style={styles.addNew}
        onPress={() => {
          navigation.navigate("ItemsCreation");
        }}
      >
        <Icon name="plus" size={40} color={"white"} />
      </TouchableOpacity>
      <View style={styles.itemsContainer}>
        <ScrollView
          contentContainerStyle={{ gap: 20, paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          {filteredItems.map((item, index) => (
            <ItemsCard
              key={index}
              item={item}
              onDelete={() => handleDelete(item.itemName)} // Pass the delete function to ItemsCard
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default Items;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  container1: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
  searchBox: {
    height: 50,
    marginTop: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    color: "#000",
    elevation: 5, // Adds subtle shadow to the search box
  },
  addNew: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#3567E4",
    padding: 5,
    borderRadius: 10,
    elevation: 100,
    zIndex: 100,
  },
  itemsContainer: {
    flex: 1,
    marginTop: 30,
  },
});
