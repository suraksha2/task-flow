import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Plus } from 'lucide-react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import TaskCard from '../components/TaskCard';
import api from '../lib/api';
import type { Board, Task, TaskStatus } from '../types';
import { statusLabels } from '../lib/utils';
import { useRealTimeBoard } from '../hooks/useRealTimeBoard';

const COLUMNS: TaskStatus[] = ['todo', 'in_progress', 'in_review', 'done'];

export default function BoardPage() {
  const { boardId } = useParams<{ boardId: string }>();
  const queryClient = useQueryClient();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Enable real-time updates for this board
  useRealTimeBoard(boardId);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const { data: board, isLoading } = useQuery({
    queryKey: ['board', boardId],
    queryFn: async () => {
      const response = await api.get<Board>(`/boards/${boardId}`);
      return response.data;
    },
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks', boardId],
    queryFn: async () => {
      const response = await api.get<Task[]>(`/tasks?boardId=${boardId}`);
      return response.data;
    },
    enabled: !!boardId,
  });

  const moveMutation = useMutation({
    mutationFn: async ({ taskId, status, position }: { taskId: string; status: TaskStatus; position: number }) => {
      await api.patch(`/tasks/${taskId}/move`, { status, position });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
    },
    onError: () => {
      toast.error('Failed to move task');
    },
  });

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    const newStatus = COLUMNS.includes(overId as TaskStatus)
      ? (overId as TaskStatus)
      : tasks.find((t) => t.id === overId)?.status;

    if (!newStatus) return;

    const tasksInColumn = tasks.filter((t) => t.status === newStatus);
    const position = tasksInColumn.length;

    moveMutation.mutate({ taskId, status: newStatus, position });
  };

  const getTasksByStatus = (status: TaskStatus) =>
    tasks.filter((task) => task.status === status).sort((a, b) => a.position - b.position);

  if (isLoading) {
    return <div className="animate-pulse h-96 bg-gray-100 rounded-xl" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to={`/projects/${board?.projectId}`}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{board?.name}</h1>
          <p className="text-gray-600">{board?.description}</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {COLUMNS.map((status) => (
            <div
              key={status}
              className="bg-gray-100 rounded-xl p-4 min-h-[500px]"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">
                  {statusLabels[status]}
                </h3>
                <span className="text-sm text-gray-500 bg-white px-2 py-0.5 rounded-full">
                  {getTasksByStatus(status).length}
                </span>
              </div>
              <SortableContext
                items={getTasksByStatus(status).map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3" id={status}>
                  {getTasksByStatus(status).map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </SortableContext>
            </div>
          ))}
        </div>
        <DragOverlay>
          {activeTask && <TaskCard task={activeTask} isDragging />}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
