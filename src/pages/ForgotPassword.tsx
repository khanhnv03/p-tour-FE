import { Link } from 'react-router-dom';
import { BRAND_LOGO } from '../constants';

export default function ForgotPassword() {
  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-primary-fixed selection:text-on-primary-fixed">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center mb-6 group">
          <img src={BRAND_LOGO} alt="Logo" className="h-16 w-auto group-hover:scale-105 transition-transform duration-300" />
        </Link>
        <h2 className="mt-6 text-center text-3xl font-black tracking-tight text-on-surface leading-tight">Khôi phục<br/>mật khẩu</h2>
        <p className="mt-4 text-center text-sm font-medium text-on-surface-variant">
          Nhập email của bạn để nhận liên kết đặt lại mật khẩu an toàn.
        </p>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface-container-lowest py-10 px-6 shadow-[0_16px_48px_0_rgba(25,28,29,0.08)] border border-surface-container-low/50 rounded-[2.5rem] sm:px-10 relative overflow-hidden">
          {/* Subtle decoration */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

          <form className="space-y-6 relative z-10" onSubmit={e => e.preventDefault()}>
            <div>
              <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2">ĐỊA CHỈ EMAIL</label>
              <div className="mt-1 relative">
                <input id="email" name="email" type="email" autoComplete="email" required className="block w-full rounded-xl bg-surface-container-low border-none px-4 py-4 text-on-surface font-bold placeholder-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-inner transition-all" placeholder="bạn@vidu.com" />
              </div>
            </div>
            <div>
              <button type="submit" className="flex w-full justify-center rounded-xl signature-gradient px-4 py-4 text-sm font-bold text-white shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all active:scale-95 leading-none items-center gap-2">
                Gửi liên kết khôi phục
                <span className="material-symbols-outlined text-[18px]">forward_to_inbox</span>
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-surface-container text-center relative z-10">
            <p className="text-sm text-on-surface-variant font-medium">
              Nhớ mật khẩu rồi?{' '}
              <Link to="/login" className="font-bold text-primary hover:text-primary/80 transition-colors">Đăng nhập ngay</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
