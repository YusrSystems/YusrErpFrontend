import { createSlice } from "@reduxjs/toolkit";
import type { DialogMode } from "@yusr_systems/ui";
import { InvoiceItem } from "../../../core/data/invoice";
import InvoiceItemsActions from "./invoiceItemsActions";
import ItemsMathActions from "./itemsMathActions";

export interface InvoiceState
{
  mode: DialogMode;
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
    resetItems: InvoiceItemsActions.resetItems,

    // items tax
    totalAfterDiscountChanges: ItemsMathActions.priceAfterTaxChanges
  }
});

export const { addItem, removeItem, changeQuantity, updateItem, resetItems, totalAfterDiscountChanges } =
  invoiceSliceUI.actions;
export default invoiceSliceUI.reducer;
