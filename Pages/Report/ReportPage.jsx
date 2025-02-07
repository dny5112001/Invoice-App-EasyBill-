import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import {
  getTopClients,
  getTopItems,
  getInvoicesPerMonth,
} from "../../SqlSetup/db";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

const ReportPage = () => {
  const [invoicesData, setInvoicesData] = useState([]);
  const [topClients, setTopClients] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const invoices = await getInvoicesPerMonth();
          const clients = await getTopClients();
          const items = await getTopItems();

          setInvoicesData(invoices || []);
          setTopClients(clients || []);
          setTopItems(items || []);
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        } finally {
          setLoading(false); // Ensures loading stops even if there's an error
        }
      };

      fetchData();
    }, [])
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="80" color="#3567E4" />
        <Text style={{ marginTop: 10, fontSize: 16, color: "#333" }}>
          Loading reports...
        </Text>
      </View>
    );
  }

  // Transform fetched invoices data for the Line Chart
  const invoiceData = {
    labels: invoicesData.map((item) => item.month) || [],
    datasets: [
      {
        data: invoicesData.map((item) => item.invoiceCount) || [],
        color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  // Transform fetched top clients data for the Pie Chart
  const topClientsData = topClients.map((client, index) => ({
    name: client.clientName || `Client ${index + 1}`,
    population: client.invoiceCount || 0,
    color: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"][index % 5],
    legendFontColor: "#7F7F7F",
    legendFontSize: 12,
  }));

  // Transform fetched top items data for the Pie Chart
  const topItemsData = topItems.map((item, index) => ({
    name: item.itemName || `Item ${index + 1}`,
    population: item.itemCount || 0,
    color: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"][index % 5],
    legendFontColor: "#7F7F7F",
    legendFontSize: 12,
  }));

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    propsForLabels: { rotation: -90, fontSize: 10 },
  };

  const renderPieChart = (data, title) => (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      {data.length > 0 ? (
        <PieChart
          data={data}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      ) : (
        <Text style={styles.noDataText}>No data available</Text>
      )}
    </View>
  );

  return (
    <>
      <Text style={styles.title}>Reports</Text>
      <ScrollView style={styles.container}>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Invoice Overview</Text>
          {invoiceData.labels.length > 0 ? (
            <LineChart
              data={invoiceData}
              width={screenWidth - 60}
              height={220}
              chartConfig={chartConfig}
              bezier
              fromZero
              withDots
              withInnerLines
              withYAxisLabels={false}
              withVerticalLabels
              verticalLabelRotation={90}
              style={{
                borderRadius: 8,
                marginLeft: -15,
                backgroundColor: "transparent",
              }}
              onDataPointClick={({ value, index }) => {
                Alert.alert(
                  `Invoices in ${invoiceData.labels[index]}`,
                  `Total: ${value}`
                );
              }}
            />
          ) : (
            <Text style={styles.noDataText}>No invoice data available</Text>
          )}
        </View>

        {renderPieChart(topClientsData, "Top 5 Clients")}
        {renderPieChart(topItemsData, "Top 5 Items Sold")}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    marginTop: 40,
    paddingHorizontal: 20,
  },
  chartContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 10,
  },
});

export default ReportPage;
