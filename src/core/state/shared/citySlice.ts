import { createGenericEntitySlice } from "@yusr_systems/ui";
import type { City } from "../../data/city";
import CitiesApiService from "../../networking/citiesApiService";

const citySlice = createGenericEntitySlice<City>("city", new CitiesApiService());

export const { setCurrentPage: setCurrentCitiesPage, refresh: refreshCities, filter: filterCities } = citySlice.actions;
export default citySlice.reducer;
