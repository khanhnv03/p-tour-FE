import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getMe } from '../api/auth';
import { ACCESS_TOKEN_KEY } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function OAuth2Callback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth, logout } = useAuth();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error || !token) {
      navigate('/login?error=' + encodeURIComponent(error || 'OAuth2 thất bại'), { replace: true });
      return;
    }

    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    getMe()
      .then((user) => {
        setAuth(token, user);
        navigate(user.role === 'ADMIN' ? '/admin' : '/', { replace: true });
      })
      .catch(() => {
        logout();
        navigate('/login', { replace: true });
      });
  }, [searchParams, navigate, setAuth, logout]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-on-surface-variant text-sm font-medium">Đang xử lý đăng nhập...</p>
      </div>
    </div>
  );
}
