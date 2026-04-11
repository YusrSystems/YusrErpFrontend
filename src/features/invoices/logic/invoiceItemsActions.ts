import type { PayloadAction } from "@reduxjs/toolkit";
import type { StoreItem } from "../../../core/data/item";
import InvoiceItemsMath from "./invoiceItemsMath";
import type { InvoiceState } from "./invoiceSliceUI";

export default class InvoiceItemsActions
{
  public static removeItem(state: InvoiceState, action: PayloadAction<number>)
  {
    const index = action.payload;
    state.items.splice(index, 1);
  }

  public static updateItem(
    state: InvoiceState,
    action: PayloadAction<{ index: number; item: InvoiceState["items"][0]; }>
  )
  {
    const item = action.payload.item;
    state.items[action.payload.index] = item;
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
      );

      return;
    }

    const defaultPricingMethod = storeItem.itemUnitPricingMethods?.find((p) => p.unitId === baseItem.sellUnitId)
      || storeItem.itemUnitPricingMethods?.[0];

    const priceBeforeTax = InvoiceItemsMath.GetPriceBeforeTax(
      baseItem.taxIncluded,
      defaultPricingMethod?.price || 0,
      baseItem.totalTaxes || 0
    );
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
      priceAfterTax: InvoiceItemsMath.CalcPriceAfterTax(priceBeforeTax, baseItem.totalTaxes || 0),
      discount: 0,
      totalPrice: priceBeforeTax,

      // Taxes
      taxable: baseItem.taxable || false,
      taxIncluded: baseItem.taxIncluded || false,
      totalTaxesPerc: baseItem.totalTaxes || 0,

      // Misc
      notes: baseItem.description
    });
  }

  public static onInvoiceItemIupmChange(
    state: InvoiceState,
    action: PayloadAction<{ index: number; iupmId: number; }>
  )
  {
    const { index, iupmId } = action.payload;
    let row = state.items[index];
    const selectedMethod = row.itemUnitPricingMethods?.find((p) => p.id === iupmId);
    row.itemUnitPricingMethodId = iupmId;
    row.itemUnitPricingMethodName = selectedMethod?.itemUnitPricingMethodName || "";
    row.price = InvoiceItemsMath.GetPriceBeforeTax(
      row.taxIncluded,
      selectedMethod?.price || 0,
      row.totalTaxesPerc || 0
    );
    row.priceAfterTax = InvoiceItemsMath.CalcPriceAfterTax(row.price, row.totalTaxesPerc);

    InvoiceItemsActions.updateItem(state, { payload: { index, item: row }, type: "updateItem" });
  }

  public static onInvoiceItemQuantityChange(
    state: InvoiceState,
    action: PayloadAction<{ index: number; newQtn: number | undefined; }>
  )
  {
    if (action.payload.newQtn == undefined)
    {
      return;
    }
    const { index, newQtn } = action.payload;
    let row = state.items[index];
    row.quantity = newQtn!;
    row.totalPrice = InvoiceItemsMath.CalcTotalPriceBeforeTax(row.price, row.discount, newQtn!, row.totalTaxesPerc);
    InvoiceItemsActions.updateItem(state, { payload: { index, item: row }, type: "updateItem" });
  }

  public static onInvoiceItemDiscountChange(
    state: InvoiceState,
    action: PayloadAction<{ index: number; newDiscount: number | undefined; }>
  )
  {
    if (action.payload.newDiscount == undefined)
    {
      return;
    }
    const { index, newDiscount } = action.payload;
    let row = state.items[index];
    row.discount = newDiscount!;
    InvoiceItemsActions.updateItem(state, { payload: { index, item: row }, type: "updateItem" });
  }

  public static onInvoiceItemAfterTaxPriceChange(
    state: InvoiceState,
    action: PayloadAction<{ index: number; newPrice: number | undefined; }>
  )
  {
    if (action.payload.newPrice == undefined)
    {
      return;
    }
    const { index, newPrice } = action.payload;
    let row = state.items[index];
    row.priceAfterTax = newPrice!;
    row.price = InvoiceItemsMath.CalcPriceBeforeTax(newPrice!, row.totalTaxesPerc);
    row.totalPrice = InvoiceItemsMath.CalcTotalPriceBeforeTax(
      row.price,
      row.discount,
      row.quantity,
      row.totalTaxesPerc
    );
    InvoiceItemsActions.updateItem(state, { payload: { index, item: row }, type: "updateItem" });
  }

  public static onInvoiceAddedAmountChange(state: InvoiceState, action: PayloadAction<number>)
  {
    const discountAmount = action.payload;
    state.items.forEach((item) => {
      item
    });
  }

  public static onInvoiceDiscountAmountChange(state: InvoiceState, action: PayloadAction<number>)
  {
  }

  public static onInvoiceAddedPercentChange(state: InvoiceState, action: PayloadAction<number>)
  {
  }

  public static onInvoiceDiscountPercentChange(state: InvoiceState, action: PayloadAction<number>)
  {
  }

  public static resetItems(state: InvoiceState)
  {
    state.items = [];
  }
}
