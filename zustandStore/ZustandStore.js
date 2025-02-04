import { create } from "zustand";
import { saveEstimateToDb } from "../SqlSetup/db.jsx";

const useEstimateStore = create((set, get) => ({
  // **Estimate Data**
  estimateNumber: "",
  creationDate: new Date(),
  dueDate: new Date(new Date().setDate(new Date().getDate() + 7)), // Default: 7 days later
  businessName: "",
  clientEmail: "",
  items: [],
  subTotal: 0,
  discountType: "Percentage",
  discount: 0,
  taxName: "",
  taxRate: 0, // Use a decimal (e.g., 0.05 for 5%)
  shippingAmount: 0,
  totalAmount: 0,
  signatureName: "",
  signatureImage: null, // BLOB
  terms: "",
  paymentMethod: "",
  status: "Pending",

  // **Actions to update state**
  setEstimateNumber: (estimateNumber) => set({ estimateNumber }),
  setCreationDate: (creationDate) =>
    set({ creationDate: new Date(creationDate) }), // Ensure Date object
  setDueDate: (dueDate) => set({ dueDate: new Date(dueDate) }),
  setBusinessName: (businessName) => set({ businessName }),
  setClientEmail: (clientEmail) => set({ clientEmail }),

  setItems: (items) => {
    const subTotal = items.reduce((total, item) => total + item.finalAmount, 0); // Calculate subTotal
    set({ items, subTotal }); // Set new items and subTotal
    get().calculateTotalAmount(); // Call the total calculation after setting items
  },

  setSubTotal: (subTotal) => set({ subTotal }),
  setDiscountType: (discountType) => set({ discountType }),
  setDiscount: (discount) => {
    set({ discount });
    get().calculateTotalAmount(); // Recalculate total after setting discount
  },
  setTaxName: (taxName) => set({ taxName }),
  setTaxRate: (taxRate) => {
    set({ taxRate });
    get().calculateTotalAmount(); // Recalculate total after setting taxRate
  },
  setShippingAmount: (shippingAmount) => {
    set({ shippingAmount });
    get().calculateTotalAmount(); // Recalculate total after setting shippingAmount
  },
  setTotalAmount: (totalAmount) => set({ totalAmount }),
  setSignatureName: (signatureName) => set({ signatureName }),
  setSignatureImage: (signatureImage) => set({ signatureImage }),
  setTerms: (terms) => set({ terms }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setStatus: (status) => set({ status }),

  // **Calculate totalAmount**
  calculateTotalAmount: () => {
    const { subTotal, discountType, discount, taxRate, shippingAmount } = get(); // Get the current store state

    // Calculate discount
    let discountedAmount = subTotal;
    if (discountType === "Percentage" && discount > 0) {
      discountedAmount -= (discount / 100) * subTotal; // Percentage discount
    } else if (discount > 0) {
      discountedAmount -= discount; // Fixed amount discount
    }

    // Calculate tax
    const taxAmount = (taxRate / 100) * discountedAmount;

    // Calculate totalAmount (discountedAmount + tax + shipping)
    const totalAmount =
      discountedAmount + taxAmount + parseFloat(shippingAmount);

    // Update the state with totalAmount
    set({ totalAmount });
  },

  // **Save Estimate to SQLite**
  saveEstimate: () => {
    const state = get(); // Get the current store state
    saveEstimateToDb(state); // Save the state to SQLite
    console.log(state); // Log the state for debugging
  },
}));

export default useEstimateStore;
