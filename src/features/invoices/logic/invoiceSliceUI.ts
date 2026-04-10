import { createSlice } from "@reduxjs/toolkit";
import { InvoiceItem } from "../../../core/data/invoice";
import InvoiceItemsActions from "./invoiceItemsActions";

export interface InvoiceState
{
  mode: "create" | "update";
  items: InvoiceItem[];
  errors: Record<string, string>;
}

const initialState: InvoiceState = {
  items: [],
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
    resetItems: InvoiceItemsActions.resetItems
  }
});

export const { addItem, removeItem, changeQuantity, updateItem, resetItems } = invoiceSliceUI.actions;
export default invoiceSliceUI.reducer;
