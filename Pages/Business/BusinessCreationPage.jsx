import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import {
  insertBusiness,
  getBusinesses,
  getBusinessByName,
} from "../../SqlSetup/db";

const BusinessCreationPage = () => {
  const [businessPhoto, setBusinessPhoto] = useState(null);
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [billingAddress1, setBillingAddress1] = useState("");
  const [billingAddress2, setBillingAddress2] = useState("");
  const [website, setWebsite] = useState("");
  const [taxName, setTaxName] = useState("");
  const [taxId, setTaxId] = useState("");

  const selectBusinessPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission Denied");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setBusinessPhoto(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (
      businessName === "" ||
      email === "" ||
      phone === "" ||
      billingAddress1 === "" ||
      billingAddress2 === "" ||
      website === "" ||
      taxName === "" ||
      taxId === "" ||
      businessPhoto === null
    ) {
      Alert.alert("Please fill out all fields");
      return;
    }

    const check = await getBusinessByName(businessName);
    if (check.length > 0) {
      alert("Business name already exists");
      return;
    }

    const businesses = await getBusinesses();
    const businessLength = businesses.length;

    // Prepare the business data object
    const businessData = {
      businessName,
      businessEmail: email,
      businessPhone: phone,
      businessAddressLine1: billingAddress1,
      businessAddressLine2: billingAddress2,
      businessWebsiteLink: website,
      taxName,
      taxId,
      businessPhoto,
      businessMain: businessLength > 0 ? 0 : 1, // You can set this according to your logic if needed
    };

    // Call insertBusiness to add the data into the database
    await insertBusiness(businessData);
    // Show success alert
    Alert.alert("Success", "Business details saved successfully!");

    setBusinessName(""),
      setEmail(""),
      setPhone(""),
      setBillingAddress1(""),
      setBillingAddress2(""),
      setWebsite(""),
      setTaxName(""),
      setTaxId(""),
      setBusinessPhoto(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.title}>Business Info</Text>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.photoContainer}
          onPress={selectBusinessPhoto}
        >
          {businessPhoto ? (
            <Image source={{ uri: businessPhoto }} style={styles.photo} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <MaterialIcons name="add-a-photo" size={40} color="#999" />
              <Text style={styles.photoPlaceholderText}>Add Logo</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Business Name"
            value={businessName}
            onChangeText={setBusinessName}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Billing Address Line 1"
            value={billingAddress1}
            onChangeText={setBillingAddress1}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Billing Address Line 2"
            value={billingAddress2}
            onChangeText={setBillingAddress2}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Business Website"
            value={website}
            onChangeText={setWebsite}
            keyboardType="url"
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Tax Name"
            value={taxName}
            onChangeText={setTaxName}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Tax ID"
            value={taxId}
            onChangeText={setTaxId}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Business</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  photoContainer: {
    alignSelf: "center",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#3567E4",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  photoPlaceholder: {
    alignItems: "center",
  },
  photoPlaceholderText: {
    marginTop: 8,
    fontSize: 14,
    color: "#999",
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  saveButton: {
    backgroundColor: "#3567E4",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default BusinessCreationPage;
