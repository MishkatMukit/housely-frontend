import type { ReactNode } from "react";

export function PageHeader({
  index,
  eyebrow,
  title,
  description,
  action,
}: {
  index?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="rule-bottom flex flex-col gap-5 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2.5">
        {(eyebrow || index) && (
          <p className="eyebrow flex items-center gap-2">
            {index ? <span className="figure text-tolet">{index}</span> : null}
            {eyebrow}
          </p>
        )}
        <h1 className="display text-3xl text-ink sm:text-4xl">{title}</h1>
        {description ? (
          <p className="max-w-2xl text-sm leading-relaxed text-ink-soft">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
