import { Button } from "@yusr_systems/ui";
import { ArrowRight, FileQuestion, Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundPage()
{
  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      { /* 1. Background Visual Hint */ }
      <div className="absolute -z-10 select-none opacity-[0.03] dark:opacity-[0.05]">
        <h1 className="text-[20rem]! font-bold">404</h1>
      </div>

      { /* 2. Main Content */ }
      <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-inner">
        <FileQuestion className="h-12 w-12" />
      </div>

      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">عذراً، هذه الصفحة مفقودة!</h1>

      <p className="mt-6 max-w-md text-lg text-muted-foreground leading-relaxed">
        يبدو أنك سلكت مساراً غير موجود، أو أن الصفحة قد تم نقلها إلى عنوان آخر. لا تقلق، يمكنك العودة دائماً إلى المسار
        الصحيح.
      </p>

      { /* 3. Actions */ }
      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <Button asChild size="lg" className="h-12 rounded-full px-8 shadow-lg shadow-primary/20">
          <Link to="/">
            <Home className="ml-2 h-4 w-4" />
            العودة للرئيسية
          </Link>
        </Button>

        <Button asChild variant="ghost" size="lg" className="h-12 rounded-full px-8">
          <button onClick={ () => window.history.back() }>
            <ArrowRight className="ml-2 h-4 w-4" />
            العودة للخلف
          </button>
        </Button>
      </div>

      { /* 4. Support Link */ }
      {
        /* <p className="mt-12 text-sm text-muted-foreground">
        هل تعتقد أن هذا خطأ برمجي؟ <a href="#" className="font-medium text-primary underline-offset-4 hover:underline">أبلغنا بذلك</a>
      </p> */
      }
    </div>
  );
}
