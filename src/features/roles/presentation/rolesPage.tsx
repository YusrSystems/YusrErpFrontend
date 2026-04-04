import { RolesApiService } from "@yusr_systems/core";
import { CrudPage } from "@yusr_systems/ui";
import { Settings2 } from "lucide-react";
import { useMemo } from "react";
import { selectPermissionsByResource } from "../../../core/auth/authSelectors";
import { SystemPermissionsResources } from "../../../core/auth/systemPermissionsResources";
import { type Role, RoleFilterColumns } from "../../../core/data/role";
import { useAppDispatch, useAppSelector } from "../../../core/state/store";
import { openRoleChangeDialog, openRoleDeleteDialog, setIsRoleChangeDialogOpen, setIsRoleDeleteDialogOpen } from "../logic/roleDialogSlice";
import { filterRoles, refreshRoles, setCurrentRolesPage } from "../logic/roleSlice";
import ChangeRoleDialog from "./changeRoleDialog";

export default function RolesPage()
{
  const dispatch = useAppDispatch();
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
        filter: filterRoles,
        openChangeDialog: (entity) => openRoleChangeDialog(entity),
        openDeleteDialog: (entity) => openRoleDeleteDialog(entity),
        setIsChangeDialogOpen: (open) => setIsRoleChangeDialogOpen(open),
        setIsDeleteDialogOpen: (open) => setIsRoleDeleteDialogOpen(open),
        refresh: refreshRoles,
        setCurrentPage: (page) => setCurrentRolesPage(page)
      } }
      ChangeDialog={ 
        <ChangeRoleDialog
          entity={ roleDialogState.selectedRow || undefined }
          mode={ roleDialogState.selectedRow ? "update" : "create" }
          service={ service }
          onSuccess={ (data, mode) =>
          {
            dispatch(refreshRoles({ data: data }));
            if (mode === "create")
            {
              dispatch(setIsRoleChangeDialogOpen(false));
            }
          } }
        />
       }
    />
  );
}
