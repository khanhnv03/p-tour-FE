import { useEffect, useMemo, useState } from 'react';
import {
  Area, AreaChart, CartesianGrid, Cell, Legend, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import {
  exportAnalytics,
  getBookingAnalytics,
  getConversionAnalytics,
  getDashboardSummary,
  getRevenueAnalytics,
  getTopTours,
  type BookingAnalytics,
  type ConversionAnalytics,
  type DashboardSummary,
  type TimeSeriesPoint,
  type TopTour,
} from '../api/admin';
import { extractApiErrorMessage } from '../api/types';

type RangePreset = '30D' | 'MONTH' | 'YEAR';

const PIE_COLORS = ['#2563eb', '#f59e0b', '#ef4444', '#10b981'];

const tooltipStyle = {
  borderRadius: '12px',
  border: '1px solid #f1f5f9',
  backgroundColor: 'rgba(255,255,255,0.97)',
  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
  padding: '10px 14px',
};
const tooltipLabelStyle = { fontWeight: 900, color: '#0f172a', fontSize: '10px', textTransform: 'uppercase' as const, marginBottom: '4px' };

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getRange(preset: RangePreset) {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start = new Date(end);
  if (preset === '30D') {
    start.setDate(start.getDate() - 29);
  } else if (preset === 'MONTH') {
    start.setDate(1);
  } else {
    start.setMonth(0, 1);
  }
  return { from: toIsoDate(start), to: toIsoDate(end) };
}

function formatCurrency(value: number) {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)} tỷ`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}Mđ`;
  return `${Math.round(value).toLocaleString('vi-VN')}đ`;
}

function formatPercent(value: number) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}

function fillRevenueSeries(points: TimeSeriesPoint[], from: string, to: string) {
  const byDate = new Map(points.map(point => [point.date, Number(point.value)]));
  const result: { label: string; revenue: number }[] = [];
  const cursor = new Date(from);
  const end = new Date(to);
  while (cursor <= end) {
    const key = toIsoDate(cursor);
    result.push({
      label: cursor.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
      revenue: Number(((byDate.get(key) || 0) / 1_000_000).toFixed(2)),
    });
    cursor.setDate(cursor.getDate() + 1);
  }
  return result;
}

export default function AnalyticsNew() {
  const [preset, setPreset] = useState<RangePreset>('30D');
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [revenue, setRevenue] = useState<TimeSeriesPoint[]>([]);
  const [bookings, setBookings] = useState<BookingAnalytics | null>(null);
  const [conversion, setConversion] = useState<ConversionAnalytics | null>(null);
  const [topTours, setTopTours] = useState<TopTour[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportMessage, setExportMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const range = useMemo(() => getRange(preset), [preset]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      getDashboardSummary(),
      getRevenueAnalytics(range),
      getBookingAnalytics(range),
      getConversionAnalytics(range),
      getTopTours(5),
    ])
      .then(([summaryData, revenueData, bookingData, conversionData, topTourData]) => {
        if (cancelled) return;
        setSummary(summaryData);
        setRevenue(revenueData);
        setBookings(bookingData);
        setConversion(conversionData);
        setTopTours(topTourData);
      })
      .catch(() => {
        if (!cancelled) setError('Không thể tải dữ liệu phân tích.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [range]);

  const chartData = useMemo(() => fillRevenueSeries(revenue, range.from, range.to), [range, revenue]);
  const rangeRevenue = useMemo(() => revenue.reduce((sum, point) => sum + Number(point.value || 0), 0), [revenue]);
  const completionRate = bookings?.totalBookings ? (bookings.completedBookings / bookings.totalBookings) * 100 : 0;
  const averagePaidOrder = conversion?.paidOrders ? rangeRevenue / conversion.paidOrders : 0;

  const bookingBreakdown = [
    { name: 'Đã xác nhận', value: bookings?.confirmedBookings || 0 },
    { name: 'Chờ xử lý', value: bookings?.pendingBookings || 0 },
    { name: 'Đã hủy', value: bookings?.cancelledBookings || 0 },
    { name: 'Hoàn tất', value: bookings?.completedBookings || 0 },
  ];

  const kpis = [
    { label: 'Doanh thu trong kỳ', value: formatCurrency(rangeRevenue), change: summary ? formatPercent(summary.revenueGrowthPercent) : '--', up: (summary?.revenueGrowthPercent || 0) >= 0, icon: 'payments' },
    { label: 'Đặt chỗ trong kỳ', value: String(bookings?.totalBookings ?? 0), change: `${summary?.monthlyBookings ?? 0} tháng này`, up: true, icon: 'confirmation_number' },
    { label: 'Giá trị TB/đơn paid', value: formatCurrency(averagePaidOrder), change: `${conversion?.paidOrders ?? 0} đơn paid`, up: true, icon: 'trending_up' },
    { label: 'Tỉ lệ hoàn thành', value: `${completionRate.toFixed(1)}%`, change: `${bookings?.completedBookings ?? 0}/${bookings?.totalBookings ?? 0}`, up: completionRate >= 50, icon: 'task_alt' },
  ];

  const bottomStats = [
    { label: 'Tỷ lệ thanh toán', value: `${(conversion?.paymentConversionRate || 0).toFixed(1)}%`, note: `${conversion?.paidOrders || 0} paid / ${conversion?.totalBookings || 0} booking`, icon: 'ads_click' },
    { label: 'Đơn chờ thanh toán', value: String(conversion?.pendingOrders || 0), note: 'Trong khoảng đã chọn', icon: 'pending_actions' },
    { label: 'Booking chờ xử lý', value: String(bookings?.pendingBookings || 0), note: 'Trong khoảng đã chọn', icon: 'hourglass_top' },
    { label: 'Liên hệ mới', value: String(summary?.newContacts || 0), note: `${summary?.newsletterSubscribers || 0} subscriber đang active`, icon: 'mark_email_unread' },
  ];

  async function handleExport() {
    setExporting(true);
    setExportMessage(null);
    try {
      const blob = await exportAnalytics(range);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics-${range.from}-${range.to}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
      setExportMessage({ ok: true, text: `Đã bắt đầu tải file analytics-${range.from}-${range.to}.csv.` });
    } catch (exportError: unknown) {
      setExportMessage({ ok: false, text: extractApiErrorMessage(exportError, 'Xuất báo cáo thất bại. Vui lòng thử lại.') });
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="flex flex-col flex-1 p-6 lg:p-8 overflow-y-auto">
      <header className="mb-6 shrink-0 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2">
            <span>Quản trị</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-secondary">Phân tích</span>
          </nav>
          <h1 className="text-3xl font-black text-on-surface tracking-tight">Tài chính & Doanh thu</h1>
          <p className="text-on-surface-variant text-sm mt-1">Theo dõi doanh thu, booking và hiệu suất vận hành theo dữ liệu thực.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {([
            { value: '30D' as const, label: '30 ngày' },
            { value: 'MONTH' as const, label: 'Tháng này' },
            { value: 'YEAR' as const, label: 'Năm nay' },
          ]).map(item => (
            <button
              key={item.value}
              onClick={() => setPreset(item.value)}
              className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${
                preset === item.value ? 'bg-primary text-white border-primary' : 'bg-white text-slate-500 border-black/5 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={handleExport}
            disabled={exporting}
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-surface-container-high text-on-surface hover:bg-primary hover:text-white transition-all active:scale-95 shadow-sm border border-black/5 disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-[16px]">{exporting ? 'progress_activity' : 'download'}</span>
            Xuất báo cáo
          </button>
        </div>
      </header>

      {error && (
        <div className="mb-6 bg-red-50 text-red-600 border border-red-100 rounded-2xl px-5 py-4 text-sm font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-base">error</span>
          {error}
        </div>
      )}

      {exportMessage && (
        <div className={`mb-6 rounded-2xl px-5 py-4 text-sm font-bold flex items-center gap-2 border ${exportMessage.ok ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-100'}`}>
          <span className="material-symbols-outlined text-base">{exportMessage.ok ? 'task_alt' : 'error'}</span>
          {exportMessage.text}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0">
        {kpis.map(kpi => (
          <div key={kpi.label} className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-3 hover:border-primary/20 transition-all group">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-surface-container-low flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined text-[18px] text-slate-400 group-hover:text-primary transition-colors">{kpi.icon}</span>
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                kpi.up ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-500 border border-red-100'
              }`}>
                {kpi.change}
              </span>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1">{kpi.label}</p>
              <p className="text-2xl font-black text-on-surface tracking-tight">{loading ? '--' : kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <div className="lg:col-span-8 bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-black text-on-surface tracking-tight">Doanh thu theo ngày</h2>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{range.from} đến {range.to}</p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">{formatCurrency(rangeRevenue)}</span>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
                <defs>
                  <linearGradient id="analyticsRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#004e9f" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#004e9f" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 900 }} dy={10} interval="preserveStartEnd" />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 900 }} width={42} tickFormatter={v => `${v}M`} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} formatter={(v: any) => [`${v}Mđ`, 'Doanh thu']} />
                <Area type="monotone" dataKey="revenue" stroke="#004e9f" strokeWidth={2} fill="url(#analyticsRevenue)" dot={false} activeDot={{ r: 5, fill: '#004e9f' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-6 flex flex-col">
          <h2 className="text-sm font-black text-on-surface tracking-tight mb-1">Cơ cấu booking</h2>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4">Theo trạng thái trong kỳ</p>
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={bookingBreakdown} cx="50%" cy="46%" innerRadius={56} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                  {bookingBreakdown.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ ...tooltipStyle, padding: '8px 12px' }} formatter={(v: any) => [v, 'Booking']} />
                <Legend verticalAlign="bottom" height={32} iconType="circle"
                  formatter={v => <span style={{ fontSize: 9, fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{v}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-on-surface tracking-tight">Tour bán chạy</h2>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Theo số booking và tỉ lệ lấp đầy</p>
          </div>
        </div>

        <div className="grid grid-cols-12 px-6 py-2.5 bg-slate-50/70 border-b border-gray-100">
          <span className="col-span-5 text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">Tour</span>
          <span className="col-span-2 text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">Điểm đến</span>
          <span className="col-span-2 text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">Đặt chỗ</span>
          <span className="col-span-2 text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">Lấp đầy</span>
          <span className="col-span-1 text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 text-right">Rating</span>
        </div>

        {topTours.length === 0 && (
          <div className="px-6 py-10 text-center text-slate-400 text-sm font-bold">Chưa có dữ liệu tour bán chạy.</div>
        )}

        {topTours.map((tour, i) => (
          <div key={tour.id} className="grid grid-cols-12 px-6 py-3.5 items-center border-b border-gray-50 hover:bg-slate-50/50 transition-colors last:border-b-0">
            <div className="col-span-5 flex items-center gap-3 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
                <span className="text-xs font-black text-primary">{i + 1}</span>
              </div>
              <span className="text-sm font-semibold text-gray-800 truncate">{tour.title}</span>
            </div>
            <span className="col-span-2 text-xs text-slate-500 font-semibold text-center truncate">{tour.destinationName}</span>
            <span className="col-span-2 text-sm text-slate-500 font-semibold text-center">{tour.bookingCount}</span>
            <div className="col-span-2 flex justify-center">
              <span className="inline-flex items-center gap-0.5 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                {tour.fillRatePercent.toFixed(1)}%
              </span>
            </div>
            <span className="col-span-1 text-sm font-black text-on-surface text-right tabular-nums">{Number(tour.rating).toFixed(1)}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        {bottomStats.map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-5 flex items-center gap-4 hover:border-primary/20 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
              <span className="material-symbols-outlined text-[18px] text-slate-400 group-hover:text-primary transition-colors">{stat.icon}</span>
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400 truncate">{stat.label}</p>
              <p className="text-lg font-black text-on-surface tracking-tight">{loading ? '--' : stat.value}</p>
              <p className="text-[9px] font-bold mt-0.5 text-slate-400 truncate">{stat.note}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
