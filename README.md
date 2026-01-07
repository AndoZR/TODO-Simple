# Todo App - Full-Stack (React + NestJS)

A simple full-stack todo application built with React (frontend) and NestJS (backend).

## Screenshots

![Todo App Screenshot 1](./screenshots/Screenshot%202026-01-07%20103013.png)

![Todo App Screenshot 2](./screenshots/Screenshot%202026-01-07%20103128.png)

> **Note**: Screenshots showing the application interface and features.

## Prerequisites

- **Node.js**: v24.11.1 (or compatible version)
- **npm** or **yarn** package manager

## Project Structure

```
godeva/
├── backend/          # NestJS backend API
├── frontend/         # React frontend application
├── screenshots/      # Application screenshots
└── README.md
```

## Setup & Running

### Backend (NestJS)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run start:dev
   ```

   The backend will run on `http://localhost:3001`

### Frontend (React)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`

## API Endpoints

- `GET /api/todos?search=` - Get all todos (optional search filter on title)
- `POST /api/todos` - Create a new todo (body: `{ title: string }`)
- `PATCH /api/todos/:id` - Toggle completed status of a todo

## Features

- ✅ Add new todos
- ✅ Search todos by title
- ✅ Toggle todo completion status
- ✅ Loading and error states
- ✅ Responsive design

## Technical Decisions

1. **In-Memory Storage**: Used in-memory array storage for simplicity and fast development. Data will be lost on server restart, which is acceptable for this technical test.

2. **Client-Side Search**: Implemented search functionality that queries the backend API with a search parameter. This allows for server-side filtering while keeping the frontend simple without additional state management libraries.

3. **Native Fetch API**: Used native `fetch` API instead of React Query or Axios to keep dependencies minimal and demonstrate core React patterns with hooks (`useState`, `useEffect`).



