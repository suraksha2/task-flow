import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';

let socket: Socket | null = null;

export interface Notification {
  type: 'task_assigned' | 'task_updated' | 'comment_added' | 'mentioned' | 'project_invite';
  title: string;
  message: string;
  data?: any;
  timestamp: string;
}

export interface TaskEvent {
  taskId?: string;
  newStatus?: string;
  newPosition?: number;
}

export interface CommentEvent {
  taskId: string;
  comment?: any;
  commentId?: string;
}

export const initializeSocket = (): Socket | null => {
  const tokens = useAuthStore.getState().tokens;
  
  if (!tokens?.accessToken) {
    console.warn('No access token available for WebSocket connection');
    return null;
  }

  if (socket?.connected) {
    return socket;
  }

  socket = io('http://localhost:3000/ws', {
    auth: {
      token: tokens.accessToken,
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    console.log('🔌 WebSocket connected');
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 WebSocket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('🔌 WebSocket connection error:', error.message);
  });

  socket.on('connected', (data) => {
    console.log('✅ Authenticated with WebSocket server:', data);
  });

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const joinProject = (projectId: string) => {
  if (socket?.connected) {
    socket.emit('joinProject', { projectId });
  }
};

export const leaveProject = (projectId: string) => {
  if (socket?.connected) {
    socket.emit('leaveProject', { projectId });
  }
};

export const joinBoard = (boardId: string) => {
  if (socket?.connected) {
    socket.emit('joinBoard', { boardId });
  }
};

export const leaveBoard = (boardId: string) => {
  if (socket?.connected) {
    socket.emit('leaveBoard', { boardId });
  }
};

// Event listeners
export const onTaskCreated = (callback: (task: any) => void) => {
  socket?.on('taskCreated', callback);
  return () => socket?.off('taskCreated', callback);
};

export const onTaskUpdated = (callback: (task: any) => void) => {
  socket?.on('taskUpdated', callback);
  return () => socket?.off('taskUpdated', callback);
};

export const onTaskDeleted = (callback: (data: { taskId: string }) => void) => {
  socket?.on('taskDeleted', callback);
  return () => socket?.off('taskDeleted', callback);
};

export const onTaskMoved = (callback: (data: TaskEvent) => void) => {
  socket?.on('taskMoved', callback);
  return () => socket?.off('taskMoved', callback);
};

export const onCommentAdded = (callback: (data: CommentEvent) => void) => {
  socket?.on('commentAdded', callback);
  return () => socket?.off('commentAdded', callback);
};

export const onCommentDeleted = (callback: (data: CommentEvent) => void) => {
  socket?.on('commentDeleted', callback);
  return () => socket?.off('commentDeleted', callback);
};

export const onNotification = (callback: (notification: Notification) => void) => {
  socket?.on('notification', callback);
  return () => socket?.off('notification', callback);
};

export const onAnnouncement = (callback: (data: { message: string; timestamp: string }) => void) => {
  socket?.on('announcement', callback);
  return () => socket?.off('announcement', callback);
};
