import { Link } from 'react-router-dom';
import { BRAND_NAME, BRAND_LOGO, BRAND_FOOTER_DESC } from '../constants';

export default function Home() {
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-sans">
      {/* TopNavBar */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl docked full-width top-0 sticky z-50 shadow-[0_8px_32px_0_rgba(25,28,29,0.06)]">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-3">
            <img src={BRAND_LOGO} alt="PTIT Logo" className="h-10 w-auto" />
            <div className="text-xl font-black tracking-tighter text-blue-900 dark:text-blue-50">
              {BRAND_NAME}
            </div>
          </Link>
          <div className="hidden md:flex space-x-8 font-medium tracking-tight">
            <a className="text-blue-700 dark:text-blue-400 font-bold border-b-2 border-blue-700 dark:border-blue-400 pb-1" href="#destinations">
              Điểm đến
            </a>
            <Link className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/tours">
              Tour
            </Link>
            <Link className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/deals">
              Ưu đãi
            </Link>
            <Link className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/journal">
              Nhật ký
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-slate-600 dark:text-slate-400 px-4 py-2 hover:bg-slate-100/50 rounded-lg transition-all text-sm font-semibold">
              Đăng nhập
            </Link>
            <Link to="/login" className="primary-gradient text-white px-6 py-2 rounded-xl text-sm font-bold scale-95 active:scale-90 transition-transform">
              Đăng ký
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[870px] w-full overflow-hidden flex items-center justify-center">
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
                  />
                </div>
              </div>
              <button className="primary-gradient text-white px-10 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-shadow">
                <span className="material-symbols-outlined">search</span>
                Tìm kiếm
              </button>
            </div>
          </div>
        </section>

        {/* Featured Destinations (Bento Grid) */}
        <section className="max-w-7xl mx-auto px-8 py-24" id="destinations">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-secondary font-bold tracking-widest text-xs uppercase">Điểm đến xu hướng</span>
              <h2 className="text-4xl font-black tracking-tighter text-on-surface mt-2">Điểm Đến Nổi Bật</h2>
            </div>
            <button className="text-primary font-bold flex items-center gap-2 group">
              Xem tất cả <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-[800px] md:h-[600px]">
            <div className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-3xl cursor-pointer">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                alt="ancient yellow architecture and colorful lanterns of hoi an old town reflected in thu bon river at night"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPDZEYNKvk4CDzLMGvFE_C_wzvMCewgFvcjYmNl32PCJnQQGgee3bq766yfi0JqPuhLQdFxiAUvb892CZocZ3VqFTLkyO-GlEhLzYgFTCgKROeuX2mIyO7J7hKHQtzfG-UHr20vH8pq-5xXW8JA_m0uRhTFr9q_dT5bR2OHy5v_3ubYr_uwDgtIH2UoXWUcOy6PpgBXHXkLBeu9MiX1cjMF4wIFo5xZRGF0RlSNBIGgLbmzoQTuA4qGuX8CsS3ZkuwJ-Dz8k1doqI"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-white text-3xl font-black">Hội An</h3>
                <p className="text-white/80 text-sm">Di sản văn hóa thế giới</p>
              </div>
            </div>
            <div className="md:col-span-1 md:row-span-1 group relative overflow-hidden rounded-3xl cursor-pointer">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                alt="aerial view of hoan kiem lake in hanoi with turtle tower in the center surrounded by lush green trees"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKl5BKKTVHhFFwPkf3QNONVXsIV1U-vk0EvR7FvfyQncWZI3br7yuy6kTwwObw0JZ1_1DcKMHdu12lzl5NWV4MmMBiwcMSwJMXuhzBOWmyUkwxaT0ac89YqrC1fChN-_rpcGbWhfXcQrHXx-rN0FKuMpwX1jopDOsj05DUxdO84mSEOQCbrByx3Sw7pW00y_Bpn7GvkAuwb-VqJ8pu0OVZeeiszauYRvZ6sEBK2KApXiy1av1ExsNUaT_-K2kdfSKJ5Jaz8UY-U6c"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white text-xl font-bold">Hà Nội</h3>
              </div>
            </div>
            <div className="md:col-span-1 md:row-span-1 group relative overflow-hidden rounded-3xl cursor-pointer">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                alt="golden bridge in ba na hills da nang held by giant concrete hands overlooking misty mountains"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDv_gJgWLGVZWM_U7PrYsYYeLrhPToEk-3L2_AZdGpRVtxTav5PHlassvoK8_i9J_ezCe8yydn77n0TOhDnelzfqH1O_Q-fbHuTUm0rCpKNYXJep1h0CGR8pwNYZs55gYmrCeqGshHLLYh5agpr08TP_4xzaf-_jHz-s1XHSN3KCUdeLY9nZ2cBbGCLvox9bz43Wj9p9d0xq9Nmkyy6wHY8mHDwE9xGjcaQo-0_1xdkGfKES4DXRgFcs0t6Sd9D97KgZfg-gFLFSWo"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white text-xl font-bold">Đà Nẵng</h3>
              </div>
            </div>
            <div className="md:col-span-1 md:row-span-1 group relative overflow-hidden rounded-3xl cursor-pointer">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                alt="crystal clear turquoise waters of phu quoc island with white sand beach and tropical palm trees"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9Wed2yAWA4vBxHt2Fkc7iONxKP6YRIbrWJEzQ7uIBaO2OLsmiFazdM-tsT--FTZU3nOiahuVCrR9rK5YrLwTkwus8MTiOQeA391chiyR59o30S3B0z8LyuaoUDKkzevHT1ML3ahp88JH_lwJ-eVx7jA9LLfwioVd932CRGjNZC_em8un6gYuRRlJj6EqHwoeGJRg6f2exUqIx-oM3FL50UYviCoxyq2E8cc59ifmaS8hgOE9qg6U-pW3J9040F9IbaBxFHAma7nA"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white text-xl font-bold">Phú Quốc</h3>
              </div>
            </div>
            <div className="md:col-span-1 md:row-span-1 group relative overflow-hidden rounded-3xl cursor-pointer">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                alt="stepped rice terraces in sapa valley shrouded in morning mist with ethnic minority villages in distance"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDh8g7eXpyoAbKbzLIdvaB0nYnpD9NeCxQitWODFC3PBuPl3PAjJ5ZmMPanxQMYUzXD3dWWm4W9FoJ54OekoANixMwBO2z6urWQcAMI0wy4bcoyc2CP_4dXMiDshZCy9MIUQOgTlu9kSag_T6V-ZJ58PE7WdwGQlzndVgPP0eAtOk9EVfKhWwSwfvOR5DLTA6_UUXfi9WkNrQc5Qe97okXhEiZCFxbMOs7DUEqQlLUlncqdPtbaMlN5zdj1OcbduzcOlg96sUZdiVo"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white text-xl font-bold">Sapa</h3>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Tours */}
        <section className="bg-surface-container-low py-24" id="tours">
          <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-secondary font-bold tracking-widest text-xs uppercase">Trải nghiệm tốt nhất</span>
              <h2 className="text-4xl font-black tracking-tighter text-on-surface mt-2">Tour Phổ Biến</h2>
            </div>
            <Link to="/tours" className="text-primary font-bold flex items-center gap-2 group">
              Xem tất cả <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Tour Card 1 */}
              <Link to="/tour/ha-long-bay" className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group block">
                <div className="relative h-64 overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt="modern cruise ship sailing through the iconic limestone formations of ha long bay under bright blue sky"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnfejOz-sLyj5wXTMn1ZXCJN6j4OZ5sjg950AweRt0Hgc6SpW-AhrTew95TmIHeA1msa2rJ9vjM3TEEXBNqUYUO--oScCI2P8FvRU_K_iXjhtadnj8BfhzwJSj0g9Q1m0YyFY0kEiax9oBRSGC0nR7kiznMYVGeWeTL_NnDl4jbmihLpjrID0TzYsZ3ITefe904AR5Mzms9y9PmjWqiKlHFAOQWgtzEjP7GKisqi3ETS47qicmlXGR0BHfXUQ41FCJfs9SM37cF70"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary">
                    2 Ngày 1 Đêm
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-on-surface leading-tight">Du Thuyền Hạ Long Sang Trọng</h3>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-sm font-bold">4.9</span>
                    </div>
                  </div>
                  <p className="text-on-surface-variant text-sm mb-6">Khám phá vịnh Hạ Long trên du thuyền 5 sao với đầy đủ tiện nghi hiện đại.</p>
                  <div className="flex justify-between items-center pt-4 border-t border-surface-container">
                    <div>
                      <span className="text-xs text-outline block">Giá từ</span>
                      <span className="text-2xl font-black text-primary">$299</span>
                    </div>
                    <div className="bg-surface-container-high group-hover:bg-primary group-hover:text-white p-3 rounded-xl transition-colors">
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Tour Card 2 */}
              <Link to="/tour/phu-quoc" className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group block">
                <div className="relative h-64 overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt="scenic aerial view of kien giang coastline with pristine beaches and tropical greenery in phu quoc"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeIEwLdwqQXIoMb_--82ZKhddmH6KmJj1rQRALv9WrzfTEWzudI_6RR7sQNitpL9hsXFt3z2bha8wNgjmjzRRrASa_nGRUfAp0u6f8qoRRsuEcYvTZI33YaSCnFor78oBoPZnF54Oo3j8AnXJGo0bz9yBm8LXFzsSuuTH9QmDvw4otKZouSYKj0YXwbl2NxEofqzN-F0Whkk8Bj4zVOvRqlqX7JAAFzR5zaFjtpG_2wMj5uYGtCnvAs3XEG7xLSfRqbT9ceaxBIx4"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary">
                    3 Ngày 2 Đêm
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-on-surface leading-tight">Phú Quốc - Thiên Đường Nắng Vàng</h3>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-sm font-bold">4.8</span>
                    </div>
                  </div>
                  <p className="text-on-surface-variant text-sm mb-6">Tận hưởng làn nước trong xanh và các hoạt động lặn ngắm san hô kỳ thú.</p>
                  <div className="flex justify-between items-center pt-4 border-t border-surface-container">
                    <div>
                      <span className="text-xs text-outline block">Giá từ</span>
                      <span className="text-2xl font-black text-primary">$350</span>
                    </div>
                    <div className="bg-surface-container-high group-hover:bg-primary group-hover:text-white p-3 rounded-xl transition-colors">
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Tour Card 3 */}
              <Link to="/tour/sapa" className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group block">
                <div className="relative h-64 overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt="colorful ethnic minority markets in sapa with traditional fabrics and mountain peaks in background"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSyBUbgczxCwZ61KhP0jBwrZHmjjTqHlx9R6VfAEcBajTbusDwQW698l8XY5GjEs_PAN6sVO__GT5Gm13vCUKh7HJvRxllk52r3yBXINr7_2oCNDjeHT03C87UuFAOgXDemKg1r158tgMsTuvKn3DVTclNnPVQv9YQJ2Xm0LrFb_zlnBLU0E3kO_tpACOkmf-6bgG7Pn8JjDQVCwe8yH3rhh4GdZhu7ta_ubCJb6khrWeE0kkgAFExQY38c1_rQVbA-Tybo6s_QmE"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary">
                    4 Ngày 3 Đêm
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-on-surface leading-tight">Chinh Phục Fansipan - Sapa</h3>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-sm font-bold">4.7</span>
                    </div>
                  </div>
                  <p className="text-on-surface-variant text-sm mb-6">Hành trình khám phá nóc nhà Đông Dương và văn hóa các dân tộc vùng cao.</p>
                  <div className="flex justify-between items-center pt-4 border-t border-surface-container">
                    <div>
                      <span className="text-xs text-outline block">Giá từ</span>
                      <span className="text-2xl font-black text-primary">$210</span>
                    </div>
                    <div className="bg-surface-container-high group-hover:bg-primary group-hover:text-white p-3 rounded-xl transition-colors">
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-24 max-w-7xl mx-auto px-8" id="deals">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-black tracking-tighter text-on-surface">Tại Sao Chọn Chúng Tôi?</h2>
            <p className="text-on-surface-variant mt-4">Chúng tôi cam kết mang lại những trải nghiệm du lịch tuyệt vời nhất với dịch vụ chuyên nghiệp và tận tâm.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
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
        <section className="bg-surface-container-high/30 py-24" id="journal">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <span className="text-secondary font-bold tracking-widest text-xs uppercase">Chia sẻ từ khách hàng</span>
              <h2 className="text-4xl font-black tracking-tighter text-on-surface mt-2">Đánh Giá Từ Du Khách</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
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
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
              </div>

              {/* Testimonial 2 */}
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
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
              </div>

              {/* Testimonial 3 */}
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
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="max-w-7xl mx-auto px-8 py-24">
          <div className="primary-gradient rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -ml-32 -mb-32"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6">Nhận Thông Tin Khuyến Mãi</h2>
              <p className="text-white/80 mb-10 text-lg">Đăng ký để nhận những thông tin mới nhất về các điểm đến và ưu đãi độc quyền dành riêng cho bạn.</p>
              <form className="flex flex-col md:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
                <input
                  className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder:text-white/60 focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all outline-none"
                  placeholder="Địa chỉ email của bạn"
                  type="email"
                />
                <button className="bg-white text-primary font-black px-10 py-4 rounded-2xl hover:bg-opacity-90 transition-all" type="submit">
                  Đăng Ký Ngay
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-950 w-full mt-auto border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-8 py-16 max-w-7xl mx-auto text-sm leading-relaxed">
          <div className="col-span-1 md:col-span-1">
            <div className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-6">{BRAND_NAME}</div>
            <p className="text-slate-500 dark:text-slate-400 mb-6 italic">{BRAND_FOOTER_DESC}</p>
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
            <h6 className="font-bold text-blue-900 dark:text-blue-100 mb-6 uppercase tracking-wider text-xs">Công ty</h6>
            <ul className="space-y-4">
              <li><Link className="text-slate-500 hover:text-blue-600 transition-colors" to="/about">Về chúng tôi</Link></li>
              <li><a className="text-slate-500 hover:text-blue-600 transition-colors" href="#!">Điều khoản Dịch vụ</a></li>
              <li><a className="text-slate-500 hover:text-blue-600 transition-colors" href="#!">Chính sách Bảo mật</a></li>
              <li><Link className="text-slate-500 hover:text-blue-600 transition-colors" to="/contact">Liên hệ</Link></li>
            </ul>
          </div>
          <div>
            <h6 className="font-bold text-blue-900 dark:text-blue-100 mb-6 uppercase tracking-wider text-xs">Điểm Đến</h6>
            <ul className="space-y-4">
              <li><a className="text-slate-500 hover:text-blue-600 transition-colors" href="#!">Hạ Long Bay</a></li>
              <li><a className="text-slate-500 hover:text-blue-600 transition-colors" href="#!">Phú Quốc Island</a></li>
              <li><a className="text-slate-500 hover:text-blue-600 transition-colors" href="#!">Sapa Valley</a></li>
              <li><a className="text-slate-500 hover:text-blue-600 transition-colors" href="#!">Hội An Ancient Town</a></li>
            </ul>
          </div>
          <div>
            <h6 className="font-bold text-blue-900 dark:text-blue-100 mb-6 uppercase tracking-wider text-xs">Liên Hệ</h6>
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
