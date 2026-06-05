<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=40&pause=1000&color=6366F1&center=true&vCenter=true&width=600&lines=🎌+NimeList;Your+Anime+Universe" alt="NimeList Typing SVG" />

<br/>

**A modern, responsive web app for anime ratings, reviews, and community discussions.**

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Ant Design](https://img.shields.io/badge/Ant_Design-5-0170FE?style=for-the-badge&logo=ant-design&logoColor=white)](https://ant.design/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<br/>

[Live Demo](https://nime-list-frontend.vercel.app) · [Report Bug](https://github.com/Rcikaym/NimeList-Frontend/issues)

<br/>

---

</div>

## Table of Contents

- [About The Project](#-about-the-project)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Scripts](#-scripts)
- [Contributing](#-contributing)
- [License](#-license)

---

## About The Project

**NimeList** is a full-featured anime platform built for fans who want more than just a list. Discover anime, read and write reviews, rate your favorites, and engage in community discussions — all in one beautifully crafted web experience.

This repository contains the **frontend** of NimeList. The backend is powered by **NestJS** and **PostgreSQL**, while the frontend leverages the performance of **Next.js 16** with server-side rendering and a polished UI component ecosystem.

> Live at: [nime-list-frontend.vercel.app](https://nime-list-frontend.vercel.app)

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) |
| **UI Components** | [Ant Design 5](https://ant.design/), [NextUI 2](https://nextui.org/) |
| **Icons** | [React Icons](https://react-icons.github.io/react-icons/), [Heroicons](https://heroicons.com/), [Ant Design Icons](https://ant.design/components/icon) |
| **HTTP Client** | [Axios](https://axios-http.com/) |
| **Charts** | [Chart.js](https://www.chartjs.org/) + [react-chartjs-2](https://react-chartjs-2.js.org/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Rich Text** | [React Quill](https://zenoamaro.github.io/react-quill/) |
| **Carousels** | [React Slick](https://react-slick.neostack.com/) |
| **Auth** | [jwt-decode](https://github.com/auth0/jwt-decode) |
| **Payment** | [Midtrans](https://midtrans.com/) |

---

## Features

- **Anime Discovery** — Browse, search, and filter anime by genre, rating, and season
- **Rating System** — Rate and review anime with a community-driven scoring system
- **Discussions** — Engage in threaded community discussions per anime title
- **Statistics Dashboard** — Visual charts and analytics for your anime watch history
- **Infinite Scroll** — Smooth, seamless loading for anime lists
- **Authentication** — JWT-based login, registration, and session management
- **Payments** — Premium subscription integration via Midtrans
- **Fully Responsive** — Optimized for desktop, tablet, and mobile
- **Rich Text Editor** — Write detailed reviews with full formatting support
- **Modern UI** — Elegant design powered by Ant Design and NextUI

---

## Project Structure

```
NimeList-Frontend/
├── public/
│   └── images/          # Static image assets
├── src/
│   ├── app/             # Next.js App Router pages & layouts
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions & helpers
│   ├── services/        # API service layer (Axios)
│   └── types/           # TypeScript type definitions
├── .env.local.example   # Environment variables template
├── next.config.js       # Next.js configuration
├── tailwind.config.ts   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** `>= 18.x`
- **npm** / **yarn** / **pnpm**
- The **NimeList Backend** running (NestJS + PostgreSQL)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/Rcikaym/NimeList-Frontend.git
cd NimeList-Frontend
```

**2. Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

**3. Set up environment variables**

```bash
cp .env.local.example .env.local
```

Then fill in the values in `.env.local` (see [Environment Variables](#-environment-variables) below).

**4. Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env.local` file at the root of the project based on `.env.local.example`:

```env
# URL of your NimeList backend API (NestJS)
NEXT_PUBLIC_API_URL=your_backend_api

# Midtrans client key for payment integration
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_midtrans_client_key_here
```

| Variable | Description | Required |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
| `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` | Midtrans client key for payments |

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server at `localhost:3000` |
| `npm run build` | Build the app for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint for code quality checks |
| `npm run serve-json` | Start mock JSON server on port `3001` |

---


Please make sure your code follows the existing code style and passes linting before submitting.

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

Made by [Rcikaym](https://github.com/Rcikaym) and [Akbar](https://github.com/akbarR1dho)

 **Star this repo if you find it useful!**

</div>
