import { ForOwners } from "@/components/home/for-owners";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { RegisterBand } from "@/components/home/register-band";
import { Vacancies } from "@/components/home/vacancies";
import { SiteFooter } from "@/components/shared/site-footer";
import { SiteHeader } from "@/components/shared/site-header";
import {
  fallbackListings,
  getListings,
  getRegisterStats,
} from "@/lib/api/properties";

export default async function Home() {
  const [listings, stats] = await Promise.all([
    getListings(6),
    getRegisterStats(),
  ]);

  const featured = listings[0] ?? fallbackListings[0];

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero featured={featured} />
        <RegisterBand
          properties={stats.properties}
          vacant={stats.vacant}
          totalFlats={stats.totalFlats}
          cities={stats.cities}
        />
        <HowItWorks />
        <Vacancies listings={listings} />
        <ForOwners />
      </main>
      <SiteFooter />
    </div>
  );
}
