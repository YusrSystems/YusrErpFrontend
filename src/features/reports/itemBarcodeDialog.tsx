// accountStatementDialog.tsx
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, NumberField } from "@yusr_systems/ui";
import { ScanBarcode } from "lucide-react";
import { useState } from "react";
import type Item from "../../core/data/item";
import type { ItemUnitPricingMethod } from "../../core/data/item";
import ReportConstants from "../../core/data/report/reportConstants";
import { useAppSelector } from "../../core/state/store";
import ReportButton from "./reportButton";

export default function ItemBarcodeButton({ item, iupm }: { item: Item; iupm: ItemUnitPricingMethod; })
{
  const [isOpen, setIsOpen] = useState(false);
  const [pages, setPages] = useState<number>(1);
  const [barcodesQtn, setBarcodesQtn] = useState<number>(1);
  const authState = useAppSelector((state) => state.auth);

  return (
    <>
      <Button variant="ghost" size="sm" onClick={ () => setIsOpen(true) }>
        <ScanBarcode />
      </Button>

      <Dialog open={ isOpen } onOpenChange={ setIsOpen }>
        <DialogContent dir="rtl" className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>باركود المادة</DialogTitle>
            <DialogDescription>{ item.name } - { iupm.itemUnitPricingMethodName }</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <NumberField
              label="عدد الباركودات"
              min={ 1 }
              step={ 1 }
              value={ barcodesQtn }
              onChange={ (num) => num && setBarcodesQtn(num) }
            />

            <NumberField
              label="عدد الصفحات"
              value={ pages }
              onChange={ (num) =>
              {
                if (num == undefined)
                {
                  return;
                }

                setPages(num);
                setBarcodesQtn(num * 40);
              } }
            />
          </div>
          <DialogFooter>
            <ReportButton
              reportName={ ReportConstants.ItemBarcode }
              request={ {
                barcode: iupm.barcode,
                companyName: authState.setting?.companyName,
                itemName: item.name,
                iupmName: iupm.itemUnitPricingMethodName,
                price: iupm.price,
                barcodesQtn: barcodesQtn,
                currency: authState.setting?.currency?.name
              } }
            >
            </ReportButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
