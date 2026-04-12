import { useEffect, useRef } from "react";
import { useAppSelector } from "../../../../core/state/store";
import { CalcInvoicePaidPrice, CalcInvoiceTaxExclusivePrice, CalcInvoiceTaxInclusivePrice, CalcInvoiceUnpaidPrice } from "../../logic/invoiceItemsMath";

interface SummaryCardProps
{
  label: string;
  value: number | string;
  symbol: string;
  hint: string;
  variant?: "default" | "paid" | "remaining";
  delay?: number;
}

function SummaryCard({ label, value, symbol, hint, variant = "default", delay = 0 }: SummaryCardProps)
{
  const valueRef = useRef<HTMLSpanElement>(null);

  useEffect(() =>
  {
    const target = parseFloat(String(value)) || 0;
    const duration = 900;
    const start = performance.now();

    const tick = (now: number) =>
    {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      if (valueRef.current)
      {
        valueRef.current.textContent = (target * ease).toLocaleString("ar-SA", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      }
      if (t < 1)
      {
        requestAnimationFrame(tick);
      }
    };

    const timer = setTimeout(() => requestAnimationFrame(tick), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  const base = "relative overflow-hidden rounded-xl border p-4 cursor-default group transition-transform duration-200 "
    + "hover:-translate-y-0.5 hover:[transform:translateY(-2px)_rotateX(2deg)_rotateY(-1deg)] "
    + "[transform-style:preserve-3d]";

  const variants: Record<string, string> = {
    default: "bg-neutral-900 border-neutral-700",
    paid: "bg-emerald-950/60 border-emerald-700/50",
    remaining: "bg-red-950/60 border-red-700/50"
  };

  const labelColors: Record<string, string> = {
    default: "text-neutral-400",
    paid: "text-emerald-400",
    remaining: "text-red-400"
  };

  const valueColors: Record<string, string> = {
    default: "text-white",
    paid: "text-emerald-300",
    remaining: "text-red-300"
  };

  const barColors: Record<string, string> = {
    default: "bg-neutral-600",
    paid: "bg-emerald-500",
    remaining: "bg-red-500"
  };

  return (
    <div
      className={ `${base} ${variants[variant]}` }
      style={ { animationDelay: `${delay}ms`, animation: "cardIn 0.4s ease both" } }
    >
      <span
        className="absolute top-2 left-3 font-serif text-3xl font-bold opacity-[0.07] select-none leading-none"
        style={ { fontFamily: "'Playfair Display', serif" } }
      >
        { symbol }
      </span>

      <p className={ `text-[11px] tracking-wide mb-1.5 font-mono ${labelColors[variant]}` }>
        { label }
      </p>

      <span
        ref={ valueRef }
        className={ `text-xl font-semibold font-mono tracking-tight leading-none ${valueColors[variant]}` }
      >
        0.00
      </span>

      <div className="w-full h-px bg-white/10 my-2" />

      <p className="text-[10px] text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-mono">
        { hint }
      </p>

      <div
        className={ `absolute bottom-0 right-0 w-0.75 h-0 group-hover:h-full transition-all duration-500 rounded-tl-sm ${
          barColors[variant]
        }` }
      />
    </div>
  );
}

export default function InvoiceItemsSummary()
{
  const invoiceTaxExclusivePrice = useAppSelector(CalcInvoiceTaxExclusivePrice);
  const invoiceTaxInclusivePrice = useAppSelector(CalcInvoiceTaxInclusivePrice);
  const paidPrice = useAppSelector(CalcInvoicePaidPrice);
  const unpaidPrice = useAppSelector(CalcInvoiceUnpaidPrice);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 rtl">
      <SummaryCard
        label="الإجمالي قبل الضريبة"
        value={ invoiceTaxExclusivePrice }
        symbol="∑"
        hint="قبل إضافة الضريبة"
        delay={ 50 }
      />
      <SummaryCard
        label="إجمالي الضرائب"
        value={ invoiceTaxInclusivePrice - invoiceTaxExclusivePrice }
        symbol="%"
        hint="قيمة مضافة"
        delay={ 150 }
      />
      <SummaryCard
        label="الإجمالي بعد الضريبة"
        value={ invoiceTaxInclusivePrice }
        symbol="Σ"
        hint="صافي المبلغ الكلي"
        delay={ 100 }
      />
      <SummaryCard
        label="المبلغ المدفوع"
        value={ paidPrice }
        symbol="✓"
        hint="تم استلامه"
        delay={ 200 }
        variant="paid"
      />
      <SummaryCard
        label="المبلغ المتبقي"
        value={ unpaidPrice }
        symbol="△"
        hint="غير مسدّد"
        delay={ 250 }
        variant="remaining"
      />
    </div>
  );
}
