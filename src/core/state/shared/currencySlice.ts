import { Currency, CurrenciesApiService } from "@yusr_systems/core";
import { createGenericEntitySlice } from "@yusr_systems/ui";

const citySlice = createGenericEntitySlice<Currency>("currency", new CurrenciesApiService());

export const { setCurrentPage: setCurrentCurrenciesPage, refresh: refreshCurrencies, filter: filterCurrencies } =
  citySlice.actions;
export default citySlice.reducer;
