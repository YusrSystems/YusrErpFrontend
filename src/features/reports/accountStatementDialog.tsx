// accountStatementDialog.tsx
import { Button, DateField, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@yusr_systems/ui";
import { useState } from "react";
import type Account from "../../core/data/account";
import ReportConstants from "../../core/data/report/reportConstants";
import ReportButton from "./reportButton";

export default function AccountStatementButton({ account }: { account: Account; })
{
  const [isOpen, setIsOpen] = useState(false);
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());

  return (
    <>
      <Button variant="outline" size="sm" onClick={ () => setIsOpen(true) }>
        كشف حساب
      </Button>

      <Dialog open={ isOpen } onOpenChange={ setIsOpen }>
        <DialogContent dir="rtl" className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>كشف حساب</DialogTitle>
            <DialogDescription>{ account.name }</DialogDescription>
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
              reportName={ ReportConstants.AccountStatement }
              request={ { accountId: account.id, fromDate, toDate } }
            >
            </ReportButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
