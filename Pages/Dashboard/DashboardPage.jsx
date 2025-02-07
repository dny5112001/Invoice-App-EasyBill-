"use client";

import { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";
import { getDashboardMetrics } from "../../SqlSetup/db"; // Import function

const { width } = Dimensions.get("window");

const MetricCard = ({ metric }) => (
  <View style={styles.card}>
    <View style={styles.topSection}>
      <View style={styles.iconWrapper}>
        <Icon name={metric.icon} size={16} color="#2DC198" />
      </View>
    </View>

    <View style={styles.valueSection}>
      <Text style={styles.value}>{metric.value}</Text>
      <Text style={styles.title}>{metric.title}</Text>
    </View>
  </View>
);

const DashboardPage = () => {
  const [metrics, setMetrics] = useState([
    { title: "Total Invoices", value: "0", icon: "file-text" },
    { title: "Total Sales", value: "₹0", icon: "dollar" },
    { title: "Total Earned", value: "₹0", icon: "money" },
    { title: "Total Pending", value: "₹0", icon: "clock-o" },
    { title: "Total Unpaid", value: "₹0", icon: "exclamation-circle" },
    { title: "Total Overdue", value: "₹0", icon: "calendar-times-o" },
    { title: "Invoice Clients", value: "0", icon: "users" },
    { title: "Invoice Items", value: "0", icon: "list" },
  ]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const data = await getDashboardMetrics();
        console.log(data);
        if (data) {
          setMetrics([
            {
              title: "Total Invoices",
              value: data.totalInvoices,
              icon: "file-text",
            },
            {
              title: "Total Sales",
              value: `₹${data.totalSales}`,
              icon: "dollar",
            },
            {
              title: "Total Earned",
              value: `₹${data.totalEarned}`,
              icon: "money",
            },
            {
              title: "Total Pending",
              value: `₹${data.totalPending}`,
              icon: "clock-o",
            },
            {
              title: "Total Unpaid",
              value: `₹${data.totalUnpaid}`,
              icon: "exclamation-circle",
            },
            {
              title: "Total Overdue",
              value: `₹${data.totalOverdue}`,
              icon: "calendar-times-o",
            },
            {
              title: "Invoice Clients",
              value: data.totalClients,
              icon: "users",
            },
            { title: "Invoice Items", value: data.totalItems, icon: "list" },
          ]);
        }
      };

      fetchData();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headertitle}>Dashboard</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {metrics.map((metric, index) => (
            <MetricCard key={index} metric={metric} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingTop: 30,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headertitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: width * 0.43,
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    backgroundColor: "#fff",
    minHeight: 180,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  valueSection: {
    gap: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
  },
  title: {
    fontSize: 13,
    color: "#808080",
    fontWeight: "500",
  },
});

export default DashboardPage;
