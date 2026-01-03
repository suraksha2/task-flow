import { create } from 'zustand';
import type { Notification } from '../lib/socket';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  removeNotification: (index: number) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications].slice(0, 50), // Keep last 50
      unreadCount: state.unreadCount + 1,
    })),
  markAllAsRead: () => set({ unreadCount: 0 }),
  clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
  removeNotification: (index) =>
    set((state) => ({
      notifications: state.notifications.filter((_, i) => i !== index),
    })),
}));
