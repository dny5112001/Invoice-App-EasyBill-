import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const InvoiceCard = ({ name, amount, date, status, invoiceNo, paidAmount }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(status);
  const [partialAmount, setPartialAmount] = useState(
    status === "Partially Paid" ? paidAmount : 0
  );

  const getStatusColor = () => {
    switch (selectedStatus) {
      case "Paid":
        return "#16A34A";
      case "Partially Paid":
        return "#CA8A04";
      case "Unpaid":
        return "#DC2626";
      default:
        return "#6B7280";
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSave = () => {
    // Handle saving the updated status and partial amount here
    console.log("Updated Status:", selectedStatus);
    if (selectedStatus === "Partially Paid") {
      console.log("Partial Amount:", partialAmount);
    }
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content1}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.amount}>₹ {amount.toLocaleString()}</Text>
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {selectedStatus === "Paid"
            ? "Fully Paid"
            : selectedStatus === "Partially Paid"
            ? `₹ ${partialAmount.toLocaleString()} Paid`
            : "Unpaid"}
        </Text>
      </View>
      <View style={styles.content2}>
        <Text style={styles.invoiceNo}>{invoiceNo}</Text>
        <Text style={styles.date}>{formatDate(date)}</Text>
        <TouchableOpacity
          style={[
            styles.btn,
            {
              backgroundColor: `${getStatusColor()}20`,
              borderColor: getStatusColor(),
            },
          ]}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={[styles.btntxt, { color: getStatusColor() }]}>
            {selectedStatus}
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Invoice Status</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {["Paid", "Partially Paid", "Unpaid"].map((statusOption) => (
                <TouchableOpacity
                  key={statusOption}
                  style={[
                    styles.statusButton,
                    selectedStatus === statusOption && styles.selectedStatus,
                  ]}
                  onPress={() => setSelectedStatus(statusOption)}
                >
                  <Text
                    style={[
                      styles.statusButtonText,
                      selectedStatus === statusOption &&
                        styles.selectedStatusText,
                    ]}
                  >
                    {statusOption}
                  </Text>
                  {selectedStatus === statusOption && (
                    <Ionicons name="checkmark-circle" size={24} color="white" />
                  )}
                </TouchableOpacity>
              ))}
              {selectedStatus === "Partially Paid" && (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Paid Amount:</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={partialAmount.toString()}
                    onChangeText={(value) => setPartialAmount(Number(value))}
                    placeholder="Enter paid amount"
                  />
                </View>
              )}
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 10,
  },
  content1: {
    justifyContent: "space-between",
    gap: 10,
    alignItems: "flex-start",
  },
  content2: {
    justifyContent: "space-between",
    gap: 10,
    alignItems: "flex-end",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  amount: {
    fontSize: 14,
    color: "#4B5563",
  },
  statusText: {
    fontSize: 12,
  },
  invoiceNo: {
    fontSize: 12,
    color: "#6B7280",
  },
  date: {
    fontSize: 12,
    color: "#6B7280",
  },
  btn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignItems: "center",
    borderWidth: 1,
  },
  btntxt: {
    fontSize: 12,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    height: "60%",
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
  },
  modalBody: {
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
  inputContainer: {
    marginTop: 15,
  },
  inputLabel: {
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
});

export default InvoiceCard;
