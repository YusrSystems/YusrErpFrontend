import logoDark from "@/assets/yusrErpLogoRTL_Dark.png";
import logoLight from "@/assets/yusrErpLogoRTL_Light.png";
import { Button, ThemeToggle } from "@yusr_systems/ui";
import { Link } from "react-router-dom";

export default function LandingHeader()
{
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        { /* Logo */ }
        <div className="flex items-center w-32">
          <img
            src={ logoLight }
            alt="يُسر"
            className="block dark:hidden h-auto w-full object-contain"
          />
          <img
            src={ logoDark }
            alt="يُسر"
            className="hidden dark:block h-auto w-full object-contain"
          />
          { /* Fallback text logo if image not found */ }
          { /* <span className="text-2xl font-bold">يُـسْر</span> */ }
        </div>

        { /* Actions */ }
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/login">
            <Button size="lg" variant="outline">
              تسجيل الدخول
            </Button>
          </Link>
          <Link to="/register">
            <Button size="lg" variant="default">
              ابدأ الاستخدام مجانًا
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
