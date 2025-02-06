import { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import { generatePDF } from "../../Pdfs/pdfGenerator";
import useEstimateStore from "../../zustandStore/ZustandStore";
import Pdf from "react-native-pdf";
import { MaterialIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const EstimatePreviewPage = () => {
  const estimateData = useEstimateStore();
  const [loading, setLoading] = useState(true);
  const [pdfUri, setPdfUri] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const hasGeneratedPDF = useRef(false);

  const handleGeneratePDF = async () => {
    if (hasGeneratedPDF.current) return;
    hasGeneratedPDF.current = true;

    try {
      setLoading(true);
      const uri = await generatePDF(estimateData);
      console.log("Generated PDF URI:", uri);

      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        throw new Error("PDF file does not exist");
      }

      setPdfUri(uri);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
    setLoading(false);
  };

  const handleSharePDF = async () => {
    if (pdfUri) {
      try {
        await Sharing.shareAsync(pdfUri, {
          mimeType: "application/pdf",
          dialogTitle: "Share your estimate",
          UTI: "com.adobe.pdf",
        });
      } catch (error) {
        console.error("Error sharing PDF:", error);
      }
    }
  };

  const handlePrintPDF = async () => {
    if (pdfUri) {
      try {
        await Print.printAsync({ uri: pdfUri });
      } catch (error) {
        console.error("Error printing PDF:", error);
      }
    }
  };

  useEffect(() => {
    handleGeneratePDF();
  }, [estimateData]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estimate Preview</Text>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="80" color="#3567E4" />
          <Text style={styles.loaderText}>Generating PDF...</Text>
        </View>
      ) : pdfUri ? (
        <>
          <View style={styles.pdfContainer}>
            <Pdf
              source={{ uri: pdfUri, cache: true }}
              style={styles.pdf}
              onLoadComplete={(numberOfPages) => setTotalPages(numberOfPages)}
              onPageChanged={(page) => setCurrentPage(page)}
              onError={(error) => console.error("Error loading PDF:", error)}
              fitPolicy={0}
              enablePaging={false}
              horizontal={false}
              page={1}
            />
          </View>
          <View style={styles.pageIndicator}>
            <Text style={styles.pageIndicatorText}>
              Page {currentPage} of {totalPages}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSharePDF}>
              <MaterialIcons name="share" size={24} color="white" />
              <Text style={styles.buttonText}>Share PDF</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handlePrintPDF}>
              <MaterialIcons name="print" size={24} color="white" />
              <Text style={styles.buttonText}>Print PDF</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="red" />
          <Text style={styles.errorText}>Failed to generate PDF.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    marginTop: 10,
    fontSize: 18,
    color: "#3567E4",
    fontWeight: "bold",
  },
  pdfContainer: {
    flex: 1,
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pdf: {
    flex: 1,
    width: width - 40,
    height: height - 200,
  },
  pageIndicator: {
    alignItems: "center",
    marginBottom: 10,
  },
  pageIndicatorText: {
    fontSize: 16,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#1AB594",
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 5,
    marginVertical: 5,
    width: width / 2.5,
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
  },
});

export default EstimatePreviewPage;
