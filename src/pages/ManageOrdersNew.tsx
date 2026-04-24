import { useState } from 'react';
import { Link } from 'react-router-dom';

const orders = [
  { id: 'BK-1934',  customer: 'Alex PTIT',          tour: 'Bình minh trên đỉnh Langbiang',              amount: '27.930.000₫', status: 'Đã thanh toán', date: '12/11/2026' },
  { id: 'VA-88292', customer: 'Nguyễn Thảo Trang',  tour: 'Nhật Bản: Cung đường vàng Tokyo – Kyoto',    amount: '65.000.000₫', status: 'Đang xử lý',    date: '20/04/2026' },
  { id: 'VA-88293', customer: 'David Wilson',        tour: 'Thiên đường Maldives: Nghỉ dưỡng 5 sao',    amount: '91.800.000₫', status: 'Đã hoàn tiền',  date: '02/04/2026' },
  { id: 'VA-88294', customer: 'Lê Minh Anh',        tour: 'Du thuyền Premium Vịnh Hạ Long',             amount: '10.920.000₫', status: 'Đã thanh toán', date: '18/03/2026' },
];

const STATS = [
  { label: 'Tổng doanh thu',  value: '1.2B ₫',  icon: 'account_balance_wallet', trend: '+12%', up: true  },
  { label: 'Chờ thanh toán',  value: '84M ₫',   icon: 'pending',                trend: '-2%',  up: false },
  { label: 'Đơn hàng TB',     value: '28M ₫',   icon: 'bar_chart',              trend: '+5%',  up: true  },
  { label: 'Đã hoàn tiền',    value: '12M ₫',   icon: 'undo',                   trend: '0%',   up: null  },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    'Đã thanh toán': 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    'Đang xử lý':   'bg-amber-50   text-amber-700   border border-amber-100',
    'Đã hoàn tiền': 'bg-red-50     text-red-700     border border-red-100',
  };
  return (
    <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${map[status] ?? 'bg-slate-50 text-slate-500'}`}>
      {status}
    </span>
  );
}

export default function ManageOrders() {
  const [search, setSearch] = useState('');
  const filtered = orders.filter(o =>
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col flex-1 p-6 lg:p-8 overflow-y-auto gap-6">
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 mb-2">
            <span>Quản trị</span>
            <span className="material-symbols-outlined text-[11px]">chevron_right</span>
            <span className="text-primary">Đơn hàng</span>
          </nav>
          <h1 className="text-3xl font-black text-on-surface tracking-tight leading-none">Quản lý Đơn hàng</h1>
          <p className="text-slate-400 text-sm font-medium mt-1.5">Lịch sử toàn diện của các giao dịch và trải nghiệm theo thời gian thực.</p>
        </div>
        <button className="inline-flex items-center gap-2 border border-black/10 text-on-surface font-bold text-xs px-5 py-3 rounded-xl hover:bg-slate-50 transition-all active:scale-95 whitespace-nowrap self-start lg:self-auto">
          <span className="material-symbols-outlined text-sm">payments</span>
          Cổng thanh toán
        </button>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <div
            key={i}
            className={`rounded-2xl p-5 flex flex-col gap-3 ${i === 0 ? 'primary-gradient text-white shadow-xl shadow-primary/20 relative overflow-hidden' : 'bg-white border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)]'}`}
          >
            {i === 0 && (
              <span className="material-symbols-outlined absolute -right-3 -bottom-3 text-[72px] text-white/10 select-none" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
            )}
            <div className="flex items-center justify-between">
              {i === 0 ? (
                <span className="text-[10px] font-black uppercase tracking-widest text-white/70">{stat.label}</span>
              ) : (
                <>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</span>
                  <span className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>{stat.icon}</span>
                  </span>
                </>
              )}
            </div>
            <div className="flex items-baseline justify-between mt-auto">
              <span className={`text-2xl font-black tracking-tight ${i === 0 ? '' : 'text-on-surface'}`}>{stat.value}</span>
              {stat.trend !== '0%' ? (
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${
                  stat.up === true
                    ? i === 0 ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700'
                    : i === 0 ? 'bg-white/20 text-white' : 'bg-red-50 text-red-600'
                }`}>{stat.trend}</span>
              ) : (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-slate-50 text-slate-500">{stat.trend}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Search bar */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-3 flex gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm theo ID, khách hàng..."
            className="w-full bg-slate-50 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <button className="flex items-center gap-1.5 bg-slate-50 text-slate-500 font-bold text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-all border border-black/5">
          <span className="material-symbols-outlined text-sm">filter_list</span>
          Lọc
        </button>
        <button className="flex items-center gap-1.5 border border-primary/20 text-primary font-bold text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-xl hover:bg-primary/5 transition-all ml-auto">
          <span className="material-symbols-outlined text-sm">download</span>
          Xuất CSV
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col flex-1 min-h-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">ID đơn hàng</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Khách hàng</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Trải nghiệm</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Trạng thái</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Số tiền</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr key={order.id} className="border-t border-black/5 hover:bg-slate-50/60 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-black font-mono text-sm text-on-surface tracking-tight">{order.id}</span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{order.date}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-sm text-on-surface">{order.customer}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-500 font-medium max-w-[260px] truncate">{order.tour}</p>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-black text-sm text-on-surface tracking-tight">{order.amount}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-slate-100 hover:bg-primary hover:text-white text-slate-600 px-3 py-1.5 rounded-lg transition-all"
                    >
                      Kiểm toán
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-slate-50/50 border-t border-black/5 flex items-center justify-between gap-4 mt-auto">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            Hiển thị <span className="text-on-surface">{filtered.length}</span> trong <span className="text-on-surface">2.490</span> giao dịch
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white rounded-lg border border-black/5 font-bold text-xs text-slate-500 hover:bg-slate-50 transition-all shadow-sm" disabled>Trước</button>
            <button className="px-4 py-2 bg-white rounded-lg border border-black/5 font-bold text-xs text-slate-500 hover:bg-slate-50 transition-all shadow-sm">Sau</button>
          </div>
        </div>
      </div>
    </div>
  );
}
