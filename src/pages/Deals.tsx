import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BRAND_NAME, BRAND_FOOTER_DESC } from '../constants';
import UserNavbar from '../components/UserNavbar';
import { getPublicDeals } from '../api/deals';
import type { Deal } from '../api/deals';

function getDealStatus(validTo: string | null) {
  if (!validTo) return { type: 'active' as const, label: 'Đang hoạt động', badge: 'bg-emerald-100 text-emerald-700 border border-emerald-200' };
  const diffDays = Math.ceil((new Date(validTo).getTime() - Date.now()) / 86400000);
  if (diffDays < 0) return { type: 'expired' as const,  label: 'Đã hết hạn',      badge: 'bg-red-100 text-red-700 border border-red-200' };
  if (diffDays <= 7) return { type: 'expiring' as const, label: `Còn ${diffDays} ngày`, badge: 'bg-orange-100 text-orange-700 border border-orange-200' };
  return { type: 'active' as const, label: 'Đang hoạt động', badge: 'bg-emerald-100 text-emerald-700 border border-emerald-200' };
}

function formatOffer(deal: Deal) {
  if (deal.badgeText) return deal.badgeText;
  return deal.discountType === 'PERCENTAGE'
    ? `GIẢM ${deal.discountValue}%`
    : `GIẢM ${deal.discountValue.toLocaleString('vi-VN')}₫`;
}

function formatDate(value: string | null) {
  return value
    ? new Date(value).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'Không giới hạn';
}

export default function Deals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        setDeals(await getPublicDeals());
      } catch {
        setError('Không thể tải ưu đãi hiện tại.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCopy = async (code: string) => {
    await navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="bg-surface text-on-surface font-sans selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col">
      <UserNavbar />

      <main className="max-w-7xl mx-auto px-8 py-12 flex-grow">
        {/* Editorial Header */}
        <section className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <span className="text-secondary font-bold tracking-[0.2em] text-[10px] uppercase block mb-4">Bộ sưu tập Đặc quyền</span>
            <h1 className="text-6xl font-black text-on-surface tracking-tighter leading-none mb-6 italic">Gói Đặc quyền.</h1>
            <p className="text-on-surface-variant text-xl leading-relaxed font-light">Những cơ hội được biên tập kỹ lưỡng dành cho những nhà thám hiểm sành sỏi. Số lượng có hạn, cảm hứng vô tận.</p>
          </div>
          <div className="hidden lg:block bg-surface-container-high p-8 rounded-[2rem] border border-outline-variant/10">
            <div className="text-sm font-black uppercase tracking-widest text-secondary mb-2">Thông tin Đặc quyền</div>
            <p className="text-sm text-on-surface-variant max-w-[200px]">Đăng ký nhận bản tin của chúng tôi để được ưu tiên nhận các thông tin ưu đãi mới nhất.</p>
          </div>
        </section>

        {/* Deals Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Deals Loop */}
          <div className="lg:col-span-8 space-y-6">
            {loading && (
              <div className="py-20 text-center text-on-surface-variant font-bold">Đang tải ưu đãi...</div>
            )}

            {error && (
              <div className="py-20 text-center text-red-500 font-bold">{error}</div>
            )}

            {!loading && !error && deals.length === 0 && (
              <div className="py-20 text-center text-on-surface-variant font-bold">Hiện chưa có ưu đãi công khai.</div>
            )}

            {deals.map((deal) => {
              const status = getDealStatus(deal.validTo);
              const isExpired = status.type === 'expired';
              const image = deal.campaignImageUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80';

              return (
                <div
                  key={deal.id}
                  className={`group relative bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_4px_24px_0_rgba(25,28,29,0.06)] border border-outline-variant/10 flex flex-col md:flex-row md:items-stretch transition-all ${isExpired ? 'opacity-70' : 'hover:shadow-[0_8px_40px_0_rgba(25,28,29,0.1)]'}`}
                >
                  {/* Expired overlay */}
                  {isExpired && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                      <div className="bg-white/80 backdrop-blur-sm px-6 py-2 rounded-2xl border border-red-200 shadow">
                        <span className="text-red-600 font-black text-sm uppercase tracking-widest">Đã hết hạn</span>
                      </div>
                    </div>
                  )}

                  <div className="md:w-2/5 relative h-56 md:h-auto overflow-hidden shrink-0">
                    <img
                      src={image}
                      alt={deal.title}
                      className={`w-full h-full object-cover transition-transform duration-1000 ${isExpired ? 'grayscale' : 'group-hover:scale-110'}`}
                    />
                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                      <span className="bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase text-primary shadow-lg border border-primary/10">
                        {deal.category || 'Ưu đãi'}
                      </span>
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow ${status.badge}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>

                  <div className="md:w-3/5 p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-black tracking-tight text-on-surface mb-2 leading-tight group-hover:text-primary transition-colors">{deal.title}.</h3>
                      <p className="text-on-surface-variant text-sm leading-relaxed mb-3 italic">"{deal.description || 'Ưu đãi đặc biệt dành cho hành trình tiếp theo của bạn.'}"</p>
                      <div className="text-xs text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                        Hết hạn: {formatDate(deal.validTo)}
                      </div>
                    </div>

                    <div className="border-t border-outline-variant/10 pt-4 mt-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Quyền lợi</span>
                          <span className="text-xl font-black text-secondary tracking-tighter">{formatOffer(deal)}</span>
                        </div>
                      </div>

                      {/* CTA based on type */}
                      {!isExpired && deal.displayMode === 'COPY_CODE' && deal.promoCode && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2.5 rounded-xl border border-outline-variant/20">
                            <span className="material-symbols-outlined text-sm text-secondary">confirmation_number</span>
                            <span className="font-mono font-black text-sm text-on-surface tracking-widest flex-1">{deal.promoCode}</span>
                            <button
                              onClick={() => handleCopy(deal.promoCode!)}
                              className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/70 transition-colors flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-sm">{copiedCode === deal.promoCode ? 'check_circle' : 'content_copy'}</span>
                              {copiedCode === deal.promoCode ? 'Đã sao chép' : 'Sao chép mã'}
                            </button>
                          </div>
                          <Link
                            to="/tours"
                            className="block w-full text-center bg-primary text-on-primary px-6 py-3 rounded-xl text-xs font-bold shadow-md hover:shadow-xl transition-all active:scale-95"
                          >
                            Khám phá tour áp dụng
                          </Link>
                        </div>
                      )}
                      {!isExpired && (deal.displayMode === 'AUTO_APPLY' || !deal.promoCode) && (
                        <Link
                          to="/tours"
                          className="block w-full text-center bg-primary text-on-primary px-6 py-3 rounded-xl text-xs font-bold shadow-md hover:shadow-xl transition-all active:scale-95"
                        >
                          Khám phá Ưu đãi · Áp dụng tự động khi đặt
                        </Link>
                      )}
                      {isExpired && (
                        <div className="text-center py-2">
                          <span className="text-sm text-on-surface-variant font-medium">Ưu đãi này đã hết hiệu lực.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sidebar / Contextual Info */}
          <aside className="lg:col-span-4 space-y-6">
             <div className="bg-surface-container-high p-7 rounded-2xl border border-outline-variant/10 text-center flex flex-col items-center">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
                <h3 className="text-lg font-black tracking-tight text-on-surface mb-2 leading-tight">Lời hứa của Chân trời.</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-5">Tất cả các ưu đãi đặc biệt đều bao gồm Dịch vụ Curator đầy đủ của chúng tôi: điều chỉnh hành trình cá nhân hóa, hỗ trợ 24/7 và các chỗ ở được lựa chọn kỹ lưỡng.</p>
                <div className="w-full h-px bg-outline-variant/10 mb-5" />
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex justify-between items-center text-xs font-bold border-b border-outline-variant/5 pb-2">
                    <span className="text-on-surface-variant uppercase tracking-widest">Sự hài lòng</span>
                    <span className="text-secondary">99.8%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold border-b border-outline-variant/5 pb-2">
                    <span className="text-on-surface-variant uppercase tracking-widest">Hỗ trợ</span>
                    <span className="text-secondary">24/7 Toàn cầu</span>
                  </div>
                </div>
             </div>

             <div className="signature-gradient p-7 rounded-2xl text-on-primary shadow-xl shadow-primary/20 relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="text-lg font-black tracking-tight mb-2 leading-tight">Phút chót?</h3>
                  <p className="text-sm opacity-80 leading-relaxed mb-5 italic">"Sự ngẫu hứng là linh hồn của du lịch. Tìm kiếm các trải nghiệm được biên tập kỹ lưỡng khởi hành trong vòng 14 ngày tới."</p>
                  <button className="bg-white text-primary px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg active:scale-95 transition-transform">Xem các chuyến khởi hành</button>
                </div>
                <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                   <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
                </div>
             </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 w-full mt-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-8 py-16 max-w-7xl mx-auto font-sans text-sm leading-relaxed">
          <div className="col-span-1 md:col-span-1">
            <div className="text-xl font-bold text-blue-900 mb-6">{BRAND_NAME}</div>
            <p className="text-slate-500 mb-8 max-w-xs">{BRAND_FOOTER_DESC}</p>
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-slate-400 hover:text-blue-600 cursor-pointer">public</span>
              <span className="material-symbols-outlined text-slate-400 hover:text-blue-600 cursor-pointer">camera</span>
              <span className="material-symbols-outlined text-slate-400 hover:text-blue-600 cursor-pointer">mail</span>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-blue-900 mb-6 uppercase tracking-widest text-xs">Điều hướng</h4>
            <ul className="space-y-4">
              <li><Link className="text-slate-500 hover:text-blue-600 transition-colors" to="/">Điểm đến</Link></li>
              <li><Link className="text-slate-500 hover:text-blue-600 transition-colors" to="/tours">Tour & Trải nghiệm</Link></li>
              <li><Link className="text-blue-700 underline font-medium" to="/deals">Ưu đãi Đặc biệt</Link></li>
              <li><Link className="text-slate-500 hover:text-blue-600 transition-colors" to="/journal">Kho lưu trữ Nhật ký</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-blue-900 mb-6 uppercase tracking-widest text-xs">Công ty</h4>
            <ul className="space-y-4">
              <li><Link className="text-slate-500 hover:text-blue-600 transition-colors" to="/about">Về chúng tôi</Link></li>
              <li><Link className="text-slate-500 hover:text-blue-600 transition-colors" to="/">Điều khoản Dịch vụ</Link></li>
              <li><Link className="text-slate-500 hover:text-blue-600 transition-colors" to="/">Chính sách Bảo mật</Link></li>
              <li><Link className="text-slate-500 hover:text-blue-600 transition-colors" to="/contact">Liên hệ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-blue-900 mb-6 uppercase tracking-widest text-xs">Trung tâm Curator</h4>
            <ul className="space-y-4">
              <li><Link className="text-slate-500 hover:text-blue-600 transition-colors" to="/">Tham gia làm HDV</Link></li>
              <li><Link className="text-slate-500 hover:text-blue-600 transition-colors" to="/">Chương trình liên kết</Link></li>
              <li><Link className="text-slate-500 hover:text-blue-600 transition-colors" to="/">Bảo hiểm Du lịch</Link></li>
              <li><Link className="text-slate-500 hover:text-blue-600 transition-colors" to="/">Trung tâm Hỗ trợ</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-200 py-8 px-8 text-center">
          <p className="text-slate-400 text-xs font-medium">© 2026 {BRAND_NAME}. Vượt ra ngoài giới hạn.</p>
        </div>
      </footer>
    </div>
  );
}
