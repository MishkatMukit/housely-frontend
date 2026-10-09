import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto w-full max-w-[1400px] px-5 pb-10 pt-14 sm:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="display text-3xl">
              House<span className="text-tolet">ly</span>
            </p>
            <p className="figure mt-4 max-w-[30ch] text-sm leading-relaxed text-paper/60">
              The rent register for Bangladesh. Vacancies, leases and every taka
              paid — filed in one book.
            </p>
            <p className="figure mt-6 text-xs uppercase tracking-[0.18em] text-paper/40">
              Dhaka · Chattogram · Sylhet
            </p>
          </div>

          <nav className="flex flex-col gap-2.5">
            <span className="eyebrow !text-paper/50">The register</span>
            {[
              ["Browse vacancies", "/properties"],
              ["How it works", "/how-it-works"],
              ["List a property", "/register"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="figure text-sm text-paper/80 transition-colors hover:text-tolet"
              >
                {label}
              </Link>
            ))}
          </nav>

          <nav className="flex flex-col gap-2.5">
            <span className="eyebrow !text-paper/50">Account</span>
            {[
              ["Log in", "/login"],
              ["Create an account", "/register"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="figure text-sm text-paper/80 transition-colors hover:text-tolet"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="rule-top mt-12 flex flex-wrap items-center justify-between gap-3 border-paper/15 pt-5">
          <span className="figure text-xs text-paper/40">
            K-12142 · balance carried to folio 09
          </span>
          <span className="figure text-xs text-paper/40">
            © 2026 Housely · receipted by bKash
          </span>
        </div>
      </div>
    </footer>
  );
}
