import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Currency } from "@yusr_systems/core";
import type Registration from "../../../core/data/registration";
import RegisterApiService from "../../../core/networking/registerApiService";

interface RegisterState
{
  formData: Partial<Registration>;
  currentStep: number;
  loading: boolean;
  errors: Partial<Record<keyof Registration, string>>;
  currencies?: Currency[];
}

const initialState: RegisterState = {
  formData: {},
  currentStep: 0,
  loading: false,
  errors: {},
  currencies: []
};

export const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    updateField(state, action: PayloadAction<Partial<Registration>>)
    {
      state.formData = { ...state.formData, ...action.payload };
    },
    nextStep(state)
    {
      state.currentStep += 1;
    },
    prevStep(state)
    {
      state.currentStep -= 1;
    },
    setErrors(state, action: PayloadAction<Partial<Record<keyof Registration, string>>>)
    {
      state.errors = action.payload;
    },
    resetForm(state)
    {
      state.formData = {};
      state.currentStep = 0;
      state.errors = {};
    }
  },
  extraReducers: (builder) =>
  {
    builder
      .addCase(registerAsync.pending, (state) =>
      {
        state.loading = true;
      })
      .addCase(registerAsync.fulfilled, (state, action) =>
      {
        state.loading = false;
        state.formData = action.payload ?? {};
      })
      .addCase(registerAsync.rejected, (state) =>
      {
        state.loading = false;
      });

    builder.addCase(fetchCurrenciesAsync.fulfilled, (state, action) =>
    {
      state.currencies = action.payload;
    });
    builder.addCase(fetchCurrenciesAsync.rejected, (state) =>
    {
      state.currencies = [];
    });
    builder.addCase(fetchCurrenciesAsync.pending, (state) =>
    {
      state.currencies = [];
    });
  }
});

export const registerAsync = createAsyncThunk(
  "register/register",
  async (data: Registration) =>
  {
    const res = await new RegisterApiService().register(data);
    console.log(res);

    return res.data ?? null;
  }
);
export const fetchCurrenciesAsync = createAsyncThunk("register/fetchCurrencies", async () =>
{
  // sample idle time
  await new Promise((resolve) => setTimeout(resolve, 400));
  // mock currencies
  const res: Currency[] = [
    new Currency({ id: 1, code: "SAR", name: "Saudi Riyal" }),
    new Currency({ id: 2, code: "USD", name: "US Dollar" }),
    new Currency({ id: 3, code: "EUR", name: "Euro" })
  ];

  return res;
});

export const { updateField, nextStep, prevStep, setErrors, resetForm } = registerSlice.actions;
export default registerSlice.reducer;
