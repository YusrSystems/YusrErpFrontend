import { Role, RoleFilterColumns, RolesApiService, SystemPermissions } from "@yusr_systems/core";
import { CrudPage } from "@yusr_systems/ui";
import { Settings2 } from "lucide-react";
import { useMemo } from "react";
import { selectPermissionsByResource } from "../../core/auth/authSelectors";
import { SystemPermissionsActions } from "../../core/auth/systemPermissionsActions";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import { RoleSlice } from "../../core/data/role";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import ChangeRoleDialog from "./changeRoleDialog";

export default function RolesPage()
{
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const roleState = useAppSelector((state) => state.role);
  const roleDialogState = useAppSelector((state) => state.roleDialog);
  const permissions = useAppSelector((state) => selectPermissionsByResource(state, SystemPermissionsResources.Roles));
  const service = useMemo(() => new RolesApiService(), []);

  return (
    <CrudPage<Role>
      title="إدارة الأدوار"
      entityName="الدور"
      addNewItemTitle="إضافة دور جديد"
      permissions={ permissions }
      hasPagePermission={ SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.Roles,
        SystemPermissionsActions.Get
      ) }
      entityState={ roleState }
      useSlice={ () => roleDialogState }
      service={ service }
      cards={ [{
        title: "إجمالي الادوار",
        data: (roleState.entities?.count ?? 0).toString(),
        icon: <Settings2 className="h-4 w-4 text-muted-foreground" />
      }] }
      columnsToFilter={ RoleFilterColumns.columnsNames }
      tableHeadRows={ [{ rowName: "", rowStyles: "text-left w-12.5" }, { rowName: "رقم الصلاحية", rowStyles: "w-30" }, {
        rowName: "اسم الصلاحية",
        rowStyles: ""
      }] }
      tableRowMapper={ (
        role: Role
      ) => [{ rowName: `#${role.id}`, rowStyles: "" }, { rowName: role.name, rowStyles: "font-semibold" }] }
      actions={ {
        filter: RoleSlice.entityActions.filter,
        openChangeDialog: (entity) => RoleSlice.dialogActions.openChangeDialog(entity),
        openDeleteDialog: (entity) => RoleSlice.dialogActions.openDeleteDialog(entity),
        setIsChangeDialogOpen: (open) => RoleSlice.dialogActions.setIsChangeDialogOpen(open),
        setIsDeleteDialogOpen: (open) => RoleSlice.dialogActions.setIsDeleteDialogOpen(open),
        refresh: RoleSlice.entityActions.refresh,
        setCurrentPage: (page) => RoleSlice.entityActions.setCurrentPage(page)
      } }
      ChangeDialog={ 
        <ChangeRoleDialog
          entity={ roleDialogState.selectedRow || undefined }
          mode={ roleDialogState.selectedRow ? "update" : "create" }
          service={ service }
          onSuccess={ (data, mode) =>
          {
            dispatch(RoleSlice.entityActions.refresh({ data: data }));
            if (mode === "create")
            {
              dispatch(RoleSlice.dialogActions.setIsChangeDialogOpen(false));
            }
          } }
        />
       }
    />
  );
}
