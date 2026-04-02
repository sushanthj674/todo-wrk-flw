# Todo App (Next.js + TypeScript)

A full-stack "Backend-cum-Frontend" Todo application built with Next.js, featuring 100% test coverage and a clean architectural separation.

## 🚀 Technical Context

This project was originally scaffolded as a Vite + TypeScript application and subsequently migrated to **Next.js**. It follows a structured approach to separate data logic from the UI to facilitate future scalability and potential microservice extraction.

### Architecture

- **Frontend:** Next.js (App Router) with React Client Components.
- **Backend:** Next.js API Routes (`app/api/todos/route.ts`).
- **Service Layer:** A centralized `BackendTodoService` (`lib/todo/service.ts`) that manages the business logic and data persistence (currently simulated in-memory).
- **Testing:** Comprehensive test suite using **Vitest** and **React Testing Library**, achieving **100% code coverage** across all statements, branches, and functions.

## 💻 Environment Details

This project was developed and verified on the following environment:

- **Operating System:** Darwin (macOS)
- **Node.js Version:** Latest LTS recommended
- **Package Manager:** npm

## 🛠 Setup Instructions

Follow these steps to get the project running locally:

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd todo
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Run Development Server:**

   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

4. **Build for Production:**
   ```bash
   npm run build
   npm start
   ```

## 🧪 Testing & Coverage

The project maintains a strict 100% coverage threshold.

- **Run all tests:**

  ```bash
  npm test
  ```

- **Run tests with coverage report:**
  ```bash
  npm run test:coverage
  ```

## 📜 Available Scripts

| Command                 | Description                                                   |
| :---------------------- | :------------------------------------------------------------ |
| `npm run dev`           | Starts the Next.js development server.                        |
| `npm run build`         | Builds the application for production.                        |
| `npm run start`         | Starts the production server.                                 |
| `npm run lint`          | Runs Next.js linting.                                         |
| `npm run test`          | Runs tests using Vitest.                                      |
| `npm run test:coverage` | Runs tests and generates a coverage report (Threshold: 100%). |

## 📂 Project Structure

```text
├── app/
│   ├── api/todos/route.ts  # API Endpoints (GET, POST, DELETE, PATCH)
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main Todo UI (Client Component)
├── lib/
│   └── todo/
│       ├── service.ts      # Backend logic (Simulated DB)
│       └── types.ts        # Shared TypeScript interfaces
├── __tests__/              # Comprehensive test suite
├── public/                 # Static assets
├── tsconfig.json           # TypeScript configuration (with @/* alias)
└── vitest.config.ts        # Vitest & Coverage configuration
```
