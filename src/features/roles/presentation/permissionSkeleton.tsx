import { Card, CardContent, CardHeader, Skeleton } from "@yusr_systems/ui";

export const PermissionSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    { [1, 2, 3].map((i) => (
      <Card key={ i } className="shadow-none border-2">
        <CardHeader className="flex flex-row items-center justify-between border-b p-4">
          <Skeleton className="h-4 w-25" />
          <Skeleton className="h-5 w-5 rounded-md" />
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    )) }
  </div>
);
