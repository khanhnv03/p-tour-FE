import { Link } from 'react-router-dom';

const customers = [
  {
    id: '#CUST-0001',
    name: 'Alex PTIT',
    email: 'alex@ptittour.com',
    phone: '+84 912 345 678',
    bookings: 3,
    status: 'Đang hoạt động',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuWdojTWLkOZJO7QnZk1Wu_ZBDHhV69mkUS6E1dOq1thfZ2NUGn0cSdWeZ1FuvzSn72heapjOVtZayQZJBBvU4ZfphklLyJCbiZr52vPnEylMd1LVco5vhVXoG9dHED-jLAVTUoKFq-KiV-X05kV55feDmDV_6kBrXStV8VHtrvmnGAinvdD93a7x864zUNI0kOz00y-Z4KfdaqBl4vaFUmcotTZAopEvZ2xXBBbmJalX3FAmhye-kD0t4FHeAWyYs6as61ZOXwas',
  },
  {
    id: '#CUST-9042',
    name: 'Julian Thorne',
    email: 'j.thorne@horizon.com',
    phone: '+1 (555) 012-3456',
    bookings: 14,
    status: 'Đang hoạt động',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnOYBz2CKy_oSmlS3ke3UYQifaljDy6hmDtHVC2YMw-65RF4pLEEc2UVhBCzfFYpCZwhMWKs40dPy8-2fu1W51uDfMBmpCwJmcwyUWTRCMGqxKWN0av4NBCz0d9bUmcg6j-N3977LM4_c-znVaJgDvenGqfk10Wiw3avN2uEZnOyXtfgmbfmxfYIflhtaQGA0zdtXgLFMkP6wg6RYK9okIabCLpzDwfu2Nq5h1tj98QjpceHKfUb4rbDFC4SceezCzjyvly7Uvgqg',
  },
  {
    id: '#CUST-8812',
    name: 'Elena Rodriguez',
    email: 'elena.rod@travel.me',
    phone: '+34 612 90 44 21',
    bookings: 3,
    status: 'Đang hoạt động',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbPFTQrmmee2_96KOSo9_O5kVat0y6gB3DgIoPaDoo1Shxy-3hasDeXGEiwJ0IonbB93WBy4LY0D8BCbvbhtMtvCR8aWwTGEd7FBIEYvj4FOj1qm6o451g0xGjM4hgHLpBGtsxwqc2WARVAsx9mF-JBnfEtgFTOpYfKxn6CbexT_ox3BUm6w7o7hcSaEnXGBPCfs0kwle225Di1QF9tLYWVF1TJy9CC8rO07wTRBEp-3aeBXYkCq3nnmwr-AOONComCGM8e5WgTrg',
  },
  {
    id: '#CUST-7741',
    name: 'Marcus Chen',
    email: 'm.chen@outlook.com',
    phone: '+65 9211 4402',
    bookings: 0,
    status: 'Đã tạm khóa',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANwnYso2a0vcfj-QXp1QhIijPo5Zo_MUltStjH_ADiafr8rDO1V8HvOAOR5ItbjhPIrX74qXPOkFn9Vd9LFDfI86s1lq2dxtbZHRgUWyJ5pXiCe4Bc3lHK7I4Il0Fe9vNMXQO_BXWd6Ah55DNDzwdVk3gv0jdFKpnlY1-BO_rVoZfe5iYwZHgl3A6JEdxLKQpLDqfb9Lufjbk1G-mvWP6ZLvikZBIsd1sS2Qr60KX9m29AYFQd34TnQY0xBkO7BD93H6yzKPbucSc',
  },
  {
    id: '#CUST-1120',
    name: 'Sarah Jenkins',
    email: 's.jenkins@gmail.com',
    phone: '+44 7700 900077',
    bookings: 8,
    status: 'Đang chờ duyệt',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0jzTZPxyUqLm6OM_dQDA3QgP9MLEXBbHRtwQ3EW-9e4KrSZ4Lv9i_WKqUpmFv16aFexuS8lybqMLMhAYH1D27ZsdMPHs_c1ekSGI_0-ASiiscNmr3Ki80jdWftiTVfVCDTAj28e6CT7WQj5NaNkHzfOL6-zKNLikrff_FaIaNCP7iVXsQdNYfPKsi48Gv1D1HXKJCogrjssYLxBycrzszW9FF5dVKHlpPqDnsAeQygF-JUQ14PdOFe_wJCcaSp3qf0OH4MTjV4oY',
  },
];

const activeCount = customers.filter(c => c.status === 'Đang hoạt động').length;
const pendingCount = customers.filter(c => c.status === 'Đang chờ duyệt').length;

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { dot: string; bg: string; text: string }> = {
    'Đang hoạt động': { dot: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700' },
    'Đã tạm khóa':   { dot: 'bg-red-500',     bg: 'bg-red-50',     text: 'text-red-700' },
    'Đang chờ duyệt':{ dot: 'bg-amber-500',   bg: 'bg-amber-50',   text: 'text-amber-700' },
  };
  const s = map[status] ?? map['Đang hoạt động'];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

export default function ManageCustomers() {
  return (
    <div className="flex flex-col flex-1 p-6 lg:p-8 overflow-y-auto gap-6">
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 mb-2">
            <span>Quản trị</span>
            <span className="material-symbols-outlined text-[11px]">chevron_right</span>
            <span className="text-primary">Khách hàng</span>
          </nav>
          <h1 className="text-3xl font-black text-on-surface tracking-tight leading-none">Danh bạ khách hàng</h1>
          <p className="text-slate-400 text-sm font-medium mt-1.5">Quản lý tài khoản người dùng, hồ sơ cá nhân và lịch sử tương tác.</p>
        </div>
        <button className="inline-flex items-center gap-2 border border-primary/20 text-primary font-bold text-xs px-5 py-3 rounded-xl hover:bg-primary/5 transition-all active:scale-95 whitespace-nowrap self-start lg:self-auto">
          <span className="material-symbols-outlined text-sm">download</span>
          Xuất CSV
        </button>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="primary-gradient text-white rounded-2xl shadow-xl shadow-primary/20 p-5 flex flex-col gap-3 relative overflow-hidden">
          <span className="material-symbols-outlined absolute -right-3 -bottom-3 text-[72px] text-white/10 select-none" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Tổng người dùng</span>
          <div className="flex items-baseline gap-2 mt-auto">
            <span className="text-3xl font-black tracking-tight">12,482</span>
            <span className="text-white/60 font-bold text-[10px] uppercase tracking-widest">Tài khoản</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Đang hoạt động</span>
            <span className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-600 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>person_check</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-secondary tracking-tight">843</span>
            <span className="text-emerald-500 font-bold text-[10px] uppercase tracking-widest">Người dùng</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Chờ duyệt</span>
            <span className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-amber-600 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>pending_actions</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600 tracking-tight">{pendingCount}</span>
            <span className="text-amber-500 font-bold text-[10px] uppercase tracking-widest">Tài khoản</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input
            type="text"
            placeholder="Tìm theo tên, email hoặc ID..."
            className="w-full bg-slate-50 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium text-on-surface placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 bg-primary text-white font-bold text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-xl shadow-sm shadow-primary/20 hover:shadow-md transition-all active:scale-95">
            <span className="material-symbols-outlined text-sm">filter_list</span>
            Tất cả
          </button>
          <button className="flex items-center gap-1.5 bg-slate-50 text-slate-500 font-bold text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-all border border-black/5">
            Đang chờ
          </button>
          <button className="flex items-center gap-1.5 bg-slate-50 text-slate-500 font-bold text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-all border border-black/5">
            Đã khóa
          </button>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col flex-1 min-h-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Khách hàng</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Liên hệ</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Đặt chỗ</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Trạng thái</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr key={index} className="border-t border-black/5 hover:bg-slate-50/60 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-100 border-2 border-white shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                        <img src={customer.avatar} alt={customer.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-on-surface text-sm">{customer.name}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">ID: {customer.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <p className="font-semibold text-on-surface">{customer.email}</p>
                    <p className="text-slate-400 mt-0.5 text-xs">{customer.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xl font-black text-primary font-mono tracking-tighter">{customer.bookings}</span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={customer.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-20 group-hover:opacity-100 transition-all">
                      <Link
                        to={`/admin/customers/${customer.id}`}
                        className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-all"
                        title="Xem chi tiết"
                      >
                        <span className="material-symbols-outlined text-base">visibility</span>
                      </Link>
                      <button className="p-2 hover:bg-slate-100 text-slate-400 rounded-lg transition-all" title="Chỉnh sửa">
                        <span className="material-symbols-outlined text-base">edit</span>
                      </button>
                      <button className="p-2 hover:bg-red-50 text-red-400 rounded-lg transition-all" title="Chặn tài khoản">
                        <span className="material-symbols-outlined text-base">block</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            Hiển thị <span className="text-on-surface">1–5</span> trong <span className="text-on-surface">12.482</span> khách hàng
          </p>
          <div className="flex items-center gap-1.5 font-mono">
            <button className="p-2 rounded-lg hover:bg-white text-slate-400 disabled:opacity-30 transition-all border border-black/5" disabled>
              <span className="material-symbols-outlined text-base">chevron_left</span>
            </button>
            <button className="w-9 h-9 rounded-lg bg-primary text-white text-sm font-black shadow-sm shadow-primary/20">1</button>
            <button className="w-9 h-9 rounded-lg hover:bg-white text-slate-400 text-sm font-bold transition-all border border-black/5">2</button>
            <button className="w-9 h-9 rounded-lg hover:bg-white text-slate-400 text-sm font-bold transition-all border border-black/5">3</button>
            <span className="px-1 text-slate-400 text-sm">...</span>
            <button className="w-9 h-9 rounded-lg hover:bg-white text-slate-400 text-sm font-bold transition-all border border-black/5">312</button>
            <button className="p-2 rounded-lg hover:bg-white text-slate-400 transition-all border border-black/5">
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
