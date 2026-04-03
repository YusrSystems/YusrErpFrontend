import { createGenericEntitySlice } from "@yusr_systems/ui";
import type { Country } from "../../data/country";
import CountriesApiService from "../../networking/countriesApiService";

const countrySlice = createGenericEntitySlice<Country>("country", new CountriesApiService());

export const { setCurrentPage: setCurrentCountriesPage, refresh: refreshCountries, filter: filterCountries } =
  countrySlice.actions;
export default countrySlice.reducer;
