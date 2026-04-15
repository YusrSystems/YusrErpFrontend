import { Button, FormField, NumberField, SearchableSelect, TextField } from "@yusr_systems/ui";
import { Plus, Trash2 } from "lucide-react";
import { AccountFilterColumns, ClientsAndSuppliersSlice } from "../../../../core/data/account";
import { InvoiceRelationType } from "../../../../core/data/invoice";
import { PaymentMethodFilterColumns, PaymentMethodSlice } from "../../../../core/data/paymentMethod";
import { useAppSelector } from "../../../../core/state/store";
import { useInvoiceContext } from "../../logic/invoiceContext";

export default function InvoiceCostsTab()
{
  const {
    formData,
    authState,
    slice,
    dispatch
  } = useInvoiceContext();

  const clientsAndSuppliersState = useAppSelector((state) => state.clientsAndSuppliers);
  const paymentMethodState = useAppSelector((state) => state.paymentMethod);
  const costVouchers = () => formData.invoiceVouchers?.filter((v) => v.invoiceRelationType == InvoiceRelationType.Cost) ?? [];

  return (
    <div className="flex flex-col gap-2 items-end">
      <Button
        type="button"
        className="max-w-40"
        size="lg"
        onClick={ () =>
          dispatch(slice.formActions.addVoucher(
            {
              voucherId: 0,
              invoiceId: formData.id ?? 0,
              paymentMethodId: authState.setting?.mainPaymentMethodId ?? 0,
              paymentMethodName: authState.setting?.mainPaymentMethodName ?? "",
              accountId: formData.actionAccountId ?? 0,
              accountName: formData.actionAccountName ?? "",
              invoiceRelationType: InvoiceRelationType.Cost,
              amount: 0,
              amountReceived: 0,
              description: undefined
            }
          )) }
      >
        <Plus className="w-4 h-4 ml-2" /> إضافة سند تكلفة
      </Button>

      <div className="w-full overflow-x-auto border border-border rounded-lg shadow-sm bg-background" dir="rtl">
        <table className="w-full text-sm text-right">
          <thead className="bg-muted/40 border-b border-border">
            <tr>
              <th className="p-3 font-semibold w-16 text-center text-muted-foreground">الرقم</th>
              <th className="p-3 font-semibold">الحساب</th>
              <th className="p-3 font-semibold">طريقة الدفع</th>
              <th className="p-3 font-semibold text-center">المبلغ</th>
              <th className="p-3 font-semibold text-center">الوصف</th>
              <th className="p-4 font-semibold w-16 text-center"></th>
            </tr>
          </thead>
          <tbody>
            { costVouchers().map((row, index) => (
              <tr
                key={ row.voucherId }
                className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
              >
                <td className="p-2 text-center font-bold text-muted-foreground">{ index + 1 }</td>

                <td className="p-2">
                  <FormField label="">
                    <SearchableSelect
                      items={ clientsAndSuppliersState.entities.data ?? [] }
                      itemLabelKey="name"
                      itemValueKey="id"
                      value={ row.accountId?.toString() }
                      columnsNames={ AccountFilterColumns.columnsNames }
                      onSearch={ (condition) => dispatch(ClientsAndSuppliersSlice.entityActions.filter(condition)) }
                      disabled={ clientsAndSuppliersState.isLoading }
                      onValueChange={ (val) =>
                      {
                        const selected = clientsAndSuppliersState.entities.data?.find((a) => a.id.toString() === val);
                        if (selected)
                        {
                          dispatch(slice.formActions.updateVoucher({
                            ...row,
                            accountId: selected?.id,
                            accountName: selected?.name
                          }));
                        }
                      } }
                    />
                  </FormField>
                </td>

                <td className="p-2">
                  <FormField label="">
                    <SearchableSelect
                      items={ paymentMethodState.entities.data ?? [] }
                      itemLabelKey="name"
                      itemValueKey="id"
                      value={ row.paymentMethodId?.toString() }
                      columnsNames={ PaymentMethodFilterColumns.columnsNames }
                      onSearch={ (condition) => dispatch(PaymentMethodSlice.entityActions.filter(condition)) }
                      disabled={ paymentMethodState.isLoading }
                      onValueChange={ (val) =>
                      {
                        const selected = paymentMethodState.entities.data?.find((a) => a.id.toString() === val);
                        if (selected)
                        {
                          dispatch(slice.formActions.updateVoucher({
                            ...row,
                            paymentMethodId: selected?.id,
                            paymentMethodName: selected?.name
                          }));
                        }
                      } }
                    />
                  </FormField>
                </td>

                <td className="p-2">
                  <NumberField
                    label=""
                    value={ row.amount || "0" }
                    onChange={ (val) =>
                    {
                      if (val != undefined)
                      {
                        dispatch(slice.formActions.updateVoucher({ ...row, amount: val }));
                      }
                    } }
                  />
                </td>

                <td className="p-2">
                  <TextField
                    label=""
                    value={ row.description || "" }
                    onChange={ (e) =>
                      dispatch(slice.formActions.updateVoucher({ ...row, description: e.target.value })) }
                  />
                </td>

                <td className="p-4 text-center align-top pt-5">
                  <button
                    type="button"
                    onClick={ () =>
                    {
                      dispatch(slice.formActions.removeVoucher(row.voucherId));
                    } }
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-500/10 rounded-md transition-colors"
                    aria-label="حذف السند"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            )) }
          </tbody>
        </table>
      </div>
    </div>
  );
}
