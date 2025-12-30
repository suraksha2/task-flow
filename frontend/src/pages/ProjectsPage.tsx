import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, FolderKanban, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { Card, CardContent } from '../components/ui/Card';
import api from '../lib/api';
import type { Project } from '../types';
import { formatDate } from '../lib/utils';

interface CreateProjectForm {
  name: string;
  description: string;
  key: string;
}

export default function ProjectsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await api.get<Project[]>('/projects');
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateProjectForm) => {
      const response = await api.post<Project>('/projects', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsModalOpen(false);
      toast.success('Project created successfully!');
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create project');
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProjectForm>();

  const onSubmit = (data: CreateProjectForm) => {
    createMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">
            Manage your projects and collaborate with your team
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FolderKanban className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No projects yet
            </h3>
            <p className="text-gray-500 mb-4 text-center max-w-sm">
              Create your first project to start organizing your work and
              collaborating with your team.
            </p>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Link key={project.id} to={`/projects/${project.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary-700">
                        {project.key}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {project.description || 'No description'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      {project.members?.length || 1} members
                    </div>
                    <span className="text-xs text-gray-400">
                      {formatDate(project.createdAt)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Project"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Project Name"
            placeholder="E-Commerce Platform"
            error={errors.name?.message}
            {...register('name', {
              required: 'Project name is required',
              minLength: { value: 2, message: 'Min 2 characters' },
            })}
          />
          <Input
            label="Project Key"
            placeholder="ECOM"
            error={errors.key?.message}
            {...register('key', {
              required: 'Project key is required',
              pattern: {
                value: /^[A-Z0-9]+$/,
                message: 'Must be uppercase alphanumeric',
              },
              minLength: { value: 2, message: 'Min 2 characters' },
              maxLength: { value: 10, message: 'Max 10 characters' },
            })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={3}
              placeholder="Describe your project..."
              {...register('description')}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={createMutation.isPending}>
              Create Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
