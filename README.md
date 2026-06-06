# Lost & Found Campus Portal

A full-stack web application for university students to report and search lost and found items on campus.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, TailwindCSS |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB Atlas |
| Auth | JWT + bcrypt |
| File Storage | Cloudinary |
| Charts | Recharts |
| Testing | Jest, Supertest |
| CI/CD | GitHub Actions |
| Containerization | Docker, Docker Compose |
| Hosting | Render (Web Service + Static Site) |
| Monitoring | UptimeRobot |

## Prerequisites

- Node.js 18 LTS
- npm
- Docker Desktop (optional, for containerized setup)
- MongoDB Atlas account
- Cloudinary account

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Sanjaya-Samudra/LostAndFound.git
cd LostAndFound
```

### 2. Backend Setup

```bash
cd backend
npm install
npm run build
```

Create `backend/.env` with the following variables (see `.env.example`):

```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/lostfound
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

Server runs on `http://localhost:5000` — verify: `curl http://localhost:5000/api/health`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

App runs on `http://localhost:5173`

### 4. Seed the Database (Optional)

```bash
cd backend
npx ts-node scripts/seed.ts
```

This inserts 20 test users and 50 test items.

### 5. Run Tests

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# With coverage
npm test -- --coverage
```

### 6. Docker Setup (Optional)

```bash
# From project root
docker-compose build
docker-compose up -d

# Frontend: http://localhost
# Backend:  http://localhost:5000
```

### 7. Production Build

```bash
cd frontend && npm run build
cd backend && npm run build
```

---

## Project Structure

```
LostAndFound_CampusPortal/
├── .github/workflows/deploy.yml   # CI/CD pipeline
├── docker-compose.yml              # Container orchestration
├── docs/                           # Documentation & reports
├── frontend/                       # React + Vite + TailwindCSS
│   └── src/
│       ├── components/             # Reusable UI components
│       ├── pages/                  # Page components (12 pages)
│       │   └── admin/              # Admin dashboard pages
│       ├── services/api.ts         # Axios API client
│       ├── context/AuthContext.tsx  # Auth state management
│       ├── types/index.ts          # TypeScript interfaces
│       └── utils/mockData.ts       # Mock data for development
├── backend/                        # Express + TypeScript
│   └── src/
│       ├── config/                 # DB & env config
│       ├── models/                 # Mongoose schemas
│       ├── middleware/             # Auth, admin, upload, error handler
│       ├── controllers/           # Route handlers
│       └── routes/                # API route definitions
└── tests/                          # Jest & Supertest
    ├── backend/unit/               # Unit tests
    ├── backend/api/                # API integration tests
    └── frontend/                   # Component tests
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register with @campus.edu email |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/auth/profile` | JWT | Get current user profile |
| GET | `/api/items` | No | List items (paginated) |
| GET | `/api/items/:id` | No | Get item details |
| POST | `/api/items` | JWT | Create lost/found item |
| GET | `/api/items/search` | No | Search items by keyword |
| PUT | `/api/items/:id` | JWT | Update item (owner/admin) |
| DELETE | `/api/items/:id` | JWT | Delete item (owner/admin) |
| GET | `/api/admin/stats` | Admin | Dashboard statistics |
| GET | `/api/admin/users` | Admin | List all users |
| DELETE | `/api/admin/users/:id` | Admin | Delete user |
| DELETE | `/api/admin/items/:id` | Admin | Delete any item |

<!-- ## Deployment

Live URLs:

- **Frontend:** `https://lost&found-frontend.onrender.com`
- **Backend:** `https://lost&found-backend.onrender.com`
- **API Health:** `https://lost&found-backend.onrender.com/api/health` -->

## Sprint Plan

| Sprint | Focus | Duration |
|--------|-------|----------|
| Sprint 1 | Foundation — requirements, wireframes, repo setup | Week 1 |
| Sprint 2 | Auth — registration, login, user dashboard | Week 2-3 |
| Sprint 3 | Core features — post items, search, item details | Week 4-5 |
| Sprint 4 | Admin — dashboard, user/ item management | Week 6-7 |
| Sprint 5 | DevOps — Docker, CI/CD pipeline | Week 8-9 |
| Sprint 6 | Final — testing, deployment, submission | Week 10-12 |
