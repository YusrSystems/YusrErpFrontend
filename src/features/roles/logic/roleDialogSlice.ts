import { createGenericDialogSlice } from "@yusr_systems/ui";
import type { Role } from "../../../core/data/role";

export const roleDialogSlice = createGenericDialogSlice<Role>("roleDialog");

export const {
  openChangeDialog: openRoleChangeDialog,
  openDeleteDialog: openRoleDeleteDialog,
  setIsChangeDialogOpen: setIsRoleChangeDialogOpen,
  setIsDeleteDialogOpen: setIsRoleDeleteDialogOpen
} = roleDialogSlice.actions;

export default roleDialogSlice.reducer;
