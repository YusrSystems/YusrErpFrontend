import { Checkbox, type DialogMode, FormField, NumberField, SearchableSelect, useFormErrors } from "@yusr_systems/ui";
import { ItemSlice, ItemType } from "../../../core/data/item";
import { UnitFilterColumns, UnitSlice } from "../../../core/data/unit";
import { useAppDispatch, useAppSelector } from "../../../core/state/store";
import PricingMethodsTable from "./pricingMethodsTable";

export default function PricingTab({ mode }: { mode: DialogMode; })
{
  const { formData, errors } = useAppSelector((state) => state.itemForm);
  const { getError, isInvalid } = useFormErrors(errors);
  const unitState = useAppSelector((state) => state.unit);
  const dispatch = useAppDispatch();

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="grid grid-cols-3 gap-6">
        <FormField
          label="الوحدة الأساسية للمادة"
          required={ formData.type !== ItemType.Service }
          isInvalid={ isInvalid("sellUnitId") }
          error={ getError("sellUnitId") }
        >
          <SearchableSelect
            items={ unitState.entities.data ?? [] }
            itemLabelKey="name"
            itemValueKey="id"
            value={ formData.sellUnitId?.toString() || "" }
            onValueChange={ (val) =>
            {
              const selected = unitState.entities.data?.find(
                (u) => u.id.toString() === val
              );
              dispatch(ItemSlice.formActions.updateFormData({
                sellUnitId: selected?.id,
                sellUnitName: selected?.name
              }));
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
          value={ formData.initialCost ?? "0" }
          onChange={ (val) => dispatch(ItemSlice.formActions.updateFormData({ initialCost: val })) }
          isInvalid={ isInvalid("initialCost") }
          error={ getError("initialCost") }
        />
        <NumberField
          label="التكلفة"
          disabled
          value={ formData.cost || "0" }
          onChange={ (val) => dispatch(ItemSlice.formActions.updateFormData({ cost: val })) }
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="rememberMe"
          checked={ formData.taxIncluded }
          onCheckedChange={ (checked) =>
            dispatch(ItemSlice.formActions.updateFormData({ taxIncluded: checked as boolean })) }
        />
        <label htmlFor="taxIncluded" className="text-sm font-bold">
          سعر البيع يشمل الضريبة
        </label>
      </div>

      <PricingMethodsTable />
    </div>
  );
}
