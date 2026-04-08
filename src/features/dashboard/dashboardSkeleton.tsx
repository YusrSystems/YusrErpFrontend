import { cn } from "@yusr_systems/ui";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>)
{
  return (
    <div
      className={ cn(
        "animate-pulse rounded-xl bg-muted/60 relative overflow-hidden",
        "after:absolute after:inset-0 after:translate-x-[-100%]",
        "after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent",
        "after:animate-[shimmer_1.6s_infinite]",
        className
      ) }
      { ...props }
    />
  );
}

function PulseIcon()
{
  return (
    <div className="relative flex items-center justify-center w-9 h-9">
      <span className="absolute inline-flex w-full h-full rounded-full bg-muted/40 animate-ping opacity-50" />
      <span className="absolute inline-flex w-full h-full rounded-full bg-muted/20 animate-ping opacity-30 delay-300" />
      <Skeleton className="w-9 h-9 rounded-full z-10" />
    </div>
  );
}

function StarField({ count = 5 }: { count?: number; })
{
  return (
    <>
      { Array.from({ length: count }).map((_, i) => (
        <span
          key={ i }
          className="absolute w-1 h-1 rounded-full bg-foreground/20"
          style={ {
            top: `${10 + Math.sin(i * 137.5) * 40 + 40}%`,
            left: `${(i * 19.1) % 90 + 5}%`,
            animationDelay: `${(i * 0.37).toFixed(2)}s`,
            animation: `twinkle ${1.5 + (i % 3) * 0.4}s ease-in-out infinite`
          } }
        />
      )) }
    </>
  );
}

function StatCard({ delay = 0 }: { delay?: number; })
{
  return (
    <div
      className="relative overflow-hidden rounded-xl border border-border/40 bg-card p-5"
      style={ { animationDelay: `${delay}ms`, animation: "fadeUp 0.5s ease both" } }
    >
      <StarField count={ 4 } />
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-2.5 w-14" />
        </div>
        <PulseIcon />
      </div>
      <div className="flex items-end gap-1.5 h-16 pt-2">
        { Array.from({ length: 7 }).map((_, i) => (
          <Skeleton
            key={ i }
            className="flex-1 rounded-t-md rounded-b-none"
            style={ {
              height: `${35 + Math.sin(i * 0.9) * 30 + 30}%`,
              animationDelay: `${i * 80}ms`,
              transformOrigin: "bottom",
              animation: `barGrow 0.7s cubic-bezier(0.34,1.56,0.64,1) both`
            } }
          />
        )) }
      </div>
    </div>
  );
}

function ChartCard()
{
  return (
    <div
      className="relative overflow-hidden rounded-xl border border-border/40 bg-card p-5"
      style={ { animation: "fadeUp 0.5s ease 0.32s both" } }
    >
      <StarField count={ 10 } />
      <div className="flex items-center justify-between mb-5">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="h-2.5 w-20" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>
      <div className="flex gap-3 h-52">
        <div className="flex flex-col justify-between py-1">
          { Array.from({ length: 5 }).map((_, i) => <Skeleton key={ i } className="h-2 w-7" />) }
        </div>
        <div className="flex-1 flex flex-col gap-2.5">
          { [1, 0.6, 0.8, 1.2, 0.5].map((scale, i) => (
            <Skeleton
              key={ i }
              className="rounded-lg"
              style={ {
                flex: scale,
                animationDelay: `${i * 60 + 100}ms`
              } }
            />
          )) }
        </div>
      </div>
    </div>
  );
}

export default function DashboardSkeleton()
{
  return (
    <>
      <style>
        { `
        @keyframes shimmer {
          to { transform: translateX(200%); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.8); }
          50% { opacity: 0.7; transform: scale(1.3); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes barGrow {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
      ` }
      </style>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
          { Array.from({ length: 4 }).map((_, i) => <StatCard key={ i } delay={ i * 80 } />) }
        </div>
        <div className="px-4 lg:px-6 mt-2">
          <ChartCard />
        </div>
      </div>
    </>
  );
}
