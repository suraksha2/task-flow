import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Link } from 'react-router-dom';
import { Calendar, MessageSquare } from 'lucide-react';
import type { Task } from '../types';
import { cn, priorityColors, formatDate, getInitials } from '../lib/utils';

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

export default function TaskCard({ task, isDragging }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'bg-white rounded-lg p-4 shadow-sm border cursor-grab active:cursor-grabbing',
        (isDragging || isSortableDragging) && 'opacity-50 shadow-lg',
      )}
    >
      <Link to={`/tasks/${task.id}`} className="block">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-xs font-medium text-gray-500">{task.taskKey}</span>
          <span
            className={cn(
              'text-xs px-2 py-0.5 rounded-full capitalize',
              priorityColors[task.priority]
            )}
          >
            {task.priority}
          </span>
        </div>
        <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
          {task.title}
        </h4>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-gray-500">
            {task.dueDate && (
              <div className="flex items-center gap-1 text-xs">
                <Calendar className="w-3 h-3" />
                {formatDate(task.dueDate)}
              </div>
            )}
            {task.comments?.length > 0 && (
              <div className="flex items-center gap-1 text-xs">
                <MessageSquare className="w-3 h-3" />
                {task.comments.length}
              </div>
            )}
          </div>
          {task.assignee && (
            <div
              className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center"
              title={`${task.assignee.firstName} ${task.assignee.lastName}`}
            >
              <span className="text-xs font-medium text-primary-700">
                {getInitials(task.assignee.firstName, task.assignee.lastName)}
              </span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
