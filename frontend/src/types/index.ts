export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'user';
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  key: string;
  icon?: string;
  isActive: boolean;
  owner: User;
  ownerId: string;
  members: User[];
  boards: Board[];
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  id: string;
  name: string;
  description?: string;
  position: number;
  isActive: boolean;
  projectId: string;
  project?: Project;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description?: string;
  taskKey: string;
  status: TaskStatus;
  priority: TaskPriority;
  position: number;
  dueDate?: string;
  estimatedHours?: number;
  loggedHours: number;
  labels?: string[];
  boardId: string;
  board?: Board;
  assignee?: User;
  assigneeId?: string;
  reporter: User;
  reporterId: string;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  taskId: string;
  task?: Task;
  author: User;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  type: string;
  description?: string;
  metadata?: Record<string, unknown>;
  userId: string;
  user: User;
  projectId: string;
  project?: Project;
  taskId?: string;
  task?: Task;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}
