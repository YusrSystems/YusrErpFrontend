import { createGenericEntitySlice } from "@yusr_systems/ui";
import TaxesApiService from "../../../core/networking/taxesApiService";

const { reducer, actions } = createGenericEntitySlice("tax", new TaxesApiService());

export const { setCurrentPage: setCurrentTaxesPage, refresh: refreshTaxes, filter: filterTaxes } = actions;
export default reducer;
