import Link from "next/link";
import { PageHeader } from "@/components/dashboard/page-header";
import { PropertyForm } from "@/components/forms/property-form";

export default function NewPropertyPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        index="02"
        eyebrow="New entry"
        title="Add a property"
        description="Register a building. You'll define its bedroom variants and flats once it exists."
      />
      <Link
        href="/owner/properties"
        className="figure text-xs uppercase tracking-[0.16em] text-ink-soft transition-colors hover:text-ink"
      >
        ← Back to properties
      </Link>
      <PropertyForm />
    </div>
  );
}
