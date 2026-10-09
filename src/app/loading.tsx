import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex h-16 items-center justify-between border-b border-ink/15 px-5 sm:px-8">
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-8 w-32" />
      </div>

      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-10 px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-[4.5rem_minmax(0,1fr)_auto] lg:gap-8 lg:pb-24 lg:pt-16">
        <div className="flex flex-col justify-center lg:max-w-2xl">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="mt-5 h-16 w-full max-w-lg" />
          <Skeleton className="mt-2 h-16 w-4/5 max-w-md" />
          <Skeleton className="mt-6 h-4 w-full max-w-lg" />
          <Skeleton className="mt-2 h-4 w-3/4 max-w-md" />
          <Skeleton className="mt-8 h-12 w-full max-w-lg" />
          <div className="mt-8 flex gap-4">
            <Skeleton className="h-11 w-40" />
            <Skeleton className="h-11 w-32" />
          </div>
        </div>
        <div className="mx-auto w-full max-w-[340px]">
          <Skeleton className="h-80 w-full rounded-none" />
        </div>
      </div>

      <div className="rule-top mx-auto w-full max-w-[1400px] px-5 py-16 sm:px-8">
        <Skeleton className="h-10 w-72" />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {["one", "two", "three", "four"].map((key) => (
            <div key={key} className="space-y-3">
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
