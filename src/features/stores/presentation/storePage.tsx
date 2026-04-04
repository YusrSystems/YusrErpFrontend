import { useMemo } from "react";
import { selectPermissionsByResource } from "../../../core/auth/authSelectors";
import { SystemPermissionsResources } from "../../../core/auth/systemPermissionsResources";
import StoresApiService from "../../../core/networking/storeApiService";
import { useAppDispatch, useAppSelector } from "../../../core/state/store";
import {
  openStoreChangeDialog,
  openStoreDeleteDialog,
  setIsStoreChangeDialogOpen,
  setIsStoreDeleteDialogOpen,
} from "../logic/storeDialogSlice";
import {
  filterStores,
  refreshStores,
  setCurrentStoresPage,
} from "../logic/storeSlice";
import type Store from "../../../core/data/store";
import { Warehouse } from "lucide-react";
import { StoreFilterColumns } from "../../../core/data/store";
import ChangeStoreDialog from "./changeStoreDialog";
import { CrudPage } from "@yusr_systems/ui";

export default function StoresPage() {
  const dispatch = useAppDispatch();
  const storeState = useAppSelector((state) => state.store);
  const storeDialogState = useAppSelector((state) => state.storeDialog);
  const permissions = useAppSelector((state) =>
    selectPermissionsByResource(state, SystemPermissionsResources.Stores),
  );
  const service = useMemo(() => new StoresApiService(), []);

  return (
    <CrudPage<Store>
      title="إدارة المستودعات"
      entityName="المستودع"
      addNewItemTitle="إضافة مستودع جديد"
      permissions={permissions}
      entityState={storeState}
      useSlice={() => storeDialogState}
      service={service}
      cards={[
        {
          title: "إجمالي المستودعات",
          data: (storeState.entities?.count ?? 0).toString(),
          icon: <Warehouse className="h-4 w-4 text-muted-foreground" />,
        },
      ]}
      columnsToFilter={StoreFilterColumns.columnsNames}
      tableHeadRows={[
        { rowName: "", rowStyles: "text-left w-12.5" },
        { rowName: "رقم المستودع", rowStyles: "w-30" },
        { rowName: "اسم المستودع", rowStyles: "w-70" },
      ]}
      tableRowMapper={(store: Store) => [
        { rowName: `#${store.id}`, rowStyles: "" },
        { rowName: store.storeName, rowStyles: "font-semibold" },
      ]}
      actions={{
        filter: filterStores,
        openChangeDialog: (entity) => openStoreChangeDialog(entity),
        openDeleteDialog: (entity) => openStoreDeleteDialog(entity),
        setIsChangeDialogOpen: (open) => setIsStoreChangeDialogOpen(open),
        setIsDeleteDialogOpen: (open) => setIsStoreDeleteDialogOpen(open),
        refresh: refreshStores,
        setCurrentPage: (page) => setCurrentStoresPage(page),
      }}
      ChangeDialog={
        <ChangeStoreDialog
          entity={storeDialogState.selectedRow || undefined}
          mode={storeDialogState.selectedRow ? "update" : "create"}
          service={service}
          onSuccess={(data, mode) => {
            dispatch(refreshStores({ data: data }));
            if (mode === "create") {
              dispatch(setIsStoreChangeDialogOpen(false));
            }
          }}
        />
      }
    />
  );
}
