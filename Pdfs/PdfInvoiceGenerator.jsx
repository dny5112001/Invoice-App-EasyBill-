import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import { getBusinessByName, getIndividualClient } from "../SqlSetup/db.jsx";

export const PdfInvoiceGenerator = async (invoiceData) => {
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
      paymentMethod,
      terms,
      signatureName,
      signatureImage,
      status,
      partiallyPaid,
    } = invoiceData;

    // Fetch Business and Client Info
    const [businessInfo] = await getBusinessByName(businessName);
    const [clientInfo] = await getIndividualClient(clientEmail);

    // Convert signature image to base64
    let signatureBase64 = "";
    if (signatureImage) {
      try {
        signatureBase64 = await FileSystem.readAsStringAsync(signatureImage, {
          encoding: FileSystem.EncodingType.Base64,
        });
      } catch (error) {
        console.error("Error converting signature image:", error);
      }
    }

    // Generate Items Table HTML
    const itemsHTML = items
      .map(
        (item) => `
      <tr>
        <td>${item.itemName}</td>
        <td>${item.itemQuantity}</td>
        <td>₹${Number(item.itemPrice).toFixed(2)}</td>
        <td>${Number(item.discount).toFixed(2)}%</td>
        <td>${Number(item.taxPercentage).toFixed(2)}%</td>
        <td>₹${Number(item.finalAmount).toFixed(2)}</td>
      </tr>
    `
      )
      .join("");

    // Calculate remaining balance
    let remainingBalance = totalAmount;
    if (status === "Partially Paid") {
      remainingBalance = totalAmount - partiallyPaid;
    } else if (status === "Paid") {
      remainingBalance = 0.0;
    } else {
      remainingBalance = totalAmount; // In case the status is "Unpaid" or other
    }

    // Generate HTML Content
    const invoiceHTML = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Invoice</title>
          <style>
            body {
              font-family: 'Roboto', Arial, sans-serif;
              margin: 0;
              padding: 0;
              color: #333;
            }
            .header {
              background-color: #1AB594;
              color: white;
              padding: 20px 30px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .invoice-title {
              font-size: 36px;
              margin: 0;
            }
            .invoice-details {
              text-align: right;
              font-size: 16px;
            }
            .address-section {
              display: flex;
              justify-content: space-between;
              margin: 30px;
            }
            .address-block {
              max-width: 45%;
            }
            .address-title {
              font-weight: 800;
              margin-bottom: 10px;
            }
            .table-container {
              padding: 0 5%;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #e3e3e3;
              padding: 12px 16px;
              text-align: left;
            }
            th {
              background-color: #1AB594;
              color: white;
              font-size: 16px;
            }
            .totals-section {
              display: flex;
              justify-content: space-between;
              margin: 30px;
            }
            .payment-method {
              max-width: 45%;
            }
            .totals {
              max-width: 50%;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              border-bottom: 1px solid #e3e3e3;
              padding: 10px 0;
              font-weight: 600;
              gap:10px;
            }
            .grand-total {
              background-color: #1AB594;
              color: white;
              padding: 10px;
              margin-top: 10px;
            }
            .terms-section {
              margin: 30px;
            }
            .signature-section {
              margin: 30px;
              text-align: right;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="invoice-title">INVOICE</h1>
            <div class="invoice-details">
              <div>INVOICE #: ${invoiceNumber}</div>
              <div>ISSUE DATE: ${new Date(
                creationDate
              ).toLocaleDateString()}</div>
              <div>DUE DATE: ${new Date(dueDate).toLocaleDateString()}</div>
            </div>
          </div>

          <div class="address-section">
            <div class="address-block">
              <div>${businessInfo.businessName}</div>
              <div>${businessInfo.businessAddressLine1}</div>
              <div>${businessInfo.businessAddressLine2}</div>
              <div>${businessInfo.businessPhone}</div>
              <div>${businessInfo.businessEmail}</div>
              <div>${businessInfo.businessWebsiteLink}</div>
            </div>
            <div class="address-block">
              <div class="address-title">BILL TO</div>
              <div>${clientInfo.clientName}</div>
              <div>${clientInfo.billingAddressLine1}</div>
              <div>${clientInfo.billingAddressLine2}</div>
              <div>${clientInfo.clientPhone}</div>
              <div>${clientInfo.clientEmail}</div>
            </div>
          </div>

          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Discount</th>
                  <th>Tax</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>${itemsHTML}</tbody>
            </table>
          </div>

          <div class="totals-section">
            <div class="payment-method">
              <div style="font-weight: 800;">Payment Method:</div>
              <div>${paymentMethod}</div>
              <div style="font-weight: 800;margin-top:10px">Status:</div>
              <div>${status}</div>
            </div>
            <div class="totals">
              <div class="total-row">
                <div>SUBTOTAL</div>
                <div>₹${subTotal.toFixed(2)}</div>
              </div>
              <div class="total-row">
                <div>DISCOUNT ${
                  discountType == "Percentage" ? "(%)" : "(₹)"
                }</div>
                <div>${discount}</div>
              </div>
              <div class="total-row">
                <div>TAX (${taxName} - ${taxRate}%)</div>
                <div>₹${((taxRate / 100) * subTotal).toFixed(2)}</div>
              </div>
              <div class="total-row">
                <div>SHIPPING</div>
                <div>₹${shippingAmount}</div>
              </div>
              <div class="total-row">
                <div>PARTIALLY PAID</div>
               <div>₹${
                 status === "Partially Paid" ? partiallyPaid.toFixed(2) : "0.00"
               }</div>
              </div>
              <div class="total-row grand-total">
                <div>BALANCE :</div>
                <div>₹${remainingBalance.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div class="terms-section">
            <div style="font-weight: 800;">Terms and Conditions:</div>
            <div>${terms}</div>
          </div>

          <div class="signature-section">
            ${
              signatureBase64
                ? `<img src="data:image/png;base64,${signatureBase64}" alt="Signature" style="max-width: 200px; height: auto;">`
                : ""
            }
            ${signatureName ? `<div>Signed by: ${signatureName}</div>` : ""}
          </div>
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({
      html: invoiceHTML,
      base64: false,
    });
    return uri;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};
