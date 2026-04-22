import { Link } from 'react-router-dom';

const customers = [
  {
    id: '#CUST-0001',
    name: 'Alex PTIT',
    email: 'alex@ptittour.com',
    phone: '+84 912 345 678',
    bookings: 3,
    status: 'Đang hoạt động',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuWdojTWLkOZJO7QnZk1Wu_ZBDHhV69mkUS6E1dOq1thfZ2NUGn0cSdWeZ1FuvzSn72heapjOVtZayQZJBBvU4ZfphklLyJCbiZr52vPnEylMd1LVco5vhVXoG9dHED-jLAVTUoKFq-KiV-X05kV55feDmDV_6kBrXStV8VHtrvmnGAinvdD93a7x864zUNI0kOz00y-Z4KfdaqBl4vaFUmcotTZAopEvZ2xXBBbmJalX3FAmhye-kD0t4FHeAWyYs6as61ZOXwas'
  },
  {
    id: '#CUST-9042',
    name: 'Julian Thorne',
    email: 'j.thorne@horizon.com',
    phone: '+1 (555) 012-3456',
    bookings: 14,
    status: 'Đang hoạt động',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnOYBz2CKy_oSmlS3ke3UYQifaljDy6hmDtHVC2YMw-65RF4pLEEc2UVhBCzfFYpCZwhMWKs40dPy8-2fu1W51uDfMBmpCwJmcwyUWTRCMGqxKWN0av4NBCz0d9bUmcg6j-N3977LM4_c-znVaJgDvenGqfk10Wiw3avN2uEZnOyXtfgmbfmxfYIflhtaQGA0zdtXgLFMkP6wg6RYK9okIabCLpzDwfu2Nq5h1tj98QjpceHKfUb4rbDFC4SceezCzjyvly7Uvgqg'
  },
  {
    id: '#CUST-8812',
    name: 'Elena Rodriguez',
    email: 'elena.rod@travel.me',
    phone: '+34 612 90 44 21',
    bookings: 3,
    status: 'Đang hoạt động',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbPFTQrmmee2_96KOSo9_O5kVat0y6gB3DgIoPaDoo1Shxy-3hasDeXGEiwJ0IonbB93WBy4LY0D8BCbvbhtMtvCR8aWwTGEd7FBIEYvj4FOj1qm6o451g0xGjM4hgHLpBGtsxwqc2WARVAsx9mF-JBnfEtgFTOpYfKxn6CbexT_ox3BUm6w7o7hcSaEnXGBPCfs0kwle225Di1QF9tLYWVF1TJy9CC8rO07wTRBEp-3aeBXYkCq3nnmwr-AOONComCGM8e5WgTrg'
  },
  {
    id: '#CUST-7741',
    name: 'Marcus Chen',
    email: 'm.chen@outlook.com',
    phone: '+65 9211 4402',
    bookings: 0,
    status: 'Đã tạm khóa',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANwnYso2a0vcfj-QXp1QhIijPo5Zo_MUltStjH_ADiafr8rDO1V8HvOAOR5ItbjhPIrX74qXPOkFn9Vd9LFDfI86s1lq2dxtbZHRgUWyJ5pXiCe4Bc3lHK7I4Il0Fe9vNMXQO_BXWd6Ah55DNDzwdVk3gv0jdFKpnlY1-BO_rVoZfe5iYwZHgl3A6JEdxLKQpLDqfb9Lufjbk1G-mvWP6ZLvikZBIsd1sS2Qr60KX9m29AYFQd34TnQY0xBkO7BD93H6yzKPbucSc'
  },
  {
    id: '#CUST-1120',
    name: 'Sarah Jenkins',
    email: 's.jenkins@gmail.com',
    phone: '+44 7700 900077',
    bookings: 8,
    status: 'Đang chờ duyệt',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0jzTZPxyUqLm6OM_dQDA3QgP9MLEXBbHRtwQ3EW-9e4KrSZ4Lv9i_WKqUpmFv16aFexuS8lybqMLMhAYH1D27ZsdMPHs_c1ekSGI_0-ASiiscNmr3Ki80jdWftiTVfVCDTAj28e6CT7WQj5NaNkHzfOL6-zKNLikrff_FaIaNCP7iVXsQdNYfPKsi48Gv1D1HXKJCogrjssYLxBycrzszW9FF5dVKHlpPqDnsAeQygF-JUQ14PdOFe_wJCcaSp3qf0OH4MTjV4oY'
  }
];

export default function ManageCustomers() {
  return (
    <div className="p-10 max-w-[1600px] mx-auto space-y-10">
      {/* Header Section */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-4">
        <div>
          <nav className="flex items-center space-x-2 text-on-surface-variant text-[10px] font-black uppercase tracking-[0.2em] mb-3">
            <span>Quản trị</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-primary">Quản lý khách hàng</span>
          </nav>
          <h2 className="text-3xl font-black tracking-tight text-on-surface">Danh bạ khách hàng</h2>
          <p className="text-on-surface-variant mt-2 max-w-md text-sm leading-relaxed font-medium">
            Quản lý tài khoản người dùng, hồ sơ cá nhân và lịch sử tương tác trên toàn bộ nền tảng.
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-4">
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_8px_32px_0_rgba(25,28,29,0.04)] min-w-[160px] border border-outline-variant/5">
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-black mb-1">Tổng người dùng</p>
            <p className="text-3xl font-black text-primary tracking-tighter">12,482</p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_8px_32px_0_rgba(25,28,29,0.04)] min-w-[160px] border border-outline-variant/5">
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-black mb-1">Đang hoạt động</p>
            <p className="text-3xl font-black text-secondary tracking-tighter">843</p>
          </div>
        </div>
      </header>

      {/* Filters & Search Bar */}
      <section className="bg-white rounded-3xl p-4 flex flex-wrap items-center gap-4 shadow-[0_8px_32px_0_rgba(25,28,29,0.03)] border border-outline-variant/10">
        <div className="relative flex-grow max-w-md">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">search</span>
          <input 
            className="w-full bg-surface-container-low border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/50 transition-all outline-none" 
            placeholder="Tìm kiếm theo tên, email hoặc ID khách hàng..." 
            type="text"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button className="bg-primary text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
            <span className="material-symbols-outlined text-sm">filter_list</span>
            Tất cả trạng thái
          </button>
          <button className="bg-surface-container-low text-on-surface-variant px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-outline-variant/10">Đang chờ</button>
        </div>
        
        <div className="flex-grow hidden xl:block"></div>
        
        <button className="text-primary font-black text-[10px] uppercase tracking-widest flex items-center gap-2 px-6 py-4 bg-primary/5 hover:bg-primary/10 rounded-2xl transition-all border border-primary/10">
          <span className="material-symbols-outlined text-base">download</span>
          Xuất CSV
        </button>
      </section>

      {/* Customer Table */}
      <section className="bg-surface-container-lowest rounded-[2.5rem] shadow-[0_8px_48px_0_rgba(25,28,29,0.03)] overflow-hidden border border-outline-variant/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-10 py-6 text-[11px] uppercase tracking-[0.2em] font-black text-on-surface-variant">Khách hàng</th>
                <th className="px-6 py-6 text-[11px] uppercase tracking-[0.2em] font-black text-on-surface-variant">Liên hệ</th>
                <th className="px-6 py-6 text-[11px] uppercase tracking-[0.2em] font-black text-on-surface-variant">Đặt chỗ</th>
                <th className="px-6 py-6 text-[11px] uppercase tracking-[0.2em] font-black text-on-surface-variant">Trạng thái</th>
                <th className="px-10 py-6 text-[11px] uppercase tracking-[0.2em] font-black text-on-surface-variant text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {customers.map((customer, index) => (
                <tr key={index} className="hover:bg-surface-container-low/30 transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-surface-container-high border-2 border-white shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                        <img src={customer.avatar} alt={customer.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-black text-on-surface text-lg tracking-tight">{customer.name}</p>
                        <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest mt-1">ID: {customer.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-sm">
                    <p className="font-bold text-on-surface">{customer.email}</p>
                    <p className="text-on-surface-variant mt-1 font-medium">{customer.phone}</p>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-primary font-mono tracking-tighter">{customer.bookings}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center w-fit ${
                      customer.status === 'Đang hoạt động' ? 'bg-emerald-100/50 text-emerald-700' :
                      customer.status === 'Đã tạm khóa' ? 'bg-red-100/50 text-red-700' :
                      'bg-amber-100/50 text-amber-700'
                    }`}>
                      <span className={`w-1 h-1 rounded-full mr-1.5 ${
                        customer.status === 'Đang hoạt động' ? 'bg-emerald-500' : 
                        customer.status === 'Đã tạm khóa' ? 'bg-red-500' : 'bg-amber-500'
                      }`} />
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-20 group-hover:opacity-100 transition-all">
                      <Link to={`/admin/customers/${customer.id}`} className="p-2.5 hover:bg-primary/10 text-primary rounded-xl transition-all flex items-center" title="Xem chi tiết">
                        <span className="material-symbols-outlined text-xl">visibility</span>
                      </Link>
                      <button className="p-2.5 hover:bg-surface-container-high text-on-surface-variant rounded-xl transition-all" title="Chỉnh sửa">
                        <span className="material-symbols-outlined text-xl">edit</span>
                      </button>
                      <button className="p-2.5 hover:bg-red-50 text-error rounded-xl transition-all" title="Chặn tài khoản">
                        <span className="material-symbols-outlined text-xl">block</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-10 py-8 bg-surface-container-low/30 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-outline-variant/10">
          <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">
            Hiển thị <span className="text-on-surface">1 - 4</span> trong số <span className="text-on-surface">12.482</span> khách hàng
          </p>
          <div className="flex items-center gap-2 font-mono">
            <button className="p-3 rounded-xl hover:bg-white text-on-surface-variant disabled:opacity-30 transition-all border border-outline-variant/5" disabled>
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <div className="flex items-center gap-1">
              <button className="w-10 h-10 rounded-xl bg-primary text-on-primary text-sm font-black shadow-lg shadow-primary/20">1</button>
              <button className="w-10 h-10 rounded-xl hover:bg-white text-on-surface-variant text-sm font-bold transition-all border border-outline-variant/5">2</button>
              <button className="w-10 h-10 rounded-xl hover:bg-white text-on-surface-variant text-sm font-bold transition-all border border-outline-variant/5">3</button>
              <span className="px-3 text-on-surface-variant">...</span>
              <button className="w-10 h-10 rounded-xl hover:bg-white text-on-surface-variant text-sm font-bold transition-all border border-outline-variant/5">312</button>
            </div>
            <button className="p-3 rounded-xl hover:bg-white text-on-surface-variant transition-all border border-outline-variant/5">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
