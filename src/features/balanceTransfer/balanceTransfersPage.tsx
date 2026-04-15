import { SystemPermissions } from "@yusr_systems/core";
import { CrudPage } from "@yusr_systems/ui";
import { ArrowRightLeft } from "lucide-react";
import { useMemo } from "react";
import { selectPermissionsByResource } from "../../core/auth/authSelectors";
import { SystemPermissionsActions } from "../../core/auth/systemPermissionsActions";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import BalanceTransfer, { BalanceTransferFilterColumns, BalanceTransferSlice } from "../../core/data/balanceTransfer";
import BalanceTransfersApiService from "../../core/networking/balanceTransferApiService";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import ChangeBalanceTransferDialog from "./changeBalanceTransferDialog";

export default function BalanceTransfersPage()
{
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const transferState = useAppSelector((state) => state.balanceTransfer);
  const transferDialogState = useAppSelector((state) => state.balanceTransferDialog);

  const permissions = useAppSelector((state) =>
    selectPermissionsByResource(state, SystemPermissionsResources.BalanceTransfers)
  );

  const service = useMemo(() => new BalanceTransfersApiService(), []);

  return (
    <CrudPage<BalanceTransfer>
      title="تحويلات الأرصدة"
      entityName="تحويل"
      addNewItemTitle="إضافة تحويل جديد"
      permissions={ permissions }
      hasPagePermission={ SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.BalanceTransfers,
        SystemPermissionsActions.Get
      ) }
      entityState={ transferState }
      useSlice={ () => transferDialogState }
      service={ service }
      cards={ [{
        title: "إجمالي التحويلات",
        data: (transferState.entities?.count ?? 0).toString(),
        icon: <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
      }] }
      columnsToFilter={ BalanceTransferFilterColumns.columnsNames }
      tableHeadRows={ [
        { rowName: "", rowStyles: "text-left w-12.5" },
        { rowName: "رقم التحويل", rowStyles: "w-24" },
        { rowName: "التاريخ", rowStyles: "w-24" },
        { rowName: "من حساب", rowStyles: "w-40" },
        { rowName: "إلى حساب", rowStyles: "w-40" },
        { rowName: "المبلغ", rowStyles: "w-32" },
        { rowName: "البيان", rowStyles: "w-48" }
      ] }
      tableRowMapper={ (
        transfer: BalanceTransfer
      ) => [
        { rowName: `#${transfer.id}`, rowStyles: "" },
        { rowName: new Date(transfer.date).toLocaleDateString("ar-SA"), rowStyles: "" },
        { rowName: transfer.fromAccountName ?? "-", rowStyles: "font-semibold text-red-600" },
        { rowName: transfer.toAccountName ?? "-", rowStyles: "font-semibold text-green-600" },
        { rowName: transfer.amount?.toLocaleString() ?? "0", rowStyles: "font-mono font-bold" },
        { rowName: transfer.description ?? "-", rowStyles: "text-sm text-gray-500 truncate max-w-[200px]" }
      ] }
      actions={ {
        filter: BalanceTransferSlice.entityActions.filter,
        openChangeDialog: (entity) => BalanceTransferSlice.dialogActions.openChangeDialog(entity),
        openDeleteDialog: (entity) => BalanceTransferSlice.dialogActions.openDeleteDialog(entity),
        setIsChangeDialogOpen: (open) => BalanceTransferSlice.dialogActions.setIsChangeDialogOpen(open),
        setIsDeleteDialogOpen: (open) => BalanceTransferSlice.dialogActions.setIsDeleteDialogOpen(open),
        refresh: BalanceTransferSlice.entityActions.refresh,
        setCurrentPage: (page) => BalanceTransferSlice.entityActions.setCurrentPage(page)
      } }
      ChangeDialog={ 
        <ChangeBalanceTransferDialog
          entity={ transferDialogState.selectedRow || undefined }
          mode={ transferDialogState.selectedRow ? "update" : "create" }
          service={ service }
          onSuccess={ (data, mode) =>
          {
            dispatch(BalanceTransferSlice.entityActions.refresh({ data: data }));
            if (mode === "create")
            {
              dispatch(BalanceTransferSlice.dialogActions.setIsChangeDialogOpen(false));
            }
          } }
        />
       }
    />
  );
}
