import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BarcodeResult } from "../../data/item";
import ItemsApiService from "../../networking/itemApiService";

export interface GetItemByBarcodeProps
{
  barcode: string;
  storeId: number;
}

export const GetItemByBarcode = createAsyncThunk("itemBarcode/GetItemByBarcode", async (
  getItemByBarcodeProps: GetItemByBarcodeProps
) =>
{
  const res = await new ItemsApiService().GetByBarcode(
    getItemByBarcodeProps.barcode,
    getItemByBarcodeProps.storeId
  );
  return res.data;
});

interface ItemBarcodeState
{
  barcodeResult?: BarcodeResult;
  isLoading: boolean;
}

const initialState: ItemBarcodeState = {
  barcodeResult: undefined,
  isLoading: false
};
const itemBarcodeSlice = createSlice({
  name: "itemBarcode",
  initialState,
  reducers: {
    clearBarcodeResult: (state) =>
    {
      state.barcodeResult = undefined;
    }
  },
  extraReducers: (builder) =>
  {
    builder.addCase(GetItemByBarcode.pending, (state) =>
    {
      state.isLoading = true;
    });
    builder.addCase(GetItemByBarcode.fulfilled, (state, action) =>
    {
      state.isLoading = false;
      state.barcodeResult = action.payload ?? undefined;
    });
    builder.addCase(GetItemByBarcode.rejected, (state) =>
    {
      state.isLoading = false;
    });
  }
});

export default itemBarcodeSlice.reducer;

export const { clearBarcodeResult } = itemBarcodeSlice.actions;
