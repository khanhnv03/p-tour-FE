import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { BRAND_NAME, BRAND_LOGO } from '../constants';

export default function TourDetails() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Tổng quan' },
    { id: 'itinerary', label: 'Lịch trình' },
    { id: 'inclusions', label: 'Bao gồm' },
    { id: 'reviews', label: 'Đánh giá' },
  ];

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col">
      {/* TopNavBar */}
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl docked full-width top-0 sticky z-50 shadow-[0_8px_32px_0_rgba(25,28,29,0.06)]">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-3">
            <img src={BRAND_LOGO} alt="PTIT Logo" className="h-10 w-auto" />
            <div className="text-xl font-black tracking-tighter text-blue-900 dark:text-blue-50">
              {BRAND_NAME}
            </div>
          </Link>
          <div className="hidden md:flex items-center space-x-8 font-medium tracking-tight">
            <Link to="/" className="text-blue-700 dark:text-blue-400 font-bold border-b-2 border-blue-700 dark:border-blue-400 pb-1">
              Điểm đến
            </Link>
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
            <button className="text-slate-600 px-4 py-2 font-medium hover:bg-slate-100/50 rounded-lg transition-all">
              Đăng nhập
            </button>
            <button className="primary-gradient text-white px-6 py-2 rounded-xl font-bold scale-95 active:scale-90 transition-transform">
              Đăng ký
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto px-8 py-12">
        {/* Breadcrumb & Title Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-on-surface-variant text-sm mb-4">
            <Link to="/" className="hover:text-primary transition-colors">Điểm đến</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="cursor-pointer hover:text-primary transition-colors">Việt Nam</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-primary font-semibold">Du thuyền Premium Vịnh Hạ Long</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-on-surface mb-4">Vịnh Hạ Long Huyền Ảo: Hành Trình Sang Trọng 3 Ngày</h1>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center bg-surface-container-low px-3 py-1.5 rounded-full">
                  <span className="material-symbols-outlined text-secondary text-sm mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="font-bold text-sm">4.9</span>
                  <span className="text-on-surface-variant text-xs ml-1">(128 đánh giá)</span>
                </div>
                <div className="flex items-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm mr-1">location_on</span>
                  <span className="text-sm font-medium">Quảng Ninh, Việt Nam</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-3 bg-surface-container-lowest shadow-sm rounded-full hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined">share</span>
              </button>
              <button className="p-3 bg-surface-container-lowest shadow-sm rounded-full hover:bg-surface-container-high transition-colors text-secondary">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              </button>
            </div>
          </div>
        </div>

        {/* Photo Gallery Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[600px] mb-12">
          <div className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-2xl group">
            <img 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              alt="Stunning aerial view of Ha Long Bay limestone karsts rising from emerald waters during misty sunrise with traditional wooden cruise ship" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYxBlwy8uojyDVx1tSLMwyGv99xZPD9a4IjrbHfCmAfZ2aP3QixIicyOsYuYYSbL9EWycnEx8d0IcQk51THHdlpuH9_I4UmHDFrZQ65wU-5mgzJXfa5Hhxq_A2KeVJeNnzKWBDscQdu1vzpTVqWgVJfcjrWpEIo3PAJ0xMbIiCz3BQesi8vc61kcYJ_jAw2masf4YQYPCa-0nlX1p2OyYFSXcGL_j6AiJDOMwWDU-ruG3mJMQ-zEOVnEOtxGq1biiiKKBZKn_zcts"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div className="overflow-hidden rounded-2xl relative group">
            <img 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              alt="Interior of a luxury cruise cabin with dark wood furnishings and large panoramic window overlooking the ocean" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIvrunnkXQ_NrDXdqxtOJl6Ofu2sD63at8Aru3FmDXAfTAbzHwq4REARl4-26ckyKOl91mVpwYJAK5xAi0C_OLk9c056f3v7obPrOAEngegtnnzwOJ_S22CYFqyX4ed1YqXPCkSuWxkDEEWchVk2NnnTVE8wGGADHJe2634855NpXlRcmSD0PdCN-qRFZB3AY1LX0Hksp4mgxMeXv5IAGhVMu7qt_ctgOkpn4P3zxuuXwaH0BYdzSzbd9DcoL4m8gQg8_FXs3KWMQ"
            />
          </div>
          <div className="overflow-hidden rounded-2xl relative group">
            <img 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              alt="Close-up of fresh Vietnamese seafood platter beautifully arranged with tropical garnish" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsNWXzfihQFXU4snvYUtzy6Jdn9z4hoPW71bOLTNJy0nTpEv4ITTIkig3g2yeMzf-_cjjA7MyXGyb5PQVOmTaA2RLLcsxIT_G902lV3tCcsOYiFyg0AyIYzRMX__2_WT13T99Xds8G_ltQhqs8InqBEBTno_8y4IG2o4_IaBysiDNSwpmEAY5HO14_RwtIblMmSbz64kMV873DjZkr9vWYzsRN9cMF5qArsadYXOJqhFXHSJVyFfD3S7HGNFLRM3hT6YsdA00jur4"
            />
          </div>
          <div className="overflow-hidden rounded-2xl relative group">
            <img 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              alt="Couple kayaking through a narrow sea cave into a hidden lagoon in Ha Long Bay" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZKB9Fl1Yz5XgI_BYN99Yqb-62gbPlf2fafU9vnMj6VzXHVNi-cGmJsQG5QEVPKtvfrua6n146ftpBhl7dfKP5d3tPxKuTxnFMg62kXWSRNvS3sJBBY3F9g2x0ONOf6cmCc8ERLPgKlmBCltpYrLCDeyXplhxtYj9NSwA4Bo65fxeAiDeq4h7E5aMxv5NZd4j7p7iQCIfHEcKXWg5fUQBbAHnNt-khmVJljzB6hws6r5tyKBfPOcdy6p4UwCyu9wFXSr-0I0HOnq0"
            />
          </div>
          <div className="overflow-hidden rounded-2xl relative group">
            <img 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              alt="Sunset deck view of a modern luxury cruise with sun loungers and cocktail on a side table" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRNn9IEhG7fNZMFnwlYOwO66_LMtrDs-_TR1is5cobmquMdReJE4H6tK3LrSpxgp25PWF65aO_S-HvAROXswNoCeTMH5YgnNghTC5qAxBiheSLQvyNO00uqq2GQHxaPQm8rUDDMN6WGHh77Rx0M7DcwfZC2YXyjiRCbcE2Tf_acdsRm_GhUC50636TmPKOk72SrvIzkXzj83Zz3eAOQm9U-1ajWY0sJMdCJDjv0gJC2zWO_LIl6_qTNdy5Ooqd9pTB1A6mhnZRV1Q"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white font-bold">+12 Photos</span>
            </div>
          </div>
        </div>

        {/* Info Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-surface-container-low p-6 rounded-2xl mb-12">
          <div className="flex items-center gap-4">
            <div className="bg-surface-container-lowest p-3 rounded-xl">
              <span className="material-symbols-outlined text-primary">schedule</span>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">Thời lượng</p>
              <p className="font-bold text-on-surface">3 Ngày, 2 Đêm</p>
            </div>
          </div>
          <div className="flex items-center gap-4 border-l md:border-outline-variant/20 md:pl-8">
            <div className="bg-surface-container-lowest p-3 rounded-xl">
              <span className="material-symbols-outlined text-primary">groups</span>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">Số người</p>
              <p className="font-bold text-on-surface">Tối đa 16 khách</p>
            </div>
          </div>
          <div className="flex items-center gap-4 border-l md:border-outline-variant/20 md:pl-8">
            <div className="bg-surface-container-lowest p-3 rounded-xl">
              <span className="material-symbols-outlined text-primary">mountain_flag</span>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">Độ khó</p>
              <p className="font-bold text-on-surface">Nhẹ nhàng</p>
            </div>
          </div>
          <div className="flex items-center gap-4 border-l md:border-outline-variant/20 md:pl-8">
            <div className="bg-surface-container-lowest p-3 rounded-xl">
              <span className="material-symbols-outlined text-primary">translate</span>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">Ngôn ngữ</p>
              <p className="font-bold text-on-surface">Anh, Việt</p>
            </div>
          </div>
        </div>

        {/* Content & Sidebar Layout */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Side: Tabs & Details */}
          <div className="flex-1">
            <div className="border-b border-outline-variant/30 mb-8 flex gap-8 overflow-x-auto pb-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 text-sm whitespace-nowrap transition-all relative ${
                    activeTab === tab.id
                      ? 'text-primary font-bold'
                      : 'text-on-surface-variant hover:text-on-surface font-semibold'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-12"
                  >
                    <section>
                      <h3 className="text-2xl font-extrabold mb-6 tracking-tight">Trải nghiệm</h3>
                      <p className="text-lg text-on-surface-variant leading-relaxed mb-6">
                        Hành trình qua làn nước xanh màu ngọc bích của Vịnh Hạ Long trên du thuyền hiện đại của chúng tôi. Chuyến đi đặc biệt này kết hợp vẻ đẹp nguyên sơ của các đảo đá vôi di sản thế giới UNESCO với đỉnh cao của lòng hiếu khách Việt Nam. Từ tập Thái Cực Quyền lúc bình minh trên boong tàu đến những bữa tối lung linh ánh nến trong hang động ẩn giấu, mọi khoảnh khắc đều được tạo ra để định nghĩa lại sự ngạc nhiên trong bạn.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 bg-surface-container-low p-4 rounded-xl">
                          <span className="material-symbols-outlined text-primary">restaurant</span>
                          <span className="font-medium">Ẩm thực cao cấp Âu - Á</span>
                        </div>
                        <div className="flex items-center gap-3 bg-surface-container-low p-4 rounded-xl">
                          <span className="material-symbols-outlined text-primary">spa</span>
                          <span className="font-medium">Dịch vụ Spa & Massage chuyên nghiệp</span>
                        </div>
                        <div className="flex items-center gap-3 bg-surface-container-low p-4 rounded-xl">
                          <span className="material-symbols-outlined text-primary">kayaking</span>
                          <span className="font-medium">Chèo thuyền Kayak & Thăm hang động</span>
                        </div>
                        <div className="flex items-center gap-3 bg-surface-container-low p-4 rounded-xl">
                          <span className="material-symbols-outlined text-primary">fitness_center</span>
                          <span className="font-medium">Lớp học Tai Chi đón bình minh</span>
                        </div>
                      </div>
                    </section>
                  </motion.div>
                )}

                {activeTab === 'itinerary' && (
                  <motion.div
                    key="itinerary"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <section>
                      <h3 className="text-2xl font-extrabold mb-8 tracking-tight">Hành trình chi tiết</h3>
                      <div className="space-y-8 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-surface-container-high">
                        {/* Day 1 */}
                        <div className="relative pl-12">
                          <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold ring-4 ring-white shadow-lg">1</div>
                          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm">
                            <h4 className="font-bold text-lg mb-2 text-primary">Ngày 1: Khởi hành & Hoàng hôn đầu tiên</h4>
                            <p className="text-on-surface-variant leading-relaxed mb-4">Lên tàu vào buổi trưa với sự chào đón nồng nhiệt. Nhổ neo tiến về phía Vịnh Lan Hạ yên tĩnh. Buổi chiều chèo thuyền kayak qua Hang Sáng & Hang Tối.</p>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="h-32 rounded-xl overflow-hidden shadow-sm">
                                <img className="w-full h-full object-cover" alt="Delicious Vietnamese food" src="https://picsum.photos/seed/food1/400/300" />
                              </div>
                              <div className="h-32 rounded-xl overflow-hidden shadow-sm">
                                <img className="w-full h-full object-cover" alt="Sunset cruise" src="https://picsum.photos/seed/sunset1/400/300" />
                              </div>
                            </div>
                            <div className="mt-4 space-y-2">
                              <div className="flex items-start gap-2 text-sm text-on-surface-variant">
                                <span className="material-symbols-outlined text-xs mt-1 text-primary">circle</span>
                                <div><span className="font-bold text-on-surface">12:00</span> - Check-in và ăn trưa trên tàu</div>
                              </div>
                              <div className="flex items-start gap-2 text-sm text-on-surface-variant">
                                <span className="material-symbols-outlined text-xs mt-1 text-primary">circle</span>
                                <div><span className="font-bold text-on-surface">15:00</span> - Chèo Kayak khám phá Hang Sáng Tối</div>
                              </div>
                              <div className="flex items-start gap-2 text-sm text-on-surface-variant">
                                <span className="material-symbols-outlined text-xs mt-1 text-primary">circle</span>
                                <div><span className="font-bold text-on-surface">18:00</span> - Tiệc Sunset và Bữa tối sang trọng</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Day 2 */}
                        <div className="relative pl-12">
                          <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant text-xs font-bold ring-4 ring-white">2</div>
                          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm">
                            <h4 className="font-bold text-lg mb-2 text-on-surface">Ngày 2: Khám phá mê cung giữa vịnh</h4>
                            <p className="text-on-surface-variant leading-relaxed mb-4">Buổi sáng sớm với lớp học Thái Cực Quyền. Di chuyển sang tàu nhỏ để khám phá sâu hơn các ngóc ngách của vịnh. Ghé thăm các làng chài địa phương.</p>
                            <div className="space-y-2">
                              <div className="flex items-start gap-2 text-sm text-on-surface-variant">
                                <span className="material-symbols-outlined text-xs mt-1 text-slate-400">circle</span>
                                <div><span className="font-bold text-on-surface">06:30</span> - Thái Cực Quyền trên boong tàu</div>
                              </div>
                              <div className="flex items-start gap-2 text-sm text-on-surface-variant">
                                <span className="material-symbols-outlined text-xs mt-1 text-slate-400">circle</span>
                                <div><span className="font-bold text-on-surface">09:00</span> - Thăm làng chài Việt Hải</div>
                              </div>
                              <div className="flex items-start gap-2 text-sm text-on-surface-variant">
                                <span className="material-symbols-outlined text-xs mt-1 text-slate-400">circle</span>
                                <div><span className="font-bold text-on-surface">12:30</span> - BBQ hải sản trên bãi biển riêng</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Day 3 */}
                        <div className="relative pl-12">
                          <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant text-xs font-bold ring-4 ring-white">3</div>
                          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm">
                            <h4 className="font-bold text-lg mb-2 text-on-surface">Ngày 3: Bình yên buổi sáng & Trở về</h4>
                            <p className="text-on-surface-variant leading-relaxed">Tận hưởng buổi sáng thong thả trên du thuyền khi trở về bến cảng. Bữa sáng muộn (brunch) được phục vụ trong khi đi qua các hòn đảo kỳ vĩ.</p>
                          </div>
                        </div>
                      </div>
                    </section>
                  </motion.div>
                )}

                {activeTab === 'inclusions' && (
                  <motion.div
                    key="inclusions"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  >
                    <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-8 rounded-3xl border border-emerald-100 dark:border-emerald-800/30 transition-colors">
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                        <span className="material-symbols-outlined">check_circle</span>
                        Bao gồm trong Tour
                      </h3>
                      <ul className="space-y-4">
                        {[
                          'Phòng nghỉ sang trọng có ban công riêng',
                          'Tất cả các bữa ăn trong hành trình (2 sáng, 3 trưa, 2 tối)',
                          'Nước uống chào mừng và trái cây tươi hàng ngày',
                          'Vé tham quan và phí lưu trú trên vịnh',
                          'Sử dụng chèo thuyền Kayak và thuyền nan',
                          'Lớp học Thái Cực Quyền và dạy nấu ăn',
                          'Thiết bị câu cá, câu mực buổi tối'
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm font-medium">
                            <span className="material-symbols-outlined text-lg text-emerald-500 mt-0.5">done</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-red-50/50 dark:bg-red-900/10 p-8 rounded-3xl border border-red-100 dark:border-red-800/30 transition-colors">
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-red-700 dark:text-red-400">
                        <span className="material-symbols-outlined">cancel</span>
                        Không bao gồm
                      </h3>
                      <ul className="space-y-4">
                        {[
                          'Đồ uống gọi thêm trong các bữa ăn',
                          'Dịch vụ Visa và vé máy bay',
                          'Dịch vụ Spa, Massage và giặt là',
                          'Tiền tips (tiền thưởng) cho nhân viên',
                          'Bảo hiểm du lịch cá nhân',
                          'Các chi phí cá nhân khác'
                        ].map((item, i) => (
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
                  <motion.div
                    key="reviews"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="bg-surface-container-low p-8 rounded-3xl mb-12 flex flex-col md:flex-row items-center gap-12">
                      <div className="text-center">
                        <div className="text-6xl font-black text-primary mb-2">4.9</div>
                        <div className="flex justify-center mb-2">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <span key={s} className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          ))}
                        </div>
                        <div className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Dựa trên 128 đánh giá</div>
                      </div>
                      <div className="flex-1 space-y-3 w-full max-w-md">
                        {[
                          { stars: 5, count: 115 },
                          { stars: 4, count: 10 },
                          { stars: 3, count: 2 },
                          { stars: 2, count: 1 },
                          { stars: 1, count: 0 },
                        ].map((rate) => (
                          <div key={rate.stars} className="flex items-center gap-4">
                            <span className="text-xs font-bold w-4">{rate.stars}</span>
                            <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(rate.count / 128) * 100}%` }}
                                className="h-full bg-secondary"
                              />
                            </div>
                            <span className="text-xs font-bold text-on-surface-variant w-8">{rate.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-8">
                      {[
                        { 
                          name: 'Lê Minh Anh', 
                          date: '2 tuần trước', 
                          rating: 5, 
                          comment: 'Một trải nghiệm tuyệt vời vượt ngoài mong đợi! Du thuyền rất sang trọng, nhân viên cực kỳ nhiệt tình và đồ ăn rất ngon. Chắc chắn sẽ quay lại.',
                          avatar: 'LA'
                        },
                        { 
                          name: 'David Wilson', 
                          date: '1 tháng trước', 
                          rating: 5, 
                          comment: 'The bay is magical and this cruise is the best way to see it. Kayaking was a highlight. Highly recommend the 2-night stay to truly relax.',
                          avatar: 'DW'
                        },
                        { 
                          name: 'Nguyễn Thảo Trang', 
                          date: '3 tháng trước', 
                          rating: 4, 
                          comment: 'Chuyến đi rất vui, cảnh đẹp. Chỉ tiếc là hôm đó trời hơi mưa một chút lúc chiều tối nhưng nhân viên đã sắp xếp tiệc trong nhà rất chu đáo.',
                          avatar: 'TT'
                        }
                      ].map((review, i) => (
                        <div key={i} className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
                                {review.avatar}
                              </div>
                              <div>
                                <h5 className="font-bold text-on-surface">{review.name}</h5>
                                <p className="text-xs text-on-surface-variant">{review.date}</p>
                              </div>
                            </div>
                            <div className="flex">
                              {[...Array(review.rating)].map((_, j) => (
                                <span key={j} className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                              ))}
                            </div>
                          </div>
                          <p className="text-on-surface-variant leading-relaxed text-sm italic">{review.comment}</p>
                        </div>
                      ))}
                      <button className="w-full py-4 text-primary font-bold hover:bg-primary/5 transition-colors rounded-2xl border-2 border-dashed border-primary/20">
                        Xem thêm đánh giá
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Side: Sticky Booking Widget */}
          <aside className="lg:w-[400px]">
            <div className="sticky top-24 bg-surface-container-lowest p-8 rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-outline-variant/10">
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Từ</span>
                <span className="text-3xl font-black text-primary">849.000₫</span>
                <span className="text-on-surface-variant text-sm">/ khách</span>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Ngày khởi hành</label>
                  <div className="relative">
                    <input 
                      className="w-full bg-surface-container-low border-0 rounded-xl px-4 py-4 font-semibold text-on-surface focus:ring-2 focus:ring-primary/20 cursor-pointer" 
                      type="text" 
                      defaultValue="24 thg 10, 2024"
                    />
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant">calendar_today</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Số lượng khách</label>
                  <div className="flex items-center justify-between bg-surface-container-low rounded-xl px-4 py-3">
                    <button className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm text-primary hover:bg-primary hover:text-white transition-colors">
                      <span className="material-symbols-outlined">remove</span>
                    </button>
                    <span className="font-bold text-lg">02</span>
                    <button className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm text-primary hover:bg-primary hover:text-white transition-colors">
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-dashed border-outline-variant/30 pt-6 space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Gói Tour (849k x 2)</span>
                  <span className="font-bold">1.698.000₫</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Phí dịch vụ &amp; Cảng</span>
                  <span className="font-bold">120.000₫</span>
                </div>
                <div className="flex justify-between text-xl font-black pt-2">
                  <span>Tổng cộng</span>
                  <span className="text-primary">1.818.000₫</span>
                </div>
              </div>

              <Link to="/checkout" className="w-full primary-gradient text-white py-5 rounded-2xl font-extrabold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center">
                Đặt ngay
              </Link>
              <p className="text-center text-xs text-on-surface-variant mt-4 font-medium italic">Hủy miễn phí tối đa 48h trước khởi hành</p>
            </div>
          </aside>
        </div>

        {/* Related Tours Section */}
        <section className="mt-24">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-black tracking-tight mb-2">Khám phá tương tự</h2>
              <p className="text-on-surface-variant">Khám phá thêm những hành trình đặc sắc tại Việt Nam</p>
            </div>
            <Link to="/tours" className="text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all">
              Xem tất cả <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group cursor-pointer">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-4 shadow-sm">
                <img 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  alt="Ancient town architecture of Hoi An" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBn4YWFotE8umBe_jkoM8QWn7OttkOxZLk1tMYztD5wSXn7jqsAUMRCB93A9kpdtdivXPc3amRoqo98FbLTj34yNdUhqJ1PL_mRbjdeQGpIxwdZiK73RkaOPS-WJOupnQUMDAm3ztssJF07ujzwnq1hWZ-EHL1O-_hIkCcS8-qQi8JhmDkGo2XanXiUBUzkP8P24SDSCkNf_fgtHS3KQQWLSGqbjWV2hXYIzbF0MHErY1juj-uoKdxmCWJ7jgnVMpqkCZmrbmOOq6I"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold">VĂN HÓA</div>
              </div>
              <h4 className="font-extrabold text-xl mb-1 group-hover:text-primary transition-colors">Hội An: Khám phá Phố Cổ</h4>
              <p className="text-on-surface-variant text-sm mb-3">4 Ngày • Di sản văn hóa</p>
              <p className="font-black text-lg">5.200.000₫</p>
            </div>
            
            {/* Card 2 */}
            <div className="group cursor-pointer">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-4 shadow-sm">
                <img 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  alt="Dramatic rice terraces in Sapa" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxMk49aokNPvJM6BiWlIIiNhah61J2YMJs4pGwGIa6_R-c6Fkw_K4b1pYqr1LGvE5KMV2OZ7HPqmhjAVg26pWYoX32lwR4rb3T4c1hbaIQMrVb0wlee5PwxBbZE4hTm9eE06G96gRT01EWcmDadjGYScP5WUs0I18lQ5tCt_tiSB3Mk0__9k5Rog9cIoKqiLcM6kXC3R2w1alhLJnriibGtONHUbfWKU1iYroOrJP9FYVoZ4CxgTyCpVlsSGeV88KOZdJfirOhRSA"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold">PHIÊU LƯU</div>
              </div>
              <h4 className="font-extrabold text-xl mb-1 group-hover:text-primary transition-colors">Sapa: Hành trình vùng cao</h4>
              <p className="text-on-surface-variant text-sm mb-3">5 Ngày • Khám phá núi rừng</p>
              <p className="font-black text-lg">6.450.000₫</p>
            </div>
            
            {/* Card 3 */}
            <div className="group cursor-pointer">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-4 shadow-sm">
                <img 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  alt="Aerial view of the Golden Bridge in Ba Na Hills" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRP2nZ6PYbGfIEOGWIMNQxY_x8IP4aW6OZiEe79IrDR-vbXb2visrdT5-LVJYdurtfByhwdLv8gd-k0ztvfQkjz-18Kf6rb5yhrhseZ5mw_TsYAk46J2yjjo88fSAAcLmDIu7D-BIT8tA-UI2HSBWbZ3cq7-6lNcjaj4iKnB2AY2MY2Of8A66XtVBZXJECDghXxlywYPaez4e6ygZa95-KiTpDJHMgdhrRdO8TLEtYRpO-NNxidtXiinwRFzeCxqwhbfgmThOfRU4"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold">PHỔ BIẾN</div>
              </div>
              <h4 className="font-extrabold text-xl mb-1 group-hover:text-primary transition-colors">Đà Nẵng &amp; Bà Nà Hills Luxury</h4>
              <p className="text-on-surface-variant text-sm mb-3">3 Ngày • Thành phố biển</p>
              <p className="font-black text-lg">4.800.000₫</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-950 mt-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-8 py-16 max-w-7xl mx-auto font-['Inter'] text-sm leading-relaxed">
          <div className="space-y-6">
            <div className="text-xl font-bold text-blue-900 dark:text-blue-100">{BRAND_NAME}</div>
            <p className="text-slate-500 dark:text-slate-400">Khám phá những chân trời mới cùng những trải nghiệm đẳng cấp và cá nhân hóa từ PTIT.</p>
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-slate-400 hover:text-blue-600 cursor-pointer">social_leaderboard</span>
              <span className="material-symbols-outlined text-slate-400 hover:text-blue-600 cursor-pointer">language</span>
              <span className="material-symbols-outlined text-slate-400 hover:text-blue-600 cursor-pointer">mail</span>
            </div>
          </div>
          <div className="space-y-4">
            <h5 className="font-bold text-blue-900 dark:text-blue-100">Explore</h5>
            <ul className="space-y-3">
              <li><a className="text-slate-500 hover:text-blue-600" href="#!">All Destinations</a></li>
              <li><a className="text-slate-500 hover:text-blue-600" href="#!">Special Tours</a></li>
              <li><a className="text-slate-500 hover:text-blue-600" href="#!">Travel Journal</a></li>
              <li><a className="text-slate-500 hover:text-blue-600" href="#!">Group Packages</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="font-bold text-blue-900 dark:text-blue-100">Company</h5>
            <ul className="space-y-3">
              <li><a className="text-slate-500 hover:text-blue-600" href="#!">About Us</a></li>
              <li><a className="text-slate-500 hover:text-blue-600" href="#!">Terms of Service</a></li>
              <li><a className="text-slate-500 hover:text-blue-600" href="#!">Privacy Policy</a></li>
              <li><a className="text-slate-500 hover:text-blue-600" href="#!">Contact</a></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h5 className="font-bold text-blue-900 dark:text-blue-100">Newsletter</h5>
            <p className="text-slate-500">Subscribe for exclusive travel insights and early bird deals.</p>
            <div className="flex gap-2">
              <input className="bg-white border-0 rounded-lg px-4 py-2 w-full text-sm outline-none focus:ring-2 focus:ring-primary/20" placeholder="Email address" type="email" />
              <button className="bg-primary text-white p-2 rounded-lg">
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-800 py-8 px-8 text-center text-slate-500 text-xs">
          © 2026 {BRAND_NAME}. Vượt ra ngoài giới hạn.
        </div>
      </footer>
    </div>
  );
}
