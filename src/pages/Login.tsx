import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Leaf, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register: registerUser } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(
    (location.state as { mode?: string })?.mode === 'register' ? 'register' : 'login'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /* ── Login form ── */
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onLogin = async (data: LoginFormData) => {
    const ok = await login(data.email, data.password);
    if (ok) {
      toast.success('Welcome back! 🌸');
      const u = JSON.parse(localStorage.getItem('vlo_user') || '{}');
      navigate(u?.role === 'ADMIN' ? '/admin' : '/');
    } else {
      toast.error('Invalid email or password');
    }
  };

  /* ── Register form ── */
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onRegister = async (data: RegisterFormData) => {
    const result = await registerUser(data.email, data.password, data.name);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Account created! Please check your email to confirm.', { duration: 6000, icon: '📬' });
      setMode('login');
      registerForm.reset();
    }
  };

  const switchMode = (m: 'login' | 'register') => {
    setMode(m);
    setShowPassword(false);
    setShowConfirm(false);
  };

  return (
    <div className="min-h-screen bg-[#0C0A0E] flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(244,63,110,0.1),transparent_70%)]" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 justify-center group">
            <div className="w-12 h-12 bg-rose-500/20 rounded-full flex items-center justify-center">
              <Leaf className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <span className="block font-display text-2xl font-semibold text-white">Vee Locs</span>
              <span className="block text-[9px] text-amber-500 tracking-[0.25em] -mt-0.5">ORGANIC</span>
            </div>
          </Link>
          <h1 className="font-display text-3xl font-light text-white mt-6 mb-1">
            {mode === 'login' ? 'Welcome back' : 'Join Vee Locs'}
          </h1>
          <p className="text-gray-500 text-sm">
            {mode === 'login' ? 'Sign in to your account' : 'Create your account for free'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => switchMode('login')}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                mode === 'login'
                  ? 'text-gray-900 border-b-2 border-gray-900 -mb-px'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => switchMode('register')}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                mode === 'register'
                  ? 'text-rose-600 border-b-2 border-rose-500 -mb-px'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {/* ── SIGN IN ── */}
            {mode === 'login' && (
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input {...loginForm.register('email')} type="email" placeholder="your@email.com"
                      className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-100 text-sm" />
                  </div>
                  {loginForm.formState.errors.email && (
                    <p className="text-red-400 text-xs mt-1">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input {...loginForm.register('password')} type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                      className="w-full pl-11 pr-11 py-3.5 border border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-100 text-sm" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-red-400 text-xs mt-1">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>

                <button type="submit" disabled={loginForm.formState.isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-rose-600 text-white font-bold py-4 rounded-xl transition-all text-sm tracking-wide disabled:opacity-50">
                  {loginForm.formState.isSubmitting ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
                  ) : 'Sign In'}
                </button>

                <p className="text-center text-xs text-gray-400 pt-1">
                  Don't have an account?{' '}
                  <button type="button" onClick={() => switchMode('register')} className="text-rose-500 font-semibold hover:text-rose-700">
                    Create one free
                  </button>
                </p>
              </form>
            )}

            {/* ── CREATE ACCOUNT ── */}
            {mode === 'register' && (
              <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input {...registerForm.register('name')} type="text" placeholder="Aminata Koné"
                      className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 text-sm" />
                  </div>
                  {registerForm.formState.errors.name && (
                    <p className="text-red-400 text-xs mt-1">{registerForm.formState.errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input {...registerForm.register('email')} type="email" placeholder="your@email.com"
                      className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 text-sm" />
                  </div>
                  {registerForm.formState.errors.email && (
                    <p className="text-red-400 text-xs mt-1">{registerForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input {...registerForm.register('password')} type={showPassword ? 'text' : 'password'} placeholder="Min. 6 characters"
                      className="w-full pl-11 pr-11 py-3.5 border border-gray-200 rounded-xl focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 text-sm" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {registerForm.formState.errors.password && (
                    <p className="text-red-400 text-xs mt-1">{registerForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input {...registerForm.register('confirmPassword')} type={showConfirm ? 'text' : 'password'} placeholder="Repeat your password"
                      className="w-full pl-11 pr-11 py-3.5 border border-gray-200 rounded-xl focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 text-sm" />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {registerForm.formState.errors.confirmPassword && (
                    <p className="text-red-400 text-xs mt-1">{registerForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                <button type="submit" disabled={registerForm.formState.isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-xl transition-all text-sm tracking-wide disabled:opacity-50 mt-2">
                  {registerForm.formState.isSubmitting ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</>
                  ) : 'Create My Account'}
                </button>

                <p className="text-center text-xs text-gray-400 pt-1">
                  Already have an account?{' '}
                  <button type="button" onClick={() => switchMode('login')} className="text-gray-700 font-semibold hover:text-gray-900">
                    Sign in
                  </button>
                </p>

                <p className="text-center text-[11px] text-gray-300 leading-relaxed">
                  By creating an account you agree to our{' '}
                  <span className="text-gray-500">Terms of Service</span> and{' '}
                  <span className="text-gray-500">Privacy Policy</span>.
                </p>
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          <Link to="/" className="hover:text-white transition-colors">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
