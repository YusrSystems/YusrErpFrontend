import { CitiesApiService, City } from "@yusr_systems/core";
import { createGenericEntitySlice } from "@yusr_systems/ui";

const citySlice = createGenericEntitySlice<City>("city", new CitiesApiService());

export const { setCurrentPage: setCurrentCitiesPage, refresh: refreshCities, filter: filterCities } = citySlice.actions;
export default citySlice.reducer;
