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
  insertTerms,
  getTerms,
  updateTerms,
  deleteTerms,
} from "../../SqlSetup/db.jsx";
import useEstimateStore from "../../zustandStore/ZustandStore";
import useInvoiceStore from "../../zustandStore/InvoiceStore";
import { useNavigation, useRoute } from "@react-navigation/native";

const { height } = Dimensions.get("window");

const TermsModal = ({ visible, onClose, onSave, initialData }) => {
  const [description, setDescription] = useState(
    initialData?.description || ""
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
      await updateTerms(description, initialData.termsAndConditions);
    } else {
      await insertTerms(description);
    }
    onSave();
    setDescription("");
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
                    ? "Edit Terms & Conditions"
                    : "Create Terms & Conditions"}
                </Text>
                <TouchableOpacity onPress={onClose}>
                  <Icon name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.textArea}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={5}
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

const TermsSelectionPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { source } = route.params || {}; // Get 'source' safely
  console.log("Source:", source); // Debugging: Check what value 'source' has

  const { setTerms: setEstimateTerms } = useEstimateStore();
  const { setTerms: setInvoiceTerms } = useInvoiceStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [terms_condi, setTerms_condi] = useState([]);
  const [editingTerm, setEditingTerm] = useState(null);

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    const data = await getTerms();
    setTerms_condi(data);
  };

  const openModal = (term = null) => {
    setEditingTerm(term);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingTerm(null);
    fetchTerms();
  };

  const deleteTerm = async (term) => {
    await deleteTerms(term.termsAndConditions);
    fetchTerms();
  };

  const handleTermsSelect = (term) => {
    if (source === "invoice") {
      setInvoiceTerms(term.termsAndConditions);
    } else {
      setEstimateTerms(term.termsAndConditions);
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Terms & Conditions</Text>
      <View style={styles.card}>
        <Text style={styles.text}>New Terms & Conditions</Text>
        <TouchableOpacity style={styles.createBtn} onPress={() => openModal()}>
          <Text style={styles.btntxt}>Create</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>Terms & Conditions List</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {terms_condi.map((term, Index) => (
          <TouchableOpacity
            key={Index}
            style={styles.card}
            onPress={() => handleTermsSelect(term)}
          >
            <View style={styles.termsContainer}>
              <Text style={styles.text}>{term.termsAndConditions}</Text>
            </View>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => openModal(term)}>
                <Icon name="edit" size={24} color="#3567E4" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTerm(term)}>
                <Icon name="delete" size={24} color="#F87171" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TermsModal
        visible={modalVisible}
        onClose={closeModal}
        onSave={fetchTerms}
        initialData={editingTerm}
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
  title: { fontSize: 24, fontWeight: "bold", color: "#333", marginBottom: 10 },
  subtitle: { fontSize: 20, fontWeight: "600", color: "#555", marginTop: 20 },
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
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },
  textArea: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    textAlignVertical: "top",
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

export default TermsSelectionPage;
