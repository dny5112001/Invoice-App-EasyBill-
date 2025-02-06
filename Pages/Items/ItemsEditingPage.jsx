import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState, useEffect } from "react";
import { TextInput } from "react-native-gesture-handler";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getIndividualItem, updateItem } from "../../SqlSetup/db";

const ItemsEditingPage = () => {
  // Accessing the item from the navigation route parameters
  const route = useRoute();
  const navigation = useNavigation();
  const { item } = route.params;

  // State to hold the values of the input fields
  const [itemName, setItemName] = useState(item.itemName);
  const [itemPrice, setItemPrice] = useState(item.itemPrice.toString()); // Convert to string for TextInput
  const [unitsOfMeasure, setUnitsOfMeasure] = useState(item.unitsOfMeasure);
  const [itemDescription, setItemDescription] = useState(item.itemDescription);

  // Optionally, you can handle saving the updated item
  const handleSave = async () => {
    try {
      if (
        itemName !== "" ||
        itemPrice !== "" ||
        unitsOfMeasure !== "" ||
        itemDescription !== ""
      ) {
        const check = await getIndividualItem(itemName);
        if (check.length > 0) {
          alert("Item with this name already exists");
          return;
        }
      }

      // You can handle the save functionality, like sending the updated data to the database
      const result = await updateItem(
        itemName,
        itemPrice,
        unitsOfMeasure,
        itemDescription
      );
      if (result) {
        alert("Item updated successfully");
      } else {
        alert("Failed to update item");
      }
      navigation.goBack();
    } catch (error) {
      console.error("Error updating item:", error);
      alert("An error occurred while updating the item. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Item</Text>
      <View style={styles.formContainer}>
        <TextInput
          placeholder="Item Name"
          style={styles.input}
          placeholderTextColor="#999"
          value={itemName}
          readOnly
        />
        <TextInput
          placeholder="Item Price"
          style={styles.input}
          placeholderTextColor="#999"
          value={itemPrice}
          onChangeText={(text) => setItemPrice(text)} // Update state when input changes
          keyboardType="numeric" // Ensure numeric input for price
        />
        <TextInput
          placeholder="Units of Measure"
          style={styles.input}
          placeholderTextColor="#999"
          value={unitsOfMeasure}
          onChangeText={setUnitsOfMeasure} // Update state when input changes
        />
        <TextInput
          placeholder="Item Description"
          style={[styles.input, styles.textArea]}
          placeholderTextColor="#999"
          value={itemDescription}
          onChangeText={setItemDescription} // Update state when input changes
          multiline={true}
          numberOfLines={4}
        />
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ItemsEditingPage;

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
