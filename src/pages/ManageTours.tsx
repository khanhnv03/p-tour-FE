import { useState } from 'react';
import { Link } from 'react-router-dom';

const TOUR_PACKAGES = [
  {
    id: 1,
    name: 'Bình minh trên đỉnh Langbiang',
    destination: 'Lâm Đồng, VN',
    duration: '5 ngày 4 đêm',
    price: '13.300.000₫',
    departures: ['12/11/2026', '19/11/2026', '03/12/2026'],
    status: 'Đang hoạt động',
    bookings: 34,
    image: 'https://picsum.photos/seed/tour1/400/300',
  },
  {
    id: 2,
    name: 'Du thuyền Premium Vịnh Hạ Long',
    destination: 'Quảng Ninh, VN',
    duration: '3 ngày 2 đêm',
    price: '5.200.000₫',
    departures: ['15/11/2026', '22/11/2026'],
    status: 'Đang hoạt động',
    bookings: 78,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYxBlwy8uojyDVx1tSLMwyGv99xZPD9a4IjrbHfCmAfZ2aP3QixIicyOsYuYYSbL9EWycnEx8d0IcQk51THHdlpuH9_I4UmHDFrZQ65wU-5mgzJXfa5Hhxq_A2KeVJeNnzKWBDscQdu1vzpTVqWgVJfcjrWpEIo3PAJ0xMbIiCz3BQesi8vc61kcYJ_jAw2masf4YQYPCa-0nlX1p2OyYFSXcGL_j6AiJDOMwWDU-ruG3mJMQ-zEOVnEOtxGq1biiiKKBZKn_zcts',
  },
  {
    id: 3,
    name: 'Nhật Bản: Cung đường vàng Tokyo – Kyoto',
    destination: 'Nhật Bản',
    duration: '7 ngày 6 đêm',
    price: '32.500.000₫',
    departures: ['10/01/2027'],
    status: 'Sắp mở bán',
    bookings: 5,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWiGMIrNWl1-cQvJ0XRrrUGDi0PWIy4mw3PCuxYFgA2n1W-hweKF21RNHk1zYwgqs3pQJFY09tAEn9CHCIxKo0G6QNH2PfZfHcaGvSHcCn7AZ7G_M6mfy5YVOilHbCstGh5vIqruj309g10TYX_jpRbaSINPIw2hP71OpBAFXDdaxJWdz4wfQH2HCItBTwu7j0b2K6zoKT8RQt8CaeY6B1vvzq3gKIjeYHnI9hybch0aEMMMbzhseBR04IP9eLpRDRI2y3vjbwEDY',
  },
  {
    id: 4,
    name: 'Thiên đường Maldives: Nghỉ dưỡng 5 sao',
    destination: 'Maldives',
    duration: '5 ngày 4 đêm',
    price: '45.900.000₫',
    departures: ['20/12/2026'],
    status: 'Đang hoạt động',
    bookings: 12,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCogkWsfUeEvcsshybb2U8UofOwaSL-ipUP8kA6YEe2PcKo4gNU34YK9aK9EKDkgFrNoUQe7yqmBrqfRApLqcf1ylNa3QLsurtYDC5vlM_9har_AisY9ohN4sCJ2MjeqUjTmKuTk4I2JwvFjCZO82LQ2vnDN1q1P7RwoHfehfVwkYlgnAA--cKOwUfwk2BGWWO7-uB8Yly3tby_jEkAjJJBk7l91oC_W4bum5p0XV18oHrafZqhZuc3mRnsq55KfVc0TqqVVbjxQEY',
  },
  {
    id: 5,
    name: 'Hội An: Phố Cổ & Biển Cửa Đại',
    destination: 'Quảng Nam, VN',
    duration: '4 ngày 3 đêm',
    price: '4.800.000₫',
    departures: ['08/11/2026', '15/11/2026', '22/11/2026'],
    status: 'Đang hoạt động',
    bookings: 56,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBn4YWFotE8umBe_jkoM8QWn7OttkOxZLk1tMYztD5wSXn7jqsAUMRCB93A9kpdtdivXPc3amRoqo98FbLTj34yNdUhqJ1PL_mRbjdeQGpIxwdZiK73RkaOPS-WJOupnQUMDAm3ztssJF07ujzwnq1hWZ-EHL1O-_hIkCcS8-qQi8JhmDkGo2XanXiUBUzkP8P24SDSCkNf_fgtHS3KQQWLSGqbjWV2hXYIzbF0MHErY1juj-uoKdxmCWJ7jgnVMpqkCZmrbmOOq6I',
  },
];

const TOUR_STATUS_CONFIG: Record<string, { bg: string; text: string }> = {
  'Đang hoạt động': { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  'Sắp mở bán': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'Tạm dừng': { bg: 'bg-slate-100', text: 'text-slate-500' },
};

const DESTINATIONS = [
  {
    id: 1,
    name: "Ha Long Bay",
    region: "Miền Bắc Việt Nam",
    rating: 4.9,
    reviews: "2.4k",
    toursCount: 42,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFFr5e8cQZ0tmfSCLqxYMja8tkJTL4UeHvUSBcWvZIs-4G3D1gR5p34h8h7jO9zwajdQ5ALmFm8JbCNKOuSUKZ5yhog0yxKzHr5g3BUZAvaw3Z0dvCLMdJJHRv72j5g4nGwR7lRTfj4i8EYtHoCp1WgfLCOvO_w4ZDanaVR9dedO0i90CVo5y6fTbYnN8M70YDIHl_sK_L533LI7fN-R9mYQ0OGpL03CZ4R6cVXJN1pYj0Ko9znfgoL02JEwGHecSKMJNA7AUjBrs"
  },
  {
    id: 2,
    name: "Sapa Mountains",
    region: "Miền Bắc Việt Nam",
    rating: 4.8,
    reviews: "1.1k",
    toursCount: 28,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAV6UjqCek5QwArJWiGOyPb-hOUV6SBmukXe61nw2oIMrGsOsmzHndmL3Jlq2D5HkMqTRFw8VJB9FN3iYye1B7gS-lehdOybgtYWdqRt5waZW5QXcYdCBbgIqhOReqjbmQ8AAOCIVmR4eHANXQuDXxZ8GBwvrAHN1GY88RW_6d42j-raAI9fIaNqa9F-oBI_Qzvx38knMTOCPzCxDdVJzzbc9iqtCWtRK95-am0RPQLYC-e9swkL7Pl7cdHM84UqXca_J8cRGi11ME"
  },
  {
    id: 3,
    name: "Hoi An Old Town",
    region: "Miền Trung Việt Nam",
    rating: 4.9,
    reviews: "3.2k",
    toursCount: 56,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxlhCmWiKj8j00V9bxIpGDtpgePDz3sw6lvak3VGJw21f98DIjs3mvW-aTT0oheI34mM4bBlR98HoTrG2iTpL7_nAlOoyPtu42L8yNYJIXY9ok9V_xy9PSGXs-rn9t8VqDm51tw79sMGWoVVqirHEOM7kcMufNO4z83yU1AxNyI8uY0a3XLlKmW3IOJ5sp6bYNUb2x35Aun8tJTz8pM91wijUK4StvBM_nbzWUSASrMbQDy7DJUOtwS22lG6GcSI2O2WAeU8BcHbo"
  },
  {
    id: 4,
    name: "Da Lat Highlands",
    region: "Miền Nam Việt Nam",
    rating: 4.7,
    reviews: "940",
    toursCount: 15,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5qf8rZaWO6F3203eNxcdVnpb_3Ay_oMtuV-U03sdnKLDbkF0CfMAkWwtyhX7HEhaZO_j9AiLTn3S7prnfx7V7U2NIVOP4Yt8riBrNhU1hlTglEu7FU_B6G4DCCz6HosqFOWbxRuywvmFmMxfA55SJKG9kAt0ZL0oIrs7Fc1-StwteCq9AqIFKnG1aF4kUuM644HvsaRXWRwgXl83pvw5GB6eUbmOr3p27WPFRjS1MToffZuoIohEw1BCnSBwzjrPWv-auhEQsaVo"
  },
  {
    id: 5,
    name: "Phu Quoc Island",
    region: "Miền Nam Việt Nam",
    rating: 4.9,
    reviews: "4.1k",
    toursCount: 31,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1ujyCpeZBAL8JolT-tsud49EobQbghDD7fMRKmIf1Aw_F9SqRKXo5kHAzG3ykTVmVDhctP-T4Adzc02X4kF8vLuX-VkZ_viD3rd82zMv6ivjfuZbyPeNlCJCaQyffsE_6BQg22s-13ZZDMZd5JB7QYT7bPztLOIoaYygkVWDKL6qbidXGe3178Rc4-AisuRuOYSuCxOX9_Bi5ULlO3xi6p6hDsT15lQNy54AmJKfO1lfO1cEJmGr9QunUA5t6peYMHD_iml59i6k"
  }
];

export default function ManageTours() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'destinations' | 'tours'>('tours');

  return (
    <div className="p-10 max-w-[1600px] mx-auto space-y-10">
      {/* Editorial Header Section */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-4">
        <div>
          <nav className="flex items-center space-x-2 text-on-surface-variant text-[9px] font-black uppercase tracking-[0.2em] mb-3">
            <span>Quản trị Hệ thống</span>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <span className="text-primary">Quản lý Tour & Điểm đến</span>
          </nav>
          <h1 className="text-3xl font-black text-on-surface tracking-tight leading-none">
            {activeTab === 'tours' ? 'Quản lý Tour' : 'Quản lý Điểm đến'}
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed font-medium mt-2">
            {activeTab === 'tours'
              ? 'Gói tour có thể đặt, lịch trình, giá và lịch khởi hành.'
              : 'Vùng địa lý, ảnh giới thiệu và thông tin khu vực.'}
          </p>
        </div>
        <Link
          to="/admin/tours/new"
          className="signature-gradient text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 scale-100 active:scale-95 whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
            {activeTab === 'tours' ? 'add_circle' : 'add_location_alt'}
          </span>
          {activeTab === 'tours' ? 'Thêm Tour mới' : 'Thêm Điểm đến mới'}
        </Link>
      </header>

      {/* Tab Switcher: Tour vs Destination */}
      <div className="flex gap-1 bg-surface-container-low p-1 rounded-2xl w-fit mb-4">
        {[
          { key: 'tours' as const, icon: 'travel_explore', label: 'Tour' },
          { key: 'destinations' as const, icon: 'location_on', label: 'Điểm đến' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.key ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: activeTab === tab.key ? "'FILL' 1" : "'FILL' 0" }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab explanation banner */}
      {activeTab === 'destinations' && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-4">
          <span className="material-symbols-outlined text-blue-500 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
          <div>
            <p className="text-sm font-bold text-blue-800">Điểm đến là khu vực địa lý (Vịnh Hạ Long, Sapa...)</p>
            <p className="text-xs text-blue-600 mt-0.5 font-medium">Mỗi điểm đến có thể chứa nhiều gói tour. Để quản lý lịch trình, giá và đặt chỗ, chuyển sang tab <strong>Tour</strong>.</p>
          </div>
        </div>
      )}

      <div className="space-y-12">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col justify-between h-32 border border-surface-container-high">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Điểm đến hiện hữu</span>
            <div className="flex items-baseline gap-2 mt-auto">
              <span className="text-3xl font-black text-primary tracking-tight">124</span>
              <span className="text-emerald-500 font-bold text-[10px] uppercase">+3 tuần này</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-2xl flex flex-col justify-between h-32 border border-surface-container-low transition-all hover:border-primary/20 group">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Chuyến đi đã xuất bản</span>
            <div className="flex items-baseline justify-between mt-auto">
              <span className="text-3xl font-black text-on-surface tracking-tight">582</span>
              <span className="material-symbols-outlined text-primary text-base group-hover:scale-110 transition-transform">trending_up</span>
            </div>
          </div>
          <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col justify-between h-32 shadow-xl shadow-slate-900/10">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hiệu suất vận hành</span>
            <span className="text-3xl font-black tracking-tight mt-auto">84.2%</span>
          </div>
        </div>

        {/* Destination Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-black tracking-tight text-on-surface">
                {activeTab === 'tours' ? 'Gói Tour đang quản lý' : 'Bộ sưu tập Điểm đến Việt'}
              </h3>
              <div className="h-4 w-px bg-slate-200"></div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {activeTab === 'tours' ? `${TOUR_PACKAGES.length} gói tour` : '5 khu vực'}
              </span>
            </div>
            <div className="flex bg-surface-container-low p-1 rounded-xl">
              <button 
                onClick={() => setViewMode('grid')}
                className={`${viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-slate-400'} px-3 py-1.5 rounded-lg transition-all flex items-center`}
              >
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: viewMode === 'grid' ? "'FILL' 1" : "'FILL' 0" }}>grid_view</span>
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`${viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-slate-400'} px-3 py-1.5 rounded-lg transition-all flex items-center`}
              >
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: viewMode === 'list' ? "'FILL' 1" : "'FILL' 0" }}>list</span>
              </button>
            </div>
          </div>
          
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {activeTab === 'tours' ? TOUR_PACKAGES.map((tour) => (
                <div key={tour.id} className="group bg-surface-container-lowest rounded-2xl overflow-hidden border border-surface-container-low transition-all hover:border-primary/30">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img alt={tour.name} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" src={tour.image} />
                    <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${TOUR_STATUS_CONFIG[tour.status]?.bg || 'bg-white/90'} ${TOUR_STATUS_CONFIG[tour.status]?.text || 'text-slate-600'}`}>
                      {tour.status}
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="text-sm font-black tracking-tight text-on-surface mb-1 line-clamp-2">{tour.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">{tour.destination} · {tour.duration}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-primary font-black text-sm">{tour.price}<span className="text-[9px] text-slate-400 font-bold">/khách</span></span>
                      <span className="text-[10px] text-slate-400 font-bold">{tour.bookings} bookings</span>
                    </div>
                    <div className="flex gap-2 pt-3 border-t border-surface-container-low">
                      <Link to={`/admin/tours/edit/${tour.id}`} className="flex-1 bg-surface-container-low hover:bg-primary/5 hover:text-primary text-slate-600 font-bold py-2 rounded-xl transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5">
                        <span className="material-symbols-outlined text-xs">edit_note</span>Sửa
                      </Link>
                      <button className="w-10 bg-error/5 hover:bg-error text-error hover:text-white rounded-xl transition-all flex items-center justify-center text-[10px]">
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              )) : DESTINATIONS.map((dest) => (
                <div key={dest.id} className="group bg-surface-container-lowest rounded-2xl overflow-hidden border border-surface-container-low transition-all hover:border-primary/30">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img alt={dest.name} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" src={dest.image} />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-[9px] font-black text-primary uppercase tracking-widest">{dest.region}</div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-base font-black tracking-tight text-on-surface">{dest.name}</h4>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-[10px] text-orange-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          <span className="text-[10px] font-bold text-slate-400">{dest.rating} <span className="mx-1 opacity-20">|</span> {dest.reviews}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-primary">{dest.toursCount}</span>
                        <span className="block text-[8px] font-black text-slate-400 uppercase tracking-tighter">Tours</span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4 border-t border-surface-container-low">
                      <Link to="/admin/tours/new" className="flex-1 bg-surface-container-low hover:bg-primary/5 hover:text-primary text-slate-600 font-bold py-2 rounded-xl transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5">
                        <span className="material-symbols-outlined text-xs">add</span>Thêm
                      </Link>
                      <Link to={`/admin/tours/edit/${dest.id}`} className="flex-1 bg-surface-container-low hover:bg-primary/5 hover:text-primary text-slate-600 font-bold py-2 rounded-xl transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5">
                        <span className="material-symbols-outlined text-xs">edit_note</span>Sửa
                      </Link>
                      <button className="w-10 bg-error/5 hover:bg-error text-error hover:text-white rounded-xl transition-all flex items-center justify-center text-[10px]">
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <Link to="/admin/tours/new" className="group border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 hover:border-primary/40 hover:bg-primary/[0.02] transition-all cursor-pointer">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-all">
                  <span className="material-symbols-outlined text-xl">add</span>
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">
                  {activeTab === 'tours' ? 'Thêm gói tour mới' : 'Tạo khu vực mới'}
                </p>
              </Link>
            </div>
          ) : (
            activeTab === 'tours' ? (
              <div className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-surface-container-low shadow-sm">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-surface-container-low font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">
                      <th className="px-6 py-4">Tên gói Tour</th>
                      <th className="px-6 py-4">Điểm đến</th>
                      <th className="px-6 py-4">Giá/khách</th>
                      <th className="px-6 py-4">Trạng thái</th>
                      <th className="px-6 py-4">Bookings</th>
                      <th className="px-6 py-4 text-right">Quản trị</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-low text-xs">
                    {TOUR_PACKAGES.map((tour) => (
                      <tr key={tour.id} className="hover:bg-primary/[0.01] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img alt={tour.name} className="w-10 h-10 rounded-lg object-cover" src={tour.image} />
                            <div>
                              <span className="font-bold text-slate-700 block">{tour.name}</span>
                              <span className="text-[10px] text-slate-400">{tour.duration}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-medium">{tour.destination}</td>
                        <td className="px-6 py-4 font-black text-primary text-sm">{tour.price}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${TOUR_STATUS_CONFIG[tour.status]?.bg} ${TOUR_STATUS_CONFIG[tour.status]?.text}`}>{tour.status}</span>
                        </td>
                        <td className="px-6 py-4 font-black text-sm text-slate-800">{tour.bookings}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            <Link to={`/admin/tours/edit/${tour.id}`} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                              <span className="material-symbols-outlined text-sm">edit</span>
                            </Link>
                            <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-error hover:bg-error/5 rounded-lg transition-all">
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-surface-container-low shadow-sm">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-surface-container-low font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">
                      <th className="px-6 py-4">Điểm đến hành trình</th>
                      <th className="px-6 py-4">Khu vực địa lý</th>
                      <th className="px-6 py-4">Xếp hạng</th>
                      <th className="px-6 py-4">Sản phẩm</th>
                      <th className="px-6 py-4 text-right">Quản trị</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-low text-xs">
                    {DESTINATIONS.map((dest) => (
                      <tr key={dest.id} className="hover:bg-primary/[0.01] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img alt={dest.name} className="w-10 h-10 rounded-lg object-cover" src={dest.image} />
                            <span className="font-bold text-slate-700">{dest.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4"><span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{dest.region}</span></td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 font-mono text-primary font-bold">
                            <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>{dest.rating}
                          </div>
                        </td>
                        <td className="px-6 py-4"><span className="font-black text-sm text-slate-800">{dest.toursCount}</span></td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            <Link to={`/admin/tours/edit/${dest.id}`} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                              <span className="material-symbols-outlined text-sm">edit</span>
                            </Link>
                            <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-error hover:bg-error/5 rounded-lg transition-all">
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
