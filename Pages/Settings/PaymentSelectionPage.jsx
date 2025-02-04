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
  insertPaymentMethod,
  getPaymentMethods,
  updatePaymentMethod,
  deletePaymentMethod,
} from "../../SqlSetup/db.jsx";
import useEstimateStore from "../../zustandStore/ZustandStore";
import { useNavigation } from "@react-navigation/native";

const { height } = Dimensions.get("window");

const PaymentModal = ({ visible, onClose, onSave, initialData }) => {
  const [methodName, setMethodName] = useState(initialData?.name || "");
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
      await updatePaymentMethod(initialData.paymentMethod, methodName);
    } else {
      await insertPaymentMethod(methodName);
    }
    onSave();
    setMethodName("");
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
                  {initialData
                    ? "Edit Payment Method"
                    : "Create New Payment Method"}
                </Text>
                <TouchableOpacity onPress={onClose}>
                  <Icon name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Payment Method Name"
                value={methodName}
                onChangeText={setMethodName}
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

const PaymentSelectionPage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [methods, setMethods] = useState([]);
  const [editingMethod, setEditingMethod] = useState(null);
  const { setPaymentMethod } = useEstimateStore();
  const navigation = useNavigation();

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    const data = await getPaymentMethods();
    setMethods(data);
  };

  const openModal = (method = null) => {
    setEditingMethod(method);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingMethod(null);
    fetchMethods();
  };

  const deleteMethod = async (method) => {
    await deletePaymentMethod(method.paymentMethod);
    fetchMethods();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Payment Method</Text>
      <View style={styles.card}>
        <Text style={styles.text}>New Payment Method</Text>
        <TouchableOpacity style={styles.createBtn} onPress={() => openModal()}>
          <Text style={styles.btntxt}>Create</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>Payment Method List</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {methods.map((method, Index) => (
          <TouchableOpacity
            key={method.name}
            style={styles.card}
            key={Index}
            onPress={() => {
              setPaymentMethod(method.paymentMethod);
              navigation.goBack();
            }}
          >
            <Text style={styles.text}>{method.paymentMethod}</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => openModal(method)}>
                <Icon name="edit" size={24} color="#3567E4" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteMethod(method)}>
                <Icon name="delete" size={24} color="#F87171" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <PaymentModal
        visible={modalVisible}
        onClose={closeModal}
        onSave={fetchMethods}
        initialData={editingMethod}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "#F5F5F5",
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#333", marginBottom: 10 },
  subtitle: { fontSize: 20, fontWeight: "600", color: "#555", marginTop: 20 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#fff",
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  createBtn: { backgroundColor: "#3567E4", padding: 10, borderRadius: 10 },
  text: { fontSize: 16, fontWeight: "500" },
  btntxt: { color: "#fff", fontSize: 16, fontWeight: "600" },
  iconContainer: { flexDirection: "row", gap: 10 },
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
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: "#3567E4",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

export default PaymentSelectionPage;
