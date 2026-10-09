import { Skeleton } from "@/components/ui/skeleton";

const ROW_SKELETONS = ["row-1", "row-2", "row-3"];

export default function PropertyDetailLoading() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-5 py-10 sm:px-8 lg:py-14">
      <Skeleton className="h-3 w-44" />

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)] lg:gap-12">
        <div>
          <Skeleton className="aspect-[16/10] w-full rounded-none" />
          <Skeleton className="mt-8 h-3 w-40" />
          <Skeleton className="mt-4 h-12 w-3/4" />
          <Skeleton className="mt-4 h-4 w-2/3" />
          <div className="mt-8 space-y-4 border-t border-ink/15 pt-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="mt-10 space-y-5">
            {ROW_SKELETONS.map((key) => (
              <Skeleton key={key} className="h-16 w-full rounded-none" />
            ))}
          </div>
        </div>

        <div className="border border-ink/15 bg-surface p-5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-5 h-10 w-40" />
          <div className="mt-6 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="mt-6 h-11 w-full rounded-none" />
        </div>
      </div>
    </div>
  );
}
