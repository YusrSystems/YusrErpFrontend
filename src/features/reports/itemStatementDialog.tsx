// accountStatementDialog.tsx
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, FormField, SearchableSelect } from "@yusr_systems/ui";
import { useState } from "react";
import type Item from "../../core/data/item";
import ReportConstants from "../../core/data/report/reportConstants";
import { StoreFilterColumns, StoreSlice } from "../../core/data/store";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import ReportButton from "./reportButton";

export default function ItemStatementButton({ item }: { item: Item; })
{
  const dispatch = useAppDispatch();
  const storeState = useAppSelector((state) => state.store);

  const [isOpen, setIsOpen] = useState(false);
  const [storeId, setStoreId] = useState<number | undefined>(undefined);

  return (
    <>
      <Button variant="outline" size="sm" onClick={ () => setIsOpen(true) }>
        كشف المادة
      </Button>

      <Dialog open={ isOpen } onOpenChange={ setIsOpen }>
        <DialogContent dir="rtl" className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>كشف مادة</DialogTitle>
            <DialogDescription>{ item.name }</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <FormField label="المستودع" required={ true }>
              <SearchableSelect
                items={ storeState.entities.data ?? [] }
                itemLabelKey="name"
                itemValueKey="id"
                showAllOption
                value={ storeId?.toString() || "" }
                onValueChange={ (val) => setStoreId(Number(val)) }
                columnsNames={ StoreFilterColumns.columnsNames }
                onSearch={ (condition) => dispatch(StoreSlice.entityActions.filter(condition)) }
                disabled={ storeState.isLoading }
              />
            </FormField>
          </div>
          <DialogFooter>
            <ReportButton
              reportName={ ReportConstants.ItemStatement }
              request={ { itemId: item.id, storeId: storeId } }
            >
            </ReportButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
