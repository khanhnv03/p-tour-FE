import React from 'react';
import { Link } from 'react-router-dom';

const orders = [
  {
    id: 'BK-1934',
    customer: 'Alex PTIT',
    tour: 'Bình minh trên đỉnh Langbiang',
    amount: '27.930.000₫',
    status: 'Đã thanh toán',
    date: '12/11/2026'
  },
  {
    id: 'VA-88292',
    customer: 'Nguyễn Thảo Trang',
    tour: 'Nhật Bản: Cung đường vàng Tokyo – Kyoto',
    amount: '65.000.000₫',
    status: 'Đang xử lý',
    date: '20/04/2026'
  },
  {
    id: 'VA-88293',
    customer: 'David Wilson',
    tour: 'Thiên đường Maldives: Nghỉ dưỡng 5 sao',
    amount: '91.800.000₫',
    status: 'Đã hoàn tiền',
    date: '02/04/2026'
  },
  {
    id: 'VA-88294',
    customer: 'Lê Minh Anh',
    tour: 'Du thuyền Premium Vịnh Hạ Long',
    amount: '10.920.000₫',
    status: 'Đã thanh toán',
    date: '18/03/2026'
  }
];

export default function ManageOrders() {
  return (
    <div className="p-10 max-w-[1600px] mx-auto space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <nav className="flex gap-2 text-[10px] text-slate-400 mb-2 font-black uppercase tracking-widest">
            <span>Quản lý</span>
            <span className="opacity-30">/</span>
            <span className="text-primary">Tài chính</span>
          </nav>
          <h1 className="text-3xl font-black tracking-tight text-on-surface">Quản lý Đơn hàng</h1>
          <p className="text-on-surface-variant mt-2 max-w-md text-sm leading-relaxed font-medium">
            Lịch sử toàn diện của tất cả các trải nghiệm và giao dịch tài chính thời gian thực.
          </p>
        </div>
        <div className="flex gap-4">
          <button className="bg-surface-container-high px-8 py-4 rounded-xl font-bold text-sm text-on-surface hover:bg-surface-dim transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">payments</span>
            Cổng thanh toán
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Tổng doanh thu', value: '1.2B ₫', icon: 'account_balance_wallet', trend: '+12%' },
          { label: 'Thanh toán đang chờ', value: '84M ₫', icon: 'pending', trend: '-2%' },
          { label: 'Đơn hàng TB', value: '28M ₫', icon: 'bar_chart', trend: '+5%' },
          { label: 'Hoàn tiền', value: '12M ₫', icon: 'undo', trend: '0%' }
        ].map((stat, i) => (
          <div key={i} className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-xl">{stat.icon}</span>
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${stat.trend.startsWith('+') ? 'bg-green-50 text-green-600' : stat.trend === '0%' ? 'bg-slate-50 text-slate-600' : 'bg-red-50 text-red-600'}`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
            <p className="text-2xl font-black text-on-surface tracking-tighter mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-surface-container-lowest rounded-[2rem] shadow-[0_8px_32px_rgba(25,28,29,0.04)] overflow-hidden border border-outline-variant/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">ID đơn hàng</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Khách hàng</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Trải nghiệm</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Trạng thái</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Số tiền</th>
                <th className="px-8 py-5 text-right font-black uppercase tracking-widest text-slate-400 text-[11px]">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {orders.map((order) => (
                <tr key={order.id} className="group hover:bg-surface-container-low/30 transition-colors">
                  <td className="px-8 py-6">
                    <span className="text-on-surface font-black text-sm font-mono tracking-tighter">{order.id}</span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{order.date}</p>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-on-surface font-bold text-sm tracking-tight">{order.customer}</p>
                  </td>
                  <td className="px-6 py-6 font-bold text-xs">
                     <p className="text-on-surface-variant font-medium">{order.tour}</p>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      order.status === 'Đã thanh toán' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                      order.status === 'Đang xử lý' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                      'bg-red-50 text-red-600 border border-red-100'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-on-surface font-black text-sm tracking-tighter">{order.amount}</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Link 
                      to={`/admin/orders/${order.id}`}
                      className="bg-surface-container-high px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-on-surface hover:bg-primary hover:text-white transition-all shadow-sm"
                    >
                      Kiểm toán
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-8 py-6 bg-surface-container-low/30 border-t border-outline-variant/10 flex items-center justify-between">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hiển thị 4 trong số 2.490 giao dịch</p>
          <div className="flex gap-2">
             <button className="px-4 py-2 bg-white rounded-lg border border-outline-variant/10 font-bold text-xs text-on-surface shadow-sm">Trước</button>
             <button className="px-4 py-2 bg-white rounded-lg border border-outline-variant/10 font-bold text-xs text-on-surface shadow-sm">Sau</button>
          </div>
        </div>
      </div>
    </div>
  );
}
