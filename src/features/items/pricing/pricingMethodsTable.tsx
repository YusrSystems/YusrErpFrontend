import { SystemPermissions } from "@yusr_systems/core";
import { Button, FormField, NumberField, SearchableSelect, TextField } from "@yusr_systems/ui";
import { Plus, Trash2 } from "lucide-react";
import { SystemPermissionsActions } from "../../../core/auth/systemPermissionsActions";
import { SystemPermissionsResources } from "../../../core/auth/systemPermissionsResources";
import Item, { ItemType } from "../../../core/data/item";
import { PricingMethodFilterColumns, PricingMethodSlice } from "../../../core/data/pricingMethod";
import { UnitFilterColumns, UnitSlice } from "../../../core/data/unit";
import { useAppSelector } from "../../../core/state/store";
import ItemBarcodeButton from "../../reports/itemBarcodeDialog";
import usePricingMethodsTable from "./usePricingMethodsTable";

export default function PricingMethodsTable()
{
  const {
    dispatch,
    formData,
    unitState,
    pricingMethodState,
    addPricingMethod,
    updatePricingMethod,
    removePricingMethod,
    isInvalid,
    getError
  } = usePricingMethodsTable();

  const hasError = isInvalid("itemUnitPricingMethods");
  const errorMessage = getError("itemUnitPricingMethods");
  const authState = useAppSelector((state) => state.auth);
  const isService = formData.type === ItemType.Service;

  return (
    <div className="pt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">طرق التسعير</h3>
        <Button type="button" size="sm" onClick={ addPricingMethod }>
          <Plus className="w-4 h-4 ml-2" /> إضافة طريقة تسعير
        </Button>
      </div>

      <div
        className={ `bg-muted/20 rounded-lg border overflow-hidden overflow-x-auto transition-colors ${
          hasError ? "border-red-500/50" : ""
        }` }
      >
        <table className="w-full text-sm text-right min-w-200">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="p-3 w-12">الرقم</th>
              <th className="p-3 w-32">الوحدة</th>
              <th className="p-3 w-40">طريقة التسعير</th>
              <th className="p-3 w-32">الكمية في الوحدة</th>
              <th className="p-3 w-32">سعر البيع</th>
              <th className="p-3 w-40">الباركود</th>
              <th className="p-3 w-40">الاسم</th>
              { SystemPermissions.hasAuth(
                authState.loggedInUser?.role?.permissions ?? [],
                SystemPermissionsResources.ReportItemBarcode,
                SystemPermissionsActions.Get
              ) && <th className="p-3 w-12 text-center"></th> }
              <th className="p-3 w-12 text-center"></th>
            </tr>
          </thead>
          <tbody>
            { formData.itemUnitPricingMethods?.map((method, index) => (
              <tr key={ index } className="border-t border-muted">
                <td className="p-3 font-bold">{ index + 1 }</td>
                <td className="p-3">
                  <FormField
                    label=""
                    isInvalid={ hasError && !isService && !method.unitId }
                  >
                    <SearchableSelect
                      items={ unitState.entities.data ?? [] }
                      itemLabelKey="name"
                      itemValueKey="id"
                      value={ method.unitId?.toString() || "" }
                      onValueChange={ (val) =>
                      {
                        const selected = unitState.entities.data?.find(
                          (u) =>
                            u.id.toString() === val
                        );
                        updatePricingMethod(index, {
                          unitId: selected?.id,
                          unitName: selected?.name
                        });
                      } }
                      columnsNames={ UnitFilterColumns.columnsNames }
                      onSearch={ (condition) =>
                        dispatch(UnitSlice.entityActions.filter(condition)) }
                      disabled={ unitState.isLoading || isService }
                    />
                  </FormField>
                </td>
                <td className="p-3">
                  <FormField
                    label=""
                    isInvalid={ hasError && !isService && !method.pricingMethodId }
                  >
                    <SearchableSelect
                      items={ pricingMethodState.entities.data ?? [] }
                      itemLabelKey="name"
                      itemValueKey="id"
                      value={ method.pricingMethodId?.toString() || "" }
                      onValueChange={ (val) =>
                      {
                        const selected = pricingMethodState.entities.data?.find(
                          (p) => p.id.toString() === val
                        );
                        updatePricingMethod(index, {
                          pricingMethodId: selected?.id,
                          pricingMethodName: selected?.name
                        });
                      } }
                      columnsNames={ PricingMethodFilterColumns.columnsNames }
                      onSearch={ (condition) => dispatch(PricingMethodSlice.entityActions.filter(condition)) }
                      disabled={ pricingMethodState.isLoading || isService }
                    />
                  </FormField>
                </td>
                <td className="p-3">
                  <NumberField
                    label=""
                    min={ 1 }
                    disabled={ method.unitId === formData.sellUnitId }
                    value={ method.quantityMultiplier || 1 }
                    onChange={ (val) => updatePricingMethod(index, { quantityMultiplier: val }) }
                    isInvalid={ hasError && (!method.quantityMultiplier || method.quantityMultiplier <= 0) }
                  />
                </td>
                <td className="p-3">
                  <NumberField
                    label=""
                    min={ 0 }
                    value={ method.price ?? "0" }
                    onChange={ (val) => updatePricingMethod(index, { price: val }) }
                    isInvalid={ hasError && (method.price === undefined || method.price === null || method.price < 0) }
                  />
                </td>
                <td className="p-3">
                  <TextField
                    label=""
                    value={ method.barcode || "" }
                    onChange={ (e) => updatePricingMethod(index, { barcode: e.target.value }) }
                  />
                </td>
                <td className="p-3">
                  <TextField
                    label=""
                    value={ method.itemUnitPricingMethodName || "" }
                    onChange={ (e) => updatePricingMethod(index, { itemUnitPricingMethodName: e.target.value }) }
                  />
                </td>

                { SystemPermissions.hasAuth(
                  authState.loggedInUser?.role?.permissions ?? [],
                  SystemPermissionsResources.ReportItemBarcode,
                  SystemPermissionsActions.Get
                ) && (
                  <td className="p-3 text-center">
                    <ItemBarcodeButton item={ formData as Item } iupm={ method } />
                  </td>
                ) }

                <td className="p-3 text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-100"
                    onClick={ () => removePricingMethod(index) }
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            )) }
          </tbody>
        </table>
        { formData.itemUnitPricingMethods?.length === 0 && (
          <div className="p-4 text-center text-muted-foreground">
            لا توجد طرق تسعير مضافة
          </div>
        ) }
      </div>

      { hasError && errorMessage && (
        <div className="text-xs font-medium text-red-500 mt-2 animate-in fade-in slide-in-from-top-1">
          { errorMessage }
        </div>
      ) }
    </div>
  );
}
