import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BRAND_NAME, BRAND_LOGO } from '../constants';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import NotificationBell from './NotificationBell';

const NAV_LINKS = [
  { label: 'Điểm đến', to: '/',        match: (p: string) => p === '/' },
  { label: 'Tour',     to: '/tours',   match: (p: string) => p.startsWith('/tours') },
  { label: 'Ưu đãi',  to: '/deals',   match: (p: string) => p.startsWith('/deals') },
  { label: 'Nhật ký', to: '/journal', match: (p: string) => p.startsWith('/journal') },
];

const FALLBACK_AVATAR = 'https://picsum.photos/seed/user/200/200';

function getDisplayName(raw: string): string {
  const idx = raw.indexOf(' - ');
  return idx >= 0 ? raw.slice(idx + 3).trim() : raw.trim();
}

export default function UserNavbar() {
  const { pathname } = useLocation();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const dispName = getDisplayName(user?.fullName || user?.email || '');
  const avatarSrc = user?.avatarUrl || FALLBACK_AVATAR;
  const roleLabel = isAdmin ? 'Quản trị viên' : 'Hạng thám hiểm';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl transition-all duration-300 ${
        scrolled
          ? 'shadow-[0_8px_32px_0_rgba(25,28,29,0.12)]'
          : 'shadow-[0_2px_8px_0_rgba(25,28,29,0.04)]'
      }`}
    >
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto font-medium tracking-tight">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={BRAND_LOGO}
            alt="PTIT Logo"
            className="h-10 w-auto transition-transform duration-300 group-hover:scale-110"
          />
          <span className="text-xl font-black tracking-tighter text-blue-900 transition-opacity duration-200 group-hover:opacity-75">
            {BRAND_NAME}
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center space-x-8">
          {NAV_LINKS.map(({ label, to, match }) => {
            const active = match(pathname);
            return (
              <Link
                key={to}
                to={to}
                className={`relative py-1 group transition-colors duration-200 ${
                  active
                    ? 'text-blue-700 font-bold'
                    : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                {label}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 rounded-full transition-all duration-300 ${
                    active ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* Auth section */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
              {/* Notification bell */}
              <NotificationBell />

              {/* Avatar + name + dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-3 pl-4 border-l border-slate-200 focus:outline-none group"
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {dispName}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">{roleLabel}</p>
                  </div>
                  <img
                    alt={dispName}
                    src={avatarSrc}
                    referrerPolicy="no-referrer"
                    className={`w-10 h-10 rounded-full object-cover shadow-sm border-2 transition-colors ${
                      isDropdownOpen
                        ? 'border-primary'
                        : 'border-transparent group-hover:border-primary/50'
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-[0_8px_32px_0_rgba(25,28,29,0.12)] border border-slate-100 py-2 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 sm:hidden">
                        <p className="text-sm font-bold text-slate-900">{dispName}</p>
                        <p className="text-xs text-slate-500 font-medium">{roleLabel}</p>
                      </div>

                      <div className="py-2">
                        {isAdmin ? (
                          <>
                            <Link
                              onClick={() => setIsDropdownOpen(false)}
                              to="/admin"
                              className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
                              Bảng điều khiển
                            </Link>
                          </>
                        ) : (
                          <>
                            <Link
                              onClick={() => setIsDropdownOpen(false)}
                              to="/my-bookings"
                              className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>travel_explore</span>
                              Chuyến đi của tôi
                            </Link>
                          </>
                        )}
                      </div>

                      <div className="border-t border-slate-100 pt-2">
                        <button
                          onClick={() => { setIsDropdownOpen(false); logout(); }}
                          className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-error hover:bg-red-50 transition-colors w-full text-left"
                        >
                          <span className="material-symbols-outlined text-lg">logout</span>
                          Đăng xuất
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-slate-600 px-4 py-2 text-sm font-semibold rounded-lg hover:bg-slate-100/60 active:scale-95 transition-all duration-200"
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
