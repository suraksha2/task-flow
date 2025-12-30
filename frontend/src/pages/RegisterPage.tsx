import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FolderKanban } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import type { RegisterData, User, AuthTokens } from '../types';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>();

  const onSubmit = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await api.post<AuthTokens>('/auth/register', data);
      const tokens = response.data;

      const userResponse = await api.get<User>('/users/me', {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      });

      setAuth(userResponse.data, tokens);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <FolderKanban className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">ProjectFlow</h1>
          <p className="text-gray-600 mt-2">Create your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="John"
                error={errors.firstName?.message}
                {...register('firstName', {
                  required: 'First name is required',
                  minLength: { value: 2, message: 'Min 2 characters' },
                })}
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                error={errors.lastName?.message}
                {...register('lastName', {
                  required: 'Last name is required',
                  minLength: { value: 2, message: 'Min 2 characters' },
                })}
              />
            </div>

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
            />

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Create account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-700"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
