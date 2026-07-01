---
marp: true
theme: uncover
class: lead
paginate: true
---

# <!--fit--> أثر (Ather)
## Egyptian Tourism Platform

Connecting tourists with verified local guides, powered by AI

---

# 📋 Problem & Solution

**Problem:**
- Tourists struggle to find reliable guides in Egypt
- No centralized platform for trip planning
- Language barriers at historical sites

**Solution:**
- Ather connects tourists with **verified local guides**
- **AI-powered** trip planning and monument recognition
- **Real-time** chat and booking management

---

# 🎯 Target Users

| User | Needs |
|------|-------|
| **Tourist** | Discover places, plan trips, book guides, learn history |
| **Guide** | Find clients, manage bookings, receive payments |
| **Admin** | Moderate content, manage users, monitor platform |

---

# 🏗 System Architecture

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  React   │────▶│  .NET 8  │────▶│   SQL    │
│  Frontend│     │   API    │     │  Server  │
└──────────┘     └────┬─────┘     └──────────┘
                      │
              ┌───────┴───────┐
              │  Python AI    │
              │  (HuggingFace)│
              └───────────────┘
```

- **REST API** + **SignalR WebSockets** for real-time
- **3-layer architecture**: Presentation → Business → Data

---

# 💻 Tech Stack

## Frontend
- **React 18** + TypeScript
- **Vite 5** (fast builds)
- **Tailwind CSS 4** (utility-first)
- **React Router 6** (routing)
- **SignalR** (real-time)
- **Recharts** (charts)

## Backend
- **.NET 8** (ASP.NET Core)
- **Entity Framework Core 8**
- **SQL Server**
- **Hangfire** (background jobs)
- **MailKit** (email)
- **Swagger** (API docs)

---

# ✨ Core Features (1/3)

## 🔐 Authentication
- Register as Tourist or Guide
- Email verification via OTP
- JWT token-based auth
- Role-based access control

## 🗺 Place Discovery
- Browse Egyptian monuments
- Filter by type
- View details, reviews, photos
- User photo uploads

---

# ✨ Core Features (2/3)

## 🤖 AI Trip Planning
- Generate itineraries by:
  - Budget, duration, interests
  - Governorate selection
- Powered by Python AI model

## 📅 Manual Planning
- Create custom trip plans
- Assign places to specific days

---

# ✨ Core Features (3/3)

## 👨‍👩‍👧 Guide Booking
- Request a guide with your plan
- Accept/reject/complete flow
- Automatic 5% commission
- Background auto-completion (60 min)

## 💬 Real-time Chat
- Per-booking messaging
- SignalR WebSocket
- Message history

---

# ✨ More Features

| Feature | Description |
|---------|-------------|
| ⭐ **Reviews** | Tourist↔Guide, Tourist→Place (1-5★) |
| 📸 **Stories** | 24h expiring media posts |
| 🏛 **AI Guide** | Photo → monument history in 6 languages |
| 💰 **Wallet** | Guide balance + debt management |
| 🔔 **Notifications** | Real-time + broadcast |
| 📊 **Admin Dashboard** | Stats, charts, user management |

---

# 👥 User Roles

<!-- _class: grid -->

## **Tourist**
Browse · Plan · Book
Chat · Review · Stories

## **Guide**
Manage Bookings
Wallet · Chat · Stories

## **Admin**
Dashboard · Users
Content Moderation

---

# 🗄 Database (19 Tables)

```
AppUser ──┬── Tourist
          ├── TourGuide (wallet, debt)
          ├── Booking
          ├── AiPlan / ManualPlan
          ├── Place / PlacePhoto
          ├── Review (3 types)
          ├── Story / StoryInteraction
          ├── ChatMessage
          ├── Payment
          ├── AppNotification
          └── RefreshToken
```

---

# 🚀 Key API Endpoints

| Module | Key Endpoints |
|--------|--------------|
| **Account** | Login, Register, Verify Email, Reset Password |
| **Places** | List, Detail, Filter, CRUD |
| **Plans** | AI Generate, Manual Create |
| **Bookings** | Request, Accept, Reject, Complete |
| **Guides** | Active List, Profile, Wallet |
| **Admin** | Dashboard Stats, Approve Guide, Users, Moderate |
| **AI** | Analyze Image (6 languages) |

---

# 🔄 Real-time with SignalR

## ChatHub (`/chathub`)
- Join/leave booking rooms
- Send/receive messages
- Real-time delivery

## NotificationHub (`/notificationhub`)
- Personal user groups
- Booking events
- Chat alerts
- Admin broadcasts

---

# 🤖 AI Integrations

## 1. Trip Plan Generator
```
Input: Budget, Days, Type, Governorate
  → Python AI → Output: Day-by-day itinerary
```

## 2. Monument Guide
```
Input: Photo + Language (6 options)
  → Python AI → Output: Historical info + Audio
```

## 3. Recommendations
```
Input: User interactions
  → Python AI → Output: Personalized place suggestions
```

---

# ⚙️ Background Jobs (Hangfire)

## BookingUpdateWorker
- Runs every **60 seconds**
- Auto-completes bookings after 60 min
- Applies guide commission debt

## DebtMonitorWorker
- Runs **daily**
- Suspends guides with 30+ day debt
- Sends warning emails

---

# 📱 Frontend Pages (30)

## Public (9)
Landing · Explore · Place Detail · Guides · Guide Detail
Login · Register · Verify OTP · Forget Password

## Tourist (6)
Create Plan · My Plans · Plan Detail
My Bookings · Create Booking · Booking Detail

## Guide (5)
Profile · Bookings · Booking Detail · Wallet · Stories

## Admin (7)
Dashboard · Users · Pending Guides · Places
Reviews · Stories · Broadcast

---

# 🎨 UI Component Library

| Component | Use |
|-----------|-----|
| Button, Input, Select, Textarea | Forms |
| Card, Modal, Tabs | Layout |
| Badge, Avatar, StarRating | Display |
| Skeleton, EmptyState | Loading states |
| ThemeToggle | Dark/Light mode |
| ConfirmDialog | Confirmations |
| LanguageMultiSelect | Guide languages |

---

# 🔐 Authentication Flow

```
Register (Tourist/Guide)
    ↓
Email OTP Verification
    ↓
Login → JWT Token issued
    ↓
Stored in localStorage (ather_token)
    ↓
Axios interceptor: adds Bearer token
    ↓
BanCheckMiddleware validates status
    ↓
[Authorize] + [Authorize(Roles="...")]
    ↓
Controller processes request
```

---

# 📊 Admin Dashboard

- **Stats Cards**: Users, Guides, Bookings, Revenue
- **Charts**: Monthly bookings, monthly revenue
- **Booking Distribution**: Pending/Accepted/Completed/Cancelled
- **Top Guides**: By rating
- **Demographics**: Age, gender, country, language

---

# 🚀 Deployment

## Backend
- **Host**: `ather.runasp.net`
- **Method**: WebDeploy
- **Stack**: .NET 8 + SQL Server

## Frontend
- **Build**: `npm run build`
- **Output**: `dist/` folder
- **Dev proxy**: Vite → Production API

---

# 🎯 Project Structure

```
Backend/
├── FinalProject/  (Controllers, Middleware)
├── BLL/           (Services, DTOs, Hubs)
└── DAL/           (Entities, DbContext)

Frontend/
├── src/api/       (14 API modules)
├── src/components/(Layout, UI, Shared)
├── src/context/   (Auth, Theme, Toast, Notif)
├── src/pages/     (30 pages)
├── src/types/     (TypeScript interfaces)
└── src/utils/     (Helpers)
```

---

# ✅ What We Built

A complete, production-ready tourism platform with:

- ✅ **Full-stack** .NET + React application
- ✅ **AI integration** for trip planning & monument guide
- ✅ **Real-time** communication via SignalR
- ✅ **Role-based** authentication & authorization
- ✅ **Admin dashboard** with analytics
- ✅ **Background jobs** for automation
- ✅ **Responsive** mobile-first design
- ✅ **Dark mode** support
- ✅ **Arabic/English** bilingual interface

---

# 📈 Future Enhancements

- Mobile app (React Native)
- Payment gateway integration (Stripe/PayPal)
- Multi-language support for entire UI
- Advanced analytics and reporting
- Tour guide rating algorithm
- In-app purchases (audio guides)
- Virtual reality monument tours
- Community features (forums, travel tips)

---

# <!--fit--> Thank You

## أثر (Ather)

**Team:** Graduation Project
**Stack:** React · .NET 8 · SQL Server · Python AI
**Deployed:** ather.runasp.net

*"Discover Egypt with AI"*
