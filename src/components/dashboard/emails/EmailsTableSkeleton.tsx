import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function EmailsTableSkeleton() {
  return (
    <>
      {/* Estadísticas skeleton */}
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-12 mb-2" />
              <Skeleton className="h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabla skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-60" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filtros skeleton */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-[180px]" />
          </div>

          {/* Tabla skeleton */}
          <div className="rounded-md border">
            <div className="p-4">
              {/* Header skeleton */}
              <div className="flex justify-between items-center mb-4">
                {[...Array(9)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-16" />
                ))}
              </div>
              
              {/* Rows skeleton */}
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-t">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-6" />
                  <Skeleton className="h-4 w-12" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Paginación skeleton */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <Skeleton className="h-4 w-32" />
            <div className="flex items-center space-x-1">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}