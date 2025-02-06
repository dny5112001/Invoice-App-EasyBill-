import { create } from "zustand";

const useInvoiceStore = create((set, get) => ({
  // **Invoice Data**
  invoiceNumber: "",
  creationDate: new Date(),
  dueDate: new Date(new Date().setDate(new Date().getDate() + 7)), // Default: 7 days later
  businessName: "",
  clientEmail: "",
  items: [],
  subTotal: 0,
  discountType: "Percentage",
  discount: 0,
  taxName: "",
  taxRate: "0", // Stored as string in DB
  shippingAmount: 0,
  totalAmount: 0,
  signatureName: "",
  signatureImage: null, // BLOB
  terms: "",
  paymentMethod: "",
  status: "Unpaid",
  partiallyPaid: 0, // Stored as REAL

  // **Actions to update state**
  setInvoiceNumber: (invoiceNumber) => set({ invoiceNumber }),
  setCreationDate: (creationDate) =>
    set({ creationDate: new Date(creationDate) }), // Ensure Date object
  setDueDate: (dueDate) => set({ dueDate: new Date(dueDate) }),
  setBusinessName: (businessName) => set({ businessName }),
  setClientEmail: (clientEmail) => set({ clientEmail }),

  setItems: (updatedItems) => {
    set((state) => {
      const subTotal = updatedItems.reduce(
        (total, item) => total + item.finalAmount,
        0
      );
      return { items: updatedItems, subTotal };
    });
    setTimeout(() => get().calculateTotalAmount(), 0);
  },

  setSubTotal: (subTotal) => set({ subTotal }),
  setDiscountType: (discountType) => set({ discountType }),
  setDiscount: (discount) => {
    set({ discount });
    get().calculateTotalAmount();
  },
  setTaxName: (taxName) => set({ taxName }),
  setTaxRate: (taxRate) => {
    set({ taxRate: taxRate.toString() }); // Store as string
    get().calculateTotalAmount();
  },
  setShippingAmount: (shippingAmount) => {
    set({ shippingAmount });
    get().calculateTotalAmount();
  },
  setTotalAmount: (totalAmount) => set({ totalAmount }),
  setSignatureName: (signatureName) => set({ signatureName }),
  setSignatureImage: (signatureImage) => set({ signatureImage }),
  setTerms: (terms) => set({ terms }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setStatus: (status) => set({ status }),
  setPartiallyPaid: (partiallyPaid) => set({ partiallyPaid }),

  // **Calculate totalAmount**
  calculateTotalAmount: () => {
    const { subTotal, discountType, discount, taxRate, shippingAmount } = get();

    let discountedAmount = subTotal;
    if (discountType === "Percentage" && discount > 0) {
      discountedAmount -= (discount / 100) * subTotal;
    } else if (discount > 0) {
      discountedAmount -= discount;
    }

    const taxAmount = (parseFloat(taxRate) / 100) * discountedAmount;
    const totalAmount =
      discountedAmount + taxAmount + parseFloat(shippingAmount);

    set({ totalAmount });
  },
}));

export default useInvoiceStore;
