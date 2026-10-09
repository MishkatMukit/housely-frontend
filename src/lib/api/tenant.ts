import { type ServerFetchResult, serverFetch } from "@/lib/api/server";
import type {
  ApiResponse,
  Application,
  ApplicationStatus,
  CheckoutSession,
  Lease,
  LeaseStatus,
  Paginated,
  PaymentPage,
  PaymentStatus,
  PaymentType,
  TenantAnalytics,
  TenantProfile,
} from "@/types/api";

function buildQuery(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

export interface ApplicationFilters {
  page?: number;
  limit?: number;
  status?: ApplicationStatus;
  flatId?: string;
}

export interface LeaseFilters {
  page?: number;
  limit?: number;
  status?: LeaseStatus;
  propertyId?: string;
}

export interface PaymentFilters {
  page?: number;
  limit?: number;
  type?: PaymentType;
  status?: PaymentStatus;
}

export type TenantProfileUpdate = {
  name?: string;
  address?: string;
  gender?: "MALE" | "FEMALE";
  nationalIdNumber?: string;
  contactNumber?: string;
  employmentStatus?: string;
  aboutMe?: string;
};

export async function getTenantAnalytics(): Promise<TenantAnalytics | null> {
  const { ok, body } = await serverFetch<ApiResponse<TenantAnalytics>>(
    "/api/analytics/tenant",
  );
  return ok ? (body.data ?? null) : null;
}

export async function getTenantProfile(): Promise<TenantProfile | null> {
  const { ok, body } =
    await serverFetch<ApiResponse<TenantProfile>>("/api/tenants/me");
  return ok ? (body.data ?? null) : null;
}

export function updateTenantProfile(
  payload: TenantProfileUpdate,
): Promise<ServerFetchResult<ApiResponse<TenantProfile>>> {
  return serverFetch<ApiResponse<TenantProfile>>("/api/tenants/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function getMyApplications(
  filters: ApplicationFilters = {},
): Promise<Paginated<Application> | null> {
  const query = buildQuery({
    page: filters.page,
    limit: filters.limit ?? 10,
    status: filters.status,
    flatId: filters.flatId,
  });
  const { ok, body } = await serverFetch<ApiResponse<Paginated<Application>>>(
    `/api/applications/me${query}`,
  );
  return ok ? (body.data ?? null) : null;
}

export function withdrawApplication(
  id: string,
): Promise<ServerFetchResult<ApiResponse<Application>>> {
  return serverFetch<ApiResponse<Application>>(
    `/api/applications/${id}/withdraw`,
    { method: "DELETE" },
  );
}

export async function getMyLeases(
  filters: LeaseFilters = {},
): Promise<Paginated<Lease> | null> {
  const query = buildQuery({
    page: filters.page,
    limit: filters.limit ?? 10,
    status: filters.status,
    propertyId: filters.propertyId,
  });
  const { ok, body } = await serverFetch<ApiResponse<Paginated<Lease>>>(
    `/api/leases/me${query}`,
  );
  return ok ? (body.data ?? null) : null;
}

export async function getMyPayments(
  filters: PaymentFilters = {},
): Promise<PaymentPage | null> {
  const query = buildQuery({
    page: filters.page,
    limit: filters.limit ?? 10,
    type: filters.type,
    status: filters.status,
  });
  const { ok, body } = await serverFetch<ApiResponse<PaymentPage>>(
    `/api/payments/me${query}`,
  );
  return ok ? (body.data ?? null) : null;
}

export function initiateCheckout(
  id: string,
): Promise<ServerFetchResult<ApiResponse<CheckoutSession>>> {
  return serverFetch<ApiResponse<CheckoutSession>>(
    `/api/payments/${id}/checkout`,
    { method: "POST" },
  );
}
