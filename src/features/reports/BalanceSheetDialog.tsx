import { Button, DateField, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@yusr_systems/ui";
import { useState } from "react";
import { BalanceSheetReportRequest } from "../../core/data/report/balanceSheetReportRequest";
import ReportConstants from "../../core/data/report/reportConstants";
import ReportButton from "./reportButton";

export default function BalanceSheetDialog()
{
  const [isOpen, setIsOpen] = useState(false);
  const [toDate, setToDate] = useState<Date>(new Date());

  return (
    <>
      <Button variant="outline" size="sm" onClick={ () => setIsOpen(true) }>
        إنشاء
      </Button>
      <Dialog open={ isOpen } onOpenChange={ setIsOpen }>
        <DialogContent dir="rtl" className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>الميزانية العمومية</DialogTitle>
            <DialogDescription>عرض الأصول والخصوم وحقوق الملكية</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <DateField
              label="حتى تاريخ"
              value={ toDate }
              onChange={ (date) => date && setToDate(date) }
            />
          </div>

          <DialogFooter>
            <ReportButton
              reportName={ ReportConstants.BalanceSheet }
              request={ new BalanceSheetReportRequest({ toDate }) }
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
