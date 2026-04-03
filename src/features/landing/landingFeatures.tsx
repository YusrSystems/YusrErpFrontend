import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, ZoomableImage } from "@yusr_systems/ui";
import { ArrowLeft, CheckCircle2, type LucideProps } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingFeatures(
  { openLightbox, features }: {
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
      changeScreenshotDark: string;
      changeScreenshotLight: string;
    }[];
  }
)
{
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">مزايا المنصة</h2>
        <p className="mt-3 text-muted-foreground">وحدات متكاملة تغطي كل ما تحتاجه لإدارة منظومة النقل</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        { features.map((f, i) =>
        {
          const Icon = f.icon;
          return (
            // Added hover border color
            <Card
              key={ i }
              className="group flex flex-col transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/50"
            >
              <CardHeader className="pb-3">
                { /* Changed icon background color */ }
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">{ f.title }</CardTitle>
                <CardDescription className="leading-relaxed">{ f.desc }</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4">
                <ul className="space-y-2">
                  { f.details.map((d) => (
                    <li key={ d } className="flex items-center gap-2 text-sm text-muted-foreground">
                      { /* Kept green for semantics, fits well */ }
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
                      { d }
                    </li>
                  )) }
                </ul>

                { /* Zoomable screenshot */ }
                <div className="rounded-lg border border-border overflow-hidden group-hover:border-primary/30 transition-colors">
                  <ZoomableImage
                    srcLight={ f.screenshotLight }
                    srcDark={ f.screenshotDark }
                    alt={ `لقطة شاشة ${f.title}` }
                    className="h-40 w-full object-cover object-top"
                    onOpen={ openLightbox }
                  />
                </div>

                <div className="mt-auto pt-1">
                  <Link to={ f.to }>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 group-hover:border-primary/50 group-hover:bg-primary/5 group-hover:text-primary"
                    >
                      { f.cta } <ArrowLeft className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        }) }
      </div>
    </section>
  );
}
