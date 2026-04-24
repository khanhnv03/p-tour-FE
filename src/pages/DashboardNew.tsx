import { Link } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from 'recharts';

/* ── mock data ── */
const revenueWeek = [
  { day: 'T2', revenue: 18.4, bookings: 9 },
  { day: 'T3', revenue: 24.1, bookings: 14 },
  { day: 'T4', revenue: 19.8, bookings: 11 },
  { day: 'T5', revenue: 31.2, bookings: 18 },
  { day: 'T6', revenue: 28.6, bookings: 16 },
  { day: 'T7', revenue: 42.3, bookings: 24 },
  { day: 'CN', revenue: 38.7, bookings: 21 },
];

const topTours = [
  { name: 'Du thuyền Vịnh Hạ Long',  pct: 87, bookings: 78, color: '#004e9f' },
  { name: 'Thiên đường Maldives',     pct: 72, bookings: 12, color: '#0066cc' },
  { name: 'Hội An Phố Cổ & Biển',    pct: 64, bookings: 56, color: '#2563eb' },
  { name: 'Bình minh Langbiang',      pct: 51, bookings: 34, color: '#3b82f6' },
  { name: 'Tokyo – Kyoto 7 ngày',     pct: 38, bookings: 5,  color: '#60a5fa' },
];

const recentBookings = [
  { initials: 'NT', name: 'Nguyễn Thị Mai',   tour: 'Du thuyền Vịnh Hạ Long', date: '24 Th4, 2026', amount: '5.200.000₫',  status: 'confirmed' },
  { initials: 'TH', name: 'Trần Hùng Anh',    tour: 'Thiên đường Maldives',    date: '23 Th4, 2026', amount: '45.900.000₫', status: 'pending'   },
  { initials: 'LV', name: 'Lê Văn Phúc',      tour: 'Tokyo – Kyoto 7 ngày',   date: '22 Th4, 2026', amount: '32.500.000₫', status: 'confirmed' },
  { initials: 'PK', name: 'Phạm Kim Liên',    tour: 'Hội An Phố Cổ & Biển',  date: '21 Th4, 2026', amount: '4.800.000₫',  status: 'cancelled' },
  { initials: 'HT', name: 'Hoàng Thị Thúy',   tour: 'Bình minh Langbiang',    date: '20 Th4, 2026', amount: '13.300.000₫', status: 'confirmed' },
];

const STATUS_MAP = {
  confirmed: { label: 'Xác nhận',  bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
  pending:   { label: 'Chờ duyệt', bg: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-100'   },
  cancelled: { label: 'Huỷ',       bg: 'bg-red-50',     text: 'text-red-500',     border: 'border-red-100'     },
};

const QUICK_ACTIONS = [
  { label: 'Tạo Tour mới',      icon: 'add_circle',    to: '/admin/tours/new',   color: 'text-primary   bg-blue-50'   },
  { label: 'Xem đặt chỗ',      icon: 'list_alt',       to: '/admin/orders',      color: 'text-amber-600 bg-amber-50'  },
  { label: 'Quản lý khách hàng', icon: 'manage_accounts', to: '/admin/customers', color: 'text-violet-600 bg-violet-50'},
  { label: 'Tạo ưu đãi',       icon: 'sell',           to: '/admin/deals/new',  color: 'text-emerald-600 bg-emerald-50'},
];

const tooltipStyle = {
  borderRadius: '12px',
  border: '1px solid #f1f5f9',
  backgroundColor: 'rgba(255,255,255,0.97)',
  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
  padding: '10px 14px',
};
const tooltipLabelStyle = {
  fontWeight: 900, color: '#0f172a', fontSize: '10px',
  textTransform: 'uppercase' as const, marginBottom: '4px',
};

export default function DashboardNew() {
  const today = new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div className="flex flex-col flex-1 p-6 lg:p-8 overflow-y-auto gap-6">

      {/* ── Header ── */}
      <header className="shrink-0 flex items-end justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2">
            <span>Quản trị</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-secondary">Tổng quan</span>
          </nav>
          <h1 className="text-3xl font-black text-on-surface tracking-tight">Bảng điều khiển</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Theo dõi hiệu suất kinh doanh và các hoạt động thời gian thực.
          </p>
        </div>
        <p className="shrink-0 text-xs font-semibold text-slate-400 capitalize">{today}</p>
      </header>

      {/* ── KPI cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        {[
          { label: 'Tổng doanh thu',    value: '428.5M₫', change: '+12.5%', up: true,  icon: 'payments',             accent: 'bg-blue-50 text-primary'    },
          { label: 'Đặt chỗ tháng này', value: '182',     change: '+8.2%',  up: true,  icon: 'confirmation_number',  accent: 'bg-orange-50 text-secondary' },
          { label: 'Tour đang hoạt động',value: '158',     change: '-2.4%',  up: false, icon: 'travel_explore',       accent: 'bg-violet-50 text-violet-600'},
          { label: 'Điểm đánh giá TB',  value: '4.9 / 5', change: '+4.5%',  up: true,  icon: 'star',                 accent: 'bg-amber-50 text-amber-500'  },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-3 hover:border-primary/20 transition-all group">
            <div className="flex items-center justify-between">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${kpi.accent}`}>
                <span className="material-symbols-outlined text-[18px]">{kpi.icon}</span>
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                kpi.up ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-500 border border-red-100'
              }`}>
                <span className="material-symbols-outlined text-[11px]">{kpi.up ? 'arrow_upward' : 'arrow_downward'}</span>
                {kpi.change}
              </span>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400 mb-1">{kpi.label}</p>
              <p className="text-2xl font-black text-on-surface tracking-tight">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Revenue area chart */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-black text-on-surface tracking-tight">Doanh thu 7 ngày qua</h2>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Triệu đồng · Đặt chỗ mới</p>
            </div>
            <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest">
              <span className="flex items-center gap-1.5 text-primary">
                <span className="w-3 h-1 rounded-full bg-primary inline-block" />Doanh thu
              </span>
              <span className="flex items-center gap-1.5 text-secondary">
                <span className="w-3 h-1 rounded-full bg-secondary inline-block" />Đặt chỗ
              </span>
            </div>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueWeek} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
                <defs>
                  <linearGradient id="dbGradRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#004e9f" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#004e9f" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="dbGradBook" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fe6a34" stopOpacity={0.12} />
                    <stop offset="100%" stopColor="#fe6a34" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 900 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 900 }} width={32} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle}
                  formatter={(v: any, name: string) => [name === 'revenue' ? `${v}M₫` : v, name === 'revenue' ? 'Doanh thu' : 'Đặt chỗ']} />
                <Area type="monotone" dataKey="bookings" stroke="#fe6a34" strokeWidth={1.5} fill="url(#dbGradBook)" dot={false} />
                <Area type="monotone" dataKey="revenue"  stroke="#004e9f" strokeWidth={2}   fill="url(#dbGradRev)"  dot={false} activeDot={{ r: 5, fill: '#004e9f' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top tours progress */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-6 flex flex-col">
          <div className="mb-5">
            <h2 className="text-sm font-black text-on-surface tracking-tight">Tour hiệu suất cao</h2>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Tỉ lệ lấp đầy</p>
          </div>
          <div className="flex flex-col gap-5 flex-1 justify-between">
            {topTours.map((t) => (
              <div key={t.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-600 truncate pr-3">{t.name}</span>
                  <span className="text-xs font-black text-primary shrink-0">{t.pct}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${t.pct}%`, backgroundColor: t.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Recent bookings */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-on-surface tracking-tight">Đặt chỗ gần đây</h2>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Giao dịch mới nhất</p>
            </div>
            <Link to="/admin/orders" className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1">
              Xem tất cả
              <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
            </Link>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-12 px-6 py-2.5 bg-slate-50/70 border-b border-gray-100">
            <span className="col-span-4 text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">Khách hàng</span>
            <span className="col-span-4 text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">Tour</span>
            <span className="col-span-2 text-[9px] font-black uppercase tracking-[0.14em] text-slate-400 text-right">Giá trị</span>
            <span className="col-span-2 text-[9px] font-black uppercase tracking-[0.14em] text-slate-400 text-right">Trạng thái</span>
          </div>

          {recentBookings.map((b, i) => {
            const s = STATUS_MAP[b.status as keyof typeof STATUS_MAP];
            return (
              <div key={i} className="grid grid-cols-12 px-6 py-3 items-center border-b border-gray-50 hover:bg-slate-50/50 transition-colors last:border-b-0">
                <div className="col-span-4 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary shrink-0">
                    {b.initials}
                  </div>
                  <span className="text-sm font-semibold text-gray-800 truncate">{b.name}</span>
                </div>
                <div className="col-span-4">
                  <span className="text-xs text-slate-500 font-medium truncate block pr-2">{b.tour}</span>
                  <span className="text-[9px] text-slate-400 font-medium">{b.date}</span>
                </div>
                <span className="col-span-2 text-sm font-black text-on-surface text-right tabular-nums">{b.amount}</span>
                <div className="col-span-2 flex justify-end">
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${s.bg} ${s.text} ${s.border}`}>
                    {s.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right column: quick actions + booking status */}
        <div className="lg:col-span-4 flex flex-col gap-4">

          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-5">
            <h2 className="text-sm font-black text-on-surface tracking-tight mb-4">Thao tác nhanh</h2>
            <div className="grid grid-cols-2 gap-2.5">
              {QUICK_ACTIONS.map((a) => (
                <Link
                  key={a.label}
                  to={a.to}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border border-black/5 hover:border-primary/20 hover:bg-slate-50/60 transition-all group"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[18px] ${a.color}`}>
                    <span className="material-symbols-outlined text-[18px]">{a.icon}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 text-center leading-tight">{a.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Booking status summary */}
          <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-5 flex-1">
            <h2 className="text-sm font-black text-on-surface tracking-tight mb-4">Trạng thái đặt chỗ</h2>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Đã xác nhận', value: 124, total: 182, color: 'bg-emerald-500' },
                { label: 'Chờ duyệt',  value: 38,  total: 182, color: 'bg-amber-400'   },
                { label: 'Đã huỷ',     value: 20,  total: 182, color: 'bg-red-400'     },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span className="text-xs font-semibold text-slate-600">{item.label}</span>
                    </div>
                    <span className="text-xs font-black text-on-surface">{item.value}
                      <span className="text-[9px] font-semibold text-slate-400 ml-1">/ {item.total}</span>
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${Math.round(item.value / item.total * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* CTA gradient card */}
            <div className="mt-5 primary-gradient rounded-xl p-4 relative overflow-hidden">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/70 mb-1">Hiệu suất tháng này</p>
              <p className="text-2xl font-black text-white tracking-tight">94.2%</p>
              <p className="text-[10px] text-white/60 font-medium mt-0.5">Tỉ lệ hoàn thành tour</p>
              <div className="absolute -right-3 -bottom-3 opacity-10 pointer-events-none">
                <span className="material-symbols-outlined text-[64px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  monitoring
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
