import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BRAND_NAME } from '../constants';
import { register } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setIsLoading(true);
    try {
      const res = await register({ email, password, fullName, phone: phone || undefined });
      setAuth(res.accessToken, {
        id: res.userId,
        email: res.email,
        fullName: res.fullName,
        role: res.role,
      });
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Đăng ký thất bại, vui lòng thử lại';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-background text-on-surface selection:bg-primary-fixed">
      {/* Left Section */}
      <section className="relative w-full md:w-1/2 lg:w-[60%] h-64 md:h-screen overflow-hidden group">
        <img
          alt="Beautiful travel destination"
          className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuChfYb3OSkWjrNPLLUp5yi3uIhQzAMuUQPq873C7rRNIuHDJ9KMhc67ZUqxo6XfTIjLjRrB7H37-W17EcqVqx6PGYMDYiNBwrmmjy2gHT4sJg4fHaRKfUu5pWn2y4bgVN3606TKvgcQROElpxW3DRA4C_5wPYLRfzR_MUXsfwjudzg5T6s5I8O1ZDxHkqEklV1RV5HZ9a4NnxBs5-e6BasvR6IBLXYsgoIXN1vFU3qcdJJ0hMsn55juUIAsQBW29xECrie13qgsad8"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-on-surface/60 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-surface" />
        <div className="absolute bottom-8 left-8 right-8 md:bottom-16 md:left-16 z-10">
          <div className="glass-panel inline-block px-6 py-3 rounded-xl mb-6 shadow-2xl">
            <span className="text-primary font-black tracking-tighter text-2xl">{BRAND_NAME}</span>
          </div>
          <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tighter max-w-xl">
            Bắt đầu hành trình của bạn.
          </h1>
          <p className="text-white/90 text-lg md:text-xl font-medium mt-4 max-w-md hidden md:block">
            Tạo tài khoản để lưu hành trình yêu thích và đặt tour dễ dàng hơn.
          </p>
        </div>
      </section>

      {/* Right Section: Register Form */}
      <section className="w-full md:w-1/2 lg:w-[40%] bg-surface flex items-center justify-center p-6 md:p-12 lg:p-20">
        <div className="w-full max-w-md space-y-8">
          <header className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-on-surface">Tạo tài khoản</h2>
            <p className="text-on-surface-variant text-lg">Điền thông tin để bắt đầu hành trình.</p>
          </header>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm font-medium">
              <span className="material-symbols-outlined text-base">error</span>
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="group">
              <label className="block text-sm font-bold text-on-surface-variant mb-2 ml-1" htmlFor="fullName">
                Họ và tên
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">person</span>
                <input
                  className="w-full pl-12 pr-4 py-4 bg-surface-container-highest border-none rounded-xl text-on-surface placeholder:text-outline/60 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none"
                  id="fullName"
                  placeholder="Nguyễn Văn A"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email */}
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

            {/* Phone */}
            <div className="group">
              <label className="block text-sm font-bold text-on-surface-variant mb-2 ml-1" htmlFor="phone">
                Số điện thoại <span className="text-outline font-normal">(không bắt buộc)</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">phone</span>
                <input
                  className="w-full pl-12 pr-4 py-4 bg-surface-container-highest border-none rounded-xl text-on-surface placeholder:text-outline/60 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none"
                  id="phone"
                  placeholder="0901 234 567"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                />
              </div>
            </div>

            {/* Password */}
            <div className="group">
              <label className="block text-sm font-bold text-on-surface-variant mb-2 ml-1" htmlFor="password">
                Mật khẩu
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">lock</span>
                <input
                  className="w-full pl-12 pr-12 py-4 bg-surface-container-highest border-none rounded-xl text-on-surface placeholder:text-outline/60 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none"
                  id="password"
                  placeholder="Ít nhất 6 ký tự"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
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

            {/* Confirm Password */}
            <div className="group">
              <label className="block text-sm font-bold text-on-surface-variant mb-2 ml-1" htmlFor="confirmPassword">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">lock_reset</span>
                <input
                  className="w-full pl-12 pr-4 py-4 bg-surface-container-highest border-none rounded-xl text-on-surface placeholder:text-outline/60 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none"
                  id="confirmPassword"
                  placeholder="Nhập lại mật khẩu"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button
              className="w-full signature-gradient text-on-primary font-bold py-4 rounded-xl shadow-xl hover:shadow-primary/20 active:scale-[0.98] transition-all text-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang tạo tài khoản...
                </>
              ) : (
                'Tạo Tài Khoản'
              )}
            </button>
          </form>

          <footer className="text-center pt-2">
            <p className="text-on-surface-variant font-medium">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-secondary font-bold hover:underline decoration-2 underline-offset-4">
                Đăng nhập ngay
              </Link>
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
}
