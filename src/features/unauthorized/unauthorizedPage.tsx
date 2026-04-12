import { Button } from "@yusr_systems/ui";
import { ArrowRight, Home, ShieldOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function UnauthorizedPage()
{
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <div className="absolute -z-10 select-none opacity-[0.03] dark:opacity-[0.05]">
        <ShieldOff className="h-80! w-[20rem]!" />
      </div>

      <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-destructive/10 text-destructive shadow-inner">
        <ShieldOff className="h-12 w-12" />
      </div>

      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">غير مصرح بالدخول</h1>

      <p className="mt-6 max-w-md text-lg text-muted-foreground leading-relaxed">
        عذراً، ليس لديك الصلاحيات الكافية للوصول إلى هذه الصفحة. تواصل مع مدير النظام إذا كنت تعتقد أن هذا خطأ.
      </p>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <Button asChild size="lg" className="h-12 rounded-full px-8 shadow-lg shadow-primary/20">
          <Link to="/dashboard">
            <Home className="ml-2 h-4 w-4" />
            العودة للرئيسية
          </Link>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="lg"
          className="h-12 rounded-full px-8"
          onClick={ (e) =>
          {
            e.preventDefault();

            // Check if we have history to go back to
            if (window.history.state && window.history.state.idx > 0)
            {
              navigate(-1);
            }
            else
            {
              // If they landed here directly, send them to dashboard instead of landing
              navigate("/dashboard", { replace: true });
            }
          } }
        >
          <ArrowRight className="ml-2 h-4 w-4" />
          العودة للخلف
        </Button>
      </div>
    </div>
  );
}
