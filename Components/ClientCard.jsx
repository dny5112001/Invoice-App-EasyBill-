import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const ClientCard = ({ client, onDelete }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.cardWrapper}>
      <Pressable style={styles.container}>
        <View>
          <Text style={styles.name}>{client.clientName}</Text>
          <Text style={styles.phone}>{client.clientPhone}</Text>
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              navigation.navigate("ClientsEditing", { client });
            }}
          >
            <MaterialIcons name="edit" size={18} color="#4A90E2" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={onDelete}>
            <MaterialIcons name="delete" size={18} color="#E53935" />
          </TouchableOpacity>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 3,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  phone: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 5,
    marginLeft: 10,
  },
});

export default ClientCard;
