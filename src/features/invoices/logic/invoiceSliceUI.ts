import { createSlice } from "@reduxjs/toolkit";
import { InvoiceItem } from "../../../core/data/invoice";
import InvoiceItemsActions from "./invoiceItemsActions";
import { mockInvoiceItems } from "./mockdata";

export interface InvoiceState
{
  mode: "create" | "update";
  items: InvoiceItem[];
  errors: Record<string, string>;
}

const initialState: InvoiceState = {
  items: mockInvoiceItems,
  errors: {},
  mode: "create"
};

export const invoiceSliceUI = createSlice({
  name: "invoiceUI",
  initialState: initialState,
  reducers: {
    addItem: (state, action) =>
    {
      state.items.push(action.payload);
    },

    removeItem: InvoiceItemsActions.removeItem,
    changeQuantity: InvoiceItemsActions.changeQuantity,
    updateItem: InvoiceItemsActions.updateItem
  }
});

export const { addItem, removeItem, changeQuantity, updateItem } = invoiceSliceUI.actions;
export default invoiceSliceUI.reducer;
