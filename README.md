# 🎬 Needflicks - AI-Powered Movie Streaming Platform

<p align="center">
  <img src="Client/Needflicks-Client/src/assets/Needflicks.png" alt="Needflicks Logo" width="120"/>
</p>

<p align="center">
  <strong>A full-stack movie streaming platform with AI-powered sentiment analysis and personalized recommendations</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#api-documentation">API Docs</a>
</p>

---

## 🌟 Features

### Core Features
- **🎥 Movie Streaming** - Seamless video playback integration with YouTube player
- **🤖 AI-Powered Review Analysis** - Automated sentiment analysis using OpenAI/LangChain to classify movie reviews
- **🎯 Personalized Recommendations** - Smart recommendation engine based on user's favorite genres and movie rankings
- **🔐 Secure Authentication** - JWT-based authentication with access/refresh token rotation via HTTP-only cookies
- **👥 Role-Based Access Control** - Admin and User roles with different permission levels

### User Features
- User registration with favorite genre selection
- Personalized movie recommendations based on preferences
- Browse and stream movies
- View admin-curated movie reviews and ratings

### Admin Features
- Add and manage movies in the catalog
- Write reviews with AI-powered sentiment classification
- Automatic ranking assignment based on review sentiment
- Content management dashboard

---

## 🛠️ Tech Stack

### Backend (Go)
| Technology | Purpose |
|------------|---------|
| **Go 1.25** | Primary backend language |
| **Gin** | High-performance HTTP web framework |
| **MongoDB** | NoSQL document database |
| **JWT (golang-jwt/v5)** | Secure token-based authentication |
| **bcrypt** | Password hashing |
| **LangChain Go** | AI/LLM integration for sentiment analysis |
| **OpenAI API** | Natural language processing for reviews |
| **go-playground/validator** | Request validation |

### Frontend (React)
| Technology | Purpose |
|------------|---------|
| **React 19** | UI library |
| **Vite 7** | Build tool & dev server |
| **React Router DOM 7** | Client-side routing |
| **React Bootstrap** | UI component library |
| **Axios** | HTTP client with interceptors |
| **React Player** | Video streaming component |
| **Font Awesome** | Icon library |

---

## 📐 Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT (React)                            │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────────────┐   │
│  │   Auth      │  │   Movies     │  │    Recommendations        │   │
│  │  Context    │  │   Catalog    │  │    (Personalized)         │   │
│  └─────────────┘  └──────────────┘  └───────────────────────────┘   │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────────────┐   │
│  │  Protected  │  │   Video      │  │    Review System          │   │
│  │   Routes    │  │  Streaming   │  │    (Admin Only)           │   │
│  └─────────────┘  └──────────────┘  └───────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────────────┘
                            │ HTTP/REST (Axios + Interceptors)
                            │ JWT in HTTP-only Cookies
┌───────────────────────────▼─────────────────────────────────────────┐
│                          SERVER (Go/Gin)                            │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                     CORS Middleware                         │    │
│  └─────────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    Auth Middleware (JWT)                    │    │
│  └─────────────────────────────────────────────────────────────┘    │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐   │
│  │  User Controller │  │ Movie Controller │  │  Token Utils    │   │
│  │  - Register      │  │  - GetMovies     │  │  - Generate     │   │
│  │  - Login         │  │  - GetMovie      │  │  - Validate     │   │
│  │  - Logout        │  │  - AddMovie      │  │  - Refresh      │   │
│  │  - Refresh       │  │  - UpdateReview  │  │                 │   │
│  └──────────────────┘  │  - GetRecommended│  └─────────────────┘   │
│                        └──────────────────┘                         │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │              AI Sentiment Analysis (LangChain + OpenAI)     │    │
│  │              Classifies reviews → Assigns Rankings          │    │
│  └─────────────────────────────────────────────────────────────┘    │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────────┐
│                         MongoDB                                     │
├─────────────────────────────────────────────────────────────────────┤
│   Collections: users | movies | genres | rankings                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

```
┌────────┐                    ┌────────┐                    ┌─────────┐
│ Client │                    │ Server │                    │ MongoDB │
└───┬────┘                    └───┬────┘                    └────┬────┘
    │                             │                               │
    │  1. POST /login             │                               │
    │  {email, password}          │                               │
    │ ──────────────────────────► │                               │
    │                             │  2. Verify credentials        │
    │                             │ ─────────────────────────────►│
    │                             │                               │
    │                             │  3. User data                 │
    │                             │ ◄─────────────────────────────│
    │                             │                               │
    │                             │  4. Generate JWT tokens       │
    │                             │     (access + refresh)        │
    │                             │                               │
    │  5. Set HTTP-only cookies   │                               │
    │     + User response         │                               │
    │ ◄────────────────────────── │                               │
    │                             │                               │
    │  6. Request protected route │                               │
    │  (Cookie: access_token)     │                               │
    │ ──────────────────────────► │                               │
    │                             │  7. Validate JWT              │
    │                             │                               │
    │  8. Protected data          │                               │
    │ ◄────────────────────────── │                               │
    │                             │                               │
    │  9. 401 (Token expired)     │                               │
    │ ◄────────────────────────── │                               │
    │                             │                               │
    │  10. POST /refresh          │                               │
    │  (Cookie: refresh_token)    │                               │
    │ ──────────────────────────► │                               │
    │                             │  11. Validate refresh token   │
    │                             │                               │
    │  12. New tokens (cookies)   │                               │
    │ ◄────────────────────────── │                               │
    │                             │                               │
```

---

## 🚀 Getting Started

### Prerequisites
- Go 1.25+
- Node.js 18+
- MongoDB instance
- OpenAI API key (for AI features)

### Backend Setup

1. Navigate to the server directory:
```bash
cd Server/NeedflicksServer
```

2. Create a `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=needflicks
SECRET_KEY=your-jwt-secret-key
SECRET_REFRESH_KEY=your-refresh-secret-key
OPENAI_API_KEY=your-openai-api-key
ALLOWED_ORIGINS=http://localhost:5173
RECOMMENDED_MOVIE_LIMIT=5
BASE_PROMPT_TEMPLATE=Classify the following movie review into one of these sentiments: {rankings}. Only respond with the sentiment name. Review: 
```

3. Install dependencies and run:
```bash
go mod download
go run main.go
```

The server will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd Client/Needflicks-Client
```

2. Create a `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8080
```

3. Install dependencies and run:
```bash
npm install
npm run dev
```

The app will open on `http://localhost:5173`

---

## 📡 API Documentation

### Public Endpoints (No Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/movies` | Get all movies |
| `GET` | `/genres` | Get all genres |
| `POST` | `/register` | Register new user |
| `POST` | `/login` | User login |
| `POST` | `/logout` | User logout |
| `POST` | `/refresh` | Refresh access token |

### Protected Endpoints (Auth Required)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| `GET` | `/movie/:imdb_id` | Get single movie details | User/Admin |
| `POST` | `/addmovie` | Add new movie | Admin |
| `GET` | `/recommendedmovies` | Get personalized recommendations | User/Admin |
| `PATCH` | `/updatereview/:imdb_id` | Update movie review (AI analyzed) | Admin |

### Request/Response Examples

<details>
<summary><b>User Registration</b></summary>

```json
POST /register
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "USER",
  "favourite_genres": [
    {"genre_id": 1, "genre_name": "Action"},
    {"genre_id": 2, "genre_name": "Sci-Fi"}
  ]
}
```
</details>

<details>
<summary><b>Admin Review Update (AI-Powered)</b></summary>

```json
PATCH /updatereview/tt1234567
{
  "admin_review": "This movie is a masterpiece with stunning visuals and an incredible storyline."
}

Response:
{
  "ranking_name": "Excellent",
  "admin_review": "This movie is a masterpiece with stunning visuals and an incredible storyline."
}
```
</details>

---

## 📁 Project Structure

```
Needflicks/
├── Client/
│   └── Needflicks-Client/
│       ├── src/
│       │   ├── api/                 # Axios configurations
│       │   ├── assets/              # Static assets
│       │   ├── components/          # React components
│       │   │   ├── header/          # Navigation header
│       │   │   ├── home/            # Home page
│       │   │   ├── login/           # Login form
│       │   │   ├── register/        # Registration form
│       │   │   ├── movie/           # Movie card
│       │   │   ├── movies/          # Movie grid
│       │   │   ├── recommended/     # Recommendations page
│       │   │   ├── review/          # Review system
│       │   │   ├── spinner/         # Loading spinner
│       │   │   └── stream/          # Video player
│       │   ├── context/             # React context (Auth)
│       │   ├── hooks/               # Custom hooks
│       │   └── main.jsx             # App entry point
│       ├── package.json
│       └── vite.config.js
│
└── Server/
    └── NeedflicksServer/
        ├── controllers/             # Request handlers
        │   ├── movieController.go   # Movie CRUD + AI review
        │   └── userController.go    # Auth operations
        ├── database/                # MongoDB connection
        ├── middleware/              # JWT auth middleware
        ├── models/                  # Data models
        ├── routes/                  # Route definitions
        ├── utils/                   # JWT utilities
        ├── go.mod
        └── main.go
```

---

## 🔒 Security Features

- **HTTP-only Cookies** - JWT tokens stored securely, preventing XSS attacks
- **Password Hashing** - bcrypt with salt for password storage
- **Token Rotation** - Access tokens (24h) + Refresh tokens (7 days)
- **CORS Configuration** - Controlled cross-origin access
- **Input Validation** - Server-side validation on all inputs
- **Role-Based Access** - Admin-only routes for sensitive operations

---

## 🤖 AI Integration

The platform uses **LangChain with OpenAI** for intelligent review classification:

1. Admin submits a movie review
2. Review is sent to OpenAI via LangChain
3. AI classifies sentiment (e.g., "Excellent", "Good", "Average", "Poor")
4. Movie ranking is automatically updated based on classification
5. Rankings influence recommendation algorithm

---

## 📱 Screenshots

The UI is inspired by Netflix with:
- Dark theme with red accent colors
- Responsive grid layout for movie cards
- Hero banners and smooth animations
- Play icon overlays on movie posters
- Ranking badges on movie cards

---

## 🛣️ Future Roadmap

- [ ] User reviews and ratings
- [ ] Watch history tracking
- [ ] Continue watching feature
- [ ] Social features (watchlists, sharing)
- [ ] Multi-language support
- [ ] Real-time notifications
- [ ] Advanced search and filters

---

## 📄 License

This project is for educational and portfolio purposes.

---

<p align="center">
  Built with ❤️ using Go, React, and AI
</p>
