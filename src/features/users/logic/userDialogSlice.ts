import type { User } from "@yusr_systems/core";
import { createGenericDialogSlice } from "@yusr_systems/ui";

export const userDialogSlice = createGenericDialogSlice<User>("userDialog");

export const {
  openChangeDialog: openUserChangeDialog,
  openDeleteDialog: openUserDeleteDialog,
  setIsChangeDialogOpen: setIsUserChangeDialogOpen,
  setIsDeleteDialogOpen: setIsUserDeleteDialogOpen
} = userDialogSlice.actions;

export default userDialogSlice.reducer;
