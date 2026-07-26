# 🧠 LexiHub

LexiHub is a modern React-based client application that integrates with the Corpus API to provide a user-friendly interface for exploring and managing corpus resources. It allows authenticated users to browse records, search data, view languages, categories, events, and profile information through a clean and responsive dashboard.

---

## 🚀 Features

- 🔐 JWT-based User Authentication
- 📊 Dashboard with corpus statistics
- 🔍 Search corpus records
- 📄 View all records
- 📑 Record Details page
- 🌐 Languages listing
- 📂 Categories listing
- 📅 Events page
- 👤 User Profile
- 🛡️ Protected Routes
- ⚠️ Graceful API error handling
- 📱 Responsive user interface

---

## 🛠️ Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

### Routing
- React Router DOM

### HTTP Client
- Axios

### Icons
- Lucide React

---

## 📂 Project Structure

```text
src/
├── components/
│   └── layout/
│       ├── Layout.tsx
│       ├── Navbar.tsx
│       └── Sidebar.tsx
│
├── constants/
│   └── api.ts
│
├── pages/
│   ├── Dashboard.tsx
│   ├── Records.tsx
│   ├── RecordDetails.tsx
│   ├── Search/
│   ├── Languages.tsx
│   ├── Categories.tsx
│   ├── Events.tsx
│   ├── Login/
│   └── Profile/
│
├── routes/
│   └── AppRoutes.tsx
│
├── services/
│   └── api.ts
│
├── App.tsx
├── main.tsx
└── index.css
```

---

## 🔑 Authentication

LexiHub uses JWT (JSON Web Token) authentication.

1. User logs in using phone number and password.
2. Backend validates credentials.
3. JWT access token is returned.
4. Token is stored in localStorage.
5. Axios automatically includes the token in authenticated API requests.

---

## 📡 API Endpoints Used

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/v1/auth/login` | User Login |
| GET | `/api/v1/auth/me` | Logged-in User |
| GET | `/api/v1/records` | Fetch Records |
| GET | `/api/v1/records/{id}` | Record Details |
| GET | `/api/v1/languages` | Languages |
| GET | `/api/v1/categories` | Categories |
| GET | `/api/v1/events` | Events |

---

## ⚙️ Installation

Clone the repository:

```bash
git clone <repository-url>
```

Move into the project directory:

```bash
cd lexihub
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

---

## 📦 Available Scripts

```bash
npm run dev
```

Runs the application in development mode.

```bash
npm run build
```

Builds the project for production.

```bash
npm run preview
```

Previews the production build locally.

```bash
npm run lint
```

Runs ESLint to check code quality.

---

## 🏗️ Architecture

```text
User
   │
   ▼
React (LexiHub)
   │
Axios HTTP Requests
   │
   ▼
Corpus REST API
   │
   ▼
Database
```

---

## ✨ Key Functionalities

- Secure authentication using JWT
- Reusable layout with Sidebar and Navbar
- API integration using Axios
- Dynamic dashboard statistics
- Search and browse corpus resources
- Detailed record view
- Protected routing
- Error handling for unavailable APIs
- Clean and responsive interface

---

## 🔮 Future Enhancements

- Dynamic Recent Activities
- Pagination
- Search filters
- Sorting options
- Mobile UI improvements
- Dark mode
- Role-based access control

---

## 👩‍💻 Author

**Keerthana Bingi**

Developed as part of the **Swecha Internship** using React, TypeScript, Vite, Tailwind CSS, and the Corpus REST API.
