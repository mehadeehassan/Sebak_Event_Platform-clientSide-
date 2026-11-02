import { Skeleton } from "@/components/ui/skeleton";

/* Card grid used by the discovery pages while the api is loading. */
export function EventGridSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-card overflow-hidden rounded-xl border">
          <Skeleton className="aspect-[16/10] rounded-none" />
          <div className="space-y-3 p-4">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="mt-5 h-9 w-full rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* Horizontal rows for Joined Events. */
export function JoinedRowSkeleton({ count = 4 }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-card flex items-center gap-4 rounded-xl border p-3">
          <Skeleton className="size-16 shrink-0 rounded-lg sm:size-24" />
          <div className="flex-1 space-y-2.5">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3.5 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* Management rows for Manage Events. */
export function ManageRowSkeleton({ count = 3 }) {
  return (
    <div className="space-y-5">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-card overflow-hidden rounded-xl border">
          <div className="flex flex-col sm:flex-row">
            <Skeleton className="h-40 w-full shrink-0 rounded-none sm:h-auto sm:w-56 lg:w-72" />
            <div className="flex-1 space-y-3 p-4 sm:p-5">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-24 rounded-md" />
                <Skeleton className="h-5 w-20 rounded-md" />
              </div>
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="mt-2 h-8 w-52 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* Split image + content layout for the event details page. */
export function EventDetailsSkeleton() {
  return (
    <div className="bg-card mt-6 overflow-hidden rounded-2xl border shadow-sm">
      <div className="grid md:grid-cols-2">
        <div className="aspect-[4/3] md:aspect-auto md:min-h-[26rem]">
          <Skeleton className="size-full rounded-none" />
        </div>
        <div className="flex flex-col gap-4 p-5 sm:p-6 md:p-8">
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-4/5" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          <div className="space-y-2.5">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <Skeleton className="mt-4 h-11 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
