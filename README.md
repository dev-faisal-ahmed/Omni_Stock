# OmniStock - Inventory Management System

A modern, full-stack inventory management system built with cutting-edge technologies. OmniStock helps businesses efficiently manage products, categories, orders, and activities with real-time analytics and intuitive user interface.

**Live Demo:** [https://omni-stock-ost.vercel.app/](https://omni-stock-ost.vercel.app/)

**GitHub Repository:** [https://github.com/dev-faisal-ahmed/Omni_Stock](https://github.com/dev-faisal-ahmed/Omni_Stock)

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [File Structure](#file-structure)
- [Design Patterns](#design-patterns)
- [Installation & Setup](#installation--setup)
- [Running Locally](#running-locally)
- [Available Scripts](#available-scripts)

---

## 🎯 Project Overview

OmniStock is a comprehensive inventory management solution designed for businesses to streamline their stock operations. It provides real-time inventory tracking, order management, and detailed analytics with a clean, modern interface. The application is built with a robust backend API and a responsive frontend, ensuring seamless user experience across all devices.

### Key Objectives
- Centralized inventory management
- Real-time activity logging
- Order tracking and fulfillment
- Low stock alerts and notifications
- Comprehensive system analytics

---

## ✨ Features

### Inventory Management
- ✅ **Product Management** - Add, edit, delete, and manage product inventory
- ✅ **Category Organization** - Organize products into categories
- ✅ **Stock Tracking** - Real-time stock level monitoring
- ✅ **Low Stock Alerts** - Automatic alerts for products below minimum threshold

### Order Management
- ✅ **Order Creation** - Create and manage customer orders
- ✅ **Order Status Tracking** - Track orders from pending to delivery
- ✅ **Stock Deduction** - Automatic stock updates upon order creation
- ✅ **Order History** - Complete order audit trail

### Analytics & Insights
- ✅ **Dashboard Analytics** - Real-time sales and order statistics
- ✅ **Activity Logs** - Complete audit trail of all system activities
- ✅ **Revenue Tracking** - Track total revenue by date ranges
- ✅ **Product Summary** - Quick overview of latest products

### User Management
- ✅ **Role-Based Access Control** - Admin & Manager roles
- ✅ **Secure Authentication** - Password encryption with Argon2
- ✅ **User Sessions** - Persistent user sessions

---

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 16.2 (React)
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI, Shadcn UI
- **Icons:** Phosphor Icons
- **State Management:** React Query (@tanstack/react-query)
- **Form Handling:** React Hook Form + Zod validation
- **Table Management:** React Table (@tanstack/react-table)
- **Date Handling:** date-fns
- **Theme:** next-themes (Dark/Light mode)

### Backend
- **Framework:** Next.js API Routes + Hono.js
- **API:** RESTful API with Hono router
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT-based
- **Password Hashing:** Argon2
- **Validation:** Zod schemas

### Infrastructure
- **Hosting:** Vercel
- **Database:** Prisma Postgres / PostgreSQL
- **Package Manager:** pnpm
- **Linting:** ESLint
- **Formatting:** Prettier

---

## 📁 File Structure

```
omni_stock/
├── src/
│   ├── app/                          # Next.js app directory
│   │   ├── (auth)/                   # Authentication pages
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (main)/                   # Main application pages
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── categories/
│   │   │   ├── orders/
│   │   │   ├── products/
│   │   │   └── loading.tsx
│   │   ├── api/
│   │   │   └── [[...route]]/         # Dynamic API routes
│   │   ├── layout.tsx
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   └── globals.css
│   │
│   ├── components/                   # Reusable UI components
│   │   ├── ui/                       # Shadcn/Radix components
│   │   ├── form/                     # Form components
│   │   └── common/                   # Common components
│   │
│   ├── feat/                         # Feature modules
│   │   ├── activity/
│   │   │   ├── activity-api.ts
│   │   │   └── activity-hook.ts
│   │   ├── analytics/
│   │   │   ├── components/
│   │   │   ├── analytics-schema.ts
│   │   │   └── const-analytics.ts
│   │   ├── auth/                     # Authentication feature
│   │   ├── category/                 # Category management
│   │   ├── order/                    # Order management
│   │   └── product/                  # Product management
│   │
│   ├── server/                       # Backend logic
│   │   ├── app.ts                    # Hono app setup
│   │   ├── db.ts                     # Database connection
│   │   ├── modules/
│   │   │   ├── activity/             # Activity service
│   │   │   ├── auth/                 # Authentication service
│   │   │   ├── category/             # Category service
│   │   │   ├── order/                # Order service
│   │   │   └── product/              # Product service
│   │   └── utils/                    # Server utilities
│   │
│   ├── hooks/                        # Custom React hooks
│   ├── layout/                       # Layout components
│   ├── lib/                          # Utilities & helpers
│   └── providers/                    # Context providers
│
├── prisma/
│   └── schema.prisma                 # Database schema
│
├── public/                           # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── README.md
```

---

## 🏗 Design Patterns

### 1. **Service Layer Pattern**
- Business logic separated into service classes (ProductService, OrderService, etc.)
- Controllers/Routes delegate to services
- Centralized error handling and validation
- Example: `src/server/modules/product/product.service.ts`

### 2. **Data Transfer Objects (DTO)**
- Strict request/response validation
- Zod schemas define data contracts
- Type-safe data flow between frontend and backend
- Example: `src/server/modules/product/product.dto.ts`

### 3. **Repository Pattern (via Prisma)**
- Prisma ORM acts as data access layer
- Decouples business logic from database implementation
- Query optimization and caching strategies

### 4. **Factory Pattern**
- Pagination utility factory
- Response DTO factory for consistent API responses

### 5. **Middleware Pattern**
- Authentication guard middleware
- Error handler middleware
- Logger middleware

### 6. **Activity Logging Pattern**
- Fire-and-forget activity logging (async, non-blocking)
- Centralized ActivityService for audit trails
- Complete operation history tracking

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ 
- pnpm (npm or yarn alternative)
- PostgreSQL database
- Git

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/dev-faisal-ahmed/Omni_Stock.git

# Navigate to project directory
cd Omni_Stock
```

### Step 2: Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
```

### Step 3: Environment Configuration

Create a `.env.local` file in the project root:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/omni_stock"

# Next.js
NEXT_PUBLIC_API_URL="http://localhost:3000/api/v1"

# Add any other environment variables needed
```

### Step 4: Database Setup

```bash
# Generate Prisma Client
pnpm db:generate

# Push schema to database
pnpm db:push

# (Optional) Open Prisma Studio
pnpm db:studio
```

---

## 🏃 Running Locally

### Development Mode

```bash
# Start development server
pnpm dev

# Open in browser
# http://localhost:3000
```

The application will automatically reload on file changes with Next.js hot module replacement.

### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

### Other Useful Commands

```bash
# Formatting code
pnpm format

# Linting
pnpm lint

# Open Prisma Studio (Database GUI)
pnpm db:studio
```

---

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server on port 3000 |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint checks |
| `pnpm format` | Format code with Prettier |
| `pnpm db:push` | Sync Prisma schema with database |
| `pnpm db:generate` | Generate Prisma Client |
| `pnpm db:studio` | Open Prisma Studio UI |

---

## 🔐 Authentication

The application uses JWT-based authentication with:
- Role-based access control (Admin, Manager)
- Argon2 password hashing
- Session persistence
- Protected API routes

**Default Roles:**
- **Admin** - Full system access
- **Manager** - Standard user access

---

## 📊 API Documentation

All API endpoints are prefixed with `/api/v1/` and require authentication.

### Main Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET/POST /products` - Product management
- `GET/POST /categories` - Category management
- `GET/POST /orders` - Order management
- `GET /activities` - Recent activity logs
- `GET /orders/summary` - Order analytics

---

## 🌐 Deployment

The project is deployed on **Vercel**:

1. Push to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Automatic deployment on push

Live: [https://omni-stock-ost.vercel.app/](https://omni-stock-ost.vercel.app/)

---

## 📝 License

This project is private and for internal use.

---

## 🤝 Contributing

For contributions or bug reports, please reach out to the development team.

---

**Happy coding! 🚀**
