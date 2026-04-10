import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../../core/state/store";
import type { InvoiceState } from "./invoiceSliceUI";

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

    console.log();

    state.items[index].price = Number((priceAfterTax / dividedTaxes).toFixed(2));
    state.items[index].priceAtferTax = priceAfterTax;
  }

  public static priceChanges(state: InvoiceState, action: PayloadAction<{ index: number; price: number; }>)
  {
    const { index, price } = action.payload;
    state.items[index].price = price;
    state.items[index].priceAtferTax = price * (100 + state.items[index].totalTaxesPerc) / 100;
  }
  public static recalculatePrices(state: InvoiceState, action: PayloadAction<{ index: number; }>)
  {
    // const index = action.payload.index;
    // state.items[index].price = state.items[index].quantity * state.items[index].cost;
    // state.items[index].priceAtferTax = state.items[index].price * (100 + state.items[index].totalTaxesPerc) / 100;
  }

  public static discountChanges(state: InvoiceState, action: PayloadAction<{ index: number; discount: number; }>)
  {
    const { index, discount } = action.payload;
    state.items[index].discount = discount;
  }
}

export const selectInvoiceTotalPrice = (state: RootState) =>
  state.invoiceUI.items?.reduce((sum, i) => sum + (i.totalPrice ?? 0), 0) ?? 0;

export const selectInvoicePaidPrice = (state: RootState) =>
  state.invoiceUI.vouchers?.reduce((sum, i) => sum + (i.amount ?? 0), 0) ?? 0;

export const selectInvoiceUnpaidPrice = (state: RootState) =>
  selectInvoiceTotalPrice(state) - selectInvoicePaidPrice(state);
