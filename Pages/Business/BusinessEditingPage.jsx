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
import { updateBusiness } from "../../SqlSetup/db";
import { useNavigation, useRoute } from "@react-navigation/native";

const BusinessEditingPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params;

  const [businessPhoto, setBusinessPhoto] = useState(item.businessPhoto);
  const [businessName, setBusinessName] = useState(item.businessName);
  const [email, setEmail] = useState(item.businessEmail);
  const [phone, setPhone] = useState(item.businessPhone);
  const [billingAddress1, setBillingAddress1] = useState(
    item.businessAddressLine1
  );
  const [billingAddress2, setBillingAddress2] = useState(
    item.businessAddressLine2
  );
  const [website, setWebsite] = useState(item.businessWebsiteLink);
  const [taxName, setTaxName] = useState(item.taxName);
  const [taxId, setTaxId] = useState(item.taxId);

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

  const handleUpdate = async () => {
    if (
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
    // Prepare the business data object
    const updatedFields = {
      businessEmail: email,
      businessPhone: phone,
      businessAddressLine1: billingAddress1,
      businessAddressLine2: billingAddress2,
      businessWebsiteLink: website,
      taxName,
      taxId,
      businessPhoto,
    };

    // Call insertBusiness to add the data into the database
    await updateBusiness(businessName, updatedFields);
    // Show success alert
    Alert.alert("Success", "Business details updated successfully!");
    navigation.goBack();
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
            editable={false}
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

        <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
          <Text style={styles.saveButtonText}>Update Business</Text>
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

export default BusinessEditingPage;
