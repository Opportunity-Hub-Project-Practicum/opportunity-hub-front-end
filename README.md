# Opportunity Hub Front-End

A modern job portal application built with React, TypeScript, and Vite.

## 🏗️ Project Structure

The project follows a **Feature-Based Architecture** to ensure scalability and maintainability, especially for future API integrations.

```text
src/
├── api/                  # Global API configurations and base client
├── assets/               # Shared static assets (images, icons)
├── components/           
│   ├── ui/               # Base UI components (shadcn/ui style)
│   └── shared/           # Business components used across multiple features
├── features/             # Domain-driven modules
│   ├── admin/            # Admin-related logic and pages
│   ├── employer/         # Employer dashboard and job posting
│   │   ├── api/          # Employer-specific API calls
│   │   ├── components/   # Employer-only components
│   │   ├── hooks/        # Employer-specific logic
│   │   └── pages/        # Employer-related screens
│   └── seeker/           # Job seeker portal
│       ├── api/
│       ├── components/
│       ├── pages/
│       └── ...
├── hooks/                # Global reusable hooks
├── layouts/              # Layout wrapper components
├── lib/                  # Shared utilities and configurations
├── routes/               # Centralized routing setup
└── types/                # Global TypeScript definitions
```

## 🚀 Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Start development server:**
    ```bash
    npm run dev
    ```

3.  **Build for production:**
    ```bash
    npm run build
    ```

## 🛠️ Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router 7
- **UI Components:** Radix UI primitives
- **Icons:** Lucide React
