# TalentFlow ATS - Frontend Documentation

Welcome to the frontend documentation for the **TalentFlow ATS** project. This project is built using modern web technologies and a scalable, feature-driven architecture to provide a premium and responsive recruitment experience.

## 🚀 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Utility**: [clsx](https://www.npmjs.com/package/clsx) & [tailwind-merge](https://www.npmjs.com/package/tailwind-merge)
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest)
- **Form Management**: [TanStack Form](https://tanstack.com/form/latest)
- **Validation**: [Zod](https://zod.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📂 Project Structure (Feature-Driven Architecture)

The project follows a scalable "Feature-Driven" structure, separating pure UI primitives from business logic and domain-specific features.

```text
frontend/
├── app/                  # Next.js App Router (Routes & Layouts only)
│   ├── admin/            # Admin-specific routes
│   │   ├── dashboard/    # Admin Dashboard page
│   │   └── layout.tsx    # Admin Layout (SSR)
│   ├── sign-in/          # Login page
│   ├── user/             # User-specific routes
│   └── page.tsx          # Registration / Home page
├── components/           # Component Library
│   ├── ui/               # Pure UI Primitives (Card, Button, Input) - Context-Agnostic
│   ├── shared/           # Cross-feature components (Navbar, Sidebar, Footer)
│   └── features/         # Domain-specific modules (Dashboard, Auth, etc.)
│       └── admin/        # Admin feature module
│           └── dashboard/# Components, hooks, and services for Admin Dashboard
├── lib/                  # Core logic and configuration
│   ├── api/              # Raw API calls and fetcher setup
│   ├── react-query/      # Centralized TanStack Query logic
│   │   ├── query-client.ts# Shared config + SSR prefetch factory
│   │   ├── admin/        # Admin-specific query hooks
│   │   └── user/         # User-specific query hooks (Auth, Profile)
│   └── validations/      # Zod validation schemas
├── public/               # Static assets
└── middleware.ts         # Role-based protection middleware
```

### 🧩 `components/` Breakdown

- **`ui/`**: Pure design system components. No business logic, no API calls.
- **`shared/`**: Higher-level layouts and reusable pieces like the global Sidebar or Navbar.
- **`features/`**: The "brains" of the application. Organized by domain (e.g., `admin`, `candidate`). Contains `DashboardContainer.tsx` and feature-specific components.

### 📚 `lib/react-query/`

Centralized location for all data-fetching logic.

- `query-client.ts`: Contains the `queryClientConfig` and SSR-friendly factory.
- Hooks are grouped by domain (e.g., `user/use-auth.ts`) to keep the API layer clean.

---

## 🔄 Rendering Strategy

### 🖥️ Server-Side Rendering (SSR)

We default to Server Components for performance and SEO.

- **Layouts**: Sidebars and headers are rendered on the server.
- **Prefetching**: Initial data for dashboards is prefetched using `prefetchQuery` in `page.tsx`.

### 🖱️ Client-Side Rendering (CSR)

Used only where interactivity is mandatory:

- **Forms**: Everything using TanStack Form (Sign In, Registration).
- **Interactions**: Toggling sidebars, dropdowns, and animations.

---

## 🎨 Design System

- **Primary Color**: `#F96331` (Arcgate Orange)
- **Backgrounds**: Deep slate and light stone for a professional feel.
- **Glassmorphism**: Leverages `backdrop-blur` and semi-transparent borders.

---

## 🛠️ Development Workflow

### Where to add new code?

1. **New UI Primitive?** Add to `components/ui/` (e.g., `Badge.tsx`).
2. **New Global Layout Part?** Add to `components/shared/` (e.g., `GlobalSearch.tsx`).
3. **New Business Logic/Screen?** Create a folder in `components/features/[role]/[feature-name]`.
4. **New API Hook?** Add to `lib/react-query/[domain]/use-[feature].ts`.

### Best Practices

- **Prefer Server Components**: Only add `"use client"` at the leaf nodes or specifically for interactive containers.
- **Absolute Imports**: Always use `@/` aliases (e.g., `@components/ui-elements/Card`).
- **Domain Isolation**: Code inside `features/admin` should generally not import from `features/user`.
