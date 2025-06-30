import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TicketsTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-48" />
        </CardTitle>
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-[180px]" />
        </div>

        <div className="rounded-md border">
          <div className="p-4">
            {/* Header skeleton */}
            <div className="grid grid-cols-9 gap-4 pb-4 border-b">
              {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} className="h-4" />
              ))}
            </div>

            {/* Rows skeleton */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid grid-cols-9 gap-4 py-4 border-b">
                {Array.from({ length: 9 }).map((_, j) => (
                  <Skeleton key={j} className="h-4" />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Pagination skeleton */}
        <div className="flex items-center justify-between py-4">
          <Skeleton className="h-4 w-32" />
          <div className="flex items-center space-x-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-8" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
