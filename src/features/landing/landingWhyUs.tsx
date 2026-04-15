import { Button, Card } from "@yusr_systems/ui";
import { ArrowLeft, type LucideProps } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingWhyUs(
  {
    whyUs
  }: {
    whyUs: {
      icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
      title: string;
      desc: string;
    }[];
  }
)
{
  return (
    <section id="why-us" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">لماذا يُعَدُّ يُسر شريكًا مثاليًا لأعمالك؟</h2>
        <p className="mt-5 text-base text-muted-foreground">
          نظام مصمم خصيصًا لاحتياجات الأعمال — بدون تعقيد وبدون مساومة على الجودة
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        { whyUs.map((w, i) =>
        {
          const Icon = w.icon;
          return (
            <Card
              key={ i }
              className="flex gap-4 p-6 transition-all duration-200 hover:bg-accent hover:border-primary/30"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold">{ w.title }</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{ w.desc }</p>
              </div>
            </Card>
          );
        }) }
      </div>

      { /* CTA */ }
      <div className="mt-12 rounded-2xl border border-primary/20 bg-card p-8 text-center">
        <p className="text-xl font-bold md:text-2xl text-primary">
          أوقف الفوضى في إدارة حساباتك — ابدأ مع يُسر اليوم
        </p>
        <p className="mt-3 text-muted-foreground">
          سجّل دخولك وابدأ الاستخدام الفوري دون إعداد معقد
        </p>
        <Link to="/register">
          <Button className="mt-6 gap-2 px-8 shadow-md shadow-primary/20" size="lg">
            ابدأ الاستخدام مجانًا <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
