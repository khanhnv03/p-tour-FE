import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area,
} from 'recharts';

/* ── mock data ── */
const revenueMonthly = [
  { month: 'T1', revenue: 148, bookings: 82 },
  { month: 'T2', revenue: 162, bookings: 91 },
  { month: 'T3', revenue: 134, bookings: 74 },
  { month: 'T4', revenue: 189, bookings: 105 },
  { month: 'T5', revenue: 221, bookings: 118 },
  { month: 'T6', revenue: 248, bookings: 132 },
  { month: 'T7', revenue: 296, bookings: 158 },
  { month: 'T8', revenue: 312, bookings: 171 },
  { month: 'T9', revenue: 274, bookings: 146 },
  { month: 'T10', revenue: 231, bookings: 124 },
  { month: 'T11', revenue: 198, bookings: 108 },
  { month: 'T12', revenue: 248, bookings: 137 },
];

const revenueTrend = revenueMonthly.map(d => ({ ...d, prev: Math.round(d.revenue * 0.82) }));

const tourBreakdown = [
  { name: 'Trong nước', value: 52 },
  { name: 'Quốc tế', value: 31 },
  { name: 'Nghỉ dưỡng', value: 17 },
];
const PIE_COLORS = ['#004e9f', '#fe6a34', '#22c55e'];

const topTours = [
  { name: 'Du thuyền Premium Vịnh Hạ Long', revenue: '42.6M₫', bookings: 78, growth: '+18%', up: true },
  { name: 'Thiên đường Maldives: 5 sao',     revenue: '38.1M₫', bookings: 12, growth: '+9%',  up: true },
  { name: 'Nhật Bản: Tokyo – Kyoto',          revenue: '29.4M₫', bookings: 5,  growth: '-4%',  up: false },
  { name: 'Hội An: Phố Cổ & Biển Cửa Đại',   revenue: '18.7M₫', bookings: 56, growth: '+22%', up: true },
  { name: 'Bình minh đỉnh Langbiang',         revenue: '14.3M₫', bookings: 34, growth: '+5%',  up: true },
];

const KPIS = [
  { label: 'Doanh thu tháng này',  value: '248.5M₫', change: '+12.4%', up: true,  icon: 'payments' },
  { label: 'Đặt chỗ mới',          value: '182',      change: '+8.2%',  up: true,  icon: 'confirmation_number' },
  { label: 'Giá trị trung bình/đơn', value: '1.37M₫',  change: '+3.1%',  up: true,  icon: 'trending_up' },
  { label: 'Tỉ lệ hoàn thành',    value: '94.2%',    change: '-0.5%',  up: false, icon: 'task_alt' },
];

const tooltipStyle = {
  borderRadius: '12px',
  border: '1px solid #f1f5f9',
  backgroundColor: 'rgba(255,255,255,0.97)',
  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
  padding: '10px 14px',
};
const tooltipLabelStyle = { fontWeight: 900, color: '#0f172a', fontSize: '10px', textTransform: 'uppercase' as const, marginBottom: '4px' };

export default function AnalyticsNew() {
  return (
    <div className="flex flex-col flex-1 p-6 lg:p-8 overflow-y-auto">

      {/* ── Page header (same pattern as Settings) ── */}
      <header className="mb-6 shrink-0 flex items-end justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2">
            <span>Quản trị</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-secondary">Tài chính</span>
          </nav>
          <h1 className="text-3xl font-black text-on-surface tracking-tight">Tài chính & Doanh thu</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Theo dõi hiệu suất kinh doanh, doanh thu và xu hướng đặt chỗ.
          </p>
        </div>
        <button className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-surface-container-high text-on-surface hover:bg-primary hover:text-white transition-all active:scale-95 shadow-sm border border-black/5">
          <span className="material-symbols-outlined text-[16px]">download</span>
          Xuất báo cáo
        </button>
      </header>

      {/* ── KPI cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0">
        {KPIS.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-3 hover:border-primary/20 transition-all group">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-surface-container-low flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined text-[18px] text-slate-400 group-hover:text-primary transition-colors">{kpi.icon}</span>
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                kpi.up ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-500 border border-red-100'
              }`}>
                <span className="material-symbols-outlined text-[11px]">{kpi.up ? 'arrow_upward' : 'arrow_downward'}</span>
                {kpi.change}
              </span>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1">{kpi.label}</p>
              <p className="text-2xl font-black text-on-surface tracking-tight">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">

        {/* Revenue area chart */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-black text-on-surface tracking-tight">Doanh thu theo tháng</h2>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">So sánh với năm trước</p>
            </div>
            <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest">
              <span className="flex items-center gap-1.5 text-primary">
                <span className="w-3 h-1 rounded-full bg-primary inline-block" />
                Năm nay
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-1 rounded-full bg-slate-300 inline-block" />
                Năm trước
              </span>
            </div>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
                <defs>
                  <linearGradient id="gradCur" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#004e9f" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#004e9f" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradPrev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.1} />
                    <stop offset="100%" stopColor="#94a3b8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 900 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 900 }} width={36} tickFormatter={v => `${v}M`} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} formatter={(v: any) => [`${v}M₫`]} />
                <Area type="monotone" dataKey="prev" stroke="#cbd5e1" strokeWidth={1.5} fill="url(#gradPrev)" dot={false} />
                <Area type="monotone" dataKey="revenue" stroke="#004e9f" strokeWidth={2} fill="url(#gradCur)" dot={false} activeDot={{ r: 5, fill: '#004e9f' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie chart */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-6 flex flex-col">
          <h2 className="text-sm font-black text-on-surface tracking-tight mb-1">Cơ cấu doanh thu</h2>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4">Theo loại tour</p>
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={tourBreakdown} cx="50%" cy="46%" innerRadius={56} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                  {tourBreakdown.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ ...tooltipStyle, padding: '8px 12px' }} formatter={(v: any) => [`${v}%`]} />
                <Legend verticalAlign="bottom" height={32} iconType="circle"
                  formatter={v => <span style={{ fontSize: 9, fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{v}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Top tours table ── */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-on-surface tracking-tight">Tour doanh thu cao nhất</h2>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Tháng hiện tại</p>
          </div>
          <button className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1">
            Xem tất cả
            <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
          </button>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-12 px-6 py-2.5 bg-slate-50/70 border-b border-gray-100">
          <span className="col-span-5 text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">Tour</span>
          <span className="col-span-2 text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 text-right">Doanh thu</span>
          <span className="col-span-2 text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">Đặt chỗ</span>
          <span className="col-span-2 text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">Tăng trưởng</span>
          <span className="col-span-1" />
        </div>

        {topTours.map((tour, i) => (
          <div key={i} className="grid grid-cols-12 px-6 py-3.5 items-center border-b border-gray-50 hover:bg-slate-50/50 transition-colors last:border-b-0">
            <div className="col-span-5 flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
                <span className="text-xs font-black text-primary">{i + 1}</span>
              </div>
              <span className="text-sm font-semibold text-gray-800 truncate">{tour.name}</span>
            </div>
            <span className="col-span-2 text-sm font-black text-on-surface text-right tabular-nums">{tour.revenue}</span>
            <span className="col-span-2 text-sm text-slate-500 font-semibold text-center">{tour.bookings}</span>
            <div className="col-span-2 flex justify-center">
              <span className={`inline-flex items-center gap-0.5 text-[10px] font-black px-2 py-0.5 rounded-full ${
                tour.up ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-500 border border-red-100'
              }`}>
                <span className="material-symbols-outlined text-[11px]">{tour.up ? 'arrow_upward' : 'arrow_downward'}</span>
                {tour.growth}
              </span>
            </div>
            <div className="col-span-1 flex justify-end">
              <button className="w-7 h-7 rounded-lg hover:bg-primary/10 flex items-center justify-center text-slate-300 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom quick stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        {[
          { label: 'Tỷ lệ chuyển đổi', value: '3.4%',   change: '+0.5%', up: true,  icon: 'ads_click' },
          { label: 'Tỷ lệ thoát',       value: '42%',    change: '-2.1%', up: true,  icon: 'leak_remove' },
          { label: 'Thời gian TB',       value: '12m 4s', change: '+1m',   up: true,  icon: 'timer' },
          { label: 'Lượt xem trang',     value: '1.2M',   change: '+140k', up: true,  icon: 'visibility' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-5 flex items-center gap-4 hover:border-primary/20 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
              <span className="material-symbols-outlined text-[18px] text-slate-400 group-hover:text-primary transition-colors">{s.icon}</span>
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400 truncate">{s.label}</p>
              <p className="text-lg font-black text-on-surface tracking-tight">{s.value}</p>
              <p className={`text-[9px] font-bold mt-0.5 ${s.up ? 'text-emerald-500' : 'text-red-400'}`}>{s.change} so với tháng trước</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
