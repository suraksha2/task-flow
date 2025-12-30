import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Plus, ArrowLeft, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { Card, CardContent } from '../components/ui/Card';
import api from '../lib/api';
import type { Project, Board } from '../types';

interface CreateBoardForm {
  name: string;
  description: string;
}

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateBoardForm>();

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const response = await api.get<Project>(`/projects/${projectId}`);
      return response.data;
    },
  });

  const { data: boards = [] } = useQuery({
    queryKey: ['boards', projectId],
    queryFn: async () => {
      const response = await api.get<Board[]>(`/boards?projectId=${projectId}`);
      return response.data;
    },
    enabled: !!projectId,
  });

  const createBoardMutation = useMutation({
    mutationFn: async (data: CreateBoardForm) => {
      const response = await api.post<Board>('/boards', {
        ...data,
        projectId,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards', projectId] });
      setIsCreateModalOpen(false);
      reset();
      toast.success('Board created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create board');
    },
  });

  const onSubmitBoard = (data: CreateBoardForm) => {
    createBoardMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    );
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/projects"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-primary-700">
                {project.key}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
              <p className="text-gray-600">{project.description}</p>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsSettingsModalOpen(true)}>
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Boards</h2>
          <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Board
          </Button>
        </div>

        {boards.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">No boards yet. Create your first board to get started.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {boards.map((board) => (
              <Link key={board.id} to={`/boards/${board.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900">{board.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {board.description || 'No description'}
                    </p>
                    <p className="text-xs text-gray-400 mt-3">
                      {board.tasks?.length || 0} tasks
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Create Board Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Board"
      >
        <form onSubmit={handleSubmit(onSubmitBoard)} className="space-y-4">
          <Input
            label="Board Name"
            placeholder="Sprint 1"
            error={errors.name?.message}
            {...register('name', {
              required: 'Board name is required',
              minLength: { value: 2, message: 'Min 2 characters' },
            })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={3}
              placeholder="Describe your board..."
              {...register('description')}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={createBoardMutation.isPending}>
              Create Board
            </Button>
          </div>
        </form>
      </Modal>

      {/* Settings Modal */}
      <Modal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        title="Project Settings"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name
            </label>
            <p className="text-gray-900">{project.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Key
            </label>
            <p className="text-gray-900">{project.key}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <p className="text-gray-900">{project.description || 'No description'}</p>
          </div>
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setIsSettingsModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
