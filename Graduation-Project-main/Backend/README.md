# أثر (Ather) — Egyptian Tourism Platform

A full-stack Egyptian tourism platform connecting tourists with verified local tour guides. Features AI-powered trip planning, real-time chat, booking management, social stories, and an admin dashboard.

## ✨ Features

| Module | Description |
|--------|-------------|
| **Authentication** | Register as Tourist/Guide, JWT login, email OTP verification, password reset, role-based access |
| **Place Discovery** | Browse Egyptian monuments with filtering by type, view details + reviews + user photos |
| **AI Trip Planning** | Generate day-by-day itineraries via Python AI model based on budget, duration, interests, and governorate |
| **Manual Trip Planning** | Create custom plans by selecting places and assigning days |
| **Guide Booking** | Request a guide with a plan, accept/reject/complete bookings, automatic commission (5%) |
| **Real-time Chat** | Per-booking messaging between tourist and guide via SignalR |
| **Reviews & Ratings** | Tourist-to-Guide, Guide-to-Tourist, Tourist-to-Place (1–5 stars) |
| **Stories** | 24-hour expiring media posts (image/video) with view/love interactions |
| **AI Monument Guide** | Upload a monument photo and get AI-generated historical info in 6 languages |
| **AI Recommendations** | Personalized place recommendations based on user interactions |
| **Guide Wallet** | Wallet balance, outstanding debt tracking, commission collection, pay dues |
| **Notifications** | Broadcast notifications, real-time delivery via SignalR, booking/chat alerts |
| **Admin Dashboard** | Stats, charts, user management, guide moderation, content moderation, place CRUD |

## 🛠 Tech Stack

### Frontend
- **React 18** + TypeScript 5
- **Vite 5** (build tool)
- **Tailwind CSS 4** (utility-first)
- **React Router 6** (routing)
- **Axios** (HTTP client)
- **SignalR** (real-time WebSocket)
- **Recharts** (admin charts)
- **Lucide React** (icons)

### Backend
- **.NET 8** (ASP.NET Core Web API)
- **Entity Framework Core 8** (ORM)
- **ASP.NET Core Identity** (auth)
- **JWT Bearer** (token auth)
- **SignalR** (real-time hubs)
- **Hangfire** (background jobs)
- **MailKit** (email)
- **Swagger** (API docs)

### Database
- **SQL Server** (primary DB)
- **EF Core Migrations** (schema)

### AI Integrations
- Python AI models on Hugging Face Spaces:
  - Trip plan generation
  - Monument image recognition / audio guide
  - Place recommendations

## 🏗 Architecture

```
Frontend (React/Vite)  ───HTTP/WS───►  Backend (.NET 8 API)
                                            │
                                    ┌───────┴───────┐
                                    │               │
                               SQL Server     Python AI APIs
                                            (Hugging Face)
```

The backend follows a **3-layer architecture**:
- **DAL** — Data Access Layer (entities, DbContext, repositories, migrations)
- **BLL** — Business Logic Layer (services, DTOs, SignalR hubs)
- **API** — Presentation Layer (controllers, middleware)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- .NET 8 SDK
- SQL Server (local or remote)

### Frontend Setup
```bash
cd Frontend
npm install
npm run dev
# Opens at http://localhost:5173
```

### Backend Setup
```bash
cd Backend/FinalProject
# Update connection string in appsettings.json
dotnet run
# API at http://localhost:5008, Swagger at /swagger
```

### Environment Variables (Frontend)
Create `Frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5008
```

## 📁 Project Structure

```
├── Backend/
│   ├── FinalProjectAPI.sln
│   ├── FinalProject/           # Web API (controllers, middleware, Program.cs)
│   ├── BLL/                    # Business Logic Layer (services, DTOs, hubs)
│   └── DAL/                    # Data Access Layer (entities, DbContext, repos)
│
├── Frontend/
│   ├── src/
│   │   ├── api/                # Axios API modules (14 files)
│   │   ├── components/
│   │   │   ├── ai/             # AI guide chatbot
│   │   │   ├── brand/          # Logo
│   │   │   ├── layout/         # Navbar, Footer, MobileNav, ProtectedRoute, layouts
│   │   │   ├── shared/         # Cards (Place, Guide, Plan, Booking)
│   │   │   ├── stories/        # Story strip
│   │   │   └── ui/             # Design system (Button, Input, Card, Modal, etc.)
│   │   ├── context/            # Auth, Theme, Toast, Notification
│   │   ├── pages/
│   │   │   ├── auth/           # Login, Register, OTP, Forgot Password
│   │   │   ├── shared/         # Landing, Explore, Guides, Chat, Profile, etc.
│   │   │   ├── tourist/        # Plans, Bookings
│   │   │   ├── guide/          # Profile, Bookings, Wallet, Stories
│   │   │   └── admin/          # Dashboard, Users, Moderation, Places
│   │   ├── routes/             # React Router config
│   │   ├── services/           # SignalR service
│   │   ├── types/              # TypeScript interfaces
│   │   └── utils/              # cn, storage, format, media, sound
│   └── public/assets/          # Images
│
├── daataa.sql                  # Database backup
└── README.md
```

## 🌐 API Overview

### Auth (`/api/Account`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/login` | No | User login |
| POST | `/register-tourist` | No | Register as tourist |
| POST | `/register-guide` | No | Register as guide |
| POST | `/forget-password` | No | Send password reset OTP |
| POST | `/reset-password` | No | Reset password |
| POST | `/verify-email` | No | Verify email with OTP |

### Places (`/api/Places`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | No | List all places |
| GET | `/{id}/{placeIdAI}` | No | Get place details |
| GET | `/filter?type=` | No | Filter by type |
| POST | `/{id}/add-photo` | User | Add user photo |
| POST | `/` | Admin | Create place |
| PUT | `/{id}` | Admin | Update place |
| DELETE | `/{id}` | Admin | Delete place |

### Plans (`/api/Plans`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/generate` | Tourist | Generate AI plan |
| POST | `/manual-generate` | Tourist | Create manual plan |
| GET | `/ai-plan-details/{planId}` | Tourist | Get AI plan details |

### Bookings (`/api/Bookings`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/request` | Tourist | Create booking |
| GET | `/my-bookings` | Tourist | My bookings |
| PUT | `/{id}/cancel` | Tourist | Cancel booking |
| GET | `/guide/pending` | Guide | Pending requests |
| GET | `/guide/history` | Guide | History |
| PUT | `/guide/{id}/accept\|reject\|complete` | Guide | Manage booking |

### Guides (`/api/Guides`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/active` | User | List active guides |
| GET | `/{id}` | User | Guide details |
| PUT | `/Update-my-profile` | Guide | Update profile |
| GET | `/my-wallet` | Guide | Wallet info |
| PUT | `/profile-image` | Guide | Update image |

### Admin (`/api/Admin`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/dashboard-stats` | Admin | Dashboard stats |
| GET | `/pending-guides` | Admin | Pending guides |
| PUT | `/guides/{id}/approve` | Admin | Approve guide |
| GET | `/users` | Admin | List users |
| PATCH | `/users/{id}/toggle-ban` | Admin | Toggle ban |
| DELETE | `/users/{id}/delete` | Admin | Delete user |
| GET | `/reviews` | Admin | Moderate reviews |
| GET | `/stories` | Admin | Moderate stories |

### Real-time (SignalR)
| Hub | Route | Description |
|-----|-------|-------------|
| ChatHub | `/chathub` | Real-time messaging |
| NotificationHub | `/notificationhub` | Notifications, booking events, chat alerts |

## 🗄 Database Schema (19 tables)

- **AppUser** — Identity user (extends `IdentityUser`)
- **Tourist** — Tourist profile (one-to-one with AppUser)
- **TourGuide** — Guide profile (with wallet, debt, suspension)
- **Place** — Monument/place
- **PlacePhoto** — User-submitted photos of places
- **Booking** — Booking between tourist and guide
- **AiPlan** — AI-generated trip plan
- **ManualPlan** — Manually created plan
- **ManualPlanItem** — Day-by-day items
- **Review** — Reviews (3 types: tourist→guide, guide→tourist, tourist→place)
- **Story** — 24h expiring media posts
- **StoryInteraction** — Story views/loves
- **ChatMessage** — Chat messages
- **Payment** — Guide payment records
- **RefreshToken** — JWT refresh tokens
- **AppNotification** — System notifications
- **UserPlaceInteraction** — User interactions with places

## 👥 User Roles

| Role | Capabilities |
|------|-------------|
| **Tourist** | Browse places, create AI/manual plans, book guides, chat, write reviews, post stories |
| **Guide** | Manage bookings, chat, wallet, post stories, review tourists |
| **Admin** | Dashboard, manage users/guides/places, moderate content, send broadcasts |

## 🔐 Auth Flow
1. Register (tourist with email, guide with email + national ID image)
2. Verify email via OTP
3. Login returns JWT token
4. Token stored in `localStorage` (`ather_token`)
5. Axios interceptor attaches `Authorization: Bearer <token>`
6. `BanCheckMiddleware` validates user status on each request
7. Role-based authorization on endpoints

## ⚙️ Background Services
- **BookingUpdateWorker** — Auto-completes bookings 60 min after acceptance, applies commission debt
- **DebtMonitorWorker** — Suspends guides with 30+ days unpaid debt, sends warning emails

## 📦 Deployment
- **Backend**: Published to `https://ather.runasp.net` via WebDeploy
- **Frontend**: Built with `npm run build` → `dist/` folder
- Vite dev server proxies `/api`, `/chathub`, `/notificationhub` to backend

---

Built with ❤️ for Egyptian tourism.
