import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { FilterCondition, FilterResult } from "@yusr_systems/core";
import type { ItemType, StoreItem } from "../../data/item";
import ItemsApiService from "../../networking/itemApiService";

export interface FetchStoreItemsProps
{
  pageNumber: number;
  rowsPerPage: number;
  itemType: ItemType;
  storeId: number;
  condition?: FilterCondition;
}
export const fetchStoreItems = createAsyncThunk<FilterResult<StoreItem>, FetchStoreItemsProps>(
  "storeItems/fetch",
  async (
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
    return res.data ?? { data: [], count: 0 };
  }
);

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
      state.storeItems = action.payload.data ?? [];
    });
    builder.addCase(fetchStoreItems.rejected, (state) =>
    {
      state.isLoading = false;
    });
  }
});

export default storeItemsSlice.reducer;
