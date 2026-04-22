import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BRAND_NAME, BRAND_LOGO } from '../constants';

export default function Checkout() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const STEPS = ['Thông tin', 'Xem lại', 'Thanh toán', 'Xác nhận'];

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary/20 min-h-screen flex flex-col">
      {/* TopNavBar */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl docked full-width top-0 sticky z-50 shadow-[0_8px_32px_0_rgba(25,28,29,0.06)]">
        <nav className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-3">
            <img src={BRAND_LOGO} alt="PTIT Logo" className="h-10 w-auto" />
            <div className="text-xl font-black tracking-tighter text-blue-900 dark:text-blue-50">
              {BRAND_NAME}
            </div>
          </Link>
          <div className="hidden md:flex items-center space-x-8 font-medium tracking-tight">
            <Link to="/" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors">Điểm đến</Link>
            <Link to="/tours" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors">Tour</Link>
            <Link to="/deals" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors">Ưu đãi</Link>
            <Link to="/journal" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors">Nhật ký</Link>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-5 py-2 text-slate-600 hover:bg-slate-100/50 rounded-lg transition-all">Đăng nhập</button>
            <button className="px-6 py-2.5 primary-gradient text-white font-bold rounded-xl scale-95 active:scale-90 transition-transform">Đăng ký</button>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12 flex-grow w-full">
        {/* Stepper */}
        <div className="mb-16">
          <div className="flex justify-between max-w-2xl mx-auto relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-0 w-full h-[2px] bg-surface-container-high -z-10">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
              ></div>
            </div>
            {STEPS.map((label, idx) => {
              const step = idx + 1;
              const isCompleted = step < currentStep;
              const isActive = step === currentStep;
              return (
                <div key={step} className="flex flex-col items-center gap-3">
                  <button
                    onClick={() => setCurrentStep(step)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      isCompleted
                        ? 'bg-primary text-white'
                        : isActive
                        ? 'ring-4 ring-primary-fixed bg-primary text-white shadow-lg'
                        : 'bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    {isCompleted ? <span className="material-symbols-outlined text-sm">check</span> : step}
                  </button>
                  <span className={`text-xs font-bold tracking-wider uppercase ${isActive ? 'text-on-surface' : isCompleted ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step content indicator */}
        {currentStep === 1 && (
          <div className="lg:col-span-12 mb-8">
            <div className="max-w-2xl mx-auto bg-primary/5 border border-primary/10 rounded-2xl p-5 flex items-start gap-4">
              <span className="material-symbols-outlined text-primary mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
              <div>
                <p className="font-bold text-on-surface">Bước 1: Thông tin khách hàng</p>
                <p className="text-sm text-on-surface-variant mt-0.5">Nhập thông tin liên lạc và yêu cầu đặc biệt cho chuyến đi.</p>
              </div>
              <button onClick={() => setCurrentStep(2)} className="ml-auto text-primary font-bold text-sm hover:underline whitespace-nowrap">Tiếp tục →</button>
            </div>
          </div>
        )}
        {currentStep === 2 && (
          <div className="lg:col-span-12 mb-8">
            <div className="max-w-2xl mx-auto bg-secondary/5 border border-secondary/10 rounded-2xl p-5 flex items-start gap-4">
              <span className="material-symbols-outlined text-secondary mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>checklist</span>
              <div>
                <p className="font-bold text-on-surface">Bước 2: Xem lại đặt chỗ</p>
                <p className="text-sm text-on-surface-variant mt-0.5">Kiểm tra lại thông tin tour, ngày khởi hành và số khách trước khi thanh toán.</p>
              </div>
              <button onClick={() => setCurrentStep(3)} className="ml-auto text-secondary font-bold text-sm hover:underline whitespace-nowrap">Tiếp tục →</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Checkout Forms */}
          <div className="lg:col-span-8 space-y-12">
            {/* Payment Method Section */}
            <section className="space-y-8">
              <div className="space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tighter text-on-surface">Phương thức Thanh toán</h1>
                <p className="text-lg text-on-surface-variant">An tâm đặt chỗ với hệ thống thanh toán bảo mật đa lớp của chúng tôi.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="relative flex items-center p-6 bg-surface-container-lowest rounded-xl cursor-pointer ring-2 ring-primary transition-all">
                  <input defaultChecked className="sr-only" name="payment_method" type="radio" />
                  <span className="material-symbols-outlined text-primary mr-4" style={{ fontVariationSettings: "'FILL' 1" }}>credit_card</span>
                  <div className="flex-1">
                    <p className="font-bold text-on-surface">Thẻ tín dụng / Ghi nợ</p>
                    <p className="text-sm text-on-surface-variant">Visa, Mastercard, Amex</p>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                  </div>
                </label>

                <label className="relative flex items-center p-6 bg-surface-container-low rounded-xl cursor-pointer hover:bg-surface-container-high transition-all">
                  <input className="sr-only" name="payment_method" type="radio" />
                  <span className="material-symbols-outlined text-on-surface-variant mr-4">account_balance</span>
                  <div className="flex-1">
                    <p className="font-bold text-on-surface">Chuyển khoản Ngân hàng</p>
                    <p className="text-sm text-on-surface-variant">Vietcombank, Techcombank...</p>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 border-outline-variant"></div>
                </label>
              </div>

              {/* Credit Card Form */}
              <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-[0_8px_32px_0_rgba(25,28,29,0.06)] border border-outline-variant/10">
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest uppercase text-on-surface-variant ml-1">Tên trên thẻ</label>
                    <input 
                      className="w-full px-5 py-4 bg-surface-container-high rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline/50 font-medium outline-none" 
                      placeholder="NGUYEN VAN A" 
                      type="text" 
                    />
                  </div>
                  <div className="space-y-2 relative">
                    <label className="text-xs font-bold tracking-widest uppercase text-on-surface-variant ml-1">Số thẻ</label>
                    <div className="relative">
                      <input 
                        className="w-full px-5 py-4 bg-surface-container-high rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline/50 font-medium outline-none" 
                        placeholder="0000 0000 0000 0000" 
                        type="text" 
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                        <img alt="Visa" className="h-4 opacity-70" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtW3LDY_SmBFas0TwjqgXmcKIr36SPogGwKFtkyfosf_K-toWM_P6FSaOX0wmVp9iQiCIk4vyCFTtjbnTR-qZx318ZX69jBx7OR2F5IbLNKUO-4he11C8GU4X5lc5g9vyAyyIdDDyCCiujmQJGtIM9B-fnopdL-WODKPO7xRYrE5H65D5M8DO75Tk5DS-Q6dYMxvInBwny39Mrh2epKNcJVafeb-Yk4gdPVziJKTHOKYUayDVhdJAuxn60bOrlrsZ7xInifcOHxYI" />
                        <img alt="Mastercard" className="h-4 opacity-70" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6ypnRmemBnzFzpeYmjn-qeEgmH85ENs0CtSO9xcZNlZBzCKydtvmzqLm_sRvVDfnXwRZeU3LQ7ye1BK1rw6FxaGQDoiyHDpQHZhLcWjcOVeqfl56b9eKWHG2c5tENyiLqEh2UUpLcw0V4K1u9Avc97BtH9m0OOh-nl7PqctoJ3wl0GtZMsUl8iXL0VoZxCGSGZ7l0xmF_JRldAY_UhMx7IruxlF8QMP91SR8xzwYr3byFw8rMx4JdRmzPtff4QPGnI25oulK6qlI" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold tracking-widest uppercase text-on-surface-variant ml-1">Ngày hết hạn</label>
                      <input 
                        className="w-full px-5 py-4 bg-surface-container-high rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline/50 font-medium outline-none" 
                        placeholder="MM / YY" 
                        type="text" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold tracking-widest uppercase text-on-surface-variant ml-1">CVV / CVC</label>
                      <input 
                        className="w-full px-5 py-4 bg-surface-container-high rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline/50 font-medium outline-none" 
                        placeholder="•••" 
                        type="password" 
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-xl">
                    <span className="material-symbols-outlined text-primary text-xl">verified_user</span>
                    <p className="text-sm text-on-surface-variant leading-tight">Dữ liệu của bạn được mã hóa hoàn toàn và bảo mật theo tiêu chuẩn PCI-DSS toàn cầu.</p>
                  </div>
                </form>
              </div>
            </section>

            <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-outline-variant/10 gap-4">
              <button className="flex items-center gap-2 text-on-surface font-bold hover:text-primary transition-colors group">
                <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
                Quay lại Xem lại thông tin
              </button>
              <button 
                onClick={() => navigate('/success')}
                className="primary-gradient text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all w-full sm:w-auto"
              >
                Xác nhận Thanh toán 27,930,000₫
              </button>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <aside className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-[0_8px_32px_0_rgba(25,28,29,0.06)] overflow-hidden relative border border-outline-variant/5">
              {/* Subtle decorative gradient element */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
              
              <h2 className="text-xl font-extrabold tracking-tight mb-6 text-on-surface relative z-10">Tóm tắt Chuyến đi</h2>
              
              {/* Tour Brief — consistent with BookingDetails (#BK-1934) */}
              <div className="flex gap-4 mb-8 relative z-10">
                <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                  <img
                    className="w-full h-full object-cover"
                    alt="Bình minh trên đỉnh Langbiang"
                    src="https://picsum.photos/seed/tour1/400/300"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-secondary mb-1">Thám hiểm 5 ngày</span>
                  <h3 className="font-bold text-on-surface leading-snug">Bình minh trên đỉnh Langbiang</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-[14px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="text-xs font-bold text-on-surface">4.9</span>
                    <span className="text-xs text-on-surface-variant">(128 đánh giá)</span>
                  </div>
                </div>
              </div>

              {/* Details List */}
              <div className="space-y-4 mb-8 pb-8 border-b border-outline-variant/10 relative z-10">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3 text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary opacity-70">calendar_today</span>
                    <span>Ngày khởi hành</span>
                  </div>
                  <span className="font-bold text-on-surface">12 Thg 11, 2026</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3 text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary opacity-70">group</span>
                    <span>Khách</span>
                  </div>
                  <span className="font-bold text-on-surface">02 Người lớn</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3 text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary opacity-70">location_on</span>
                    <span>Điểm đến</span>
                  </div>
                  <span className="font-bold text-on-surface">Lâm Đồng, VN</span>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-3 relative z-10">
                <div className="flex justify-between text-on-surface-variant">
                  <span className="text-sm">Giá tour (x2 khách)</span>
                  <span className="font-medium">26,600,000₫</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span className="text-sm">Thuế &amp; Phí (5%)</span>
                  <span className="font-medium">1,330,000₫</span>
                </div>
                <div className="flex justify-between items-center pt-4 mt-4 border-t border-outline-variant/20">
                  <span className="text-lg font-bold text-on-surface">Tổng cộng</span>
                  <span className="text-2xl font-black text-primary tracking-tighter">27,930,000₫</span>
                </div>
              </div>
            </div>

            {/* Promo Code */}
            <div className="bg-surface-container-low p-6 rounded-2xl flex items-center gap-4">
              <span className="material-symbols-outlined text-secondary">confirmation_number</span>
              <input 
                className="bg-transparent border-none focus:ring-0 p-0 text-sm font-bold placeholder:text-outline flex-1 outline-none" 
                placeholder="Mã giảm giá" 
                type="text" 
              />
              <button className="text-primary font-bold text-sm uppercase tracking-wider px-2 py-1 hover:bg-primary/5 rounded transition-colors">Áp dụng</button>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-950 w-full mt-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-8 py-16 max-w-7xl mx-auto font-body text-sm leading-relaxed">
          <div className="md:col-span-1 space-y-4">
            <div className="text-xl font-bold text-blue-900 dark:text-blue-100">{BRAND_NAME}</div>
            <p className="text-slate-500 dark:text-slate-400">© 2026 {BRAND_NAME}. Vượt ra ngoài giới hạn.</p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-blue-900 dark:text-blue-100">Khám phá</h4>
            <ul className="space-y-2 text-slate-500 dark:text-slate-400">
              <li><Link className="hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/">Điểm đến</Link></li>
              <li><Link className="hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/tours">Tour &amp; Trải nghiệm</Link></li>
              <li><Link className="hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/deals">Ưu đãi Đặc biệt</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-blue-900 dark:text-blue-100">Công ty</h4>
            <ul className="space-y-2 text-slate-500 dark:text-slate-400">
              <li><Link className="hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/about">Về chúng tôi</Link></li>
              <li><a className="hover:text-blue-600 dark:hover:text-blue-300 transition-colors" href="#!">Điều khoản Dịch vụ</a></li>
              <li><a className="hover:text-blue-600 dark:hover:text-blue-300 transition-colors" href="#!">Chính sách Bảo mật</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-blue-900 dark:text-blue-100">Liên hệ</h4>
            <ul className="space-y-2 text-slate-500 dark:text-slate-400">
              <li>concierge@thehorizon.com</li>
              <li>+84 1900 8888</li>
              <li>Quận 1, Thành phố Hồ Chí Minh</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
