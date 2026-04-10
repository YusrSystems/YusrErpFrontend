import type { PayloadAction } from "@reduxjs/toolkit";
import type { InvoiceState } from "./invoiceSliceUI";

export default class InvoiceItemsActions
{
  public static removeItem(state: InvoiceState, action: PayloadAction<number>)
  {
    const id = action.payload;
    state.items = state.items.filter((item) => item.id !== id);
    delete state.errors[id];
    delete state.errors[`${id}_method`];
  }

  public static changeQuantity(state: InvoiceState, action: PayloadAction<{ id: number; quantity: number; }>)
  {
    const { id, quantity } = action.payload;

    const item = state.items.find((item) => item.id === id);
    if (item)
    {
      item.quantity = quantity;
      delete state.errors[id];
    }
  }

  public static updateItem(state: InvoiceState, action: PayloadAction<InvoiceState["items"][0]>)
  {
    const item = action.payload;
    state.items = state.items.map((i) => (i.id === item.id ? item : i));
  }
}
