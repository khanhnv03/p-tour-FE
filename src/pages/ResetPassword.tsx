import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { BRAND_LOGO } from '../constants';
import { resetPassword } from '../api/auth';
import { extractApiErrorMessage } from '../api/types';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') ?? '';

  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (newPassword !== confirm) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    if (!token) {
      setError('Token không hợp lệ. Vui lòng yêu cầu lại.');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, newPassword);
      navigate('/login?reset=success', { replace: true });
    } catch (err: unknown) {
      setError(extractApiErrorMessage(err, 'Token không hợp lệ hoặc đã hết hạn.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center mb-6 group">
          <img src={BRAND_LOGO} alt="Logo" className="h-16 w-auto group-hover:scale-105 transition-transform duration-300" />
        </Link>
        <h2 className="mt-6 text-center text-3xl font-black tracking-tight text-on-surface leading-tight">Đặt lại<br/>mật khẩu</h2>
        <p className="mt-4 text-center text-sm font-medium text-on-surface-variant">
          Nhập mật khẩu mới cho tài khoản của bạn.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface-container-lowest py-10 px-6 shadow-[0_16px_48px_0_rgba(25,28,29,0.08)] border border-surface-container-low/50 rounded-[2.5rem] sm:px-10 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

          <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
            {error && <p className="text-sm text-error font-medium text-center">{error}</p>}

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2">MẬT KHẨU MỚI</label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="block w-full rounded-xl bg-surface-container-low border-none px-4 py-4 text-on-surface font-bold placeholder-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-inner transition-all"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2">XÁC NHẬN MẬT KHẨU</label>
              <input
                type="password"
                required
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                className="block w-full rounded-xl bg-surface-container-low border-none px-4 py-4 text-on-surface font-bold placeholder-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-inner transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-xl signature-gradient px-4 py-4 text-sm font-bold text-white shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all active:scale-95 leading-none items-center gap-2 disabled:opacity-60"
            >
              {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
              <span className="material-symbols-outlined text-[18px]">lock_reset</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
