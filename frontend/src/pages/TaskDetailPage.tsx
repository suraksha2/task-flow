import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Send, Calendar, User, Clock, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import api from '../lib/api';
import type { Task, Comment, User as UserType, TaskStatus, TaskPriority } from '../types';
import { formatDateTime, priorityColors, statusLabels, cn } from '../lib/utils';
import { useAuthStore } from '../store/authStore';

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'in_review', label: 'In Review' },
  { value: 'done', label: 'Done' },
];

const PRIORITY_OPTIONS: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-700' },
  { value: 'medium', label: 'Medium', color: 'bg-blue-100 text-blue-700' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-700' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-700' },
];

export default function TaskDetailPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isAssigneeOpen, setIsAssigneeOpen] = useState(false);

  const { data: task, isLoading } = useQuery({
    queryKey: ['task', taskId],
    queryFn: async () => {
      const response = await api.get<Task>(`/tasks/${taskId}`);
      return response.data;
    },
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['comments', taskId],
    queryFn: async () => {
      const response = await api.get<Comment[]>(`/comments?taskId=${taskId}`);
      return response.data;
    },
    enabled: !!taskId,
  });

  // Fetch project members for assignee dropdown
  const { data: projectMembers = [] } = useQuery({
    queryKey: ['project-members', task?.board?.projectId],
    queryFn: async () => {
      const response = await api.get<UserType[]>(`/projects/${task?.board?.projectId}/members`);
      return response.data;
    },
    enabled: !!task?.board?.projectId,
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: async (data: Partial<Task>) => {
      const response = await api.patch<Task>(`/tasks/${taskId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update task');
    },
  });

  const handleStatusChange = (status: TaskStatus) => {
    updateTaskMutation.mutate({ status });
    setIsStatusOpen(false);
  };

  const handlePriorityChange = (priority: TaskPriority) => {
    updateTaskMutation.mutate({ priority });
    setIsPriorityOpen(false);
  };

  const handleAssigneeChange = (assigneeId: string | null) => {
    updateTaskMutation.mutate({ assigneeId } as any);
    setIsAssigneeOpen(false);
  };

  const { register, handleSubmit, reset } = useForm<{ content: string }>();

  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      await api.post('/comments', { taskId, content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
      reset();
      toast.success('Comment added');
    },
    onError: () => {
      toast.error('Failed to add comment');
    },
  });

  const onSubmitComment = (data: { content: string }) => {
    if (data.content.trim()) {
      addCommentMutation.mutate(data.content);
    }
  };

  if (isLoading) {
    return <div className="animate-pulse h-96 bg-gray-100 rounded-xl" />;
  }

  if (!task) {
    return <div>Task not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to={`/boards/${task.boardId}`}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-500">{task.taskKey}</span>
            <Badge className={cn(priorityColors[task.priority])}>
              {task.priority}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-gray-900">Description</h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">
                {task.description || 'No description provided.'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="font-semibold text-gray-900">
                Comments ({comments.length})
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-primary-700">
                      {comment.author.firstName.charAt(0)}
                      {comment.author.lastName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {comment.author.firstName} {comment.author.lastName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDateTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                </div>
              ))}

              <form
                onSubmit={handleSubmit(onSubmitComment)}
                className="flex gap-3 pt-4 border-t"
              >
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-primary-700">
                    {user?.firstName.charAt(0)}
                    {user?.lastName.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    {...register('content')}
                  />
                  <Button
                    type="submit"
                    size="sm"
                    isLoading={addCommentMutation.isPending}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-gray-900">Details</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status Dropdown */}
              <div className="relative">
                <label className="text-xs font-medium text-gray-500 uppercase">
                  Status
                </label>
                <button
                  onClick={() => setIsStatusOpen(!isStatusOpen)}
                  className="mt-1 w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="font-medium text-gray-900">
                    {statusLabels[task.status]}
                  </span>
                  <ChevronDown className={cn("w-4 h-4 text-gray-500 transition-transform", isStatusOpen && "rotate-180")} />
                </button>
                {isStatusOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border py-1">
                    {STATUS_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleStatusChange(option.value)}
                        className={cn(
                          "w-full px-3 py-2 text-left text-sm hover:bg-gray-100",
                          task.status === option.value && "bg-primary-50 text-primary-700"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Priority Dropdown */}
              <div className="relative">
                <label className="text-xs font-medium text-gray-500 uppercase">
                  Priority
                </label>
                <button
                  onClick={() => setIsPriorityOpen(!isPriorityOpen)}
                  className="mt-1 w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Badge className={cn(priorityColors[task.priority])}>
                    {task.priority}
                  </Badge>
                  <ChevronDown className={cn("w-4 h-4 text-gray-500 transition-transform", isPriorityOpen && "rotate-180")} />
                </button>
                {isPriorityOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border py-1">
                    {PRIORITY_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handlePriorityChange(option.value)}
                        className={cn(
                          "w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center",
                          task.priority === option.value && "bg-primary-50"
                        )}
                      >
                        <Badge className={option.color}>{option.label}</Badge>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Assignee Dropdown */}
              <div className="relative">
                <label className="text-xs font-medium text-gray-500 uppercase">
                  Assignee
                </label>
                <button
                  onClick={() => setIsAssigneeOpen(!isAssigneeOpen)}
                  className="mt-1 w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {task.assignee ? (
                      <>
                        <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-primary-700">
                            {task.assignee.firstName.charAt(0)}{task.assignee.lastName.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {task.assignee.firstName} {task.assignee.lastName}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-500">Unassigned</span>
                    )}
                  </div>
                  <ChevronDown className={cn("w-4 h-4 text-gray-500 transition-transform", isAssigneeOpen && "rotate-180")} />
                </button>
                {isAssigneeOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border py-1 max-h-48 overflow-y-auto">
                    <button
                      onClick={() => handleAssigneeChange(null)}
                      className={cn(
                        "w-full px-3 py-2 text-left text-sm hover:bg-gray-100",
                        !task.assignee && "bg-primary-50 text-primary-700"
                      )}
                    >
                      Unassigned
                    </button>
                    {projectMembers.map((member) => (
                      <button
                        key={member.id}
                        onClick={() => handleAssigneeChange(member.id)}
                        className={cn(
                          "w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2",
                          task.assignee?.id === member.id && "bg-primary-50"
                        )}
                      >
                        <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-primary-700">
                            {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                          </span>
                        </div>
                        <span>{member.firstName} {member.lastName}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">
                  Reporter
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-900">
                    {task.reporter.firstName} {task.reporter.lastName}
                  </span>
                </div>
              </div>
              {task.dueDate && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">
                    Due Date
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {formatDateTime(task.dueDate)}
                    </span>
                  </div>
                </div>
              )}
              {task.estimatedHours && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">
                    Time Tracking
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {task.loggedHours}h / {task.estimatedHours}h
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
