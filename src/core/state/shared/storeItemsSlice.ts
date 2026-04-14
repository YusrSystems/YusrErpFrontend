import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { FilterResult } from "@yusr_systems/core";
import type { FilterByTypeRequest } from "../../data/filterByTypeRequest";
import type { StoreItem } from "../../data/item";
import ItemsApiService from "../../networking/itemApiService";

export interface FetchStoreItemsProps
{
  pageNumber: number;
  rowsPerPage: number;
  storeId: number;
  request: FilterByTypeRequest;
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
      storeItemsProps.storeId,
      storeItemsProps.request
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
