import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/Entypo";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
  getMainBusiness,
  getIndividualEstimate,
  saveEstimateToDb,
} from "../../SqlSetup/db";
import useEstimateStore from "../../zustandStore/ZustandStore";

const EstimateCreationPage = () => {
  const navigation = useNavigation();
  // const [creationDate, setCreationDate] = useState(new Date());

  const [showCreationPicker, setShowCreationPicker] = useState(false);
  const [showDuePicker, setShowDuePicker] = useState(false);
  const [discountModal, setDiscountModal] = useState(false);
  const [shippingModal, setShippingModal] = useState(false);

  // Zustand Store

  const {
    estimateNumber,
    setEstimateNumber,
    creationDate,
    setCreationDate,
    dueDate,
    setDueDate,
    businessName,
    setBusinessName,
    clientEmail,
    discountType,
    setDiscountType,
    discount,
    setDiscount,
    taxName,
    setTaxName,
    taxRate,
    setTaxRate,
    shippingAmount,
    setShippingAmount,
    items,
    setItems,
    subTotal,
    totalAmount,
    saveEstimate,
    terms,
    signatureName,
    signatureImage,
    status,
    paymentMethod,
  } = useEstimateStore();

  const formatDate = (date) => {
    return date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  };

  const handleSave = async () => {
    if (estimateNumber === "") {
      alert("Please enter an estimate number");
      return;
    }
    const checkEstimate = await getIndividualEstimate(estimateNumber);
    if (checkEstimate.length > 0) {
      alert("Estimate already exists");
      return;
    }
    const estimateData = {
      estimateNumber,
      creationDate,
      dueDate,
      businessName,
      clientEmail,
      items,
      subTotal,
      discountType,
      discount,
      taxName,
      taxRate,
      shippingAmount,
      totalAmount,
      signatureName,
      signatureImage,
      terms,
      paymentMethod,
      status,
    };

    console.log(estimateData);

    const saveData = await saveEstimateToDb(estimateData);
    if (saveData) {
      alert("Estimate saved successfully");
    } else {
      alert("Failed to save estimate");
    }
  };

  const { width } = Dimensions.get("window");

  const [mainBusiness, setMainBusiness] = useState(null);

  const fetchMainBusiness = useCallback(async () => {
    try {
      const result = await getMainBusiness();
      if (result.length > 0) {
        setMainBusiness(result[0]);
        setBusinessName(result[0].businessName);
      }
    } catch (error) {
      console.error("Error fetching main business:", error);
    }
  }, []);

  // Run the fetch function when the component is mounted and when the screen is focused
  useEffect(() => {
    fetchMainBusiness(); // Run once when the component mounts
  }, [fetchMainBusiness]);

  // Fetch data when the screen is focused (on every revisit)
  useFocusEffect(
    useCallback(() => {
      fetchMainBusiness(); // Triggered when the screen is focused
    }, [fetchMainBusiness])
  );

  const confirmDeleteItem = (itemName, itemIndex) => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => deleteItem(itemName, itemIndex),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const deleteItem = (itemName, itemIndex) => {
    console.log(itemIndex);
    const updatedItems = items.filter((item, index) => index !== itemIndex);
    setItems(updatedItems);
    alert(`Item with name ${itemName} deleted`);
  };

  const RenderItems = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: "#e2e8f0",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginVertical: 10,
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 10,
        }}
        onLongPress={() => {
          confirmDeleteItem(item.itemName, items.indexOf(item));
        }}
      >
        <Text>{item.itemName}</Text>
        <View>
          <Text style={{ textAlign: "right" }}>
            {item.itemQuantity} {item.unitsOfMeasure} x ₹{item.itemPrice}
          </Text>
          <Text style={{ textAlign: "right" }}>
            ₹{Number(item.finalAmount).toFixed(2)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  useFocusEffect(
    useCallback(() => {
      const handleBackPress = (e) => {
        if (estimateNumber || clientEmail || items.length > 0) {
          e.preventDefault();
          Alert.alert(
            "Unsaved Changes",
            "You have unsaved changes. Are you sure you want to leave without saving?",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Leave",
                style: "destructive",
                onPress: () => {
                  useEstimateStore.setState(useEstimateStore.getInitialState()); // Reset to initial state
                  navigation.dispatch(e.data.action);
                },
              },
            ],
            { cancelable: true }
          );
        }
      };

      const unsubscribe = navigation.addListener(
        "beforeRemove",
        handleBackPress
      );
      return unsubscribe;
    }, [estimateNumber, clientEmail, items, navigation])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>New Estimate</Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <View style={{ gap: 10, marginVertical: 20 }}>
          <TextInput
            placeholder="Estimate Number"
            value={estimateNumber}
            onChangeText={(text) => setEstimateNumber(text)}
            style={{
              backgroundColor: "#fff",
              paddingVertical: 15,
              paddingHorizontal: 20,
              borderRadius: 10,
              elevation: 1,
            }}
          />
          {/* Creation Date */}
          <TouchableOpacity
            onPress={() => setShowCreationPicker(true)}
            style={{
              backgroundColor: "#fff",
              paddingVertical: 15,
              paddingHorizontal: 20,
              borderRadius: 10,
              elevation: 1,
            }}
          >
            <Text style={{ color: creationDate ? "#000" : "#aaa" }}>
              Creation Date : {formatDate(creationDate)}
            </Text>
          </TouchableOpacity>
          {showCreationPicker && (
            <DateTimePicker
              value={creationDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowCreationPicker(false);
                if (selectedDate) setCreationDate(selectedDate);
              }}
            />
          )}

          {/* Due Date */}
          <TouchableOpacity
            onPress={() => setShowDuePicker(true)}
            style={{
              backgroundColor: "#fff",
              paddingVertical: 15,
              paddingHorizontal: 20,
              borderRadius: 10,
              elevation: 1,
            }}
          >
            <Text style={{ color: dueDate ? "#000" : "#aaa" }}>
              Due Date : {dueDate ? formatDate(dueDate) : "Due Date"}
            </Text>
          </TouchableOpacity>
          {showDuePicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDuePicker(false);
                if (selectedDate) setDueDate(selectedDate);
              }}
            />
          )}
        </View>
        {/* Business info */}
        <View>
          <TouchableOpacity
            style={{
              backgroundColor: "#fff",
              paddingVertical: 15,
              paddingHorizontal: 20,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: 10,
              borderWidth: 1,
            }}
            onPress={() => {
              !mainBusiness
                ? navigation.navigate("Business Creation")
                : navigation.navigate("Business Edit", { item: mainBusiness });
            }}
          >
            <View>
              <Text style={{ color: "#000" }}>Business Info</Text>
              <Text style={{ color: "#000" }}>
                {mainBusiness ? mainBusiness.businessName : "No Business"}
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        {/* Client info */}
        <View style={{ marginTop: 10 }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#fff",
              paddingVertical: 15,
              paddingHorizontal: 20,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: 10,
              borderWidth: 1,
            }}
            onPress={() => {
              navigation.navigate("ClientsSelection");
            }}
          >
            <View>
              <Text style={{ color: "#000" }}>Bill to</Text>
              <Text style={{ color: "#000" }}>{clientEmail}</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* items Addition */}
        <View
          style={{
            backgroundColor: "#fff",
            paddingVertical: 15,
            paddingHorizontal: 20,
            borderWidth: 1,
            marginTop: 10,
            borderRadius: 10,
          }}
        >
          <View
            style={{ justifyContent: "space-between", flexDirection: "row" }}
          >
            <Text>Items ({items.length})</Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#bfdbfe",
                paddingVertical: 5,
                paddingHorizontal: 15,
                borderRadius: 10,
                borderWidth: 1.2,
                borderColor: "#3567E4",
              }}
              onPress={() => {
                navigation.navigate("ItemsSelection");
              }}
            >
              <Text style={{ color: "#3567E4" }}>Add</Text>
            </TouchableOpacity>
          </View>

          {/* render the selected items */}
          {items.map((item, index) => (
            <RenderItems key={index} item={item} />
          ))}

          <View style={{ marginTop: 20, gap: 10 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text>Subtotal</Text>
              <Text>₹{(parseFloat(subTotal) || 0).toFixed(2)}</Text>
            </View>
            <Pressable
              style={{ flexDirection: "row", justifyContent: "space-between" }}
              onPress={() => setDiscountModal(true)}
            >
              <Text>Discount</Text>
              {discount > 0 ? (
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <Text>
                    {discount}
                    {discountType == "Percentage" ? "%" : "₹"}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setDiscount(0);
                    }}
                  >
                    <Icon
                      name="minus"
                      size={15}
                      color={"#fff"}
                      style={{
                        padding: 5,
                        borderRadius: 20,
                        backgroundColor: "#000",
                      }}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <Icon
                  name="plus"
                  size={15}
                  color={"#fff"}
                  style={{
                    padding: 5,
                    borderRadius: 20,
                    backgroundColor: "#000",
                  }}
                />
              )}
            </Pressable>
            <Pressable
              style={{ flexDirection: "row", justifyContent: "space-between" }}
              onPress={() => {
                navigation.navigate("TaxSelection");
              }}
            >
              <Text>Tax</Text>
              {taxName && taxRate > 0 ? (
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <Text>
                    {taxName} ({taxRate}%)
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setTaxName("");
                      setTaxRate(0);
                    }}
                  >
                    <Icon
                      name="minus"
                      size={15}
                      color={"#fff"}
                      style={{
                        padding: 5,
                        borderRadius: 20,
                        backgroundColor: "#000",
                      }}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <Icon
                  name="plus"
                  size={15}
                  color={"#fff"}
                  style={{
                    padding: 5,
                    borderRadius: 20,
                    backgroundColor: "#000",
                  }}
                />
              )}
            </Pressable>
            <Pressable
              style={{ flexDirection: "row", justifyContent: "space-between" }}
              onPress={() => setShippingModal(true)}
            >
              <Text>Shipping</Text>
              {shippingAmount > 0 ? (
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <Text>{shippingAmount} ₹</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setShippingAmount(0);
                    }}
                  >
                    <Icon
                      name="minus"
                      size={15}
                      color={"#fff"}
                      style={{
                        padding: 5,
                        borderRadius: 20,
                        backgroundColor: "#000",
                      }}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <Icon
                  name="plus"
                  size={15}
                  color={"#fff"}
                  style={{
                    padding: 5,
                    borderRadius: 20,
                    backgroundColor: "#000",
                  }}
                />
              )}
            </Pressable>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20,
              borderTopWidth: 1,
              paddingTop: 10,
            }}
          >
            <Text>Total</Text>
            <Text>₹{(parseFloat(totalAmount) || 0).toFixed(2)}</Text>
          </View>
        </View>
        {/* Signature */}
        <View style={{ marginTop: 10 }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#fff",
              paddingVertical: 15,
              paddingHorizontal: 20,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: 10,
              borderWidth: 1,
            }}
            onPress={() => {
              navigation.navigate("SignatureSelection");
            }}
          >
            <View>
              <Text style={{ color: "#000" }}>Signature</Text>
              <Text style={{ color: "#000" }}>
                {signatureName ? signatureName : "Add Signature"}
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        {/* Terms & Condition */}
        <View style={{ marginTop: 10 }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#fff",
              paddingVertical: 15,
              paddingHorizontal: 20,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: 10,
              borderWidth: 1,
            }}
            onPress={() => {
              navigation.navigate("TermsSelection");
            }}
          >
            <View>
              <Text style={{ color: "#000" }}>Terms & Condition</Text>
              <Text style={{ color: "#000" }}>
                {terms ? terms : "Add Terms & Conditions"}
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        {/* Payment Method */}
        <View style={{ marginTop: 10 }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#fff",
              paddingVertical: 15,
              paddingHorizontal: 20,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: 10,
              borderWidth: 1,
            }}
            onPress={() => {
              navigation.navigate("PaymentSelection");
            }}
          >
            <View>
              <Text style={{ color: "#000" }}>Payment Method</Text>
              <Text style={{ color: "#000" }}>
                {paymentMethod ? paymentMethod : "Add Payment Method"}
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        {/* Mark as */}

        <Modal
          transparent={true}
          visible={discountModal}
          onRequestClose={() => setDiscountModal(false)}
          animationType="slide"
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.modalOverlay}
            >
              <SafeAreaView style={styles.safeArea}>
                <View style={styles.modalContent}>
                  <View style={styles.header}>
                    <Text style={styles.title}>Apply Discount</Text>
                    <TouchableOpacity
                      onPress={() => setDiscountModal(false)}
                      style={styles.closeButton}
                    >
                      <Ionicons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.discountTypeContainer}>
                    {["Percentage", "Fixed"].map((type) => (
                      <TouchableOpacity
                        key={type}
                        onPress={() => setDiscountType(type)}
                        style={[
                          styles.discountTypeButton,
                          discountType === type && styles.activeDiscountType,
                        ]}
                      >
                        <Text
                          style={[
                            styles.discountTypeText,
                            discountType === type &&
                              styles.activeDiscountTypeText,
                          ]}
                        >
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder={`Enter ${discountType.toLowerCase()} discount`}
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                      value={discount}
                      onChangeText={setDiscount}
                    />
                    <Text style={styles.inputSuffix}>
                      {discountType === "Percentage" ? "%" : "$"}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.applyButton}
                    onPress={() => {
                      setDiscountModal(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.applyButtonText}>Apply Discount</Text>
                  </TouchableOpacity>
                </View>
              </SafeAreaView>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </Modal>
        <Modal
          transparent={true}
          visible={shippingModal}
          onRequestClose={() => setShippingModal(false)}
          animationType="slide"
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.modalOverlay2}
            >
              <SafeAreaView style={styles.safeArea2}>
                <View style={styles.modalContent2}>
                  <View style={styles.header2}>
                    <Text style={styles.title2}>Add Shipping</Text>
                    <TouchableOpacity
                      onPress={() => setShippingModal(false)}
                      style={styles.closeButton2}
                    >
                      <Ionicons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.inputContainer2}>
                    <TextInput
                      style={styles.input2}
                      placeholder="Enter shipping amount"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                      value={shippingAmount}
                      onChangeText={(value) => {
                        setShippingAmount(value);
                      }}
                    />
                    <Text style={styles.inputSuffix2}>₹</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.applyButton2}
                    onPress={() => {
                      setShippingModal(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.applyButtonText2}>Apply Shipping</Text>
                  </TouchableOpacity>
                </View>
              </SafeAreaView>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </Modal>
        <View
          style={{
            marginTop: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#bfdbfe",
              borderColor: "#3567E4",
              borderWidth: 1,
              paddingVertical: 10,
              paddingHorizontal: 50,
              borderRadius: 10,
            }}
            onPress={() => {
              navigation.navigate("Estimate Preview");
            }}
          >
            <Text style={{ color: "#3567E4", fontSize: 18 }}>Preview</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "#dcfce7",
              borderColor: "#34d399",
              borderWidth: 1,
              paddingVertical: 10,
              paddingHorizontal: 50,
              borderRadius: 10,
            }}
            onPress={() => {
              handleSave();
            }}
          >
            <Text style={{ color: "#10b981", fontSize: 18 }}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EstimateCreationPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  modalContent1: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    height: "60%",
  },
  modalHeader1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle1: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalBody1: {
    marginBottom: 20,
  },
  statusButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
  },
  selectedStatus: {
    backgroundColor: "#3567E4",
  },
  statusButtonText: {
    fontSize: 16,
    color: "#1F2937",
  },
  selectedStatusText: {
    color: "white",
    fontWeight: "bold",
  },
  inputContainer1: {
    marginTop: 15,
  },
  inputLabel1: {
    fontSize: 16,
    color: "#4B5563",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#4B5563",
    fontWeight: "bold",
    fontSize: 16,
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#3567E4",
    padding: 15,
    borderRadius: 10,
    marginLeft: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  safeArea: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  modalContent: {
    padding: 20,
    position: "relative",
  },
  backgroundNumber: {
    position: "absolute",
    top: -20,
    right: -20,
    zIndex: 0,
  },
  backgroundNumberText: {
    fontSize: 200,
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 0.05)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 5,
  },
  discountTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    zIndex: 1,
  },
  discountTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  activeDiscountType: {
    backgroundColor: "#3567E4",
  },
  discountTypeText: {
    color: "#333",
    fontWeight: "600",
  },
  activeDiscountTypeText: {
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    zIndex: 1,
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    fontSize: 16,
    color: "#333",
  },
  inputSuffix: {
    position: "absolute",
    right: 20,
    fontSize: 16,
    color: "#333",
  },
  applyButton: {
    backgroundColor: "#3567E4",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    zIndex: 1,
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  modalOverlay2: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  safeArea2: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  modalContent2: {
    padding: 20,
    position: "relative",
  },
  backgroundNumber2: {
    position: "absolute",
    top: -20,
    right: -20,
    zIndex: 0,
  },

  header2: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    // zIndex: 1,
  },
  title2: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton2: {
    padding: 5,
  },
  inputContainer2: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    zIndex: 1,
  },
  input2: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    fontSize: 16,
    color: "#333",
  },
  inputSuffix2: {
    position: "absolute",
    right: 20,
    fontSize: 16,
    color: "#333",
  },
  applyButton2: {
    backgroundColor: "#3567E4",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    zIndex: 1,
  },
  applyButtonText2: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
