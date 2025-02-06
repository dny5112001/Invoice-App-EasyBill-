import { useState, useCallback, useEffect } from "react";
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
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getEstimates } from "../SqlSetup/db";

const Estimate = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [estimates, setEstimates] = useState([]);
  const [filteredEstimates, setFilteredEstimates] = useState([]);

  const categories = ["All", "Pending", "Approved", "Overdue", "Cancel"];

  const fetchEstimate = async () => {
    const estimatesData = await getEstimates();
    setEstimates(estimatesData);
  };

  // ✅ Fetch data every time the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchEstimate();
    }, [])
  );

  // ✅ Filtering Logic
  const filterEstimates = () => {
    let filtered = estimates;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (estimate) => estimate.status === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (estimate) =>
          estimate.clientEmail.toLowerCase().includes(lowercasedQuery) ||
          estimate.estimateNumber.toLowerCase().includes(lowercasedQuery)
      );
    }

    setFilteredEstimates(filtered);
  };

  // ✅ Apply filters when estimates, category, or search query changes
  useFocusEffect(
    useCallback(() => {
      filterEstimates();
    }, [selectedCategory, searchQuery, estimates])
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
        data={filteredEstimates}
        renderItem={({ item }) => (
          <EstimateCard
            clientEmail={item.clientEmail}
            amount={item.totalAmount}
            estimateNumber={item.estimateNumber}
            creationDate={item.creationDate}
            duedate={item.dueDate}
            initialStatus={item.status}
            refreshData={fetchEstimate} // ✅ Pass refresh function
          />
        )}
        keyExtractor={(item) => item.estimateNumber}
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
