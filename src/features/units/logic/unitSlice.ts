import { createGenericEntitySlice } from "@yusr_systems/ui";
import UnitsApiService from "../../../core/networking/unitApiService";

const { reducer, actions } = createGenericEntitySlice(
  "unit",
  new UnitsApiService(),
);

export const {
  setCurrentPage: setCurrentUnitsPage,
  refresh: refreshUnits,
  filter: filterUnits,
} = actions;

export default reducer;
