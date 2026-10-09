import { Building2, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";
import { VariantManager } from "@/components/owner/variant-manager";
import {
  getOwnerProfile,
  getPropertyFlats,
  getPropertyVariants,
} from "@/lib/api/owner";
import { getPropertyDetail } from "@/lib/api/properties";

type Params = Promise<{ id: string }>;

export default async function OwnerPropertyDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const [profile, detail] = await Promise.all([
    getOwnerProfile(),
    getPropertyDetail(id),
  ]);

  if (!detail) notFound();
  if (!profile || detail.property.ownerId !== profile.id) notFound();

  const [variants, flats] = await Promise.all([
    getPropertyVariants(id),
    getPropertyFlats(id),
  ]);

  const { property } = detail;
  const image = property.images?.[0]?.url ?? null;
  const available = flats.filter((flat) => flat.status === "AVAILABLE").length;

  return (
    <div className="space-y-8">
      <div className="flex">
        <Link
          href="/owner/properties"
          className="figure text-xs uppercase tracking-[0.16em] text-ink-soft transition-colors hover:text-ink"
        >
          ← Back to properties
        </Link>
      </div>

      <PageHeader
        index="02"
        eyebrow={property.city}
        title={property.title}
        description={`${property.address}, ${property.city}`}
      />

      <div className="rule-top grid gap-6 bg-surface/40 sm:grid-cols-[220px_1fr]">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink/5 sm:aspect-auto sm:h-full">
          {image ? (
            <Image
              src={image}
              alt={property.title}
              fill
              sizes="220px"
              className="object-cover"
            />
          ) : (
            <div className="facade flex h-full min-h-32 w-full items-center justify-center">
              <Building2 className="h-8 w-8 text-ink-soft/50" />
            </div>
          )}
        </div>
        <dl className="grid content-center gap-4 py-4 sm:grid-cols-3">
          <div>
            <dt className="figure text-xs uppercase tracking-[0.14em] text-ink-soft">
              Flats
            </dt>
            <dd className="display mt-1 text-2xl text-ink">{flats.length}</dd>
          </div>
          <div>
            <dt className="figure text-xs uppercase tracking-[0.14em] text-ink-soft">
              Available
            </dt>
            <dd className="display mt-1 text-2xl text-stamp">{available}</dd>
          </div>
          <div>
            <dt className="figure text-xs uppercase tracking-[0.14em] text-ink-soft">
              Variants
            </dt>
            <dd className="display mt-1 text-2xl text-ink">
              {variants.length}
            </dd>
          </div>
          <div className="sm:col-span-3">
            <dt className="figure text-xs uppercase tracking-[0.14em] text-ink-soft">
              Location
            </dt>
            <dd className="mt-1 flex items-center gap-1.5 text-sm text-ink">
              <MapPin className="h-3.5 w-3.5 text-tolet" />
              {property.address}, {property.city}, {property.district}
            </dd>
          </div>
        </dl>
      </div>

      <VariantManager propertyId={id} variants={variants} flats={flats} />
    </div>
  );
}
