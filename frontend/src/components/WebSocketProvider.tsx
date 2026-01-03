import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import {
  initializeSocket,
  disconnectSocket,
  onNotification,
  onAnnouncement,
  type Notification,
} from '../lib/socket';

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export default function WebSocketProvider({ children }: WebSocketProviderProps) {
  const { isAuthenticated, tokens } = useAuthStore();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (isAuthenticated && tokens?.accessToken) {
      const socket = initializeSocket();

      if (socket) {
        // Listen for notifications
        const unsubNotification = onNotification((notification: Notification) => {
          addNotification(notification);
          
          // Show toast notification
          toast.custom(
            (t) => (
              <div
                className={`${
                  t.visible ? 'animate-enter' : 'animate-leave'
                } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
              >
                <div className="flex-1 w-0 p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <span className="text-2xl">
                        {notification.type === 'task_assigned' && '📋'}
                        {notification.type === 'comment_added' && '💬'}
                        {notification.type === 'task_updated' && '✏️'}
                        {notification.type === 'mentioned' && '@'}
                        {notification.type === 'project_invite' && '📨'}
                      </span>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex border-l border-gray-200">
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-primary-600 hover:text-primary-500 focus:outline-none"
                  >
                    Close
                  </button>
                </div>
              </div>
            ),
            {
              duration: 5000,
              position: 'top-right',
            }
          );
        });

        // Listen for announcements
        const unsubAnnouncement = onAnnouncement((data) => {
          toast(data.message, {
            icon: '📢',
            duration: 8000,
          });
        });

        return () => {
          unsubNotification();
          unsubAnnouncement();
          disconnectSocket();
        };
      }
    } else {
      disconnectSocket();
    }
  }, [isAuthenticated, tokens?.accessToken, addNotification]);

  return <>{children}</>;
}
