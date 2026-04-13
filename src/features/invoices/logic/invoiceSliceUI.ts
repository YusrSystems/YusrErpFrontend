import { createSlice } from "@reduxjs/toolkit";
import type { DialogMode } from "@yusr_systems/ui";
import { InvoiceItem, InvoiceType, InvoiceVoucher } from "../../../core/data/invoice";
import InvoiceItemsActions from "./invoiceItemsActions";
import InvoiceVouchersActions from "./invoiceVouchersActions";

export interface InvoiceSettlments
{
  amount: number;
  percent: number;
}

export interface InvoiceState
{
  mode: DialogMode;
  items: InvoiceItem[];
  vouchers: InvoiceVoucher[];
  errors: Record<string, string>;
  type: InvoiceType;
  settlements: InvoiceSettlments;
}

const initialState: InvoiceState = {
  items: [],
  vouchers: [],
  errors: {},
  mode: "create",
  type: InvoiceType.Sell,
  settlements: { amount: 0, percent: 0 }
};

export const invoiceSliceUI = createSlice({
  name: "invoiceUI",
  initialState: initialState,
  reducers: {
    // invoice
    setInvoiceType: InvoiceItemsActions.setInvoiceType,

    // items
    addItem: InvoiceItemsActions.addItem,
    removeItem: InvoiceItemsActions.removeItem,
    updateItem: InvoiceItemsActions.updateItem,
    resetItems: InvoiceItemsActions.resetItems,
    initItems: InvoiceItemsActions.initItems,
    onInvoiceItemIupmChange: InvoiceItemsActions.onInvoiceItemIupmChange,
    onInvoiceItemQuantityChange: InvoiceItemsActions.onInvoiceItemQuantityChange,
    onInvoiceItemTaxInclusivePriceChange: InvoiceItemsActions.onInvoiceItemTaxInclusivePriceChange,
    onInvoiceItemSettlementChange: InvoiceItemsActions.onInvoiceItemSettlementChange,
    onInvoiceSettlementAmountChange: InvoiceItemsActions.onInvoiceSettlementAmountChange,
    onInvoiceSettlementPercentChange: InvoiceItemsActions.onInvoiceSettlementPercentChange,

    // vouchers
    addVoucher: InvoiceVouchersActions.addVoucher,
    removeVoucher: InvoiceVouchersActions.removeVoucher,
    updateVoucher: InvoiceVouchersActions.updateVoucher,
    resetVouchers: InvoiceVouchersActions.resetVouchers,
    initVouchers: InvoiceVouchersActions.initVouchers,
    resetPaymentVouchers: InvoiceVouchersActions.resetPaymentVouchers,
    resetCostVouchers: InvoiceVouchersActions.resetCostVouchers
  },
  extraReducers: (builder) =>
  {
    builder.addCase(InvoiceItemsActions.fetchInvoiceAsync.fulfilled, (state, action) =>
    {
      state = action.payload;
    });
  }
});

export const {
  // invoice
  setInvoiceType,

  // items
  addItem,
  removeItem,
  updateItem,
  resetItems,
  initItems,
  onInvoiceItemIupmChange,
  onInvoiceItemQuantityChange,
  onInvoiceItemTaxInclusivePriceChange,
  onInvoiceItemSettlementChange,
  onInvoiceSettlementAmountChange,
  onInvoiceSettlementPercentChange,

  // vouchers
  addVoucher,
  removeVoucher,
  updateVoucher,
  resetVouchers,
  initVouchers,
  resetPaymentVouchers,
  resetCostVouchers
} = invoiceSliceUI.actions;

export default invoiceSliceUI.reducer;
