# Corpus Insight Hub

Corpus Insight Hub is a modern web application built using **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. It serves as a client application for interacting with the Corpus API, allowing users to search, browse, and manage corpus records through an intuitive interface.

The application also includes an **AI Summary** feature powered by the **Google Gemini API**, enabling users to generate concise summaries of textual content.

---

## Features

- User Authentication
- Dashboard with Statistics
- Search Corpus Records
- View Record Details
- AI-Powered Text Summarization
- Responsive User Interface
- Modern Sidebar Navigation
- Fast and Optimized Performance
- Production Build Support

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React

### Backend

- Python
- Gemini API Integration

---

## Project Structure

```
corpus-insight-hub/
│
├── backend/
│   ├── ai.py
│   ├── main.py
│   └── requirements.txt
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── constants/
│   ├── hooks/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── App.tsx
│   └── main.tsx
│
├── package.json
├── vite.config.ts
├── tsconfig.json
├── .gitignore
└── README.md
```

---

## Installation

### Clone the Repository

```bash
git clone https://code.swecha.org/BINGI-KEERTHANA/corpus-insight-hub.git
```

Move into the project directory.

```bash
cd corpus-insight-hub
```

Install all required dependencies.

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the root directory.

Add the following variable:

```env
VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

Replace `YOUR_GEMINI_API_KEY` with your actual Gemini API key.

---

## Running the Application

Start the development server.

```bash
npm run dev
```

The application will be available at:

```
http://localhost:5173
```

---

## Production Build

Generate a production build.

```bash
npm run build
```

Preview the production build.

```bash
npm run preview
```

---

## Available Scripts

Install dependencies

```bash
npm install
```

Run development server

```bash
npm run dev
```

Build application

```bash
npm run build
```

Preview production build

```bash
npm run preview
```

---

## Application Modules

- Login
- Dashboard
- Search Records
- Record Details
- AI Summary
- Navigation Sidebar
- Responsive Layout

---

## AI Summary

The AI Summary feature integrates with the Google Gemini API to generate concise summaries from input text.

### Requirements

Create a `.env` file and configure:

```env
VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

Without this key, the AI Summary feature will not function.

---

## Repository

```
https://code.swecha.org/BINGI-KEERTHANA/corpus-insight-hub
```

---

## Team

**Team Lead**

- Keerthana Bingi

**Project**

- Corpus Insight Hub

---

## Acknowledgements

This project was developed as part of the **Swecha Internship Program**. It demonstrates integration with the Corpus API, modern frontend development using React and TypeScript, and AI-powered text summarization using Google's Gemini API.