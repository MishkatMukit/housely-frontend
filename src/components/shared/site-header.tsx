import Link from "next/link";
import { Suspense } from "react";
import { UserMenu } from "@/components/shared/user-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser } from "@/lib/auth/session";

async function AuthNav() {
  const user = await getCurrentUser();

  if (user) return <UserMenu user={user} />;

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="rounded-none px-3 figure text-[0.8125rem] uppercase tracking-[0.08em]"
        render={<Link href="/login" />}
      >
        Log in
      </Button>
      <Button
        size="sm"
        className="rounded-none bg-tolet px-4 text-primary-foreground hover:bg-tolet/90"
        render={<Link href="/register" />}
      >
        Get on the register
      </Button>
    </>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-ink/15 bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/75">
      <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-7">
          <Link href="/" className="flex items-baseline gap-1">
            <span className="display text-2xl text-ink">
              House<span className="text-tolet">ly</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/properties"
              className="figure text-[0.8125rem] uppercase tracking-[0.08em] text-ink-soft transition-colors hover:text-ink"
            >
              Vacancies
            </Link>
            <Link
              href="/#how-it-works"
              className="figure text-[0.8125rem] uppercase tracking-[0.08em] text-ink-soft transition-colors hover:text-ink"
            >
              How it works
            </Link>
            <Link
              href="/#for-owners"
              className="figure text-[0.8125rem] uppercase tracking-[0.08em] text-ink-soft transition-colors hover:text-ink"
            >
              For owners
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Suspense fallback={<Skeleton className="h-8 w-24" />}>
            <AuthNav />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
