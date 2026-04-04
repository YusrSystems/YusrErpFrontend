import { createGenericDialogSlice } from "@yusr_systems/ui";
import type Unit from "../../../core/data/units";

export const unitDialogSlice = createGenericDialogSlice<Unit>("unitDialog");

export const {
  openChangeDialog: openUnitChangeDialog,
  openDeleteDialog: openUnitDeleteDialog,
  setIsChangeDialogOpen: setIsUnitChangeDialogOpen,
  setIsDeleteDialogOpen: setIsUnitDeleteDialogOpen,
} = unitDialogSlice.actions;

export default unitDialogSlice.reducer;
