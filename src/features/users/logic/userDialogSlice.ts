import { createGenericDialogSlice } from "@yusr_systems/ui";
import type User from "../data/user";

export const userDialogSlice = createGenericDialogSlice<User>("userDialog");

export const {
  openChangeDialog: openUserChangeDialog,
  openDeleteDialog: openUserDeleteDialog,
  setIsChangeDialogOpen: setIsUserChangeDialogOpen,
  setIsDeleteDialogOpen: setIsUserDeleteDialogOpen
} = userDialogSlice.actions;

export default userDialogSlice.reducer;
