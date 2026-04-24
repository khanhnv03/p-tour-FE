import { Link } from 'react-router-dom';
import { BRAND_NAME, BRAND_FOOTER_DESC } from '../constants';
import UserNavbar from '../components/UserNavbar';

export default function Journal() {
  return (
    <div className="bg-surface text-on-surface font-sans selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col">
      <UserNavbar />

      <main className="max-w-7xl mx-auto px-8 py-12 flex-grow">
        {/* Hero Section: Featured Article */}
        <section className="relative mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden rounded-[2rem] bg-surface-container-lowest shadow-[0_8px_32px_0_rgba(25,28,29,0.06)]">
            <div className="lg:col-span-7 relative h-[500px] lg:h-[650px] overflow-hidden">
              <img 
                alt="Featured Story" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfEy20Xj-X6MAQ2sYkYerHne1fv8d8eiwTsYIpWiEeRgdY8Mz1NcnLEa1zPM5RDR4axkxdHH6Pw8y7DJti7KyuSdSuKWGc7whwqIcuOvRZKYEKn1FJo93eBE448CzMmqQoFHFZMnS26pf551ghGxtLFzHBWREL6yQyPbRhMTD6PgZV4GvG_qgJhny3GzUx40Ak9Jc4doYaUyO35p9hhtjPBuPeqdKCOmb5GzdEg5DHrQip42YLZKWuWbN1Re6VQcmyHrQmdRfe6I4" 
              />
              <div className="absolute top-8 left-8">
                <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase text-primary">Câu chuyện Nổi bật</span>
              </div>
            </div>
            <div className="lg:col-span-5 flex flex-col justify-center p-12 lg:p-16 bg-surface-container-lowest">
              <div className="flex items-center gap-3 mb-6 text-on-surface-variant">
                <span className="text-sm font-semibold tracking-widest uppercase">Hành trình Du ký</span>
                <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
                <span className="text-sm font-semibold">12 phút đọc</span>
              </div>
              <h1 className="text-5xl font-black tracking-tighter text-on-surface mb-6 leading-[1.1]">Tiếng vọng tĩnh lặng từ những vịnh hẹp Bắc Âu.</h1>
              <p className="text-lg text-on-surface-variant mb-10 leading-relaxed">Sự chìm đắm sâu sắc vào những cảnh quan hoang sơ của Vòng Bắc Cực, nơi thời gian tan biến vào sắc xanh của dòng nước và tiếng gió thì thầm của những gã khổng lồ.</p>
              <div className="flex items-center gap-6">
                <Link to="/journal/arctic-circle" className="inline-block signature-gradient text-on-primary px-8 py-4 rounded-xl font-bold tracking-tight shadow-xl hover:shadow-2xl transition-shadow active:scale-95">Đọc toàn bộ câu chuyện</Link>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-on-surface">Elena Vance</span>
                  <span className="text-xs text-on-surface-variant">Biên tập viên cao cấp</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filters */}
        <section className="mb-16 flex flex-wrap items-center justify-between gap-8 border-b border-outline-variant/20 pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <button className="bg-primary text-on-primary px-6 py-2.5 rounded-full text-sm font-bold shadow-md transition-all">Tất cả câu chuyện</button>
            <button className="bg-surface-container-high hover:bg-surface-dim text-on-surface-variant px-6 py-2.5 rounded-full text-sm font-bold transition-all">Điểm đến ẩn giấu</button>
            <button className="bg-surface-container-high hover:bg-surface-dim text-on-surface-variant px-6 py-2.5 rounded-full text-sm font-bold transition-all">Văn hóa bản địa</button>
            <button className="bg-surface-container-high hover:bg-surface-dim text-on-surface-variant px-6 py-2.5 rounded-full text-sm font-bold transition-all">Hoang dã</button>
            <button className="bg-surface-container-high hover:bg-surface-dim text-on-surface-variant px-6 py-2.5 rounded-full text-sm font-bold transition-all">Ẩm thực</button>
          </div>
          <div className="flex items-center bg-surface-container-highest px-4 py-2 rounded-xl">
            <span className="material-symbols-outlined text-on-surface-variant mr-2">search</span>
            <input className="bg-transparent border-none outline-none focus:ring-0 text-sm font-medium w-48 text-on-surface" placeholder="Tìm kiếm kho lưu trữ..." type="text" />
          </div>
        </section>

        {/* Journal Grid: Bento Inspired */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Card 1 */}
          <article className="group cursor-pointer">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl mb-6 bg-surface-container-low shadow-[0_4px_24px_0_rgba(0,0,0,0.04)]">
              <img 
                alt="Kyoto Streets" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFtRqeB77oDe1ZkfEvT95wVTTs-GrQ4H-rrl_Fj2wZN2by7rEBif5DdLpB-23tt473yWuJM4doTxJuPjDZieFku6spa4DPDlFBliFE6PY_f-U6XnH3Oo1newmvq8tain52g4Dgvg0qcoboZJNgaMNDNwEDiw0QChvoBXdMGntaClePNpi-xBM1ez0KN9us3dh3vPb3KhPyIGwrBOouqm4MWcJ8EuSxyxjzNL8da8TZ6hQajnPW7vFrvfZe7V9nkJ-6h0hkczZhRUM" 
              />
              <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/40 backdrop-blur-xl rounded-2xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                <button className="w-full py-3 bg-white text-primary font-bold rounded-xl shadow-sm text-sm">Xem bài viết</button>
              </div>
            </div>
            <div className="px-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Văn hóa</span>
                <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">14 Thg 10, 2024</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-on-surface mb-3 group-hover:text-primary transition-colors">Thiền định giữa sắc chàm Kyoto.</h3>
              <p className="text-on-surface-variant leading-relaxed text-sm line-clamp-2">Lang thang qua những con hẻm cổ xưa nơi truyền thống gặp gỡ sự tối giản hiện đại trong vũ điệu của ánh sáng và bóng tối.</p>
            </div>
          </article>

          {/* Card 2 (Large Spanning Card Concept) */}
          <article className="group cursor-pointer">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl mb-6 bg-surface-container-low shadow-[0_4px_24px_0_rgba(0,0,0,0.04)]">
              <img 
                alt="Icelandic Highlands" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmE6pXwrYx9OZKtZNKqHInKzOhpM3mQSjMO9RlTcBheXE1VbQ2926f2SIwhT354APWCw0IJ9Zvx8P8hHXfs37-kFBsY2twuLSRwbE0O03qBDk0Urry2MwrYJG4A6QNx3eztPZozuDghw2WbNvtQ7UspWkXIgGUkhLST3WlhamMgIyEnP7qkYR6Igg0QP75RlXGXCSN6BA8LdL0l4xgk0yHq4OL-iIx9BcG4s9Ts3lPD3BE1hgS8HVrOAkswp0xooAGxu6bzrEmy8c" 
              />
              <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/40 backdrop-blur-xl rounded-2xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                <button className="w-full py-3 bg-white text-primary font-bold rounded-xl shadow-sm text-sm">Xem bài viết</button>
              </div>
            </div>
            <div className="px-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Thiên nhiên</span>
                <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">10 Thg 10, 2024</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-on-surface mb-3 group-hover:text-primary transition-colors">Sống sót cùng nhịp đập của trái đất.</h3>
              <p className="text-on-surface-variant leading-relaxed text-sm line-clamp-2">Một nhật ký ảnh về tâm chấn núi lửa hoang sơ của Iceland và sự kiên cường của phương Bắc.</p>
            </div>
          </article>

          {/* Card 3 */}
          <article className="group cursor-pointer">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl mb-6 bg-surface-container-low shadow-[0_4px_24px_0_rgba(0,0,0,0.04)]">
              <img 
                alt="Venetian Canals" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzu4f3pGKkkr5MlQ0z-VBCvweC-vBq-rIHT1XUP7udYNqAXBB70OdHQqS5drJqUESwvA92BDcKBheSfwNiELnLzI9ydB70W3D39CP43hAV35rETZ6on_v-ZHQcM2i9d8mLLjOSr-PjrT5ntJv_tEQJ9pFDwPAiK8sRkhWD1_AdH07_U5DzR6Q-TwoWdXl3qvmZ8uynLBNxviz3nGvltDJk00-le915yYrmp0ODbS2fyAqP-AqITLcsLrzByq_sQOxhCcL7a4PLI2g" 
              />
              <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/40 backdrop-blur-xl rounded-2xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                <button className="w-full py-3 bg-white text-primary font-bold rounded-xl shadow-sm text-sm">Xem bài viết</button>
              </div>
            </div>
            <div className="px-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Phong cách sống</span>
                <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">08 Thg 10, 2024</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-on-surface mb-3 group-hover:text-primary transition-colors">Venice: Phía sau chiếc mặt nạ.</h3>
              <p className="text-on-surface-variant leading-relaxed text-sm line-clamp-2">Tìm kiếm sự tĩnh lặng trong thành phố nổi nổi tiếng nhất thế giới, vượt ra ngoài những con đường du lịch.</p>
            </div>
          </article>

          {/* Card 4 */}
          <article className="group cursor-pointer">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl mb-6 bg-surface-container-low shadow-[0_4px_24px_0_rgba(0,0,0,0.04)]">
              <img 
                alt="Dolomites Hiking" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBA7z9szD5v1Q2Aq_LKLNlOy3CRK9XSXN0rXpRO7wygKltolDJmcSwDPcfipNat6nU-tcLbDRHzTMNWqLHZk0sNsWJcjwp5ujIdh7YjAX6L67lnNzCdlZ_uef1za35WI8kBLpA2HJ2zZS7SLTh_qxAv4MuGszLBap422Lu1aeNADAQsmjJXwaEAbei6dSJVN9k9bREBnm4r-Nu3V-AEDOu0Lhg2j0TxMVZutTqjHNEqiOE0HMImG5A-Anbpb50TkcygtvOCsdEtyGY" 
              />
              <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/40 backdrop-blur-xl rounded-2xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                <Link to="/journal/dolomites-hiking" className="block text-center w-full py-3 bg-white text-primary font-bold rounded-xl shadow-sm text-sm">Xem bài viết</Link>
              </div>
            </div>
            <div className="px-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Hoang dã</span>
                <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">05 Thg 10, 2024</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-on-surface mb-3 group-hover:text-primary transition-colors">Sự cô độc theo chiều thẳng đứng: Đỉnh Seceda.</h3>
              <p className="text-on-surface-variant leading-relaxed text-sm line-clamp-2">Hướng dẫn của một người đi bộ đường dài đến con đường núi ngoạn mục nhất ở Dolomites, Ý.</p>
            </div>
          </article>

          {/* Card 5 (Visual Break/Quote) */}
          <div className="flex flex-col justify-center items-center text-center p-12 bg-primary-container text-on-primary-container rounded-3xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <img 
                alt="texture" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjhvJ8eRTVi8ByzVYDNsEhvDWE7-BVqcvft0Hb0NDdpumcsj16e0t30seSfAdyt9S-tzbtthX8JND-DLiVBLEY77FniYvZ65-aS-_yr9SGpO2D1Q8PHKhrdWAesThe_YCCOE9erHD62H0y2lQQMvE7MrqER76WsV_l7dmjcDSCjeeFiQ5Pr0ZaXJ7lNDpBL7R0mg5tXzdwg-5Hv_kSCmfbRpD11Pl2oOhlxCU9pBNHy8SnSo_6J3OlE4rMOUW_e3UYWJJE_KPTz5Q" 
              />
            </div>
            <span className="material-symbols-outlined text-5xl mb-6 opacity-40" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
            <blockquote className="text-3xl font-black italic tracking-tighter leading-tight mb-8">
              "Du lịch là thứ duy nhất bạn mua mà khiến bạn trở nên giàu có hơn."
            </blockquote>
            <p className="text-sm font-bold uppercase tracking-[0.3em] opacity-80">Châm ngôn của người Biên tập</p>
          </div>

          {/* Card 6 */}
          <article className="group cursor-pointer">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl mb-6 bg-surface-container-low shadow-[0_4px_24px_0_rgba(0,0,0,0.04)]">
              <img 
                alt="Golden Gate" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyfiM5i--xcq2Gj8Fr8TMj7eMiLWzgMbJccnNjcCk6g-TDw4-f5CT2B44QLJKZYlYRgsD-ImcUwLek56DBbZ0gtVJigxNDVjoGXa9ZWQCLEalW4BjixVsiaWNQmABsUWcojUHFwdS_uylacfx8WQLwCZqa-HVAEf-Of9nbAhnYaDl7-HLfQkx8raJ4FE2eK_bFl8KYquO2b7KNTzh2vobbKzjZ6fPS4hEju0syeren6mrKR_lXPO0s9_L0RFRChpyS8bPQ-b6vwc4" 
              />
              <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/40 backdrop-blur-xl rounded-2xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                <Link to="/journal/san-francisco" className="block text-center w-full py-3 bg-white text-primary font-bold rounded-xl shadow-sm text-sm">Xem bài viết</Link>
              </div>
            </div>
            <div className="px-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Đô thị</span>
                <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">01 Thg 10, 2024</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-on-surface mb-3 group-hover:text-primary transition-colors">San Francisco: Sương mù và Thép.</h3>
              <p className="text-on-surface-variant leading-relaxed text-sm line-clamp-2">Ghi lại vẻ đẹp khó nắm bắt của các vi khí hậu và chất thơ công nghiệp của Vùng Vịnh.</p>
            </div>
          </article>
        </section>

        {/* Newsletter Section */}
        <section className="mt-32 mb-20">
          <div className="bg-surface-container-low rounded-[3rem] p-12 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="max-w-lg relative z-10">
              <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-on-surface mb-6">Những lá thư từ nơi tận cùng thế giới.</h2>
              <p className="text-on-surface-variant text-lg leading-relaxed">Tham gia cùng hơn 25.000 nhà thám hiểm nhận được những câu chuyện chưa kể, điểm đến bí mật và những bài thơ du lịch hàng tuần của chúng tôi.</p>
            </div>
            <form className="w-full lg:max-w-md flex flex-col gap-4 relative z-10" onSubmit={(e) => e.preventDefault()}>
              <div className="bg-surface-container-lowest p-2 rounded-2xl shadow-sm flex items-center">
                <input 
                    className="flex-1 bg-transparent border-none focus:ring-0 outline-none px-4 py-3 font-medium text-on-surface" 
                    placeholder="Email thám hiểm của bạn" 
                    type="email" 
                />
                <button className="signature-gradient text-on-primary px-8 py-3 rounded-xl font-bold active:scale-95 transition-transform shadow-md">Đăng ký</button>
              </div>
              <p className="text-xs text-on-surface-variant/60 px-4">Chúng tôi tôn trọng quyền riêng tư của bạn. Có thể hủy đăng ký bất cứ lúc nào với một cú nhấp chuột.</p>
            </form>
          </div>
        </section>
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
              <li><Link className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/deals">Ưu đãi Đặc biệt</Link></li>
              <li><Link className="text-blue-700 dark:text-blue-400 underline font-medium" to="/journal">Kho lưu trữ Nhật ký</Link></li>
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
