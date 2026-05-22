import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BRAND_NAME, BRAND_FOOTER_DESC } from '../constants';
import UserNavbar from '../components/UserNavbar';
import { getFeaturedTours, getPopularTours, type TourSummary } from '../api/tours';
import { getFeaturedDestinations, type Destination } from '../api/destinations';
import { getPublicDeals, type Deal } from '../api/deals';
import { extractApiErrorMessage } from '../api/types';

const fmt = (n: number) => n.toLocaleString('vi-VN') + '₫';

function formatDealValue(deal: Deal) {
  if (deal.badgeText) return deal.badgeText;
  return deal.discountType === 'PERCENTAGE'
    ? `Giảm ${deal.discountValue}%`
    : `Giảm ${deal.discountValue.toLocaleString('vi-VN')}₫`;
}

export default function Home() {
  const navigate = useNavigate();
  const [searchDestination, setSearchDestination] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchGuests, setSearchGuests] = useState('');
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [featuredTours, setFeaturedTours] = useState<TourSummary[]>([]);
  const [popularTours, setPopularTours] = useState<TourSummary[]>([]);
  const [publicDeals, setPublicDeals] = useState<Deal[]>([]);
  const [homeLoading, setHomeLoading] = useState(true);
  const [homeError, setHomeError] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    let active = true;

    Promise.allSettled([
      getFeaturedDestinations(),
      getFeaturedTours(3),
      getPopularTours(3),
      getPublicDeals(),
    ]).then(([destinationsResult, featuredResult, popularResult, dealsResult]) => {
      if (!active) return;

      if (destinationsResult.status === 'fulfilled') setDestinations(destinationsResult.value);
      if (featuredResult.status === 'fulfilled') setFeaturedTours(featuredResult.value);
      if (popularResult.status === 'fulfilled') setPopularTours(popularResult.value);
      if (dealsResult.status === 'fulfilled') setPublicDeals(dealsResult.value);

      const allFailed = [destinationsResult, featuredResult, popularResult, dealsResult].every(
        (result) => result.status === 'rejected'
      );
      setHomeError(allFailed ? 'Không thể tải dữ liệu trang chủ lúc này.' : null);
      setHomeLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  async function handleNewsletterSubmit(event: FormEvent) {
    event.preventDefault();
    setNewsletterMessage(null);
    setNewsletterLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNewsletterMessage({ ok: true, text: 'Đăng ký thành công. Ưu đãi mới sẽ được gửi tới email của bạn.' });
      setNewsletterEmail('');
    } catch (error) {
      setNewsletterMessage({ ok: false, text: 'Không thể đăng ký newsletter lúc này.' });
    } finally {
      setNewsletterLoading(false);
    }
  }

  function handleSearch() {
    const params = new URLSearchParams();
    if (searchDestination) params.set('destination', searchDestination);
    if (searchDate) params.set('date', searchDate);
    if (searchGuests) params.set('guests', searchGuests);
    navigate(`/tours?${params.toString()}`);
  }

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-sans">
      <UserNavbar />

      <main className="flex-grow">
        {homeError && (
          <div className="max-w-7xl mx-auto px-8 pt-8">
            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {homeError}
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="relative h-[680px] w-full overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover"
              alt="majestic limestone karsts of ha long bay rising from emerald waters at sunrise with golden mist and traditional junk boat"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGnjFzjQjcS28GEm5f1egQTOI1s7vxapa1kaIZh9QqpCCzHXQvHs-6HbI8bp4UG0Rj2mgm5vjujUClj5wXz0I7Ze7LPqmGKfEsMJtZV6pEUv41fv1RaEUk2p_vhN_xAiAjwPfKIRkHefgRMpAZHVD5r1dKFBBNDHPiZ5ZusEWV8NUgcfnmJW8qRn1fyNbx_Vh_B9BO4RKRolLI7Aq5_rQRP2cZghTCe696KJHcwUiosztUPLqOCl7igSTpP07QJ6XLxNWWV5NtYiI"
            />
            <div className="absolute inset-0 hero-gradient"></div>
          </div>
          <div className="relative z-10 text-center px-4 max-w-5xl">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-tight">
              Khám Phá Việt Nam <br /> Cùng Chúng Tôi
            </h1>
            {/* Modern Search Bar */}
            <div className="bg-surface-container-lowest/90 backdrop-blur-md p-2 md:p-4 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-4xl mx-auto">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-surface-container-low rounded-xl">
                <span className="material-symbols-outlined text-primary">location_on</span>
                <div className="text-left">
                  <label className="block text-[10px] font-bold text-outline uppercase tracking-wider">
                    Điểm đến
                  </label>
                  <input
                    className="bg-transparent border-none p-0 text-on-surface focus:ring-0 font-medium w-full placeholder:text-surface-dim"
                    placeholder="Bạn muốn đi đâu?"
                    type="text"
                    value={searchDestination}
                    onChange={(e) => setSearchDestination(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-surface-container-low rounded-xl">
                <span className="material-symbols-outlined text-primary">calendar_today</span>
                <div className="text-left">
                  <label className="block text-[10px] font-bold text-outline uppercase tracking-wider">
                    Ngày đi
                  </label>
                  <input
                    className="bg-transparent border-none p-0 text-on-surface focus:ring-0 font-medium w-full placeholder:text-surface-dim"
                    placeholder="Thêm ngày"
                    type="text"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-surface-container-low rounded-xl">
                <span className="material-symbols-outlined text-primary">group</span>
                <div className="text-left">
                  <label className="block text-[10px] font-bold text-outline uppercase tracking-wider">
                    Số khách
                  </label>
                  <input
                    className="bg-transparent border-none p-0 text-on-surface focus:ring-0 font-medium w-full placeholder:text-surface-dim"
                    placeholder="Thêm khách"
                    type="text"
                    value={searchGuests}
                    onChange={(e) => setSearchGuests(e.target.value)}
                  />
                </div>
              </div>
              <button onClick={handleSearch} className="primary-gradient text-white px-10 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-shadow">
                <span className="material-symbols-outlined">search</span>
                Tìm kiếm
              </button>
            </div>
          </div>
        </section>

        {/* Featured Destinations (Bento Grid) */}
        <section className="max-w-7xl mx-auto px-8 py-14" id="destinations">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-secondary font-bold tracking-widest text-xs uppercase">Điểm đến xu hướng</span>
              <h2 className="text-4xl font-black tracking-tighter text-on-surface mt-2">Điểm Đến Nổi Bật</h2>
            </div>
            <Link to="/tours" className="text-primary font-bold flex items-center gap-2 group">
              Xem tất cả <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-[800px] md:h-[600px]">
            {destinations.length === 0 ? (
              <>
                <div className="md:col-span-2 md:row-span-2 rounded-3xl bg-surface-container animate-pulse" />
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="rounded-3xl bg-surface-container animate-pulse" />
                ))}
              </>
            ) : (
              <>
                {destinations.slice(0, 1).map(dest => (
                  <Link
                    key={dest.id}
                    to={`/tours?keyword=${encodeURIComponent(dest.name)}`}
                    className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-3xl cursor-pointer"
                  >
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      src={dest.coverImageUrl ?? `https://picsum.photos/seed/${dest.id}/600/600`}
                      alt={dest.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                      <h3 className="text-white text-3xl font-black">{dest.name}</h3>
                      {dest.description && (
                        <p className="text-white/80 text-sm line-clamp-1">{dest.description}</p>
                      )}
                    </div>
                  </Link>
                ))}
                {destinations.slice(1, 5).map(dest => (
                  <Link
                    key={dest.id}
                    to={`/tours?keyword=${encodeURIComponent(dest.name)}`}
                    className="md:col-span-1 md:row-span-1 group relative overflow-hidden rounded-3xl cursor-pointer"
                  >
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      src={dest.coverImageUrl ?? `https://picsum.photos/seed/${dest.id}/400/300`}
                      alt={dest.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                      <h3 className="text-white text-xl font-bold">{dest.name}</h3>
                      {dest.country && <p className="text-white/70 text-xs">{dest.country}</p>}
                    </div>
                  </Link>
                ))}
              </>
            )}
          </div>
        </section>

        {/* Featured Tours */}
        <section className="bg-surface-container-low py-14">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex justify-between items-end mb-8">
              <div>
                <span className="text-secondary font-bold tracking-widest text-xs uppercase">Lựa chọn nổi bật</span>
                <h2 className="text-4xl font-black tracking-tighter text-on-surface mt-2">Tour Được Đề Xuất</h2>
              </div>
              <Link to="/tours?sort=rating,desc" className="text-primary font-bold flex items-center gap-2 group">
                Khám phá thêm <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredTours.length === 0 ? (
                [0, 1, 2].map(i => (
                  <div key={i} className="rounded-3xl bg-surface-container animate-pulse h-[420px]" />
                ))
              ) : (
                featuredTours.map(tour => (
                  <Link
                    key={tour.id}
                    to={`/tour/${tour.slug || tour.id}`}
                    className="group bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow block"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        src={tour.coverImageUrl ?? `https://picsum.photos/seed/featured-${tour.id}/600/400`}
                        alt={tour.title}
                      />
                      <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/75 to-transparent">
                        <div className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur">
                          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          Tour nổi bật
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <h3 className="text-xl font-bold text-on-surface leading-tight">{tour.title}</h3>
                        {tour.rating > 0 && (
                          <div className="flex items-center gap-1 text-secondary shrink-0">
                            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="text-sm font-bold">{tour.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-on-surface-variant mb-6">{tour.destinationName}</p>
                      <div className="flex items-center justify-between border-t border-surface-container pt-4">
                        <div>
                          <span className="block text-xs text-outline">Giá từ</span>
                          <span className="text-2xl font-black text-primary">{fmt(tour.pricePerPerson)}</span>
                        </div>
                        <div className="rounded-xl bg-surface-container-high p-3 text-on-surface transition-colors group-hover:bg-primary group-hover:text-white">
                          <span className="material-symbols-outlined">arrow_forward</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Popular Tours */}
        <section className="bg-surface-container-low py-14" id="tours">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex justify-between items-end mb-8">
              <div>
                <span className="text-secondary font-bold tracking-widest text-xs uppercase">Trải nghiệm tốt nhất</span>
                <h2 className="text-4xl font-black tracking-tighter text-on-surface mt-2">Tour Phổ Biến</h2>
              </div>
              <Link to="/tours" className="text-primary font-bold flex items-center gap-2 group">
                Xem tất cả <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {popularTours.length === 0 ? (
                [0, 1, 2].map(i => (
                  <div key={i} className="rounded-3xl bg-surface-container animate-pulse h-[420px]" />
                ))
              ) : (
                popularTours.map(tour => (
                  <Link
                    key={tour.id}
                    to={`/tour/${tour.slug || tour.id}`}
                    className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group block"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        src={tour.coverImageUrl ?? `https://picsum.photos/seed/${tour.id}/600/400`}
                        alt={tour.title}
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary">
                        {tour.durationDays} Ngày {tour.durationNights} Đêm
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-on-surface leading-tight flex-1 mr-2">{tour.title}</h3>
                        {tour.rating > 0 && (
                          <div className="flex items-center gap-1 shrink-0">
                            <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="text-sm font-bold">{tour.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-on-surface-variant text-sm mb-6">{tour.destinationName}</p>
                      <div className="flex justify-between items-center pt-4 border-t border-surface-container">
                        <div>
                          <span className="text-xs text-outline block">Giá từ</span>
                          <span className="text-2xl font-black text-primary">{fmt(tour.pricePerPerson)}</span>
                        </div>
                        <div className="bg-surface-container-high group-hover:bg-primary group-hover:text-white p-3 rounded-xl transition-colors">
                          <span className="material-symbols-outlined">arrow_forward</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Public Deals */}
        <section className="max-w-7xl mx-auto px-8 py-14" id="deals">
          <div className="flex justify-between items-end mb-8 gap-6">
            <div>
              <span className="text-secondary font-bold tracking-widest text-xs uppercase">Ưu đãi công khai</span>
              <h2 className="text-4xl font-black tracking-tighter text-on-surface mt-2">Khuyến Mãi Đang Mở</h2>
            </div>
            <Link to="/deals" className="text-primary font-bold flex items-center gap-2 group whitespace-nowrap">
              Xem tất cả <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
          {publicDeals.length === 0 ? (
            <div className="rounded-[2rem] bg-surface-container-low p-12 text-center">
              <p className="font-semibold text-on-surface-variant">
                {homeLoading ? 'Đang tải ưu đãi công khai...' : 'Hiện chưa có ưu đãi công khai.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {publicDeals.slice(0, 3).map((deal) => (
                <Link
                  key={deal.id}
                  to="/deals"
                  className="group overflow-hidden rounded-[2rem] border border-outline-variant/10 bg-surface-container-lowest shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="h-56 overflow-hidden bg-surface-container">
                    <img
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={deal.campaignImageUrl ?? `https://picsum.photos/seed/deal-${deal.id}/640/420`}
                      alt={deal.title}
                    />
                  </div>
                  <div className="p-6">
                    <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
                      {deal.category ?? 'Ưu đãi'}
                    </span>
                    <h3 className="mt-4 text-xl font-black tracking-tight text-on-surface">{deal.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                      {deal.description ?? 'Ưu đãi dành cho hành trình tiếp theo của bạn.'}
                    </p>
                    <div className="mt-6 flex items-center justify-between border-t border-surface-container pt-4">
                      <span className="text-sm font-bold text-secondary">{formatDealValue(deal)}</span>
                      <span className="material-symbols-outlined text-on-surface-variant transition-transform group-hover:translate-x-1">arrow_forward</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Why Choose Us */}
        <section className="py-14 max-w-7xl mx-auto px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-4xl font-black tracking-tighter text-on-surface">Tại Sao Chọn Chúng Tôi?</h2>
            <p className="text-on-surface-variant mt-4">Chúng tôi cam kết mang lại những trải nghiệm du lịch tuyệt vời nhất với dịch vụ chuyên nghiệp và tận tâm.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-6 text-primary">
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'wght' 600" }}>verified_user</span>
              </div>
              <h4 className="text-xl font-bold mb-2">An Toàn Tuyệt Đối</h4>
              <p className="text-sm text-on-surface-variant">Bảo hiểm du lịch trọn gói và hỗ trợ 24/7 trên mọi nẻo đường.</p>
            </div>
            <div className="text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-secondary/10 rounded-3xl flex items-center justify-center mb-6 text-secondary">
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'wght' 600" }}>payments</span>
              </div>
              <h4 className="text-xl font-bold mb-2">Giá Cả Cạnh Tranh</h4>
              <p className="text-sm text-on-surface-variant">Cam kết giá tốt nhất thị trường với nhiều ưu đãi hấp dẫn hàng tháng.</p>
            </div>
            <div className="text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-primary-container/20 rounded-3xl flex items-center justify-center mb-6 text-primary">
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'wght' 600" }}>diamond</span>
              </div>
              <h4 className="text-xl font-bold mb-2">Dịch Vụ Cao Cấp</h4>
              <p className="text-sm text-on-surface-variant">Hệ thống đối tác khách sạn 5 sao và vận chuyển hạng thương gia.</p>
            </div>
            <div className="text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-tertiary-container/20 rounded-3xl flex items-center justify-center mb-6 text-tertiary">
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'wght' 600" }}>forum</span>
              </div>
              <h4 className="text-xl font-bold mb-2">Hỗ Trợ Tận Tâm</h4>
              <p className="text-sm text-on-surface-variant">Đội ngũ tư vấn viên giàu kinh nghiệm luôn sẵn sàng phục vụ bạn.</p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-surface-container-high/30 py-14" id="journal">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-10">
              <span className="text-secondary font-bold tracking-widest text-xs uppercase">Chia sẻ từ khách hàng</span>
              <h2 className="text-4xl font-black tracking-tighter text-on-surface mt-2">Đánh Giá Từ Du Khách</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-[2rem] shadow-sm relative overflow-hidden">
                <span className="material-symbols-outlined text-6xl text-primary/10 absolute -top-2 -right-2">format_quote</span>
                <div className="flex items-center gap-4 mb-6">
                  <img
                    className="w-16 h-16 rounded-2xl object-cover"
                    alt="portrait of a young man smiling with warm lighting and soft background"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDc4qD_1V2Kt-4LAAGR4uWiaRXl3Ux6wPY7pFS8pnDQ4YRbQYpRjMM8Mex_WyFC4ku42vosO22jGUa6hHjYItMaG4cYERTbmv2gVawv6YBodawvkUVf0QGSGQcBytJo7U3RDA7AlfCtASbujcEskCU7eDyTAxI-BBOzesL1nDITkb6bydxrRetH9XjqNEd1PpUMQPcPMzewyMX17xhzS2X-R9rNRArl71bA1d_8bAeXggDT0dJuJQSgIBukLMdqIdhdTTRUuxioUJ8"
                  />
                  <div>
                    <h5 className="font-bold">Minh Hoàng</h5>
                    <p className="text-xs text-outline">Đến từ TP. Hồ Chí Minh</p>
                  </div>
                </div>
                <p className="italic text-on-surface-variant leading-relaxed">"Một chuyến đi tuyệt vời! Mọi thứ từ khâu đón tiếp đến lịch trình tham quan đều được chuẩn bị vô cùng chu đáo. Tôi nhất định sẽ quay lại."</p>
                <div className="mt-6 flex text-secondary">
                  {[0,1,2,3,4].map(i => <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2rem] shadow-sm relative overflow-hidden scale-105 z-10 border border-primary/5">
                <span className="material-symbols-outlined text-6xl text-primary/10 absolute -top-2 -right-2">format_quote</span>
                <div className="flex items-center gap-4 mb-6">
                  <img
                    className="w-16 h-16 rounded-2xl object-cover"
                    alt="portrait of a professional woman in a light-filled office setting"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUCQi1pHVzP6TQWAL2D09xgLivcQnwpoiwiak2s9An7OceqdRBmwXc4d_nNlR9ZfOHvBuxvNVUkSunQAgwd_XZD3OtxZgKJtn7CpVUt77NGOvs11subv7guXm6Tjv9qdS6mGizAmzUFTJye-9kr4kMXV1ggUPwv4-5gto60YaCjpPUDSAqC-iCJz1BSPrBTnJ5FiU_S7iWZ2p63VJyrVuv6MBJoSwGAtf-vVqMj4OTkM4bDWyxsWIIoUBwEd9bWLhkAJOWSS0b4PE"
                  />
                  <div>
                    <h5 className="font-bold">Thùy Chi</h5>
                    <p className="text-xs text-outline">Đến từ Hà Nội</p>
                  </div>
                </div>
                <p className="italic text-on-surface-variant leading-relaxed">"Tour Phú Quốc thực sự để lại ấn tượng mạnh với tôi. Khách sạn đẹp, đồ ăn ngon và hướng dẫn viên rất nhiệt tình, am hiểu văn hóa địa phương."</p>
                <div className="mt-6 flex text-secondary">
                  {[0,1,2,3,4].map(i => <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2rem] shadow-sm relative overflow-hidden">
                <span className="material-symbols-outlined text-6xl text-primary/10 absolute -top-2 -right-2">format_quote</span>
                <div className="flex items-center gap-4 mb-6">
                  <img
                    className="w-16 h-16 rounded-2xl object-cover"
                    alt="smiling man in casual clothing outdoors with natural soft lighting"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVaF3Jjq8XPxiP6IpZJYmPxPkYsQwTETCTbHDCMW1qvqD3qPq0L8mVayGou_Rv5AGKJLFz3LbJu59MWt6xZ0YIgzuerDDV43m36w6qgJIPlEyeFVNnRs_qDRJfN-OwZ93hGnqPWRCmjHoBpzwtBdJhMDy3zz0zNpJ2iYmbJNSI_OWQSJcIZ5EA5AhTQgIawpsKd367gJDYbulp7Sd-muTkAT0mq02q_9abiAn3o3py0IFtBeBay2wngCYx7r3inJF41_NtOWhOUXg"
                  />
                  <div>
                    <h5 className="font-bold">Quốc Anh</h5>
                    <p className="text-xs text-outline">Đến từ Đà Nẵng</p>
                  </div>
                </div>
                <p className="italic text-on-surface-variant leading-relaxed">"Quy trình đặt tour rất nhanh chóng và thuận tiện. Giá cả minh bạch, không phát sinh chi phí. Rất hài lòng với dịch vụ của các bạn."</p>
                <div className="mt-6 flex text-secondary">
                  {[0,1,2,3,4].map(i => <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="max-w-7xl mx-auto px-8 py-14">
          <div className="primary-gradient rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -ml-32 -mb-32"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6">Nhận Thông Tin Khuyến Mãi</h2>
              <p className="text-white/80 mb-10 text-lg">Đăng ký để nhận những thông tin mới nhất về các điểm đến và ưu đãi độc quyền dành riêng cho bạn.</p>
              <form className="flex flex-col md:flex-row gap-4" onSubmit={handleNewsletterSubmit}>
                <input
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder:text-white/60 focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all outline-none"
                  placeholder="Địa chỉ email của bạn"
                  type="email"
                  required
                />
                <button
                  className="bg-white text-primary font-black px-10 py-4 rounded-2xl hover:bg-opacity-90 transition-all disabled:opacity-70"
                  type="submit"
                  disabled={newsletterLoading}
                >
                  {newsletterLoading ? 'Đang đăng ký...' : 'Đăng Ký Ngay'}
                </button>
              </form>
              {newsletterMessage && (
                <p className={`mt-4 text-sm font-semibold ${newsletterMessage.ok ? 'text-white' : 'text-red-100'}`}>
                  {newsletterMessage.text}
                </p>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 w-full mt-auto border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 px-8 py-12 max-w-7xl mx-auto text-sm leading-relaxed">
          <div className="col-span-1 md:col-span-1">
            <div className="text-xl font-bold text-blue-900 mb-6">{BRAND_NAME}</div>
            <p className="text-slate-500 mb-6 italic">{BRAND_FOOTER_DESC}</p>
            <div className="flex gap-4">
              <a className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all" href="#!">
                <span className="material-symbols-outlined text-lg">public</span>
              </a>
              <a className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all" href="#!">
                <span className="material-symbols-outlined text-lg">share</span>
              </a>
              <a className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all" href="#!">
                <span className="material-symbols-outlined text-lg">camera</span>
              </a>
            </div>
          </div>
          <div>
            <h6 className="font-bold text-blue-900 mb-6 uppercase tracking-wider text-xs">Công ty</h6>
            <ul className="space-y-4">
              <li><Link className="text-slate-500 hover:text-blue-600 transition-colors" to="/about">Về chúng tôi</Link></li>
              <li><a className="text-slate-500 hover:text-blue-600 transition-colors" href="#!">Điều khoản Dịch vụ</a></li>
              <li><a className="text-slate-500 hover:text-blue-600 transition-colors" href="#!">Chính sách Bảo mật</a></li>
              <li><Link className="text-slate-500 hover:text-blue-600 transition-colors" to="/contact">Liên hệ</Link></li>
            </ul>
          </div>
          <div>
            <h6 className="font-bold text-blue-900 mb-6 uppercase tracking-wider text-xs">Điểm Đến</h6>
            <ul className="space-y-4">
              <li><a className="text-slate-500 hover:text-blue-600 transition-colors" href="#!">Hạ Long Bay</a></li>
              <li><a className="text-slate-500 hover:text-blue-600 transition-colors" href="#!">Phú Quốc Island</a></li>
              <li><a className="text-slate-500 hover:text-blue-600 transition-colors" href="#!">Sapa Valley</a></li>
              <li><a className="text-slate-500 hover:text-blue-600 transition-colors" href="#!">Hội An Ancient Town</a></li>
            </ul>
          </div>
          <div>
            <h6 className="font-bold text-blue-900 mb-6 uppercase tracking-wider text-xs">Liên Hệ</h6>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-500">
                <span className="material-symbols-outlined text-primary text-sm">mail</span>
                contact@ptittour.com
              </li>
              <li className="flex items-center gap-3 text-slate-500">
                <span className="material-symbols-outlined text-primary text-sm">phone</span>
                +84 (0) 123 456 789
              </li>
              <li className="flex items-center gap-3 text-slate-500">
                <span className="material-symbols-outlined text-primary text-sm">location_on</span>
                Lê Lợi, Quận 1, TP. HCM
              </li>
            </ul>
          </div>
        </div>
        <div className="px-8 py-8 max-w-7xl mx-auto border-t border-slate-200 text-center text-slate-400 text-xs">
          © 2026 {BRAND_NAME}. Vượt ra ngoài giới hạn.
        </div>
      </footer>
    </div>
  );
}
