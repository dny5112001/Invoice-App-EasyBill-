import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { insertItem } from "../../SqlSetup/db"; // Import the database functions

const ItemsCreationPage = () => {
  // Define state variables to hold input values
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [unitsOfMeasure, setUnitsOfMeasure] = useState("");
  const [itemDescription, setItemDescription] = useState("");

  // Function to handle the "Save" button press
  const handleSave = async () => {
    if (!itemName || !itemPrice || !unitsOfMeasure || !itemDescription) {
      // Show an alert if any field is empty
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      // Insert the new item into the database
      await insertItem(
        itemName,
        parseFloat(itemPrice),
        unitsOfMeasure,
        itemDescription
      );
      // Show success message
      Alert.alert("Success", "Item added successfully!");
      // Clear the form
      setItemName("");
      setItemPrice("");
      setUnitsOfMeasure("");
      setItemDescription("");
    } catch (error) {
      // Handle any errors
      console.error("Error adding item:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Items</Text>
      <View style={styles.formContainer}>
        <TextInput
          placeholder="Item Name"
          style={styles.input}
          placeholderTextColor="#999"
          value={itemName}
          onChangeText={setItemName}
        />
        <TextInput
          placeholder="Item Price"
          style={styles.input}
          placeholderTextColor="#999"
          value={itemPrice}
          onChangeText={setItemPrice}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Units of Measure"
          style={styles.input}
          placeholderTextColor="#999"
          value={unitsOfMeasure}
          onChangeText={setUnitsOfMeasure}
        />
        <TextInput
          placeholder="Item Description"
          style={[styles.input, styles.textArea]}
          placeholderTextColor="#999"
          multiline={true}
          numberOfLines={4}
          value={itemDescription}
          onChangeText={setItemDescription}
        />
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ItemsCreationPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  formContainer: {
    marginTop: 40,
    gap: 20,
  },
  input: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    height: 50,
    borderRadius: 10,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    height: 120, // Increase height for textarea
    textAlignVertical: "top", // Ensures text starts at the top-left
  },
  button: {
    backgroundColor: "#3567E4",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
