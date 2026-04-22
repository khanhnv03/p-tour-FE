import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { BRAND_NAME, BRAND_LOGO } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

export default function UserLayout() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Thêm logic để click ra ngoài thì đóng dropdown
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
    <div className="bg-background text-on-background min-h-screen flex flex-col font-sans">
      {/* TopNavBar */}
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl docked full-width top-0 sticky z-50 shadow-[0_8px_32px_0_rgba(25,28,29,0.06)]">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto font-medium tracking-tight">
          <Link to="/" className="flex items-center gap-3">
            <img src={BRAND_LOGO} alt="PTIT Logo" className="h-10 w-auto" />
            <div className="text-xl font-black tracking-tighter text-blue-900 dark:text-blue-50">
              {BRAND_NAME}
            </div>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/">Điểm đến</Link>
            <Link className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/tours">Tour</Link>
            <Link className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/deals">Ưu đãi</Link>
            <Link className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/journal">Nhật ký</Link>
          </div>
          
          {/* User Section */}
          <div className="flex items-center space-x-6 relative" ref={dropdownRef}>
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors focus:outline-none">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-white"></span>
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                className="flex items-center space-x-3 pl-4 border-l border-slate-200 focus:outline-none group"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Alex PTIT</p>
                  <p className="text-xs text-slate-500 font-medium">Hạng thám hiểm</p>
                </div>
                <img 
                  alt="Tài khoản" 
                  className={`w-10 h-10 rounded-full object-cover shadow-sm border-2 transition-colors ${isDropdownOpen ? 'border-primary' : 'border-transparent group-hover:border-primary/50'}`} 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuWdojTWLkOZJO7QnZk1Wu_ZBDHhV69mkUS6E1dOq1thfZ2NUGn0cSdWeZ1FuvzSn72heapjOVtZayQZJBBvU4ZfphklLyJCbiZr52vPnEylMd1LVco5vhVXoG9dHED-jLAVTUoKFq-KiV-X05kV55feDmDV_6kBrXStV8VHtrvmnGAinvdD93a7x864zUNI0kOz00y-Z4KfdaqBl4vaFUmcotTZAopEvZ2xXBBbmJalX3FAmhye-kD0t4FHeAWyYs6as61ZOXwas" 
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
                    className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-[0_8px_32px_0_rgba(25,28,29,0.12)] border border-slate-100 py-2 z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 sm:hidden">
                      <p className="text-sm font-bold text-slate-900">Alex PTIT</p>
                      <p className="text-xs text-slate-500 font-medium">Hạng thám hiểm</p>
                    </div>
                    
                    <div className="py-2">
                      <Link onClick={() => setIsDropdownOpen(false)} to="/my-bookings" className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>travel_explore</span>
                        Chuyến đi của tôi
                      </Link>
                      <Link onClick={() => setIsDropdownOpen(false)} to="/profile" className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <span className="material-symbols-outlined text-lg">person</span>
                        Hồ sơ cá nhân
                      </Link>
                      <Link onClick={() => setIsDropdownOpen(false)} to="/wishlist" className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <span className="material-symbols-outlined text-lg">favorite</span>
                        Danh sách yêu thích
                      </Link>
                      <Link onClick={() => setIsDropdownOpen(false)} to="/checkout" className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <span className="material-symbols-outlined text-lg">payments</span>
                        Thanh toán
                      </Link>
                    </div>
                    
                    <div className="border-t border-slate-100 pt-2">
                      <Link onClick={() => setIsDropdownOpen(false)} to="/" className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-error hover:bg-red-50 transition-colors">
                        <span className="material-symbols-outlined text-lg">logout</span>
                        Đăng xuất
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto w-full px-8 py-10 flex flex-col lg:flex-row gap-12 flex-grow">
        {/* SideNavBar */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 self-start sticky top-[100px] space-y-6">
          <div className="bg-surface-container-lowest rounded-3xl p-6 border border-surface-container-low shadow-[0_8px_32px_0_rgba(25,28,29,0.04)] text-center relative overflow-hidden group">
            <div className="absolute inset-0 signature-gradient opacity-10 group-hover:opacity-20 transition-opacity"></div>
            <div className="w-20 h-20 mx-auto rounded-full overflow-hidden shadow-md border-4 border-white mb-4 relative z-10 bg-white">
              <img alt="Alex PTIT" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuWdojTWLkOZJO7QnZk1Wu_ZBDHhV69mkUS6E1dOq1thfZ2NUGn0cSdWeZ1FuvzSn72heapjOVtZayQZJBBvU4ZfphklLyJCbiZr52vPnEylMd1LVco5vhVXoG9dHED-jLAVTUoKFq-KiV-X05kV55feDmDV_6kBrXStV8VHtrvmnGAinvdD93a7x864zUNI0kOz00y-Z4KfdaqBl4vaFUmcotTZAopEvZ2xXBBbmJalX3FAmhye-kD0t4FHeAWyYs6as61ZOXwas"/>
            </div>
            <div className="relative z-10">
              <h3 className="text-blue-900 dark:text-blue-50 font-black text-lg truncate">Alex PTIT</h3>
              <p className="text-secondary text-[10px] font-black uppercase tracking-[0.2em] mt-1">Explorer Tier</p>
            </div>
          </div>
          
          <nav className="flex-1 space-y-2">
            {[
              { to: '/my-bookings', icon: 'travel_explore', label: 'Chuyến đi của tôi', fill: true },
              { to: '/profile', icon: 'person', label: 'Hồ sơ cá nhân', fill: false },
              { to: '/wishlist', icon: 'favorite', label: 'Danh sách yêu thích', fill: false },
              { to: '/checkout', icon: 'payments', label: 'Thanh toán', fill: false },
            ].map(({ to, icon, label, fill }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/my-bookings'}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-5 py-3.5 font-bold text-sm transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-surface-container-low'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: (fill || isActive) ? "'FILL' 1" : "'FILL' 0" }}>{icon}</span>
                    {label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="space-y-3 pt-4 border-t border-surface-container-low">
            <Link to="/tours" className="block w-full text-center signature-gradient text-white rounded-xl py-3.5 shadow-md shadow-primary/20 active:scale-95 transition-all font-bold text-xs uppercase tracking-widest">
              Đặt chuyến đi mới
            </Link>
            <div className="flex justify-between items-center px-2">
              <Link className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-bold text-xs" to="/contact">
                <span className="material-symbols-outlined text-sm">help</span>
                Trợ giúp
              </Link>
              <Link to="/login" className="flex items-center gap-2 text-error hover:opacity-80 transition-colors font-bold text-xs">
                <span className="material-symbols-outlined text-sm">logout</span>
                Đăng xuất
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content Canvas */}
        <main className="flex-1 w-full relative min-h-[calc(100vh-140px)] flex flex-col bg-surface-container-lowest rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(25,28,29,0.04)] border border-surface-container-low/50 overflow-hidden">
          <Outlet />
        </main>
      </div>

      {/* Footer (Shared Component) */}
      <footer className="bg-slate-50 dark:bg-slate-950 w-full mt-auto text-sm leading-relaxed border-t border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-8 py-16 max-w-7xl mx-auto">
              <div className="col-span-1 md:col-span-1">
                <div className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-6">{BRAND_NAME}</div>
                <p className="text-slate-500 dark:text-slate-400 max-w-xs">Kiến tạo những trải nghiệm vượt xa tầm thường. Mỗi hành trình đều được tuyển chọn, mỗi khoảnh khắc là của riêng bạn.</p>
              </div>
              <div>
                <h4 className="font-black text-blue-900 dark:text-blue-100 mb-6 uppercase tracking-widest text-xs">Khám phá</h4>
                <ul className="space-y-3">
                  <li><Link className="text-slate-500 hover:text-blue-600 transition-colors" to="/">Điểm đến hành trình</Link></li>
                  <li><Link className="text-slate-500 hover:text-blue-600 transition-colors" to="/tours">Tour độc bản</Link></li>
                  <li><Link className="text-slate-500 hover:text-blue-600 transition-colors" to="/deals">Ưu đãi phút chót</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-black text-blue-900 dark:text-blue-100 mb-6 uppercase tracking-widest text-xs">Hỗ trợ</h4>
                <ul className="space-y-3">
                  <li><a className="text-slate-500 hover:text-blue-600 transition-colors" href="#">Trung tâm trợ giúp</a></li>
                  <li><a className="text-slate-500 hover:text-blue-600 transition-colors" href="#">Điều khoản dịch vụ</a></li>
                  <li><a className="text-slate-500 hover:text-blue-600 transition-colors" href="#">Chính sách bảo mật</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-black text-blue-900 dark:text-blue-100 mb-6 uppercase tracking-widest text-xs">Kết nối</h4>
                <div className="flex space-x-4">
                  <a className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-900 shadow-sm hover:shadow-md transition-shadow" href="#">
                    <span className="material-symbols-outlined text-lg">share</span>
                  </a>
                  <a className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-900 shadow-sm hover:shadow-md transition-shadow" href="#">
                    <span className="material-symbols-outlined text-lg">alternate_email</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-8 py-8 border-t border-slate-200 text-center md:text-left text-slate-400 text-xs">
                         © 2026 {BRAND_NAME}. Vượt ra ngoài giới hạn.
            </div>
      </footer>
    </div>
  );
}
