import { type ServerFetchResult, serverFetch } from "@/lib/api/server";
import type {
  ApiResponse,
  Application,
  ApplicationStatus,
  Flat,
  Lease,
  LeaseStatus,
  OwnerAnalytics,
  OwnerProfile,
  Paginated,
  PaymentPage,
  PaymentStatus,
  PaymentType,
  Property,
  VariantWithCount,
} from "@/types/api";

function buildQuery(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

export interface OwnerApplicationFilters {
  page?: number;
  limit?: number;
  status?: ApplicationStatus;
  propertyId?: string;
  flatId?: string;
}

export interface OwnerLeaseFilters {
  page?: number;
  limit?: number;
  status?: LeaseStatus;
  propertyId?: string;
}

export interface OwnerPaymentFilters {
  page?: number;
  limit?: number;
  type?: PaymentType;
  status?: PaymentStatus;
}

export interface OwnerPropertyFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export type OwnerProfileUpdate = {
  contactNumber?: string;
  name?: string;
  address?: string;
  gender?: "MALE" | "FEMALE";
  nationalIdNumber?: string;
};

export type VariantUpdate = {
  name?: string;
  bedrooms?: number;
  bathrooms?: number;
  sizeSqft?: number;
  rentAmount?: number;
  advanceAmount?: number;
};

export type FlatUpdate = {
  flatNumber?: string;
  status?: "AVAILABLE" | "MAINTENANCE" | "UNAVAILABLE";
  rentOverride?: number | null;
  advanceOverride?: number | null;
};

export async function getOwnerAnalytics(): Promise<OwnerAnalytics | null> {
  const { ok, body } = await serverFetch<ApiResponse<OwnerAnalytics>>(
    "/api/analytics/owner",
  );
  return ok ? (body.data ?? null) : null;
}

export async function getOwnerProfile(): Promise<OwnerProfile | null> {
  const { ok, body } =
    await serverFetch<ApiResponse<OwnerProfile>>("/api/owner/profile");
  return ok ? (body.data ?? null) : null;
}

export function updateOwnerProfile(
  payload: OwnerProfileUpdate,
): Promise<ServerFetchResult<ApiResponse<OwnerProfile>>> {
  return serverFetch<ApiResponse<OwnerProfile>>("/api/owner/update-profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function applyAsOwner(
  formData: FormData,
): Promise<ServerFetchResult<ApiResponse<unknown>>> {
  return serverFetch<ApiResponse<unknown>>("/api/owner/apply", {
    method: "POST",
    body: formData,
  });
}

export async function getOwnerApplications(
  filters: OwnerApplicationFilters = {},
): Promise<Paginated<Application> | null> {
  const query = buildQuery({
    page: filters.page,
    limit: filters.limit ?? 10,
    status: filters.status,
    propertyId: filters.propertyId,
    flatId: filters.flatId,
  });
  const { ok, body } = await serverFetch<ApiResponse<Paginated<Application>>>(
    `/api/owner/applications${query}`,
  );
  return ok ? (body.data ?? null) : null;
}

export function approveApplication(
  id: string,
): Promise<ServerFetchResult<ApiResponse<Application>>> {
  return serverFetch<ApiResponse<Application>>(
    `/api/applications/${id}/approve`,
    { method: "PATCH" },
  );
}

export function rejectApplication(
  id: string,
  rejectionReason: string,
): Promise<ServerFetchResult<ApiResponse<Application>>> {
  return serverFetch<ApiResponse<Application>>(
    `/api/applications/${id}/reject`,
    { method: "PATCH", body: JSON.stringify({ rejectionReason }) },
  );
}

export async function getOwnerProperties(
  ownerId: string,
  filters: OwnerPropertyFilters = {},
): Promise<Paginated<Property> | null> {
  const query = buildQuery({
    page: filters.page,
    limit: filters.limit ?? 12,
    search: filters.search,
    ownerId,
  });
  const { ok, body } = await serverFetch<ApiResponse<Paginated<Property>>>(
    `/api/properties/${query}`,
  );
  return ok ? (body.data ?? null) : null;
}

export function createProperty(
  formData: FormData,
): Promise<ServerFetchResult<ApiResponse<Property>>> {
  return serverFetch<ApiResponse<Property>>("/api/properties/", {
    method: "POST",
    body: formData,
  });
}

export async function getPropertyVariants(
  propertyId: string,
): Promise<VariantWithCount[]> {
  const { ok, body } = await serverFetch<ApiResponse<VariantWithCount[]>>(
    `/api/variants/${propertyId}`,
  );
  return ok ? (body.data ?? []) : [];
}

export function createVariant(
  propertyId: string,
  formData: FormData,
): Promise<ServerFetchResult<ApiResponse<VariantWithCount>>> {
  return serverFetch<ApiResponse<VariantWithCount>>(
    `/api/variants/${propertyId}`,
    { method: "POST", body: formData },
  );
}

export function updateVariant(
  id: string,
  payload: VariantUpdate,
): Promise<ServerFetchResult<ApiResponse<VariantWithCount>>> {
  return serverFetch<ApiResponse<VariantWithCount>>(`/api/variants/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteVariant(
  id: string,
): Promise<ServerFetchResult<ApiResponse<null>>> {
  return serverFetch<ApiResponse<null>>(`/api/variants/${id}`, {
    method: "DELETE",
  });
}

export async function getPropertyFlats(
  propertyId: string,
  variantId?: string,
): Promise<Flat[]> {
  const query = variantId ? `?variantId=${variantId}` : "";
  const { ok, body } = await serverFetch<ApiResponse<Flat[]>>(
    `/api/flats/properties/${propertyId}/${query}`,
  );
  return ok ? (body.data ?? []) : [];
}

export function addFlats(
  variantId: string,
  payload: { count: number; flatNumberPrefix?: string },
): Promise<ServerFetchResult<ApiResponse<VariantWithCount>>> {
  return serverFetch<ApiResponse<VariantWithCount>>(
    `/api/flats/variants/${variantId}`,
    { method: "POST", body: JSON.stringify(payload) },
  );
}

export function updateFlat(
  id: string,
  payload: FlatUpdate,
): Promise<ServerFetchResult<ApiResponse<Flat>>> {
  return serverFetch<ApiResponse<Flat>>(`/api/flats/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteFlat(
  id: string,
): Promise<ServerFetchResult<ApiResponse<null>>> {
  return serverFetch<ApiResponse<null>>(`/api/flats/${id}`, {
    method: "DELETE",
  });
}

export async function getOwnerLeases(
  filters: OwnerLeaseFilters = {},
): Promise<Paginated<Lease> | null> {
  const query = buildQuery({
    page: filters.page,
    limit: filters.limit ?? 10,
    status: filters.status,
    propertyId: filters.propertyId,
  });
  const { ok, body } = await serverFetch<ApiResponse<Paginated<Lease>>>(
    `/api/leases/owner${query}`,
  );
  return ok ? (body.data ?? null) : null;
}

export function terminateLease(
  id: string,
  rejectionReason?: string,
): Promise<ServerFetchResult<ApiResponse<Lease>>> {
  return serverFetch<ApiResponse<Lease>>(`/api/leases/${id}/terminate`, {
    method: "PATCH",
    body: JSON.stringify(rejectionReason ? { rejectionReason } : {}),
  });
}

export async function getOwnerPayments(
  filters: OwnerPaymentFilters = {},
): Promise<PaymentPage | null> {
  const query = buildQuery({
    page: filters.page,
    limit: filters.limit ?? 10,
    type: filters.type,
    status: filters.status,
  });
  const { ok, body } = await serverFetch<ApiResponse<PaymentPage>>(
    `/api/payments/owner${query}`,
  );
  return ok ? (body.data ?? null) : null;
}
