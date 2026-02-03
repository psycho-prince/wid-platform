
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { LoginUserRequestSchema, AuthError, AuthResponse } from '@wid-platform/contracts'; // Import from contracts

const LoginPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUserRequestSchema>({
    resolver: zodResolver(LoginUserRequestSchema), // Use Zod schema for validation
  });

  const mutation = useMutation<AuthResponse, Error, LoginUserRequestSchema>({
    mutationFn: (data: LoginUserRequestSchema) => api.post('/auth/login', data),
    onSuccess: (response) => {
      localStorage.setItem('token', response.accessToken); // Use accessToken from AuthResponse
      navigate('/');
    },
    onError: (error) => {
      // Handle error based on AuthError enum (if API sends it)
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    },
  });

  const onSubmit = (data: LoginUserRequestSchema) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-md bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-3xl font-bold">WID Platform</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={mutation.isLoading}
            className="w-full rounded-md bg-indigo-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
          >
            {mutation.isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
         <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
