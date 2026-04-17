import { SystemPermissions } from "@yusr_systems/core";
import { CrudPage } from "@yusr_systems/ui";
import { ArrowLeftRightIcon } from "lucide-react";
import { useMemo } from "react";
import { selectPermissionsByResource } from "../../core/auth/authSelectors";
import { SystemPermissionsActions } from "../../core/auth/systemPermissionsActions";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import type ItemTransfer from "../../core/data/itemTransfer";
import { ItemTransferFilterColumns, ItemTransferSlice } from "../../core/data/itemTransfer";
import ReportConstants from "../../core/data/report/reportConstants";
import ItemTransferApiService from "../../core/networking/itemTransferApiService";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import ReportButton from "../reports/reportButton";
import ChangeItemTransferDialog from "./changeItemTransferDialog";

export default function ItemTransfersPage()
{
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const itemTransferState = useAppSelector((state) => state.itemTransfer);
  const itemTransferDialogState = useAppSelector((state) => state.itemTransferDialog);

  // Assuming permissions resource exists for ItemTransfers
  const permissions = useAppSelector((state) =>
    selectPermissionsByResource(state, SystemPermissionsResources.ItemTransfers || "")
  );

  const service = useMemo(() => new ItemTransferApiService(), []);

  return (
    <CrudPage<ItemTransfer>
      title="نقل المواد"
      entityName="عملية نقل"
      addNewItemTitle="إنشاء عملية نقل مواد جديدة"
      permissions={ permissions }
      hasPagePermission={ SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.ItemTransfers,
        SystemPermissionsActions.Get
      ) }
      entityState={ itemTransferState }
      useSlice={ () => itemTransferDialogState }
      service={ service }
      cards={ [{
        title: "إجمالي عمليات النقل",
        data: (itemTransferState.entities?.count ?? 0).toString(),
        icon: <ArrowLeftRightIcon className="h-4 w-4 text-muted-foreground" />
      }] }
      columnsToFilter={ ItemTransferFilterColumns.columnsNames }
      tableHeadRows={ [
        { rowName: "", rowStyles: "w-12" },
        { rowName: "رقم النقل", rowStyles: "w-24" },
        { rowName: "التاريخ", rowStyles: "w-32" },
        { rowName: "من مستودع", rowStyles: "w-48" },
        { rowName: "إلى مستودع", rowStyles: "w-48" },
        { rowName: "الوصف", rowStyles: "" },
        ...(SystemPermissions.hasAuth(
            authState.loggedInUser?.role?.permissions ?? [],
            SystemPermissionsResources.ReportItemTransfer,
            SystemPermissionsActions.Get
          )
          ? [{ rowName: "", rowStyles: "w-32" }]
          : [])
      ] }
      tableRowMapper={ (
        transfer: ItemTransfer
      ) => [
        { rowName: `#${transfer.id}`, rowStyles: "font-mono text-xs" },
        { rowName: new Date(transfer.transferDate).toLocaleDateString("ar-SA"), rowStyles: "" },
        { rowName: transfer.fromStoreName, rowStyles: "font-semibold" },
        { rowName: transfer.toStoreName, rowStyles: "font-semibold" },
        { rowName: transfer.description || "-", rowStyles: "text-muted-foreground" },
        ...(SystemPermissions.hasAuth(
            authState.loggedInUser?.role?.permissions ?? [],
            SystemPermissionsResources.ReportItemTransfer,
            SystemPermissionsActions.Get
          )
          ? [{
            rowName: (
              <ReportButton
                reportName={ ReportConstants.ItemTransfer }
                request={ { itemTransferId: transfer.id } }
              />
            ),
            rowStyles: "w-32"
          }]
          : [])
      ] }
      actions={ {
        filter: ItemTransferSlice.entityActions.filter,
        openChangeDialog: (entity) => dispatch(ItemTransferSlice.dialogActions.openChangeDialog(entity)),
        openDeleteDialog: (entity) => dispatch(ItemTransferSlice.dialogActions.openDeleteDialog(entity)),
        setIsChangeDialogOpen: (open) => dispatch(ItemTransferSlice.dialogActions.setIsChangeDialogOpen(open)),
        setIsDeleteDialogOpen: (open) => dispatch(ItemTransferSlice.dialogActions.setIsDeleteDialogOpen(open)),
        refresh: ItemTransferSlice.entityActions.refresh,
        setCurrentPage: (page) => dispatch(ItemTransferSlice.entityActions.setCurrentPage(page))
      } }
      ChangeDialog={ 
        <ChangeItemTransferDialog
          entity={ itemTransferDialogState.selectedRow || undefined }
          mode={ itemTransferDialogState.selectedRow ? "update" : "create" }
          service={ service }
          onSuccess={ (data, mode) =>
          {
            dispatch(ItemTransferSlice.entityActions.refresh({ data }));
            if (mode === "create")
            {
              dispatch(ItemTransferSlice.dialogActions.setIsChangeDialogOpen(false));
            }
          } }
        />
       }
    />
  );
}
