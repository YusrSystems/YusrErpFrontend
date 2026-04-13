import { Button, FormField, NumberField, SearchableSelect } from "@yusr_systems/ui";
import { Plus, Trash2 } from "lucide-react";
import { InvoiceRelationType, InvoiceVoucher } from "../../../../core/data/invoice";
import { PaymentMethodFilterColumns, PaymentMethodSlice } from "../../../../core/data/paymentMethod";
import { useAppSelector } from "../../../../core/state/store";
import { useInvoiceContext } from "../../logic/invoiceContext";
import { CalcInvoiceUnpaidPrice } from "../../logic/invoiceItemsMath";
import { addVoucher, removeVoucher, updateVoucher } from "../../logic/invoiceSliceUI";

export default function InvoicePaymentsTab()
{
  const {
    formData,
    authState,
    dispatch
  } = useInvoiceContext();
  const { vouchers } = useAppSelector((state) => state.invoiceUI);
  const paymentMethodState = useAppSelector((state) => state.paymentMethod);
  const paymentVouchers = () => vouchers.filter((v) => v.invoiceRelationType == InvoiceRelationType.Payment);
  const unpaidPrice = useAppSelector(CalcInvoiceUnpaidPrice);

  return (
    <div className="flex flex-col gap-2 items-end">
      { unpaidPrice > 0 && (
        <Button
          type="button"
          className="max-w-40"
          size="lg"
          onClick={ () =>
            dispatch(addVoucher(
              new InvoiceVoucher({
                voucherId: 0,
                invoiceId: formData.id,
                paymentMethodId: authState.setting?.mainPaymentMethodId,
                paymentMethodName: authState.setting?.mainPaymentMethodName,
                accountId: formData.actionAccountId,
                accountName: formData.actionAccountName,
                invoiceRelationType: InvoiceRelationType.Payment,
                amount: 0,
                amountReceived: 0,
                description: undefined
              })
            )) }
        >
          <Plus className="w-4 h-4 ml-2" /> إضافة سند دفع
        </Button>
      ) }

      <div className="w-full overflow-x-auto border border-border rounded-lg shadow-sm bg-background" dir="rtl">
        <table className="w-full text-sm text-right">
          <thead className="bg-muted/40 border-b border-border">
            <tr>
              <th className="p-3 font-semibold w-16 text-center text-muted-foreground">الرقم</th>
              <th className="p-3 font-semibold">طريقة الدفع</th>
              <th className="p-3 font-semibold text-center">المبلغ</th>
              <th className="p-3 font-semibold">المبلغ المستلم</th>
              <th className="p-3 font-semibold text-center">المبلغ المسترد</th>
              <th className="p-4 font-semibold w-16 text-center"></th>
            </tr>
          </thead>
          <tbody>
            { paymentVouchers().map((row, index) => (
              <tr
                key={ row.voucherId }
                className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
              >
                <td className="p-2 text-center font-bold text-muted-foreground">{ index + 1 }</td>

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
                          dispatch(updateVoucher({
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
                    min={ 0 }
                    max={ unpaidPrice + (row.amount ?? 0) }
                    value={ row.amount || "0" }
                    onChange={ (val) =>
                    {
                      if (val != undefined)
                      {
                        dispatch(updateVoucher({ ...row, amount: val }));
                      }
                    } }
                  />
                </td>

                <td className="p-2">
                  <NumberField
                    label=""
                    value={ row.amountReceived || "0" }
                    onChange={ (val) => dispatch(updateVoucher({ ...row, amountReceived: val })) }
                  />
                </td>

                <td className="p-2">
                  <NumberField
                    disabled
                    label=""
                    value={ (row.amountReceived ?? 0) - (row.amount ?? 0) || "0" }
                    onChange={ () =>
                    {} }
                  />
                </td>

                <td className="p-4 text-center align-top pt-5">
                  <button
                    type="button"
                    onClick={ () =>
                    {
                      dispatch(removeVoucher(row.voucherId));
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
