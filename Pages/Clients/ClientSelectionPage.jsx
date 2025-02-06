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
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import useEstimateStore from "../../zustandStore/ZustandStore";
import useInvoiceStore from "../../zustandStore/InvoiceStore.js";

const ClientSelectionPage = () => {
  const { setClientEmail: setEstimateClientEmail } = useEstimateStore();
  const { setClientEmail: setInvoiceClientEmail } = useInvoiceStore();
  const [clients, setClients] = useState([]);
  const navigation = useNavigation();

  const route = useRoute();
  console.log("Route Params:", route.params); // Debugging
  const { source } = route.params || {}; // Safe fallback for undefined values
  console.log("Source:", source); // Debugging

  // Fetch and initialize the clients when the screen gains focus
  const fetchData = useCallback(async () => {
    const fetchedClients = await getClients();
    setClients(fetchedClients);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const handleClientSelect = (clientEmail) => {
    if (source === "invoice") {
      console.log("Updating Invoice Store with:", clientEmail);
      setInvoiceClientEmail(clientEmail);
    } else {
      console.log("Updating Estimate Store with:", clientEmail);
      setEstimateClientEmail(clientEmail);
    }

    console.log(
      "Current Estimate Client:",
      useEstimateStore.getState().clientEmail
    );
    console.log(
      "Current Invoice Client:",
      useInvoiceStore.getState().clientEmail
    );

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Client</Text>
      </View>

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

      <Text style={styles.listTitle}>Client List</Text>
      <ScrollView style={styles.scrollContainer}>
        {clients.map((client) => (
          <TouchableOpacity
            key={client.clientEmail}
            style={styles.clientCard}
            onPress={() => handleClientSelect(client.clientEmail)}
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
  container: { flex: 1, paddingTop: 30 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  headerTitle: { fontSize: 24, fontWeight: "bold" },
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
  createText: { fontSize: 20, fontWeight: "bold" },
  createButton: {
    backgroundColor: "#1E1E1E",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
  listTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 30,
  },
  scrollContainer: { marginBottom: 100 },
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
  clientInfo: { flexDirection: "row", alignItems: "center" },
  textContainer: { marginLeft: 12 },
  clientName: { fontSize: 18, fontWeight: "500" },
  clientPhone: { fontSize: 14, color: "#666", marginTop: 2 },
});

export default ClientSelectionPage;
