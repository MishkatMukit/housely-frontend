import { Skeleton } from "@/components/ui/skeleton";

const FIELD_KEYS = ["one", "two", "three"];

export default function AuthLoading() {
  return (
    <div className="container flex min-h-screen w-screen items-center justify-center py-12">
      <div className="w-full max-w-sm">
        <div className="rounded-xl bg-card p-6 ring-1 ring-foreground/10">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="mt-3 h-4 w-52 max-w-full" />
          <div className="mt-6 space-y-4">
            {FIELD_KEYS.map((key) => (
              <div key={key} className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-10 w-full rounded-none" />
              </div>
            ))}
            <Skeleton className="h-10 w-full rounded-none" />
          </div>
        </div>
        <Skeleton className="mx-auto mt-4 h-4 w-40" />
      </div>
    </div>
  );
}
