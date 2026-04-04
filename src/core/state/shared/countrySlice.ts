import { Country, CountriesApiService } from "@yusr_systems/core";
import { createGenericEntitySlice } from "@yusr_systems/ui";

const countrySlice = createGenericEntitySlice<Country>("country", new CountriesApiService());

export const { setCurrentPage: setCurrentCountriesPage, refresh: refreshCountries, filter: filterCountries } =
  countrySlice.actions;
export default countrySlice.reducer;
