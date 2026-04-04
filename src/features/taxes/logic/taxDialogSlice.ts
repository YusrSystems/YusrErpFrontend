import { createGenericDialogSlice } from "@yusr_systems/ui";
import type { Tax } from "../../../core/data/tax";

export const taxDialogSlice = createGenericDialogSlice<Tax>("taxDialog");

export const {
  openChangeDialog: openTaxChangeDialog,
  openDeleteDialog: openTaxDeleteDialog,
  setIsChangeDialogOpen: setIsTaxChangeDialogOpen,
  setIsDeleteDialogOpen: setIsTaxDeleteDialogOpen
} = taxDialogSlice.actions;

export default taxDialogSlice.reducer;
