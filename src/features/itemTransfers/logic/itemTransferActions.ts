import type { ItemUnitPricingMethod, StoreItem } from "../../../core/data/item";
import type { ItemTransfersItem } from "../../../core/data/itemTransfer";
import type { AppDispatch } from "../../../core/state/store";
import { addItem, clearTransfer, initializeItems, removeItem, setErrors, type TransferRowItem, updatePricingMethod, updateQuantity } from "./itemTransferSlice";

export class ItemTransferActions
{
  public static initialize(dispatch: AppDispatch, items: ItemTransfersItem[])
  {
    dispatch(initializeItems(items));
  }

  public static addItem(
    dispatch: AppDispatch,
    storeItem: StoreItem,
    selectedIupm?: ItemUnitPricingMethod
  )
  {
    dispatch(addItem({ storeItem, selectedIupm }));
  }

  public static updateQuantity(dispatch: AppDispatch, id: string, quantity: number)
  {
    dispatch(updateQuantity({ id, quantity }));
  }

  public static updatePricingMethod(dispatch: AppDispatch, id: string, methodId: number)
  {
    dispatch(updatePricingMethod({ id, methodId }));
  }

  public static removeItem(dispatch: AppDispatch, id: string)
  {
    dispatch(removeItem(id));
  }

  public static validate(dispatch: AppDispatch, items: TransferRowItem[]): boolean
  {
    const errors: Record<string, string> = {};
    let isValid = true;

    if (items.length === 0)
    {
      errors["general"] = "يرجى إضافة مادة واحدة على الأقل للتحويل";
      isValid = false;
    }

    items.forEach((item) =>
    {
      if (!item.quantity || item.quantity <= 0)
      {
        errors[item.id] = "الكمية يجب أن تكون أكبر من 0";
        isValid = false;
      }
      else if (item.maxQuantity > 0 && item.quantity > item.maxQuantity)
      {
        errors[item.id] = `الكمية تتجاوز المتوفر (${item.maxQuantity})`;
        isValid = false;
      }

      if (!item.selectedPricingMethodId || item.selectedPricingMethodId === 0)
      {
        errors[`${item.id}_method`] = "يرجى اختيار طريقة التسعير";
        isValid = false;
      }
    });

    dispatch(setErrors(errors));
    return isValid;
  }

  public static clear(dispatch: AppDispatch)
  {
    dispatch(clearTransfer());
  }
}
