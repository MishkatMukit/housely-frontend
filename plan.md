# Housely Frontend - Implementation Plan

## Project Overview

Housely is a property rental and tenancy management platform. The backend (housely-backend) is fully implemented with a comprehensive REST API supporting authentication, property management, applications, leases, payments (bKash), and role-based analytics.

This plan outlines how to build the frontend for Housely using Next.js 16.4 (App Router) with React 19 and Tailwind CSS.

## 1. Backend Analysis Summary

Based on analysis of README.md and API.md from housely-backend:

### Core Features
- **Authentication**: Register, email verification (OTP), login, Google OAuth, refresh tokens, password reset with OTP
- **User Management**: Profile updates, profile image upload, role-based access (TENANT, OWNER, ADMIN, SUPERADMIN)
- **Property Management**: Create properties (owners), browse/list properties (public), variants and flats management
- **Applications**: Tenants apply to flats, owners approve/reject, track application status
- **Leasing**: Auto-created on approval, lease lifecycle management, termination
- **Payments**: bKash integration with checkout, callback handling, verification
- **Admin**: User moderation, owner verification queue, analytics
- **Analytics**: Role-specific dashboards (admin/owner/tenant)

### API Base & Auth
- Base URL: `https://housely-backend-seven.vercel.app` (prod) / `http://localhost:5000` (dev)
- Auth via cookies (`accessToken`, `refreshToken`) with `httpOnly` or Bearer token
- Response envelope: `{ success, statusCode, message, data }`
- Roles: TENANT, OWNER, ADMIN, SUPERADMIN

## 2. Frontend Tech Stack

Current setup:
- Next.js 16.4 with App Router
- React 19.3.0
- TypeScript 5
- Tailwind CSS v4
- Biome (linting/formatting)

Recommended additions:
- **State Management**: Zustand (for auth/user state)
- **Data Fetching**: TanStack Query (React Query) v5 - for caching, mutations, infinite scroll
- **Form Handling**: React Hook Form + Zod validation (works with Server Actions too)
- **HTTP Client**: OFetch - lightweight, type-safe, with interceptors for auth/refresh
- **API Proxy**: Next.js Route Handlers (`app/api/proxy/*`) for secure backend routing (avoid exposing tokens directly, handle cookies properly)
- **UI Components**: shadcn/ui (built on Radix + Tailwind)
- **Icons**: lucide-react
- **Toast Notifications**: sonner
- **Date Handling**: date-fns
- **File Upload**: Built-in with FormData
- **Data Visualization**: recharts (for analytics dashboards)
- **Image Optimization**: next/image (already included)

## 3. Project Structure

Recommended structure under `src/`:

```
src/
├── app/                        # App Router pages
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   ├── verify-email/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── (public)/
│   │   ├── properties/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── tenant/
│   │   ├── owner/
│   │   └── admin/
│   ├── api/
│   │   └── proxy/              # API proxy route handlers for secure routing
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── shared/                # Shared components (navbar, footer, charts, etc.)
│   ├── forms/
│   └── tables/
├── lib/
│   ├── api/                   # API client using OFetch
│   │   ├── ofetch.ts
│   │   ├── endpoints.ts
│   │   └── types.ts
│   ├── utils/
│   ├── validations/           # Zod schemas
│   └── constants.ts
├── hooks/
│   ├── use-auth.ts
│   ├── queries/
│   └── mutations/
├── store/                     # Zustand stores
├── types/
└── middleware.ts
```

## 4. API Client & Types Setup

### Environment Variables
Create `.env.local` in frontend:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

### OFetch Client (`src/lib/api/ofetch.ts`)
- Use `ofetch` with custom configuration
- Set base URL via proxy or direct backend
- Handle credentials/cookies for auth
- Implement request/response interceptors for token refresh
- Type-safe error handling
- Works well with SSR

### Proxy Setup (`app/api/proxy/[...path]/route.ts`)
- Create Next.js API route handlers to proxy requests to backend
- Keep backend URL/server-side only
- Forward cookies, headers properly
- Better for security (hide backend URL, control auth flow)

### Type Definitions
Create comprehensive TypeScript types based on API responses. Mirror all enums from backend.

## 5. Implementation Phases

### Phase 1: Setup & Foundation
- [ ] Install dependencies (ofetch, @tanstack/react-query, react-hook-form, @hookform/resolvers, zod, sonner, lucide-react, zustand, recharts)
- [ ] Setup shadcn/ui with custom theme (non-generic design)
- [ ] Create `.env.local`
- [ ] Create TypeScript types from API schema
- [ ] Setup proxy route handlers
- [ ] Setup OFetch client with interceptors & refresh logic
- [ ] Setup React Query provider
- [ ] Create auth store (Zustand)
- [ ] Setup middleware for route protection
- [ ] Create API endpoint constants
- [ ] Create validation schemas with Zod
- [ ] Configure loading.tsx strategy

### Phase 2: Authentication
- [ ] Login page (Server Action + form)
- [ ] Register page
- [ ] Email verification (OTP)
- [ ] Forgot password flow
- [ ] Reset password
- [ ] Google OAuth integration
- [ ] Auth state management
- [ ] Protected routes via middleware
- [ ] Navbar with auth state, role-based menu
- [ ] Logout functionality
- [ ] Auto-refresh token handling

### Phase 3: Public Pages
- [ ] Landing page (Hero, features, CTA) - custom designed
- [ ] Properties listing with filters
- [ ] Property details using next/image
- [ ] Apply CTA with auth check

### Phase 4: Tenant Dashboard
- [ ] Dashboard with analytics cards
- [ ] Profile management
- [ ] Applications (list, withdraw)
- [ ] Leases (view, payments)
- [ ] Payments with bKash checkout
- [ ] Handle payment callback

### Phase 5: Owner Dashboard
  - [x] Owner dashboard with analytics + recharts
  - [x] Property management (create/list/detail with next/image)
  - [x] Variants & Flats management
  - [x] Applications review (approve/reject)
  - [x] Leases management (terminate)
  - [x] Tenants list
  - [x] Owner profile/application

### Phase 6: Admin Dashboard
- [ ] Admin dashboard with platform analytics using recharts
- [ ] Users management
- [ ] Owners & owner applications
- [ ] Analytics visualization

### Phase 7: Polish
- [ ] Custom theme refinement (non-generic)
- [ ] Loading states (loading.tsx), skeletons
- [ ] Empty states
- [ ] Responsive design
- [ ] Error boundaries
- [ ] Toasts
- [ ] SEO metadata
- [ ] Build/lint checks

## 6. Key Implementation Notes

### OFetch vs Axios
- Lighter bundle size
- Better TypeScript support
- Native fetch API under the hood
- Easier interceptors
- Works great with SSR

### Proxy Strategy
- Use Next.js route handlers (`app/api/proxy/`) to forward requests
- Keep secrets server-side
- Handle Set-Cookie forwarding
- Consistent error handling

### Data Visualization
- Use recharts for dashboards (line/bar/pie charts)
- Keep charts responsive
- Match design system

### Images
- Always use next/image for property images, avatars, etc.
- Configure image domains in next.config.ts if needed

## 7. Success Criteria
- All flows work end-to-end
- Role-based access enforced
- Responsive, polished custom UI (not generic template)
- SSR-first, proper loading.tsx usage
- Server Actions for forms
- Recharts for visualizations
- OFetch via secure proxy
- No lint/build errors

---

*Refer to API.md for exact request/response shapes.*