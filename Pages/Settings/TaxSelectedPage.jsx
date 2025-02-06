import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  TextInput,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  insertTax,
  getTaxes,
  updateTax,
  deleteTax,
} from "../../SqlSetup/db.jsx";
import useEstimateStore from "../../zustandStore/ZustandStore";
import useInvoiceStore from "../../zustandStore/InvoiceStore";
import { useNavigation, useRoute } from "@react-navigation/native";

const { height } = Dimensions.get("window");

const TaxModal = ({ visible, onClose, onSave, initialData }) => {
  const [taxName, setTaxName] = useState(initialData?.taxName || "");
  const [taxRate, setTaxRate] = useState(
    initialData?.taxRate?.toString() || ""
  );
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleSave = async () => {
    if (initialData) {
      await updateTax(initialData.taxName, taxRate);
    } else {
      await insertTax(taxName, taxRate);
    }
    onSave();
    setTaxName("");
    setTaxRate("");
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContent,
                { transform: [{ translateY: slideAnim }] },
              ]}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {initialData ? "Edit Tax" : "Create New Tax"}
                </Text>
                <TouchableOpacity onPress={onClose}>
                  <Icon name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Tax Name"
                value={taxName}
                onChangeText={setTaxName}
              />
              <TextInput
                style={styles.input}
                placeholder="Tax Rate (%)"
                value={taxRate}
                onChangeText={setTaxRate}
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const TaxSelectedPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { source } = route.params || {}; // Get 'source' param safely
  console.log("Source:", source); // Debugging: Check what value 'source' has

  const { setTaxName: setEstimateTaxName, setTaxRate: setEstimateTaxRate } =
    useEstimateStore();
  const { setTaxName: setInvoiceTaxName, setTaxRate: setInvoiceTaxRate } =
    useInvoiceStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [taxes, setTaxes] = useState([]);
  const [editingTax, setEditingTax] = useState(null);

  useEffect(() => {
    fetchTaxes();
  }, []);

  const fetchTaxes = async () => {
    const data = await getTaxes();
    setTaxes(data);
  };

  const openModal = (tax = null) => {
    setEditingTax(tax);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingTax(null);
    fetchTaxes();
  };

  const deleteTaxItem = async (tax) => {
    await deleteTax(tax.taxName);
    fetchTaxes();
  };

  const handleTaxSelect = (tax) => {
    if (source === "invoice") {
      setInvoiceTaxName(tax.taxName);
      setInvoiceTaxRate(tax.taxRate);
    } else {
      setEstimateTaxName(tax.taxName);
      setEstimateTaxRate(tax.taxRate);
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create Tax</Text>
      <View style={styles.card}>
        <Text style={styles.text}>Create New Tax</Text>
        <TouchableOpacity style={styles.createBtn} onPress={() => openModal()}>
          <Text style={styles.btntxt}>Create</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>Tax List</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {taxes.map((tax, Index) => (
          <TouchableOpacity
            style={styles.card}
            key={Index}
            onPress={() => handleTaxSelect(tax)}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <Text style={styles.text}>{tax.taxName}</Text>
              <Text style={styles.rateText}>({tax.taxRate}%)</Text>
            </View>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => openModal(tax)}>
                <Icon name="edit" size={24} color="#3567E4" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTaxItem(tax)}>
                <Icon name="delete" size={24} color="#F87171" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TaxModal
        visible={modalVisible}
        onClose={closeModal}
        onSave={fetchTaxes}
        initialData={editingTax}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#555",
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  createBtn: {
    backgroundColor: "#3567E4",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
  },
  rateText: {
    fontSize: 16,
  },
  btntxt: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  iconContainer: {
    flexDirection: "row",
    gap: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: "#3567E4",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default TaxSelectedPage;
