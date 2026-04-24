import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  getBookingAnalytics,
  getDashboardSummary,
  getRecentBookings,
  getRevenueAnalytics,
  getTopTours,
  type BookingAnalytics,
  type DashboardSummary,
  type TimeSeriesPoint,
  type TopTour,
} from '../api/admin';
import type { Booking, BookingStatus } from '../api/bookings';

type ChartPoint = {
  date: string;
  day: string;
  revenue: number;
  bookings: number;
};

const STATUS_MAP: Record<BookingStatus, { label: string; bg: string; text: string; border: string }> = {
  CONFIRMED: { label: 'Xác nhận', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
  PENDING: { label: 'Chờ duyệt', bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
  CANCELLED: { label: 'Huỷ', bg: 'bg-red-50', text: 'text-red-500', border: 'border-red-100' },
  COMPLETED: { label: 'Hoàn tất', bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
};

const QUICK_ACTIONS = [
  { label: 'Tạo Tour mới', icon: 'add_circle', to: '/admin/tours/new', color: 'text-primary bg-blue-50' },
  { label: 'Xem đặt chỗ', icon: 'list_alt', to: '/admin/orders', color: 'text-amber-600 bg-amber-50' },
  { label: 'Quản lý khách hàng', icon: 'manage_accounts', to: '/admin/customers', color: 'text-violet-600 bg-violet-50' },
  { label: 'Tạo ưu đãi', icon: 'sell', to: '/admin/deals/new', color: 'text-emerald-600 bg-emerald-50' },
];

const TOUR_COLORS = ['#004e9f', '#0066cc', '#2563eb', '#3b82f6', '#60a5fa'];

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

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatCurrency(value: number) {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })}Bđ`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })}Mđ`;
  }
  return `${value.toLocaleString('vi-VN')}đ`;
}

function formatFullCurrency(value: number) {
  return `${value.toLocaleString('vi-VN')}đ`;
}

function formatPercent(value: number) {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toLocaleString('vi-VN', { maximumFractionDigits: 1 })}%`;
}

function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'NA';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

function buildSevenDayChart(revenue: TimeSeriesPoint[], bookings: TimeSeriesPoint[]): ChartPoint[] {
  const today = startOfLocalDay(new Date());
  const start = addDays(today, -6);
  const revenueByDate = new Map(revenue.map((point) => [point.date, Number(point.value)]));
  const bookingsByDate = new Map(bookings.map((point) => [point.date, Number(point.value)]));

  return Array.from({ length: 7 }, (_, index) => {
    const current = addDays(start, index);
    const key = dateKey(current);
    return {
      date: key,
      day: current.toLocaleDateString('vi-VN', { weekday: 'short' }).replace('Th ', 'T'),
      revenue: Number(((revenueByDate.get(key) || 0) / 1_000_000).toFixed(2)),
      bookings: bookingsByDate.get(key) || 0,
    };
  });
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex min-h-[120px] items-center justify-center text-xs font-semibold text-slate-400">
      {label}
    </div>
  );
}

export default function DashboardNew() {
  const today = new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [bookingAnalytics, setBookingAnalytics] = useState<BookingAnalytics | null>(null);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [topTours, setTopTours] = useState<TopTour[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const todayDate = startOfLocalDay(new Date());
    const from = dateKey(addDays(todayDate, -6));
    const to = dateKey(todayDate);

    setLoading(true);
    setError(null);
    Promise.all([
      getDashboardSummary(),
      getRevenueAnalytics({ from, to }),
      getBookingAnalytics({ from, to }),
      getTopTours(5),
      getRecentBookings({ page: 0, size: 5 }),
    ])
      .then(([summaryData, revenueData, bookingData, topTourData, recentBookingData]) => {
        setSummary(summaryData);
        setBookingAnalytics(bookingData);
        setChartData(buildSevenDayChart(revenueData, bookingData.dailyBookings));
        setTopTours(topTourData);
        setRecentBookings(recentBookingData.content);
      })
      .catch(() => {
        setError('Không tải được dữ liệu tổng quan. Vui lòng kiểm tra BE hoặc phiên đăng nhập admin.');
      })
      .finally(() => setLoading(false));
  }, []);

  const completionRate = useMemo(() => {
    if (!bookingAnalytics || bookingAnalytics.totalBookings === 0) return 0;
    return (bookingAnalytics.completedBookings / bookingAnalytics.totalBookings) * 100;
  }, [bookingAnalytics]);

  const totalStatusBookings = bookingAnalytics?.totalBookings || 0;
  const statusRows = [
    { label: 'Đã xác nhận', value: bookingAnalytics?.confirmedBookings || 0, total: totalStatusBookings, color: 'bg-emerald-500' },
    { label: 'Chờ duyệt', value: bookingAnalytics?.pendingBookings || 0, total: totalStatusBookings, color: 'bg-amber-400' },
    { label: 'Đã huỷ', value: bookingAnalytics?.cancelledBookings || 0, total: totalStatusBookings, color: 'bg-red-400' },
  ];

  const kpis = [
    {
      label: 'Tổng doanh thu',
      value: summary ? formatCurrency(Number(summary.revenue)) : '--',
      badge: summary ? formatPercent(summary.revenueGrowthPercent) : '--',
      tone: (summary?.revenueGrowthPercent || 0) >= 0 ? 'up' : 'down',
      icon: 'payments',
      accent: 'bg-blue-50 text-primary',
    },
    {
      label: 'Đặt chỗ tháng này',
      value: summary ? summary.monthlyBookings.toLocaleString('vi-VN') : '--',
      badge: 'Tháng này',
      tone: 'neutral',
      icon: 'confirmation_number',
      accent: 'bg-orange-50 text-secondary',
    },
    {
      label: 'Tour đang hoạt động',
      value: summary ? summary.activeTours.toLocaleString('vi-VN') : '--',
      badge: 'Published',
      tone: 'neutral',
      icon: 'travel_explore',
      accent: 'bg-violet-50 text-violet-600',
    },
    {
      label: 'Điểm đánh giá TB',
      value: summary ? `${Number(summary.averageRating).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} / 5` : '--',
      badge: 'Realtime',
      tone: 'neutral',
      icon: 'star',
      accent: 'bg-amber-50 text-amber-500',
    },
  ];

  return (
    <div className="flex flex-col flex-1 p-6 lg:p-8 overflow-y-auto gap-6">
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

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        {kpis.map((kpi) => {
          const badgeClass = kpi.tone === 'down'
            ? 'bg-red-50 text-red-500 border border-red-100'
            : kpi.tone === 'up'
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
              : 'bg-slate-50 text-slate-500 border border-slate-100';
          return (
            <div key={kpi.label} className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-3 hover:border-primary/20 transition-all group">
              <div className="flex items-center justify-between">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${kpi.accent}`}>
                  <span className="material-symbols-outlined text-[18px]">{kpi.icon}</span>
                </div>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 ${badgeClass}`}>
                  {kpi.tone !== 'neutral' && (
                    <span className="material-symbols-outlined text-[11px]">{kpi.tone === 'up' ? 'arrow_upward' : 'arrow_downward'}</span>
                  )}
                  {loading ? '...' : kpi.badge}
                </span>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400 mb-1">{kpi.label}</p>
                <p className="text-2xl font-black text-on-surface tracking-tight">{loading ? '...' : kpi.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
            {chartData.length === 0 && !loading ? (
              <EmptyState label="Chưa có dữ liệu biểu đồ" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
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
                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelStyle={tooltipLabelStyle}
                    formatter={(v: any, name: string) => [name === 'revenue' ? `${v}Mđ` : v, name === 'revenue' ? 'Doanh thu' : 'Đặt chỗ']}
                  />
                  <Area type="monotone" dataKey="bookings" stroke="#fe6a34" strokeWidth={1.5} fill="url(#dbGradBook)" dot={false} />
                  <Area type="monotone" dataKey="revenue" stroke="#004e9f" strokeWidth={2} fill="url(#dbGradRev)" dot={false} activeDot={{ r: 5, fill: '#004e9f' }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-6 flex flex-col">
          <div className="mb-5">
            <h2 className="text-sm font-black text-on-surface tracking-tight">Tour hiệu suất cao</h2>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Tỉ lệ lấp đầy</p>
          </div>
          <div className="flex flex-col gap-5 flex-1 justify-between">
            {topTours.length === 0 && !loading ? (
              <EmptyState label="Chưa có tour hiệu suất cao" />
            ) : (
              topTours.map((tour, index) => {
                const pct = Math.min(100, Math.max(0, Math.round(tour.fillRatePercent || 0)));
                return (
                  <div key={tour.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-slate-600 truncate pr-3">{tour.title}</span>
                      <span className="text-xs font-black text-primary shrink-0">{pct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: TOUR_COLORS[index % TOUR_COLORS.length] }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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

          <div className="grid grid-cols-12 px-6 py-2.5 bg-slate-50/70 border-b border-gray-100">
            <span className="col-span-4 text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">Khách hàng</span>
            <span className="col-span-4 text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">Tour</span>
            <span className="col-span-2 text-[9px] font-black uppercase tracking-[0.14em] text-slate-400 text-right">Giá trị</span>
            <span className="col-span-2 text-[9px] font-black uppercase tracking-[0.14em] text-slate-400 text-right">Trạng thái</span>
          </div>

          {recentBookings.length === 0 && !loading ? (
            <EmptyState label="Chưa có đặt chỗ gần đây" />
          ) : (
            recentBookings.map((booking) => {
              const status = STATUS_MAP[booking.status] || STATUS_MAP.PENDING;
              const customerName = booking.contactName || booking.userName || 'Khách hàng';
              return (
                <div key={booking.id} className="grid grid-cols-12 px-6 py-3 items-center border-b border-gray-50 hover:bg-slate-50/50 transition-colors last:border-b-0">
                  <div className="col-span-4 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary shrink-0">
                      {initials(customerName)}
                    </div>
                    <span className="text-sm font-semibold text-gray-800 truncate">{customerName}</span>
                  </div>
                  <div className="col-span-4">
                    <span className="text-xs text-slate-500 font-medium truncate block pr-2">{booking.tourTitle}</span>
                    <span className="text-[9px] text-slate-400 font-medium">
                      {new Date(booking.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <span className="col-span-2 text-sm font-black text-on-surface text-right tabular-nums">{formatFullCurrency(Number(booking.totalAmount))}</span>
                  <div className="col-span-2 flex justify-end">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${status.bg} ${status.text} ${status.border}`}>
                      {status.label}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-5">
            <h2 className="text-sm font-black text-on-surface tracking-tight mb-4">Thao tác nhanh</h2>
            <div className="grid grid-cols-2 gap-2.5">
              {QUICK_ACTIONS.map((action) => (
                <Link
                  key={action.label}
                  to={action.to}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border border-black/5 hover:border-primary/20 hover:bg-slate-50/60 transition-all group"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[18px] ${action.color}`}>
                    <span className="material-symbols-outlined text-[18px]">{action.icon}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 text-center leading-tight">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-5 flex-1">
            <h2 className="text-sm font-black text-on-surface tracking-tight mb-4">Trạng thái đặt chỗ</h2>
            <div className="flex flex-col gap-3">
              {statusRows.map((item) => {
                const width = item.total === 0 ? 0 : Math.round((item.value / item.total) * 100);
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${item.color}`} />
                        <span className="text-xs font-semibold text-slate-600">{item.label}</span>
                      </div>
                      <span className="text-xs font-black text-on-surface">{loading ? '...' : item.value.toLocaleString('vi-VN')}
                        <span className="text-[9px] font-semibold text-slate-400 ml-1">/ {item.total.toLocaleString('vi-VN')}</span>
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${width}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 primary-gradient rounded-xl p-4 relative overflow-hidden">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/70 mb-1">Hiệu suất tháng này</p>
              <p className="text-2xl font-black text-white tracking-tight">{loading ? '...' : `${completionRate.toLocaleString('vi-VN', { maximumFractionDigits: 1 })}%`}</p>
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
