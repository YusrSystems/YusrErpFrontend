import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ItemsApiService from "../../networking/itemApiService";
import type { ItemType, StoreItem } from "../../data/item";
import type { FilterCondition } from "@yusr_systems/core";


export interface FetchStoreItemsProps{
        pageNumber: number,
        rowsPerPage: number,
        itemType: ItemType,
        storeId: number,
        condition?: FilterCondition
}
export const fetchStoreItems = createAsyncThunk("storeItems/fetch", async (
storeItemsProps: FetchStoreItemsProps
) =>
{
  const res = await new ItemsApiService().FilterStoreItems(
    storeItemsProps.pageNumber,
    storeItemsProps.rowsPerPage,
    storeItemsProps.itemType,
    storeItemsProps.storeId,
    storeItemsProps.condition
  );
  return res.data ?? [];
});


interface StoreItemsState
{
  storeItems: StoreItem[];
  isLoading: boolean;
}

const initialState: StoreItemsState = { storeItems: [], isLoading: false };

const storeItemsSlice = createSlice({
  name: "storeItems",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
  {
    builder.addCase(fetchStoreItems.pending, (state) =>
    {
      state.isLoading = true;
    });
    builder.addCase(fetchStoreItems.fulfilled, (state, action) =>
    {
      state.isLoading = false;
      state.storeItems = Array.isArray(action.payload) ? action.payload : [];
    });
    builder.addCase(fetchStoreItems.rejected, (state) =>
    {
      state.isLoading = false;
    });
  }
});

export default storeItemsSlice.reducer;
