import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import Icon from "react-native-vector-icons/Entypo";
import ClientCard from "../Components/ClientCard";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getClients, deleteClient } from "../SqlSetup/db";

const Clients = () => {
  const navigation = useNavigation();
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch and initialize the items when the component mounts or screen gains focus
  const fetchData = useCallback(async () => {
    const fetchedClients = await getClients(); // Get items from the database
    setClients(fetchedClients); // Update the state with the fetched items
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Async function inside the effect
      const fetchClients = async () => {
        await fetchData(); // Fetch data when the screen gains focus
      };

      fetchClients(); // Call the async function immediately
    }, [fetchData]) // Re-run when fetchData changes
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleDelete = async (client) => {
    // Ask for confirmation before deleting
    Alert.alert(
      "Delete Client",
      `Are you sure you want to delete the client named \n${client.clientName}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            await deleteClient(client.clientEmail); // Delete the item from the database
            fetchData(); // Re-fetch the items after deletion to update the list
            Alert.alert("Success", `${client.clientName} has been deleted.`);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.container1}>
        <Text style={styles.header}>Clients</Text>
        <Icon
          name="dots-three-vertical"
          size={24}
          color={"#000"}
          onPress={() => {
            navigation.navigate("More");
          }}
        />
      </View>
      <TextInput placeholder="Search clients" style={styles.searchBox} />
      <View></View>
      <TouchableOpacity
        style={styles.addNew}
        onPress={() => {
          navigation.navigate("ClientsCreation");
        }}
      >
        <Icon name="plus" size={40} color={"white"} />
      </TouchableOpacity>
      <View style={styles.itemsContainer}>
        <ScrollView
          contentContainerStyle={{ gap: 20, paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          {clients.map((client, Index) => (
            <ClientCard
              key={Index}
              client={client}
              onDelete={() => {
                handleDelete(client);
              }}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default Clients;

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
  categories: {
    marginTop: 30,
    display: "flex",
    flexDirection: "row",
    gap: 20,
    overflow: "visible", // Ensures categories are not cut off in small screens
    // paddingHorizontal: 20,
  },
  category: {
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  categoryText: {
    fontSize: 16,
    color: "#000",
  },
  selectedCategory: {
    backgroundColor: "#ABC4FD", // Blue background for selected category
    borderColor: "#9CB7FB",
    borderWidth: 1,
    // elevation: 10,
  },
  selectedCategoryText: {
    color: "#fff", // White text for selected category
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
