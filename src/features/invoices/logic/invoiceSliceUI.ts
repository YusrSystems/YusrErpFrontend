import { createSlice } from "@reduxjs/toolkit";
import type { DialogMode } from "@yusr_systems/ui";
import { InvoiceItem, InvoiceVoucher } from "../../../core/data/invoice";
import InvoiceItemsActions from "./invoiceItemsActions";
import InvoiceVouchersActions from "./invoiceVouchersActions";
import ItemsMathActions from "./itemsMathActions";

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

    // vouchers
    addVoucher: InvoiceVouchersActions.addVoucher,
    removeVoucher: InvoiceVouchersActions.removeVoucher,
    updateVoucher: InvoiceVouchersActions.updateVoucher,
    resetVouchers: InvoiceVouchersActions.resetVouchers,
    resetPaymentVouchers: InvoiceVouchersActions.resetPaymentVouchers,
    resetCostVouchers: InvoiceVouchersActions.resetCostVouchers,

    // items tax
    priceAfterTaxChanges: ItemsMathActions.priceAfterTaxChanges,
    priceChanges: ItemsMathActions.priceChanges,
    discountChanges: ItemsMathActions.discountChanges
  }
});

export const {
  addItem,
  removeItem,
  updateItem,
  resetItems,
  addVoucher,
  removeVoucher,
  updateVoucher,
  resetVouchers,
  resetPaymentVouchers,
  resetCostVouchers,
  priceAfterTaxChanges,
  priceChanges,
  discountChanges
} = invoiceSliceUI.actions;

export default invoiceSliceUI.reducer;
