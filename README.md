<div align="center">

<img src="Frontend/public/images/image.png" alt="DataExchange Portal Banner" width="100%" style="border-radius: 12px; max-height: 300px; object-fit: cover;" />

# 🏛️ DataExchange — Inter-Institutional Data Portal

**A secure, role-based platform enabling Ethiopian government institutions to share data, manage requests, and collaborate seamlessly.**

[![Next.js](https://img.shields.io/badge/Next.js-15.5.18-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[🌐 Live Demo](#-live-demo) · [🚀 Quick Start](#-quick-start) · [🗂️ Architecture](#-architecture) · [🤝 Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Demo Accounts](#-demo-accounts)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [User Roles](#-user-roles)
- [API Overview](#-api-overview)
- [Contributing](#-contributing)

---

## 🌍 Overview

The **Inter-Institutional Data Exchange Portal** is a full-stack web platform designed to digitize and streamline the way Ethiopian government agencies and institutions share data, submit requests, and manage approvals.

Instead of relying on manual paperwork and siloed systems, institutions can:

- 📤 **Submit data requests** from other institutions
- ✅ **Approve or reject** incoming requests with audit trails
- 🔔 **Receive real-time notifications** for request status changes
- 📊 **Visualize analytics** on data exchange activity
- 🔒 **Control access** through a strict role-based permission system

---

## 🌐 Live Demo

> The frontend is deployed on **Vercel**. The backend requires a running MySQL instance and is intended for local or server deployment.

| Environment | URL |
|-------------|-----|
| 🟢 Frontend (Vercel) | _Coming soon — link after push_ |
| 🔧 Backend API | `http://localhost:5000` (local) |

---

## 🔑 Demo Accounts

> **⚠️ Note:** These demo accounts are pre-seeded into the database. They require the backend and MySQL database to be running locally. See [Getting Started](#-getting-started) to spin up the full stack.

The system has **three roles**, each with its own dashboard and permissions:

### 👤 Role Descriptions

| Role | Description | Dashboard |
|------|-------------|-----------|
| **Admin** | System administrator — manages institutions, users, and system-wide settings | `/admin/dashboard` |
| **Consumer** | An institution that **requests** data from providers | `/consumer/dashboard` |
| **Provider** | An institution that **supplies** data to consumers | `/provider/dashboard` |

### 🧪 Test Credentials

| Role | Email | Password | Access |
|------|-------|----------|--------|
| 🔴 **Admin** | `admin@dataexchange.gov.et` | `Admin@1234` | Full system control |
| 🔵 **Consumer** | `consumer@dataexchange.gov.et` | `Consumer@1234` | Submit & track requests |
| 🟢 **Provider** | `provider@dataexchange.gov.et` | `Provider@1234` | Review & respond to requests |

> 💡 **Sign in at:** [`/login`](http://localhost:3000/login)
>
> These accounts are seeded via the database setup script. If running for the first time, follow the [Database Setup](#database-setup) instructions.

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with `httpOnly` cookies
- Role-based access control (Admin, Consumer, Provider)
- Middleware-enforced route protection
- Secure session management (12-hour token expiry)

### 🏛️ Admin Portal
- **Dashboard** — Institution stats, user counts, pending approvals at a glance
- **Institution Management** — Approve, suspend, or activate institutions
- **Analytics** — Charts and graphs of system-wide data exchange activity
- **Audit Logs** — Complete history of all system actions
- **Notifications** — System-wide alerts and updates

### 📤 Consumer Portal
- **Dashboard** — Track submitted requests and their statuses
- **Submit Request** — Multi-step form to request data from providers
- **Request History** — Full log of all past requests with statuses
- **Real-time Chat** — Communicate with providers about specific requests
- **Notifications** — Alerts when requests are approved, rejected, or updated
- **Profile Management** — Update institution info and contact details

### 📥 Provider Portal
- **Dashboard** — Incoming requests overview with priority indicators
- **Request Review** — Accept or reject data requests with reason fields
- **Analytics** — Data on fulfilled vs rejected requests over time
- **Notifications** — Alerts on new incoming requests
- **Success Tracking** — Monitor completed data transfers

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router & server components |
| **TypeScript** | Type safety across the entire frontend |
| **Tailwind CSS** | Utility-first styling |
| **Radix UI** | Accessible, headless UI primitives |
| **Recharts** | Data visualization & analytics charts |
| **Framer Motion** | Smooth animations and transitions |
| **Axios** | HTTP client for API calls |
| **React Hook Form + Zod** | Form handling and validation |
| **Lucide React** | Icon library |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js + Express** | REST API server |
| **MySQL 2** | Relational database driver |
| **bcryptjs** | Password hashing |
| **jsonwebtoken** | JWT token generation & verification |
| **Multer** | File upload handling |
| **cookie-parser** | HTTP cookie management |
| **dotenv** | Environment variable management |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| **Vercel** | Frontend deployment |
| **MySQL** | Primary database |
| **GitHub** | Source control |

---

## 🗂️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                     CLIENT BROWSER                   │
└──────────────────────────┬──────────────────────────┘
                           │ HTTPS
┌──────────────────────────▼──────────────────────────┐
│              NEXT.JS FRONTEND (Vercel)               │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌────────────────┐    │
│  │  /admin  │  │/consumer │  │   /provider    │    │
│  │dashboard │  │dashboard │  │   dashboard    │    │
│  └──────────┘  └──────────┘  └────────────────┘    │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │         Middleware (Auth + Role Guard)        │   │
│  └──────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────┘
                           │ REST API (HTTP + cookies)
┌──────────────────────────▼──────────────────────────┐
│              EXPRESS BACKEND (Node.js)               │
│                                                      │
│  /api/auth   /api/admin   /api/requests              │
│  /api/notifications       /api/institutions          │
│  /consumer   /provider    /api/activity              │
└──────────────────────────┬──────────────────────────┘
                           │ mysql2
┌──────────────────────────▼──────────────────────────┐
│                     MySQL DATABASE                   │
│                                                      │
│   users · institutions · requests · notifications   │
│   audit_logs · activities · data_transfers          │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **MySQL** 8.0 or higher
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/Benobl/Inter-Institutional-portal.git
cd Inter-Institutional-portal
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
# Then edit .env with your values (see Environment Variables section)
```

#### Database Setup

```sql
-- Create database
CREATE DATABASE inter_institutional_portal;
USE inter_institutional_portal;
```

Then run your schema migrations and seed the demo accounts:

```sql
-- Users table (simplified)
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'consumer', 'provider') NOT NULL,
  institution_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed demo accounts (passwords are bcrypt-hashed)
-- Admin: admin@dataexchange.gov.et / Admin@1234
-- Consumer: consumer@dataexchange.gov.et / Consumer@1234
-- Provider: provider@dataexchange.gov.et / Provider@1234
```

Start the backend:

```bash
npm run dev       # Development (with nodemon)
# OR
npm start         # Production
```

> Backend runs on **http://localhost:5000**

### 3. Frontend Setup

```bash
cd ../Frontend
npm install
```

Create your `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

> Frontend runs on **http://localhost:3000**

### 4. Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000) and sign in with any of the [demo accounts](#-demo-accounts).

---

## 🔧 Environment Variables

### Backend (`Backend/.env`)

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=inter_institutional_portal
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

### Frontend (`Frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 📁 Project Structure

```
Inter-Institutional-portal/
│
├── Frontend/                     # Next.js Application
│   ├── app/
│   │   ├── admin/                # Admin role pages
│   │   │   ├── dashboard/        # Admin dashboard
│   │   │   ├── analytics/        # System analytics
│   │   │   ├── institutions/     # Institution management
│   │   │   ├── requests/         # Request oversight
│   │   │   ├── notifications/    # Admin notifications
│   │   │   └── profile/          # Admin profile
│   │   ├── consumer/             # Consumer role pages
│   │   │   ├── dashboard/        # Consumer dashboard
│   │   │   ├── submit-request/   # New data request form
│   │   │   ├── requests/         # Request history
│   │   │   ├── [requestId]/chat/ # Per-request chat
│   │   │   ├── notifications/    # Consumer notifications
│   │   │   └── profile/          # Consumer profile
│   │   ├── provider/             # Provider role pages
│   │   │   ├── dashboard/        # Provider dashboard
│   │   │   ├── requests/         # Incoming requests
│   │   │   ├── [requestId]/      # Request detail
│   │   │   ├── analytics/        # Provider analytics
│   │   │   └── notifications/    # Provider notifications
│   │   ├── login/                # Authentication
│   │   ├── register/             # Registration
│   │   └── page.tsx              # Landing page
│   │
│   ├── components/               # Shared UI components
│   ├── public/images/            # Static assets
│   └── package.json
│
├── Backend/                      # Express.js API
│   ├── controllers/              # Business logic
│   │   ├── authController.js     # Login / logout / register
│   │   ├── adminController.js    # Admin operations
│   │   ├── consumerController.js # Consumer operations
│   │   ├── providerController.js # Provider operations
│   │   ├── requestController.js  # Data request CRUD
│   │   └── notificationsController.js
│   ├── routes/                   # API route definitions
│   ├── middlewares/              # Auth & logging middleware
│   ├── config/                   # Database connection
│   ├── Utils/                    # Helper utilities
│   └── server.js                 # Entry point
│
└── README.md
```

---

## 👥 User Roles

### 🔴 Admin
The Admin has complete system visibility and control.

| Capability | Description |
|-----------|-------------|
| View all institutions | See every registered provider and consumer |
| Approve / Suspend | Control which institutions can operate |
| View audit logs | Full history of all actions in the system |
| Monitor requests | Oversight of all data exchange requests |
| System analytics | Platform-wide usage statistics |

### 🔵 Consumer
Consumers are institutions that **need** data from other institutions.

| Capability | Description |
|-----------|-------------|
| Submit requests | Request specific data from provider institutions |
| Track status | Monitor the lifecycle of each request |
| Chat with providers | Communicate about request details |
| View notifications | Get alerted on approvals, rejections, updates |

### 🟢 Provider
Providers are institutions that **hold** data and respond to requests.

| Capability | Description |
|-----------|-------------|
| View incoming requests | See all data requests directed at them |
| Approve / Reject | Respond to requests with optional reasons |
| Track analytics | Monitor their response rates and history |
| View notifications | Get alerted when new requests arrive |

---

## 🌐 API Overview

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/login` | All | Authenticate user |
| `POST` | `/api/auth/register` | Admin | Register initial admin |
| `GET` | `/api/auth/me` | All | Get current user |
| `POST` | `/api/auth/logout` | All | Logout |
| `GET` | `/api/admin/institutions` | Admin | List all institutions |
| `GET` | `/api/admin/user-stats` | Admin | User statistics |
| `GET` | `/api/requests` | All | List requests |
| `POST` | `/api/requests` | Consumer | Create new request |
| `GET` | `/api/notifications` | All | Get notifications |
| `GET` | `/api/activity` | Admin | Audit log |
| `POST` | `/api/setup` | Universal | Institution setup |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Commit** your changes: `git commit -m "feat: add your feature"`
4. **Push** to your branch: `git push origin feature/your-feature`
5. **Open** a Pull Request

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
feat:     New feature
fix:      Bug fix
docs:     Documentation changes
style:    Code style (no logic change)
refactor: Code refactor
chore:    Build / tooling changes
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ for Ethiopian government digital transformation

**[⬆ Back to top](#)**

</div>
