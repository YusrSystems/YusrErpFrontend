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
    changeQuantity: InvoiceItemsActions.changeQuantity,
    updateItem: InvoiceItemsActions.updateItem,
    resetItems: InvoiceItemsActions.resetItems,

    // vouchers
    addVoucher: InvoiceVouchersActions.addVoucher,
    removeVoucher: InvoiceVouchersActions.removeVoucher,
    updateVoucher: InvoiceVouchersActions.updateVoucher,
    resetVouchers: InvoiceVouchersActions.resetVouchers,

    // items tax
    totalAfterDiscountChanges: ItemsMathActions.priceAfterTaxChanges
  }
});

export const {
  addItem,
  removeItem,
  changeQuantity,
  updateItem,
  resetItems,
  addVoucher,
  removeVoucher,
  updateVoucher,
  resetVouchers,
  totalAfterDiscountChanges
} = invoiceSliceUI.actions;

export default invoiceSliceUI.reducer;
