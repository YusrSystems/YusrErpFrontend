import { Button, DateField, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, FormField, SearchableSelect, SelectField } from "@yusr_systems/ui";
import { useState } from "react";
import { ItemSlice } from "../../core/data/item";
import { ItemsTaxStatementReportRequest, ItemsTaxStatementReportType } from "../../core/data/report/itemsTaxStatementReportRequest";
import ReportConstants from "../../core/data/report/reportConstants";
import { StoreFilterColumns } from "../../core/data/store";
import { useAppDispatch, useAppSelector } from "../../core/state/store";
import ReportButton from "./reportButton";

export default function ItemsTaxStatementDialog()
{
  const dispatch = useAppDispatch();
  const itemState = useAppSelector((state) => state.item);
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<ItemsTaxStatementReportType>(ItemsTaxStatementReportType.Sales);
  const [itemId, setItemId] = useState<number | undefined>(undefined);
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);

  return (
    <>
      <Button variant="outline" size="sm" onClick={ () => setIsOpen(true) }>
        إنشاء
      </Button>
      <Dialog open={ isOpen } onOpenChange={ setIsOpen }>
        <DialogContent dir="rtl" className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>كشف ضريبة المواد</DialogTitle>
            <DialogDescription>تفاصيل الضريبة لكل مادة</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <SelectField
              label="نوع الفاتورة"
              required
              value={ type.toString() || "" }
              onValueChange={ (val) => setType(Number(val) as ItemsTaxStatementReportType) }
              options={ [{ label: "تقرير ضرائب المبيعات", value: ItemsTaxStatementReportType.Sales.toString() }, {
                label: "تقرير ضرائب المشتريات",
                value: ItemsTaxStatementReportType.Purchases.toString()
              }] }
            />
            <FormField label="المادة" required={ true }>
              <SearchableSelect
                items={ itemState.entities.data ?? [] }
                itemLabelKey="name"
                itemValueKey="id"
                showAllOption
                value={ itemId?.toString() || "" }
                onValueChange={ (val) => setItemId(Number(val)) }
                columnsNames={ StoreFilterColumns.columnsNames }
                onSearch={ (condition) => dispatch(ItemSlice.entityActions.filter(condition)) }
                disabled={ itemState.isLoading }
              />
            </FormField>
            <DateField
              label="من تاريخ"
              value={ fromDate ?? undefined }
              onChange={ (date) => setFromDate(date ?? undefined) }
            />
            <DateField
              label="إلى تاريخ"
              value={ toDate ?? undefined }
              onChange={ (date) => setToDate(date ?? undefined) }
            />
          </div>

          <DialogFooter>
            <ReportButton
              reportName={ ReportConstants.ItemTaxStatement }
              request={ new ItemsTaxStatementReportRequest({ fromDate: fromDate, toDate: toDate, itemId: itemId, type: type }) }
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
