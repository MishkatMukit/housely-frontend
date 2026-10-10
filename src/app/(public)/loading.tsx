import { Skeleton } from "@/components/ui/skeleton";

const CARD_KEYS = ["one", "two", "three", "four", "five", "six"];

export default function PublicLoading() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-5 py-12 sm:px-8 lg:py-16">
      <Skeleton className="h-3 w-40" />
      <Skeleton className="mt-5 h-12 w-72 max-w-full" />
      <Skeleton className="mt-4 h-4 w-full max-w-xl" />
      <Skeleton className="mt-2 h-4 w-2/3 max-w-md" />

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CARD_KEYS.map((key) => (
          <Skeleton key={key} className="h-48 w-full rounded-none" />
        ))}
      </div>
    </div>
  );
}
