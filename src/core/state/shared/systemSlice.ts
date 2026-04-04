import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import SystemApiService from "../../networking/systemApiService";

export const fetchSystemPermissions = createAsyncThunk("system/fetchPermissions", async () =>
{
  const res = await new SystemApiService().GetSystemPermissions();
  return res.data ?? [];
});

interface SystemState
{
  permissions: string[];
  isLoading: boolean;
}

const initialState: SystemState = { permissions: [], isLoading: false };

const systemSlice = createSlice({
  name: "system",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
  {
    builder.addCase(fetchSystemPermissions.pending, (state) =>
    {
      state.isLoading = true;
    });
    builder.addCase(fetchSystemPermissions.fulfilled, (state, action) =>
    {
      state.isLoading = false;
      state.permissions = action.payload;
    });
    builder.addCase(fetchSystemPermissions.rejected, (state) =>
    {
      state.isLoading = false;
    });
  }
});

export default systemSlice.reducer;
