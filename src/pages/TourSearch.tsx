import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BRAND_NAME, BRAND_LOGO, BRAND_FOOTER_DESC } from '../constants';

const DURATION_OPTIONS = ['1-3 Ngày', '4-7 Ngày', '8-14 Ngày', 'Trên 14 Ngày'];
const RESULT_COUNTS: Record<string, number> = {
  '1-3 Ngày': 3, '4-7 Ngày': 4, '8-14 Ngày': 3, 'Trên 14 Ngày': 2,
};

export default function TourSearch() {
  const [searchParams] = useSearchParams();
  const initialDestination = searchParams.get('destination') || '';
  const initialDate = searchParams.get('date') || '';
  const initialGuests = searchParams.get('guests') || '';

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] = useState(initialDestination);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedGuests, setSelectedGuests] = useState(initialGuests);
  const [selectedSort, setSelectedSort] = useState('Phổ biến');

  const activeFilters: { label: string; onRemove: () => void }[] = [];
  if (selectedDestination) activeFilters.push({ label: `Điểm đến: ${selectedDestination}`, onRemove: () => setSelectedDestination('') });
  if (selectedDuration) activeFilters.push({ label: `Thời gian: ${selectedDuration}`, onRemove: () => setSelectedDuration(null) });
  if (selectedDate) activeFilters.push({ label: `Ngày: ${selectedDate}`, onRemove: () => setSelectedDate('') });
  if (selectedGuests) activeFilters.push({ label: `Số khách: ${selectedGuests}`, onRemove: () => setSelectedGuests('') });

  const resultCount = selectedDuration ? RESULT_COUNTS[selectedDuration] : 9;
  const resultLabel = activeFilters.length > 0 ? `${resultCount} kết quả phù hợp` : '9 kết quả tìm thấy';

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col">
      {/* TopNavBar */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(25,28,29,0.06)]">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-3">
            <img src={BRAND_LOGO} alt="PTIT Logo" className="h-10 w-auto" />
            <div className="text-xl font-black tracking-tighter text-blue-900">
              {BRAND_NAME}
            </div>
          </Link>
          <div className="hidden md:flex items-center space-x-8 font-medium tracking-tight text-slate-600">
            <Link to="/" className="hover:text-blue-600 transition-colors">Điểm đến</Link>
            <Link to="/tours" className="text-blue-700 font-bold border-b-2 border-blue-700 pb-1">Tour</Link>
            <Link to="/deals" className="hover:text-blue-600 transition-colors">Ưu đãi</Link>
            <Link to="/journal" className="hover:text-blue-600 transition-colors">Nhật ký</Link>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100/50 rounded-lg transition-all active:scale-95">Đăng nhập</button>
            <button className="px-5 py-2 text-sm font-bold text-white primary-gradient rounded-xl shadow-lg active:scale-95 transition-all">Đăng ký</button>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto px-8 py-12 w-full">
        {/* Breadcrumb & Title Section */}
        <header className="mb-12">
          <nav className="flex items-center space-x-2 text-sm text-outline mb-4">
            <Link className="hover:text-primary transition-colors" to="/">Trang chủ</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-on-surface font-medium">Tour</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl font-black tracking-tighter text-on-surface mb-2">Khám phá thế giới</h1>
              <p className="text-lg text-outline max-w-xl">Hành trình độc bản được thiết kế riêng cho những tâm hồn khao khát sự khác biệt.</p>
            </div>
            <div className="bg-surface-container-low px-6 py-4 rounded-xl flex items-center gap-4 shadow-[0_8px_32px_0_rgba(25,28,29,0.06)]">
              <span className="text-sm font-bold text-primary uppercase tracking-widest">{resultLabel}</span>
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar: Filters */}
          <aside className="lg:w-1/4 space-y-8">
            <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-[0_8px_32px_0_rgba(25,28,29,0.06)]">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">filter_list</span>
                Bộ lọc tìm kiếm
              </h3>

              {/* Filter: Destinations */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-outline uppercase tracking-wider mb-3">Điểm đến</label>
                <div className="relative">
                  <select
                    className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 appearance-none focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    value={selectedDestination}
                    onChange={(e) => setSelectedDestination(e.target.value)}
                  >
                    <option value="">Tất cả điểm đến</option>
                    <option value="Châu Âu">Châu Âu</option>
                    <option value="Châu Á">Châu Á</option>
                    <option value="Châu Mỹ">Châu Mỹ</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-3 text-outline pointer-events-none">expand_more</span>
                </div>
              </div>

              {/* Filter: Price Range */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-outline uppercase tracking-wider mb-3">Thanh kéo giá (VNĐ)</label>
                <input className="w-full h-1 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary" max="100000000" min="0" type="range" />
                <div className="flex justify-between mt-2 text-xs font-medium text-outline">
                  <span>0đ</span>
                  <span>100tr+</span>
                </div>
              </div>

              {/* Filter: Time */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-outline uppercase tracking-wider mb-3">Thời gian</label>
                <div className="grid grid-cols-2 gap-2">
                  {DURATION_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSelectedDuration(selectedDuration === opt ? null : opt)}
                      className={`px-3 py-2 text-xs font-bold rounded-lg border-2 transition-all ${
                        selectedDuration === opt
                          ? 'border-primary text-primary bg-primary/10'
                          : 'border-transparent bg-surface-container-high text-outline hover:border-outline-variant'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter: Stars */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-outline uppercase tracking-wider mb-3">Hạng dịch vụ</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary" type="checkbox" />
                    <span className="flex text-secondary">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary" type="checkbox" />
                    <span className="flex text-secondary">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-surface-dim">star</span>
                    </span>
                  </label>
                </div>
              </div>

              <button className="w-full py-4 bg-on-surface text-white font-bold rounded-xl active:scale-95 transition-all">Áp dụng bộ lọc</button>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="lg:w-3/4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-surface-container-low px-6 py-4 rounded-2xl mb-8 gap-4">
              <div className="flex items-center gap-6">
                <span className="text-sm font-bold text-outline uppercase tracking-widest">Sắp xếp:</span>
                <div className="flex gap-4">
                  {['Phổ biến', 'Giá thấp', 'Xếp hạng cao'].map((sort) => (
                    <button
                      key={sort}
                      onClick={() => setSelectedSort(sort)}
                      className={`text-sm transition-colors ${selectedSort === sort ? 'font-bold text-primary border-b-2 border-primary' : 'font-semibold text-outline hover:text-on-surface'}`}
                    >
                      {sort}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-surface-container-lowest shadow-[0_8px_32px_0_rgba(25,28,29,0.06)] text-primary' : 'text-outline hover:bg-surface-container-highest'}`}
                >
                  <span className="material-symbols-outlined">grid_view</span>
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-surface-container-lowest shadow-[0_8px_32px_0_rgba(25,28,29,0.06)] text-primary' : 'text-outline hover:bg-surface-container-highest'}`}
                >
                  <span className="material-symbols-outlined">list</span>
                </button>
              </div>
            </div>

            {/* Active Filter Chips */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-xs font-bold text-outline uppercase tracking-widest">Đang lọc:</span>
                {activeFilters.map((f) => (
                  <span key={f.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20">
                    {f.label}
                    <button onClick={f.onRemove} className="hover:bg-primary/20 rounded-full p-0.5 transition-colors">
                      <span className="material-symbols-outlined text-[14px] leading-none">close</span>
                    </button>
                  </span>
                ))}
                <button
                  onClick={() => { setSelectedDuration(null); setSelectedDestination(''); setSelectedDate(''); setSelectedGuests(''); }}
                  className="text-xs font-bold text-outline hover:text-on-surface underline underline-offset-2 transition-colors"
                >
                  Xóa tất cả
                </button>
              </div>
            )}

            {/* Content Display */}
            <div className={viewMode === 'grid'
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8" 
              : "flex flex-col gap-8"
            }>
              {/* Card 1 */}
              <Link to="/tour/maldives" className={`group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_8px_32px_0_rgba(25,28,29,0.06)] transition-all hover:shadow-xl hover:-translate-y-2 block ${viewMode === 'list' ? 'flex flex-col md:flex-row' : ''}`}>
                <div className={`relative overflow-hidden ${viewMode === 'grid' ? 'h-64' : 'h-64 md:h-auto md:w-1/3'}`}>
                  <img 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt="luxury overwater bungalow in maldives" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCogkWsfUeEvcsshybb2U8UofOwaSL-ipUP8kA6YEe2PcKo4gNU34YK9aK9EKDkgFrNoUQe7yqmBrqfRApLqcf1ylNa3QLsurtYDC5vlM_9har_AisY9ohN4sCJ2MjeqUjTmKuTk4I2JwvFjCZO82LQ2vnDN1q1P7RwoHfehfVwkYlgnAA--cKOwUfwk2BGWWO7-uB8Yly3tby_jEkAjJJBk7l91oC_W4bum5p0XV18oHrafZqhZuc3mRnsq55KfVc0TqqVVbjxQEY"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter text-primary shadow-sm">Bán chạy nhất</div>
                </div>
                <div className={`p-6 flex flex-col ${viewMode === 'grid' ? 'h-[calc(100%-16rem)]' : 'flex-1 justify-center'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-black tracking-tight leading-tight group-hover:text-primary transition-colors">Thiên đường Maldives: Nghỉ dưỡng 5 sao</h4>
                    <div className="flex items-center text-secondary whitespace-nowrap ml-2">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-xs font-bold ml-1">4.9</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-outline font-medium mb-6">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> 5 ngày 4 đêm</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">group</span> Max 10 người</span>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <p className="text-[10px] text-outline uppercase font-black tracking-widest leading-none">Giá từ</p>
                      <p className="text-xl font-black text-on-surface tracking-tighter">45.900.000đ</p>
                    </div>
                    <div className="primary-gradient text-white p-3 rounded-xl shadow-lg transition-transform">
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </div>
                  </div>
                </div>
              </Link>
              <Link to="/tour/italy" className={`group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_8px_32px_0_rgba(25,28,29,0.06)] transition-all hover:shadow-xl hover:-translate-y-2 block ${viewMode === 'list' ? 'flex flex-col md:flex-row' : ''}`}>
                <div className={`relative overflow-hidden ${viewMode === 'grid' ? 'h-64' : 'h-64 md:h-auto md:w-1/3'}`}>
                  <img 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt="colorful houses on a cliff in positano italy overlooking the mediterranean sea with lush greenery" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjPgqZiYVw_JdsgRCEbh95TOMEQfMNaAXzgUD3vGu9_6AehX4gYVtNS8Ouh6lBzRnW00SZvpQVpGqXL_xbRvYSsDj2vNmBQzJY-_bWh4fzgQRyBdwjsL9-ZR0_fXI_Lna8vk7DcxD0QIH0VnmPFTSPFuBB788Wq01bRnhozZ61xg9mP6bor3r8m_vJP2Rby-Q0seQxi0r8CBhQ_fY6keOQrYdqMq45WxoK2_H9JQZDoHpgmrBvS06o_X96FY21REO2NO_jYSLWYBA"
                  />
                </div>
                <div className={`p-6 flex flex-col ${viewMode === 'grid' ? 'h-[calc(100%-16rem)]' : 'flex-1 justify-center'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-black tracking-tight leading-tight group-hover:text-primary transition-colors">Mùa thu nước Ý: Rome - Venice - Positano</h4>
                    <div className="flex items-center text-secondary whitespace-nowrap ml-2">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-xs font-bold ml-1">5.0</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-outline font-medium mb-6">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> 10 ngày 9 đêm</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">group</span> Max 12 người</span>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <p className="text-[10px] text-outline uppercase font-black tracking-widest leading-none">Giá từ</p>
                      <p className="text-xl font-black text-on-surface tracking-tighter">78.000.000đ</p>
                    </div>
                    <div className="primary-gradient text-white p-3 rounded-xl shadow-lg transition-transform">
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Card 3 */}
              <Link to="/tour/japan" className={`group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_8px_32px_0_rgba(25,28,29,0.06)] transition-all hover:shadow-xl hover:-translate-y-2 block ${viewMode === 'list' ? 'flex flex-col md:flex-row' : ''}`}>
                <div className={`relative overflow-hidden ${viewMode === 'grid' ? 'h-64' : 'h-64 md:h-auto md:w-1/3'}`}>
                  <img 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt="shibuya crossing in tokyo japan at night with neon lights and motion blur of crowds" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWiGMIrNWl1-cQvJ0XRrrUGDi0PWIy4mw3PCuxYFgA2n1W-hweKF21RNHk1zYwgqs3pQJFY09tAEn9CHCIxKo0G6QNH2PfZfHcaGvSHcCn7AZ7G_M6mfy5YVOilHbCstGh5vIqruj309g10TYX_jpRbaSINPIw2hP71OpBAFXDdaxJWdz4wfQH2HCItBTwu7j0b2K6zoKT8RQt8CaeY6B1vvzq3gKIjeYHnI9hybch0aEMMMbzhseBR04IP9eLpRDRI2y3vjbwEDY"
                  />
                  <div className="absolute top-4 left-4 bg-secondary text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm">-15%</div>
                </div>
                <div className={`p-6 flex flex-col ${viewMode === 'grid' ? 'h-[calc(100%-16rem)]' : 'flex-1 justify-center'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-black tracking-tight leading-tight group-hover:text-primary transition-colors">Nhật Bản: Cung đường vàng Tokyo - Kyoto</h4>
                    <div className="flex items-center text-secondary whitespace-nowrap ml-2">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-xs font-bold ml-1">4.8</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-outline font-medium mb-6">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> 7 ngày 6 đêm</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">group</span> Max 15 người</span>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <p className="text-[10px] text-outline uppercase font-black tracking-widest leading-none">Giá từ</p>
                      <p className="text-xl font-black text-on-surface tracking-tighter">32.500.000đ</p>
                    </div>
                    <div className="primary-gradient text-white p-3 rounded-xl shadow-lg transition-transform">
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Card 4 */}
              <Link to="/tour/cambodia" className={`group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_8px_32px_0_rgba(25,28,29,0.06)] transition-all hover:shadow-xl hover:-translate-y-2 block ${viewMode === 'list' ? 'flex flex-col md:flex-row' : ''}`}>
                <div className={`relative overflow-hidden ${viewMode === 'grid' ? 'h-64' : 'h-64 md:h-auto md:w-1/3'}`}>
                  <img 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt="ancient temple of angkor wat in cambodia reflected in a lake during sunrise with soft pink clouds" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMHzO5gCfQ61KnbIr1qP59Oq3HleyYiusR4AjpHkx3MetiOTfayx8KoPUC6Wkd-N95vqI4tItQvbdPcXPMPuCoebJAXq4rt0iA5eojfEiudDYKdfNq3LbpHk0ZwNVX5CV2NbHvCtusOwIiqtDQOIIK3KZjpeaFhH0HpjfE9oeC4auS6S9pfBYKpF51hA4iOJUpGYiL37fKpBL6thzRDGbkQ7ovT2MzT3WdLi4953gdUBJmswVLUlwWUSH1twTJxmW5_HXG456W1Mw"
                  />
                </div>
                <div className={`p-6 flex flex-col ${viewMode === 'grid' ? 'h-[calc(100%-16rem)]' : 'flex-1 justify-center'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-black tracking-tight leading-tight group-hover:text-primary transition-colors">Campuchia: Huyền bí Angkor Wat</h4>
                    <div className="flex items-center text-secondary whitespace-nowrap ml-2">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-xs font-bold ml-1">4.7</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-outline font-medium mb-6">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> 4 ngày 3 đêm</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">group</span> Max 20 người</span>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <p className="text-[10px] text-outline uppercase font-black tracking-widest leading-none">Giá từ</p>
                      <p className="text-xl font-black text-on-surface tracking-tighter">9.900.000đ</p>
                    </div>
                    <div className="primary-gradient text-white p-3 rounded-xl shadow-lg transition-transform">
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Card 5 */}
              <Link to="/tour/greece" className={`group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_8px_32px_0_rgba(25,28,29,0.06)] transition-all hover:shadow-xl hover:-translate-y-2 block ${viewMode === 'list' ? 'flex flex-col md:flex-row' : ''}`}>
                <div className={`relative overflow-hidden ${viewMode === 'grid' ? 'h-64' : 'h-64 md:h-auto md:w-1/3'}`}>
                  <img 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt="stunning aerial view of santorini greece with iconic white buildings and blue domed churches against deep blue sea" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8f6FW5a1CN3gzBb2n5V30N4rl9U7buaavLFxQAe5ZcqwQ7gjU2QJt-ywKanjEyfyUIYAGpPQkAH36h2Lf2hWz5YeQ64rOGmwfG1JNYrfSti0OzS8SVt1cjyDPH0MCh0ptcFnsLckmPfLLS-J9GiPAObfs_8R094j2a8gIPXhGzaGVmg3yNRiFCK0k1xKxsFvFw2dxkCgR4n-wuhWPxrJfKcWudFSvNha-im-fjeiVe1ZuiAbPmDYh3jRX_ZXECmLGoxn2K7BtV0I"
                  />
                </div>
                <div className={`p-6 flex flex-col ${viewMode === 'grid' ? 'h-[calc(100%-16rem)]' : 'flex-1 justify-center'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-black tracking-tight leading-tight group-hover:text-primary transition-colors">Santorini: Hừng đông bên bờ Địa Trung Hải</h4>
                    <div className="flex items-center text-secondary whitespace-nowrap ml-2">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-xs font-bold ml-1">4.9</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-outline font-medium mb-6">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> 8 ngày 7 đêm</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">group</span> Max 8 người</span>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <p className="text-[10px] text-outline uppercase font-black tracking-widest leading-none">Giá từ</p>
                      <p className="text-xl font-black text-on-surface tracking-tighter">85.000.000đ</p>
                    </div>
                    <div className="primary-gradient text-white p-3 rounded-xl shadow-lg transition-transform">
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Card 6 */}
              <Link to="/tour/france" className={`group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_8px_32px_0_rgba(25,28,29,0.06)] transition-all hover:shadow-xl hover:-translate-y-2 block ${viewMode === 'list' ? 'flex flex-col md:flex-row' : ''}`}>
                <div className={`relative overflow-hidden ${viewMode === 'grid' ? 'h-64' : 'h-64 md:h-auto md:w-1/3'}`}>
                  <img 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt="eiffel tower in paris at night illuminated with warm golden lights under a dark starry sky" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdoVseq_uu6t1tcgrRS5aVw5tU5YAQqYPu0Kva5b7U8cFQ1oDIXmTVZ_aYazYZcz0W8p76BJ7XQe8X5_4_8pc1RYpHo8ub_k6VmSTqz11oI5YCx3cACsznqPQ4QmIieFkaKADi3oHJ1W_3om5B04zjokBgrReqOTPCfrPDlzYS6VmuZvt8ejfjOz2YXjlDFre5SyPjYymPLo8Qp4QupqXBV6SJ-_Y-VKn4W6F034kAqV7IEjG25SvG6I-q_CdMMot-VbnYbx4htKM"
                  />
                </div>
                <div className={`p-6 flex flex-col ${viewMode === 'grid' ? 'h-[calc(100%-16rem)]' : 'flex-1 justify-center'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-black tracking-tight leading-tight group-hover:text-primary transition-colors">Kinh đô ánh sáng: Paris - Versailles - Loire</h4>
                    <div className="flex items-center text-secondary whitespace-nowrap ml-2">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-xs font-bold ml-1">4.8</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-outline font-medium mb-6">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> 9 ngày 8 đêm</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">group</span> Max 14 người</span>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <p className="text-[10px] text-outline uppercase font-black tracking-widest leading-none">Giá từ</p>
                      <p className="text-xl font-black text-on-surface tracking-tighter">62.000.000đ</p>
                    </div>
                    <div className="primary-gradient text-white p-3 rounded-xl shadow-lg transition-transform">
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Pagination */}
            <div className="mt-16 flex justify-center items-center gap-4">
              <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-surface-container-low text-outline hover:bg-surface-container-highest transition-all">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary text-white font-bold shadow-[0_8px_32px_0_rgba(25,28,29,0.06)]">1</button>
              <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-surface-container-lowest text-outline hover:text-on-surface hover:bg-surface-container-high transition-all font-bold">2</button>
              <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-surface-container-lowest text-outline hover:text-on-surface hover:bg-surface-container-high transition-all font-bold">3</button>
              <span className="text-outline font-bold">...</span>
              <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-surface-container-lowest text-outline hover:text-on-surface hover:bg-surface-container-high transition-all font-bold">12</button>
              <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-surface-container-low text-outline hover:bg-surface-container-highest transition-all">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 mt-24 w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-8 py-16 max-w-7xl mx-auto">
          <div className="space-y-6">
            <div className="text-xl font-bold text-blue-900">{BRAND_NAME}</div>
            <p className="text-slate-500 text-sm leading-relaxed">{BRAND_FOOTER_DESC}</p>
            <div className="flex gap-4">
              <button className="p-2 bg-white rounded-full shadow-sm text-primary hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">social_leaderboard</span>
              </button>
              <button className="p-2 bg-white rounded-full shadow-sm text-primary hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">camera</span>
              </button>
            </div>
          </div>
          <div>
            <h5 className="text-blue-900 font-bold mb-6">Liên kết nhanh</h5>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a className="hover:text-blue-600 transition-colors" href="#!">Về chúng tôi</a></li>
              <li><a className="hover:text-blue-600 transition-colors" href="#!">Điều khoản dịch vụ</a></li>
              <li><a className="hover:text-blue-600 transition-colors" href="#!">Chính sách bảo mật</a></li>
              <li><a className="hover:text-blue-600 transition-colors" href="#!">Liên hệ</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-blue-900 font-bold mb-6">Điểm đến nổi bật</h5>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a className="hover:text-blue-600 transition-colors" href="#!">Châu Âu</a></li>
              <li><a className="hover:text-blue-600 transition-colors" href="#!">Châu Á Thái Bình Dương</a></li>
              <li><a className="hover:text-blue-600 transition-colors" href="#!">Châu Mỹ</a></li>
              <li><a className="hover:text-blue-600 transition-colors" href="#!">Trung Đông</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-blue-900 font-bold mb-6">Bản tin</h5>
            <p className="text-slate-500 text-sm mb-4">Đăng ký để nhận những ưu đãi độc quyền.</p>
            <div className="flex bg-white rounded-xl shadow-sm p-1">
              <input className="bg-transparent border-none focus:ring-0 px-3 text-sm flex-grow outline-none" placeholder="Email của bạn" type="email" />
              <button className="primary-gradient text-white px-4 py-2 rounded-lg text-sm font-bold active:scale-95 transition-all">Gửi</button>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-200 py-8 px-8 text-center text-xs text-slate-400">
          © 2026 {BRAND_NAME}. Vượt ra ngoài giới hạn.
        </div>
      </footer>
    </div>
  );
}
