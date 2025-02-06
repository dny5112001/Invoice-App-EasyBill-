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
import InvoiceCard from "../Components/InvoiceCard"; // Assuming you have this component
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getInvoices } from "../SqlSetup/db"; // Assuming this is your function for fetching invoices

const Invoice = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);

  const categories = ["All", "Paid", "Partially Paid", "Unpaid", "Overdue"];

  const fetchInvoices = async () => {
    const invoicesData = await getInvoices();
    setInvoices(invoicesData);
  };

  // ✅ Fetch data every time the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchInvoices();
    }, [])
  );

  // ✅ Filtering Logic
  const filterInvoices = () => {
    let filtered = invoices;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (invoice) => invoice.status === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (invoice) =>
          invoice.clientEmail.toLowerCase().includes(lowercasedQuery) ||
          invoice.invoiceNumber.toLowerCase().includes(lowercasedQuery)
      );
    }

    setFilteredInvoices(filtered);
  };

  // ✅ Apply filters when invoices, category, or search query changes
  useEffect(() => {
    filterInvoices();
  }, [selectedCategory, searchQuery, invoices]);

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
        data={filteredInvoices}
        renderItem={({ item }) => (
          <InvoiceCard
            clientEmail={item.clientEmail}
            amount={item.totalAmount}
            partiallyPaid={item.partiallyPaid}
            invoiceNumber={item.invoiceNumber}
            creationDate={item.creationDate}
            duedate={item.dueDate}
            initialStatus={item.status}
            refreshData={fetchInvoices} // ✅ Pass refresh function
          />
        )}
        keyExtractor={(item) => item.invoiceNumber}
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
