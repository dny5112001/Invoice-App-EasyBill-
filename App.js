import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, Text, View } from "react-native";
import TabNavigationContainer from "./TabNavigationContainer";
import More from "./Pages/More";
import Settings from "./Pages/Settings";
import AboutUsPage from "./Pages/AboutUs/AboutUsPage";
import DashboardPage from "./Pages/Dashboard/DashboardPage";
import BusinessSelectionPage from "./Pages/Business/BusinessSelectionPage";
import ReportPage from "./Pages/Report/ReportPage";
import BusinessCreationPage from "./Pages/Business/BusinessCreationPage";
import BusinessEditingPage from "./Pages/Business/BusinessEditingPage";
import TaxCreation from "./Pages/Settings/TaxCreation";
import PaymentMethodCreation from "./Pages/Settings/PaymentMethodCreation";
import TermsConditionsCreation from "./Pages/Settings/Terms&ConditionsCreation";
import Terms_ConditionsCreation from "./Pages/Settings/Terms&ConditionsCreation";
import SignaturesCreation from "./Pages/Settings/SignaturesCreation";
import InvoiceCreationPage from "./Pages/Invoices/InvoiceCreationPage";
import InvoiceEditingPage from "./Pages/Invoices/InvoiceEditingPage";
import InvoicePreviewPage from "./Pages/Invoices/InvoicePreviewPage";
import EstimateCreationPage from "./Pages/Estimates/EstimateCreationPage";
import EstimateEditingPage from "./Pages/Estimates/EstimateEditingPage";
import EstimatePreviewPage from "./Pages/Estimates/EstimatePreviewPage";
import ItemsCreationPage from "./Pages/Items/ItemsCreationPage";
import ItemsEditingPage from "./Pages/Items/ItemsEditingPage";
import ClientCreationPage from "./Pages/Clients/ClientCreationPage";
import ClientEditingPage from "./Pages/Clients/ClientEditingPage";
import ClientSelectionPage from "./Pages/Clients/ClientSelectionPage";
import ItemsSelectionPage from "./Pages/Items/ItemsSelectionPage";
import ItemsSelectedEditingPage from "./Pages/Items/ItemsSelectedEditingPage";
import TaxSelectedPage from "./Pages/Settings/TaxSelectedPage";
import PaymentSelectionPage from "./Pages/Settings/PaymentSelectionPage";
import TermsSelectionPage from "./Pages/Settings/TermsSelectionPage";
import SignatureSelectedPage from "./Pages/Settings/SignatureSelectedPage";
import InvoiceSavePage from "./Pages/Invoices/InvoiceSavePage";
import { initializeDatabase } from "./SqlSetup/db";
import { StatusBar } from "expo-status-bar";

// HomeScreen Component

export default function App() {
  useEffect(() => {
    initializeDatabase();
  }, []);

  const Stack = createStackNavigator(); // Correct function
  return (
    <>
      {/* Global statusBar for all the screens */}
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Tab" component={TabNavigationContainer} />
          <Stack.Screen name="More" component={More} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="About Us" component={AboutUsPage} />
          <Stack.Screen name="Dashboard" component={DashboardPage} />
          <Stack.Screen name="Report" component={ReportPage} />
          <Stack.Screen name="My Business" component={BusinessSelectionPage} />
          <Stack.Screen
            name="Business Creation"
            component={BusinessCreationPage}
          />
          <Stack.Screen name="Business Edit" component={BusinessEditingPage} />
          <Stack.Screen name="Tax Creation" component={TaxCreation} />
          <Stack.Screen name="TaxSelection" component={TaxSelectedPage} />

          <Stack.Screen
            name="Payment Creation"
            component={PaymentMethodCreation}
          />

          <Stack.Screen
            name="PaymentSelection"
            component={PaymentSelectionPage}
          />

          <Stack.Screen
            name="Terms&Condition Creation"
            component={Terms_ConditionsCreation}
          />
          <Stack.Screen name="TermsSelection" component={TermsSelectionPage} />
          <Stack.Screen
            name="Signature Creation"
            component={SignaturesCreation}
          />
          <Stack.Screen
            name="SignatureSelection"
            component={SignatureSelectedPage}
          />
          <Stack.Screen
            name="Invoice Creation"
            component={InvoiceCreationPage}
          />
          <Stack.Screen name="Invoice Editing" component={InvoiceEditingPage} />
          <Stack.Screen name="Invoice Preview" component={InvoicePreviewPage} />
          <Stack.Screen name="Invoice Save" component={InvoiceSavePage} />

          <Stack.Screen
            name="Estimate Creation"
            component={EstimateCreationPage}
          />
          <Stack.Screen
            name="Estimate Editing"
            component={EstimateEditingPage}
          />
          <Stack.Screen
            name="Estimate Preview"
            component={EstimatePreviewPage}
          />

          <Stack.Screen name="ItemsCreation" component={ItemsCreationPage} />
          <Stack.Screen name="ItemsEditing" component={ItemsEditingPage} />
          <Stack.Screen name="ItemsSelection" component={ItemsSelectionPage} />
          <Stack.Screen
            name="ItemsSelectedEditingPage"
            component={ItemsSelectedEditingPage}
          />

          <Stack.Screen name="ClientsCreation" component={ClientCreationPage} />
          <Stack.Screen name="ClientsEditing" component={ClientEditingPage} />
          <Stack.Screen
            name="ClientsSelection"
            component={ClientSelectionPage}
          />

          {/* <Stack.Screen name="items Creation " component={ItemsCreationPage} />
        <Stack.Screen name="Items Editing " component={ItemsEditingPage} />

        <Stack.Screen name="Client Creation " component={ClientCreationPage} />
        <Stack.Screen name="Client Editing " component={ClientEditingPage} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
