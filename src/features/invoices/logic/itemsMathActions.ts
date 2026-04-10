import type { PayloadAction } from "@reduxjs/toolkit";
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
    // state.items[index].price = Number((priceAfterTax / dividedTaxes).toFixed(2));

    // TODO: implement this
  }
}
