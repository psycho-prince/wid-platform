import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { LoginUserRequestSchema, AuthResponse } from '@wid-platform/contracts';

const LoginPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginUserRequestSchema>({
    resolver: zodResolver(LoginUserRequestSchema),
    defaultValues: {
      email: 'owner@legacy.com',
      password: 'password123'
    }
  });

  const mutation = useMutation<AuthResponse, Error, LoginUserRequestSchema>({
    mutationFn: (data: LoginUserRequestSchema) => api.post('/auth/login', data) as any,
    onSuccess: (response) => {
      // In our mock API, response contains accessToken
      localStorage.setItem('token', response.accessToken);
      navigate('/app');
    },
    onError: (error) => {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    },
  });

  const onSubmit = (data: LoginUserRequestSchema) => {
    mutation.mutate(data);
  };

  const fillCredentials = () => {
    setValue('email', 'owner@legacy.com');
    setValue('password', 'password123');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center relative overflow-hidden font-sans">
      {/* Background grids & glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md p-8 glass-card rounded-3xl animate-fade-in relative z-10 border border-slate-800/80 shadow-2xl">
        {/* Pulsing Status Bar */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/30 bg-slate-900 text-xs font-semibold text-blue-400">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Zero-Trust Access
        </div>

        {/* Header */}
        <div className="text-center mb-8 mt-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/20 mb-4">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            WID PLATFORM
          </h2>
          <p className="text-slate-400 text-sm mt-1.5 font-medium">
            Sign in to access your digital legacy vault.
          </p>
        </div>

        {/* Demo Helper Alert */}
        <div className="mb-6 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>Testing credentials pre-filled.</span>
          <button 
            type="button" 
            onClick={fillCredentials}
            className="text-blue-400 hover:text-blue-300 font-semibold transition"
          >
            Autofill
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                </svg>
              </span>
              <input
                id="email"
                type="email"
                placeholder="you@domain.com"
                {...register('email')}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900/80 border border-slate-800 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 text-slate-100 text-sm font-medium transition duration-300 outline-none placeholder:text-slate-600"
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-xs text-red-400 font-medium">{errors.email.message}</p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Master Password
              </label>
              <a href="#" className="text-xs font-semibold text-slate-500 hover:text-slate-300 transition">Forgot?</a>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                id="password"
                type="password"
                placeholder="••••••••••••"
                {...register('password')}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900/80 border border-slate-800 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 text-slate-100 text-sm font-medium transition duration-300 outline-none placeholder:text-slate-600"
              />
            </div>
            {errors.password && (
              <p className="mt-2 text-xs text-red-400 font-medium">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold text-sm shadow-xl shadow-blue-500/20 border border-blue-500/30 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {mutation.isPending ? (
              <>
                <svg className="animate-spin h-4.5 w-4.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Decrypting Vault...
              </>
            ) : (
              'Sign In & Decrypt'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
