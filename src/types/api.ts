export type ApiResponse<T = any> = {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
};

export type UserRole = "TENANT" | "OWNER" | "ADMIN" | "SUPERADMIN";
export type UserStatus = "ACTIVE" | "BLOCKED" | "DELETED";
export type AuthProvider = "CREDENTIAL" | "GOOGLE";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  address?: string | null;
  nationalIdNumber?: string | null;
  gender?: "MALE" | "FEMALE" | null;
  authProvider?: AuthProvider;
  createdAt: string;
  updatedAt: string;
  tenant?: Tenant | null;
  owner?: Owner | null;
}

export interface Tenant {
  id: string;
  userId: string;
  name: string;
  email: string;
  contactNumber?: string | null;
  employmentStatus?: string | null;
  aboutMe?: string | null;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface Owner {
  id: string;
  userId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  contactNumber?: string | null;
  verificationDocuments?: Array<{ url: string; publicId: string }>;
  rejectionReason?: string | null;
  rejectionHistory?: Array<{
    reason: string;
    rejectedBy: string;
    rejectedAt: string;
  }>;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  averageRating?: number | null;
  totalReviews?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Property {
  id: string;
  ownerId: string;
  title: string;
  description?: string | null;
  address: string;
  city: string;
  district: string;
  postalCode?: string | null;
  companyName?: string | null;
  images?: Array<{ url: string; publicId: string }> | null;
  totalFlats?: number;
  createdAt: string;
  updatedAt: string;
  owner?: {
    id: string;
    user: {
      id: string;
      name: string;
    };
  };
  _count?: {
    flats: number;
  };
}

export interface Variant {
  id: string;
  propertyId: string;
  name: string;
  bedrooms: number;
  bathrooms: number;
  sizeSqft: number;
  rentAmount: string;
  advanceAmount: string;
  totalUnits: number;
  images?: Array<{ url: string; publicId: string }> | null;
  createdAt: string;
  updatedAt: string;
}

export interface Flat {
  id: string;
  propertyId: string;
  variantId: string;
  flatNumber: string;
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE" | "UNAVAILABLE";
  rentOverride?: string | null;
  advanceOverride?: string | null;
  createdAt: string;
  updatedAt: string;
  variant?: Variant;
  property?: Partial<Property>;
}

export type ApplicationStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "WITHDRAWN";

export interface Application {
  id: string;
  tenantId: string;
  flatId: string;
  monthlyIncome?: string | null;
  employment?: string | null;
  message?: string | null;
  status: ApplicationStatus;
  documents?: any | null;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
  flat?: Flat;
  tenant?: Tenant & { user: User };
}

export type LeaseStatus =
  | "PENDING"
  | "ACTIVE"
  | "INACTIVE"
  | "COMPLETED"
  | "TERMINATED"
  | "CANCELLED";
export type PaymentType = "ADVANCE" | "MONTHLY_RENT";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface Payment {
  id: string;
  leaseId: string;
  tenantId: string;
  ownerId: string;
  amount: string;
  type: PaymentType;
  status: PaymentStatus;
  periodStart?: string | null;
  periodEnd?: string | null;
  bkashPaymentId?: string | null;
  bkashTransactionId?: string | null;
  paymentMethod?: string | null;
  paidAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Lease {
  id: string;
  tenantId: string;
  ownerId: string;
  flatId: string;
  amount: string;
  startDate: string;
  endDate: string;
  status: LeaseStatus;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
  flat?: Flat;
  tenant?: Tenant & { user: User };
  payments?: Payment[];
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
