import { Skeleton } from "@/components/ui/skeleton";

const CARD_SKELETONS = ["a", "b", "c", "d", "e", "f"];

export default function PropertiesLoading() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-5 py-12 sm:px-8 lg:py-16">
      <Skeleton className="h-3 w-40" />
      <Skeleton className="mt-5 h-12 w-72 max-w-full" />
      <Skeleton className="mt-4 h-4 w-full max-w-xl" />
      <Skeleton className="mt-2 h-4 w-2/3 max-w-md" />

      <Skeleton className="mt-8 h-[68px] w-full" />

      <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CARD_SKELETONS.map((key) => (
          <li key={key} className="border border-ink/15 bg-surface">
            <Skeleton className="aspect-[4/3] w-full rounded-none" />
            <div className="space-y-3 p-5">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-12 w-full" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
