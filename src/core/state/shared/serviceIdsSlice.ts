import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ServiceIds from "../../data/serviceIds";
import UnitsApiService from "../../networking/unitApiService";

export const fetchServiceIds = createAsyncThunk("serviceIds/fetchServiceIds", async () =>
{
  const res = await new UnitsApiService().GetServiceIds();
  return res.data;
});

interface ServiceIdsState
{
  serviceIds?: ServiceIds;
  isLoading: boolean;
}

const initialState: ServiceIdsState = { serviceIds: undefined, isLoading: false };

const systemSlice = createSlice({
  name: "serviceIds",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
  {
    builder.addCase(fetchServiceIds.pending, (state) =>
    {
      state.isLoading = true;
    });
    builder.addCase(fetchServiceIds.fulfilled, (state, action) =>
    {
      state.isLoading = false;
      state.serviceIds = action.payload;
    });
    builder.addCase(fetchServiceIds.rejected, (state) =>
    {
      state.isLoading = false;
    });
  }
});

export default systemSlice.reducer;
