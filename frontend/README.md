# 🚀 TalentFlow ATS - Frontend

Welcome to the frontend of **TalentFlow ATS**, a premium, high-performance Applicant Tracking System built for modern recruitment workflows. This project leverages **Next.js 15**, **Tailwind CSS v4**, and a **Feature-Driven Architecture** to deliver a seamless user and admin experience.

---

## 🎨 Premium Aesthetics & UX

TalentFlow ATS is designed with a focus on **Rich Aesthetics** and **Premium UI**:

- **Modern Design System**: Custom-built UI primitives using Vanilla CSS and Tailwind v4.
- **Dynamic Interaction**: Smooth micro-animations powered by Framer Motion.
- **Glassmorphism**: Sophisticated backdrop blurs and refined gradients for a state-of-the-art feel.
- **Brand Identity**: A custom-designed, solid "Caret A" logo reflecting the ArcInterview brand.

---

## 🚀 Technology Stack

| Technology                  | Purpose                                                |
| :-------------------------- | :----------------------------------------------------- |
| **Next.js 15 (App Router)** | Framework for SSR, CSR, and optimized routing.         |
| **TypeScript**              | Static typing for robust and maintainable code.        |
| **Tailwind CSS v4**         | Next-generation styling with advanced utility support. |
| **TanStack Query v5**       | Efficient server-state management and caching.         |
| **TanStack Form**           | Type-safe form management with Zod validation.         |
| **Framer Motion**           | Industry-leading animation library for fluid UI.       |
| **Lucide React**            | Scalable, high-quality icon library.                   |

---

## 📂 Feature-Driven Architecture

The project is organized into self-contained modules to ensure scalability and ease of maintenance.

```text
frontend/
├── app/                  # Next.js App Router (Routes & Layouts)
│   ├── admin/            # Admin Panel (Users, Papers, Results, Management)
│   ├── project-lead/     # Project Lead Dashboard (Candidate Reviews, F2F Results)
│   ├── user/             # Candidate assessment portal (Tests, Profiles)
│   └── sign-in/          # Unified secure authentication portal
├── components/           # Component Library
│   ├── ui-elements/      # Pure UI Primitives (Buttons, Inputs, Badges)
│   ├── ui-cards/         # Reusable card structures (StatCards, ActivityCards)
│   ├── ui-layout/        # Structural components (Navbar, Sidebar, Footer)
│   └── features/         # Logic-heavy modules (Results, Questions, Lead Assignment, Auth)
├── hooks/                # Custom React Hooks
│   ├── useListing.ts     # Standardized data listing with silent refresh support
│   └── api/              # Domain-specific TanStack Query hooks
├── lib/                  # Core Utilities & Configurations
│   ├── api/              # Axios/Fetch client with automatic toast handling
│   ├── auth/             # Session and role-based access control
│   └── utils.ts          # Shared helper functions
└── public/               # Static assets (images, icons)
```

---

## 🔄 Core Concepts & Workflows

### 🛡️ Smart Data Fetching (`useListing`)

We use a centralized `useListing` hook to handle all paginated lists. It features:

- **Forced Refresh**: Bypass cache to get the freshest data.
- **Silent Refresh**: Update lists in the background after actions (like assigning a lead) without redundant success toasts.
- **Toast Control**: Manual refresh buttons provide feedback, while programmatic updates remain silent for a cleaner UX.

### 🔌 Intelligent API Client

Our API client includes global interceptors that:

- Automatically trigger success toasts for mutations.
- Handle error messages from the backend dynamically.
- Support `silentSuccess` and `silentError` flags for specific use cases.

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js**: 20.x or higher
- **npm**: 10.x or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/md-danish-ai/talent-flow-ats.git

# Navigate to the frontend directory
cd talent-flow-ats/frontend

# Install dependencies
npm install
```

### Environment Setup

Create a `.env` file in the root of the `frontend/` directory and add the following variable:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

### Running Locally

```bash
# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📋 Best Practices

1. **Component Purity**: Keep `ui-elements` free of business logic. Use props for all customizations.
2. **Path Aliases**: Always use `@` aliases (e.g., `@components/ui-elements/Button`) to keep imports clean.
3. **Server Components**: Prefer Server Components for data fetching to reduce bundle size and improve performance.
4. **Zod Validation**: Always define schemas in `lib/validations/` for type-safe form handling.

---

## 🛡️ License

© 2026 Arcgate. All rights reserved. Proprietary software for TalentFlow ATS.
