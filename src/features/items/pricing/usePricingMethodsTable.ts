import { useFormErrors } from "@yusr_systems/ui";
import { ItemSlice, ItemUnitPricingMethod } from "../../../core/data/item";
import { useAppDispatch, useAppSelector } from "../../../core/state/store";

export default function usePricingMethodsTable()
{
  const dispatch = useAppDispatch();
  const { formData, errors } = useAppSelector((state) => state.itemForm);
  const { getError, isInvalid } = useFormErrors(errors);
  const unitState = useAppSelector((state) => state.unit);
  const pricingMethodState = useAppSelector((state) => state.pricingMethod);

  const updatePricingMethod = (index: number, updates: Partial<ItemUnitPricingMethod>) =>
  {
    dispatch(ItemSlice.formActions.updateFormData((prev) =>
    {
      const list = [...(prev.itemUnitPricingMethods || [])];
      const iupm = { ...list[index] };

      const suggestName = `${updates.unitName || iupm.unitName || ""} ${
        updates.pricingMethodName || iupm.pricingMethodName || ""
      }`;

      if (updates.unitId === prev.sellUnitId)
      {
        updates.quantityMultiplier = 1;
      }

      list[index] = {
        ...iupm,
        ...updates,
        itemUnitPricingMethodName: updates.itemUnitPricingMethodName || suggestName
      };
      return { itemUnitPricingMethods: list };
    }));
  };

  const addPricingMethod = () =>
  {
    dispatch(ItemSlice.formActions.updateFormData((prev) => ({
      itemUnitPricingMethods: [...(prev.itemUnitPricingMethods || []), new ItemUnitPricingMethod()]
    })));
  };

  const removePricingMethod = (index: number) =>
  {
    dispatch(ItemSlice.formActions.updateFormData((prev) =>
    {
      const list = [...(prev.itemUnitPricingMethods || [])];
      list.splice(index, 1);
      return { itemUnitPricingMethods: list };
    }));
  };

  return {
    dispatch,
    formData,
    unitState,
    pricingMethodState,
    addPricingMethod,
    updatePricingMethod,
    removePricingMethod,
    isInvalid,
    getError
  };
}
