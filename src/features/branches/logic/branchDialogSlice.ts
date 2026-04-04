import { createGenericDialogSlice } from "@yusr_systems/ui";
import type Branch from "../../../core/data/branch";

export const branchDialogSlice = createGenericDialogSlice<Branch>("branchDialog");

export const {
  openChangeDialog: openBranchChangeDialog,
  openDeleteDialog: openBranchDeleteDialog,
  setIsChangeDialogOpen: setIsBranchChangeDialogOpen,
  setIsDeleteDialogOpen: setIsBranchDeleteDialogOpen
} = branchDialogSlice.actions;

export default branchDialogSlice.reducer;
