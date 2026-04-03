import { createGenericEntitySlice } from "@yusr_systems/ui";
import type { Currency } from "../../data/currency";
import CurrenciesApiService from "../../networking/currenciesApiService";

const citySlice = createGenericEntitySlice<Currency>("currency", new CurrenciesApiService());

export const { setCurrentPage: setCurrentCurrenciesPage, refresh: refreshCurrencies, filter: filterCurrencies } =
  citySlice.actions;
export default citySlice.reducer;
