import { Button, Checkbox, FormField, NumberField, SearchableSelect } from "@yusr_systems/ui";
import { Plus } from "lucide-react";
import { ItemType, ItemUnitPricingMethod } from "../../../core/data/item";
import { UnitFilterColumns, UnitSlice } from "../../../core/data/unit";
import { useAppDispatch, useAppSelector } from "../../../core/state/store";
import { useItemContext } from "../itemContext";
import PricingMethodsTable from "./pricingMethodsTable";

export default function PricingTab()
{
  const { formData, handleChange, isInvalid, getError } = useItemContext();
  const unitState = useAppSelector((state) => state.unit);
  const dispatch = useAppDispatch();

  const addPricingMethod = () =>
    handleChange({
      itemUnitPricingMethods: [...(formData.itemUnitPricingMethods || []), new ItemUnitPricingMethod()]
    });

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
            disabled={ unitState.isLoading || formData.type === ItemType.Service }
          />
        </FormField>

        <NumberField
          label="التكلفة المبدئية"
          required
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

        <PricingMethodsTable />
      </div>
    </div>
  );
}
