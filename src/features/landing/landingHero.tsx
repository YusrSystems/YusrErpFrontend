import { Badge, Button } from "@yusr_systems/ui";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingHero()
{
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-24 text-center">
      { /* 1. Badge: Using standard primary/secondary colors */ }
      <Badge
        variant="secondary"
        className="mb-8 gap-2 rounded-full border-primary/20 bg-primary/5 px-4 py-1.5 text-primary backdrop-blur-md hover:bg-primary/10 transition-colors"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
        </span>
        نظام متكامل لإدارة النقل العام
      </Badge>

      { /* 2. Main Title: Using foreground gradient to muted-foreground */ }
      <h1 className="text-6xl font-extrabold leading-[1.1] tracking-tighter md:text-8xl">
        <span className="bg-linear-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">حافلات يُسر</span>
      </h1>

      { /* 3. Subtitle: Pure Primary color for the "Pop" */ }
      <p className="mt-6 text-3xl font-bold tracking-tight text-primary md:text-5xl">رحلتك، بكل يُسر</p>

      { /* 4. Description: Using muted-foreground */ }
      <p className="mx-auto mt-8 max-w-2xl text-lg font-medium leading-relaxed text-muted-foreground md:text-xl">
        منصة شاملة تُمكّنك من إدارة رحلات الحافلات، إصدار التذاكر، وتسجيل الركاب عبر حلول تقنية متطورة مصممة لرفع كفاءة
        النقل العام.
      </p>

      { /* 5. Buttons: Standard shadcn button variants */ }
      <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Link to="/login">
          <Button
            size="lg"
            className="h-14 rounded-full px-10 text-lg shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            ابدأ الآن <ArrowLeft className="mr-2 h-5 w-5" />
          </Button>
        </Link>
        <a href="#features">
          <Button
            size="lg"
            variant="outline"
            className="h-14 rounded-full px-10 text-lg backdrop-blur-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            استعرض المزايا
          </Button>
        </a>
      </div>
    </section>
  );
}
