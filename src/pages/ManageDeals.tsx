import { Link } from 'react-router-dom';

const TODAY = new Date('2026-04-22');

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

export default function ManageDeals() {
  return (
    <div className="p-10 max-w-[1600px] mx-auto space-y-10">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-4">
        <div>
          <nav className="flex items-center space-x-2 text-on-surface-variant text-[9px] font-black uppercase tracking-[0.2em] mb-3">
            <span>Quản trị Hệ thống</span>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <span className="text-secondary">Quản lý Ưu đãi</span>
          </nav>
          <h1 className="text-3xl font-black text-on-surface tracking-tight leading-none">Ưu đãi & Khuyến mãi</h1>
          <p className="text-slate-400 text-sm leading-relaxed font-medium mt-2">Cấu hình các chiến dịch giảm giá, tặng kèm quà và kích cầu.</p>
        </div>
        <Link to="/admin/deals/new" className="bg-secondary text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 scale-100 active:scale-95 whitespace-nowrap">
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>sell</span>
          Tạo Ưu đãi mới
        </Link>
      </header>

      <div className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col justify-between h-32 border border-surface-container-high">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Đang hoạt động</span>
            <div className="flex items-baseline gap-2 mt-auto">
              <span className="text-3xl font-black text-secondary tracking-tight">{activeCount}</span>
              <span className="text-emerald-500 font-bold text-[10px] uppercase">Hôm nay</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-2xl flex flex-col justify-between h-32 border border-surface-container-low">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Mã đã sử dụng</span>
            <span className="text-3xl font-black text-on-surface tracking-tight mt-auto">165</span>
          </div>
          <div className="primary-gradient text-white p-6 rounded-2xl flex flex-col justify-between h-32 shadow-xl shadow-primary/20">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Doanh thu tác động</span>
            <span className="text-3xl font-black tracking-tight mt-auto">+12.4%</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-3xl border border-surface-container-highest overflow-hidden">
          <div className="p-6 border-b border-surface-container-highest flex items-center justify-between">
            <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">workspace_premium</span>
              Danh sách Chiến dịch
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant border-b border-surface-container-highest">Chiến dịch</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant border-b border-surface-container-highest">Mã / Kiểu</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant border-b border-surface-container-highest">Hết hạn</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant border-b border-surface-container-highest">Trạng thái</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant border-b border-surface-container-highest text-right">Lượt dùng</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant border-b border-surface-container-highest"></th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {DEALS.map((deal) => {
                  const status = getDealStatus(deal.validUntilDate);
                  const isExpired = status.type === 'expired';
                  return (
                    <tr key={deal.id} className={`hover:bg-surface-container-lowest transition-colors border-b border-surface-container-highest last:border-0 ${isExpired ? 'opacity-60' : ''}`}>
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <img src={deal.thumbnail} alt={deal.title} className={`w-12 h-12 rounded-xl object-cover flex-shrink-0 ${isExpired ? 'grayscale' : ''}`} />
                          <div>
                            <div className="font-bold text-on-surface">{deal.publicTitle}</div>
                            <div className="text-xs text-on-surface-variant mt-0.5">{deal.category} · <span className="font-bold text-secondary">{deal.offer}</span></div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="font-mono text-xs bg-surface-container-low px-2 py-1 rounded-lg font-bold text-on-surface">{deal.code}</span>
                        <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">
                          {deal.displayMode === 'copy' ? 'Copy mã' : 'Tự động áp dụng'}
                        </div>
                      </td>
                      <td className="p-6 text-on-surface-variant text-xs font-medium">
                        {deal.validUntilDate.toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${status.bg} ${status.text}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="p-6 text-right font-mono font-bold text-on-surface-variant">{deal.usageCount}</td>
                      <td className="p-6 text-right">
                        <Link to={`/admin/deals/edit/${deal.id}`} className="inline-flex p-2 hover:bg-surface-container rounded-lg text-slate-400 hover:text-primary transition-colors">
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
    </div>
  );
}
