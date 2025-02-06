import { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getIndividualClient,
  updateEstimateStatus,
  deleteEstimate,
} from "../SqlSetup/db";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const EstimateCard = ({
  clientEmail,
  amount,
  estimateNumber,
  creationDate,
  duedate,
  initialStatus,
  refreshData, // ✅ Receive refresh function
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [status, setStatus] = useState(initialStatus || "Pending");
  const [client, setClient] = useState(null);
  const navigation = useNavigation();

  const getStatusColor = () => {
    switch (status) {
      case "Approved":
        return "#16A34A";
      case "Pending":
        return "#CA8A04";
      case "Cancel":
        return "#DC2626";
      case "Overdue":
        return "#DC2626";
      default:
        return "#6B7280";
    }
  };

  const handleSave = (newStatus) => {
    setStatus(newStatus);
    setIsModalVisible(false);
    updateStatus(newStatus);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Fetch Client Data
  const fetchClient = useCallback(async () => {
    if (!clientEmail) return;
    const clientdetails = await getIndividualClient(clientEmail);
    setClient(clientdetails[0].clientName);
  }, [clientEmail]);

  // Fetch client data when the screen gains focus
  useFocusEffect(
    useCallback(() => {
      fetchClient();
    }, [fetchClient])
  );

  useEffect(() => {
    checkOverdueStatus();
  }, []);

  const checkOverdueStatus = () => {
    const currentDate = new Date();
    const dueDate = new Date(duedate);
    if (
      currentDate > dueDate &&
      status === "Pending" &&
      initialStatus !== "Overdue"
    ) {
      setStatus("Overdue");
      updateStatus("Overdue");
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      await updateEstimateStatus(estimateNumber, newStatus);
      setStatus(newStatus);

      // ✅ Check if the status should be set to "Overdue"
      const currentDate = new Date();
      const dueDate = new Date(duedate);
      console.log(currentDate);
      console.log(dueDate);

      if (newStatus === "Pending" && currentDate > dueDate) {
        console.log("Due date passed, changing status to Overdue...");
        setStatus("Overdue");
        await updateEstimateStatus(estimateNumber, "Overdue"); // ✅ Update DB again
      }

      refreshData(); // ✅ Refresh screen after saving status
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating status:", error);
    }
  };

  const deleteEstimateHandler = async () => {
    Alert.alert(
      "Delete Estimate",
      "Are you sure you want to delete this estimate?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteEstimate(estimateNumber);
              refreshData();
            } catch (error) {
              console.error("Error deleting estimate:", error);
              alert("Error deleting estimate:", error);
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
      onLongPress={deleteEstimateHandler}
      onPress={() => {
        navigation.navigate("Estimate Editing", { estimateNumber });
      }}
    >
      <View style={styles.content}>
        <Text style={styles.clientName}>
          {client ? client : "Unknown Client"}
        </Text>
        <Text style={styles.amount}>
          ₹ {amount ? amount.toLocaleString() : "0"}
        </Text>
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {status}
        </Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.estimateNumber}>{estimateNumber || "N/A"}</Text>
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Estimate Status</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {["Approved", "Pending", "Cancel"].map((statusOption) => (
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
            </ScrollView>
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
  estimateNumber: {
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
    height: "40%",
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
});

export default EstimateCard;
