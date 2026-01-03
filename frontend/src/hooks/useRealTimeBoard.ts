import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  joinBoard,
  leaveBoard,
  onTaskCreated,
  onTaskUpdated,
  onTaskDeleted,
  onTaskMoved,
  onCommentAdded,
  onCommentDeleted,
} from '../lib/socket';
import type { Task } from '../types';

export function useRealTimeBoard(boardId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!boardId) return;

    // Join the board room
    joinBoard(boardId);

    // Listen for task events
    const unsubTaskCreated = onTaskCreated(() => {
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
    });

    const unsubTaskUpdated = onTaskUpdated((task: Task) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
      if (task?.id) {
        queryClient.invalidateQueries({ queryKey: ['task', task.id] });
      }
    });

    const unsubTaskDeleted = onTaskDeleted(({ taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
      queryClient.removeQueries({ queryKey: ['task', taskId] });
    });

    const unsubTaskMoved = onTaskMoved(() => {
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
    });

    // Listen for comment events
    const unsubCommentAdded = onCommentAdded(({ taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
    });

    const unsubCommentDeleted = onCommentDeleted(({ taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
    });

    // Cleanup
    return () => {
      leaveBoard(boardId);
      unsubTaskCreated();
      unsubTaskUpdated();
      unsubTaskDeleted();
      unsubTaskMoved();
      unsubCommentAdded();
      unsubCommentDeleted();
    };
  }, [boardId, queryClient]);
}

export function useRealTimeProject(projectId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!projectId) return;

    // Import dynamically to avoid circular dependencies
    import('../lib/socket').then(({ joinProject, leaveProject }) => {
      joinProject(projectId);

      return () => {
        leaveProject(projectId);
      };
    });
  }, [projectId, queryClient]);
}
