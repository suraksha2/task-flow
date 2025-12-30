# ProjectFlow - SaaS Project Management Tool

A full-stack project management application similar to Jira or Linear, built with React, TypeScript, NestJS, MySQL, and Redis.

## Features

- **JWT Authentication** with refresh tokens
- **Role-based Access Control** (Admin, Manager, User)
- **Projects → Boards → Tasks** hierarchy
- **Kanban Drag & Drop** interface
- **Comments & Activity Logs**
- **Email Notifications** for task assignments

## Tech Stack

### Backend
- **NestJS** - Node.js framework
- **TypeORM** - Database ORM
- **MySQL** - Primary database
- **Redis** - Caching layer
- **Passport.js** - Authentication
- **Swagger** - API documentation

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **React Query** - Server state management
- **Zustand** - Client state management
- **dnd-kit** - Drag and drop
- **React Router** - Routing
- **React Hook Form** - Form handling

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8+
- Redis

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Configure your environment variables:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=your_password
   DB_DATABASE=projectflow
   
   JWT_SECRET=your-jwt-secret-key
   JWT_REFRESH_SECRET=your-refresh-secret-key
   JWT_EXPIRATION=15m
   JWT_REFRESH_EXPIRATION=7d
   
   REDIS_HOST=localhost
   REDIS_PORT=6379
   
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=your-email
   SMTP_PASSWORD=your-password
   SMTP_FROM=noreply@projectflow.com
   ```

5. Start the development server:
   ```bash
   npm run start:dev
   ```

The API will be available at `http://localhost:3000` with Swagger docs at `http://localhost:3000/api/docs`.

### Frontend Setup

1. Navigate to the frontend directory:
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

The app will be available at `http://localhost:5173`.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout

### Users
- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/me` - Update profile
- `GET /api/users` - List all users (Admin only)

### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project details
- `PATCH /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/members` - Add member
- `DELETE /api/projects/:id/members/:userId` - Remove member

### Boards
- `GET /api/boards?projectId=` - List boards
- `POST /api/boards` - Create board
- `GET /api/boards/:id` - Get board details
- `PATCH /api/boards/:id` - Update board
- `DELETE /api/boards/:id` - Delete board

### Tasks
- `GET /api/tasks?boardId=` - List tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/:id` - Get task details
- `PATCH /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/move` - Move task (drag & drop)
- `DELETE /api/tasks/:id` - Delete task

### Comments
- `GET /api/comments?taskId=` - List comments
- `POST /api/comments` - Add comment
- `PATCH /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

### Activity
- `GET /api/activity/project?projectId=` - Project activity
- `GET /api/activity/task?taskId=` - Task activity
- `GET /api/activity/me` - User activity

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── common/
│   │   │   └── enums/           # Shared enums
│   │   ├── modules/
│   │   │   ├── auth/            # Authentication
│   │   │   ├── users/           # User management
│   │   │   ├── projects/        # Projects
│   │   │   ├── boards/          # Boards
│   │   │   ├── tasks/           # Tasks
│   │   │   ├── comments/        # Comments
│   │   │   ├── activity/        # Activity logs
│   │   │   ├── email/           # Email notifications
│   │   │   └── redis/           # Redis caching
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # Reusable UI components
│   │   │   ├── Layout.tsx
│   │   │   └── TaskCard.tsx
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── ProjectsPage.tsx
│   │   │   ├── ProjectDetailPage.tsx
│   │   │   ├── BoardPage.tsx
│   │   │   └── TaskDetailPage.tsx
│   │   ├── store/
│   │   │   └── authStore.ts
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   └── utils.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

## License

MIT
