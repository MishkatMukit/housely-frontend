import { Reveal } from "@/components/shared/reveal";

const STEPS = [
  {
    index: "01",
    title: "Application",
    body: "Send your details from the listing. No gatekeepers, no broker fees — you talk to the owner directly.",
    stamp: "Filed",
    className: "stamp-blue",
  },
  {
    index: "02",
    title: "Decision",
    body: "The owner reviews and approves — or declines — and you see the answer either way. No vanishing callbacks.",
    stamp: "Decided",
    className: "stamp-green",
  },
  {
    index: "03",
    title: "Lease",
    body: "Approved? The lease sets rent, advance and dates in plain writing, signed by both sides before you move in.",
    stamp: "Signed",
    className: "stamp-red",
  },
  {
    index: "04",
    title: "Rent",
    body: "Pay monthly or advance by bKash straight to the owner. Every taka is receipted, next to its month.",
    stamp: "Receipted",
    className: "stamp-blue",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="paper-rules">
      <div className="mx-auto w-full max-w-[1400px] px-5 py-16 sm:px-8 lg:py-24">
        <div className="grid max-w-4xl gap-4">
          <p className="eyebrow">How a flat changes hands</p>
          <h2 className="display text-4xl text-ink sm:text-5xl">
            One page, <span className="text-tolet">four stamps.</span>
          </h2>
          <p className="max-w-prose leading-relaxed text-ink-soft">
            Picking a flat is only the first line. Everything after it — the
            decision, the lease, the monthly payment — is written in the same
            register, so nobody has to ask “did you pay?” twice.
          </p>
        </div>

        <ol className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal
              key={step.index}
              as="li"
              delay={i * 90}
              className="group stamp-wobble flex flex-col border-t border-ink/20 py-6 pr-6 [&:nth-child(n+3)]:border-t sm:[&:nth-child(3)]:border-t-0 lg:[&:nth-child(3)]:border-t lg:[&:nth-child(n+3)]:border-l"
            >
              <div className="flex items-baseline justify-between">
                <span className="figure text-xs text-ink-soft">
                  {step.index}
                </span>
                <span
                  className={`stamp opacity-70 transition-opacity group-hover:opacity-100 ${step.className}`}
                >
                  {step.stamp}
                </span>
              </div>
              <h3 className="display mt-6 text-2xl text-ink">{step.title}</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
                {step.body}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
