import { cn } from "@yusr_systems/ui";
import { useEffect, useRef } from "react";
import { useInvoiceContext } from "../../logic/invoiceContext";
import InvoiceItemsMath from "../../logic/invoiceItemsMath";

interface StatCellProps
{
  label: string;
  value: number;
  icon: string;
  variant?: "default" | "paid" | "remaining";
}

function StatCell({ label, value, icon, variant = "default" }: StatCellProps)
{
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() =>
  {
    const target = value || 0;
    const duration = 700;
    const start = performance.now();

    const tick = (now: number) =>
    {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      if (ref.current)
      {
        ref.current.textContent = (target * ease).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      }
      if (t < 1)
      {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [value]);

  return (
    <div
      className={ cn(
        "relative flex flex-col justify-between gap-0.5 px-4 py-2.5 group overflow-hidden",
        variant === "paid" && "bg-emerald-50 dark:bg-emerald-950/30",
        variant === "remaining" && "bg-red-50 dark:bg-red-950/30"
      ) }
    >
      <span
        aria-hidden
        className={ cn(
          "pointer-events-none select-none absolute -bottom-2 right-2",
          "text-[3.5rem] font-bold leading-none",
          variant === "default" && "text-foreground/4",
          variant === "paid" && "text-emerald-600/10 dark:text-emerald-400/10",
          variant === "remaining" && "text-red-600/10 dark:text-red-400/10"
        ) }
      >
        { icon }
      </span>

      <p
        className={ cn(
          "text-[11px] tracking-wide text-right relative z-10",
          variant === "paid" && "text-emerald-700 dark:text-emerald-400",
          variant === "remaining" && "text-red-700 dark:text-red-400",
          variant === "default" && "text-muted-foreground"
        ) }
      >
        { label }
      </p>

      <span
        ref={ ref }
        className={ cn(
          "text-2xl font-medium tabular-nums text-left leading-none relative z-10",
          variant === "paid" && "text-emerald-700 dark:text-emerald-300",
          variant === "remaining" && "text-red-700 dark:text-red-300",
          variant === "default" && "text-foreground"
        ) }
      >
        0.00
      </span>
    </div>
  );
}

export default function InvoiceItemsSummary()
{
  const { formData } = useInvoiceContext();
  const taxExclusive = InvoiceItemsMath.CalcInvoiceTaxExclusivePrice(formData.invoiceItems ?? []);
  const taxInclusive = InvoiceItemsMath.CalcInvoiceTaxInclusivePrice(formData.invoiceItems ?? []);
  const paid = InvoiceItemsMath.CalcInvoicePaidPrice(formData.invoiceVouchers ?? []);
  const unpaid = InvoiceItemsMath.CalcInvoiceUnpaidPrice(formData.invoiceItems ?? [], formData.invoiceVouchers ?? []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 border border-border rounded-lg overflow-hidden bg-background rtl flex-1 divide-x divide-y divide-border [direction:rtl]">
      <StatCell label="الإجمالي قبل الضريبة" value={ taxExclusive } icon="Σ" />
      <StatCell label="إجمالي الضرائب" value={ taxInclusive - taxExclusive } icon="%" />
      <StatCell label="الإجمالي بعد الضريبة" value={ taxInclusive } icon="Σ" />
      <StatCell label="المبلغ المدفوع" value={ paid } icon="✓" variant="paid" />
      <StatCell label="المبلغ المتبقي" value={ unpaid } icon="△" variant="remaining" />
    </div>
  );
}
