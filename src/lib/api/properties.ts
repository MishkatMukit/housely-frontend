import { cacheLife, cacheTag } from "next/cache";
import { publicFetch } from "@/lib/api/server";
import type { ApiResponse, Paginated, Property, Variant } from "@/types/api";

export interface Listing {
  id: string;
  title: string;
  locality: string;
  city: string;
  district: string;
  flats: number;
  available: number;
  fromRent: number | null;
  unit: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  image: string | null;
  ownerName: string;
  reference: string;
}

export const fallbackListings: Listing[] = [
  {
    id: "lst-skyline",
    title: "Skyline Residence",
    locality: "12 Road 5, Dhanmondi",
    city: "Dhaka",
    district: "Dhaka",
    flats: 12,
    available: 3,
    fromRent: 15000,
    unit: "3 Bedroom",
    bedrooms: 3,
    bathrooms: 2,
    image: null,
    ownerName: "Housely Living",
    reference: "DHK-0031",
  },
  {
    id: "lst-gulshan-verge",
    title: "Gulshan Verge",
    locality: "Road 74, Gulshan 2",
    city: "Dhaka",
    district: "Dhaka",
    flats: 6,
    available: 1,
    fromRent: 45000,
    unit: "3 Bedroom",
    bedrooms: 3,
    bathrooms: 3,
    image: null,
    ownerName: "Meridian Estates",
    reference: "DHK-0118",
  },
  {
    id: "lst-kalyanpur",
    title: "Kalyanpur Corner",
    locality: "Block D, Kalyanpur",
    city: "Dhaka",
    district: "Dhaka",
    flats: 8,
    available: 4,
    fromRent: 11500,
    unit: "2 Bedroom",
    bedrooms: 2,
    bathrooms: 2,
    image: null,
    ownerName: "Nasrin Properties",
    reference: "DHK-0064",
  },
  {
    id: "lst-uttara-7",
    title: "Uttara Sector 7",
    locality: "Sector 7, Uttara",
    city: "Dhaka",
    district: "Dhaka",
    flats: 10,
    available: 2,
    fromRent: 22000,
    unit: "3 Bedroom",
    bedrooms: 3,
    bathrooms: 2,
    image: null,
    ownerName: "Rahman Builders",
    reference: "DHK-0202",
  },
  {
    id: "lst-mirpur-c",
    title: "Mirpur Block C",
    locality: "Block C, Mirpur",
    city: "Dhaka",
    district: "Dhaka",
    flats: 14,
    available: 6,
    fromRent: 9000,
    unit: "Studio",
    bedrooms: 1,
    bathrooms: 1,
    image: null,
    ownerName: "Housely Living",
    reference: "DHK-0097",
  },
  {
    id: "lst-banani",
    title: "Banani Terrace",
    locality: "Road 11, Banani",
    city: "Dhaka",
    district: "Dhaka",
    flats: 5,
    available: 1,
    fromRent: 38000,
    unit: "3 Bedroom",
    bedrooms: 3,
    bathrooms: 2,
    image: null,
    ownerName: "Meridian Estates",
    reference: "DHK-0155",
  },
];

export async function getListings(limit = 6): Promise<Listing[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("properties");

  try {
    const list = await publicFetch<ApiResponse<Paginated<Property>>>(
      `/api/properties/?page=1`,
    );
    const rows = list.body.data?.data;
    if (!list.ok || !rows?.length) return fallbackListings.slice(0, limit);

    const enriched = await Promise.all(
      rows.slice(0, limit).map(async (property) => {
        const [variantsRes, vacancyRes] = await Promise.all([
          publicFetch<ApiResponse<Variant[]>>(`/api/variants/${property.id}`),
          publicFetch<ApiResponse<{ available: number }>>(
            `/api/properties/vacancy/${property.id}`,
          ),
        ]);

        const variants = variantsRes.body.data ?? [];
        const rents = variants
          .map((variant) => Number(variant.rentAmount))
          .filter((value) => Number.isFinite(value));
        const cheapest =
          rents.length > 0
            ? variants[rents.indexOf(Math.min(...rents))]
            : undefined;

        const flats = property._count?.flats ?? property.totalFlats ?? 0;

        return {
          id: property.id,
          title: property.title,
          locality: property.address,
          city: property.city,
          district: property.district,
          flats,
          available: vacancyRes.body.data?.available ?? 0,
          fromRent: cheapest ? Number(cheapest.rentAmount) : null,
          unit: cheapest?.name ?? null,
          bedrooms: cheapest?.bedrooms ?? null,
          bathrooms: cheapest?.bathrooms ?? null,
          image: property.images?.[0]?.url ?? null,
          ownerName:
            property.owner?.user?.name ??
            property.companyName ??
            "Housely owner",
          reference: `REF-${property.id.slice(0, 4).toUpperCase()}`,
        } satisfies Listing;
      }),
    );

    return enriched;
  } catch {
    return fallbackListings.slice(0, limit);
  }
}

export interface RegisterStats {
  properties: number;
  vacant: number;
  totalFlats: number;
  cities: string[];
}

export const fallbackRegisterStats: RegisterStats = {
  properties: 9,
  vacant: 21,
  totalFlats: 36,
  cities: ["Dhaka"],
};

export async function getRegisterStats(): Promise<RegisterStats> {
  "use cache";
  cacheLife("hours");
  cacheTag("properties");

  try {
    const seen = new Map<string, Property>();
    let page = 1;
    let totalPages = 1;

    do {
      const res = await publicFetch<ApiResponse<Paginated<Property>>>(
        `/api/properties/?page=${page}`,
      );
      const paginated = res.body.data;
      if (!res.ok || !paginated) break;
      totalPages = paginated.totalPages ?? 1;
      for (const property of paginated.data ?? [])
        seen.set(property.id, property);
      if (seen.size >= 200) break;
      page += 1;
    } while (page <= totalPages);

    const properties = [...seen.values()];
    if (!properties.length) return fallbackRegisterStats;

    const tallies = await Promise.all(
      properties.map(async (property) => {
        let available = 0;
        try {
          const vacancy = await publicFetch<ApiResponse<{ available: number }>>(
            `/api/properties/vacancy/${property.id}`,
          );
          available = vacancy.body.data?.available ?? 0;
        } catch {
          available = 0;
        }
        return {
          available,
          flats: property._count?.flats ?? property.totalFlats ?? 0,
          city: property.city,
        };
      }),
    );

    const { vacant, totalFlats, cities } = tallies.reduce(
      (acc, row) => ({
        vacant: acc.vacant + row.available,
        totalFlats: acc.totalFlats + row.flats,
        cities: acc.cities.add(row.city),
      }),
      { vacant: 0, totalFlats: 0, cities: new Set<string>() },
    );

    return {
      properties: properties.length,
      vacant,
      totalFlats,
      cities: cities.size > 0 ? [...cities] : fallbackRegisterStats.cities,
    };
  } catch {
    return fallbackRegisterStats;
  }
}

export function formatTaka(value: number): string {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace("BDT", "৳")
    .trim();
}
