import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DEALS = [
  {
    id: 1,
    title: 'Mùa thu tĩnh lặng giữa Dolomites',
    offer: 'GIẢM 20%',
    validUntil: '30 Thg 11, 2024',
    category: 'Theo mùa',
    status: 'Đang hoạt động',
    usageCount: 45
  },
  {
    id: 2,
    title: 'Gói Thiền định Kyoto',
    offer: 'NÂNG CẤP MIỄN PHÍ',
    validUntil: '15 Thg 12, 2024',
    category: 'Văn hóa',
    status: 'Sắp tới',
    usageCount: 0
  },
  {
    id: 3,
    title: 'Chuyến đi Bắc Cực phút chót',
    offer: 'TẶNG $500',
    validUntil: '31 Thg 10, 2024',
    category: 'Ưu đãi chớp nhoáng',
    status: 'Hết hạn',
    usageCount: 120
  }
];

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
              <span className="text-3xl font-black text-secondary tracking-tight">1</span>
              <span className="text-emerald-500 font-bold text-[10px] uppercase">Hôm nay</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-2xl flex flex-col justify-between h-32 border border-surface-container-low">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Mã đã sử dụng</span>
            <span className="text-3xl font-black text-on-surface tracking-tight mt-auto">165</span>
          </div>
          <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col justify-between h-32 shadow-xl shadow-slate-900/10">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Doanh thu tác động</span>
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
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant border-b border-surface-container-highest">Tên Chiến dịch</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant border-b border-surface-container-highest">Quyền lợi</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant border-b border-surface-container-highest">Hạn sử dụng</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant border-b border-surface-container-highest">Trạng thái</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant border-b border-surface-container-highest text-right">Lượt dùng</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant border-b border-surface-container-highest"></th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {DEALS.map((deal) => (
                  <tr key={deal.id} className="hover:bg-surface-container-lowest transition-colors border-b border-surface-container-highest last:border-0">
                    <td className="p-6">
                      <div className="font-bold text-on-surface">{deal.title}</div>
                      <div className="text-xs text-on-surface-variant mt-1">{deal.category}</div>
                    </td>
                    <td className="p-6 font-bold text-secondary">{deal.offer}</td>
                    <td className="p-6 text-on-surface-variant">{deal.validUntil}</td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
                        deal.status === 'Đang hoạt động' ? 'bg-emerald-100 text-emerald-800' :
                        deal.status === 'Sắp tới' ? 'bg-blue-100 text-blue-800' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {deal.status}
                      </span>
                    </td>
                    <td className="p-6 text-right font-mono font-bold text-on-surface-variant">{deal.usageCount}</td>
                    <td className="p-6 text-right">
                      <Link to={`/admin/deals/edit/${deal.id}`} className="inline-flex p-2 hover:bg-surface-container rounded-lg text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
