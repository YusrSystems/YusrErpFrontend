import { CrudPage } from "@yusr_systems/ui";
import { CreditCardIcon } from "lucide-react";
import { useMemo } from "react";
import { selectPermissionsByResource } from "../../core/auth/authSelectors";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import type PaymentMethod from "../../core/data/paymentMethod";
import { CommissionType, PaymentMethodFilterColumns, PaymentMethodSlice } from "../../core/data/paymentMethod";
import PaymentMethodsApiService from "../../core/networking/paymentMethodApiService";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import ChangePaymentMethodDialog from "./changePaymentMethodDialog";

export default function PaymentMethodsPage()
{
  const dispatch = useAppDispatch();
  const paymentMethodState = useAppSelector((state) => state.paymentMethod);
  const paymentMethodDialogState = useAppSelector(
    (state) => state.paymentMethodDialog
  );

  const permissions = useAppSelector((state) =>
    selectPermissionsByResource(
      state,
      SystemPermissionsResources.PaymentMethods
    )
  );

  const service = useMemo(() => new PaymentMethodsApiService(), []);

  return (
    <CrudPage<PaymentMethod>
      title="إدارة طرق الدفع"
      entityName="طريقة الدفع"
      addNewItemTitle="إضافة طريقة دفع جديدة"
      permissions={ permissions }
      entityState={ paymentMethodState }
      useSlice={ () => paymentMethodDialogState }
      service={ service }
      cards={ [{
        title: "إجمالي طرق الدفع",
        data: (paymentMethodState.entities?.count ?? 0).toString(),
        icon: <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
      }] }
      columnsToFilter={ PaymentMethodFilterColumns.columnsNames }
      tableHeadRows={ [
        { rowName: "", rowStyles: "text-left w-12.5" },
        { rowName: "رقم الطريقة", rowStyles: "w-20" },
        { rowName: "الاسم", rowStyles: "w-40" },
        { rowName: "الحساب", rowStyles: "w-40" },
        { rowName: "نوع العمولة", rowStyles: "w-30" },
        { rowName: "قيمة العمولة", rowStyles: "w-30" }
      ] }
      tableRowMapper={ (
        paymentMethod: PaymentMethod
      ) => [{ rowName: `#${paymentMethod.id}`, rowStyles: "" }, {
        rowName: paymentMethod.name,
        rowStyles: "font-semibold"
      }, {
        rowName: paymentMethod.accountName || paymentMethod.accountId.toString(),
        rowStyles: ""
      }, {
        rowName: paymentMethod.commissionType === CommissionType.Percent
          ? "نسبة مئوية (%)"
          : "مبلغ ثابت",
        rowStyles: "text-sm text-muted-foreground"
      }, {
        rowName: paymentMethod.commissionAmount.toString(),
        rowStyles: "font-medium text-blue-600"
      }] }
      actions={ {
        filter: PaymentMethodSlice.entityActions.filter,
        openChangeDialog: (entity) => PaymentMethodSlice.dialogActions.openChangeDialog(entity),
        openDeleteDialog: (entity) => PaymentMethodSlice.dialogActions.openDeleteDialog(entity),
        setIsChangeDialogOpen: (open) => PaymentMethodSlice.dialogActions.setIsChangeDialogOpen(open),
        setIsDeleteDialogOpen: (open) => PaymentMethodSlice.dialogActions.setIsDeleteDialogOpen(open),
        refresh: PaymentMethodSlice.entityActions.refresh,
        setCurrentPage: (page) => PaymentMethodSlice.entityActions.setCurrentPage(page)
      } }
      ChangeDialog={ 
        <ChangePaymentMethodDialog
          entity={ paymentMethodDialogState.selectedRow || undefined }
          mode={ paymentMethodDialogState.selectedRow ? "update" : "create" }
          service={ service }
          onSuccess={ (data, mode) =>
          {
            dispatch(PaymentMethodSlice.entityActions.refresh({ data: data }));
            if (mode === "create")
            {
              dispatch(
                PaymentMethodSlice.dialogActions.setIsChangeDialogOpen(false)
              );
            }
          } }
        />
       }
    />
  );
}
