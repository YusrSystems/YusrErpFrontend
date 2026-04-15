import { SystemPermissions } from "@yusr_systems/core";
import { CrudPage } from "@yusr_systems/ui";
import { FileText } from "lucide-react";
import { useMemo } from "react";
import { selectPermissionsByResource } from "../../core/auth/authSelectors";
import { SystemPermissionsActions } from "../../core/auth/systemPermissionsActions";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import Voucher, { VoucherFilterColumns, VoucherSlice, VoucherType } from "../../core/data/voucher";
import VouchersApiService from "../../core/networking/voucherApiService";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import ChangeVoucherDialog from "./changeVoucherDialog";

export default function VouchersPage()
{
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const voucherState = useAppSelector((state) => state.voucher);
  const voucherDialogState = useAppSelector((state) => state.voucherDialog);

  const permissions = useAppSelector((state) =>
    selectPermissionsByResource(state, SystemPermissionsResources.Vouchers)
  );

  const service = useMemo(() => new VouchersApiService(), []);

  return (
    <CrudPage<Voucher>
      title="السندات المالية"
      entityName="سند"
      addNewItemTitle="إضافة سند جديد"
      permissions={ permissions }
      hasPagePermission={ SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.Vouchers,
        SystemPermissionsActions.Get
      ) }
      entityState={ voucherState }
      useSlice={ () => voucherDialogState }
      service={ service }
      cards={ [{
        title: "إجمالي السندات",
        data: (voucherState.entities?.count ?? 0).toString(),
        icon: <FileText className="h-4 w-4 text-muted-foreground" />
      }] }
      columnsToFilter={ VoucherFilterColumns.columnsNames }
      tableHeadRows={ [
        { rowName: "", rowStyles: "text-left w-12.5" },
        { rowName: "رقم السند", rowStyles: "w-24" },
        { rowName: "نوع السند", rowStyles: "w-24" },
        { rowName: "التاريخ", rowStyles: "w-24" },
        { rowName: "الحساب", rowStyles: "w-40" },
        { rowName: "المبلغ", rowStyles: "w-32" },
        { rowName: "طريقة الدفع", rowStyles: "w-32" }
      ] }
      tableRowMapper={ (voucher: Voucher) => [
        { rowName: `#${voucher.id}`, rowStyles: "" },
        {
          rowName: voucher.type === VoucherType.Payment ? "سند صرف" : "سند قبض",
          rowStyles: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            voucher.type === VoucherType.Payment ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
          }`
        },
        { rowName: new Date(voucher.date).toLocaleDateString("ar-SA"), rowStyles: "" },
        { rowName: voucher.accountName ?? "-", rowStyles: "font-semibold" },
        { rowName: voucher.amount?.toLocaleString() ?? "0", rowStyles: "font-mono font-bold" },
        { rowName: voucher.paymentMethod?.name ?? "-", rowStyles: "text-sm text-gray-600" }
      ] }
      actions={ {
        filter: VoucherSlice.entityActions.filter,
        openChangeDialog: (entity) => VoucherSlice.dialogActions.openChangeDialog(entity),
        openDeleteDialog: (entity) => VoucherSlice.dialogActions.openDeleteDialog(entity),
        setIsChangeDialogOpen: (open) => VoucherSlice.dialogActions.setIsChangeDialogOpen(open),
        setIsDeleteDialogOpen: (open) => VoucherSlice.dialogActions.setIsDeleteDialogOpen(open),
        refresh: VoucherSlice.entityActions.refresh,
        setCurrentPage: (page) => VoucherSlice.entityActions.setCurrentPage(page)
      } }
      ChangeDialog={ 
        <ChangeVoucherDialog
          entity={ voucherDialogState.selectedRow || undefined }
          mode={ voucherDialogState.selectedRow ? "update" : "create" }
          service={ service }
          onSuccess={ (data, mode) =>
          {
            dispatch(VoucherSlice.entityActions.refresh({ data: data }));
            if (mode === "create")
            {
              dispatch(VoucherSlice.dialogActions.setIsChangeDialogOpen(false));
            }
          } }
        />
       }
    />
  );
}
