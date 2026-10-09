import { formatTaka } from "@/lib/api/properties";

interface ToLetPlacardProps {
  title?: string;
  locality?: string;
  rent?: number | null;
  unit?: string;
  bedrooms?: number;
  bathrooms?: number;
  reference?: string;
  available?: number;
}

export function ToLetPlacard({
  title = "Skyline Residence",
  locality = "Dhanmondi · Road 5",
  rent = 15000,
  unit = "3 Bedroom",
  bedrooms = 3,
  bathrooms = 2,
  reference = "DHK-0031",
  available = 3,
}: ToLetPlacardProps) {
  return (
    <div
      className="relative mx-auto w-full max-w-[340px] select-none"
      role="img"
      aria-label={`To-let placard for ${title}`}
    >
      <span className="placard-nail" />
      <span
        className="placard-string left-1/2 -translate-x-[56px]"
        aria-hidden="true"
      />
      <span
        className="placard-string left-1/2 translate-x-[55px]"
        aria-hidden="true"
      />
      <div className="placard-hang">
        <div className="placard px-5 py-6 sm:px-6">
          <div className="flex items-center justify-between pt-1">
            <span className="eyebrow">For rent</span>
            <span className="figure text-[0.625rem] text-ink-soft">
              NO. {reference}
            </span>
          </div>

          <h3 className="display mt-4 text-[3.4rem] leading-[0.82] sm:text-[4rem]">
            To<span className="text-tolet">-Let</span>
          </h3>

          <div className="mt-4 flex items-center gap-2">
            <span className="h-[5px] w-full bg-tolet" />
            <span className="h-[5px] w-8 bg-ink" />
          </div>

          <dl className="figure mt-5 space-y-1.5 text-[0.8125rem] text-ink">
            <div className="flex justify-between">
              <dt className="text-ink-soft">Building</dt>
              <dd className="font-semibold">{title}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">Address</dt>
              <dd className="font-semibold">{locality}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">Unit</dt>
              <dd className="font-semibold">
                {bedrooms} bed · {bathrooms} bath · {unit}
              </dd>
            </div>
          </dl>

          <div className="mt-5 flex items-end justify-between border-t border-dashed border-ink/40 pt-4">
            <div>
              <div className="eyebrow text-[0.5625rem]">Rent</div>
              <div className="display text-3xl text-tolet">
                {rent ? formatTaka(rent) : "—"}
                <span className="ml-1 align-middle text-[0.6rem] font-medium tracking-wide text-ink-soft">
                  / month
                </span>
              </div>
            </div>
            <span className="stamp stamp-red mb-1">Vacant · {available}</span>
          </div>

          <p className="figure mt-4 text-[0.625rem] tracking-wide text-ink-soft">
            SEE THE FULL REGISTER AT housely.com · CALL 01712-345678
          </p>
        </div>
      </div>
    </div>
  );
}
