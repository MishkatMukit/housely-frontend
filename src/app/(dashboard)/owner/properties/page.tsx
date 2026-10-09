import { Building2, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { getOwnerProfile, getOwnerProperties } from "@/lib/api/owner";

type SearchParams = Promise<{ page?: string; search?: string }>;

export default async function OwnerPropertiesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page: pageParam, search } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const profile = await getOwnerProfile();
  const result = profile
    ? await getOwnerProperties(profile.id, { page, search })
    : null;

  const properties = result?.data ?? [];
  const totalPages = result?.totalPages ?? 1;

  const newButton = (
    <Button
      className="rounded-none bg-tolet px-4 text-primary-foreground hover:bg-tolet/90"
      render={<Link href="/owner/properties/new" />}
    >
      <Plus className="mr-1.5 h-4 w-4" />
      New property
    </Button>
  );

  return (
    <div className="space-y-8">
      <PageHeader
        index="02"
        eyebrow="Owner register"
        title="Properties"
        description="Every building on your register. Open one to manage its variants, flats, and pricing."
        action={newButton}
      />

      {properties.length === 0 ? (
        <EmptyState
          eyebrow="No buildings yet"
          title="Your register is empty"
          description="Add your first property to start defining variants and issuing flats."
        />
      ) : (
        <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {properties.map((property) => {
            const image = property.images?.[0]?.url ?? null;
            const flats = property._count?.flats ?? property.totalFlats ?? 0;

            return (
              <Link
                key={property.id}
                href={`/owner/properties/${property.id}`}
                className="group rule-top flex flex-col bg-surface/50 transition-colors hover:bg-surface"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink/5">
                  {image ? (
                    <Image
                      src={image}
                      alt={property.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="facade flex h-full w-full items-center justify-center">
                      <Building2 className="h-8 w-8 text-ink-soft/50" />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2 px-4 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="display text-lg leading-snug text-ink">
                      {property.title}
                    </h2>
                    <span className="stamp stamp-blue shrink-0">
                      {flats} flats
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-ink-soft">
                    {property.address}, {property.city}
                  </p>
                  <span className="figure mt-auto pt-2 text-xs uppercase tracking-[0.16em] text-tolet">
                    Manage →
                  </span>
                </div>
              </Link>
            );
          })}
        </section>
      )}

      {totalPages > 1 ? (
        <nav className="flex items-center justify-between rule-top pt-5">
          <Button
            variant="outline"
            className="rounded-none"
            disabled={page <= 1}
            render={
              page > 1 ? (
                <Link
                  href={`/owner/properties?page=${page - 1}${search ? `&search=${search}` : ""}`}
                />
              ) : undefined
            }
          >
            Previous
          </Button>
          <span className="figure text-xs uppercase tracking-[0.16em] text-ink-soft">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            className="rounded-none"
            disabled={page >= totalPages}
            render={
              page < totalPages ? (
                <Link
                  href={`/owner/properties?page=${page + 1}${search ? `&search=${search}` : ""}`}
                />
              ) : undefined
            }
          >
            Next
          </Button>
        </nav>
      ) : null}
    </div>
  );
}
