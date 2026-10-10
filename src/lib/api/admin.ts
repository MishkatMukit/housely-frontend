import { type ServerFetchResult, serverFetch } from "@/lib/api/server";
import type {
  AdminAnalytics,
  AdminOwner,
  ApiResponse,
  OwnerApplication,
  Paginated,
  TenantProfile,
  User,
  UserRole,
  UserStatus,
} from "@/types/api";

function buildQuery(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

export interface AdminUserFilters {
  page?: number;
  limit?: number;
  status?: UserStatus;
  role?: UserRole;
  search?: string;
}

export interface AdminTenantFilters {
  page?: number;
  limit?: number;
  status?: "ACTIVE" | "INACTIVE";
  search?: string;
}

export interface AdminOwnerFilters {
  page?: number;
  limit?: number;
  status?: "PENDING" | "APPROVED" | "REJECTED" | "ALL";
  search?: string;
}

export async function getAdminAnalytics(): Promise<AdminAnalytics | null> {
  const { ok, body } = await serverFetch<ApiResponse<AdminAnalytics>>(
    "/api/analytics/admin",
  );
  return ok ? (body.data ?? null) : null;
}

export async function getAdminUsers(
  filters: AdminUserFilters = {},
): Promise<Paginated<User> | null> {
  const query = buildQuery({
    page: filters.page,
    limit: filters.limit ?? 10,
    status: filters.status,
    role: filters.role,
    search: filters.search,
  });
  const { ok, body } = await serverFetch<ApiResponse<Paginated<User>>>(
    `/api/admin/users${query}`,
  );
  return ok ? (body.data ?? null) : null;
}

export async function getAdminUser(id: string): Promise<User | null> {
  const { ok, body } = await serverFetch<ApiResponse<User>>(
    `/api/admin/users/${id}`,
  );
  return ok ? (body.data ?? null) : null;
}

export async function getAdminTenants(
  filters: AdminTenantFilters = {},
): Promise<Paginated<TenantProfile> | null> {
  const query = buildQuery({
    page: filters.page,
    limit: filters.limit ?? 10,
    status: filters.status,
    search: filters.search,
  });
  const { ok, body } = await serverFetch<ApiResponse<Paginated<TenantProfile>>>(
    `/api/admin/tenants${query}`,
  );
  return ok ? (body.data ?? null) : null;
}

export async function getAdminOwners(
  filters: AdminOwnerFilters = {},
): Promise<Paginated<AdminOwner> | null> {
  const query = buildQuery({
    page: filters.page,
    limit: filters.limit ?? 10,
    status: filters.status,
    search: filters.search,
  });
  const { ok, body } = await serverFetch<ApiResponse<Paginated<AdminOwner>>>(
    `/api/admin/owners${query}`,
  );
  return ok ? (body.data ?? null) : null;
}

export async function getAdminOwnerApplications(
  filters: AdminOwnerFilters = {},
): Promise<Paginated<OwnerApplication> | null> {
  const query = buildQuery({
    page: filters.page,
    limit: filters.limit ?? 10,
    status: filters.status,
    search: filters.search,
  });
  const { ok, body } = await serverFetch<
    ApiResponse<Paginated<OwnerApplication>>
  >(`/api/admin/owners/applications${query}`);
  return ok ? (body.data ?? null) : null;
}

export function approveOwner(
  id: string,
): Promise<ServerFetchResult<ApiResponse<AdminOwner>>> {
  return serverFetch<ApiResponse<AdminOwner>>(
    `/api/admin/owners/${id}/approve`,
    { method: "PATCH" },
  );
}

export function rejectOwner(
  id: string,
  rejectionReason: string,
): Promise<ServerFetchResult<ApiResponse<AdminOwner>>> {
  return serverFetch<ApiResponse<AdminOwner>>(
    `/api/admin/owners/${id}/reject`,
    { method: "PATCH", body: JSON.stringify({ rejectionReason }) },
  );
}

export function makeAdmin(
  id: string,
): Promise<ServerFetchResult<ApiResponse<User>>> {
  return serverFetch<ApiResponse<User>>(`/api/admin/users/${id}/make-admin`, {
    method: "PATCH",
  });
}

export function blockUser(
  id: string,
): Promise<ServerFetchResult<ApiResponse<User>>> {
  return serverFetch<ApiResponse<User>>(`/api/admin/users/${id}/block`, {
    method: "PATCH",
  });
}

export function unblockUser(
  id: string,
): Promise<ServerFetchResult<ApiResponse<User>>> {
  return serverFetch<ApiResponse<User>>(`/api/admin/users/${id}/unblock`, {
    method: "PATCH",
  });
}

export function deleteUser(
  id: string,
): Promise<ServerFetchResult<ApiResponse<null>>> {
  return serverFetch<ApiResponse<null>>(`/api/admin/users/${id}`, {
    method: "DELETE",
  });
}
