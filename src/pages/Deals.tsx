import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BRAND_NAME, BRAND_LOGO, BRAND_FOOTER_DESC } from '../constants';

const TODAY = new Date('2026-04-22');

function getDealStatus(validUntilDate: Date) {
  const diffDays = Math.ceil((validUntilDate.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return { type: 'expired' as const,  label: 'Đã hết hạn',      badge: 'bg-red-100 text-red-700 border border-red-200' };
  if (diffDays <= 7) return { type: 'expiring' as const, label: `Còn ${diffDays} ngày`, badge: 'bg-orange-100 text-orange-700 border border-orange-200' };
  return { type: 'active' as const, label: 'Đang hoạt động', badge: 'bg-emerald-100 text-emerald-700 border border-emerald-200' };
}

const deals = [
  {
    id: 1,
    title: 'Mùa thu tĩnh lặng giữa Dolomites',
    description: 'Tiết kiệm 20% cho tất cả các hành trình giữa tuần suốt tháng 11. Tìm kiếm sự tĩnh lặng giữa những rừng thông vàng.',
    offer: 'GIẢM 20%',
    validUntilDate: new Date('2024-11-30'),
    validUntilLabel: '30 Thg 11, 2024',
    code: 'AUTUMN24',
    ctaType: 'code' as const,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBA7z9szD5v1Q2Aq_LKLNlOy3CRK9XSXN0rXpRO7wygKltolDJmcSwDPcfipNat6nU-tcLbDRHzTMNWqLHZk0sNsWJcjwp5ujIdh7YjAX6L67lnNzCdlZ_uef1za35WI8kBLpA2HJ2zZS7SLTh_qxAv4MuGszLBap422Lu1aeNADAQsmjJXwaEAbei6dSJVN9k9bREBnm4r-Nu3V-AEDOu0Lhg2j0TxMVZutTqjHNEqiOE0HMImG5A-Anbpb50TkcygtvOCsdEtyGY',
    category: 'Theo mùa',
  },
  {
    id: 2,
    title: 'Gói Thiền định Kyoto',
    description: 'Tặng kèm lễ trà đạo và quyền vào vườn tư nhân cho tất cả các lượt đặt phòng từ 5 đêm trở lên.',
    offer: 'NÂNG CẤP MIỄN PHÍ',
    validUntilDate: new Date('2024-12-15'),
    validUntilLabel: '15 Thg 12, 2024',
    code: 'KYOTO24',
    ctaType: 'code' as const,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFtRqeB77oDe1ZkfEvT95wVTTs-GrQ4H-rrl_Fj2wZN2by7rEBif5DdLpB-23tt473yWuJM4doTxJuPjDZieFku6spa4DPDlFBliFE6PY_f-U6XnH3Oo1newmvq8tain52g4Dgvg0qcoboZJNgaMNDNwEDiw0QChvoBXdMGntaClePNpi-xBM1ez0KN9us3dh3vPb3KhPyIGwrBOouqm4MWcJ8EuSxyxjzNL8da8TZ6hQajnPW7vFrvfZe7V9nkJ-6h0hkczZhRUM',
    category: 'Văn hóa',
  },
  {
    id: 3,
    title: 'Khám phá Vịnh Hạ Long Hè 2026',
    description: 'Đặt tour Vịnh Hạ Long từ nay đến 30/05/2026 để nhận combo tặng thêm bữa sáng và 1 buổi kayak miễn phí.',
    offer: 'TẶNG COMBO',
    validUntilDate: new Date('2026-05-30'),
    validUntilLabel: '30 Thg 5, 2026',
    code: 'HALONG26',
    ctaType: 'auto' as const,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDr2YSLmTIxjlIqFFBTr9Ax3o7r-jZQqGGadVy7btZKID6BoEiCliRYJqm7jRGpoTeTVXPGhgxUubj5GAu3chlf069et29bLeE6E0rU98iKKY30y1eYJk1IIQSYx-1HJ001ABrEQ4q8DrjDFExvyYf5mzOFScBUzpJ3NNuyhiaDh3rDK0SOMl6FIV7UTwjVffKeUirK07Je2SBLfDan5KEkUJSby3EsZpY76TNZZn_V2S9cYygBfvSkT5bUsI6BQKX_byFEbJZMkPQ',
    category: 'Khuyến mãi hè',
  },
];

export default function Deals() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="bg-surface text-on-surface font-sans selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col">
      {/* TopNavBar */}
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl docked full-width top-0 sticky z-50 shadow-[0_8px_32px_0_rgba(25,28,29,0.06)]">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto font-medium tracking-tight">
          <Link to="/" className="flex items-center gap-3">
            <img src={BRAND_LOGO} alt="PTIT Logo" className="h-10 w-auto" />
            <div className="text-xl font-black tracking-tighter text-blue-900 dark:text-blue-50">
              {BRAND_NAME}
            </div>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/">Điểm đến</Link>
            <Link className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/tours">Tour</Link>
            <Link className="text-blue-700 dark:text-blue-400 font-bold border-b-2 border-blue-700 dark:border-blue-400 pb-1" to="/deals">Ưu đãi</Link>
            <Link className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/journal">Nhật ký</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="px-5 py-2 text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-100/50 rounded-lg transition-all active:scale-95">Đăng nhập</Link>
            <Link to="/login" className="px-6 py-2.5 signature-gradient text-white rounded-xl font-bold shadow-lg active:scale-95 transition-transform">Đăng ký</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-12 flex-grow">
        {/* Editorial Header */}
        <section className="mb-20 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Deals Loop */}
          <div className="lg:col-span-8 space-y-12">
            {deals.map((deal) => {
              const status = getDealStatus(deal.validUntilDate);
              const isExpired = status.type === 'expired';

              return (
                <div
                  key={deal.id}
                  className={`group relative bg-surface-container-lowest rounded-[2.5rem] overflow-hidden shadow-[0_8px_48px_0_rgba(25,28,29,0.04)] border border-outline-variant/10 flex flex-col md:flex-row items-stretch transition-all ${isExpired ? 'opacity-70' : 'hover:shadow-[0_12px_64px_0_rgba(25,28,29,0.1)]'}`}
                >
                  {/* Expired overlay */}
                  {isExpired && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                      <div className="bg-white/80 backdrop-blur-sm px-6 py-2 rounded-2xl border border-red-200 shadow">
                        <span className="text-red-600 font-black text-sm uppercase tracking-widest">Đã hết hạn</span>
                      </div>
                    </div>
                  )}

                  <div className="md:w-1/2 relative h-72 md:h-auto overflow-hidden">
                    <img
                      src={deal.image}
                      alt={deal.title}
                      className={`w-full h-full object-cover transition-transform duration-1000 ${isExpired ? 'grayscale' : 'group-hover:scale-110'}`}
                    />
                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                      <span className="bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase text-primary shadow-lg border border-primary/10">
                        {deal.category}
                      </span>
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow ${status.badge}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>

                  <div className="md:w-1/2 p-10 flex flex-col justify-between">
                    <div>
                      <h3 className="text-3xl font-black tracking-tight text-on-surface mb-4 leading-tight group-hover:text-primary transition-colors">{deal.title}.</h3>
                      <p className="text-on-surface-variant text-base leading-relaxed mb-6 font-light italic">"{deal.description}"</p>
                      <div className="text-xs text-on-surface-variant flex items-center gap-1 mb-2">
                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                        Hết hạn: {deal.validUntilLabel}
                      </div>
                    </div>

                    <div className="border-t border-outline-variant/10 pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Quyền lợi</span>
                          <span className="text-2xl font-black text-secondary tracking-tighter">{deal.offer}</span>
                        </div>
                      </div>

                      {/* CTA based on type */}
                      {!isExpired && deal.ctaType === 'code' && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2.5 rounded-xl border border-outline-variant/20">
                            <span className="material-symbols-outlined text-sm text-secondary">confirmation_number</span>
                            <span className="font-mono font-black text-sm text-on-surface tracking-widest flex-1">{deal.code}</span>
                            <button
                              onClick={() => handleCopy(deal.code)}
                              className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/70 transition-colors flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-sm">{copiedCode === deal.code ? 'check_circle' : 'content_copy'}</span>
                              {copiedCode === deal.code ? 'Đã sao chép' : 'Sao chép mã'}
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
                      {!isExpired && deal.ctaType === 'auto' && (
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
          <aside className="lg:col-span-4 space-y-8">
             <div className="bg-surface-container-high p-10 rounded-[2.5rem] border border-outline-variant/10 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
                <h3 className="text-2xl font-black tracking-tight text-on-surface mb-4 leading-tight">Lời hứa của Chân trời.</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-8">Tất cả các ưu đãi đặc biệt đều bao gồm Dịch vụ Curator đầy đủ của chúng tôi: điều chỉnh hành trình cá nhân hóa, hỗ trợ 24/7 và các chỗ ở được lựa chọn kỹ lưỡng.</p>
                <div className="w-full h-px bg-outline-variant/10 mb-8"></div>
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

             <div className="signature-gradient p-10 rounded-[2.5rem] text-on-primary shadow-2xl shadow-primary/20 relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="text-2xl font-black tracking-tight mb-4 leading-tight">Phút chót?</h3>
                  <p className="text-sm opacity-80 leading-relaxed mb-8 font-light italic">"Sự ngẫu hứng là linh hồn của du lịch. Tìm kiếm các trải nghiệm được biên tập kỹ lưỡng khởi hành trong vòng 14 ngày tới."</p>
                  <button className="bg-white text-primary px-8 py-3 rounded-xl text-xs font-bold shadow-lg active:scale-95 transition-transform">Xem các chuyến khởi hành</button>
                </div>
                <div className="absolute -right-12 -bottom-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
                   <span className="material-symbols-outlined text-[160px]" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
                </div>
             </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-950 w-full mt-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-8 py-16 max-w-7xl mx-auto font-sans text-sm leading-relaxed">
          <div className="col-span-1 md:col-span-1">
            <div className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-6">{BRAND_NAME}</div>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs">{BRAND_FOOTER_DESC}</p>
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-slate-400 hover:text-blue-600 cursor-pointer">public</span>
              <span className="material-symbols-outlined text-slate-400 hover:text-blue-600 cursor-pointer">camera</span>
              <span className="material-symbols-outlined text-slate-400 hover:text-blue-600 cursor-pointer">mail</span>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-6 uppercase tracking-widest text-xs">Điều hướng</h4>
            <ul className="space-y-4">
              <li><Link className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/">Điểm đến</Link></li>
              <li><Link className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/tours">Tour & Trải nghiệm</Link></li>
              <li><Link className="text-blue-700 dark:text-blue-400 underline font-medium" to="/deals">Ưu đãi Đặc biệt</Link></li>
              <li><Link className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/journal">Kho lưu trữ Nhật ký</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-6 uppercase tracking-widest text-xs">Công ty</h4>
            <ul className="space-y-4">
              <li><Link className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/about">Về chúng tôi</Link></li>
              <li><Link className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/">Điều khoản Dịch vụ</Link></li>
              <li><Link className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/">Chính sách Bảo mật</Link></li>
              <li><Link className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/contact">Liên hệ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-6 uppercase tracking-widest text-xs">Trung tâm Curator</h4>
            <ul className="space-y-4">
              <li><Link className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/">Tham gia làm HDV</Link></li>
              <li><Link className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/">Chương trình liên kết</Link></li>
              <li><Link className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/">Bảo hiểm Du lịch</Link></li>
              <li><Link className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/">Trung tâm Hỗ trợ</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-800 py-8 px-8 text-center">
          <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">© 2026 {BRAND_NAME}. Vượt ra ngoài giới hạn.</p>
        </div>
      </footer>
    </div>
  );
}
