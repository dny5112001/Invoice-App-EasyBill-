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
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch clients from the database
  const fetchData = useCallback(async () => {
    const fetchedClients = await getClients();
    setClients(fetchedClients);
    setFilteredClients(fetchedClients); // Initially, show all clients
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchClients = async () => {
        await fetchData();
      };
      fetchClients();
    }, [fetchData])
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(
        (client) =>
          client.clientName.toLowerCase().includes(query.toLowerCase()) ||
          client.clientEmail.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredClients(filtered);
    }
  };

  const handleDelete = async (client) => {
    Alert.alert(
      "Delete Client",
      `Are you sure you want to delete the client named \n${client.clientName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            await deleteClient(client.clientEmail);
            fetchData();
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
          onPress={() => navigation.navigate("More")}
        />
      </View>

      <TextInput
        placeholder="Search clients"
        style={styles.searchBox}
        value={searchQuery}
        onChangeText={handleSearch}
      />

      <TouchableOpacity
        style={styles.addNew}
        onPress={() => navigation.navigate("ClientsCreation")}
      >
        <Icon name="plus" size={40} color={"white"} />
      </TouchableOpacity>

      <View style={styles.itemsContainer}>
        <ScrollView
          contentContainerStyle={{ gap: 20, paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          {filteredClients.length > 0 ? (
            filteredClients.map((client, index) => (
              <ClientCard
                key={index}
                client={client}
                onDelete={() => handleDelete(client)}
              />
            ))
          ) : (
            <Text style={styles.noResults}>No clients found.</Text>
          )}
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
    elevation: 5,
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
  noResults: {
    textAlign: "center",
    fontSize: 16,
    color: "#777",
    marginTop: 20,
  },
});
