import { Link } from 'react-router-dom';
import { BRAND_NAME, BRAND_LOGO, BRAND_FOOTER_DESC } from '../constants';

export default function ContactUs() {
  return (
    <div className="bg-surface font-sans text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col">
      {/* TopNavBar Component */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl docked full-width top-0 sticky z-50 shadow-[0_8px_32px_0_rgba(25,28,29,0.06)] border-b border-surface-container-low/30">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-3">
            <img src={BRAND_LOGO} alt="PTIT Logo" className="h-10 w-auto" />
            <div className="text-xl font-black tracking-tighter text-blue-900 dark:text-blue-50">
              {BRAND_NAME}
            </div>
          </Link>
          <nav className="hidden md:flex space-x-8 items-center font-medium tracking-tight">
            <Link className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/">Điểm đến</Link>
            <Link className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/tours">Tour</Link>
            <Link className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/deals">Ưu đãi</Link>
            <Link className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/journal">Nhật ký</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-slate-600 px-4 py-2 hover:bg-slate-100/50 rounded-lg transition-all text-sm font-semibold scale-95 active:scale-90">Đăng nhập</Link>
            <Link to="/login" className="signature-gradient text-white px-6 py-2 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all scale-95 active:scale-90">Đăng ký</Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-20 flex-grow w-full">
        {/* Editorial Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24 items-end">
          <div className="lg:col-span-7">
            <span className="text-secondary font-bold tracking-[0.2em] text-xs uppercase mb-4 block">Liên hệ với chúng tôi</span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-on-surface mb-8 leading-[0.9]">
              Lên kế hoạch cho <br />
              <span className="text-primary">kỳ nghỉ tuyệt vời.</span>
            </h1>
            <p className="text-xl text-on-surface-variant max-w-xl leading-relaxed">
              Bạn có câu hỏi về một địa điểm thú vị hay cần giúp đỡ thiết kế lịch trình? Các chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn.
            </p>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl relative">
              <img 
                className="w-full h-full object-cover" 
                alt="Stunning sunset over the Amalfi Coast with pastel buildings clinging to cliffs and deep blue Mediterranean water" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_eXVB-7JAheaeuUUa9aIt8VxyiVi8V0vGTx61YCekl1q7SKsb8sgrQ1DKetDFmMosD7ECbVMT6hkqXTi393v3UFqSh7NMpOU3rkLgGonQHHpD8DRoR1FbNkp2SJOq9lJfBumcoTOD24dLdqHku4p30OHlSh_QEkzH3aXu3aG96LtwybCmupQXX3a5NrVF6jd-CilJo0UnQhlpbgyOc1dndwL7MVkr4l2WQi51XcWeMWxbpDZVABXo20eRNv4WcwHslvYkSQsiSjQ" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
            </div>
            {/* Floating Decorative Element */}
            <div className="absolute -bottom-8 -left-8 bg-white/80 backdrop-blur-2xl p-6 rounded-2xl shadow-xl max-w-[200px] hidden md:block z-10">
              <span className="material-symbols-outlined text-secondary text-3xl mb-2">explore</span>
              <p className="text-sm font-bold text-blue-900 leading-tight">Global Expertise Across 7 Continents</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Contact Form Section */}
          <section className="bg-surface-container-lowest p-10 md:p-14 rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(25,28,29,0.06)]">
            <h2 className="text-3xl font-bold tracking-tight mb-10 text-on-surface">Gửi tin nhắn</h2>
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 text-left">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1">Họ và tên</label>
                  <input 
                    className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none text-on-surface placeholder:text-outline/50" 
                    placeholder="Nguyễn Văn A" 
                    type="text" 
                  />
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1">Địa chỉ Email</label>
                  <input 
                    className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none text-on-surface placeholder:text-outline/50" 
                    placeholder="example@horizon.com" 
                    type="email" 
                  />
                </div>
              </div>
              <div className="space-y-2 text-left">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1">Chủ đề</label>
                <select className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none text-on-surface appearance-none cursor-pointer">
                  <option>Tư vấn Tour thiết kế riêng</option>
                  <option>Hỗ trợ đặt chỗ</option>
                  <option>Đề xuất hợp tác</option>
                  <option>Góp ý chung</option>
                </select>
              </div>
              <div className="space-y-2 text-left">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1">Tin nhắn</label>
                <textarea 
                  className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none text-on-surface placeholder:text-outline/50 resize-none" 
                  placeholder="Hãy cho chúng tôi biết về điểm đến mơ ước của bạn..." 
                  rows={5}
                ></textarea>
              </div>
              <button 
                className="w-full signature-gradient text-white py-5 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all scale-100 active:scale-[0.98]" 
                type="submit"
              >
                Gửi yêu cầu Tư vấn
              </button>
            </form>
          </section>

          {/* Contact Info & Map Section */}
          <div className="space-y-16">
            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary-fixed flex items-center justify-center rounded-xl">
                  <span className="material-symbols-outlined text-on-primary-fixed-variant">location_on</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-on-surface mb-1">Trụ sở Chính</h3>
                  <p className="text-on-surface-variant leading-relaxed text-sm">
                    97 Man Thiện, Hiệp Phú, Thủ Đức<br />
                    Thành phố Hồ Chí Minh, Việt Nam
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-secondary-fixed flex items-center justify-center rounded-xl">
                  <span className="material-symbols-outlined text-on-secondary-fixed-variant">call</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-on-surface mb-1">Hỗ trợ Điện thoại</h3>
                  <p className="text-on-surface-variant leading-relaxed text-sm">
                    +1 (555) 012-3456<br />
                    T2-T6: 9am - 6pm PST
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-tertiary-fixed flex items-center justify-center rounded-xl">
                  <span className="material-symbols-outlined text-on-tertiary-fixed-variant">mail</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-on-surface mb-1">Email Liên hệ</h3>
                  <p className="text-on-surface-variant leading-relaxed text-sm">
                    hello@horizoncurator.com<br />
                    press@horizoncurator.com
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-surface-container-high flex items-center justify-center rounded-xl">
                  <span className="material-symbols-outlined text-on-surface-variant">share</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-on-surface mb-1">Mạng xã hội</h3>
                  <div className="flex space-x-4 mt-2">
                    <Link to="/" className="text-primary hover:text-secondary transition-colors text-xl leading-none">
                      <span className="material-symbols-outlined">public</span>
                    </Link>
                    <Link to="/" className="text-primary hover:text-secondary transition-colors text-xl leading-none">
                      <span className="material-symbols-outlined">camera</span>
                    </Link>
                    <Link to="/" className="text-primary hover:text-secondary transition-colors text-xl leading-none">
                      <span className="material-symbols-outlined">campaign</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Component */}
            <div className="rounded-[2.5rem] overflow-hidden shadow-lg border-8 border-surface-container-low h-[400px] relative">
              <div className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg text-xs font-bold shadow-sm">
                San Francisco, CA
              </div>
              <img 
                className="w-full h-full object-cover" 
                alt="Detailed map view of downtown San Francisco showing clean street layouts and blue ocean textures" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHN0q22SEBECpQFmiLTZ2QVfvMMXFHjQJXBB4JCc7ZNZffCfBQxuEkUOxJkcBqywM-ldSFfvbuDKhBBSDrckYdkNhIYbryJEmVCf4igjJ4vDiWCuZeBh2s-YiggLXUvbrY7UWJLGvNbIVn8fdtjcHb6MSTzVeLUKnCEaVVy9_B1TtRIV97gyUWJ_N7P2l8XbdcGRKv8gL5yMfdakE6j_3DC-sTgtPQ0wa2J4QAbuB8Bk4l5sHlxJ9J5pfn14_gU8UTb1pjE5EHOW0" 
              />
              {/* Overlay to simulate interactive map pin */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-12 h-12 bg-primary rounded-full border-4 border-white shadow-2xl flex items-center justify-center animate-pulse">
                  <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Component */}
      <footer className="bg-slate-50 dark:bg-slate-950 w-full mt-auto border-t border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-8 py-16 max-w-7xl mx-auto font-sans text-sm leading-relaxed text-left">
          <div className="md:col-span-1 space-y-4">
            <div className="text-xl font-bold text-blue-900 dark:text-blue-100">{BRAND_NAME}</div>
            <p className="text-slate-500 dark:text-slate-400">{BRAND_FOOTER_DESC}</p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-blue-900 dark:text-blue-100 uppercase tracking-widest text-xs">Điều hướng</h4>
            <ul className="space-y-2">
              <li><Link className="text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors" to="/about">Về chúng tôi</Link></li>
              <li><Link className="text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors" to="/tours">Tour</Link></li>
              <li><Link className="text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors" to="/journal">Nhật ký</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-blue-900 dark:text-blue-100 uppercase tracking-widest text-xs">Pháp lý</h4>
            <ul className="space-y-2">
              <li><Link className="text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors" to="/terms">Điều khoản Dịch vụ</Link></li>
              <li><Link className="text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors" to="/privacy">Chính sách Bảo mật</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-blue-900 dark:text-blue-100 uppercase tracking-widest text-xs">Bản tin</h4>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input className="bg-white border ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all rounded-l-lg w-full px-4 text-xs" placeholder="Email" type="email" />
              <button className="bg-blue-700 text-white px-4 py-2 rounded-r-lg hover:bg-blue-800 transition-all">
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </form>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-8 py-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-slate-500 dark:text-slate-400">© 2026 {BRAND_NAME}. Vượt ra ngoài giới hạn.</p>
          <div className="flex space-x-6">
            <Link className="text-slate-400 hover:text-blue-600 transition-colors" to="/"><span className="material-symbols-outlined">language</span></Link>
            <Link className="text-slate-400 hover:text-blue-600 transition-colors" to="/"><span className="material-symbols-outlined">podcasts</span></Link>
            <Link className="text-slate-400 hover:text-blue-600 transition-colors" to="/"><span className="material-symbols-outlined">distance</span></Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
