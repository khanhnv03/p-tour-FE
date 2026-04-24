import { Link, useLocation } from 'react-router-dom';
import { BRAND_NAME, BRAND_LOGO } from '../constants';

export default function Sidebar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-white flex flex-col py-6 space-y-2 z-50 border-r border-slate-200">
      <div className="px-6 mb-10">
        <div className="flex items-center space-x-3">
          <img src={BRAND_LOGO} alt="PTIT Logo" className="w-10 h-10 object-contain" />
          <div>
            <h1 className="text-on-surface font-black tracking-tight text-sm leading-none whitespace-nowrap">{BRAND_NAME}</h1>
            <p className="text-on-surface-variant text-[9px] font-black uppercase tracking-widest mt-1 opacity-60">Admin Portal</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-2 space-y-1">
        <Link 
          className={`flex items-center space-x-3 px-4 py-3 ml-2 font-semibold text-sm transition-all rounded-xl ${location.pathname === '/admin' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-500 hover:translate-x-1 hover:text-blue-600'}`} 
          to="/admin"
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span>Bảng điều khiển</span>
        </Link>
        <Link 
          className={`flex items-center space-x-3 px-4 py-3 ml-2 font-semibold text-sm transition-all rounded-xl ${isActive('/admin/destinations') ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-500 hover:translate-x-1 hover:text-blue-600'}`} 
          to="/admin/destinations"
        >
          <span className="material-symbols-outlined">travel_explore</span>
          <span>Điểm đến</span>
        </Link>
        <Link 
          className={`flex items-center space-x-3 px-4 py-3 ml-2 font-semibold text-sm transition-all rounded-xl ${isActive('/admin/deals') ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-500 hover:translate-x-1 hover:text-blue-600'}`} 
          to="/admin/deals"
        >
          <span className="material-symbols-outlined">sell</span>
          <span>Ưu đãi</span>
        </Link>
        <Link 
          className={`flex items-center space-x-3 px-4 py-3 ml-2 font-semibold text-sm transition-all rounded-xl ${isActive('/admin/customers') ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-500 hover:translate-x-1 hover:text-blue-600'}`} 
          to="/admin/customers"
        >
          <span className="material-symbols-outlined">group</span>
          <span>Khách hàng</span>
        </Link>
        <Link 
          className={`flex items-center space-x-3 px-4 py-3 ml-2 font-semibold text-sm transition-all rounded-xl ${isActive('/admin/analytics') ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-500 hover:translate-x-1 hover:text-blue-600'}`} 
          to="/admin/analytics"
        >
          <span className="material-symbols-outlined">analytics</span>
          <span>Phân tích</span>
        </Link>
        <Link 
          className={`flex items-center space-x-3 px-4 py-3 ml-2 font-semibold text-sm transition-all rounded-xl ${isActive('/admin/orders') ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-500 hover:translate-x-1 hover:text-blue-600'}`} 
          to="/admin/orders"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/admin/orders') ? "'FILL' 1" : "" }}>receipt_long</span>
          <span>Đơn hàng</span>
        </Link>
        <Link 
          className={`flex items-center space-x-3 px-4 py-3 ml-2 font-semibold text-sm transition-all rounded-xl ${isActive('/admin/blog') ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-500 hover:translate-x-1 hover:text-blue-600'}`} 
          to="/admin/blog"
        >
          <span className="material-symbols-outlined">edit_document</span>
          <span>Biên tập Blog</span>
        </Link>
        <Link 
          className={`flex items-center space-x-3 px-4 py-3 ml-2 font-semibold text-sm transition-all rounded-xl ${isActive('/admin/settings') ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-500 hover:translate-x-1 hover:text-blue-600'}`} 
          to="/admin/settings"
        >
          <span className="material-symbols-outlined">settings</span>
          <span>Cài đặt</span>
        </Link>
      </nav>
      <div className="px-4 mt-auto space-y-4">
        <Link to="/admin/tours/new" className="w-full signature-gradient text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center justify-center space-x-2 active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-sm">add</span>
          <span>Tạo Tour mới</span>
        </Link>
        <div className="pt-6 border-t border-slate-200 space-y-1">
          <Link className="flex items-center space-x-3 text-slate-500 px-4 py-2 text-sm hover:text-blue-600 font-bold" to="/">
            <span className="material-symbols-outlined text-lg">help</span>
            <span>Trung tâm hỗ trợ</span>
          </Link>
          <Link className="flex items-center space-x-3 text-error px-4 py-2 text-sm hover:opacity-100 opacity-70 font-bold" to="/login">
            <span className="material-symbols-outlined text-lg">logout</span>
            <span>Đăng xuất</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
