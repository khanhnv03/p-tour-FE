import { Link } from 'react-router-dom';

const TODAY = new Date('2026-04-24');

function getDealStatus(validUntilDate: Date) {
  const diffDays = Math.ceil((validUntilDate.getTime() - TODAY.getTime()) / 86400000);
  if (diffDays < 0) return { type: 'expired', label: 'Đã hết hạn', bg: 'bg-slate-100', text: 'text-slate-500' };
  if (diffDays <= 7) return { type: 'expiring', label: 'Sắp hết hạn', bg: 'bg-amber-100', text: 'text-amber-700' };
  return { type: 'active', label: 'Đang hoạt động', bg: 'bg-emerald-100', text: 'text-emerald-700' };
}

const DEALS = [
  {
    id: 1,
    title: 'Khám phá Vịnh Hạ Long Hè 2026',
    publicTitle: 'Hè Đặc Biệt: Hạ Long Giảm 20%',
    offer: 'GIẢM 20%',
    code: 'HALONG20',
    displayMode: 'copy',
    category: 'Theo mùa',
    validUntilDate: new Date('2026-05-30'),
    usageCount: 67,
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYxBlwy8uojyDVx1tSLMwyGv99xZPD9a4IjrbHfCmAfZ2aP3QixIicyOsYuYYSbL9EWycnEx8d0IcQk51THHdlpuH9_I4UmHDFrZQ65wU-5mgzJXfa5Hhxq_A2KeVJeNnzKWBDscQdu1vzpTVqWgVJfcjrWpEIo3PAJ0xMbIiCz3BQesi8vc61kcYJ_jAw2masf4YQYPCa-0nlX1p2OyYFSXcGL_j6AiJDOMwWDU-ruG3mJMQ-zEOVnEOtxGq1biiiKKBZKn_zcts',
  },
  {
    id: 2,
    title: 'Đặt sớm Langbiang – Tháng 11',
    publicTitle: 'Đặt sớm: Langbiang giảm 15%',
    offer: 'GIẢM 15%',
    code: 'EARLY15',
    displayMode: 'auto',
    category: 'Đặt sớm',
    validUntilDate: new Date('2026-06-15'),
    usageCount: 34,
    thumbnail: 'https://picsum.photos/seed/tour1/400/300',
  },
  {
    id: 3,
    title: 'Flash Sale Nhật Bản – Tháng 1/2027',
    publicTitle: 'Flash 48h: Tour Nhật giảm 12%',
    offer: 'GIẢM 12%',
    code: 'JAPAN12',
    displayMode: 'copy',
    category: 'Ưu đãi chớp nhoáng',
    validUntilDate: new Date('2026-04-24'),
    usageCount: 18,
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWiGMIrNWl1-cQvJ0XRrrUGDi0PWIy4mw3PCuxYFgA2n1W-hweKF21RNHk1zYwgqs3pQJFY09tAEn9CHCIxKo0G6QNH2PfZfHcaGvSHcCn7AZ7G_M6mfy5YVOilHbCstGh5vIqruj309g10TYX_jpRbaSINPIw2hP71OpBAFXDdaxJWdz4wfQH2HCItBTwu7j0b2K6zoKT8RQt8CaeY6B1vvzq3gKIjeYHnI9hybch0aEMMMbzhseBR04IP9eLpRDRI2y3vjbwEDY',
  },
  {
    id: 4,
    title: 'Mùa Thu Dolomites 2024',
    publicTitle: 'Mùa Thu Tĩnh Lặng – Dolomites',
    offer: 'GIẢM 20%',
    code: 'DOLOMITES20',
    displayMode: 'copy',
    category: 'Theo mùa',
    validUntilDate: new Date('2024-11-30'),
    usageCount: 120,
    thumbnail: 'https://picsum.photos/seed/dolomites/400/300',
  },
];

const activeCount = DEALS.filter(d => getDealStatus(d.validUntilDate).type === 'active').length;
const totalUsage = DEALS.reduce((sum, d) => sum + d.usageCount, 0);

export default function ManageDeals() {
  return (
    <div className="flex flex-col flex-1 p-6 lg:p-8 overflow-y-auto gap-6">
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 mb-2">
            <span>Quản trị</span>
            <span className="material-symbols-outlined text-[11px]">chevron_right</span>
            <span className="text-secondary">Ưu đãi</span>
          </nav>
          <h1 className="text-3xl font-black text-on-surface tracking-tight leading-none">Ưu đãi & Khuyến mãi</h1>
          <p className="text-slate-400 text-sm font-medium mt-1.5">Cấu hình các chiến dịch giảm giá, tặng kèm quà và kích cầu.</p>
        </div>
        <Link
          to="/admin/deals/new"
          className="inline-flex items-center gap-2 bg-secondary text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg shadow-secondary/25 hover:shadow-xl hover:shadow-secondary/30 transition-all active:scale-95 whitespace-nowrap self-start lg:self-auto"
        >
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>sell</span>
          Tạo ưu đãi mới
        </Link>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Đang hoạt động</span>
            <span className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-600 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>sell</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-secondary tracking-tight">{activeCount}</span>
            <span className="text-emerald-500 font-bold text-[10px] uppercase tracking-widest">Chiến dịch</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mã đã sử dụng</span>
            <span className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>confirmation_number</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-on-surface tracking-tight">{totalUsage}</span>
            <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Lượt</span>
          </div>
        </div>

        <div className="primary-gradient text-white rounded-2xl shadow-xl shadow-primary/20 p-5 flex flex-col gap-3 relative overflow-hidden">
          <span className="material-symbols-outlined absolute -right-3 -bottom-3 text-[72px] text-white/10 select-none" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Doanh thu tác động</span>
          <div className="flex items-baseline gap-2 mt-auto">
            <span className="text-3xl font-black tracking-tight">+12.4%</span>
            <span className="text-white/60 font-bold text-[10px] uppercase tracking-widest">So với kỳ trước</span>
          </div>
        </div>
      </div>

      {/* Campaign Table */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col flex-1 min-h-0">
        <div className="px-6 py-4 border-b border-black/5 flex items-center justify-between">
          <h2 className="text-base font-black tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
            Danh sách chiến dịch
          </h2>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{DEALS.length} chiến dịch</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Chiến dịch</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Mã / Kiểu</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Hết hạn</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Trạng thái</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Lượt dùng</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400"></th>
              </tr>
            </thead>
            <tbody>
              {DEALS.map((deal) => {
                const status = getDealStatus(deal.validUntilDate);
                const isExpired = status.type === 'expired';
                return (
                  <tr
                    key={deal.id}
                    className={`border-t border-black/5 hover:bg-slate-50/60 transition-colors ${isExpired ? 'opacity-55' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={deal.thumbnail}
                          alt={deal.title}
                          className={`w-11 h-11 rounded-xl object-cover flex-shrink-0 ${isExpired ? 'grayscale' : ''}`}
                        />
                        <div>
                          <div className="font-bold text-on-surface text-sm">{deal.publicTitle}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wide">
                            {deal.category} · <span className="font-black text-secondary">{deal.offer}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs bg-slate-100 px-2.5 py-1 rounded-lg font-bold text-on-surface">{deal.code}</span>
                      <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">
                        {deal.displayMode === 'copy' ? 'Copy mã' : 'Tự động áp dụng'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                      {deal.validUntilDate.toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${status.bg} ${status.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          status.type === 'active' ? 'bg-emerald-500' :
                          status.type === 'expiring' ? 'bg-amber-500' : 'bg-slate-400'
                        }`} />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-slate-500 text-sm">{deal.usageCount}</td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/admin/deals/edit/${deal.id}`}
                        className="inline-flex p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
