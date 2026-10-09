export function EmptyState({
  eyebrow = "Nothing here",
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="rule-top rule-bottom flex flex-col items-center gap-4 py-16 text-center">
      <span className="stamp stamp-blue">{eyebrow}</span>
      <div className="max-w-md">
        <h2 className="display text-2xl text-ink">{title}</h2>
        {description ? (
          <p className="mt-2 leading-relaxed text-ink-soft">{description}</p>
        ) : null}
      </div>
    </div>
  );
}
