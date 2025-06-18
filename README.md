# InterviewTrackerClient

A modern web client for the InterviewTracker platform, built with React, TypeScript, and Vite. This project provides an interactive dashboard for tracking, adding, and sharing job interview experiences, with authentication and a clean, component-based design.

## Features

- **React + TypeScript**: Strongly-typed, component-based UI.
- **Vite**: Fast development server and build tooling.
- **Routing**: Uses React Router for SPA navigation.
- **Authentication**: Context-based auth (Google OAuth) and protected routes.
- **Dashboard**: Manage and review your interview history.
- **Interview Form**: Add new interviews with detailed info.
- **Public Interviews**: Browse and learn from public interview records.
- **Styling**: TailwindCSS and Emotion for flexible, responsive design.

## Technologies Used

- React 19
- TypeScript
- Vite
- Emotion, TailwindCSS
- Radix UI components
- React Router v7
- Context API for authentication
- date-fns, framer-motion, lucide-react, and more

### Prerequisites

- Node.js (v18+ recommended)
- Yarn or npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AvitalHass/InterviewTrackerClient.git
   cd InterviewTrackerClient
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Configure environment variables if required (API base URL, OAuth keys, etc).

### Running Locally

```bash
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:5173` (or as specified by Vite).

## Project Structure

- `src/main.tsx` – Application entrypoint
- `src/App.tsx` – Main app with route definitions and auth provider
- `src/components/*` – UI components, dashboard, forms, etc.
- `src/auth/*` – Authentication context and utilities
- `public/` – Static assets

## Scripts

- `dev` – Start local dev server
- `build` – Build for production
- `preview` – Preview production build
- `lint` – Run ESLint

## License

MIT

---
