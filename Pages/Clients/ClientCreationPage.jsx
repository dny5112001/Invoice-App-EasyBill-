import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { getClientByEmail, insertClient } from "../../SqlSetup/db";

const ClientCreationPage = () => {
  const [clientName, setClientName] = React.useState("");
  const [clientEmail, setClientEmail] = React.useState("");
  const [clientPhone, setClientPhone] = React.useState("");
  const [billingAddressLine1, setBillingAddressLine1] = useState("");
  const [billingAddressLine2, setBillingAddressLine2] = useState("");
  const [shippingAddressLine1, setShippingAddressLine1] = useState("");
  const [shippingAddressLine2, setShippingAddressLine2] = useState("");
  const [taxName, setTaxName] = useState("");
  const [taxId, setTaxId] = useState("");
  const [clientDetail, setClientDetail] = useState("");

  const saveData = async () => {
    if (
      !clientName ||
      !clientEmail ||
      !clientPhone ||
      !billingAddressLine1 ||
      !billingAddressLine2 ||
      !shippingAddressLine1 ||
      !shippingAddressLine2 ||
      !taxName ||
      !taxId ||
      !clientDetail
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const check = await getClientByEmail(clientEmail);
      if (check.length > 0) {
        Alert.alert("Error", "Client with this email already exists");
        return;
      }
      await insertClient({
        clientName,
        clientEmail,
        clientPhone,
        billingAddressLine1,
        billingAddressLine2,
        shippingAddressLine1,
        shippingAddressLine2,
        taxName,
        taxId,
        clientDetail,
      });

      Alert.alert("Success", "Client added successfully!");
      setClientName("");
      setClientEmail("");
      setClientPhone("");
      setBillingAddressLine1("");
      setBillingAddressLine2("");
      setShippingAddressLine1("");
      setShippingAddressLine2("");
      setTaxName("");
      setTaxId("");
      setClientDetail("");
    } catch (error) {
      console.error("Error adding Client:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Client</Text>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <TextInput
            placeholder="Client Name"
            style={styles.input}
            placeholderTextColor="#999"
            value={clientName}
            onChangeText={(text) => setClientName(text)}
          />
          <TextInput
            placeholder="Email Address"
            style={styles.input}
            placeholderTextColor="#999"
            keyboardType="email-address"
            value={clientEmail}
            onChangeText={(text) => setClientEmail(text)}
          />
          <TextInput
            placeholder="Phone Number"
            style={styles.input}
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={clientPhone}
            onChangeText={(text) => setClientPhone(text)}
          />
          <TextInput
            placeholder="Billing Address Line 1"
            style={styles.input}
            placeholderTextColor="#999"
            value={billingAddressLine1}
            onChangeText={(text) => setBillingAddressLine1(text)}
          />
          <TextInput
            placeholder="Billing Address Line 2"
            style={styles.input}
            placeholderTextColor="#999"
            value={billingAddressLine2}
            onChangeText={(text) => setBillingAddressLine2(text)}
          />
          <TextInput
            placeholder="Shipping Address Line 1"
            style={styles.input}
            placeholderTextColor="#999"
            value={shippingAddressLine1}
            onChangeText={(text) => setShippingAddressLine1(text)}
          />
          <TextInput
            placeholder="Shipping Address Line 2"
            style={styles.input}
            placeholderTextColor="#999"
            value={shippingAddressLine2}
            onChangeText={(text) => setShippingAddressLine2(text)}
          />
          <TextInput
            placeholder="Tax Name"
            style={styles.input}
            placeholderTextColor="#999"
            value={taxName}
            onChangeText={(text) => setTaxName(text)}
          />
          <TextInput
            placeholder="Tax ID"
            style={styles.input}
            placeholderTextColor="#999"
            value={taxId}
            onChangeText={(text) => setTaxId(text)}
          />
          <TextInput
            placeholder="Client Detail (Won't show in Invoice)"
            style={[styles.input, styles.textArea]}
            placeholderTextColor="#999"
            multiline={true}
            numberOfLines={4}
            value={clientDetail}
            onChangeText={(text) => setClientDetail(text)}
          />
          <TouchableOpacity style={styles.button} onPress={saveData}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ClientCreationPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
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
    height: 120, // Adjust height for textarea
    textAlignVertical: "top", // Start text at the top of the textarea
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
