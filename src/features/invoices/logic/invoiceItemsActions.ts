import type { PayloadAction } from "@reduxjs/toolkit";
import type { StoreItem } from "../../../core/data/item";
import type { InvoiceState } from "./invoiceSliceUI";

export default class InvoiceItemsActions
{
  public static removeItem(state: InvoiceState, action: PayloadAction<number>)
  {
    const index = action.payload;
    state.items.splice(index, 1);
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

  public static addItem(state: InvoiceState, action: PayloadAction<StoreItem>)
  {
    const storeItem = action.payload;
    const baseItem = storeItem.item;

    const existingItem = state.items.find((item) => item.itemId === baseItem.id);

    if (existingItem)
    {
      state.items = state.items.map((item) =>
        item.itemId === baseItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ); //  existingItem.totalPrice = (existingItem.quantity * existingItem.price) - (existingItem.discount || 0);

      return;
    }

    const defaultPricingMethod = storeItem.itemUnitPricingMethods?.find((p) => p.unitId === baseItem.sellUnitId)
      || storeItem.itemUnitPricingMethods?.[0];

    const price = defaultPricingMethod?.price || 0;
    const priceBeforeTax = storeItem.item.taxIncluded ? price * (storeItem.item.totalTaxes / 100) : price;
    state.items.push({
      id: 0,
      invoiceId: 0,
      itemId: baseItem.id!,
      itemName: baseItem.name,

      // Pricing Method Details
      itemUnitPricingMethodId: defaultPricingMethod?.id || 0,
      itemUnitPricingMethodName: defaultPricingMethod?.itemUnitPricingMethodName || "",
      itemUnitPricingMethods: storeItem.itemUnitPricingMethods || [],

      // Financials
      quantity: 1,
      cost: baseItem.cost || 0,
      price: priceBeforeTax,
      discount: 0,
      totalPrice: priceBeforeTax,

      // Taxes
      taxable: baseItem.taxable || false,
      totalTaxesPerc: baseItem.totalTaxes || 0,

      // Misc
      notes: baseItem.notes
    });
  }

  public static resetItems(state: InvoiceState)
  {
    state.items = [];
  }
}
