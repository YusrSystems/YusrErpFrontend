import {YusrBusBackground, Lightbox, useLightBox, Separator} from "@yusr_systems/ui";
import { Bus, Clock, Layers, LayoutDashboard, LayoutDashboardIcon, Lock, Map, Settings, ShieldCheck, Users } from "lucide-react";
import LandingFeatures from "./landingFeatures";
import LandingFooter from "./landingFooter";
import LandingHeader from "./landingHeader";
import LandingHero from "./landingHero";
import LandingSystemPreview from "./landingSystemPreview";
import LandingWhyUs from "./landingWhyUs";

// Trips
import changeTripDark from "@/assets/system/yusrBus_ChangeTrip_Dark.webp";
import changeTripLight from "@/assets/system/yusrBus_ChangeTrip_Light.webp";
import tripsDark from "@/assets/system/yusrBus_Trips_Dark.webp";
import tripsLight from "@/assets/system/yusrBus_Trips_Light.webp";

// Passengers
import changePassengerDark from "@/assets/system/yusrBus_ChangePassenger_Dark.webp";
import changePassengerLight from "@/assets/system/yusrBus_ChangePassenger_Light.webp";
import passengersDark from "@/assets/system/yusrBus_Passengers_Dark.webp";
import passengersLight from "@/assets/system/yusrBus_Passengers_Light.webp";

// Routes
import changeRouteDark from "@/assets/system/yusrBus_ChangeRoute_Dark.webp";
import changeRouteLight from "@/assets/system/yusrBus_ChangeRoute_Light.webp";
import routesDark from "@/assets/system/yusrBus_Routes_Dark.webp";
import routesLight from "@/assets/system/yusrBus_Routes_Light.webp";

// Settings
import settingDark from "@/assets/system/yusrBus_Setting_Dark.webp";
import settingLight from "@/assets/system/yusrBus_Setting_Light.webp";

// Users
import changeUserDark from "@/assets/system/yusrBus_ChangeUser_Dark.webp";
import changeUserLight from "@/assets/system/yusrBus_ChangeUser_Light.webp";
import usersDark from "@/assets/system/yusrBus_Users_Dark.webp";
import usersLight from "@/assets/system/yusrBus_Users_Light.webp";

// Dashboard
import dashboardDark from "@/assets/system/yusrBus_Dashboard_Dark.webp";
import dashboardLight from "@/assets/system/yusrBus_Dashboard_Light.webp";

// ─── Data ─────────────────────────────────────────────────────────────────────

const features = [{
  icon: Bus,
  title: "إدارة الرحلات",
  desc: "أنشئ رحلات جديدة، حدد مواعيد الانطلاق والوصول، وتابع حالة كل رحلة في الوقت الفعلي.",
  details: ["جدولة الرحلات المتكررة", "تتبع الحالة لحظياً", "ربط الرحلة بالمسار والحافلة"],
  cta: "استعراض الرحلات",
  to: "/trips",
  screenshotDark: tripsDark,
  screenshotLight: tripsLight,
  changeScreenshotDark: changeTripDark,
  changeScreenshotLight: changeTripLight
}, {
  icon: Users,
  title: "إدارة الركاب",
  desc: "سجل شامل لبيانات الركاب، سجل الرحلات السابقة، والتذاكر المرتبطة بكل راكب.",
  details: ["ملفات شخصية كاملة", "سجل رحلات مفصّل", "بحث وتصفية متقدمة"],
  cta: "استعراض الركاب",
  to: "/passengers",
  screenshotDark: passengersDark,
  screenshotLight: passengersLight,
  changeScreenshotDark: changePassengerDark,
  changeScreenshotLight: changePassengerLight
}, {
  icon: Map,
  title: "إدارة الخطوط",
  desc: "صمّم مسارات الحافلات بين المحطات، حدد التسلسل والمسافات، وعدّل الخطوط بمرونة.",
  details: ["إضافة محطات متعددة", "ترتيب التسلسل", "مسارات قابلة لإعادة الاستخدام"],
  cta: "استعراض الخطوط",
  to: "/routes",
  screenshotDark: routesDark,
  screenshotLight: routesLight,
  changeScreenshotDark: changeRouteDark,
  changeScreenshotLight: changeRouteLight
}, {
  icon: Settings,
  title: "إدارة الإعدادات",
  desc: "إدارة بيانات الشركة ومعلومات الاشتراك.",
  details: ["تغيير الشعار", "تغيير معلومات الشركة", "متابعة معلومات الاشتراك"],
  cta: "استعراض الإعدادات",
  to: "/settings",
  screenshotDark: settingDark,
  screenshotLight: settingLight,
  changeScreenshotDark: settingDark,
  changeScreenshotLight: settingLight
}, {
  icon: ShieldCheck,
  title: "إدارة المستخدمين",
  desc: "تحكم كامل في فريق العمل — أنشئ حسابات، وزّع الأدوار، وراقب الصلاحيات.",
  details: ["أدوار وصلاحيات مرنة", "تسجيل نشاط المستخدمين", "إدارة كلمات المرور"],
  cta: "استعراض المستخدمين",
  to: "/users",
  screenshotDark: usersDark,
  screenshotLight: usersLight,
  changeScreenshotDark: changeUserDark,
  changeScreenshotLight: changeUserLight
}, {
  icon: LayoutDashboardIcon,
  title: "لوحة المعلومات",
  desc: "نظرة شمولية على أداء النظام — تتبع الإحصائيات الحية، ومراقبة سير الرحلات والعمليات اليومية.",
  details: ["إحصائيات فورية للمبيعات والرحلات", "رسوم بيانية لتحليل البيانات", "تنبيهات مباشرة للحالات الطارئة"],
  cta: "عرض الإحصائيات",
  to: "/dashboard",
  screenshotDark: dashboardDark,
  screenshotLight: dashboardLight,
  changeScreenshotDark: tripsDark,
  changeScreenshotLight: tripsLight
}];

const whyUs = [{
  icon: LayoutDashboard,
  title: "واجهة بسيطة وسهلة",
  desc: "صُممت المنصة لتكون في متناول الجميع، بدون تعقيد أو تدريب مطوّل."
}, {
  icon: Layers,
  title: "نظام متكامل في مكان واحد",
  desc: "الرحلات، التذاكر، الركاب، الخطوط، والمستخدمين — كل شيء تحت سقف واحد."
}, {
  icon: Clock,
  title: "توفير الوقت والجهد",
  desc: "أتمتة المهام المتكررة وتقليص الأخطاء اليدوية يمنحك وقتاً للتركيز على ما يهم."
}, { icon: Lock, title: "أمان وموثوقية", desc: "صلاحيات دقيقة وسجل نشاط كامل يضمن حماية بياناتك وتتبع كل تغيير." }];

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

      <LandingFeatures openLightbox={ openLightbox } features={ features } />

      <Separator className="mx-auto max-w-6xl" />

      <LandingSystemPreview openLightbox={ openLightbox } features={ features } />

      <Separator className="mx-auto max-w-6xl" />

      <LandingWhyUs whyUs={ whyUs } />

      <LandingFooter />
    </div>
  );
};

export default Landing;
