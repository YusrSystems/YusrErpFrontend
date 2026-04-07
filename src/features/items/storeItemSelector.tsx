import { SearchableSelect } from "@yusr_systems/ui";
import { ScanBarcode, ShoppingCart } from "lucide-react";
import { useEffect } from "react";
import { ItemFilterColumns, ItemType, ItemUnitPricingMethod, type StoreItem } from "../../core/data/item";
import { GetItemByBarcode } from "../../core/state/shared/itemBarcodeSlice";
import { fetchStoreItems } from "../../core/state/shared/storeItemsSlice";
import { useAppDispatch, useAppSelector } from "../../core/state/store";

interface StoreItemSelectorProps
{
  storeId?: number;
  itemType?: ItemType;
  onSelect?: (item: StoreItem, selectedIupm?: ItemUnitPricingMethod) => void;
}

export default function StoreItemSelector({ storeId, itemType, onSelect }: StoreItemSelectorProps)
{
  const dispatch = useAppDispatch();
  const storeItemsState = useAppSelector((state) => state.storeItems);
  const itemBarcodeState = useAppSelector((state) => state.itemBarcode);

  const items = () => {
    console.log(storeItemsState.storeItems)
    return storeItemsState.storeItems.map((i) => i.item)
  };

  useEffect(() =>
  {
    if (itemBarcodeState.barcodeResult)
    {
      onSelect?.(itemBarcodeState.barcodeResult.storeItem, itemBarcodeState.barcodeResult.selectedIupm);
    }
  }, [itemBarcodeState.barcodeResult]);

  return (
    <div className="flex items-center justify-start gap-6 p-4 rounded-lg border border-border bg-muted/10 shadow-sm">
      <div className="flex items-center gap-2 font-bold text-lg text-foreground">
        <ShoppingCart className="h-5 w-5" />
        <span>إضافة مواد:</span>
      </div>

      <div className="relative w-64">
        <input
          type="text"
          placeholder="اقرأ الباركود..."
          onChange={ (e) =>
          {
            if (itemType && storeId)
            {
              dispatch(
                GetItemByBarcode({ barcode: e.target.value, storeId: storeId })
              );
            }
          } }
          disabled={ storeItemsState.isLoading }
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
        />
        <ScanBarcode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>

      <div className="w-80">
        <SearchableSelect
          value={ "" }
          items={ items() }
          itemLabelKey="name"
          itemValueKey="id"
          placeholder="اختر مادة..."
          columnsNames={ ItemFilterColumns.columnsNames }
          onSearch={ (condition) =>
          {
            if (itemType && storeId)
            {
              dispatch(
                fetchStoreItems({
                  pageNumber: 1,
                  rowsPerPage: 10,
                  itemType: itemType,
                  storeId: storeId,
                  condition: condition
                })
              );
            }
          } }
          disabled={ storeItemsState.isLoading }
          onValueChange={ (val) =>
          {
            const selected = storeItemsState.storeItems.find((di) => di.item.id.toString() === val);
            if (selected)
            {
              onSelect?.(selected);
            }
          } }
        />
      </div>
    </div>
  );
}
