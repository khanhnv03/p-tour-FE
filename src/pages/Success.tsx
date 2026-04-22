import { Link } from 'react-router-dom';
import { BRAND_NAME, BRAND_LOGO } from '../constants';

export default function Success() {
  return (
    <div className="bg-surface text-on-surface font-sans selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col">
      {/* TopNavBar */}
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl docked full-width top-0 sticky z-50 shadow-[0_8px_32px_0_rgba(25,28,29,0.06)] border-b border-surface-container-low/30">
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
          <div className="flex items-center space-x-4 px-2 py-1 bg-surface-container-high rounded-full">
            <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-on-primary">VH</span>
            <span className="text-xs font-bold text-on-surface pr-2">Vân Khánh</span>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex items-center justify-center py-20 px-8">
        <section className="max-w-3xl w-full text-center">
          <div className="relative mb-12 inline-block">
            {/* Abstract Background for Icon */}
            <div className="absolute inset-0 signature-gradient rounded-[2.5rem] rotate-12 opacity-20 blur-2xl animate-pulse"></div>
            <div className="relative bg-white dark:bg-slate-900 w-32 h-32 rounded-[2rem] shadow-2xl flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-6xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            </div>
            
            {/* Confetti-like floating icons */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center animate-bounce delay-100">
              <span className="material-symbols-outlined text-secondary text-sm">celebration</span>
            </div>
            <div className="absolute -bottom-2 -left-6 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center animate-bounce">
              <span className="material-symbols-outlined text-primary text-base">explore</span>
            </div>
          </div>

          <span className="text-secondary font-bold tracking-[0.3em] text-xs uppercase mb-4 block">Thám hiểm đã Xác nhận</span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-blue-900 dark:text-blue-50 mb-8 leading-[0.9]">
            Chân trời đang <br className="hidden md:block" />
            chờ đợi <span className="text-primary italic">bạn.</span>
          </h1>
          
          <div className="bg-surface-container-lowest p-8 md:p-12 rounded-[2.5rem] shadow-[0_8px_48px_rgba(25,28,29,0.08)] mb-12 border border-surface-container/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Mã số Đặt chỗ</h3>
                <div className="space-y-1">
                  <p className="text-xl font-bold text-on-surface">Đơn hàng #HZ-2024-881</p>
                  <p className="text-sm text-on-surface-variant leading-relaxed">Hồ sơ xác nhận đã được gửi đến địa chỉ email của bạn.</p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Hành trình của bạn</h3>
                <div className="space-y-1">
                  <p className="text-xl font-bold text-on-surface">Du thuyền Giấc mơ Amalfi</p>
                  <p className="text-sm text-on-surface-variant">Khởi hành: 12 Thg 10, 2024</p>
                </div>
              </div>
            </div>
            
            <div className="mt-10 pt-10 border-t border-surface-container flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-primary/20">
                  <img src="https://picsum.photos/seed/curator/100/100" alt="Curator" className="w-full h-full object-cover" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-on-surface">Elena Vance</p>
                  <p className="text-xs text-on-surface-variant tracking-tight">Chuyên gia dẫn đoàn của bạn</p>
                </div>
              </div>
              <Link to="/contact" className="text-primary font-bold text-sm flex items-center gap-2 group">
                Kết nối với Elena
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">chat_bubble_outline</span>
              </Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link to="/bookings" className="w-full md:w-auto signature-gradient text-white px-10 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all scale-100 active:scale-95">
              Quản lý Hành trình
            </Link>
            <Link to="/" className="w-full md:w-auto bg-surface-container-high hover:bg-surface-dim text-on-surface px-10 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border-0 outline-none">
              <span className="material-symbols-outlined text-lg">home</span>
              Về Trang chủ
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-surface-container text-center">
        <p className="text-slate-400 text-xs font-medium uppercase tracking-[0.2em]">© 2026 {BRAND_NAME}. Vượt ra ngoài giới hạn.</p>
      </footer>
    </div>
  );
}
