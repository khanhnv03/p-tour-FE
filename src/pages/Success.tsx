import { Link } from 'react-router-dom';
import { BRAND_NAME } from '../constants';
import UserNavbar from '../components/UserNavbar';

export default function Success() {
  return (
    <div className="bg-surface text-on-surface font-sans selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col">
      <UserNavbar />

      <main className="flex-grow flex items-center justify-center py-8 px-6">
        <section className="max-w-2xl w-full">

          {/* Compact hero — icon + badge + heading in one row */}
          <div className="flex items-center gap-5 mb-6">
            <div className="relative shrink-0">
              <div className="absolute inset-0 signature-gradient rounded-2xl opacity-20 blur-xl animate-pulse" />
              <div className="relative w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 shadow-xl flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-4xl text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-secondary/10 rounded-full flex items-center justify-center animate-bounce">
                <span className="material-symbols-outlined text-secondary" style={{ fontSize: '14px' }}>
                  celebration
                </span>
              </div>
            </div>

            <div>
              <span className="text-secondary font-bold tracking-[0.25em] text-xs uppercase block mb-1">
                Thám hiểm đã Xác nhận
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-on-surface leading-snug">
                Chân trời đang chờ đợi{' '}
                <span className="text-primary italic">bạn.</span>
              </h1>
            </div>
          </div>

          {/* Booking info card — main focus */}
          <div className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl shadow-[0_8px_48px_rgba(25,28,29,0.08)] mb-5 border border-surface-container/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="space-y-2">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Mã số Đặt chỗ
                </h3>
                <p className="text-lg font-bold text-on-surface">Đơn hàng #HZ-2024-881</p>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Hồ sơ xác nhận đã được gửi đến địa chỉ email của bạn. Nếu chưa thấy, hãy kiểm tra cả mục Spam hoặc Promotions.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Hành trình của bạn
                </h3>
                <p className="text-lg font-bold text-on-surface">Du thuyền Giấc mơ Amalfi</p>
                <p className="text-sm text-on-surface-variant">Khởi hành: 12 Thg 10, 2024</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-surface-container flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-primary/20">
                  <img
                    src="https://picsum.photos/seed/curator/100/100"
                    alt="Curator"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-on-surface">Elena Vance</p>
                  <p className="text-xs text-on-surface-variant tracking-tight">
                    Chuyên gia dẫn đoàn của bạn
                  </p>
                </div>
              </div>
              <Link
                to="/contact"
                className="text-primary font-bold text-sm flex items-center gap-2 group"
              >
                Kết nối với Elena
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                  chat_bubble_outline
                </span>
              </Link>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link
              to="/bookings"
              className="w-full md:w-auto signature-gradient text-white px-8 py-3.5 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all active:scale-95 text-center"
            >
              Quản lý Hành trình
            </Link>
            <Link
              to="/"
              className="w-full md:w-auto bg-surface-container-high hover:bg-surface-dim text-on-surface px-8 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">home</span>
              Về Trang chủ
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-surface-container text-center">
        <p className="text-slate-400 text-xs font-medium uppercase tracking-[0.2em]">
          © 2026 {BRAND_NAME}. Vượt ra ngoài giới hạn.
        </p>
      </footer>
    </div>
  );
}
