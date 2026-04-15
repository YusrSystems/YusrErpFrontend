import { SystemPermissions } from "@yusr_systems/core";
import { CrudPage } from "@yusr_systems/ui";
import { Warehouse } from "lucide-react";
import { useMemo } from "react";
import { selectPermissionsByResource } from "../../core/auth/authSelectors";
import { SystemPermissionsActions } from "../../core/auth/systemPermissionsActions";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import type Store from "../../core/data/store";
import { StoreFilterColumns, StoreSlice } from "../../core/data/store";
import StoresApiService from "../../core/networking/storeApiService";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import ChangeStoreDialog from "./changeStoreDialog";

export default function StoresPage()
{
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const storeState = useAppSelector((state) => state.store);
  const storeDialogState = useAppSelector((state) => state.storeDialog);
  const permissions = useAppSelector((state) => selectPermissionsByResource(state, SystemPermissionsResources.Stores));
  const service = useMemo(() => new StoresApiService(), []);

  return (
    <CrudPage<Store>
      title="إدارة المستودعات"
      entityName="المستودع"
      addNewItemTitle="إضافة مستودع جديد"
      permissions={ permissions }
      hasPagePermission={ SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.Stores,
        SystemPermissionsActions.Get
      ) }
      entityState={ storeState }
      useSlice={ () => storeDialogState }
      service={ service }
      cards={ [{
        title: "إجمالي المستودعات",
        data: (storeState.entities?.count ?? 0).toString(),
        icon: <Warehouse className="h-4 w-4 text-muted-foreground" />
      }] }
      columnsToFilter={ StoreFilterColumns.columnsNames }
      tableHeadRows={ [{ rowName: "", rowStyles: "text-left w-12.5" }, { rowName: "رقم المستودع", rowStyles: "w-30" }, {
        rowName: "اسم المستودع",
        rowStyles: "w-70"
      }] }
      tableRowMapper={ (
        store: Store
      ) => [{ rowName: `#${store.id}`, rowStyles: "" }, { rowName: store.name, rowStyles: "font-semibold" }] }
      actions={ {
        filter: StoreSlice.entityActions.filter,
        openChangeDialog: (entity) => StoreSlice.dialogActions.openChangeDialog(entity),
        openDeleteDialog: (entity) => StoreSlice.dialogActions.openDeleteDialog(entity),
        setIsChangeDialogOpen: (open) => StoreSlice.dialogActions.setIsChangeDialogOpen(open),
        setIsDeleteDialogOpen: (open) => StoreSlice.dialogActions.setIsDeleteDialogOpen(open),
        refresh: StoreSlice.entityActions.refresh,
        setCurrentPage: (page) => StoreSlice.entityActions.setCurrentPage(page)
      } }
      ChangeDialog={ 
        <ChangeStoreDialog
          entity={ storeDialogState.selectedRow || undefined }
          mode={ storeDialogState.selectedRow ? "update" : "create" }
          service={ service }
          onSuccess={ (data, mode) =>
          {
            dispatch(StoreSlice.entityActions.refresh({ data: data }));
            if (mode === "create")
            {
              dispatch(StoreSlice.dialogActions.setIsChangeDialogOpen(false));
            }
          } }
        />
       }
    />
  );
}
