import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getClients } from "../../SqlSetup/db.jsx";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import useEstimateStore from "../../zustandStore/ZustandStore";

// Sample data for clients

const ClientSelectionPage = () => {
  const { setClientEmail } = useEstimateStore();
  const [clients, setClients] = useState([]);
  const navigation = useNavigation();
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Client</Text>
      </View>

      {/* Create New Client Section */}
      <View style={styles.createSection}>
        <Text style={styles.createText}>Create New Client</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => {
            navigation.navigate("ClientsCreation");
          }}
        >
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
      </View>

      {/* Client List Section */}
      <Text style={styles.listTitle}>Client List</Text>
      <ScrollView style={styles.scrollContainer}>
        {clients.map((client) => (
          <TouchableOpacity
            key={client.clientEmail}
            style={styles.clientCard}
            onPress={() => {
              setClientEmail(client.clientEmail);
              navigation.goBack();
            }}
          >
            <View style={styles.clientInfo}>
              <View style={styles.textContainer}>
                <Text style={styles.clientName}>{client.clientName}</Text>
                <Text style={styles.clientPhone}>{client.clientPhone}</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Icon
                name="edit"
                size={20}
                color="black"
                onPress={() => {
                  navigation.navigate("ClientsEditing", { client });
                }}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  iconButton: {
    padding: 8,
  },
  createSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  createText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  createButton: {
    backgroundColor: "#1E1E1E", // Use a consistent color
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  listTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 30,
  },
  scrollContainer: {
    marginBottom: 100, // Adding bottom space to avoid content overlap
  },
  clientCard: {
    backgroundColor: "white",
    margin: 16,
    marginTop: 2,
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clientInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    marginLeft: 12,
  },
  clientName: {
    fontSize: 18,
    fontWeight: "500",
  },
  clientPhone: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
});

export default ClientSelectionPage;
