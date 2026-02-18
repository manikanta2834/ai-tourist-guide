

## Quick Start

```bash
# Install backend dependencies
cd backend && npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and Mapbox token

# Seed database
npm run seed

# Start backend
npm run dev

# In a new terminal, start frontend
cd ../frontend && npm install && npm run dev
```

## Tech Stack

**Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Zustand, TanStack Query, Mapbox GL JS, Framer Motion

**Backend:** Node.js, Express, TypeScript, MongoDB with Mongoose, JWT, Socket.io, ML-Matrix (recommendations), Natural (TF-IDF)

**AI/ML:** Collaborative filtering, Content-based TF-IDF, Constraint satisfaction for itineraries

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `POST /api/v1/auth/register` | User registration |
| `POST /api/v1/auth/login` | User login |
| `GET /api/v1/locations/nearby` | Get nearby locations (geospatial) |
| `GET /api/v1/recommendations` | Get AI recommendations |
| `POST /api/v1/itineraries` | Create itinerary |
| `POST /api/v1/itineraries/:id/optimize` | Optimize with AI |

## Environment Variables

```env
# Backend
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret
MAPBOX_ACCESS_TOKEN=pk...

# Frontend
VITE_API_URL=http://localhost:5000/api/v1
VITE_MAPBOX_TOKEN=pk...
```

## Project Structure

```
ai-tourist-guide/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   │   ├── recommendation.service.ts  # AI engine
│   │   │   ├── location.service.ts
│   │   │   └── itinerary.service.ts
│   │   └── index.ts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── stores/
│   │   └── lib/
│   └── package.json
```

## Deployment

**Backend:** Render/Railway with MongoDB Atlas
**Frontend:** Vercel with environment variables

## License

MIT

---

Built for HACK 1.0 FUSION | Jeppiaar Institute of Technology | February 2026
=======

