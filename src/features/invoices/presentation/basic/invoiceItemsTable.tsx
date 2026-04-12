import { SystemPermissions } from "@yusr_systems/core";
import { NumberField, SelectField, TextField } from "@yusr_systems/ui";
import { Trash2 } from "lucide-react";
import { SystemPermissionsActions } from "../../../../core/auth/systemPermissionsActions";
import { SystemPermissionsResources } from "../../../../core/auth/systemPermissionsResources";
import { InvoiceType } from "../../../../core/data/invoice";
import { useAppDispatch, useAppSelector } from "../../../../core/state/store";
import InvoiceItemsMath from "../../logic/invoiceItemsMath";
import { onInvoiceItemIupmChange, onInvoiceItemQuantityChange, onInvoiceItemSettlementChange, onInvoiceItemTaxInclusivePriceChange, removeItem, updateItem } from "../../logic/invoiceSliceUI";
import { ItemProfitDialog } from "../profit/ItemProfitDialog";
import EmptyTable from "./emptyTable";

export default function InvoiceItemsTable()
{
  const dispatch = useAppDispatch();
  const { items, errors, mode, type } = useAppSelector((state) => state.invoiceUI);
  const authState = useAppSelector((state) => state.auth);

  const getMaxAllowedQuantity = (storeQuantity: number) =>
  {
    if (type !== InvoiceType.Sell && type !== InvoiceType.Quotation)
    {
      return Number.MAX_SAFE_INTEGER;
    }

    return SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.InvoiceSellBeyondAvailableQuantity,
        SystemPermissionsActions.Get
      )
      ? Number.MAX_SAFE_INTEGER
      : storeQuantity;
  };

  const getMinAllowedTaxInclusivePrice = (originaltaxInclusivePrice: number) =>
  {
    if (type !== InvoiceType.Sell && type !== InvoiceType.Quotation)
    {
      return 0;
    }

    return SystemPermissions.hasAuth(
        authState.loggedInUser?.role?.permissions ?? [],
        SystemPermissionsResources.InvoiceSellBelowSellingPrice,
        SystemPermissionsActions.Get
      )
      ? 0
      : originaltaxInclusivePrice;
  };

  if (items.length === 0)
  {
    return <EmptyTable />;
  }
  return (
    <div className="w-full border border-border rounded-lg shadow-sm bg-background">
      <div className="max-h-100 overflow-y-auto overflow-x-auto 
        [&::-webkit-scrollbar]:w-1.5
        [&::-webkit-scrollbar-thumb]:bg-muted-foreground/50
        [&::-webkit-scrollbar-thumb]:rounded-full
      ">
        <table className="relative w-full text-sm text-right">
          <thead className="sticky top-0 bg-muted z-50 border-b border-border">
            <tr>
              <th className="p-3 font-semibold w-16 text-center text-muted-foreground">الرقم</th>
              <th className="p-3 font-semibold w-50 ">المادة</th>
              <th className="p-3 font-semibold w-40">طريقة التسعير</th>
              <th className="p-3 font-semibold w-30 ">التكلفة</th>
              <th className="p-3 font-semibold w-30">الكمية</th>
              <th className="p-3 font-semibold w-30 ">السعر بدون ضريبة</th>
              <th className="p-3 font-semibold w-30 ">نسبة الضريبة</th>
              <th className="p-3 font-semibold w-30 ">السعر بعد الضريبة</th>
              { SystemPermissions.hasAuth(
                authState.loggedInUser?.role?.permissions ?? [],
                SystemPermissionsResources.InvoiceAddSettlement,
                SystemPermissionsActions.Get
              ) && <th className="p-3 font-semibold w-30 ">التسوية</th> }

              <th className="p-3 font-semibold w-30 ">التكلفة النهائية</th>
              <th className="p-3 font-semibold w-30 ">السعر النهائي بدون ضريبة</th>
              <th className="p-3 font-semibold w-24 ">السعر النهائي مع ضريبة</th>
              { SystemPermissions.hasAuth(
                authState.loggedInUser?.role?.permissions ?? [],
                SystemPermissionsResources.InvoiceShowItemProfit,
                SystemPermissionsActions.Get
              ) && <th className="p-4 font-semibold w-3 text-center"></th> }

              <th className="p-4 font-semibold w-3 text-center"></th>
            </tr>
          </thead>
          <tbody>
            { items.map((row, index) => (
              <>
                <tr
                  key={ row.id }
                  className="border-border last:border-0 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-2 pt-2 text-center font-bold text-muted-foreground">{ index + 1 }</td>

                  <td className="px-2 pt-2">
                    <div className="font-semibold text-foreground">{ row.itemName }</div>
                  </td>

                  <td className="px-2 pt-2">
                    <SelectField
                      label=""
                      value={ row.itemUnitPricingMethodId?.toString() || "" }
                      onValueChange={ (val: string) =>
                        dispatch(onInvoiceItemIupmChange({ index: index, iupmId: Number(val) })) }
                      options={ row.itemUnitPricingMethods?.map((m) => ({
                        label: `${m.pricingMethodName || "بدون"} ${m.unitName || "بدون"}`,
                        value: m.id.toString()
                      })) || [] }
                      placeholder="اختر طريقة التسعير"
                      isInvalid={ !!errors[`${row.id}_method`] }
                      disabled={ mode === "update" }
                    />
                  </td>

                  <td className="px-2 pt-2">
                    <NumberField disabled label="" value={ row.cost || "0" } />
                  </td>

                  <td className="px-2 pt-2">
                    <NumberField
                      label=""
                      min={ 1 }
                      max={ getMaxAllowedQuantity(row.originalQuantity) }
                      value={ row.quantity ?? 1 }
                      onChange={ (newValue) =>
                        dispatch(onInvoiceItemQuantityChange({ index: index, newQtn: newValue })) }
                      disabled={ mode === "update" }
                    />
                  </td>

                  <td className="px-2 pt-2">
                    <NumberField
                      label=""
                      disabled
                      value={ row.taxExclusivePrice || "0" }
                      onChange={ () =>
                      {} }
                    />
                  </td>

                  <td className="px-2 pt-2">
                    <TextField label="" value={ row.totalTaxesPerc || "0" } disabled />
                  </td>

                  <td className="px-2 pt-2">
                    <NumberField
                      label=""
                      min={ getMinAllowedTaxInclusivePrice(row.originaltaxInclusivePrice) }
                      value={ row.taxInclusivePrice || "0" }
                      onChange={ (newVal) =>
                        dispatch(onInvoiceItemTaxInclusivePriceChange({ index: index, newPrice: Number(newVal) })) }
                    />
                  </td>

                  { SystemPermissions.hasAuth(
                    authState.loggedInUser?.role?.permissions ?? [],
                    SystemPermissionsResources.InvoiceAddSettlement,
                    SystemPermissionsActions.Get
                  ) && (
                    <td className="px-2 pt-2">
                      <NumberField
                        label=""
                        value={ row.settlement || "0" }
                        onChange={ (newValue) =>
                        {
                          dispatch(onInvoiceItemSettlementChange({ index: index, newSettlement: Number(newValue) }));
                        } }
                      />
                    </td>
                  ) }

                  <td className="px-2 pt-2">
                    <TextField
                      label=""
                      value={ InvoiceItemsMath.CalcTotalCost(row.cost, row.quantity) || "0" }
                      disabled
                    />
                  </td>

                  <td className="px-2 pt-2">
                    <TextField
                      label=""
                      value={ row.taxExclusiveTotalPrice || "0" }
                      disabled
                    />
                  </td>

                  <td className="px-2 pt-2">
                    <TextField
                      label=""
                      value={ row.taxInclusiveTotalPrice || "0" }
                      disabled
                    />
                  </td>

                  { SystemPermissions.hasAuth(
                    authState.loggedInUser?.role?.permissions ?? [],
                    SystemPermissionsResources.InvoiceShowItemProfit,
                    SystemPermissionsActions.Get
                  ) && (
                    <td className="px-2 pt-2">
                      <ItemProfitDialog item={ row } />
                    </td>
                  ) }

                  <td className="px-2 pt-2">
                    { mode === "create" && (
                      <button
                        type="button"
                        onClick={ () =>
                        {
                          dispatch(removeItem(index));
                        } }
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-500/10 rounded-md transition-colors"
                        aria-label="حذف المادة"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    ) }
                  </td>
                </tr>
                <tr className="bg-muted/10 border-b">
                  <td colSpan={ 14 } className="px-5 pt-1 pb-3">
                    <TextField
                      label=""
                      placeholder="أضف ملاحظات..."
                      value={ row.notes || "" }
                      onChange={ (val) =>
                      {
                        dispatch(
                          updateItem({
                            index: index,
                            item: { ...row, notes: typeof val === "string" ? val : val.target.value }
                          })
                        );
                      } }
                    />
                  </td>
                </tr>
              </>
            )) }
          </tbody>
        </table>
      </div>
    </div>
  );
}
