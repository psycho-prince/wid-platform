import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { RegisterUserRequestSchema, AuthError, AuthResponse } from '@wid-platform/contracts';

// Augment the RegisterUserRequestSchema with confirmPassword and terms agreement for client-side validation
const RegisterFormSchema = RegisterUserRequestSchema.extend({
  confirmPassword: z.string(),
  termsAgreed: z.boolean().refine(val => val === true, {
    message: "You must agree to the Terms and Conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormType = z.infer<typeof RegisterFormSchema>;

const RegisterPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormType>({
    resolver: zodResolver(RegisterFormSchema),
  });

  const mutation = useMutation<AuthResponse, Error, RegisterFormType>({
    mutationFn: (data: RegisterFormType) => api.post('/auth/register', {
      email: data.email,
      password: data.password,
      // In a real application, the termsAgreed timestamp would be sent to the backend
      // and stored with the user's consent.
      metadata: {
        termsAgreedAt: data.termsAgreed ? new Date().toISOString() : null,
      },
    }),
    onSuccess: () => {
      alert('Registration successful! Please log in.');
      navigate('/login');
    },
    onError: (error) => {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    },
  });

  const onSubmit = (data: RegisterFormType) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-md bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-3xl font-bold">Create your Account</h2>
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
          <div className="mb-4">
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
           <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <div className="mb-6 flex items-center">
            <input
              id="termsAgreed"
              type="checkbox"
              {...register('termsAgreed')}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor="termsAgreed"
              className="ml-2 block text-sm text-gray-900"
            >
              I agree to the{' '}
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Terms and Conditions
              </a>
            </label>
          </div>
          {errors.termsAgreed && (
              <p className="mt-2 text-sm text-red-600">{errors.termsAgreed.message}</p>
          )}
          <button
            type="submit"
            disabled={mutation.isLoading}
            className="w-full rounded-md bg-indigo-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
          >
            {mutation.isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;