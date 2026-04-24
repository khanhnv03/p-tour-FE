import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BRAND_NAME, BRAND_LOGO } from '../constants';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { label: 'Điểm đến', to: '/',        match: (p: string) => p === '/' },
  { label: 'Tour',     to: '/tours',   match: (p: string) => p.startsWith('/tours') },
  { label: 'Ưu đãi',  to: '/deals',   match: (p: string) => p.startsWith('/deals') },
  { label: 'Nhật ký', to: '/journal', match: (p: string) => p.startsWith('/journal') },
];

/** "B21DCCN449 - Nguyễn Văn Khanh" → "Nguyễn Văn Khanh"; không có " - " thì giữ nguyên */
function getDisplayName(raw: string): string {
  const idx = raw.indexOf(' - ');
  return idx >= 0 ? raw.slice(idx + 3).trim() : raw.trim();
}

export default function UserNavbar() {
  const { pathname } = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  const dispName = getDisplayName(user?.fullName || user?.email || '');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl transition-all duration-300 ${
        scrolled
          ? 'shadow-[0_8px_32px_0_rgba(25,28,29,0.12)]'
          : 'shadow-[0_2px_8px_0_rgba(25,28,29,0.04)]'
      }`}
    >
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={BRAND_LOGO}
            alt="PTIT Logo"
            className="h-10 w-auto transition-transform duration-300 group-hover:scale-110"
          />
          <span className="text-xl font-black tracking-tighter text-blue-900 dark:text-blue-50 transition-opacity duration-200 group-hover:opacity-75">
            {BRAND_NAME}
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center space-x-8 font-medium tracking-tight">
          {NAV_LINKS.map(({ label, to, match }) => {
            const active = match(pathname);
            return (
              <Link
                key={to}
                to={to}
                className={`relative py-1 group transition-colors duration-200 ${
                  active
                    ? 'text-blue-700 dark:text-blue-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300'
                }`}
              >
                {label}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full transition-all duration-300 ${
                    active ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* Auth section */}
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <>
              <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold hidden sm:inline">
                {dispName}
              </span>
              <button
                onClick={logout}
                className="text-slate-600 dark:text-slate-400 px-4 py-2 text-sm font-semibold rounded-lg hover:bg-slate-100/60 dark:hover:bg-slate-800/60 active:scale-95 transition-all duration-200"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-slate-600 dark:text-slate-400 px-4 py-2 text-sm font-semibold rounded-lg hover:bg-slate-100/60 dark:hover:bg-slate-800/60 active:scale-95 transition-all duration-200"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="primary-gradient text-white px-6 py-2 rounded-xl text-sm font-bold shadow-md hover:shadow-lg hover:scale-[1.04] active:scale-95 transition-all duration-200"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
