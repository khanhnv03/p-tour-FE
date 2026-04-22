import { Link } from 'react-router-dom';
import { BRAND_NAME, BRAND_LOGO, BRAND_FOOTER_DESC } from '../constants';

export default function AboutUs() {
  return (
    <div className="bg-surface text-on-surface antialiased font-sans min-h-screen flex flex-col">
      <header className="docked full-width top-0 sticky z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(25,28,29,0.06)]">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-3">
            <img src={BRAND_LOGO} alt="PTIT Logo" className="h-10 w-auto" />
            <div className="text-xl font-black tracking-tighter text-blue-900 dark:text-blue-50">
              {BRAND_NAME}
            </div>
          </Link>
          <nav className="hidden md:flex items-center space-x-8 font-medium tracking-tight">
            <Link className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/">Điểm đến</Link>
            <Link className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/tours">Tour</Link>
            <Link className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/deals">Ưu đãi</Link>
            <Link className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/journal">Nhật ký</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-slate-600 font-semibold px-4 py-2 hover:bg-slate-100/50 rounded-lg transition-all scale-95 active:scale-90">Đăng nhập</Link>
            <Link to="/login" className="signature-gradient text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:opacity-90 transition-all scale-95 active:scale-90">Đăng ký</Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="relative h-[614px] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              className="w-full h-full object-cover" 
              alt="wide cinematic landscape of misty blue mountain ranges at dawn with a clear horizon and soft atmospheric perspective" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLgxMqnmlW2PMpBfM-CbZ3cYrllVoKwt4wNoA13QdiEMz_-_GMve9evCKIVyEiiC-WynEenc6GIZhMP0vz_2-V02EBlT4FtHrSBor6uobBu38X83cad5169mKoI7mL1MWgd3IVIxFCWTGbIe2I35I5sEFtwc1SwKS2jgFAPxFS-1mmUZ3RNzXgGgCvee1qi_yxIBrp_100O6PwPvnuorduGIXzB0dqWWovUdzVn3l2Md6_IIO_talZP80HDzjdqkMu5z7EIdPptEk" 
            />
            <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
            <div className="max-w-2xl">
              <span className="inline-block px-4 py-1 rounded-full bg-primary-container text-white text-xs font-bold tracking-widest uppercase mb-6">Di sản của chúng tôi</span>
              <h1 className="text-6xl font-extrabold tracking-tighter text-on-surface mb-6 leading-[1.1]">Định nghĩa ranh giới của sự khám phá</h1>
              <p className="text-xl text-on-surface-variant leading-relaxed">Chúng tôi không chỉ đặt chỗ chuyến đi. Chúng tôi biên tập những khoảnh khắc tĩnh lặng, những đỉnh cao nghẹt thở và những bí mật địa phương để biến một hành trình thành một câu chuyện định nghĩa cuộc đời.</p>
            </div>
          </div>
        </section>

        <section className="py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-2xl relative z-10">
                  <img 
                    className="w-full h-full object-cover" 
                     alt="a curated vintage travel aesthetic featuring a leather journal, a compass, and a film camera on a rustic wooden table" 
                     src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhNAT0oOsVxdB9eaTQzt2nnTAKSgUiqnzmnrH6AMUBDprAdOipQjIoFsQIXK9YwHF5RkKbmb6iFX7hJalumv7Oo2sbvmKDGMmDsEQYcjm3qFjVYSMSXGkTH3WW-ozpFDvvVhaUnKmw1_Dg2UThE_dNVenB_zI3Hrksoy5GnnpiVufxoFIwxiFklz3rPm90npPvLMfv8eie2xPgUe16uaXpUzjwn2S2nR5_c5seoxXL_sSM635FvLnVnJxuagEg4lh2brk5bhxVxLk" 
                  />
                </div>
                <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-secondary-container/10 rounded-xl -z-10 backdrop-blur-3xl"></div>
                <div className="absolute -top-8 -left-8 w-32 h-32 bg-primary-container/10 rounded-full -z-10"></div>
              </div>
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl font-bold tracking-tight mb-6">Sứ mệnh của chúng tôi</h2>
                  <p className="text-lg text-on-surface-variant leading-relaxed mb-4">
                    Được thành lập vào năm 2014, {BRAND_NAME} ra đời từ một nhận thức đơn giản: thời đại kỹ thuật số giúp việc mua du lịch trở nên dễ dàng hơn, nhưng việc trải nghiệm lại khó khăn hơn. 
                  </p>
                  <p className="text-lg text-on-surface-variant leading-relaxed">
                    Sứ mệnh của chúng tôi là khôi phục nghệ thuật của người lữ hành. Bằng cách kết hợp trực giác con người với mạng lưới địa phương sâu rộng, chúng tôi xây dựng các lịch trình bỏ qua những "bẫy du lịch" để hướng tới sự hòa nhập thực sự và khám phá bền vững.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-8 pt-8">
                  <div className="p-6 bg-surface-container-low rounded-xl">
                    <span className="material-symbols-outlined text-primary text-3xl mb-4">public</span>
                    <h3 className="font-bold text-lg mb-2">Tiếp cận toàn cầu</h3>
                    <p className="text-sm text-on-surface-variant">Kết nối vô song trên 120 quốc gia.</p>
                  </div>
                  <div className="p-6 bg-surface-container-low rounded-xl">
                    <span className="material-symbols-outlined text-primary text-3xl mb-4">verified</span>
                    <h3 className="font-bold text-lg mb-2">Biên tập Tinh hoa</h3>
                    <p className="text-sm text-on-surface-variant">Mọi đối tác đều được kiểm định khắt khe về chất lượng.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-surface-container-low">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl font-bold tracking-tight mb-4">Dẫn lối bởi Giá trị</h2>
              <p className="text-lg text-on-surface-variant">Sự chính trực là kim chỉ nam định hướng mọi quyết định của chúng tôi, từ sự bền vững môi trường đến phẩm giá của các hướng dẫn viên địa phương.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center group">
                <div className="w-16 h-16 bg-surface-container-lowest rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:shadow-md transition-shadow">
                  <span className="material-symbols-outlined text-secondary text-3xl">eco</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Trách nhiệm Triệt để</h3>
                <p className="text-on-surface-variant leading-relaxed">Chúng tôi bù đắp 110% lượng khí thải carbon và ưu tiên các mô hình du lịch tác động thấp nhưng giá trị cao.</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-surface-container-lowest rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:shadow-md transition-shadow">
                  <span className="material-symbols-outlined text-secondary text-3xl">diversity_1</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Chính trực Văn hóa</h3>
                <p className="text-on-surface-variant leading-relaxed">Chúng tôi đảm bảo doanh thu du lịch ở lại trong cộng đồng địa phương, hỗ trợ các di sản bản địa.</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-surface-container-lowest rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:shadow-md transition-shadow">
                  <span className="material-symbols-outlined text-secondary text-3xl">visibility</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Minh bạch Tuyệt đối</h3>
                <p className="text-on-surface-variant leading-relaxed">Không có phí ẩn, không có hoa hồng thiếu minh bạch. Chỉ có sự biên tập du lịch trung thực dành cho người khám phá.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold tracking-tight mb-4">Đội ngũ Curator</h2>
                <p className="text-lg text-on-surface-variant">Những trí tuệ đằng sau cuộc phiêu lưu vĩ đại tiếp theo của bạn. Một tập thể những nhà thám hiểm, sử gia và người kể chuyện.</p>
              </div>
              <Link className="text-primary font-bold flex items-center gap-2 group" to="/careers">
                Xem cơ hội nghề nghiệp
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="group">
                <div className="aspect-[3/4] rounded-xl overflow-hidden mb-6 relative">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    alt="professional portrait" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkywRQnYB77d8h51tNuVPXKtTEtRycW2SCzd-N_8vIbvgDpy3moTmWrN6Gs_tQ3Ya2r3xeqgHGQyFpTTqiEKCYrRZpWbB_EI7b2vSInYIkb7OzH9Ks0UYNg3LxpycJ7mu8tPIBPpmMafjD5QpZYtdjq4L5sw8DfuJ0lTLSBV0AyaqTq5UHW4X4vGMhsVbjmvM5UU939q3y2cWCiXaGtJ2P1Ls5YWPl_G8Dud0sQFLjYuIpN51ol2SEKXyswINsXMnY_gsOr5lds18" 
                  />
                </div>
                <h3 className="text-xl font-bold">Elena Thorne</h3>
                <p className="text-secondary text-sm font-semibold uppercase tracking-wider mb-2">Người sáng lập & Chuyên gia tư vấn</p>
                <p className="text-on-surface-variant text-sm">Cựu đạo diễn phim tài liệu với niềm đam mê vùng cao nguyên cận Sahara.</p>
              </div>
              <div className="group">
                <div className="aspect-[3/4] rounded-xl overflow-hidden mb-6 relative">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    alt="portrait" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDkNadA5zh1h-JJkvHXadtpIg3u4srKFWmbDgk9v0vEMC88ZHokzZQtP5T4tDZFsV6ciUi3leMQYwuQUCUeh5OeTzCcMGDo9FRr2gV6e6gYQJZDC7s0uXbePC1YfCZmoGJ9mRO3lDNoHUi2xt0Z5GwotlbtGY2R5xsYU3jINEPXbS1rwH6UsTUvYvUCs3oCDiTlchI57zC0gSItPzIUGoFquI27HbfczYocYEqnJXMX3VKxscfUckLFiYP4H_R5njn7SvwaySMUG4" 
                  />
                </div>
                <h3 className="text-xl font-bold">Marcus Chen</h3>
                <p className="text-secondary text-sm font-semibold uppercase tracking-wider mb-2">Trưởng phòng Thám hiểm</p>
                <p className="text-on-surface-variant text-sm">Marcus đã chinh phục sáu trong số những đỉnh núi cao nhất thế giới và lập bản đồ các con đường chưa biết tại Patagonia.</p>
              </div>
              <div className="group">
                <div className="aspect-[3/4] rounded-xl overflow-hidden mb-6 relative">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    alt="portrait" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdNkr1VpKa1BPElSlFX0EAKK718f0ybOC1tpuV3t5Hbubt7TP0FJlZ_St3TZ5gR5IR35izfzLExhf6jyARnEwOt1yhjZWdtCsWRNfxRyY4silB8jRnCKFuPtwXNySfPRdbt8RTVWaifN9cv2DqbHzYuYsxU93r1ZKDXn1bzukRbVE47CyLujSA5bN-KF6ES_QeAeVNm_o2zFy5OSGZ03el5adFdyKejVptbCEEh6ArNZoKjgC8VsrhcY8JdDs5aoDxiUPDYIXB8VA" 
                  />
                </div>
                <h3 className="text-xl font-bold">Sarah Jenkins</h3>
                <p className="text-secondary text-sm font-semibold uppercase tracking-wider mb-2">Giám đốc Bền vững</p>
                <p className="text-on-surface-variant text-sm">Nhà khoa học môi trường đảm bảo dấu chân của chúng ta nhẹ nhàng hơn một làn gió.</p>
              </div>
              <div className="group">
                <div className="aspect-[3/4] rounded-xl overflow-hidden mb-6 relative">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    alt="portrait" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBksYNs2qYB_4tY04X5eAxVwJTXYuqYnVXjuj4ZcHHEbNMz9LLHiqvnTQNDw33xrgjXEnWoa0qjlDs3maMFF-TQJPIE1PI1RJWHOAVh_J8UEWMKbXKtrLjL7qPr489JuKUZejaTPLBOvXeN2twB0lczPv7qlhkDzQNjkALQ424Upqpz3sm8SF8pJeZ41lk6kY3JafyZa0zeUpXip5_Ghxo7JLpeFAoD8b8U9r-HRERIlgv3U4fV-T2uNhvCm3xyApm1NBJXnrxmL6w" 
                  />
                </div>
                <h3 className="text-xl font-bold">David Rossi</h3>
                <p className="text-secondary text-sm font-semibold uppercase tracking-wider mb-2">Trưởng mạng lưới Địa phương</p>
                <p className="text-on-surface-variant text-sm">Nhà ngôn ngữ học và sử gia quản lý các mối quan hệ với cộng đồng địa phương trên toàn thế giới.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-surface-container-highest/30">
          <div className="max-w-7xl mx-auto px-8">
            <p className="text-center text-on-surface-variant font-semibold uppercase tracking-widest text-sm mb-12">Trusted Partners in Discovery</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-3xl">landscape</span>
                <span className="font-bold text-xl tracking-tighter">ALPINE CO.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-3xl">sailing</span>
                <span className="font-bold text-xl tracking-tighter">AZURE SEAS</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-3xl">flight</span>
                <span className="font-bold text-xl tracking-tighter">GLOBAL AIR</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-3xl">apartment</span>
                <span className="font-bold text-xl tracking-tighter">VANTAGE HOTELS</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-3xl">park</span>
                <span className="font-bold text-xl tracking-tighter">ECO TRAILS</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-primary text-on-primary">
          <div className="max-w-7xl mx-auto px-8">
            <div className="bg-surface-container-lowest/10 backdrop-blur-md rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="relative z-10">
                <h2 className="text-5xl font-extrabold tracking-tighter mb-8 leading-tight">Sẵn sàng viết tiếp chương mới của bạn?</h2>
                <div className="flex flex-col md:flex-row justify-center gap-6">
                  <Link to="/tours" className="bg-white text-primary font-bold px-10 py-4 rounded-xl shadow-xl hover:scale-105 transition-transform flex items-center justify-center">Bắt đầu Khám phá</Link>
                  <Link to="/contact" className="border-2 border-white/30 text-white font-bold px-10 py-4 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center">Liên hệ Chuyên gia</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full mt-auto bg-slate-50 dark:bg-slate-950 font-sans text-sm leading-relaxed border-t border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-8 py-16 max-w-7xl mx-auto">
          <div className="space-y-6">
            <div className="text-xl font-bold text-blue-900 dark:text-blue-100">{BRAND_NAME}</div>
            <p className="text-slate-500 dark:text-slate-400">{BRAND_FOOTER_DESC}</p>
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-slate-400 hover:text-primary cursor-pointer transition-colors">social_leaderboard</span>
              <span className="material-symbols-outlined text-slate-400 hover:text-primary cursor-pointer transition-colors">photo_camera</span>
              <span className="material-symbols-outlined text-slate-400 hover:text-primary cursor-pointer transition-colors">play_circle</span>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-6">Khám phá</h4>
            <ul className="space-y-4">
              <li><Link className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/">Điểm đến Phổ biến</Link></li>
              <li><Link className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/tours">Tour theo Chủ đề</Link></li>
              <li><Link className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/journal">Nhật ký Hành trình</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-6">Công ty</h4>
            <ul className="space-y-4">
              <li><Link className="text-blue-700 dark:text-blue-400 underline" to="/about">Về chúng tôi</Link></li>
              <li><Link className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/journal">Nhật ký</Link></li>
              <li><Link className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/careers">Nghề nghiệp</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-6">Newsletter</h4>
            <p className="text-slate-500 dark:text-slate-400 mb-4">Đăng ký để nhận những thông tin du lịch đặc quyền.</p>
            <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
              <input className="bg-white border-0 ring-1 ring-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="Email của bạn" type="email" />
              <button className="signature-gradient text-white px-4 py-2 rounded-lg font-bold">Đăng ký</button>
            </form>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-8 pb-12">
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between gap-4">
            <p className="text-slate-500 dark:text-slate-400">© 2026 {BRAND_NAME}. Vượt ra ngoài giới hạn.</p>
            <div className="flex gap-8">
              <Link className="text-slate-500 dark:text-slate-400 hover:text-blue-600" to="/privacy">Chính sách Bảo mật</Link>
              <Link className="text-slate-500 dark:text-slate-400 hover:text-blue-600" to="/terms">Điều khoản Dịch vụ</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
