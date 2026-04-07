import { ItemUnitPricingMethod } from "../../../core/data/item";
import { useAppDispatch, useAppSelector } from "../../../core/state/store";
import { useItemContext } from "../itemContext";

export default function usePricingMethodsTable()
{
  const dispatch = useAppDispatch();
  const { formData, handleChange, isInvalid, getError } = useItemContext();
  const unitState = useAppSelector((state) => state.unit);
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

    if (updates.unitId === formData.sellUnitId)
    {
      updates.quantityMultiplier = 1;
    }

    list[index] = { ...list[index], ...updates };
    handleChange({ itemUnitPricingMethods: list });
  };

  const removePricingMethod = (index: number) =>
  {
    const list = [...(formData.itemUnitPricingMethods || [])];
    list.splice(index, 1);
    handleChange({ itemUnitPricingMethods: list });
  };

  return {
    dispatch,
    formData,
    handleChange,
    unitState,
    pricingMethodState,
    addPricingMethod,
    updatePricingMethod,
    removePricingMethod,
    isInvalid,
    getError
  };
}
