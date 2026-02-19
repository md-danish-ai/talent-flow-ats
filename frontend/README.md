# TalentFlow ATS - Frontend Documentation

Welcome to the frontend documentation for the **TalentFlow ATS** project. This project is built using modern web technologies to provide a premium, efficient, and responsive recruitment experience.

## 🚀 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Utility**: [clsx](https://www.npmjs.com/package/clsx) & [tailwind-merge](https://www.npmjs.com/package/tailwind-merge) (for dynamic class naming)
- **State Management & Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Form Management**: [TanStack Form](https://tanstack.com/form/latest)
- **Validation**: [Zod](https://zod.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📂 Project Structure

Below is a high-level overview of the frontend folder structure:

```text
frontend/
├── app/                  # Next.js App Router (Pages & Layouts)
│   ├── admin/            # Admin-specific routes
│   │   ├── _modules/     # Internal Admin business components
│   │   └── dashboard/    # Admin Dashboard page
│   ├── sign-in/          # Login page (Client-Side)
│   ├── user/             # User-specific routes
│   ├── layout.tsx        # Global Layout
│   └── page.tsx          # Registration / Home page (Client-Side)
├── components/           # Reusable UI components
│   └── shared/           # Common components (Card, Button, Container)
├── lib/                  # Core logic and utilities
│   ├── api/              # API services (Axios/Fetcher)
│   ├── hooks/            # Custom React Hooks
│   ├── query/            # TanStack Query logic
│   └── validations/      # Zod validation schemas
├── public/               # Static assets (images, logos, svgs)
├── utils/                # Utility helper functions
├── middleware.ts         # Next.js Auth & Role Middleware
└── tailwind.config.js    # Styling configuration
```

### 🏠 `app/` Directory (App Router)

Contains all the pages and layouts of the application.

- `layout.tsx`: Root layout providing global providers (QueryClient, etc.).
- `page.tsx`: **(CSR)** Home page / Registration page.
- `sign-in/page.tsx`: **(CSR)** Login page.
- `admin/`: Protected admin routes.
  - `layout.tsx`: **(SSR)** Standard admin layout with sidebar/header.
  - `dashboard/`: **(SSR)** Admin dashboard page.
  - `_modules/`: **(Internal Modules)** Contains business-specific components used only within the admin section to keep the main `components/` directory clean.
- `user/`: User-specific routes.

### 🧩 `components/` Directory

Reusable UI components.

- `shared/`: Generic components like `Card.tsx`, `Container.tsx`, etc., that are used throughout the app.

### 📚 `lib/` Directory

Contains core logic and utilities.

- `api/`: API service layers and fetcher configurations.
- `hooks/`: Custom React hooks (e.g., `use-auth.ts` for authentication).
- `query/`: TanStack Query client setup.
- `validations/`: Zod schemas for form and data validation.

### 🛠️ `utils/` Directory

Utility functions for common tasks (formatting dates, strings, etc.).

### 📂 `public/` Directory

Static assets like logos (`logo.svg`, `ag.svg`), icons, and images.

---

## 🔄 SSR vs CSR Definition

We optimize for performance and SEO by leveraging Next.js's dual rendering capabilities.

### 🖥️ Server-Side Rendering (SSR)

Most of our data-heavy and structural components remain on the server to reduce JavaScript bundle size and improve initial load time.

- **Admin Layout**: Renders structural elements like sidebars on the server.
- **Dashboard Overview**: Fetches initial system stats using Server Components for speed.
- **Admin Modules**: Components in `app/admin/_modules` are designed as Server Components unless interactivity is required.

### 🖱️ Client-Side Rendering (CSR)

Used for interactive elements and pages with complex client-side state.

- **Registration & Login Pages**: Marked with `"use client"` because they handle form states, validation, and real-time user feedback using TanStack Form.
- **Animations**: Any component using `framer-motion` for transitions.
- **Dynamic Dropdowns**: Custom UI elements like `Test Level` selection that require immediate user interaction.

---

## 🎨 Design System

The project uses a premium design language:

- **Primary Color**: `#F96331` (Arcgate Orange)
- **Backgrounds**: Slate and Stone shades for a professional "Glassmorphism" feel.
- **Typography**: Inter (Sans-serif) for high readability.
- **Shadows**: Custom soft shadows for depth.

---

## 🛠️ How to define new components?

1. If it's a generic UI element (Button, Input, Card), add it to `components/shared/`.
2. If it's specific to a module (e.g., Dashboard stats), add it to `app/admin/_modules/[module-name]/components/`.
3. Default to **SSR** (Server Component). Only add `"use client"` if you need hooks (`useState`, `useEffect`) or browser APIs.
