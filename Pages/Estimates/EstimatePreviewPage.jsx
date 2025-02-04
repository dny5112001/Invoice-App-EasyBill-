import { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import * as Sharing from "expo-sharing";
import { generatePDF } from "../../Pdfs/pdfGenerator";
import useEstimateStore from "../../zustandStore/ZustandStore";
import { WebView } from "react-native-webview";
import * as FileSystem from "expo-file-system";
const { width, height } = Dimensions.get("window");

const EstimatePreviewPage = () => {
  const {
    estimateNumber,
    creationDate,
    dueDate,
    businessName,
    clientEmail,
    discountType,
    discount,
    taxName,
    taxRate,
    shippingAmount,
    items,
    subTotal,
    totalAmount,
    terms,
    signatureName,
    signatureImage,
    status,
    paymentMethod,
  } = useEstimateStore();

  const estimateData = {
    estimateNumber,
    creationDate,
    dueDate,
    businessName,
    clientEmail,
    items,
    subTotal,
    discountType,
    discount,
    taxName,
    taxRate,
    shippingAmount,
    totalAmount,
    paymentMethod,
    terms,
    signatureName,
    signatureImage,
    status,
  };

  const [loading, setLoading] = useState(false);
  const [pdfUri, setPdfUri] = useState(null);

  // const handleGeneratePDF = async () => {
  //   setLoading(true);
  //   try {
  //     const uri = await generatePDF(estimateData);
  //     console.log("Generated PDF URI:", uri);
  //     setPdfUri(uri);
  //   } catch (error) {
  //     console.error("Error generating PDF:", error);
  //   }
  //   setLoading(false);
  // };

  const handleGeneratePDF = async () => {
    setLoading(true);
    try {
      const uri = await generatePDF(estimateData);
      console.log("Generated PDF URI:", uri);

      // Convert file to base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setPdfUri(`data:application/pdf;base64,${base64}`);
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estimate Preview</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#1AB594" />
      ) : pdfUri ? (
        <>
          <View style={styles.pdfContainer}>
            <WebView
              originWhitelist={["*"]}
              source={{
                html: `
      <html>
        <body style="margin: 0; padding: 0;">
          <iframe
            src="${pdfUri}"
            width="100%"
            height="100%"
            style="border: none;"
          ></iframe>
        </body>
      </html>
    `,
              }}
              style={styles.pdf}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSharePDF}>
            <Text style={styles.buttonText}>Share PDF</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleGeneratePDF}>
          <Text style={styles.buttonText}>Generate PDF</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default EstimatePreviewPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  pdfContainer: {
    flex: 1,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  pdf: {
    flex: 1,
    width: width - 40,
    height: height - 200,
  },
  button: {
    backgroundColor: "#1AB594",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
