import { createGenericDialogSlice } from "@yusr_systems/ui";
import type Store from "../../../core/data/store";

export const storeDialogSlice = createGenericDialogSlice<Store>("storeDialog");

export const {
  openChangeDialog: openStoreChangeDialog,
  openDeleteDialog: openStoreDeleteDialog,
  setIsChangeDialogOpen: setIsStoreChangeDialogOpen,
  setIsDeleteDialogOpen: setIsStoreDeleteDialogOpen
} = storeDialogSlice.actions;

export default storeDialogSlice.reducer;
