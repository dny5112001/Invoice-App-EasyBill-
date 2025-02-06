import { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  updateInvoiceStatus,
  deleteInvoice,
  getIndividualClient,
} from "../SqlSetup/db"; // Ensure these are correctly imported

const InvoiceCard = ({
  clientEmail,
  amount,
  invoiceNumber,
  creationDate,
  duedate,
  initialStatus,
  partiallyPaid,
  refreshData, // ✅ Receive refresh function to refresh the list after updates
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [status, setStatus] = useState(initialStatus || "Unpaid");
  const [partialAmount, setPartialAmount] = useState(
    status === "Partially Paid" ? partiallyPaid : 0
  );
  const [clientName, setClientName] = useState(null); // Store client's name
  const navigation = useNavigation();

  // Get the status color based on the status value
  const getStatusColor = () => {
    switch (status) {
      case "Paid":
        return "#16A34A"; // Green for Paid
      case "Partially Paid":
        return "#CA8A04"; // Yellow for Partially Paid
      case "Unpaid":
        return "#DC2626"; // Red for Unpaid
      case "Overdue":
        return "#9E2A2B"; // Dark Red for Overdue
      default:
        return "#6B7280"; // Default gray
    }
  };

  // Fetch Client data based on the email
  const fetchClient = useCallback(async () => {
    if (clientEmail) {
      const clientDetails = await getIndividualClient(clientEmail);
      setClientName(clientDetails[0]?.clientName || "Unknown Client");
    }
  }, [clientEmail]);

  useFocusEffect(
    useCallback(() => {
      fetchClient(); // Fetch client data whenever screen is focused
    }, [fetchClient])
  );

  // Function to update invoice status
  const handleSave = async (newStatus) => {
    setStatus(newStatus);
    setIsModalVisible(false);
    if (newStatus === "Partially Paid") {
      await updateInvoiceStatus(invoiceNumber, newStatus, partialAmount);
    } else {
      await updateInvoiceStatus(invoiceNumber, newStatus);
    }
    refreshData(); // Refresh the data after updating
  };

  // Format the creation date of the invoice
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to check overdue status
  const checkOverdueStatus = () => {
    const currentDate = new Date();
    const dueDate = new Date(duedate);
    if (currentDate > dueDate && status === "Unpaid") {
      setStatus("Overdue");
      updateInvoiceStatus(invoiceNumber, "Overdue");
    }
  };

  useEffect(() => {
    checkOverdueStatus();
  }, [duedate, status, invoiceNumber]); // Trigger check on changes to due date or status

  // Function to handle invoice deletion
  const deleteInvoiceHandler = async () => {
    Alert.alert(
      "Delete Invoice",
      "Are you sure you want to delete this invoice?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteInvoice(invoiceNumber); // Ensure the deleteInvoice function is implemented
              refreshData();
            } catch (error) {
              console.error("Error deleting invoice:", error);
              alert("Error deleting invoice:", error);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onLongPress={deleteInvoiceHandler}
      onPress={() => navigation.navigate("Invoice Editing", { invoiceNumber })}
    >
      <View style={styles.content}>
        <Text style={styles.clientName}>{clientName}</Text>
        <Text style={styles.amount}>
          ₹ {amount ? amount.toLocaleString() : "0"}
        </Text>
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {status === "Paid"
            ? "Fully Paid"
            : status === "Partially Paid"
            ? `₹ ${partialAmount.toLocaleString()} Paid`
            : status === "Unpaid"
            ? "Unpaid"
            : status === "Overdue"
            ? "Overdue"
            : ""}
        </Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.invoiceNumber}>
          Invoice No: {invoiceNumber || "N/A"}
        </Text>
        <Text style={styles.date}>{formatDate(creationDate)}</Text>
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
            {status}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal for updating invoice status */}
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
            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}
            >
              {["Paid", "Partially Paid", "Unpaid"].map((statusOption) => (
                <TouchableOpacity
                  key={statusOption}
                  style={[
                    styles.statusButton,
                    status === statusOption && styles.selectedStatus,
                  ]}
                  onPress={() => handleSave(statusOption)}
                >
                  <Text
                    style={[
                      styles.statusButtonText,
                      status === statusOption && styles.selectedStatusText,
                    ]}
                  >
                    {statusOption}
                  </Text>
                  {status === statusOption && (
                    <Ionicons name="checkmark-circle" size={24} color="white" />
                  )}
                </TouchableOpacity>
              ))}
              {status === "Partially Paid" && (
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
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => handleSave(status)}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </TouchableOpacity>
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
  content: {
    justifyContent: "space-between",
    gap: 10,
  },
  clientName: {
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
  invoiceNumber: {
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
    borderWidth: 1,
    alignItems: "center",
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
    height: "50%",
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
