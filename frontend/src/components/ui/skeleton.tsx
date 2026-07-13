import { cn } from '../../lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200 dark:bg-gray-800", className)}
      {...props}
    />
  );
}

export function ContentSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="border rounded-xl p-6 space-y-4 bg-white dark:bg-gray-900 border-gray-150 dark:border-gray-800">
        <div className="flex gap-4">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
        <div className="space-y-3 pt-4">
          <div className="flex justify-between border-b pb-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/12" />
            <Skeleton className="h-4 w-1/12" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between py-2 items-center">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-1/6" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TasksSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((col) => (
          <div key={col} className="border border-dashed rounded-xl p-4 space-y-4 bg-gray-50/50 dark:bg-gray-950/20 dark:border-gray-850">
            <Skeleton className="h-5 w-24" />
            {[1, 2].map((i) => (
              <div key={i} className="border rounded-xl p-4 space-y-3 bg-white dark:bg-gray-900 border-gray-150 dark:border-gray-800">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-5 w-12 rounded-full" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
