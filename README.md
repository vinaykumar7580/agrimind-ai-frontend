# 🌱 AgriMind AI — Frontend

**Smart crop intelligence for modern farmers.**

AgriMind AI is a web app that helps farmers look after their crops. You upload a photo of a crop and the app finds diseases and suggests treatments. It also shows soil health, local weather, market (mandi) prices with forecasts, and has an AI chat assistant and a farmer community.

This repository has the **frontend**, built with Next.js. It talks to a separate **FastAPI backend** that runs the AI models and stores the data.

---

## ✨ Features

| Feature | What it does |
|---|---|
| 🔬 **Crop Analysis** | Upload a crop or leaf photo to find diseases, with a confidence score, severity level and suggested treatment. |
| 🧪 **Soil Health** | Shows pH and nutrient levels (nitrogen, phosphorus, potassium and more) and flags problems. |
| 🌦️ **Weather** | Current weather and a forecast for the farmer's location. |
| 📈 **Market Prices** | Live crop prices, a price forecast, and top gainers and losers on the dedicated market page. |
| 💬 **AI Chat** | Ask an AI assistant farming questions. Chat history is saved and can be cleared. |
| 🗂️ **Scan History** | See all past scans, filter them, mark each as *Action Needed*, *Treated* or *Healthy*, view stats, and export to CSV. |
| 👥 **Community** | Share posts with tags and images, search posts, and like, bookmark or delete them. Includes community stats. |
| 🔐 **Authentication** | Sign up, log in and reset your password. Pages are protected unless you are logged in. |

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router) with **React 19**
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com) and shadcn/ui-style components built on [Radix UI](https://www.radix-ui.com)
- **Icons:** [lucide-react](https://lucide.dev)
- **Notifications:** [sonner](https://sonner.emilkowal.ski)
- **Cookies:** [cookies-next](https://github.com/andreizanik/cookies-next)
- **Utilities:** `clsx`, `tailwind-merge`, `class-variance-authority`
- **Backend (separate repo):** FastAPI

---

## 📁 Project Structure

```
frontend-project/
├── app/
│   ├── page.js               # Main dashboard (Crop Analysis, Weather, Soil, Market, AI Chat tabs)
│   ├── layout.js             # Root layout and toast notifications
│   ├── login/                # Login page
│   ├── signup/               # Sign-up page
│   ├── forgot-password/      # Password reset page
│   ├── history/              # Scan history page
│   ├── market/               # Market prices page
│   ├── community/            # Community feed page
│   └── api/                  # Next.js API routes that forward requests to the backend
├── components/
│   ├── Navbar.jsx
│   ├── UploadPanel.jsx       # Image upload
│   ├── CropAnalysisPanel.jsx # Disease results
│   ├── SoilPanel.jsx
│   ├── WeatherPanel.jsx
│   ├── MarketPanel.jsx
│   ├── ChatPanel.jsx
│   └── ui/                   # Reusable UI parts (button, card, input, badge, ...)
├── lib/
│   ├── proxyBackend.js       # Helper that forwards requests to the FastAPI backend
│   ├── format.js             # Date and number formatting
│   └── utils.js
├── middleware.js             # Sends logged-out users to /login
└── public/                   # Static files
```

---

## 🔄 How It Works

```
Browser  ──►  Next.js API routes (/api/*)  ──►  FastAPI backend
                  (adds the login token)
```

1. When you log in, the backend returns a token, which is saved in a `token` cookie.
2. `middleware.js` checks for this cookie. Without it, every page except `/login`, `/signup` and `/forgot-password` redirects to `/login`.
3. The browser only calls the app's own `/api/*` routes. These routes read the token from the cookie and forward the request to the backend with an `Authorization: Bearer <token>` header. The backend URL and token are never exposed to the page code.

### API routes

| Frontend route | Method | Backend endpoint |
|---|---|---|
| `/api/signup` | POST | `/auth/signup` |
| `/api/login` | POST | `/auth/login` |
| `/api/forgot-password` | POST | `/auth/reset-password` |
| `/api/get-profile` | GET | `/auth/me` |
| `/api/upload-image` | POST | `/scan/analyze` |
| `/api/scans/history` | GET | `/scan/history` |
| `/api/scans/stats` | GET | `/scan/stats` |
| `/api/scans/export` | GET | `/scan/export` (CSV) |
| `/api/scans/[id]/status` | PUT | `/scan/{id}/status` |
| `/api/weather` | GET | `/weather/` |
| `/api/market/prices` | GET | `/market/prices` |
| `/api/market/forecast` | GET | `/market/forecast` |
| `/api/chat/message` | POST | `/chat/message` |
| `/api/chat/history` | GET, DELETE | `/chat/history` |
| `/api/community/posts` | GET, POST | `/community/posts` |
| `/api/community/posts/[id]` | DELETE | `/community/posts/{id}` |
| `/api/community/posts/[id]/like` | POST | `/community/posts/{id}/like` |
| `/api/community/posts/[id]/bookmark` | POST | `/community/posts/{id}/bookmark` |
| `/api/community/stats` | GET | `/community/stats` |

---

## 🚀 Getting Started

### Requirements

- [Node.js](https://nodejs.org) 20 or newer
- npm
- The AgriMind AI **FastAPI backend** running locally or deployed

### 1. Clone the repository

```bash
git clone https://github.com/vinaykumar7580/agrimind-ai-frontend.git
cd agrimind-ai-frontend/frontend-project
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set environment variables

Create a `.env.local` file in `frontend-project/`:

```env
NEXT_PUBLIC_BACKEND_BASE_URL=http://localhost:8000
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_BACKEND_BASE_URL` | Base URL of the FastAPI backend, with no trailing slash. |

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You will be sent to the login page. Create an account to get started.

### Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the app for production |
| `npm run start` | Run the production build |
| `npm run lint` | Check the code with ESLint |

---

## ☁️ Deployment

The app can be deployed on [Vercel](https://vercel.com) or any host that supports Next.js:

1. Import the repository and set the **root directory** to `frontend-project`.
2. Add the `NEXT_PUBLIC_BACKEND_BASE_URL` environment variable, pointing to your deployed backend.
3. Deploy.

---

## 🤝 Contributing

1. Fork the repository.
2. Create a branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push the branch: `git push origin feature/my-feature`
5. Open a pull request.

---

## 👤 Author

**Vinay Kumar** — [@vinaykumar7580](https://github.com/vinaykumar7580)

If you find this project useful, please give it a ⭐ on GitHub!
