import { useState } from 'react';
import { Link } from 'react-router-dom';

/* ── data ── */
const TOUR_PACKAGES = [
  { id: 1, name: 'Bình minh trên đỉnh Langbiang',           destination: 'Lâm Đồng, VN',   duration: '5 ngày 4 đêm', price: '13.300.000₫', status: 'Đang hoạt động', bookings: 34, image: 'https://picsum.photos/seed/tour1/400/300' },
  { id: 2, name: 'Du thuyền Premium Vịnh Hạ Long',          destination: 'Quảng Ninh, VN', duration: '3 ngày 2 đêm', price: '5.200.000₫',  status: 'Đang hoạt động', bookings: 78, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYxBlwy8uojyDVx1tSLMwyGv99xZPD9a4IjrbHfCmAfZ2aP3QixIicyOsYuYYSbL9EWycnEx8d0IcQk51THHdlpuH9_I4UmHDFrZQ65wU-5mgzJXfa5Hhxq_A2KeVJeNnzKWBDscQdu1vzpTVqWgVJfcjrWpEIo3PAJ0xMbIiCz3BQesi8vc61kcYJ_jAw2masf4YQYPCa-0nlX1p2OyYFSXcGL_j6AiJDOMwWDU-ruG3mJMQ-zEOVnEOtxGq1biiiKKBZKn_zcts' },
  { id: 3, name: 'Nhật Bản: Cung đường vàng Tokyo – Kyoto', destination: 'Nhật Bản',       duration: '7 ngày 6 đêm', price: '32.500.000₫', status: 'Sắp mở bán',    bookings: 5,  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWiGMIrNWl1-cQvJ0XRrrUGDi0PWIy4mw3PCuxYFgA2n1W-hweKF21RNHk1zYwgqs3pQJFY09tAEn9CHCIxKo0G6QNH2PfZfHcaGvSHcCn7AZ7G_M6mfy5YVOilHbCstGh5vIqruj309g10TYX_jpRbaSINPIw2hP71OpBAFXDdaxJWdz4wfQH2HCItBTwu7j0b2K6zoKT8RQt8CaeY6B1vvzq3gKIjeYHnI9hybch0aEMMMbzhseBR04IP9eLpRDRI2y3vjbwEDY' },
  { id: 4, name: 'Thiên đường Maldives: Nghỉ dưỡng 5 sao', destination: 'Maldives',        duration: '5 ngày 4 đêm', price: '45.900.000₫', status: 'Đang hoạt động', bookings: 12, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCogkWsfUeEvcsshybb2U8UofOwaSL-ipUP8kA6YEe2PcKo4gNU34YK9aK9EKDkgFrNoUQe7yqmBrqfRApLqcf1ylNa3QLsurtYDC5vlM_9har_AisY9ohN4sCJ2MjeqUjTmKuTk4I2JwvFjCZO82LQ2vnDN1q1P7RwoHfehfVwkYlgnAA--cKOwUfwk2BGWWO7-uB8Yly3tby_jEkAjJJBk7l91oC_W4bum5p0XV18oHrafZqhZuc3mRnsq55KfVc0TqqVVbjxQEY' },
  { id: 5, name: 'Hội An: Phố Cổ & Biển Cửa Đại',         destination: 'Quảng Nam, VN',  duration: '4 ngày 3 đêm', price: '4.800.000₫',  status: 'Đang hoạt động', bookings: 56, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBn4YWFotE8umBe_jkoM8QWn7OttkOxZLk1tMYztD5wSXn7jqsAUMRCB93A9kpdtdivXPc3amRoqo98FbLTj34yNdUhqJ1PL_mRbjdeQGpIxwdZiK73RkaOPS-WJOupnQUMDAm3ztssJF07ujzwnq1hWZ-EHL1O-_hIkCcS8-qQi8JhmDkGo2XanXiUBUzkP8P24SDSCkNf_fgtHS3KQQWLSGqbjWV2hXYIzbF0MHErY1juj-uoKdxmCWJ7jgnVMpqkCZmrbmOOq6I' },
];

const DESTINATIONS = [
  { id: 1, name: 'Ha Long Bay',     region: 'Miền Bắc Việt Nam',  rating: 4.9, reviews: '2.4k', toursCount: 42, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFFr5e8cQZ0tmfSCLqxYMja8tkJTL4UeHvUSBcWvZIs-4G3D1gR5p34h8h7jO9zwajdQ5ALmFm8JbCNKOuSUKZ5yhog0yxKzHr5g3BUZAvaw3Z0dvCLMdJJHRv72j5g4nGwR7lRTfj4i8EYtHoCp1WgfLCOvO_w4ZDanaVR9dedO0i90CVo5y6fTbYnN8M70YDIHl_sK_L533LI7fN-R9mYQ0OGpL03CZ4R6cVXJN1pYj0Ko9znfgoL02JEwGHecSKMJNA7AUjBrs' },
  { id: 2, name: 'Sapa Mountains',  region: 'Miền Bắc Việt Nam',  rating: 4.8, reviews: '1.1k', toursCount: 28, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAV6UjqCek5QwArJWiGOyPb-hOUV6SBmukXe61nw2oIMrGsOsmzHndmL3Jlq2D5HkMqTRFw8VJB9FN3iYye1B7gS-lehdOybgtYWdqRt5waZW5QXcYdCBbgIqhOReqjbmQ8AAOCIVmR4eHANXQuDXxZ8GBwvrAHN1GY88RW_6d42j-raAI9fIaNqa9F-oBI_Qzvx38knMTOCPzCxDdVJzzbc9iqtCWtRK95-am0RPQLYC-e9swkL7Pl7cdHM84UqXca_J8cRGi11ME' },
  { id: 3, name: 'Hoi An Old Town', region: 'Miền Trung Việt Nam', rating: 4.9, reviews: '3.2k', toursCount: 56, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxlhCmWiKj8j00V9bxIpGDtpgePDz3sw6lvak3VGJw21f98DIjs3mvW-aTT0oheI34mM4bBlR98HoTrG2iTpL7_nAlOoyPtu42L8yNYJIXY9ok9V_xy9PSGXs-rn9t8VqDm51tw79sMGWoVVqirHEOM7kcMufNO4z83yU1AxNyI8uY0a3XLlKmW3IOJ5sp6bYNUb2x35Aun8tJTz8pM91wijUK4StvBM_nbzWUSASrMbQDy7DJUOtwS22lG6GcSI2O2WAeU8BcHbo' },
  { id: 4, name: 'Da Lat Highlands', region: 'Miền Nam Việt Nam', rating: 4.7, reviews: '940',   toursCount: 15, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5qf8rZaWO6F3203eNxcdVnpb_3Ay_oMtuV-U03sdnKLDbkF0CfMAkWwtyhX7HEhaZO_j9AiLTn3S7prnfx7V7U2NIVOP4Yt8riBrNhU1hlTglEu7FU_B6G4DCCz6HosqFOWbxRuywvmFmMxfA55SJKG9kAt0ZL0oIrs7Fc1-StwteCq9AqIFKnG1aF4kUuM644HvsaRXWRwgXl83pvw5GB6eUbmOr3p27WPFRjS1MToffZuoIohEw1BCnSBwzjrPWv-auhEQsaVo' },
  { id: 5, name: 'Phu Quoc Island', region: 'Miền Nam Việt Nam',  rating: 4.9, reviews: '4.1k', toursCount: 31, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1ujyCpeZBAL8JolT-tsud49EobQbghDD7fMRKmIf1Aw_F9SqRKXo5kHAzG3ykTVmVDhctP-T4Adzc02X4kF8vLuX-VkZ_viD3rd82zMv6ivjfuZbyPeNlCJCaQyffsE_6BQg22s-13ZZDMZd5JB7QYT7bPztLOIoaYygkVWDKL6qbidXGe3178Rc4-AisuRuOYSuCxOX9_Bi5ULlO3xi6p6hDsT15lQNy54AmJKfO1lfO1cEJmGr9QunUA5t6peYMHD_iml59i6k' },
];

const STATUS_CFG: Record<string, { bg: string; text: string; dot: string }> = {
  'Đang hoạt động': { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'Sắp mở bán':     { bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-500'    },
  'Tạm dừng':       { bg: 'bg-slate-100',  text: 'text-slate-500',   dot: 'bg-slate-400'   },
};

type Tab      = 'tours' | 'destinations';
type ViewMode = 'grid'  | 'list';

export default function ManageToursNew() {
  const [tab,  setTab]  = useState<Tab>('tours');
  const [view, setView] = useState<ViewMode>('grid');

  return (
    <div className="flex flex-col flex-1 p-6 lg:p-8 overflow-y-auto gap-6">

      {/* ── Header ── */}
      <header className="shrink-0 flex items-end justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2">
            <span>Quản trị</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-secondary">Điểm đến</span>
          </nav>
          <h1 className="text-3xl font-black text-on-surface tracking-tight">
            {tab === 'tours' ? 'Quản lý Tour' : 'Quản lý Điểm đến'}
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            {tab === 'tours'
              ? 'Gói tour có thể đặt, lịch trình, giá và lịch khởi hành.'
              : 'Vùng địa lý, ảnh giới thiệu và thông tin khu vực.'}
          </p>
        </div>
        <Link
          to="/admin/tours/new"
          className="shrink-0 settings-btn-primary flex items-center gap-2 px-5 py-2.5"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          <span className="material-symbols-outlined text-[16px]">
            {tab === 'tours' ? 'add_circle' : 'add_location_alt'}
          </span>
          {tab === 'tours' ? 'Thêm Tour mới' : 'Thêm Điểm đến'}
        </Link>
      </header>

      {/* ── Tabs ── */}
      <div className="shrink-0 flex items-center justify-between gap-4">
        <div className="flex gap-1 bg-surface-container-low p-1 rounded-xl w-fit">
          {([
            { key: 'tours' as Tab,        icon: 'travel_explore', label: 'Tour'     },
            { key: 'destinations' as Tab, icon: 'location_on',    label: 'Điểm đến' },
          ] as const).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                tab === t.key ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-base"
                style={{ fontVariationSettings: tab === t.key ? "'FILL' 1" : "'FILL' 0" }}>
                {t.icon}
              </span>
              {t.label}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex gap-1 bg-surface-container-low p-1 rounded-xl">
          {(['grid', 'list'] as ViewMode[]).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center ${
                view === v ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className="material-symbols-outlined text-sm"
                style={{ fontVariationSettings: view === v ? "'FILL' 1" : "'FILL' 0" }}>
                {v === 'grid' ? 'grid_view' : 'list'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Destinations info banner ── */}
      {tab === 'destinations' && (
        <div className="shrink-0 flex items-start gap-3 px-4 py-3.5 rounded-xl bg-blue-50 border border-blue-100">
          <span className="material-symbols-outlined text-blue-500 text-[18px] mt-0.5 shrink-0"
            style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
          <div>
            <p className="text-sm font-bold text-blue-800">Điểm đến là khu vực địa lý (Vịnh Hạ Long, Sapa…)</p>
            <p className="text-xs text-blue-600 mt-0.5 font-medium">
              Mỗi điểm đến có thể chứa nhiều gói tour. Để quản lý lịch trình và đặt chỗ, chuyển sang tab <strong>Tour</strong>.
            </p>
          </div>
        </div>
      )}

      {/* ── KPI row ── */}
      <div className="grid grid-cols-3 gap-4 shrink-0">
        <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-2">
          <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">
            {tab === 'tours' ? 'Gói tour hiện có' : 'Điểm đến hiện hữu'}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-primary tracking-tight">
              {tab === 'tours' ? TOUR_PACKAGES.length : DESTINATIONS.length}
            </span>
            <span className="text-[10px] font-bold text-emerald-500">+3 tuần này</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-2">
          <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">Chuyến đi đã xuất bản</p>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-on-surface tracking-tight">582</span>
            <span className="material-symbols-outlined text-primary">trending_up</span>
          </div>
        </div>
        <div className="primary-gradient rounded-2xl p-5 flex flex-col gap-2 shadow-[0_4px_20px_rgba(0,78,159,0.18)] relative overflow-hidden">
          <p className="text-[9px] font-black uppercase tracking-[0.15em] text-white/70">Hiệu suất vận hành</p>
          <span className="text-3xl font-black text-white tracking-tight">84.2%</span>
          <div className="absolute -right-2 -bottom-2 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[56px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              monitoring
            </span>
          </div>
        </div>
      </div>

      {/* ── Section title ── */}
      <div className="shrink-0 flex items-center gap-3">
        <h3 className="text-base font-black text-on-surface tracking-tight">
          {tab === 'tours' ? 'Gói Tour đang quản lý' : 'Bộ sưu tập Điểm đến'}
        </h3>
        <div className="h-3.5 w-px bg-slate-200" />
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          {tab === 'tours' ? `${TOUR_PACKAGES.length} gói` : `${DESTINATIONS.length} khu vực`}
        </span>
      </div>

      {/* ── Content ── */}
      {view === 'grid' ? (
        /* Grid view */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {tab === 'tours'
            ? TOUR_PACKAGES.map(tour => {
                const s = STATUS_CFG[tour.status] ?? STATUS_CFG['Tạm dừng'];
                return (
                  <div key={tour.id} className="group bg-white rounded-2xl overflow-hidden border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.04)] hover:border-primary/25 hover:shadow-[0_4px_24px_rgba(0,78,159,0.10)] transition-all">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img alt={tour.name} src={tour.image}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest backdrop-blur-sm bg-white/90 ${s.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        {tour.status}
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="text-sm font-black text-on-surface mb-0.5 line-clamp-2 leading-snug">{tour.name}</h4>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                        {tour.destination} · {tour.duration}
                      </p>
                      <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
                        <span className="text-primary font-black text-sm">
                          {tour.price}<span className="text-[9px] text-slate-400 font-bold">/khách</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">confirmation_number</span>
                          {tour.bookings}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/admin/tours/edit/${tour.id}`}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-bold bg-surface-container-low hover:bg-primary/8 hover:text-primary text-slate-600 transition-all">
                          <span className="material-symbols-outlined text-xs">edit_note</span>Sửa
                        </Link>
                        <button className="w-9 flex items-center justify-center rounded-xl bg-red-50 hover:bg-error text-error hover:text-white transition-all">
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            : DESTINATIONS.map(dest => (
                <div key={dest.id} className="group bg-white rounded-2xl overflow-hidden border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.04)] hover:border-primary/25 hover:shadow-[0_4px_24px_rgba(0,78,159,0.10)] transition-all">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img alt={dest.name} src={dest.image}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[9px] font-black text-primary bg-white/90 backdrop-blur-sm uppercase tracking-widest">
                      {dest.region}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-sm font-black text-on-surface">{dest.name}</h4>
                      <div className="shrink-0 text-right ml-2">
                        <span className="text-lg font-black text-primary leading-none">{dest.toursCount}</span>
                        <span className="block text-[8px] font-black text-slate-400 uppercase tracking-tight">Tours</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mb-3 pb-3 border-b border-gray-100">
                      <span className="material-symbols-outlined text-[11px] text-amber-400"
                        style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-[10px] font-bold text-slate-500">{dest.rating}</span>
                      <span className="text-[10px] text-slate-300 mx-1">·</span>
                      <span className="text-[10px] text-slate-400">{dest.reviews} đánh giá</span>
                    </div>
                    <div className="flex gap-2">
                      <Link to="/admin/tours/new"
                        className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-[10px] font-bold bg-surface-container-low hover:bg-primary/8 hover:text-primary text-slate-600 transition-all">
                        <span className="material-symbols-outlined text-xs">add</span>Thêm tour
                      </Link>
                      <button className="w-9 flex items-center justify-center rounded-xl bg-red-50 hover:bg-error text-error hover:text-white transition-all">
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
          }
          {/* Add new card */}
          <Link to="/admin/tours/new"
            className="group border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 hover:border-primary/40 hover:bg-primary/[0.02] transition-all min-h-[260px]">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white text-slate-400 transition-all">
              <span className="material-symbols-outlined">add</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors text-center">
              {tab === 'tours' ? 'Thêm gói tour mới' : 'Tạo khu vực mới'}
            </p>
          </Link>
        </div>
      ) : (
        /* List view */
        <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] overflow-hidden">
          {/* Table head */}
          <div className={`grid px-6 py-3 bg-slate-50/70 border-b border-gray-100 ${tab === 'tours' ? 'grid-cols-12' : 'grid-cols-12'}`}>
            {tab === 'tours' ? (
              <>
                <span className="col-span-5 text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">Tên Tour</span>
                <span className="col-span-2 text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">Giá / khách</span>
                <span className="col-span-2 text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">Trạng thái</span>
                <span className="col-span-1 text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">Bookings</span>
                <span className="col-span-2" />
              </>
            ) : (
              <>
                <span className="col-span-4 text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">Điểm đến</span>
                <span className="col-span-3 text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">Khu vực</span>
                <span className="col-span-2 text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">Đánh giá</span>
                <span className="col-span-2 text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">Số tour</span>
                <span className="col-span-1" />
              </>
            )}
          </div>

          {tab === 'tours'
            ? TOUR_PACKAGES.map(tour => {
                const s = STATUS_CFG[tour.status] ?? STATUS_CFG['Tạm dừng'];
                return (
                  <div key={tour.id} className="grid grid-cols-12 px-6 py-3.5 items-center border-b border-gray-50 hover:bg-slate-50/50 transition-colors last:border-b-0">
                    <div className="col-span-5 flex items-center gap-3">
                      <img src={tour.image} alt={tour.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">{tour.name}</p>
                        <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-widest">{tour.destination} · {tour.duration}</p>
                      </div>
                    </div>
                    <span className="col-span-2 text-sm font-black text-primary">{tour.price}</span>
                    <div className="col-span-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${s.bg} ${s.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        {tour.status}
                      </span>
                    </div>
                    <span className="col-span-1 text-sm font-black text-on-surface text-center">{tour.bookings}</span>
                    <div className="col-span-2 flex justify-end gap-1.5">
                      <Link to={`/admin/tours/edit/${tour.id}`}
                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/8 rounded-lg transition-all">
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </Link>
                      <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-error hover:bg-error/8 rounded-lg transition-all">
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                );
              })
            : DESTINATIONS.map(dest => (
                <div key={dest.id} className="grid grid-cols-12 px-6 py-3.5 items-center border-b border-gray-50 hover:bg-slate-50/50 transition-colors last:border-b-0">
                  <div className="col-span-4 flex items-center gap-3">
                    <img src={dest.image} alt={dest.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                    <span className="text-sm font-bold text-gray-800">{dest.name}</span>
                  </div>
                  <span className="col-span-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{dest.region}</span>
                  <div className="col-span-2 flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-[12px] text-amber-400"
                      style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="text-sm font-black text-on-surface">{dest.rating}</span>
                  </div>
                  <span className="col-span-2 text-sm font-black text-on-surface text-center">{dest.toursCount}</span>
                  <div className="col-span-1 flex justify-end gap-1.5">
                    <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-error hover:bg-error/8 rounded-lg transition-all">
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              ))
          }
        </div>
      )}
    </div>
  );
}
