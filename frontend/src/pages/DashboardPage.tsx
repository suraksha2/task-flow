import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import type { Project, Activity } from '../types';
import { formatDateTime } from '../lib/utils';

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await api.get<Project[]>('/projects');
      return response.data;
    },
  });

  const { data: activities = [] } = useQuery({
    queryKey: ['my-activity'],
    queryFn: async () => {
      const response = await api.get<Activity[]>('/activity/me?limit=10');
      return response.data;
    },
  });

  const stats = [
    {
      name: 'Total Projects',
      value: projects.length,
      icon: FolderKanban,
      color: 'bg-blue-500',
    },
    {
      name: 'Completed Tasks',
      value: 0,
      icon: CheckCircle2,
      color: 'bg-green-500',
    },
    {
      name: 'In Progress',
      value: 0,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      name: 'Overdue',
      value: 0,
      icon: AlertCircle,
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="flex items-center gap-4 py-4">
              <div
                className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.name}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Projects
              </h2>
              <Link
                to="/projects"
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="divide-y">
            {projects.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No projects yet.{' '}
                <Link to="/projects" className="text-primary-600">
                  Create one
                </Link>
              </p>
            ) : (
              projects.slice(0, 5).map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="flex items-center gap-3 py-3 hover:bg-gray-50 -mx-6 px-6 transition-colors"
                >
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-700">
                      {project.key}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {project.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {project.description || 'No description'}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h2>
          </CardHeader>
          <CardContent className="divide-y">
            {activities.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No recent activity
              </p>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="py-3">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDateTime(activity.createdAt)}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
