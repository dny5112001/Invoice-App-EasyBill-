import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { getEstimates } from "../../SqlSetup/db";

const InvoiceSavePage = () => {
  const [estimates, setEstimates] = React.useState([]);
  useEffect(() => {
    const fetch = async () => {
      const data = await getEstimates();
      setEstimates(data);
    };
    fetch();
  }, []);

  console.log(JSON.parse(estimates[0].items));

  return (
    <View>
      <Text>InvoiceSavePage</Text>
    </View>
  );
};

export default InvoiceSavePage;

const styles = StyleSheet.create({});
