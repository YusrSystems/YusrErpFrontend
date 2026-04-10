import type { PayloadAction } from "@reduxjs/toolkit";
import type { InvoiceState } from "./invoiceSliceUI";
import type { RootState } from "../../../core/state/store";

export default class ItemsMathActions
{
  public static priceAfterTaxChanges(
    state: InvoiceState,
    action: PayloadAction<{ index: number; priceAfterTax: number; }>
  )
  {
    const { index, priceAfterTax } = action.payload;

    const taxes = state.items[index].totalTaxesPerc;
    const dividedTaxes = (100 + taxes) / 100;
    // state.items[index].price = Number((priceAfterTax / dividedTaxes).toFixed(2));

    // TODO: implement this
  }
}

export const selectInvoiceTotalPrice = (state: RootState) =>
  state.invoiceUI.items?.reduce((sum, i) => sum + (i.totalPrice ?? 0), 0) ?? 0;

export const selectInvoicePaidPrice = (state: RootState) =>
  state.invoiceUI.vouchers?.reduce((sum, i) => sum + (i.amount ?? 0), 0) ?? 0;

export const selectInvoiceUnpaidPrice = (state: RootState) =>
  selectInvoiceTotalPrice(state) - selectInvoicePaidPrice(state);