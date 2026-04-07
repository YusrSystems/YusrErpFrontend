import { Button, Checkbox, FormField, NumberField, SearchableSelect, TextField } from "@yusr_systems/ui";
import { Plus, Trash2 } from "lucide-react";
import { ItemType, ItemUnitPricingMethod } from "../../../core/data/item";
import { PricingMethodFilterColumns, PricingMethodSlice } from "../../../core/data/pricingMethod";
import { UnitFilterColumns, UnitSlice } from "../../../core/data/unit";
import { useAppDispatch, useAppSelector } from "../../../core/state/store";
import { useItemContext } from "../itemContext";

export default function PricingTab()
{
  const { formData, handleChange, isInvalid, getError, mode } = useItemContext();
  const unitState = useAppSelector((state) => state.unit);
  const dispatch = useAppDispatch();

  const pricingMethodState = useAppSelector((state) => state.pricingMethod);

  const addPricingMethod = () =>
    handleChange({
      itemUnitPricingMethods: [...(formData.itemUnitPricingMethods || []), new ItemUnitPricingMethod()]
    });
  const updatePricingMethod = (
    index: number,
    updates: Partial<ItemUnitPricingMethod>
  ) =>
  {
    const list = [...(formData.itemUnitPricingMethods || [])];
    let iupm = list[index];
    let suggestName = `${updates.unitName || iupm.unitName || ""} ${
      updates.pricingMethodName || iupm.pricingMethodName || ""
    }`;
    iupm.itemUnitPricingMethodName = updates.itemUnitPricingMethodName || suggestName;
    list[index] = { ...list[index], ...updates };
    handleChange({ itemUnitPricingMethods: list });
  };
  const removePricingMethod = (index: number) =>
  {
    const list = [...(formData.itemUnitPricingMethods || [])];
    list.splice(index, 1);
    handleChange({ itemUnitPricingMethods: list });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="grid grid-cols-3 gap-6">
        <FormField
          label="الوحدة الأساسية للمادة"
          required
          isInvalid={ isInvalid("storeId") }
          error={ getError("storeId") }
        >
          <SearchableSelect
            items={ unitState.entities.data ?? [] }
            itemLabelKey="unitName"
            itemValueKey="id"
            value={ formData.sellUnitId?.toString() || "" }
            onValueChange={ (val) =>
            {
              const selected = unitState.entities.data?.find(
                (u) => u.id.toString() === val
              );
              handleChange({
                sellUnitId: selected?.id,
                sellUnitName: selected?.unitName
              });
            } }
            columnsNames={ UnitFilterColumns.columnsNames }
            onSearch={ (condition) => dispatch(UnitSlice.entityActions.filter(condition)) }
            disabled={ unitState.isLoading || formData.type === ItemType.Service || mode === "update" }
          />
        </FormField>

        <NumberField
          label="التكلفة المبدئية"
          required
          disabled={ mode === "update" }
          value={ formData.initialCost || 0 }
          onChange={ (val) => handleChange({ initialCost: val }) }
        />
        <NumberField
          label="التكلفة"
          disabled
          value={ formData.cost || 0 }
          onChange={ (val) => handleChange({ cost: val }) }
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="rememberMe"
          checked={ formData.taxIncluded }
          onCheckedChange={ (checked) => handleChange({ taxIncluded: checked as boolean }) }
        />
        <label htmlFor="taxIncluded" className="text-sm font-bold">
          سعر البيع يشمل الضريبة
        </label>
      </div>

      <div className="pt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold">طرق التسعير</h3>
          <Button type="button" size="sm" onClick={ addPricingMethod }>
            <Plus className="w-4 h-4 ml-2" /> إضافة طريقة تسعير
          </Button>
        </div>

        <div className="bg-muted/20 rounded-lg border overflow-hidden overflow-x-auto">
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
                <th className="p-3 w-12 text-center"></th>
              </tr>
            </thead>
            <tbody>
              { formData.itemUnitPricingMethods?.map((method, index) => (
                <tr key={ index } className="border-t border-muted">
                  <td className="p-3 font-bold">{ index + 1 }</td>
                  <td className="p-3">
                    <FormField label="">
                      <SearchableSelect
                        items={ unitState.entities.data ?? [] }
                        itemLabelKey="unitName"
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
                            unitName: selected?.unitName
                          });
                        } }
                        columnsNames={ UnitFilterColumns.columnsNames }
                        onSearch={ (condition) =>
                          dispatch(UnitSlice.entityActions.filter(condition)) }
                        disabled={ unitState.isLoading
                          || formData.type === ItemType.Service }
                      />
                    </FormField>
                  </td>
                  <td className="p-3">
                    <FormField label="">
                      <SearchableSelect
                        items={ pricingMethodState.entities.data ?? [] }
                        itemLabelKey="pricingMethodName"
                        itemValueKey="id"
                        value={ method.pricingMethodId?.toString() || "" }
                        onValueChange={ (val) =>
                        {
                          const selected = pricingMethodState.entities.data?.find(
                            (p) => p.id.toString() === val
                          );
                          updatePricingMethod(index, {
                            pricingMethodId: selected?.id,
                            pricingMethodName: selected?.pricingMethodName
                          });
                        } }
                        columnsNames={ PricingMethodFilterColumns.columnsNames }
                        onSearch={ (condition) =>
                          dispatch(
                            PricingMethodSlice.entityActions.filter(condition)
                          ) }
                        disabled={ pricingMethodState.isLoading
                          || formData.type === ItemType.Service }
                      />
                    </FormField>
                  </td>
                  <td className="p-3">
                    <NumberField
                      label=""
                      min={ 1 }
                      disabled={ method.unitId === formData.sellUnitId }
                      value={ method.quantityMultiplier || 1 }
                      onChange={ (val) =>
                        updatePricingMethod(index, {
                          quantityMultiplier: val
                        }) }
                    />
                  </td>
                  <td className="p-3">
                    <NumberField
                      label=""
                      min={ 0 }
                      value={ method.price || 0 }
                      onChange={ (val) => updatePricingMethod(index, { price: val }) }
                    />
                  </td>
                  <td className="p-3">
                    <TextField
                      label=""
                      value={ method.barcode || "" }
                      onChange={ (e) =>
                        updatePricingMethod(index, {
                          barcode: e.target.value
                        }) }
                    />
                  </td>
                  <td className="p-3">
                    <TextField
                      label=""
                      value={ method.itemUnitPricingMethodName || "" }
                      onChange={ (e) =>
                        updatePricingMethod(index, {
                          itemUnitPricingMethodName: e.target.value
                        }) }
                    />
                  </td>
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
      </div>
    </div>
  );
}
