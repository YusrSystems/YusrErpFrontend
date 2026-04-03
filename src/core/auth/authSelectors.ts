import { createSelector } from "@reduxjs/toolkit";
import type { PermissionSelector } from "@yusr_systems/core";
import { SystemPermissions } from "@yusr_systems/core";
import { SystemPermissionsActions } from "../auth/systemPermissionsActions";
import type { RootState } from "../state/store";

const selectRawPermissions = (state: RootState) => state.auth.loggedInUser?.role?.permissions || [];

export const selectPermissionsByResource : PermissionSelector<RootState> = createSelector([
  selectRawPermissions,
  (_state: RootState, resource: string) => resource
], (permissions, resource) =>
{
  const systemPermissions = new SystemPermissions(permissions, resource);

  return {
    getPermission: systemPermissions.hasAuth(SystemPermissionsActions.Get),
    addPermission: systemPermissions.hasAuth(SystemPermissionsActions.Add),
    updatePermission: systemPermissions.hasAuth(SystemPermissionsActions.Update),
    deletePermission: systemPermissions.hasAuth(SystemPermissionsActions.Delete)
  };
});
