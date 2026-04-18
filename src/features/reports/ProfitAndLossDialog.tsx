import { Button, DateField, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@yusr_systems/ui";
import { useState } from "react";
import { InvoicesListReportRequest, InvoicesListReportType } from "../../core/data/report/invoicesListReportType";
import ReportConstants from "../../core/data/report/reportConstants";
import ReportButton from "./reportButton";

export default function ProfitAndLossDialog()
{
  const [isOpen, setIsOpen] = useState(false);
  const [fromDate, setFromDate] = useState<Date>(() =>
  {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  });
  const [toDate, setToDate] = useState<Date>(new Date());

  return (
    <>
      <Button variant="outline" size="sm" onClick={ () => setIsOpen(true) }>
        إنشاء
      </Button>
      <Dialog open={ isOpen } onOpenChange={ setIsOpen }>
        <DialogContent dir="rtl" className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>الأرباح والخسائر</DialogTitle>
            <DialogDescription>ملخص الإيرادات والمصروفات وصافي الربح</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <DateField
              label="من تاريخ"
              value={ fromDate }
              onChange={ (date) => date && setFromDate(date) }
            />
            <DateField
              label="إلى تاريخ"
              value={ toDate }
              onChange={ (date) => date && setToDate(date) }
            />
          </div>

          <DialogFooter>
            <ReportButton
              reportName={ ReportConstants.InvoicesList }
              request={ new InvoicesListReportRequest({
                fromDate,
                toDate,
                reportType: InvoicesListReportType.ProfitAndLoss
              }) }
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
