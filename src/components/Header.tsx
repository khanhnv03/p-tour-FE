import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl px-8 py-4 flex justify-between items-center shadow-[0_8px_32px_0_rgba(25,28,29,0.06)]">
      <div className="flex items-center bg-surface-container-highest rounded-full px-4 py-2 w-96">
        <span className="material-symbols-outlined text-outline">search</span>
        <input className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-outline ml-2 outline-none" placeholder="Tìm kiếm tour, đặt chỗ, hoặc người dùng..." type="text"/>
      </div>
      <div className="flex items-center space-x-6">
        <button className="relative p-2 text-on-surface-variant hover:bg-slate-100 rounded-full transition-colors focus:outline-none">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-white"></span>
        </button>
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-3 pl-4 border-l border-outline-variant/30 focus:outline-none group"
          >
            <div className="text-right">
              <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">Alex PTIT</p>
              <p className="text-xs text-on-surface-variant">Hạng thám hiểm</p>
            </div>
            <img 
              alt="Admin Profile" 
              className={`w-10 h-10 rounded-full object-cover shadow-sm bg-white border-2 transition-colors ${isDropdownOpen ? 'border-primary' : 'border-transparent group-hover:border-primary/50'}`} 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiI6pepAocxGpTukq4VCdFYIO1Izt9JVpqK7kx2I9yfIwoc9qXnsR1BhkTdak_olkQWIu3P6SPxEcvq-WSAU1P3IShab3HSZrzGk0E5_zRzl-xN9oNXmg2gmbJcS_lA96uOl5xTWy4fjMx1Cvfs-FhepZJUzY6F-xyN2yUnvYM9eXhcHg7CqObezH1BHpyj4EF_oafma8ZLFwOIsoM3jT1AbMQ4yPkWi3T9_J2GXrL4IrOTm9UWVz1pZWX8y7NFAMkSBc-QFMkCK8"
              referrerPolicy="no-referrer"
            />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-56 bg-surface-container-lowest rounded-2xl shadow-[0_8px_32px_0_rgba(25,28,29,0.12)] border border-outline-variant/20 py-2 z-50 overflow-hidden"
              >
                <div className="py-2">
                  <Link onClick={() => setIsDropdownOpen(false)} to="/admin/settings?tab=profile" className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors">
                    <span className="material-symbols-outlined text-lg">person</span>
                    Hồ sơ cá nhân
                  </Link>
                  <Link onClick={() => setIsDropdownOpen(false)} to="/admin/settings?tab=auth" className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors">
                    <span className="material-symbols-outlined text-lg">password</span>
                    Đổi mật khẩu
                  </Link>
                  <Link onClick={() => setIsDropdownOpen(false)} to="/admin/settings?tab=notifications" className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors">
                    <span className="material-symbols-outlined text-lg">notifications</span>
                    Thông báo
                  </Link>
                </div>
                
                <div className="border-t border-outline-variant/20 pt-2">
                  <Link onClick={() => setIsDropdownOpen(false)} to="/" className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-error hover:bg-error/10 transition-colors">
                    <span className="material-symbols-outlined text-lg">logout</span>
                    Đăng xuất
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
