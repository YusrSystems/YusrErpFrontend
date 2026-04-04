import { createGenericEntitySlice } from "@yusr_systems/ui";
import StoresApiService from "../../../core/networking/storeApiService";

const { reducer, actions } = createGenericEntitySlice(
  "store",
  new StoresApiService(),
);

export const {
  setCurrentPage: setCurrentStoresPage,
  refresh: refreshStores,
  filter: filterStores,
} = actions;

export default reducer;
