import { createSlice } from "@reduxjs/toolkit";
import type { DialogMode } from "@yusr_systems/ui";
import { InvoiceItem, InvoiceVoucher } from "../../../core/data/invoice";
import InvoiceItemsActions from "./invoiceItemsActions";
import InvoiceVouchersActions from "./invoiceVouchersActions";

export interface InvoiceState
{
  mode: DialogMode;
  items: InvoiceItem[];
  vouchers: InvoiceVoucher[];
  errors: Record<string, string>;
}

const initialState: InvoiceState = {
  items: [],
  vouchers: [],
  errors: {},
  mode: "create"
};

export const invoiceSliceUI = createSlice({
  name: "invoiceUI",
  initialState: initialState,
  reducers: {
    // items
    addItem: InvoiceItemsActions.addItem,
    removeItem: InvoiceItemsActions.removeItem,
    updateItem: InvoiceItemsActions.updateItem,
    resetItems: InvoiceItemsActions.resetItems,
    onInvoiceItemIupmChange: InvoiceItemsActions.onInvoiceItemIupmChange,
    onInvoiceItemQuantityChange: InvoiceItemsActions.onInvoiceItemQuantityChange,
    onInvoiceItemAfterTaxPriceChange: InvoiceItemsActions.onInvoiceItemAfterTaxPriceChange,
    onInvoiceItemDiscountChange: InvoiceItemsActions.onInvoiceItemDiscountChange,

    // vouchers
    addVoucher: InvoiceVouchersActions.addVoucher,
    removeVoucher: InvoiceVouchersActions.removeVoucher,
    updateVoucher: InvoiceVouchersActions.updateVoucher,
    resetVouchers: InvoiceVouchersActions.resetVouchers,
    resetPaymentVouchers: InvoiceVouchersActions.resetPaymentVouchers,
    resetCostVouchers: InvoiceVouchersActions.resetCostVouchers
  }
});

export const {
  addItem,
  removeItem,
  updateItem,
  resetItems,
  onInvoiceItemIupmChange,
  onInvoiceItemQuantityChange,
  onInvoiceItemAfterTaxPriceChange,
  onInvoiceItemDiscountChange,
  addVoucher,
  removeVoucher,
  updateVoucher,
  resetVouchers,
  resetPaymentVouchers,
  resetCostVouchers
} = invoiceSliceUI.actions;

export default invoiceSliceUI.reducer;
