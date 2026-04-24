import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function CustomerDetails() {
  useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName]   = useState('Alex PTIT');
  const [email, setEmail] = useState('alex@ptittour.com');
  const [phone, setPhone] = useState('+84 912 345 678');

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      {/* Page header */}
      <div className="px-6 lg:px-8 py-5 border-b border-black/5 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            to="/admin/customers"
            className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors mb-2"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Khách hàng
          </Link>
          <div className="flex items-center gap-3">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuWdojTWLkOZJO7QnZk1Wu_ZBDHhV69mkUS6E1dOq1thfZ2NUGn0cSdWeZ1FuvzSn72heapjOVtZayQZJBBvU4ZfphklLyJCbiZr52vPnEylMd1LVco5vhVXoG9dHED-jLAVTUoKFq-KiV-X05kV55feDmDV_6kBrXStV8VHtrvmnGAinvdD93a7x864zUNI0kOz00y-Z4KfdaqBl4vaFUmcotTZAopEvZ2xXBBbmJalX3FAmhye-kD0t4FHeAWyYs6as61ZOXwas"
              alt="Avatar"
              className="w-12 h-12 rounded-full shadow-sm object-cover border-2 border-white"
            />
            <div>
              {isEditing ? (
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="text-xl font-black text-on-surface bg-slate-50 border-none rounded-xl px-3 py-1 focus:ring-2 focus:ring-primary/20 outline-none"
                />
              ) : (
                <h1 className="text-xl font-black text-on-surface leading-tight">{name}</h1>
              )}
              {isEditing ? (
                <div className="flex gap-2 mt-1">
                  <input value={email} onChange={e => setEmail(e.target.value)} className="text-sm bg-slate-50 border-none rounded-lg px-2 py-1 focus:ring-1 focus:ring-primary/20 outline-none font-medium" />
                  <input value={phone} onChange={e => setPhone(e.target.value)} className="text-sm bg-slate-50 border-none rounded-lg px-2 py-1 focus:ring-1 focus:ring-primary/20 outline-none font-medium" />
                </div>
              ) : (
                <p className="text-sm text-slate-400 font-medium">{email} · {phone}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button className="px-5 py-2.5 font-bold text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-red-100">
            Đình chỉ
          </button>
          {isEditing ? (
            <>
              <button onClick={() => setIsEditing(false)} className="px-5 py-2.5 font-bold text-sm text-slate-500 hover:bg-slate-100 rounded-xl transition-colors border border-black/10">
                Hủy
              </button>
              <button onClick={() => setIsEditing(false)} className="px-6 py-2.5 font-bold text-sm bg-primary text-white rounded-xl shadow-sm shadow-primary/20 hover:shadow-md transition-all">
                Lưu thay đổi
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="px-6 py-2.5 font-bold text-sm bg-primary text-white rounded-xl shadow-sm shadow-primary/20 hover:shadow-md transition-all">
              Sửa thông tin
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-6">
            <h3 className="font-black text-base text-on-surface mb-4">Thống kê</h3>
            <div className="space-y-3">
              {[
                { label: 'Tổng chi tiêu',  value: '27.930.000₫', valueClass: 'text-primary font-black' },
                { label: 'Tour đã đi',      value: '3 Chuyến',    valueClass: 'font-black text-on-surface' },
              ].map(item => (
                <div key={item.label} className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">{item.label}</span>
                  <span className={`text-lg ${item.valueClass}`}>{item.value}</span>
                </div>
              ))}
              <div className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">Trạng thái</span>
                <span className="bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1 rounded-lg text-xs">Đang hoạt động</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Ghi chú nội bộ</h4>
            <textarea
              className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium text-on-surface resize-none"
              rows={4}
              placeholder="Thêm ghi chú về sở thích, dị ứng..."
              defaultValue="Khách hàng thích leo núi buổi sáng. Yêu cầu phòng view thiên nhiên nếu có."
            />
            <button className="mt-2 text-xs font-bold text-primary hover:underline float-right">Lưu ghi chú</button>
          </div>
        </div>

        {/* Booking history */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-6">
            <h3 className="font-black text-base text-on-surface mb-5">Lịch sử đặt tour</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[480px]">
                <thead>
                  <tr className="text-[10px] uppercase tracking-widest text-slate-400 border-b border-black/5">
                    <th className="pb-3 font-black">Mã ĐC</th>
                    <th className="pb-3 font-black">Tour</th>
                    <th className="pb-3 font-black">Ngày xuất phát</th>
                    <th className="pb-3 font-black">Trạng thái</th>
                    <th className="pb-3 font-black text-right">Chi tiết</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { id: '#BK-1934', tour: 'Bình minh trên đỉnh Langbiang', date: '12 Thg 11, 2026', badge: 'Sắp đi',  badgeCls: 'bg-blue-50 text-blue-700' },
                    { id: '#BK-8821', tour: 'Thung lũng Bắc Đảo',            date: '10 Thg 12, 2025', badge: 'Hoàn tất', badgeCls: 'bg-emerald-50 text-emerald-700' },
                    { id: '#BK-9302', tour: 'Lễ hội Sapa',                    date: '05 Thg 01, 2026', badge: 'Hoàn tất', badgeCls: 'bg-emerald-50 text-emerald-700' },
                  ].map(row => (
                    <tr key={row.id} className="border-b border-black/5 hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 font-mono font-bold text-slate-500 text-xs">{row.id}</td>
                      <td className="py-4 font-bold text-on-surface">{row.tour}</td>
                      <td className="py-4 text-slate-400 text-xs">{row.date}</td>
                      <td className="py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${row.badgeCls}`}>{row.badge}</span>
                      </td>
                      <td className="py-4 text-right">
                        <Link to={`/admin/orders/${row.id.replace('#', '')}`} className="text-primary text-xs font-bold hover:underline">Chi tiết</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
