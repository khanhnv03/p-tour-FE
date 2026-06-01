import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { getTourBySlug, getTourById, searchTours, type TourDetail, type TourSummary } from '../api/tours';
import { useAuth } from '../context/AuthContext';
import UserNavbar from '../components/UserNavbar';
import { BRAND_NAME } from '../constants';

const fmt = (n: number) => n.toLocaleString('vi-VN') + '₫';

const difficultyLabel = (d: string) =>
  d === 'EASY' ? 'Nhẹ nhàng' : d === 'MEDIUM' ? 'Trung bình' : 'Khó';

const fmtTime = (t: string) => t.slice(0, 5);

export default function TourDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [tour, setTour] = useState<TourDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [relatedTours, setRelatedTours] = useState<TourSummary[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);


  const [reportedIds, setReportedIds] = useState<Set<number>>(new Set());

  const [activeTab, setActiveTab] = useState('overview');
  const [guestCount, setGuestCount] = useState(2);
  const [selectedDepartureId, setSelectedDepartureId] = useState<number | undefined>();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(false);
    const isNumeric = !isNaN(Number(id));
    const fetch = isNumeric ? getTourById(Number(id)) : getTourBySlug(id);
    fetch
      .then(data => {
        setTour(data);
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const availableDepartures = data.departures.filter(d => d.status === 'OPEN' && d.availableSlots - d.bookedSlots > 0 && new Date(d.departureDate) >= today);
        setSelectedDepartureId(availableDepartures.length > 0 ? availableDepartures[0].id : undefined);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!tour) return;
    searchTours({ destinationId: tour.destination.id, size: 4, sort: 'rating,desc' })
      .then(result => setRelatedTours(result.content.filter(t => t.id !== tour.id).slice(0, 3)))
      .catch(() => {});
  }, [tour]);

  useEffect(() => {
    if (activeTab !== 'reviews' || !tour) return;
    setReviewsLoading(true);
    // Simulate loading
    setTimeout(() => {
      setReviewsLoading(false);
    }, 500);
  }, [activeTab, tour]);



  useEffect(() => {
    if (!tour) return;
    const available = selectedDepartureId
      ? tour.departures.find((departure) => departure.id === selectedDepartureId)
      : undefined;
    const remainingSlots = available ? Math.max(available.availableSlots - available.bookedSlots, 0) : tour.maxGuests;
    const nextGuestCount = Math.min(tour.maxGuests, Math.max(1, remainingSlots || 1));
    setGuestCount((current) => Math.min(current, nextGuestCount));
  }, [tour, selectedDepartureId]);





  const selectedDeparture = tour?.departures.find(d => d.id === selectedDepartureId);
  const remainingSlots = selectedDeparture ? Math.max(selectedDeparture.availableSlots - selectedDeparture.bookedSlots, 0) : 0;
  const unitPrice = selectedDeparture?.priceOverride ?? tour?.pricePerPerson ?? 0;
  const subtotal = unitPrice * guestCount;
  const fee = Math.round(subtotal * 0.05);
  const total = subtotal + fee;

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const openDepartures = tour?.departures.filter(d => d.status === 'OPEN' && d.availableSlots - d.bookedSlots > 0 && new Date(d.departureDate) >= today) ?? [];

  const tabs = [
    { id: 'overview', label: 'Tổng quan' },
    { id: 'itinerary', label: 'Lịch trình' },
    { id: 'inclusions', label: 'Bao gồm' },
    { id: 'reviews', label: 'Đánh giá' },
  ];

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex flex-col">
        <UserNavbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="bg-background min-h-screen flex flex-col">
        <UserNavbar />
        <div className="flex-grow flex flex-col items-center justify-center gap-4 text-on-surface-variant">
          <span className="material-symbols-outlined text-6xl">error_outline</span>
          <p className="font-semibold text-lg">Không tìm thấy tour này.</p>
          <Link to="/tours" className="primary-gradient text-white px-6 py-2.5 rounded-xl font-bold text-sm">Xem tất cả tour</Link>
        </div>
      </div>
    );
  }

  const coverImg = tour.coverImageUrl ?? `https://picsum.photos/seed/${tour.id}/1200/800`;
  const galleryImgs = tour.galleryImages.length > 0
    ? tour.galleryImages.map(g => g.imageUrl)
    : Array.from({ length: 4 }, (_, i) => `https://picsum.photos/seed/${tour.id}-${i}/600/400`);
  const includes = tour.inclusions.filter(i => i.type === 'INCLUDE').map(i => i.description);
  const excludes = tour.inclusions.filter(i => i.type === 'EXCLUDE').map(i => i.description);

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col">
      <UserNavbar />

      <main className="flex-grow max-w-7xl mx-auto px-8 py-12">
        {/* Breadcrumb & Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-on-surface-variant text-sm mb-4">
            <Link to="/" className="hover:text-primary transition-colors">Điểm đến</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <Link to="/tours" className="hover:text-primary transition-colors">{tour.destinationName}</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-primary font-semibold">{tour.title}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-on-surface mb-4">{tour.title}</h1>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center bg-surface-container-low px-3 py-1.5 rounded-full">
                  <span className="material-symbols-outlined text-secondary text-sm mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="font-bold text-sm">{tour.rating.toFixed(1)}</span>
                  <span className="text-on-surface-variant text-xs ml-1">({tour.reviewCount} đánh giá)</span>
                </div>
                <div className="flex items-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm mr-1">location_on</span>
                  <span className="text-sm font-medium">
                    {tour.destination.name}{tour.destination.country ? `, ${tour.destination.country}` : ''}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-3 bg-surface-container-lowest shadow-sm rounded-full hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined">share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[500px] mb-12">
          <div className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-2xl group">
            <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={tour.title} src={coverImg} />
          </div>
          {galleryImgs.slice(0, 4).map((img, i) => (
            <div key={i} className="overflow-hidden rounded-2xl relative group">
              <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={`Gallery ${i + 1}`} src={img} />
            </div>
          ))}
        </div>

        {/* Info Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-surface-container-low p-6 rounded-2xl mb-12">
          {[
            { icon: 'schedule', label: 'Thời lượng', value: `${tour.durationDays} Ngày, ${tour.durationNights} Đêm` },
            { icon: 'groups', label: 'Số người', value: `Tối đa ${tour.maxGuests} khách` },
            { icon: 'mountain_flag', label: 'Độ khó', value: difficultyLabel(tour.difficulty) },
            { icon: 'translate', label: 'Ngôn ngữ', value: 'Anh, Việt' },
          ].map((stat, i) => (
            <div key={i} className={`flex items-center gap-4 ${i > 0 ? 'border-l md:border-outline-variant/20 md:pl-8' : ''}`}>
              <div className="bg-surface-container-lowest p-3 rounded-xl">
                <span className="material-symbols-outlined text-primary">{stat.icon}</span>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">{stat.label}</p>
                <p className="font-bold text-on-surface">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Content + Sidebar */}
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1">
            {/* Tabs */}
            <div className="border-b border-outline-variant/30 mb-8 flex gap-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 text-sm whitespace-nowrap transition-all relative ${
                    activeTab === tab.id ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface font-semibold'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              ))}
            </div>

            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-8">
                    <section>
                      <h3 className="text-2xl font-extrabold mb-4 tracking-tight">Trải nghiệm</h3>
                      <p className="text-lg text-on-surface-variant leading-relaxed mb-6">{tour.description}</p>
                      {tour.highlights.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {tour.highlights.map((h) => (
                            <div key={h.id} className="flex items-center gap-3 bg-surface-container-low p-4 rounded-xl">
                              <span className="material-symbols-outlined text-primary">{h.icon}</span>
                              <span className="font-medium">{h.label}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </section>
                  </motion.div>
                )}

                {activeTab === 'itinerary' && (
                  <motion.div key="itinerary" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                    <h3 className="text-2xl font-extrabold mb-8 tracking-tight">Hành trình chi tiết</h3>
                    <div className="space-y-8 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-surface-container-high">
                      {tour.itineraryDays.map((day, di) => (
                        <div key={day.id} className="relative pl-12">
                          <div className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white shadow-lg ${di === 0 ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant'}`}>
                            {day.dayNumber}
                          </div>
                          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm overflow-hidden">
                            {day.coverImageUrl && (
                              <img
                                src={day.coverImageUrl}
                                alt={day.title}
                                className="w-full h-48 object-cover"
                              />
                            )}
                            <div className="p-6">
                            <h4 className={`font-bold text-lg mb-4 ${di === 0 ? 'text-primary' : 'text-on-surface'}`}>
                              Ngày {day.dayNumber}: {day.title}
                            </h4>
                            <div className="space-y-2">
                              {day.activities.map((act) => (
                                <div key={act.id} className="flex items-start gap-2 text-sm text-on-surface-variant">
                                  <span className="material-symbols-outlined text-xs mt-1 text-primary">circle</span>
                                  <div>
                                    <span className="font-bold text-on-surface">{fmtTime(act.activityTime)}</span>
                                    {act.title && <span className="font-semibold text-on-surface"> — {act.title}</span>}
                                    <span> — {act.description}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'inclusions' && (
                  <motion.div key="inclusions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-emerald-50/50 p-8 rounded-3xl border border-emerald-100">
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-emerald-700">
                        <span className="material-symbols-outlined">check_circle</span> Bao gồm trong Tour
                      </h3>
                      <ul className="space-y-4">
                        {includes.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm font-medium">
                            <span className="material-symbols-outlined text-lg text-emerald-500 mt-0.5">done</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-red-50/50 p-8 rounded-3xl border border-red-100">
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-red-700">
                        <span className="material-symbols-outlined">cancel</span> Không bao gồm
                      </h3>
                      <ul className="space-y-4">
                        {excludes.length > 0 ? excludes.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm font-medium">
                            <span className="material-symbols-outlined text-lg text-red-400 mt-0.5">close</span>
                            {item}
                          </li>
                        )) : ['Đồ uống gọi thêm', 'Visa và vé máy bay quốc tế', 'Tiền tips', 'Chi phí cá nhân phát sinh'].map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm font-medium">
                            <span className="material-symbols-outlined text-lg text-red-400 mt-0.5">close</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'reviews' && (
                  <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                    <div className="bg-surface-container-low p-8 rounded-3xl mb-12 flex flex-col md:flex-row items-center gap-12">
                      <div className="text-center">
                        <div className="text-6xl font-black text-primary mb-2">{tour.rating.toFixed(1)}</div>
                        <div className="flex justify-center mb-2">
                          {[1,2,3,4,5].map(s => <span key={s} className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}
                        </div>
                        <div className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Dựa trên {tour.reviewCount} đánh giá</div>
                      </div>
                    </div>
                    {reviewsLoading ? (
                      <div className="space-y-4">
                        {[0,1,2].map(i => <div key={i} className="h-28 rounded-2xl bg-surface-container animate-pulse" />)}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Static Reviews Mock */}
                        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                A
                              </div>
                              <div>
                                <h5 className="font-bold text-on-surface">Alex PTIT</h5>
                                <p className="text-xs text-on-surface-variant">Tháng 4, 2026</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex">
                                {[1,2,3,4,5].map((_, j) => (
                                  <span key={j} className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-on-surface-variant leading-relaxed text-sm italic">Hướng dẫn viên nhiệt tình, lịch trình gọn và điểm lặn rất đẹp.</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Booking Widget */}
          <aside className="lg:w-[400px]">
            <div className="sticky top-24 bg-surface-container-lowest p-8 rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-outline-variant/10">
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Từ</span>
                <span className="text-3xl font-black text-primary">{fmt(unitPrice)}</span>
                <span className="text-on-surface-variant text-sm">/ khách</span>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Ngày khởi hành</label>
                  {openDepartures.length > 0 ? (
                    <div className="relative">
                      <select
                        className="w-full bg-surface-container-low border-0 rounded-xl px-4 py-4 font-semibold text-on-surface focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                        value={selectedDepartureId ?? ''}
                        onChange={e => setSelectedDepartureId(Number(e.target.value))}
                      >
                        {openDepartures.map(d => (
                          <option key={d.id} value={d.id}>
                            {new Date(d.departureDate).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })}
                            {d.priceOverride ? ` — ${fmt(d.priceOverride)}` : ''}
                            {` (còn ${d.availableSlots - d.bookedSlots} chỗ)`}
                          </option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                    </div>
                  ) : (
                    <div className="bg-surface-container-low rounded-xl px-4 py-4 text-on-surface-variant text-sm font-medium">
                      Hiện chưa có lịch khởi hành
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Số lượng khách</label>
                  <div className="flex items-center justify-between bg-surface-container-low rounded-xl px-4 py-3">
                    <button onClick={() => setGuestCount(Math.max(1, guestCount - 1))} className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm text-primary hover:bg-primary hover:text-white transition-colors">
                      <span className="material-symbols-outlined">remove</span>
                    </button>
                    <span className="font-bold text-lg">{String(guestCount).padStart(2, '0')}</span>
                    <button onClick={() => setGuestCount(Math.min(Math.min(tour.maxGuests, remainingSlots || tour.maxGuests), guestCount + 1))} className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm text-primary hover:bg-primary hover:text-white transition-colors">
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </div>
                  {selectedDeparture && (
                    <p className="mt-2 text-xs font-medium text-on-surface-variant">
                      Còn {remainingSlots} chỗ cho ngày khởi hành đã chọn.
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t border-dashed border-outline-variant/30 pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Giá tour (x{guestCount} khách)</span>
                  <span className="font-bold">{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Thuế & Phí (5%)</span>
                  <span className="font-bold">{fmt(fee)}</span>
                </div>
                <div className="flex justify-between text-xl font-black pt-2">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{fmt(total)}</span>
                </div>
              </div>

              {openDepartures.length > 0 ? (
                <Link
                  to={`/checkout?tourId=${tour.id}&departureId=${selectedDepartureId ?? ''}&guests=${guestCount}`}
                  state={{ tourId: tour.id, departureId: selectedDepartureId, guestCount, departureDate: selectedDeparture?.departureDate }}
                  className="w-full primary-gradient text-white py-5 rounded-2xl font-extrabold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center"
                >
                  Đặt ngay
                </Link>
              ) : (
                <button disabled className="w-full bg-surface-container text-on-surface-variant py-5 rounded-2xl font-extrabold text-lg cursor-not-allowed">
                  Hết lịch khởi hành
                </button>
              )}
              <p className="text-center text-xs text-on-surface-variant mt-4 font-medium italic">Hủy miễn phí tối đa 48h trước khởi hành</p>
            </div>
          </aside>
        </div>

        {/* Related Tours */}
        {relatedTours.length > 0 && (
          <section className="mt-24">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-black tracking-tight mb-2">Khám phá tương tự</h2>
                <p className="text-on-surface-variant">Những hành trình đặc sắc dành riêng cho bạn</p>
              </div>
              <Link to="/tours" className="text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all">
                Xem tất cả <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedTours.map(t => (
                <Link key={t.id} to={`/tour/${t.slug || t.id}`} className="group cursor-pointer">
                  <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-4 shadow-sm">
                    <img
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt={t.title}
                      src={t.coverImageUrl ?? `https://picsum.photos/seed/${t.id}/600/700`}
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold">{t.destinationName}</div>
                  </div>
                  <h4 className="font-extrabold text-xl mb-1 group-hover:text-primary transition-colors">{t.title}</h4>
                  <p className="text-on-surface-variant text-sm mb-2">{t.durationDays} ngày {t.durationNights} đêm</p>
                  <p className="font-black text-lg">{fmt(t.pricePerPerson)}<span className="text-sm font-normal text-on-surface-variant"> / khách</span></p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 mt-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-8 py-16 max-w-7xl mx-auto text-sm">
          <div className="space-y-6">
            <div className="text-xl font-bold text-blue-900">{BRAND_NAME}</div>
            <p className="text-slate-500">Khám phá những chân trời mới cùng trải nghiệm đẳng cấp và cá nhân hóa từ PTIT.</p>
          </div>
          <div className="space-y-4">
            <h5 className="font-bold text-blue-900">Khám phá</h5>
            <ul className="space-y-3">
              <li><Link className="text-slate-500 hover:text-blue-600" to="/tours">Tất cả tour</Link></li>
              <li><Link className="text-slate-500 hover:text-blue-600" to="/deals">Ưu đãi</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="font-bold text-blue-900">Hỗ trợ</h5>
            <ul className="space-y-3">
              <li><Link className="text-slate-500 hover:text-blue-600" to="/about">Về chúng tôi</Link></li>
              <li><Link className="text-slate-500 hover:text-blue-600" to="/contact">Liên hệ</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="font-bold text-blue-900">Bản tin</h5>
            <p className="text-slate-500">Đăng ký nhận ưu đãi độc quyền.</p>
            <div className="flex gap-2">
              <input className="bg-white border-0 rounded-lg px-4 py-2 w-full text-sm outline-none focus:ring-2 focus:ring-primary/20" placeholder="Email của bạn" type="email" />
              <button className="bg-primary text-white p-2 rounded-lg"><span className="material-symbols-outlined">send</span></button>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-200 py-8 px-8 text-center text-slate-500 text-xs">© 2026 {BRAND_NAME}. Vượt ra ngoài giới hạn.</div>
      </footer>
    </div>
  );
}
