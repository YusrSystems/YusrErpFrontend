import { CrudPage } from "@yusr_systems/ui";
import { FileTextIcon } from "lucide-react";
import { useEffect, useMemo } from "react";
import { selectPermissionsByResource } from "../../core/auth/authSelectors";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import Invoice, { InvoiceFilterColumns, InvoiceSlice, InvoiceStatus, InvoiceType } from "../../core/data/invoice";
import InvoicesApiService from "../../core/networking/invoiceApiService";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import ChangeInvoiceDialog from "./changeInvoiceDialog";
import { setInvoiceType } from "./logic/invoiceSliceUI";

export default function InvoicesPage({ type }: { type: InvoiceType; })
{
  const dispatch = useAppDispatch();
  const invoiceState = useAppSelector((state) => state.invoice);
  const invoiceDialogState = useAppSelector((state) => state.invoiceDialog);

  // Update with your actual permission resource enum
  const permissions = useAppSelector((state) =>
    selectPermissionsByResource(state, SystemPermissionsResources.Invoices)
  );

  const service = useMemo(() => new InvoicesApiService(), []);

  const titleText = getTitleText(type);
  useEffect(() =>
  {
    dispatch(setInvoiceType(type));
  }, []);
  return (
    <CrudPage<Invoice>
      title={ titleText }
      entityName="الفاتورة"
      addNewItemTitle="إنشاء فاتورة جديدة"
      permissions={ permissions }
      entityState={ invoiceState }
      useSlice={ () => invoiceDialogState }
      service={ service }
      cards={ [{
        title: "إجمالي الفواتير",
        data: (invoiceState.entities?.count ?? 0).toString(),
        icon: <FileTextIcon className="h-4 w-4 text-muted-foreground" />
      }] }
      columnsToFilter={ InvoiceFilterColumns.columnsNames }
      tableHeadRows={ [
        { rowName: "", rowStyles: "text-left w-12.5" },
        { rowName: "رقم الفاتورة", rowStyles: "w-24" },
        { rowName: "النوع", rowStyles: "w-32" },
        { rowName: "التاريخ", rowStyles: "w-32" },
        { rowName: "الحساب", rowStyles: "w-48" },
        { rowName: "المستودع", rowStyles: "w-32" },
        { rowName: "الإجمالي", rowStyles: "w-32" },
        { rowName: "الحالة", rowStyles: "" }
      ] }
      tableRowMapper={ (invoice: Invoice) => [
        { rowName: `#${invoice.id}`, rowStyles: "" },
        {
          rowName: getInvoiceTypeName(invoice.type),
          rowStyles: "font-semibold"
        },
        {
          rowName: new Date(invoice.date).toLocaleDateString("ar-SA"),
          rowStyles: ""
        },
        { rowName: invoice.actionAccountName || "-", rowStyles: "" },
        { rowName: invoice.storeName || "-", rowStyles: "" },
        {
          rowName: `${invoice.fullAmount} ر.س`,
          rowStyles: "font-bold text-blue-600"
        },
        {
          rowName: invoice.statusId === InvoiceStatus.Valid ? "صالحة" : "محذوفة",
          rowStyles: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            invoice.statusId === InvoiceStatus.Valid
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`
        }
      ] }
      actions={ {
        filter: InvoiceSlice.entityActions.filter,
        openChangeDialog: (entity) => InvoiceSlice.dialogActions.openChangeDialog(entity),
        openDeleteDialog: (entity) => InvoiceSlice.dialogActions.openDeleteDialog(entity),
        setIsChangeDialogOpen: (open) => InvoiceSlice.dialogActions.setIsChangeDialogOpen(open),
        setIsDeleteDialogOpen: (open) => InvoiceSlice.dialogActions.setIsDeleteDialogOpen(open),
        refresh: InvoiceSlice.entityActions.refresh,
        setCurrentPage: (page) => InvoiceSlice.entityActions.setCurrentPage(page)
      } }
      ChangeDialog={ 
        <ChangeInvoiceDialog
          entity={ invoiceDialogState.selectedRow || undefined }
          mode={ invoiceDialogState.selectedRow ? "update" : "create" }
          service={ service }
          onSuccess={ (data, mode) =>
          {
            dispatch(InvoiceSlice.entityActions.refresh({ data: data }));
            if (mode === "create")
            {
              dispatch(InvoiceSlice.dialogActions.setIsChangeDialogOpen(false));
            }
          } }
        />
       }
    />
  );
}

const getInvoiceTypeName = (type: InvoiceType) =>
{
  switch (type)
  {
    case InvoiceType.Sell:
      return "مبيعات";
    case InvoiceType.Purchase:
      return "مشتريات";
    case InvoiceType.SellReturn:
      return "مرتجع مبيعات";
    case InvoiceType.Quotation:
      return "عرض سعر";
    case InvoiceType.PurchaseReturn:
      return "مرتجع مشتريات";
    default:
      return "غير معروف";
  }
};

const getTitleText = (type: InvoiceType): string =>
{
  switch (type)
  {
    case InvoiceType.Sell:
      return "ادارة فواتير المبيعات";
    case InvoiceType.Purchase:
      return "ادارة فواتير الشراء";
    case InvoiceType.SellReturn:
      return "ادارة فواتير المرتجعات المبيعات";
    case InvoiceType.Quotation:
      return "ادارة فواتير العروض السعرية";
    case InvoiceType.PurchaseReturn:
      return "ادارة فواتير المرتجعات المشتريات";
    default:
      return "غير معروف";
  }
};
