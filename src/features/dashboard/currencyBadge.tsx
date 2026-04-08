import { Coins } from "lucide-react";

export type CurrencyBadgeProps = {
  currency: string;
};
export default function CurrencyBadge({ currency }: CurrencyBadgeProps)
{
  return (
    <div className="flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">نظرة عامة</h2>
        <div
          className="group flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1.5 border border-primary/20 shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-md hover:bg-primary/10 hover:border-primary/30 cursor-default"
          title="عملة النظام الحالية"
        >
          <div className="flex items-center justify-center rounded-full bg-primary/20 p-1 transition-transform duration-300 group-hover:rotate-12">
            <Coins className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-sm font-bold tracking-wider text-primary">
            { currency }
          </span>
        </div>
      </div>
    </div>
  );
}
