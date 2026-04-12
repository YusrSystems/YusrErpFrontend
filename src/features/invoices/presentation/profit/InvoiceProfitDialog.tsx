import { Button, cn, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@yusr_systems/ui";
import { Banknote } from "lucide-react";
import { useState } from "react";
import { InvoiceRelationType } from "../../../../core/data/invoice";
import type { InvoiceProfitResult } from "../../../../core/data/InvoiceProfitResult";
import { useAppSelector } from "../../../../core/state/store";
import InvoiceItemsMath from "../../logic/invoiceItemsMath";

interface ProfitRowProps
{
  label: string;
  value: number;
  variant?: "default" | "profit";
}

function ProfitRow({ label, value, variant = "default" }: ProfitRowProps)
{
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-border last:border-b-0">
      <span className="text-sm text-muted-foreground">{ label }</span>
      <span
        className={ cn(
          "text-sm font-medium tabular-nums",
          variant === "profit" && value >= 0 && "text-emerald-600 dark:text-emerald-400",
          variant === "profit" && value < 0 && "text-red-600 dark:text-red-400",
          variant === "default" && "text-foreground"
        ) }
      >
        { value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
      </span>
    </div>
  );
}

export default function InvoiceProfitDialog()
{
  const [open, setOpen] = useState(false);
  const { items, vouchers } = useAppSelector((state) => state.invoiceUI);
  const costVouchers = vouchers.filter((v) => v.invoiceRelationType === InvoiceRelationType.Cost);

  const profit: InvoiceProfitResult = InvoiceItemsMath.CalcInvoiceProfit(items, costVouchers);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={ () => setOpen(true) }
        className="gap-2 p-6.5 text-green-500 h-full"
      >
        <Banknote className="h-4 w-4" />
        ربح الفاتورة
      </Button>

      <Dialog open={ open } onOpenChange={ setOpen }>
        <DialogContent className="max-w-sm rtl" dir="rtl">
          <DialogHeader>
            <DialogTitle>ربح الفاتورة</DialogTitle>
            <DialogDescription>ملخص الربح الإجمالي للفاتورة</DialogDescription>
          </DialogHeader>

          <div className="mt-2">
            <ProfitRow label="إجمالي السعر شامل الضريبة" value={ profit.taxInclusiveTotalPrice } />
            <ProfitRow label="إجمالي التكاليف" value={ profit.totalCost } />
            <ProfitRow label="إجمالي الضرائب" value={ profit.totalTaxesAmount } />
            <ProfitRow label="تكاليف الفاتورة" value={ profit.invoiceCosts } />
            <ProfitRow label="صافي الربح" value={ profit.profit } variant="profit" />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
