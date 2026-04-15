import dashboardDark from "@/assets/dashboard_dark.webp";
import dashboardLight from "@/assets/dashboard_light.webp";
import { ZoomableImage } from "@yusr_systems/ui";
import type { LucideProps } from "lucide-react";

export default function LandingSystemPreview(
  {
    openLightbox,
    features
  }: {
    openLightbox: (srcLight: string, srcDark: string, alt: string) => void;
    features: {
      icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
      title: string;
      desc: string;
      details: string[];
      cta: string;
      to: string;
      screenshotDark: string;
      screenshotLight: string;
    }[];
  }
)
{
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">استعرض البرنامج</h2>
        <p className="mt-5 text-base text-muted-foreground">
          لوحة تحكم مركزية تجمع كل بياناتك في واجهة واضحة وسهلة الاستخدام
        </p>
      </div>

      { /* Main dashboard mockup */ }
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-muted/10 shadow-2xl shadow-primary/5">
        { /* Browser chrome */ }
        <div className="flex items-center gap-1.5 border-b border-border bg-muted/40 px-4 py-3">
          <div className="h-3 w-3 rounded-full bg-destructive/60" />
          <div className="h-3 w-3 rounded-full bg-yellow-400/60" />
          <div className="h-3 w-3 rounded-full bg-green-500/60" />
          <span className="mx-auto text-xs text-muted-foreground/60">
            يُسر — لوحة التحكم الرئيسية
          </span>
        </div>
        <ZoomableImage
          srcLight={ dashboardLight }
          srcDark={ dashboardDark }
          alt="لوحة التحكم الرئيسية"
          className="w-full object-cover object-top"
          onOpen={ openLightbox }
        />
      </div>

      { /* Mini previews for each module */ }
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        { features.map((f) =>
        {
          const Icon = f.icon;
          return (
            <div
              key={ f.title }
              className="overflow-hidden rounded-xl border border-border bg-muted/10 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-3 py-2">
                <Icon className="h-3.5 w-3.5 text-primary/70" />
                <span className="text-xs font-semibold truncate">{ f.title }</span>
              </div>
              <ZoomableImage
                srcLight={ f.screenshotLight }
                srcDark={ f.screenshotDark }
                alt={ `معاينة ${f.title}` }
                className="h-24 w-full object-cover object-top"
                onOpen={ openLightbox }
              />
            </div>
          );
        }) }
      </div>
    </section>
  );
}
