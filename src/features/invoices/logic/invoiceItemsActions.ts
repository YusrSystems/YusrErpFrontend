import type { PayloadAction } from "@reduxjs/toolkit";
import type { InvoiceType } from "../../../core/data/invoice";
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

    const taxExclusivePrice = InvoiceItemsMath.GetTaxExclusivePrice(
      baseItem.taxIncluded,
      defaultPricingMethod?.price || 0,
      baseItem.totalTaxes || 0
    );
    const taxInclusivePrice = InvoiceItemsMath.CalcTaxInclusivePrice(taxExclusivePrice, baseItem.totalTaxes || 0);

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
      originalQuantity: storeItem.storeQuantity || 0,
      cost: baseItem.cost || 0,
      taxExclusivePrice: taxExclusivePrice,
      taxInclusivePrice: taxInclusivePrice,
      originaltaxInclusivePrice: taxInclusivePrice,
      settlement: state.settlements.amount || 0,
      taxExclusiveTotalPrice: taxExclusivePrice,
      taxInclusiveTotalPrice: taxInclusivePrice,

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
    row.taxExclusivePrice = InvoiceItemsMath.GetTaxExclusivePrice(
      row.taxIncluded,
      selectedMethod?.price || 0,
      row.totalTaxesPerc || 0
    );
    row.taxInclusivePrice = InvoiceItemsMath.CalcTaxInclusivePrice(row.taxExclusivePrice, row.totalTaxesPerc);
    row.taxExclusiveTotalPrice = InvoiceItemsMath.CalcTaxExclusiveTotalPrice(
      row.taxExclusivePrice,
      row.settlement,
      row.quantity,
      row.totalTaxesPerc
    );
    row.taxInclusiveTotalPrice = InvoiceItemsMath.CalcTaxInclusiveTotalPrice(
      row.taxInclusivePrice,
      row.settlement,
      row.quantity
    );

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
    row.taxExclusiveTotalPrice = InvoiceItemsMath.CalcTaxExclusiveTotalPrice(
      row.taxExclusivePrice,
      row.settlement,
      row.quantity,
      row.totalTaxesPerc
    );
    row.taxInclusiveTotalPrice = InvoiceItemsMath.CalcTaxInclusiveTotalPrice(
      row.taxInclusivePrice,
      row.settlement,
      row.quantity
    );

    InvoiceItemsActions.updateItem(state, { payload: { index, item: row }, type: "updateItem" });
  }

  public static onInvoiceItemSettlementChange(
    state: InvoiceState,
    action: PayloadAction<{ index: number; newSettlement: number | undefined; }>
  )
  {
    if (action.payload.newSettlement == undefined)
    {
      return;
    }
    const { index, newSettlement } = action.payload;
    let row = state.items[index];
    row.settlement = newSettlement || 0;
    row.taxExclusiveTotalPrice = InvoiceItemsMath.CalcTaxExclusiveTotalPrice(
      row.taxExclusivePrice,
      row.settlement,
      row.quantity,
      row.totalTaxesPerc
    );
    row.taxInclusiveTotalPrice = InvoiceItemsMath.CalcTaxInclusiveTotalPrice(
      row.taxInclusivePrice,
      row.settlement,
      row.quantity
    );
    InvoiceItemsActions.updateItem(state, { payload: { index, item: row }, type: "updateItem" });
  }

  public static onInvoiceItemTaxInclusivePriceChange(
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
    row.taxInclusivePrice = newPrice!;
    row.taxExclusivePrice = InvoiceItemsMath.CalcTaxExclusivePrice(newPrice!, row.totalTaxesPerc);
    row.taxExclusiveTotalPrice = InvoiceItemsMath.CalcTaxExclusiveTotalPrice(
      row.taxExclusivePrice,
      row.settlement,
      row.quantity,
      row.totalTaxesPerc
    );
    row.taxInclusiveTotalPrice = InvoiceItemsMath.CalcTaxInclusiveTotalPrice(
      row.taxInclusivePrice,
      row.settlement,
      row.quantity
    );
    InvoiceItemsActions.updateItem(state, { payload: { index, item: row }, type: "updateItem" });
  }

  public static resetItems(state: InvoiceState)
  {
    state.items = [];
  }

  public static onInvoiceSettlementAmountChange(state: InvoiceState, action: PayloadAction<number>)
  {
    state.settlements.amount = action.payload || 0;
    state.items.forEach((_, i) =>
      InvoiceItemsActions.onInvoiceItemSettlementChange(state, {
        payload: { index: i, newSettlement: state.settlements.amount },
        type: "onInvoiceItemSettlementChange"
      })
    );
  }

  public static onInvoiceSettlementPercentChange(state: InvoiceState, action: PayloadAction<number>)
  {
    state.settlements.percent = action.payload || 0;
    state.items.forEach((item, i) =>
    {
      const newSettlement = Number((item.taxInclusivePrice * (state.settlements.percent / 100)).toFixed(2));

      InvoiceItemsActions.onInvoiceItemSettlementChange(state, {
        payload: { index: i, newSettlement: newSettlement },
        type: "onInvoiceItemSettlementChange"
      });
    });
  }

  public static setInvoiceType(state: InvoiceState, action: PayloadAction<InvoiceType>)
  {
    state.type = action.payload;
  }
}
