import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ItemUnitPricingMethod, StoreItem } from "../../../core/data/item";
import type { ItemTransfersItem } from "../../../core/data/itemTransfer";

export interface TransferRowItem
{
  id: string;
  itemId: number;
  itemName: string;
  itemUnitPricingMethods: ItemUnitPricingMethod[];
  selectedPricingMethodId: number;
  quantity: number;
  maxQuantity: number;
}

interface ItemTransferState
{
  items: TransferRowItem[];
  errors: Record<string, string>;
}

const initialState: ItemTransferState = {
  items: [],
  errors: {}
};

export const itemTransferSlice = createSlice({
  name: "itemTransferUI",
  initialState,
  reducers: {
    initializeItems: (state, action: PayloadAction<ItemTransfersItem[]>) =>
    {
      state.items = action.payload.map((item) => ({
        id: item.id.toString(),
        itemId: item.itemId,
        itemName: item.itemName,
        itemUnitPricingMethods: item.itemUnitPricingMethods || [],
        selectedPricingMethodId: item.itemUnitPricingMethodId || 0,
        quantity: item.quantity || 1,
        maxQuantity: 0
      }));
      state.errors = {};
    },
    addItem: (
      state,
      action: PayloadAction<{ storeItem: StoreItem; selectedIupm?: ItemUnitPricingMethod; }>
    ) =>
    {
      const { storeItem, selectedIupm } = action.payload;
      const defaultMethod = selectedIupm || storeItem.itemUnitPricingMethods?.[0];
      const methodId = defaultMethod?.id || 0;

      const existingItem = state.items.find(
        (i) => Number(i.itemId) === Number(storeItem.item.id) && Number(i.selectedPricingMethodId) === Number(methodId)
      );

      if (existingItem)
      {
        existingItem.quantity += 1;
      }
      else
      {
        state.items.push({
          id: Math.random().toString(36).substring(2, 9),
          itemId: storeItem.item.id,
          itemName: storeItem.item.name,
          itemUnitPricingMethods: storeItem.itemUnitPricingMethods || [],
          selectedPricingMethodId: methodId,
          quantity: 1,
          maxQuantity: storeItem.storeQuantity || 0
        });
      }

      delete state.errors["general"];
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number; }>) =>
    {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item)
      {
        item.quantity = action.payload.quantity;
        delete state.errors[item.id];
      }
    },
    updatePricingMethod: (state, action: PayloadAction<{ id: string; methodId: number; }>) =>
    {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item)
      {
        item.selectedPricingMethodId = action.payload.methodId;
        delete state.errors[`${item.id}_method`];
      }
    },
    removeItem: (state, action: PayloadAction<string>) =>
    {
      state.items = state.items.filter((i) => i.id !== action.payload);
      delete state.errors[action.payload];
      delete state.errors[`${action.payload}_method`];
    },
    setErrors: (state, action: PayloadAction<Record<string, string>>) =>
    {
      state.errors = action.payload;
    },
    clearTransfer: (state) =>
    {
      state.items = [];
      state.errors = {};
    }
  }
});

export const itemTransferReducer = itemTransferSlice.reducer;
export const {
  initializeItems,
  addItem,
  updateQuantity,
  updatePricingMethod,
  removeItem,
  setErrors,
  clearTransfer
} = itemTransferSlice.actions;
