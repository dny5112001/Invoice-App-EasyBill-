import { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  Image,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import {
  insertSignature,
  getSignatures,
  deleteSignature,
} from "../../SqlSetup/db.jsx";

const { height } = Dimensions.get("window");

const SignatureModal = ({ visible, onClose, onSave }) => {
  const [signatureImage, setSignatureImage] = useState(null);
  const [signatureName, setSignatureName] = useState("");
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

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSignatureImage(result.assets[0].uri);
    }
  };

  const captureImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSignatureImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (signatureImage && signatureName) {
      await insertSignature(signatureName, signatureImage);
      onSave();
      setSignatureImage(null);
      setSignatureName("");
    }
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
                <Text style={styles.modalTitle}>Upload Signature</Text>
                <TouchableOpacity onPress={onClose}>
                  <Icon name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter signature name"
                value={signatureName}
                onChangeText={setSignatureName}
              />
              <View style={styles.imageContainer}>
                {signatureImage ? (
                  <Image
                    source={{ uri: signatureImage }}
                    style={styles.previewImage}
                  />
                ) : (
                  <Text style={styles.placeholderText}>
                    No Signature Selected
                  </Text>
                )}
              </View>
              <TouchableOpacity style={styles.actionBtn} onPress={pickImage}>
                <Text style={styles.actionBtnText}>Choose from Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={captureImage}>
                <Text style={styles.actionBtnText}>Capture Using Camera</Text>
              </TouchableOpacity>
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

const SignaturesCreation = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [signatures, setSignatures] = useState([]);

  useEffect(() => {
    fetchSignatures();
  }, []);

  const fetchSignatures = async () => {
    const data = await getSignatures();
    setSignatures(data);
  };

  const openModal = () => setModalVisible(true);
  const closeModal = () => {
    setModalVisible(false);
    fetchSignatures();
  };

  const deleteSignatureItem = async (signature) => {
    await deleteSignature(signature.signatureName);
    fetchSignatures();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Signatures</Text>
      <View style={styles.card}>
        <Text style={styles.text}>Add New Signature</Text>
        <TouchableOpacity style={styles.createBtn} onPress={openModal}>
          <Text style={styles.btntxt}>Add</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>Signature List</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {signatures.map((signature, Index) => (
          <View key={Index} style={styles.card}>
            <View style={styles.signatureInfo}>
              <Image
                source={{ uri: signature.signatureImage }}
                style={styles.listImage}
              />
              <Text style={styles.signatureName}>
                {signature.signatureName}
              </Text>
            </View>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => deleteSignatureItem(signature)}>
                <Icon name="delete" size={24} color="#F87171" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <SignatureModal
        visible={modalVisible}
        onClose={closeModal}
        onSave={fetchSignatures}
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
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 150,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  placeholderText: {
    color: "#888",
    fontSize: 16,
  },
  actionBtn: {
    backgroundColor: "#3567E4",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  actionBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
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
  listImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  signatureInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  signatureName: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "500",
  },
});

export default SignaturesCreation;
