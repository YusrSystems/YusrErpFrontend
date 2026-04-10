import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type DashboardData from "../../../core/data/dashboardData";
import DashboardApiService from "../../../core/networking/dashboardApiService";

export interface DashboardState
{
  data: DashboardData | undefined;
}
const initialDashboardState = {
  data: undefined
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: initialDashboardState,
  reducers: {},
  extraReducers: (builder) =>
  {
    builder.addCase(fetchDashboardData.fulfilled, (state: DashboardState, action) =>
    {
      state.data = action.payload;
    });
  }
});

export const fetchDashboardData = createAsyncThunk("dashboard/fetchDashboardData", async () =>
{
  const res = await new DashboardApiService().get();

  return res.data;
});

export default dashboardSlice.reducer;
