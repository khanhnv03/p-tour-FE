import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BRAND_NAME, BRAND_FOOTER_DESC } from '../constants';
import UserNavbar from '../components/UserNavbar';
import { searchTours, type TourSummary, type TourDifficulty } from '../api/tours';
import { listDestinations, type Destination } from '../api/destinations';

const fmt = (n: number) => n.toLocaleString('vi-VN') + '₫';
const PAGE_SIZE = 9;
const MAX_PRICE = 100_000_000;

const SORT_OPTIONS = [
  { label: 'Phổ biến', value: 'bookingCount,desc' },
  { label: 'Giá thấp', value: 'pricePerPerson,asc' },
  { label: 'Xếp hạng cao', value: 'rating,desc' },
];

const DIFFICULTY_OPTIONS: { label: string; value: TourDifficulty }[] = [
  { label: 'Dễ', value: 'EASY' },
  { label: 'Trung bình', value: 'MEDIUM' },
  { label: 'Khó', value: 'HARD' },
];

export default function TourSearch() {
  const [searchParams] = useSearchParams();
  const urlKeyword = searchParams.get('keyword') || searchParams.get('destination') || '';

  const [tours, setTours] = useState<TourSummary[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestinationId, setSelectedDestinationId] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [minRating, setMinRating] = useState<number | undefined>();
  const [difficulty, setDifficulty] = useState<TourDifficulty | undefined>();
  const [sort, setSort] = useState('bookingCount,desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    listDestinations({ size: 100 }).then(res => setDestinations(res.content)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    searchTours({
      keyword: urlKeyword || undefined,
      destinationId: selectedDestinationId !== '' ? (selectedDestinationId as number) : undefined,
      maxPrice: maxPrice < MAX_PRICE ? maxPrice : undefined,
      minRating,
      difficulty,
      sort,
      page,
      size: PAGE_SIZE,
    })
      .then(res => {
        setTours(res.content);
        setTotalElements(res.totalElements);
        setTotalPages(Math.max(1, res.totalPages));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [urlKeyword, selectedDestinationId, maxPrice, minRating, difficulty, sort, page]);

  function changeFilter<T>(setter: (v: T) => void, value: T) {
    setter(value);
    setPage(0);
  }

  const activeFilters: { label: string; onRemove: () => void }[] = [];
  if (urlKeyword) activeFilters.push({ label: `Từ khóa: ${urlKeyword}`, onRemove: () => {} });
  if (selectedDestinationId !== '') {
    const dest = destinations.find(d => d.id === selectedDestinationId);
    activeFilters.push({ label: `Điểm đến: ${dest?.name ?? ''}`, onRemove: () => changeFilter(setSelectedDestinationId, '') });
  }
  if (maxPrice < MAX_PRICE) activeFilters.push({ label: `Giá tối đa: ${fmt(maxPrice)}`, onRemove: () => changeFilter(setMaxPrice, MAX_PRICE) });
  if (minRating) activeFilters.push({ label: `Từ ${minRating}★`, onRemove: () => changeFilter(setMinRating, undefined) });
  if (difficulty) {
    const d = DIFFICULTY_OPTIONS.find(o => o.value === difficulty);
    activeFilters.push({ label: `Độ khó: ${d?.label}`, onRemove: () => changeFilter(setDifficulty, undefined) });
  }

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col">
      <UserNavbar />

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
              <span className="text-sm font-bold text-primary uppercase tracking-widest">
                {loading ? 'Đang tải...' : `${totalElements} tour tìm thấy`}
              </span>
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
                    value={selectedDestinationId}
                    onChange={(e) => changeFilter(setSelectedDestinationId, e.target.value === '' ? '' : Number(e.target.value))}
                  >
                    <option value="">Tất cả điểm đến</option>
                    {destinations.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-3 text-outline pointer-events-none">expand_more</span>
                </div>
              </div>

              {/* Filter: Price Range */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-outline uppercase tracking-wider mb-3">Giá tối đa</label>
                <input
                  className="w-full h-1 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
                  max={MAX_PRICE}
                  min="0"
                  step="1000000"
                  type="range"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  onMouseUp={() => setPage(0)}
                />
                <div className="flex justify-between mt-2 text-xs font-medium text-outline">
                  <span>0đ</span>
                  <span className="text-primary font-bold">{maxPrice < MAX_PRICE ? fmt(maxPrice) : '100tr+'}</span>
                </div>
              </div>

              {/* Filter: Difficulty */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-outline uppercase tracking-wider mb-3">Độ khó</label>
                <div className="grid grid-cols-3 gap-2">
                  {DIFFICULTY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => changeFilter(setDifficulty, difficulty === opt.value ? undefined : opt.value)}
                      className={`px-3 py-2 text-xs font-bold rounded-lg border-2 transition-all ${
                        difficulty === opt.value
                          ? 'border-primary text-primary bg-primary/10'
                          : 'border-transparent bg-surface-container-high text-outline hover:border-outline-variant'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter: Rating */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-outline uppercase tracking-wider mb-3">Đánh giá tối thiểu</label>
                <div className="space-y-2">
                  {[5, 4, 3].map(r => (
                    <label key={r} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
                        type="radio"
                        name="minRating"
                        checked={minRating === r}
                        onChange={() => changeFilter(setMinRating, minRating === r ? undefined : r)}
                      />
                      <span className="flex text-secondary">
                        {Array.from({ length: r }).map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        ))}
                        {Array.from({ length: 5 - r }).map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-sm text-surface-dim">star</span>
                        ))}
                      </span>
                      <span className="text-xs text-outline">trở lên</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={() => { setSelectedDestinationId(''); setMaxPrice(MAX_PRICE); setMinRating(undefined); setDifficulty(undefined); setPage(0); }}
                className="w-full py-4 bg-on-surface text-white font-bold rounded-xl active:scale-95 transition-all"
              >
                Xóa bộ lọc
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="lg:w-3/4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-surface-container-low px-6 py-4 rounded-2xl mb-8 gap-4">
              <div className="flex items-center gap-6">
                <span className="text-sm font-bold text-outline uppercase tracking-widest">Sắp xếp:</span>
                <div className="flex gap-4">
                  {SORT_OPTIONS.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => { setSort(s.value); setPage(0); }}
                      className={`text-sm transition-colors ${sort === s.value ? 'font-bold text-primary border-b-2 border-primary' : 'font-semibold text-outline hover:text-on-surface'}`}
                    >
                      {s.label}
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
                  onClick={() => { setSelectedDestinationId(''); setMaxPrice(MAX_PRICE); setMinRating(undefined); setDifficulty(undefined); setPage(0); }}
                  className="text-xs font-bold text-outline hover:text-on-surface underline underline-offset-2 transition-colors"
                >
                  Xóa tất cả
                </button>
              </div>
            )}

            {/* Content Display */}
            {loading ? (
              <div className={viewMode === 'grid'
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                : "flex flex-col gap-8"
              }>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl bg-surface-container animate-pulse h-[360px]" />
                ))}
              </div>
            ) : tours.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-on-surface-variant">
                <span className="material-symbols-outlined text-6xl">travel_explore</span>
                <p className="font-semibold text-lg">Không tìm thấy tour phù hợp.</p>
                <p className="text-sm">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
              </div>
            ) : (
              <div className={viewMode === 'grid'
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                : "flex flex-col gap-8"
              }>
                {tours.map(tour => (
                  <Link
                    key={tour.id}
                    to={`/tour/${tour.slug || tour.id}`}
                    className={`group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_8px_32px_0_rgba(25,28,29,0.06)] transition-all hover:shadow-xl hover:-translate-y-2 block ${viewMode === 'list' ? 'flex flex-col md:flex-row' : ''}`}
                  >
                    <div className={`relative overflow-hidden ${viewMode === 'grid' ? 'h-64' : 'h-64 md:h-auto md:w-1/3'}`}>
                      <img
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        src={tour.coverImageUrl ?? `https://picsum.photos/seed/${tour.id}/600/400`}
                        alt={tour.title}
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter text-primary shadow-sm">
                        {tour.durationDays} ngày {tour.durationNights} đêm
                      </div>
                    </div>
                    <div className={`p-6 flex flex-col ${viewMode === 'grid' ? '' : 'flex-1 justify-center'}`}>
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-lg font-black tracking-tight leading-tight group-hover:text-primary transition-colors flex-1 mr-2">{tour.title}</h4>
                        {tour.rating > 0 && (
                          <div className="flex items-center text-secondary whitespace-nowrap">
                            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="text-xs font-bold ml-1">{tour.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-outline font-medium mb-6">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">location_on</span>
                          {tour.destinationName}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">fitness_center</span>
                          {tour.difficulty === 'EASY' ? 'Dễ' : tour.difficulty === 'MEDIUM' ? 'TB' : 'Khó'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <div>
                          <p className="text-[10px] text-outline uppercase font-black tracking-widest leading-none">Giá từ</p>
                          <p className="text-xl font-black text-on-surface tracking-tighter">{fmt(tour.pricePerPerson)}</p>
                        </div>
                        <div className="primary-gradient text-white p-3 rounded-xl shadow-lg transition-transform">
                          <span className="material-symbols-outlined">arrow_forward</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="w-12 h-12 flex items-center justify-center rounded-xl bg-surface-container-low text-outline hover:bg-surface-container-highest transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i)
                  .filter(i => i === 0 || i === totalPages - 1 || Math.abs(i - page) <= 2)
                  .reduce<(number | '...')[]>((acc, i, idx, arr) => {
                    if (idx > 0 && typeof arr[idx - 1] === 'number' && (i as number) - (arr[idx - 1] as number) > 1) acc.push('...');
                    acc.push(i);
                    return acc;
                  }, [])
                  .map((item, i) => item === '...' ? (
                    <span key={`ellipsis-${i}`} className="text-outline font-bold px-1">...</span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setPage(item as number)}
                      className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold transition-all ${
                        page === item
                          ? 'bg-primary text-white shadow-[0_8px_32px_0_rgba(25,28,29,0.06)]'
                          : 'bg-surface-container-lowest text-outline hover:text-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      {(item as number) + 1}
                    </button>
                  ))
                }
                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page === totalPages - 1}
                  className="w-12 h-12 flex items-center justify-center rounded-xl bg-surface-container-low text-outline hover:bg-surface-container-highest transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            )}
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
              {destinations.slice(0, 4).map(d => (
                <li key={d.id}>
                  <Link className="hover:text-blue-600 transition-colors" to={`/tours?keyword=${encodeURIComponent(d.name)}`}>{d.name}</Link>
                </li>
              ))}
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
