import React, { useState, useCallback } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import InvoiceCard from "../Components/InvoiceCard";
import { useNavigation } from "@react-navigation/native";

const Invoice = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Unpaid", "Partially Paid", "Overdue", "Paid"];
  const data = [
    {
      id: "1",
      name: "Deepak Yadav",
      amount: 1000,
      date: "2023-05-15",
      status: "Paid",
      invoiceNo: "INV001",
      paidAmount: 1000,
    },
    {
      id: "2",
      name: "Priya Sharma",
      amount: 1500,
      date: "2023-05-16",
      status: "Partially Paid",
      invoiceNo: "INV002",
      paidAmount: 750,
    },
    {
      id: "3",
      name: "Rahul Gupta",
      amount: 2000,
      date: "2023-05-17",
      status: "Unpaid",
      invoiceNo: "INV003",
      paidAmount: 0,
    },
    {
      id: "4",
      name: "Anita Patel",
      amount: 1200,
      date: "2023-05-18",
      status: "Paid",
      invoiceNo: "INV004",
      paidAmount: 1200,
    },
    {
      id: "5",
      name: "Vikram Singh",
      amount: 1800,
      date: "2023-05-19",
      status: "Partially Paid",
      invoiceNo: "INV005",
      paidAmount: 900,
    },
  ];

  const filteredData = data.filter((item) => {
    const categoryMatch =
      selectedCategory === "All" || item.status === selectedCategory;
    const searchMatch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const renderItem = useCallback(
    ({ item }) => (
      <InvoiceCard
        name={item.name}
        amount={item.amount}
        date={item.date}
        status={item.status}
        invoiceNo={item.invoiceNo}
        paidAmount={item.paidAmount}
      />
    ),
    []
  );

  return (
    <View style={styles.container}>
      <View style={styles.container1}>
        <Text style={styles.header}>Invoices</Text>
        <Icon
          name="dots-three-vertical"
          size={24}
          color={"#000"}
          onPress={() => {
            navigation.navigate("More");
          }}
        />
      </View>
      <TextInput
        placeholder="Search Invoices"
        style={styles.searchBox}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View>
        <ScrollView
          contentContainerStyle={styles.categories}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.category,
                selectedCategory === category && styles.selectedCategory,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.selectedCategoryText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <FlatList
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        initialNumToRender={5}
        windowSize={10}
        maxToRenderPerBatch={5}
        ListEmptyComponent={<Text>No Invoices Available</Text>}
      />
      <TouchableOpacity
        style={styles.addNew}
        onPress={() => {
          navigation.navigate("Invoice Creation");
        }}
      >
        <Icon name="plus" size={40} color={"white"} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    marginBottom: 20,
    // backgroundColor: "#fff",
  },
  container1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
  searchBox: {
    height: 50,
    marginTop: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    color: "#000",
    elevation: 5,
  },
  categories: {
    marginVertical: 30,
    flexDirection: "row",
    gap: 20,
    overflow: "visible",
  },
  category: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  categoryText: {
    fontSize: 16,
    color: "#000",
  },
  selectedCategory: {
    backgroundColor: "#ABC4FD",
    borderColor: "#9CB7FB",
    borderWidth: 1,
  },
  selectedCategoryText: {
    color: "#fff",
  },
  content: {
    gap: 20,
    paddingBottom: 80,
  },
  addNew: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#3567E4",
    padding: 5,
    borderRadius: 10,
    elevation: 100,
    zIndex: 100,
  },
});

export default Invoice;
