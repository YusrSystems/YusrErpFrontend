import { cn, SearchableSelect } from "@yusr_systems/ui";
import { ScanBarcode, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { ItemFilterColumns } from "../../core/data/item";

interface ItemAdderSectionProps
{
  storeId?: number;
  onChange: (value: string) => void;
}
export default function ItemAdderSection({ storeId, onChange }: ItemAdderSectionProps)
{
  const [barcode, setBarcode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleBarcodeKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) =>
  {
    if (e.key === "Enter" && barcode.trim() !== "")
    {
      e.preventDefault();

      if (!storeId)
      {
        return;
      }

      setIsLoading(true);
      try
      {
        const response = await itemsService.GetByBarcode(barcode.trim(), fromStoreId);

        if (response.status === 200 && response.data?.storeItem)
        {
          handleAddItem(response.data.storeItem, response.data.selectedIupm?.id);
          setBarcode("");
        }
        else
        {
          alert("لم يتم العثور على الصنف بهذا الباركود في المستودع المحدد");
        }
      }
      finally
      {
        setIsLoading(false);
      }
    }
  };

  return (
    <div
      className={ cn(
        "flex flex-col gap-4 w-full transition-all duration-300",
        !storeId && "opacity-60 pointer-events-none blur-[2px]"
      ) }
    >
      { /* 1. قسم إضافة المواد */ }
      <div className="flex items-center justify-start gap-6 p-4 rounded-lg border border-border bg-muted/10 shadow-sm">
        <div className="flex items-center gap-2 font-bold text-lg text-foreground">
          <ShoppingCart className="h-5 w-5" />
          <span>إضافة مواد:</span>
        </div>

        <div className="relative w-64">
          <input
            type="text"
            placeholder="اقرأ الباركود..."
            value={ barcode }
            onChange={ (e) => setBarcode(e.target.value) }
            onKeyDown={ handleBarcodeKeyDown }
            disabled={ isLoading }
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
          />
          <ScanBarcode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>

        <div className="w-80">
          <SearchableSelect
            value={ "" }
            items={ dropdownItems }
            itemLabelKey="name"
            itemValueKey="id"
            placeholder="اختر مادة..."
            columnsNames={ ItemFilterColumns.columnsNames }
            onSearch={ (condition) => loadStoreItems(condition) }
            disabled={ isLoading }
            onValueChange={ (val) =>
            {
              onChange(val);
            } }
          />
        </div>
      </div>
      <div />
    </div>
  );
}
