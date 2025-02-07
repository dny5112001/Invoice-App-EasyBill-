import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseAsync("easybill.db"); // Open or create the database

// Function to create the tables
const createTables = async () => {
  try {
    // Execute multiple queries with `execAsync()`
    (await db).execAsync(`
      PRAGMA journal_mode = WAL;

      -- Items Table
      CREATE TABLE IF NOT EXISTS items (
        itemName TEXT PRIMARY KEY,
        itemPrice REAL,
        unitsOfMeasure TEXT,
        itemDescription TEXT
      );

      -- Clients Table
      CREATE TABLE IF NOT EXISTS clients (
        clientName TEXT NOT NULL,
        clientEmail TEXT PRIMARY KEY UNIQUE NOT NULL,
        clientPhone TEXT NOT NULL,
        billingAddressLine1 TEXT,
        billingAddressLine2 TEXT,
        shippingAddressLine1 TEXT,
        shippingAddressLine2 TEXT,
        taxName TEXT,
        taxId TEXT,
        clientDetail TEXT
      );

      -- Tax Table
      CREATE TABLE IF NOT EXISTS tax (
        taxName TEXT PRIMARY KEY,
        taxRate REAL NOT NULL
      );

      -- Payment Method Table
      CREATE TABLE IF NOT EXISTS payments (
        paymentMethod TEXT PRIMARY KEY
      );

      -- Terms & Conditions Table
      CREATE TABLE IF NOT EXISTS termsAndConditions (
        termsAndConditions TEXT PRIMARY KEY
      );

      -- Business Table
      CREATE TABLE IF NOT EXISTS business (
        businessName TEXT PRIMARY KEY,
        businessEmail TEXT,
        businessPhone TEXT,
        businessAddressLine1 TEXT,
        businessAddressLine2 TEXT,
        businessWebsiteLink TEXT,
        taxName TEXT,
        taxId TEXT,
        businessPhoto BLOB,
        businessMain INTEGER NOT NULL DEFAULT 0
      );


      -- Signature Table
      CREATE TABLE IF NOT EXISTS signatures (
      signatureName TEXT PRIMARY KEY,
      signatureImage BLOB
      );




       -- Estimate Table
          CREATE TABLE IF NOT EXISTS estimates(
            estimateNumber TEXT PRIMARY KEY,
            creationDate TEXT,
            dueDate TEXT,
            businessName TEXT,
            clientEmail TEXT,
            items TEXT,
            subTotal REAL,
            discountType TEXT,
            discount REAL,
            taxName TEXT,
            taxRate TEXT,
            shippingAmount REAL,
            totalAmount REAL,
            signatureName TEXT,
            signatureImage BLOB,
            terms TEXT,
            paymentMethod TEXT,
            status TEXT
          );


         CREATE TABLE IF NOT EXISTS invoices(
          invoiceNumber TEXT PRIMARY KEY,
          creationDate TEXT,
          dueDate TEXT,
          businessName TEXT,
          clientEmail TEXT,
          items TEXT,
          subTotal REAL,
          discountType TEXT,
          discount REAL,
          taxName TEXT,
          taxRate TEXT,
          shippingAmount REAL,
          totalAmount REAL,
          signatureName TEXT,
          signatureImage BLOB,
          terms TEXT,
          paymentMethod TEXT,
          status TEXT,
          partiallyPaid REAL  -- Remove the trailing comma here
);



    `);

    console.log("Tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
};

// Estimate Table

const saveEstimateToDb = async (estimateData) => {
  console.log(estimateData);
  const {
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
    signatureName,
    signatureImage,
    terms,
    paymentMethod,
    status,
  } = estimateData;

  // Prepare the SQL query for insertion
  const query = `
    INSERT INTO estimates (
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
      signatureName,
      signatureImage,
      terms,
      paymentMethod,
      status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    // Execute the insertion query asynchronously
    const result = await (
      await db
    ).runAsync(
      query,
      estimateNumber,
      creationDate.toISOString(),
      dueDate.toISOString(),
      businessName,
      clientEmail,
      JSON.stringify(items), // Convert items array to a JSON string
      subTotal,
      discountType,
      discount,
      taxName,
      taxRate,
      shippingAmount,
      totalAmount,
      signatureName,
      signatureImage, // If it's a BLOB, you may need to handle it accordingly
      terms,
      paymentMethod,
      status
    );

    return result;

    console.log("Estimate saved successfully:", result);
  } catch (error) {
    console.error("Error saving estimate:", error);
  }
};

// Items table
const getEstimates = async () => {
  try {
    const result = await (await db).getAllAsync("SELECT * FROM estimates");
    return result;
  } catch (error) {
    console.error("Error fetching estimates:", error);
    return [];
  }
};

const getIndividualEstimate = async (estimateNumber) => {
  try {
    const result = await (
      await db
    ).getAllAsync(
      "SELECT * FROM estimates WHERE estimateNumber = ?",
      estimateNumber
    );
    return result;
  } catch (err) {
    console.error("Error fetching individual estimate:", err);
  }
};

const updateEstimate = async (estimateNumber, estimateData) => {
  const {
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
    signatureName,
    signatureImage,
    terms,
    paymentMethod,
    status,
  } = estimateData;

  try {
    const result = await (
      await db
    ).runAsync(
      `UPDATE estimates SET 
        creationDate = ?, 
        dueDate = ?, 
        businessName = ?, 
        clientEmail = ?, 
        items = ?, 
        subTotal = ?, 
        discountType = ?, 
        discount = ?, 
        taxName = ?, 
        taxRate = ?, 
        shippingAmount = ?, 
        totalAmount = ?, 
        signatureName = ?, 
        signatureImage = ?, 
        terms = ?, 
        paymentMethod = ?, 
        status = ? 
      WHERE estimateNumber = ?`,
      creationDate.toISOString(),
      dueDate.toISOString(),
      businessName,
      clientEmail,
      JSON.stringify(items),
      subTotal,
      discountType,
      discount,
      taxName,
      taxRate,
      shippingAmount,
      totalAmount,
      signatureName,
      signatureImage,
      terms,
      paymentMethod,
      status,
      estimateNumber
    );
    console.log("Estimate updated successfully:", result);
    return result;
  } catch (error) {
    console.error("Error updating estimate:", error);
  }
};

const updateEstimateStatus = async (estimateNumber, status) => {
  try {
    const result = await (
      await db
    ).runAsync(
      `UPDATE estimates SET status = ? WHERE estimateNumber = ?`,
      status,
      estimateNumber
    );
    console.log("Estimate status updated successfully:", result);
  } catch (error) {
    console.error("Error updating estimate status:", error);
  }
};

const deleteEstimate = async (estimateNumber) => {
  try {
    const result = await (
      await db
    ).runAsync(
      "DELETE FROM estimates WHERE estimateNumber = ?",
      estimateNumber
    );
    console.log("Estimate deleted successfully:", result);
  } catch (error) {
    console.error("Error deleting estimate:", error);
  }
};

// Invoice table

const saveInvoiceToDb = async (invoiceData) => {
  try {
    const {
      invoiceNumber,
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
      signatureName,
      signatureImage,
      terms,
      paymentMethod,
      status,
      partiallyPaid,
    } = invoiceData;

    const query = `
    INSERT INTO invoices (
     invoiceNumber,
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
      signatureName,
      signatureImage,
      terms,
      paymentMethod,
      status,
      partiallyPaid
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

    const result = await (
      await db
    ).runAsync(
      query,
      invoiceNumber,
      creationDate.toISOString(),
      dueDate.toISOString(),
      businessName,
      clientEmail,
      JSON.stringify(items),
      subTotal,
      discountType,
      discount,
      taxName,
      taxRate,
      shippingAmount,
      totalAmount,
      signatureName,
      signatureImage,
      terms,
      paymentMethod,
      status,
      partiallyPaid
    );

    console.log("Invoice saved successfully:", result);
    return result;
  } catch (error) {
    console.error("Error saving invoice to database:", error);
  }
};

const getInvoices = async () => {
  try {
    const result = await (await db).getAllAsync("SELECT * FROM invoices");
    console.log("Invoices retrieved successfully:", result);
    return result;
  } catch (error) {
    console.error("Error retrieving invoices from database:", error);
  }
};

const getIndividualInvoice = async (invoiceNumber) => {
  console.log(invoiceNumber);
  try {
    const result = await (
      await db
    ).getAllAsync(
      "SELECT * FROM invoices WHERE invoiceNumber = ?",
      invoiceNumber
    );
    console.log("Individual invoice retrieved successfully:", result);
    return result;
  } catch (err) {
    console.error("Error fetching individual invoice:", err);
  }
};

const deleteInvoice = async (invoiceNumber) => {
  try {
    const result = await (
      await db
    ).runAsync("DELETE FROM invoices WHERE invoiceNumber = ?", invoiceNumber);
    console.log("Invoice deleted successfully:", result);
  } catch (error) {
    console.error("Error deleting invoice:", error);
  }
};

const updateInvoiceStatus = async (invoiceNumber, status, partiallyPaid) => {
  try {
    const result = await (
      await db
    ).runAsync(
      `UPDATE invoices SET status = ?, partiallyPaid = ? WHERE invoiceNumber = ?`,
      status,
      partiallyPaid,
      invoiceNumber
    );
    console.log("Invoice status updated successfully:", result);
  } catch (error) {
    console.error("Error updating invoice status:", error);
  }
};

const updateInvoice = async (invoiceNumber, invoiceData) => {
  const {
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
    signatureName,
    signatureImage,
    terms,
    paymentMethod,
    status,
    partiallyPaid,
  } = invoiceData;

  try {
    const result = await (
      await db
    ).runAsync(
      `UPDATE invoices SET 
        creationDate = ?, 
        dueDate = ?, 
        businessName = ?, 
        clientEmail = ?, 
        items = ?, 
        subTotal = ?, 
        discountType = ?, 
        discount = ?, 
        taxName = ?, 
        taxRate = ?, 
        shippingAmount = ?, 
        totalAmount = ?, 
        signatureName = ?, 
        signatureImage = ?, 
        terms = ?, 
        paymentMethod = ?, 
        status = ?, 
        partiallyPaid = ? 
      WHERE invoiceNumber = ?`,
      creationDate.toISOString(),
      dueDate.toISOString(),
      businessName,
      clientEmail,
      JSON.stringify(items),
      subTotal,
      discountType,
      discount,
      taxName,
      taxRate,
      shippingAmount,
      totalAmount,
      signatureName,
      signatureImage,
      terms,
      paymentMethod,
      status,
      partiallyPaid,
      invoiceNumber
    );

    console.log("Invoice updated successfully:", result);
    return result;
  } catch (error) {
    console.error("Error updating invoice:", error);
  }
};

// Function to insert an item into the items table
const insertItem = async (
  itemName,
  itemPrice,
  unitsOfMeasure,
  itemDescription
) => {
  try {
    const result = await (
      await db
    ).runAsync(
      "INSERT INTO items (itemName, itemPrice, unitsOfMeasure, itemDescription) VALUES (?, ?, ?, ?)",
      itemName,
      itemPrice,
      unitsOfMeasure,
      itemDescription
    );
    console.log("Item inserted:", result);
  } catch (error) {
    console.error("Error inserting item:", error);
  }
};
// Function to get all items from the items table
const getItems = async () => {
  try {
    const result = await (await db).getAllAsync("SELECT * FROM items");
    return result; // Return the result array
  } catch (error) {
    console.error("Error getting items:", error);
    return []; // Return an empty array in case of an error
  }
};

//Function to delete the item from the items table
const deleteItem = async (itemName) => {
  try {
    const result = await (
      await db
    ).runAsync("DELETE FROM items WHERE itemName = ?", itemName);
    console.log("Item deleted:", result);
  } catch (error) {
    console.error("Error deleting item:", error);
  }
};

// Function to update the item in the items table
const updateItem = async (
  itemName,
  itemPrice,
  unitsOfMeasure,
  itemDescription
) => {
  try {
    const result = await (
      await db
    ).runAsync(
      "UPDATE items SET itemPrice = ?, unitsOfMeasure = ?, itemDescription = ? WHERE itemName = ?",
      itemPrice,
      unitsOfMeasure,
      itemDescription,
      itemName
    );
    console.log("Item updated:", result);
  } catch (error) {
    console.error("Error updating item:", error);
  }
};
const getIndividualItem = async (itemName) => {
  try {
    const result = await (
      await db
    ).getAllAsync("SELECT * FROM items WHERE itemName = ?", itemName);
    return result;
  } catch (error) {
    console.error("Error fetching individual item:", error);
    return null;
  }
};
// Client tables
const getClientByEmail = async (clientEmail) => {
  try {
    const result = await (
      await db
    ).getAllAsync("SELECT * FROM clients WHERE clientEmail = ?", clientEmail);
    return result;
  } catch (error) {
    console.error("Error fetching client by email:", error);
    return null;
  }
};

const insertClient = async (client) => {
  try {
    const {
      clientName,
      clientEmail,
      clientPhone,
      billingAddressLine1,
      billingAddressLine2,
      shippingAddressLine1,
      shippingAddressLine2,
      taxName,
      taxId,
      clientDetail,
    } = client;
    await (
      await db
    ).runAsync(
      "INSERT INTO clients VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      clientName,
      clientEmail,
      clientPhone,
      billingAddressLine1,
      billingAddressLine2,
      shippingAddressLine1,
      shippingAddressLine2,
      taxName,
      taxId,
      clientDetail
    );
    console.log("Client inserted successfully");
  } catch (error) {
    console.error("Error inserting client:", error);
  }
};

const getClients = async () => {
  try {
    const result = await (await db).getAllAsync("SELECT * FROM clients");
    return result;
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
};

const getIndividualClient = async (clientEmail) => {
  try {
    return await (
      await db
    ).getAllAsync("SELECT * FROM clients WHERE clientEmail = ?", clientEmail);
  } catch (error) {
    console.error("Error fetching individual client:", error);
  }
};

// 🔹 Update Client (Dynamically Update Any Field)
const updateClient = async (clientData) => {
  const { clientEmail, ...updatedFields } = clientData;
  if (!clientEmail || Object.keys(updatedFields).length === 0) {
    console.error("Client email and at least one field are required.");
    return;
  }

  const setClause = Object.keys(updatedFields)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = [...Object.values(updatedFields), clientEmail];

  try {
    await (
      await db
    ).runAsync(
      `UPDATE clients SET ${setClause} WHERE clientEmail = ?`,
      ...values
    );
    console.log("Client updated successfully");
  } catch (error) {
    console.error("Error updating client:", error);
  }
};

const deleteClient = async (clientEmail) => {
  try {
    await (
      await db
    ).runAsync("DELETE FROM clients WHERE clientEmail = ?", clientEmail);
    console.log("Client deleted successfully");
  } catch (error) {
    console.error("Error deleting client:", error);
  }
};

// business tables
const insertBusiness = async (business) => {
  try {
    const {
      businessName,
      businessEmail,
      businessPhone,
      businessAddressLine1,
      businessAddressLine2,
      businessWebsiteLink,
      taxName,
      taxId,
      businessPhoto,
      businessMain,
    } = business;
    const result = await (
      await db
    ).runAsync(
      `INSERT INTO business VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      businessName,
      businessEmail,
      businessPhone,
      businessAddressLine1,
      businessAddressLine2,
      businessWebsiteLink,
      taxName,
      taxId,
      businessPhoto,
      businessMain || 0
    );
    console.log("Business inserted:", result);
  } catch (error) {
    console.error("Error inserting business:", error);
  }
};

const getBusinesses = async () => {
  try {
    return await (await db).getAllAsync("SELECT * FROM business");
  } catch (error) {
    console.error("Error fetching businesses:", error);
    return [];
  }
};

const getMainBusiness = async () => {
  try {
    return await (
      await db
    ).getAllAsync("SELECT * FROM Business WHERE businessMain = 1");
  } catch (error) {
    console.error("Error fetching main business:", error);
  }
};

const getBusinessByName = async (businessName) => {
  try {
    return await (
      await db
    ).getAllAsync(
      "SELECT * FROM business WHERE businessName = ?",
      businessName
    );
  } catch (error) {
    console.error("Error fetching business by name:", error);
  }
};
const updateMainBusiness = async (PreviousBusinessName, NewBusinessName) => {
  try {
    const database = await db;

    // Set all businesses with the previous name to not be the main business
    await database.runAsync(
      `UPDATE Business SET businessMain = 0 WHERE businessName = ?`,
      PreviousBusinessName
    );

    // Set the new business as the main business
    const result = await database.runAsync(
      `UPDATE Business SET businessMain = 1 WHERE businessName = ?`,
      NewBusinessName
    );

    return result;
  } catch (error) {
    console.error("Error updating main business:", error);
    throw error; // Re-throw error for handling at a higher level
  }
};

const updateBusiness = async (businessName, updatedFields) => {
  const setClause = Object.keys(updatedFields)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = [...Object.values(updatedFields), businessName];

  try {
    await (
      await db
    ).runAsync(
      `UPDATE business SET ${setClause} WHERE businessName = ?`,
      ...values
    );
    console.log("Business updated successfully");
  } catch (error) {
    console.error("Error updating business:", error);
  }
};

const deleteBusiness = async (businessName, businessMain) => {
  try {
    const database = await db;

    // Delete the specified business
    await database.runAsync(
      `DELETE FROM Business WHERE businessName = ?`,
      businessName
    );

    console.log("Business deleted successfully");

    if (businessMain === 1) {
      // Get all remaining businesses, ordered alphabetically
      const businesses = await database.getAllAsync(
        `SELECT businessName FROM Business ORDER BY businessName ASC LIMIT 1`
      );

      console.log("Next business to be set as main:", businesses);

      if (businesses.length > 0) {
        const firstRecord = businesses[0]; // Get the first business in the array

        await database.runAsync(
          `UPDATE Business SET businessMain = 1 WHERE businessName = ?`,
          firstRecord.businessName
        );

        return firstRecord; // Return the new main business
      }
    }

    return { success: true }; // Indicate successful deletion
  } catch (error) {
    console.error("Error deleting business:", error);
    throw error; // Ensure errors are propagated
  }
};

// Tax tables

const insertTax = async (taxName, taxRate) => {
  try {
    await (
      await db
    ).runAsync("INSERT INTO tax VALUES (?, ?)", taxName, taxRate);
    console.log("Tax inserted successfully");
  } catch (error) {
    console.error("Error inserting tax:", error);
  }
};

const getTaxes = async () => {
  try {
    return await (await db).getAllAsync("SELECT * FROM tax");
  } catch (error) {
    console.error("Error fetching taxes:", error);
    return [];
  }
};

const updateTax = async (taxName, newTaxRate) => {
  try {
    const result = await (
      await db
    ).runAsync(
      "UPDATE tax SET taxRate = ? WHERE taxName = ?",
      newTaxRate,
      taxName
    );
    console.log("Tax updated successfully:", result);
  } catch (error) {
    console.error("Error updating tax:", error);
  }
};

const deleteTax = async (taxName) => {
  try {
    await (await db).runAsync("DELETE FROM tax WHERE taxName = ?", taxName);
    console.log("Tax deleted successfully");
  } catch (error) {
    console.error("Error deleting tax:", error);
  }
};
const getTaxByName = async (taxName) => {
  try {
    const result = await (
      await db
    ).getAllAsync("SELECT * FROM tax WHERE taxName = ?", taxName);
    return result;
  } catch (error) {
    console.error("Error fetching tax by name:", error);
    return null;
  }
};

//payment tables
const insertPaymentMethod = async (paymentMethod) => {
  try {
    await (await db).runAsync("INSERT INTO payments VALUES (?)", paymentMethod);
    console.log("Payment method inserted successfully");
  } catch (error) {
    console.error("Error inserting payment method:", error);
  }
};

const getPaymentMethods = async () => {
  try {
    return await (await db).getAllAsync("SELECT * FROM payments");
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    return [];
  }
};

const updatePaymentMethod = async (oldPaymentMethod, newPaymentMethod) => {
  try {
    await (
      await db
    ).runAsync(
      "UPDATE payments SET paymentMethod = ? WHERE paymentMethod = ?",
      newPaymentMethod,
      oldPaymentMethod
    );
    console.log("Payment method updated successfully");
  } catch (error) {
    console.error("Error updating payment method:", error);
  }
};

const deletePaymentMethod = async (paymentMethod) => {
  try {
    await (
      await db
    ).runAsync("DELETE FROM payments WHERE paymentMethod = ?", paymentMethod);
    console.log("Payment method deleted successfully");
  } catch (error) {
    console.error("Error deleting payment method:", error);
  }
};

//Terms table
const getPaymentMethod = async (paymentMethod) => {
  try {
    const result = await (
      await db
    ).getAllAsync(
      "SELECT * FROM payments WHERE paymentMethod = ?",
      paymentMethod
    );
    return result;
  } catch (error) {
    console.error("Error fetching payment method:", error);
    return null;
  }
};

const insertTerms = async (termsAndConditions) => {
  try {
    await (
      await db
    ).runAsync("INSERT INTO termsAndConditions VALUES (?)", termsAndConditions);
    console.log("Terms inserted successfully");
  } catch (error) {
    console.error("Error inserting terms:", error);
  }
};

const getTerms = async () => {
  try {
    return await (await db).getAllAsync("SELECT * FROM termsAndConditions");
  } catch (error) {
    console.error("Error fetching terms:", error);
    return [];
  }
};

const updateTerms = async (newTermsAndConditions, oldTermsAndConditions) => {
  try {
    await (
      await db
    ).runAsync(
      "UPDATE termsAndConditions SET termsAndConditions = ? WHERE termsAndConditions = ?",
      newTermsAndConditions,
      oldTermsAndConditions // Assuming only one row is present
    );
    console.log("Terms updated successfully");
  } catch (error) {
    console.error("Error updating terms:", error);
  }
};

const deleteTerms = async (termsAndConditions) => {
  try {
    await (
      await db
    ).runAsync(
      "DELETE FROM termsAndConditions WHERE termsAndConditions = ?",
      termsAndConditions
    );
    console.log("Terms deleted successfully");
  } catch (error) {
    console.error("Error deleting terms:", error);
  }
};

const getTermsByCondition = async (termsAndConditions) => {
  try {
    const result = await (
      await db
    ).getAllAsync(
      "SELECT * FROM termsAndConditions WHERE termsAndConditions = ?",
      termsAndConditions
    );
    return result;
  } catch (error) {
    console.error("Error fetching terms by condition:", error);
    return null;
  }
};

// signature tables

// 🔹 Insert Signature (with Image)
const insertSignature = async (signatureName, signatureImage) => {
  try {
    await (
      await db
    ).runAsync(
      "INSERT INTO signatures (signatureName, signatureImage) VALUES (?, ?)",
      signatureName,
      signatureImage
    );
    console.log("Signature inserted successfully");
  } catch (error) {
    console.error("Error inserting signature:", error);
  }
};

// 🔹 Get All Signatures
const getSignatures = async () => {
  try {
    return await (await db).getAllAsync("SELECT * FROM signatures");
  } catch (error) {
    console.error("Error fetching signatures:", error);
    return [];
  }
};

const getIndividualSignature = async (signatureName) => {
  try {
    return await (
      await db
    ).getAllAsync(
      `SELECT * FROM signatures WHERE signatureName = ?`,
      signatureName
    );
  } catch (error) {
    console.error("Error fetching individual signature:", error);
  }
};

// 🔹 Delete Signature (by signatureName)
const deleteSignature = async (signatureName) => {
  try {
    await (
      await db
    ).runAsync("DELETE FROM signatures WHERE signatureName = ?", signatureName);
    console.log("Signature deleted successfully");
  } catch (error) {
    console.error("Error deleting signature:", error);
  }
};

// Initialize the database and create tables
const getSignatureByName = async (signatureName) => {
  try {
    const result = await (
      await db
    ).getAllAsync(
      "SELECT * FROM signatures WHERE signatureName = ?",
      signatureName
    );
    return result;
  } catch (error) {
    console.error("Error fetching signature by name:", error);
    return null;
  }
};

const getInvoicesPerMonth = async () => {
  try {
    const result = await (
      await db
    ).getAllAsync(
      `SELECT substr(creationDate, 1, 7) as month, COUNT(*) as invoiceCount 
       FROM invoices 
       GROUP BY month 
       ORDER BY month ASC`
    );
    return result;
  } catch (error) {
    console.error("Error fetching invoices per month:", error);
    return null;
  }
};

const getTopClients = async () => {
  try {
    // Fetch top 5 clients with most invoices
    const result = await (
      await db
    ).getAllAsync(
      `SELECT clientEmail, COUNT(*) as invoiceCount 
       FROM invoices 
       GROUP BY clientEmail 
       ORDER BY invoiceCount DESC 
       LIMIT 5`
    );

    // Fetch client details using getClientByEmail
    const clientsWithNames = await Promise.all(
      result.map(async (client) => {
        const clientDetails = await getClientByEmail(client.clientEmail);
        return {
          clientName: clientDetails?.[0]?.clientName || "Unknown Client", // Fetch clientName from client details
          invoiceCount: client.invoiceCount, // Include invoice count
        };
      })
    );

    return clientsWithNames;
  } catch (error) {
    console.error("Error fetching top clients:", error);
    return null;
  }
};

const getTopItems = async () => {
  try {
    const result = await (
      await db
    ).getAllAsync(
      `SELECT itemName, COUNT(*) as itemCount 
       FROM (
         SELECT json_extract(value, '$.itemName') as itemName 
         FROM invoices, json_each(items)
       ) 
       WHERE itemName IS NOT NULL
       GROUP BY itemName 
       ORDER BY itemCount DESC 
       LIMIT 5`
    );
    return result;
  } catch (error) {
    console.error("Error fetching top items:", error);
    return null;
  }
};

const getDashboardMetrics = async () => {
  try {
    // Fetch invoice metrics with correct calculations
    const invoiceMetrics = await (
      await db
    ).getFirstAsync(
      `SELECT 
        COUNT(invoiceNumber) as totalInvoices,
        SUM(totalAmount) as totalSales,
        SUM(CASE 
            WHEN status = 'Unpaid' THEN totalAmount 
            WHEN partiallyPaid > 0 THEN totalAmount - partiallyPaid 
            ELSE 0 
        END) as totalPending,
        SUM(CASE WHEN status = 'Unpaid' THEN totalAmount ELSE 0 END) as totalUnpaid,
        SUM(CASE WHEN status = 'Overdue' THEN totalAmount ELSE 0 END) as totalOverdue
       FROM invoices`
    );

    // Fetch total unique clients
    const clientMetrics = await (
      await db
    ).getFirstAsync(
      `SELECT COUNT(DISTINCT clientEmail) as totalClients FROM clients`
    );

    // Fetch total unique items from the items table
    const itemMetrics = await (
      await db
    ).getFirstAsync(`SELECT COUNT(DISTINCT itemName) as totalItems FROM items`);

    // Calculate total earned correctly
    const totalSales = invoiceMetrics?.totalSales || 0;
    const totalPending = invoiceMetrics?.totalPending || 0;
    const totalEarned = totalSales - totalPending;

    return {
      totalInvoices: invoiceMetrics?.totalInvoices || 0,
      totalSales: totalSales,
      totalEarned: totalEarned,
      totalPending: totalPending,
      totalUnpaid: invoiceMetrics?.totalUnpaid || 0,
      totalOverdue: invoiceMetrics?.totalOverdue || 0,
      totalClients: clientMetrics?.totalClients || 0,
      totalItems: itemMetrics?.totalItems || 0,
    };
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    return null;
  }
};

const initializeDatabase = async () => {
  await createTables();
};

export {
  db,
  initializeDatabase,
  insertItem,
  getItems,
  deleteItem,
  updateItem,
  insertClient,
  getClients,
  updateClient,
  deleteClient,
  insertBusiness,
  getBusinesses,
  updateBusiness,
  updateMainBusiness,
  deleteBusiness,
  insertPaymentMethod,
  getPaymentMethods,
  updatePaymentMethod,
  deletePaymentMethod,
  insertTerms,
  getTerms,
  updateTerms,
  deleteTerms,
  insertTax,
  getTaxes,
  updateTax,
  deleteTax,
  insertSignature,
  getSignatures,
  deleteSignature,
  getIndividualClient,
  getIndividualSignature,
  getMainBusiness,
  saveEstimateToDb,
  getEstimates,
  getBusinessByName,
  getIndividualEstimate,
  updateEstimate,
  deleteEstimate,
  updateEstimateStatus,
  saveInvoiceToDb,
  getInvoices,
  getIndividualInvoice,
  deleteInvoice,
  updateInvoiceStatus,
  updateInvoice,
  getIndividualItem,
  getClientByEmail,
  getTaxByName,
  getPaymentMethod,
  getTermsByCondition,
  getSignatureByName,
  getTopClients,
  getTopItems,
  getInvoicesPerMonth,
  getDashboardMetrics,
};
