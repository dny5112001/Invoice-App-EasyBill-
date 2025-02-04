import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getItems } from "../../SqlSetup/db";
import useEstimateStore from "../../zustandStore/ZustandStore";
const ItemsSelectionPage = () => {
  const { items, setItems } = useEstimateStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [itemList, setItemList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const clearInputs = () => {
    setItemName("");
    setItemPrice("");
    setItemQuantity("");
    setDiscount("");
    setTaxPercentage("");
    setItemDescription("");
    setModalVisible(false);
  };

  const fetchData = useCallback(async () => {
    const fetchItems = await getItems(); // Get items from the database
    setItemList(fetchItems); // Update the state with the fetched items
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

  const [itemName, setItemName] = useState("");
  const [itemPrice, setitemPrice] = useState(0);
  const [unitsOfMeasure, setUnitsOfMeasure] = useState("");
  const [itemQuantity, setItemQuantity] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [taxPercentage, setTaxPercentage] = useState(0);
  const [itemDescription, setItemDescription] = useState("");

  const load_OpenModal = (item) => {
    setItemName(item.itemName || "");
    setitemPrice(item.itemPrice.toString() || 0);
    setUnitsOfMeasure(item.unitsOfMeasure || "");
    setItemQuantity(item.itemQuantity || "");
    setDiscount(item.discount || "");
    setTaxPercentage(item.taxPercentage || "");
    setItemDescription(item.itemDescription || "");
    setModalVisible(true);
  };

  const saveItem = () => {
    const Amount = itemQuantity * itemPrice; // Initial total
    const discountedAmount = Amount * (1 - 0.01 * discount); // Applying discount
    const finalAmount = discountedAmount * (1 + 0.01 * taxPercentage); // Applying tax

    console.log(
      itemName,
      itemPrice,
      itemQuantity,
      unitsOfMeasure,
      discount,
      taxPercentage,
      itemDescription,
      finalAmount
    );

    const newData = {
      itemName,
      itemPrice,
      itemQuantity,
      unitsOfMeasure,
      discount,
      taxPercentage,
      itemDescription,
      finalAmount,
    };
    setItems([...items, newData]);
    setModalVisible(false);
  };

  // console.log(items);
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Items Selection</Text>
      </View>

      {/* Create New Item Section */}
      <View style={styles.createSection}>
        <Text style={styles.createText}>Add a new item</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => {
            clearInputs();
            setModalVisible(true);
          }}
        >
          <Text style={styles.createButtonText}>Add Item</Text>
        </TouchableOpacity>
      </View>

      {/* Item List Section */}
      <View style={styles.listSection}>
        <Text style={styles.listTitle}>Item List</Text>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {itemList.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.item}
              onPress={() => {
                load_OpenModal(item);
              }}
            >
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.itemName}</Text>
                <Text style={styles.itemPrice}>₹{item.itemPrice}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Modal for adding/editing item */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Item</Text>

            <TextInput
              placeholder="Item Name"
              value={itemName}
              onChangeText={setItemName}
              style={styles.input}
            />
            <TextInput
              placeholder="Item Price"
              value={itemPrice}
              onChangeText={setitemPrice}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              placeholder="Item Quantity"
              value={itemQuantity}
              onChangeText={setItemQuantity}
              keyboardType="numeric"
              style={styles.input}
            />

            <TextInput
              placeholder="Units of Measure"
              value={unitsOfMeasure}
              onChangeText={setUnitsOfMeasure}
              style={styles.input}
            />
            <TextInput
              placeholder="Discount in percent"
              value={discount}
              onChangeText={setDiscount}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              placeholder="Tax Percentage"
              value={taxPercentage}
              onChangeText={setTaxPercentage}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              placeholder="Item Description"
              value={itemDescription}
              onChangeText={setItemDescription}
              style={styles.input}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={() => {
                  saveItem();
                }}
              >
                <Text style={styles.buttonText}>
                  {editIndex !== null ? "Update" : "Save"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.buttonText, styles.cancelButtonText]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
  createSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    margin: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  createText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  createButton: {
    backgroundColor: "#3567E4",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  listSection: {
    flex: 1,
    marginTop: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 16,
    marginBottom: 8,
    color: "gray",
  },
  scrollViewContent: {
    paddingHorizontal: 16,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemInfo: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    fontSize: 18,
    fontWeight: "500",
  },
  itemPrice: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Subtle overlay for focus
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16, // Rounded corners for a modern look
    width: "85%", // Adjust width for better proportions
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Add some depth with shadow
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333", // Dark text for better readability
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#f9f9f9", // Light background for input fields
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    width: "48%",
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: "#3567E4", // Green color for save action
  },
  cancelButton: {
    borderColor: "#3567E4",
    borderWidth: 1,
  },
  buttonText: {
    fontWeight: "600",
    color: "#fff",
  },
  cancelButtonText: {
    color: "#3567E4", // Green text for cancel action
  },
});

export default ItemsSelectionPage;
