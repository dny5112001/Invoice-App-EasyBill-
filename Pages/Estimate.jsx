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
import EstimateCard from "../Components/EstimateCard";
import { useNavigation } from "@react-navigation/native";

const Estimate = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Pending", "Approved", "Overdue", "Cancel"];
  const data = [
    {
      id: "1",
      clientName: "John Doe",
      amount: 5000,
      estimateNumber: "EST-001",
      date: "2023-05-15",
      initialStatus: "Pending",
    },
    {
      id: "2",
      clientName: "Jane Smith",
      amount: 7500,
      estimateNumber: "EST-002",
      date: "2023-05-16",
      initialStatus: "Approved",
    },
    {
      id: "3",
      clientName: "Bob Johnson",
      amount: 3000,
      estimateNumber: "EST-003",
      date: "2023-05-17",
      initialStatus: "Cancel",
    },
    {
      id: "4",
      clientName: "Alice Brown",
      amount: 6000,
      estimateNumber: "EST-004",
      date: "2023-05-18",
      initialStatus: "Pending",
    },
    {
      id: "5",
      clientName: "Charlie Wilson",
      amount: 4500,
      estimateNumber: "EST-005",
      date: "2023-05-19",
      initialStatus: "Approved",
    },
    {
      id: "6",
      clientName: "Diana Miller",
      amount: 8000,
      estimateNumber: "EST-006",
      date: "2023-05-20",
      initialStatus: "Pending",
    },
    {
      id: "7",
      clientName: "Edward Davis",
      amount: 5500,
      estimateNumber: "EST-007",
      date: "2023-05-21",
      initialStatus: "Cancel",
    },
    {
      id: "8",
      clientName: "Fiona Taylor",
      amount: 7000,
      estimateNumber: "EST-008",
      date: "2023-05-22",
      initialStatus: "Approved",
    },
  ];

  const filteredData = data.filter((item) => {
    const categoryMatch =
      selectedCategory === "All" || item.initialStatus === selectedCategory;
    const searchMatch =
      item.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.estimateNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const renderItem = useCallback(
    ({ item }) => (
      <EstimateCard
        clientName={item.clientName}
        amount={item.amount}
        estimateNumber={item.estimateNumber}
        date={item.date}
        initialStatus={item.initialStatus}
      />
    ),
    []
  );

  return (
    <View style={styles.container}>
      <View style={styles.container1}>
        <Text style={styles.header}>Estimates</Text>
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
        placeholder="Search Estimates"
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
        ListEmptyComponent={<Text>No Estimates Available</Text>}
      />
      <TouchableOpacity
        style={styles.addNew}
        onPress={() => {
          navigation.navigate("Estimate Creation");
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

export default Estimate;
