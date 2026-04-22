import React from 'react';

export default function Dashboard() {
  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8">
      {/* Editorial Header */}
      <header className="mb-4">
        <nav className="flex items-center space-x-2 text-on-surface-variant text-[9px] font-black uppercase tracking-[0.2em] mb-3">
          <span>Quy trình vận hành</span>
          <span className="material-symbols-outlined text-[10px]">chevron_right</span>
          <span className="text-primary italic">Điều hành Toàn cầu</span>
        </nav>
        <h1 className="text-3xl font-black text-on-surface tracking-tight leading-none">Bảng điều khiển</h1>
        <p className="text-slate-400 text-sm leading-relaxed font-medium mt-2">Theo dõi nhịp đập của các chuyến thám hiểm và hiệu quả kinh doanh thời gian thực.</p>
      </header>

      {/* Overview Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-low transition-all hover:border-primary/20 group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-lg">payments</span>
            </div>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">+12.5%</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tổng doanh thu</p>
          <h3 className="text-2xl font-black text-on-surface mt-1 tracking-tight">$428,500</h3>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-low transition-all hover:border-primary/20 group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-lg">group</span>
            </div>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">+8.2%</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Người thám hiểm</p>
          <h3 className="text-2xl font-black text-on-surface mt-1 tracking-tight">2,420</h3>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-low transition-all hover:border-primary/20 group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-lg">map</span>
            </div>
            <span className="text-[10px] font-black text-red-500 bg-red-50 px-2 py-0.5 rounded-lg">-2.4%</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tour đang hoạt động</p>
          <h3 className="text-2xl font-black text-on-surface mt-1 tracking-tight">158</h3>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-low transition-all hover:border-primary/20 group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-lg">star</span>
            </div>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">+4.5%</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sự hài lòng TB</p>
          <h3 className="text-2xl font-black text-on-surface mt-1 tracking-tight">4.9/5.0</h3>
        </div>
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Line Chart Visualization */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-3xl border border-surface-container-low flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-base font-black tracking-tight text-on-surface">Tăng trưởng doanh thu</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Chu kỳ tài chính 2024</p>
            </div>
            <div className="flex bg-surface-container-low p-1 rounded-xl">
              <button className="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400">Tuần</button>
              <button className="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-white text-primary shadow-sm">Tháng</button>
            </div>
          </div>
          <div className="flex-1 w-full flex flex-col justify-end px-2 relative min-h-[220px]">
            {/* Simulated Line Chart with SVG path */}
            <svg className="absolute inset-0 w-full h-full p-2 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path d="M0 80 Q 25 20, 50 50 T 100 10" fill="none" stroke="url(#lineGradient)" strokeLinecap="round" strokeWidth="3"></path>
              <defs>
                <linearGradient id="lineGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#004e9f"></stop>
                  <stop offset="100%" stopColor="#fe6a34"></stop>
                </linearGradient>
              </defs>
            </svg>
            <div className="flex w-full justify-between pt-6 relative z-10 mt-auto border-t border-slate-100">
              {['T1', 'T2', 'T3', 'T4', 'T5', 'T6'].map((m) => (
                <span key={m} className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Top Tours Bar Chart Visualization */}
        <div className="bg-surface-container-lowest p-8 rounded-3xl border border-surface-container-low">
          <h2 className="text-base font-black tracking-tight text-on-surface mb-8">Tour hiệu suất cao</h2>
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1">
                <span className="text-slate-500">Santorini Escape</span>
                <span className="text-primary">85%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full signature-gradient rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1">
                <span className="text-slate-500">Kyoto Serenity</span>
                <span className="text-primary">72%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full signature-gradient rounded-full" style={{ width: '72%' }}></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1">
                <span className="text-slate-500">Iceland Aurora</span>
                <span className="text-primary">64%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full signature-gradient rounded-full" style={{ width: '64%' }}></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1">
                <span className="text-slate-500">Swiss Alps Hike</span>
                <span className="text-primary">48%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full signature-gradient rounded-full" style={{ width: '48%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Bookings Table */}
      <section className="bg-surface-container-lowest rounded-3xl border border-surface-container-low overflow-hidden">
        <div className="p-6 border-b border-surface-container-low flex justify-between items-center">
          <div>
            <h2 className="text-base font-black tracking-tight text-on-surface">Đặt chỗ gần đây</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Luồng giao dịch trực tiếp</p>
          </div>
          <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline transition-all">Toàn bộ nhật ký</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low font-black text-[9px] uppercase tracking-[0.2em] text-slate-400">
                <th className="px-6 py-4">Người thám hiểm</th>
                <th className="px-6 py-4">Kết nối hành trình</th>
                <th className="px-6 py-4">Thời gian</th>
                <th className="px-6 py-4">Trị giá</th>
                <th className="px-6 py-4 text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low text-xs">
              <tr className="hover:bg-primary/[0.01] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">JD</div>
                    <span className="font-bold text-slate-700">Julianna Dough</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500 font-medium">Bờ biển Amalfi, Ý</td>
                <td className="px-6 py-4 text-slate-400">24 Th10, 2024</td>
                <td className="px-6 py-4 font-black text-slate-700">$3,200</td>
                <td className="px-6 py-4 text-right">
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black rounded uppercase border border-emerald-100 italic tracking-tighter shadow-sm shadow-emerald-500/10">Đã xác nhận</span>
                </td>
              </tr>
              <tr className="hover:bg-primary/[0.01] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-[10px] font-black text-orange-500">MS</div>
                    <span className="font-bold text-slate-700">Marco Silvestri</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500 font-medium">Thám hiểm Serengeti</td>
                <td className="px-6 py-4 text-slate-400">23 Th10, 2024</td>
                <td className="px-6 py-4 font-black text-slate-700">$4,850</td>
                <td className="px-6 py-4 text-right">
                  <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[8px] font-black rounded uppercase border border-orange-100 italic tracking-tighter shadow-sm shadow-orange-500/10">Đang chờ</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Tour Management Section */}
      <section className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm">
        <div className="p-8 border-b border-surface-container-low flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-on-surface">Danh mục Tour</h2>
            <p className="text-sm text-on-surface-variant">Quản lý các trải nghiệm được chọn lọc</p>
          </div>
          <button className="signature-gradient text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center space-x-2 active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-sm">add</span>
            <span>Tour mới</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-8 py-4 text-[11px] font-black uppercase tracking-widest text-outline">Tên Tour</th>
                <th className="px-8 py-4 text-[11px] font-black uppercase tracking-widest text-outline">Danh mục</th>
                <th className="px-8 py-4 text-[11px] font-black uppercase tracking-widest text-outline">Số lượng</th>
                <th className="px-8 py-4 text-[11px] font-black uppercase tracking-widest text-outline">Giá</th>
                <th className="px-8 py-4 text-[11px] font-black uppercase tracking-widest text-outline">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              <tr className="hover:bg-surface-container-low/20 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-4">
                    <img alt="Tropical" className="w-12 h-12 rounded-xl object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBou2BifWiOusBlyCQcmisijKyPiCQdOoGTkiImWN3G9mwFc3-W_t3vQ2c1HRDC5EGY8w0YEisRGSFaUUjeeWBW4lT6FEkg0UZfSUCaLWdQ4ELbj8sXr6IdKes_01YtxJ609uARxDdzWVc7PXW3qsw21P75xe77PJuO2Qwfd1C4bPRxP2NJRUf2sohRV69u8acxCX2jibGnIcDHpWv7MVGFpd4ZxfXm10VMLP_mKva9pqEQnG0hmKxIszbYH6f8p_zH0FlO3oip6tA"/>
                    <div>
                      <p className="text-sm font-bold text-on-surface">Bali Spiritual Retreat</p>
                      <p className="text-[10px] text-on-surface-variant font-medium">Ubud, Indonesia</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-xs font-semibold px-2 py-1 bg-surface-container-low rounded-lg text-on-surface">Sức khỏe</span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-1.5 bg-surface-container-low rounded-full">
                      <div className="w-1/2 h-full bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-xs font-bold text-on-surface">12/24</span>
                  </div>
                </td>
                <td className="px-8 py-6 font-bold text-sm text-on-surface">$1,899</td>
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-low/20 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-4">
                    <img alt="Alpine" className="w-12 h-12 rounded-xl object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDn-NTtnFIAXwjuu18Vakbv8OJkCQppspWNOlZhWC9OZ9twIH2qNAsGOKsob2CCECDuCjDtPXVKzd2Ro9D-sFkShsX5oRNyEGSzwsXhIXSI6zhm9gqkdXv8y9x-g4Rv27Y9C5tok53BaR-3JLK7cry8QfANecFbSB99ljz_bfdaATFRAu4hQlSL3leSVF2HD3bBqP3tShsGunBkupXnvZzLK65faxWgWQvXhYGb243pwTYeMuoVch6ixpTrQBVffRagu6MKUoVuRGs"/>
                    <div>
                      <p className="text-sm font-bold text-on-surface">Leo núi Alps Thụy Sĩ</p>
                      <p className="text-[10px] text-on-surface-variant font-medium">Zermatt, Thụy Sĩ</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-xs font-semibold px-2 py-1 bg-surface-container-low rounded-lg text-on-surface">Phiêu lưu</span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-1.5 bg-surface-container-low rounded-full">
                      <div className="w-4/5 h-full bg-orange-500 rounded-full"></div>
                    </div>
                    <span className="text-xs font-bold text-on-surface">4/20</span>
                  </div>
                </td>
                <td className="px-8 py-6 font-bold text-sm text-on-surface">$2,450</td>
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
