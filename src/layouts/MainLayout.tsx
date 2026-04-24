import { Outlet, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { BRAND_NAME } from '../constants';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen relative flex flex-col">
        <Header />
        <Outlet />
        
        {/* Footer */}
        <footer className="mt-auto bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <span className="text-xl font-bold text-blue-900">{BRAND_NAME}</span>
              <p className="mt-4 text-sm text-slate-500 max-w-xs leading-relaxed">
                  Tuyển chọn những hành trình phi thường nhất thế giới. Vượt ra ngoài ranh giới, chạm đến tâm hồn.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-4">Pháp lý</h4>
              <div className="space-y-2">
                <Link className="block text-sm text-slate-500 hover:text-blue-600 transition-colors" to="#">Điều khoản dịch vụ</Link>
                <Link className="block text-sm text-slate-500 hover:text-blue-600 transition-colors" to="#">Chính sách bảo mật</Link>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-4">Hỗ trợ</h4>
              <div className="space-y-2">
                <Link className="block text-sm text-slate-500 hover:text-blue-600 transition-colors" to="#">Trung tâm hỗ trợ</Link>
                <Link className="block text-sm text-slate-500 hover:text-blue-600 transition-colors" to="#">Liên hệ</Link>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-8 py-6 border-t border-slate-200 flex justify-between items-center">
            <p className="text-xs text-slate-400">© 2026 {BRAND_NAME}. Vượt ra ngoài giới hạn.</p>
            <div className="flex space-x-4">
              <span className="material-symbols-outlined text-slate-400 text-lg cursor-pointer hover:text-blue-600">language</span>
              <span className="material-symbols-outlined text-slate-400 text-lg cursor-pointer hover:text-blue-600">public</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
