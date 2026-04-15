import { Lightbox, Separator, useLightBox, YusrBusBackground } from "@yusr_systems/ui";
import { FileText, Globe, HelpCircle, Landmark, Package, Receipt, RefreshCw, Rocket, ShieldCheck, Tags, Timer, Users, Warehouse } from "lucide-react";
import LandingFeatures from "./landingFeatures";
import LandingFooter from "./landingFooter";
import LandingHeader from "./landingHeader";
import LandingHero from "./landingHero";
import LandingPricing from "./landingPricing";
import LandingSystemPreview from "./landingSystemPreview";
import LandingWhyUs from "./landingWhyUs";

const PH = (name: string) => `/assets/${name}`;

const features = [{
  icon: Receipt,
  title: "الفواتير",
  desc: "إصدار وتتبع الفواتير، بما في ذلك الفاتورة الإلكترونية والضريبية، بسلاسة تامة.",
  details: ["فواتير بيع وشراء غير محدودة", "الفاتورة الإلكترونية (المرحلة الأولى والثانية)", "تقارير مبيعات دقيقة"],
  cta: "استعراض الفواتير",
  to: "/sales",
  screenshotDark: PH("invoices_dark.webp"),
  screenshotLight: PH("invoices_light.webp")
}, {
  icon: Landmark,
  title: "الحسابات",
  desc: "إدارة كل الحسابات في مكان واحد: الموردين والعملاء والموظفين والحسابات البنكية.",
  details: ["حسابات عملاء وموردين وموظفين", "متابعة الأرصدة والحركات المالية", "تقارير كشوف حساب مفصّلة"],
  cta: "استعراض الحسابات",
  to: "/clients",
  screenshotDark: PH("accounts_dark.webp"),
  screenshotLight: PH("accounts_light.webp")
}, {
  icon: Package,
  title: "المخزون",
  desc: "تتبع كل منتج وخدمة بدقة، مع تنظيم المخزون بسهولة، لتبقى أعمالك دائمًا تحت السيطرة.",
  details: ["منتجات وخدمات غير محدودة", "تتبع المخزون وجرده", "تسوية المواد والتقارير"],
  cta: "استعراض المخزون",
  to: "/items",
  screenshotDark: PH("inventory_dark.webp"),
  screenshotLight: PH("inventory_light.webp")
}, {
  icon: Warehouse,
  title: "المستودعات",
  desc: "إدارة عدد لا محدود من المستودعات، مع تتبع كل حركة من وإلى المخزون بدقة وسلاسة.",
  details: ["مستودعات غير محدودة", "تتبع الحركات الواردة والصادرة", "تقارير تفصيلية لكل مستودع"],
  cta: "استعراض المستودعات",
  to: "/stores",
  screenshotDark: PH("warehouses_dark.webp"),
  screenshotLight: PH("warehouses_light.webp")
}, {
  icon: FileText,
  title: "السندات",
  desc: "إصدار السندات وتتبعها بدقة، لتسهيل إدارة الأموال والحسابات الداخلية.",
  details: ["سندات قبض وصرف غير محدودة", "خزائن وحسابات بنكية متعددة", "طرق دفع مرنة"],
  cta: "استعراض السندات",
  to: "/vouchers",
  screenshotDark: PH("vouchers_dark.webp"),
  screenshotLight: PH("vouchers_light.webp")
}, {
  icon: Users,
  title: "المستخدمون والأدوار",
  desc: "تحكم كامل في فريق عملك — أنشئ حسابات المستخدمين، وزّع الأدوار، وحدد الصلاحيات بدقة لكل شخص.",
  details: ["مستخدمون غير محدودين", "أدوار مخصصة لكل وظيفة", "صلاحيات دقيقة لكل دور"],
  cta: "استعراض الأدوار",
  to: "/roles",
  screenshotDark: PH("entities_dark.webp"),
  screenshotLight: PH("entities_light.webp")
}];

const whyUs = [{
  icon: HelpCircle,
  title: "دعم فني متوفر مجانًا",
  desc: "متوفر دائمًا مجانًا، لمساعدتك في أي استفسار أو مشكلة بشكل سريع وفعّال."
}, {
  icon: ShieldCheck,
  title: "الأمان والحماية",
  desc: "يولي يُسر اهتمامًا كاملًا بسلامة بياناتك على خوادم مؤمنة بالكامل."
}, {
  icon: Rocket,
  title: "واجهة سهلة الاستخدام",
  desc: "أدِر أعمالك بكل سهولة عبر واجهة عربية واضحة وبسيطة، مع أدوات مدمجة لا تتطلب خبرة عميقة."
}, {
  icon: Timer,
  title: "توفير الوقت والجهد",
  desc: "تابع مؤشرات أعمالك وأدِر عملياتك بسرعة وكفاءة، مع خطوات سهلة توفر عليك الوقت والمجهود."
}, {
  icon: Globe,
  title: "من أي مكان وفي أي وقت",
  desc: "كونه نظامًا سحابيًا، يمكنك الوصول إليه من أي جهاز وفي أي وقت."
}, {
  icon: RefreshCw,
  title: "تحديثات دورية مجانًا",
  desc: "يتم تحديث البرنامج باستمرار لإضافة ميزات وأدوات جديدة، وستحصل عليها مجانًا."
}, {
  icon: Tags,
  title: "سعر اقتصادي",
  desc: "احصل على نظام محاسبي متكامل باشتراك شهري بسيط، مع دعم فني مستمر وتحديثات مجانية."
}];

const pricingFeatures: { index: number; label: string; type: "title" | "check" | "unlimited"; }[] = [
  { index: 1, label: "المعاملات المالية", type: "title" },
  { index: 2, label: "الفواتير", type: "unlimited" },
  { index: 3, label: "عروض الأسعار", type: "unlimited" },
  { index: 4, label: "سندات القبض والصرف", type: "unlimited" },
  { index: 5, label: "الخزائن والحسابات البنكية", type: "unlimited" },
  { index: 6, label: "طرق الدفع", type: "unlimited" },
  { index: 7, label: "التقارير", type: "check" },
  { index: 8, label: "الفاتورة الإلكترونية", type: "title" },
  { index: 9, label: "المرحلة الأولى", type: "check" },
  { index: 10, label: "المرحلة الثانية", type: "check" },
  { index: 11, label: "المخزون", type: "title" },
  { index: 12, label: "المنتجات والخدمات", type: "unlimited" },
  { index: 13, label: "تتبع المخزون", type: "check" },
  { index: 14, label: "جرد المخزون", type: "check" },
  { index: 15, label: "المستودعات", type: "unlimited" },
  { index: 16, label: "تسوية المواد", type: "check" },
  { index: 17, label: "الكشوفات والتقارير", type: "check" },
  { index: 18, label: "المحاسبة", type: "title" },
  { index: 19, label: "الحسابات (عميل، مورد، موظف، إلخ)", type: "unlimited" },
  { index: 20, label: "تتبع الأرصدة", type: "check" },
  { index: 21, label: "الكشوفات والتقارير", type: "check" },
  { index: 22, label: "المستخدمون", type: "title" },
  { index: 23, label: "عدد المستخدمين", type: "unlimited" },
  { index: 24, label: "الأدوار والصلاحيات", type: "unlimited" }
];

const Landing = () =>
{
  const { lightbox, openLightbox, closeLightbox } = useLightBox();

  return (
    <div dir="rtl" className="relative min-h-svh text-foreground">
      <YusrBusBackground />

      { lightbox && (
        <Lightbox
          srcLight={ lightbox.srcLight }
          srcDark={ lightbox.srcDark }
          alt={ lightbox.alt }
          onClose={ closeLightbox }
        />
      ) }

      <LandingHeader />
      <LandingHero />

      <Separator className="mx-auto max-w-6xl" />
      <LandingFeatures features={ features } />

      <Separator className="mx-auto max-w-6xl" />
      {/* <LandingSystemPreview openLightbox={ openLightbox } features={ features } /> */}

      <Separator className="mx-auto max-w-6xl" />
      <LandingWhyUs whyUs={ whyUs } />

      <Separator className="mx-auto max-w-6xl" />
      <LandingPricing features={ pricingFeatures } monthlyPrice={ 150 } yearlyPrice={ 125 } />

      <LandingFooter />
    </div>
  );
};

export default Landing;
