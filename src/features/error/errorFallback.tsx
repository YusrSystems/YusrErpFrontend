import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle } from "@yusr_systems/ui";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

interface ErrorFallbackProps
{
  reset: () => void;
}

export default function ErrorFallback({ reset }: ErrorFallbackProps)
{
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6">
      <Card className="max-w-md border-destructive/20 bg-destructive/5 text-center shadow-lg backdrop-blur-sm">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="h-10 w-10" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">حدث خطأ غير متوقع</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            نعتذر عن ذلك، واجه النظام مشكلة تقنية أثناء تحميل هذه الصفحة. يرجى محاولة تحديث الصفحة أو العودة للرئيسية.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="default" onClick={ () => reset() } className="gap-2 px-8">
            <RotateCcw className="h-4 w-4" />
            إعادة المحاولة
          </Button>
          <Button variant="outline" asChild className="gap-2 border-destructive/20 hover:bg-destructive/10">
            <a href="/">
              <Home className="h-4 w-4" />
              الرئيسية
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
