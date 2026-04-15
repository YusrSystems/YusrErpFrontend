import { Branch, BranchesApiService, BranchFilterColumns, SystemPermissions } from "@yusr_systems/core";
import { CrudPage } from "@yusr_systems/ui";
import { Building } from "lucide-react";
import { useMemo } from "react";
import { selectPermissionsByResource } from "../../core/auth/authSelectors";
import { SystemPermissionsActions } from "../../core/auth/systemPermissionsActions";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import { BranchSlice } from "../../core/data/branchLogic";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import ChangeBranchDialog from "./changeBranchDialog";

export default function BranchesPage()
{
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const branchState = useAppSelector((state) => state.branch);
  const branchDialogState = useAppSelector((state) => state.branchDialog);
  const permissions = useAppSelector((state) =>
    selectPermissionsByResource(state, SystemPermissionsResources.Branches)
  );
  const service = useMemo(() => new BranchesApiService(), []);

  return (
    <CrudPage<Branch>
      title="إدارة الفروع"
      entityName="الفرع"
      addNewItemTitle="إضافة فرع جديد"
      permissions={ permissions }
      hasPagePermission={ SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.Branches,
        SystemPermissionsActions.Get
      ) }
      entityState={ branchState }
      useSlice={ () => branchDialogState }
      service={ service }
      cards={ [{
        title: "إجمالي الفروع",
        data: (branchState.entities?.count ?? 0).toString(),
        icon: <Building className="h-4 w-4 text-muted-foreground" />
      }] }
      columnsToFilter={ BranchFilterColumns.columnsNames }
      tableHeadRows={ [{ rowName: "", rowStyles: "text-left w-12.5" }, { rowName: "رقم الفرع", rowStyles: "w-30" }, {
        rowName: "اسم الفرع",
        rowStyles: ""
      }, { rowName: "المدينة", rowStyles: "" }] }
      tableRowMapper={ (
        branch: Branch
      ) => [{ rowName: `#${branch.id}`, rowStyles: "" }, { rowName: branch.name, rowStyles: "font-semibold" }, {
        rowName: branch.city?.name,
        rowStyles: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800"
      }] }
      actions={ {
        filter: BranchSlice.entityActions.filter,
        openChangeDialog: (entity) => BranchSlice.dialogActions.openChangeDialog(entity),
        openDeleteDialog: (entity) => BranchSlice.dialogActions.openDeleteDialog(entity),
        setIsChangeDialogOpen: (open) => BranchSlice.dialogActions.setIsChangeDialogOpen(open),
        setIsDeleteDialogOpen: (open) => BranchSlice.dialogActions.setIsDeleteDialogOpen(open),
        refresh: BranchSlice.entityActions.refresh,
        setCurrentPage: (page) => BranchSlice.entityActions.setCurrentPage(page)
      } }
      ChangeDialog={ 
        <ChangeBranchDialog
          entity={ branchDialogState.selectedRow || undefined }
          mode={ branchDialogState.selectedRow ? "update" : "create" }
          service={ service }
          onSuccess={ (data, mode) =>
          {
            dispatch(BranchSlice.entityActions.refresh({ data: data }));
            if (mode === "create")
            {
              dispatch(BranchSlice.dialogActions.setIsChangeDialogOpen(false));
            }
          } }
        />
       }
    />
  );
}
