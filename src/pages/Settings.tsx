import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Settings() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Profile Dossier');

  useEffect(() => {
    // Map query parameter back to tab IDs
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    
    if (tab === 'profile') setActiveTab('Profile Dossier');
    else if (tab === 'auth') setActiveTab('Authentication');
    else if (tab === 'notifications') setActiveTab('Notifications');
  }, [location.search]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    let tab = '';
    if (tabId === 'Profile Dossier') tab = 'profile';
    if (tabId === 'Authentication') tab = 'auth';
    if (tabId === 'Notifications') tab = 'notifications';
    
    // Use navigate with query parameter, which prevents scroll jumping compared to hash
    navigate(`/admin/settings?tab=${tab}`, { replace: true });
  };

  const tabs = [
    { id: 'Profile Dossier', label: 'Hồ sơ cá nhân', icon: 'person' },
    { id: 'Authentication', label: 'Đổi mật khẩu', icon: 'key' },
    { id: 'Notifications', label: 'Thông báo', icon: 'notifications' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Profile Dossier':
        return (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col md:flex-row gap-12 items-start">
                <div className="shrink-0 relative group">
                  <div className="absolute inset-0 signature-gradient rounded-[2rem] rotate-6 scale-105 opacity-20 blur-xl"></div>
                  <div className="w-32 h-32 rounded-[2rem] overflow-hidden relative z-10 border-4 border-white shadow-xl">
                    <img src="https://picsum.photos/seed/admin/200/200" alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <button className="absolute -bottom-2 -right-2 bg-white text-primary p-2 rounded-xl shadow-lg hover:scale-110 transition-transform z-20">
                    <span className="material-symbols-outlined text-sm">photo_camera</span>
                  </button>
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-2xl font-black tracking-tight text-on-surface">Hồ sơ Quản trị viên</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">Cập nhật hồ sơ công khai của bạn. Thông tin này hiển thị cho các thành viên khác và được sử dụng trong các thông báo tự động.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant px-1">Tên</label>
                  <input 
                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none text-on-surface font-semibold" 
                    defaultValue="Jane"
                    type="text" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant px-1">Họ</label>
                  <input 
                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none text-on-surface font-semibold" 
                    defaultValue="Doe"
                    type="text" 
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant px-1">Địa chỉ Email</label>
                  <input 
                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none text-on-surface font-semibold" 
                    defaultValue="jane.doe@horizoncurator.com"
                    type="email" 
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant px-1">Tiểu sử</label>
                  <textarea 
                     className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none text-on-surface font-semibold resize-none" 
                     defaultValue="Chuyên về kiến trúc Đông Nam Á và các đường mòn trên dãy Himalaya. Quản lý bộ sưu tập tour 'Đỉnh & Kinh'."
                     rows={4}
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-surface-container-low flex justify-end gap-4">
                <button className="px-8 py-3 text-on-surface-variant font-bold hover:bg-surface-container-high rounded-xl transition-colors">Hủy</button>
                <button className="signature-gradient text-white px-10 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all scale-100 active:scale-95">Lưu hồ sơ</button>
              </div>
            </form>
          </motion.div>
        );
      case 'Authentication':
        return (
          <motion.div
            key="auth"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-primary/5 text-primary rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl">lock</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight text-on-surface">Thay đổi mật khẩu</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">Đảm bảo tài khoản của bạn được bảo vệ bằng mật khẩu mạnh và duy nhất.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 max-w-xl">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant px-1">Mật khẩu hiện tại</label>
                  <input 
                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none text-on-surface font-semibold" 
                    type="password" 
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant px-1">Mật khẩu mới</label>
                  <input 
                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none text-on-surface font-semibold" 
                    type="password" 
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant px-1">Xác nhận mật khẩu mới</label>
                  <input 
                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none text-on-surface font-semibold" 
                    type="password" 
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-surface-container-low flex justify-end gap-4">
                <button className="px-8 py-3 text-on-surface-variant font-bold hover:bg-surface-container-high rounded-xl transition-colors">Hủy</button>
                <button className="signature-gradient text-white px-10 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all scale-100 active:scale-95">Cập nhật mật khẩu</button>
              </div>
            </form>
          </motion.div>
        );
      case 'Notifications':
        return (
          <motion.div
            key="notifications"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="space-y-10">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl">mark_email_unread</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight text-on-surface">Nhịp đập giao tiếp</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">Tùy chỉnh cách bạn nhận cảnh báo nền tảng và cập nhật biên tập.</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { title: 'Cảnh báo đặt chỗ mới', desc: 'Thông báo tức thì khi có chuyến thám hiểm được đặt.', active: true },
                  { title: 'Bình luận biên tập', desc: 'Cảnh báo khi cộng tác viên bình luận về bản nháp.', active: true },
                  { title: 'Trạng thái hệ thống', desc: 'Báo cáo hàng tháng về thời gian hoạt động và sức khỏe nền tảng.', active: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-surface-container-low border border-outline-variant/10">
                    <div>
                      <h4 className="font-bold text-on-surface">{item.title}</h4>
                      <p className="text-xs text-on-surface-variant">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={item.active} />
                      <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-10 max-w-[1600px] mx-auto space-y-10 relative">
      {/* Editorial Header */}
      <header className="mb-4">
        <nav className="flex items-center space-x-2 text-on-surface-variant text-[10px] font-black uppercase tracking-[0.2em] mb-3">
          <span>Quản trị</span>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-secondary">Cấu hình hậu trường</span>
        </nav>
        <h1 className="text-3xl font-black text-on-surface tracking-tight leading-none">Cài đặt</h1>
        <p className="text-on-surface-variant text-sm leading-relaxed font-medium mt-2">Tinh chỉnh hệ thống và quản lý quyền truy cập quản trị.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-12 items-start relative">
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 transition-all">
          <nav className="flex flex-col gap-2 sticky top-[100px]">
            {tabs.map((tab) => (
              <button 
                key={tab.id} 
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all text-left ${
                  activeTab === tab.id 
                    ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' 
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-xl">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Form Content */}
        <div className="flex-1 bg-surface-container-lowest w-full p-10 md:p-14 rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(25,28,29,0.04)] border border-surface-container-low/50 relative overflow-hidden min-h-[500px]">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
