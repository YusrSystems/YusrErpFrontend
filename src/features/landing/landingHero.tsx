import { Badge, Button } from "@yusr_systems/ui";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Zatca_lg_dark from "@/assets/Zatca_lg_dark.webp";
import Zatca_lg_light from "@/assets/Zatca_lg_light.webp";

export default function LandingHero()
{
  return (
    <section className="relative mx-auto max-w-6xl px-6 pb-24 pt-15 text-center">
      { /* Badge */ }
      <Badge
        variant="secondary"
        className="mb-10 gap-2 rounded-full border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary backdrop-blur-md hover:bg-primary/10 transition-colors"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
        الإصدار 3.4.0 — أبسط، أذكى، أسرع، كل ما تحتاجه في مكان واحد
      </Badge>

      { /* Title */ }
      <h1 className="text-4xl! font-extrabold leading-[1.1] tracking-tighter md:text-6xl!">
        <span className="bg-linear-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
          يُـــسْر
        </span>
      </h1>

      { /* Subtitle */ }
      <p className="mt-6 text-3xl font-bold tracking-tight text-primary md:text-5xl">
        برنامج محاسبي متكامل لإدارة أعمالك
      </p>

      { /* Description */ }
      <p className="mx-auto mt-8 max-w-2xl text-lg font-medium leading-relaxed text-muted-foreground md:text-xl">
        برنامج محاسبي سحابي يساعدك على إدارة حساباتك وفواتيرك ومبيعاتك ومصروفاتك بكل سهولة. يتميز بواجهة عربية بسيطة
        ومرنة، ويتيح لك متابعة عملك من أي مكان وفي أي وقت، مع ضمان أمان بياناتك ودقتها.
      </p>

      { /* CTA Buttons */ }
      <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Link to="/register">
          <Button
            size="lg"
            className="h-14 rounded-full px-10 text-lg shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            ابدأ الاستخدام مجانًا <ArrowLeft className="mr-2 h-5 w-5" />
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

      { /* ZATCA Badge */ }
      <div className="mt-16 flex flex-col items-center gap-4">
        <p className="text-xl mb-8 font-bold">
          متوافق مع متطلبات هيئة الزكاة والضريبة والجمارك —{" "}
          <span className="text-green-600 dark:text-green-400 font-bold">
            المرحلة الأولى والثانية
          </span>
        </p>
        { /* Swap with actual ZATCA logo images */ }
        <img
          src={Zatca_lg_light}
          alt="ZATCA"
          className="block dark:hidden h-40 object-contain opacity-80"
        />
        <img
          src={Zatca_lg_dark}
          alt="ZATCA"
          className="hidden dark:block h-40 object-contain opacity-80"
        />
      </div>
    </section>
  );
}
