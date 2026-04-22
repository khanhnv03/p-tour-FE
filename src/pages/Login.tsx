import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BRAND_NAME } from '../constants';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const from = (location.state as { from?: string })?.from || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await login({ email, password });
      setAuth(res.accessToken, {
        id: res.userId,
        email: res.email,
        fullName: res.fullName,
        role: res.role,
      });
      navigate(res.role === 'ADMIN' ? '/admin' : from, { replace: true });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Email hoặc mật khẩu không đúng';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth2 = (provider: 'google' | 'facebook') => {
    window.location.href = `${API_URL}/oauth2/authorization/${provider}`;
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-background text-on-surface selection:bg-primary-fixed">
      {/* Left Section: Immersive Visual */}
      <section className="relative w-full md:w-1/2 lg:w-[60%] h-64 md:h-screen overflow-hidden group">
        <img
          alt="Majestic mountain landscape"
          className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuChfYb3OSkWjrNPLLUp5yi3uIhQzAMuUQPq873C7rRNIuHDJ9KMhc67ZUqxo6XfTIjLjRrB7H37-W17EcqVqx6PGYMDYiNBwrmmjy2gHT4sJg4fHaRKfUu5pWn2y4bgVN3606TKvgcQROElpxW3DRA4C_5wPYLRfzR_MUXsfwjudzg5T6s5I8O1ZDxHkqEklV1RV5HZ9a4NnxBs5-e6BasvR6IBLXYsgoIXN1vFU3qcdJJ0hMsn55juUIAsQBW29xECrie13qgsad8"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-on-surface/60 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-surface" />
        <div className="absolute bottom-8 left-8 right-8 md:bottom-16 md:left-16 z-10">
          <div className="glass-panel inline-block px-6 py-3 rounded-xl mb-6 shadow-2xl">
            <span className="text-primary font-black tracking-tighter text-2xl">{BRAND_NAME}</span>
          </div>
          <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tighter max-w-xl">
            Hành trình của bạn bắt đầu từ đây.
          </h1>
          <p className="text-white/90 text-lg md:text-xl font-medium mt-4 max-w-md hidden md:block">
            Khám phá những điểm đến độc bản và kiến tạo kỉ niệm vô giá cùng chuyên gia của chúng tôi.
          </p>
        </div>
      </section>

      {/* Right Section: Auth Form */}
      <section className="w-full md:w-1/2 lg:w-[40%] bg-surface flex items-center justify-center p-6 md:p-12 lg:p-20">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <header className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-on-surface">Chào mừng trở lại</h2>
            <p className="text-on-surface-variant text-lg">Đăng nhập để tiếp tục hành trình của bạn.</p>
          </header>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleOAuth2('google')}
              className="flex items-center justify-center gap-3 px-4 py-3.5 bg-surface-container-low hover:bg-surface-container transition-colors rounded-xl font-semibold text-sm text-on-surface group"
              type="button"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>
            <button
              onClick={() => handleOAuth2('facebook')}
              className="flex items-center justify-center gap-3 px-4 py-3.5 bg-surface-container-low hover:bg-surface-container transition-colors rounded-xl font-semibold text-sm text-on-surface group"
              type="button"
            >
              <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
          </div>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-outline-variant/30" />
            <span className="flex-shrink mx-4 text-outline text-xs font-bold tracking-widest uppercase">Hoặc đăng nhập với Email</span>
            <div className="flex-grow border-t border-outline-variant/30" />
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm font-medium">
              <span className="material-symbols-outlined text-base">error</span>
              {error}
            </div>
          )}

          {/* Main Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="group">
                <label className="block text-sm font-bold text-on-surface-variant mb-2 ml-1" htmlFor="email">
                  Địa chỉ Email
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">mail</span>
                  <input
                    className="w-full pl-12 pr-4 py-4 bg-surface-container-highest border-none rounded-xl text-on-surface placeholder:text-outline/60 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none"
                    id="email"
                    placeholder="email@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="group">
                <div className="flex justify-between items-center mb-2 ml-1">
                  <label className="block text-sm font-bold text-on-surface-variant" htmlFor="password">
                    Mật khẩu
                  </label>
                  <Link to="/forgot-password" className="text-xs font-bold text-primary hover:text-primary-container transition-colors">
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">lock</span>
                  <input
                    className="w-full pl-12 pr-12 py-4 bg-surface-container-highest border-none rounded-xl text-on-surface placeholder:text-outline/60 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none"
                    id="password"
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <button
              className="w-full signature-gradient text-on-primary font-bold py-4 rounded-xl shadow-xl hover:shadow-primary/20 active:scale-[0.98] transition-all text-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng Nhập Ngay'
              )}
            </button>
          </form>

          {/* Footer Link */}
          <footer className="text-center pt-2">
            <p className="text-on-surface-variant font-medium">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="text-secondary font-bold hover:underline decoration-2 underline-offset-4">
                Tạo tài khoản mới
              </Link>
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
}
