import { Reveal } from "@/components/shared/reveal";

interface RegisterBandProps {
  properties: number;
  vacant: number;
  totalFlats: number;
  cities: string[];
}

export function RegisterBand({
  properties,
  vacant,
  totalFlats,
  cities,
}: RegisterBandProps) {
  const columns = [
    { label: "Properties on the register", value: properties, index: "01" },
    { label: "Flats vacant today", value: vacant, index: "02" },
    { label: "Flats on the register", value: totalFlats, index: "03" },
    { label: "Cities served", value: cities.length, index: "04" },
  ];

  return (
    <section className="bg-ink text-paper">
      <div className="mx-auto w-full max-w-[1400px] px-5 py-10 sm:px-8 lg:py-14">
        <div className="rule-bottom flex items-baseline justify-between pb-3">
          <span className="eyebrow !text-paper/60">
            Cash &amp; ledger summary
          </span>
          <span className="figure text-[0.6875rem] text-paper/50">
            as of <span className="whitespace-nowrap">this morning</span>
          </span>
        </div>

        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {columns.map((col, i) => (
            <Reveal
              key={col.label}
              delay={i * 80}
              className="rule-left flex flex-col gap-3 py-6 pr-6 pl-4 sm:pl-6 [&:first-child]:border-l-0"
            >
              <dt className="eyebrow !text-paper/60">{col.label}</dt>
              <dd className="display flex items-baseline gap-2 text-5xl text-paper lg:text-6xl">
                {col.value.toString().padStart(2, "0")}
                <span className="figure align-baseline text-sm text-paper/40">
                  {col.index}
                </span>
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
