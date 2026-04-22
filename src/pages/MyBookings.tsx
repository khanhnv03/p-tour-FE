import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function MyBookings() {
  const [showRefundModal, setShowRefundModal] = useState(false);

  return (
    <div className="p-6 md:p-12 lg:p-16 space-y-12">
      {/* Page Header (Editorial Layering) */}
      <header className="relative">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-on-surface mb-2">Chuyến đi của tôi</h1>
        <p className="text-on-surface-variant text-lg max-w-2xl font-light">
          Theo dõi những chuyến thám hiểm sắp tới và sống lại những hành trình đã qua. Mỗi dấu ấn là một câu chuyện.
        </p>
      </header>

      {/* Booking List (Bento Grid / Table style without lines) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-blue-900">Hành trình đang hoạt động</h2>
          <div className="flex gap-2">
            <span className="px-4 py-1 rounded-full bg-surface-container-high text-xs font-bold text-on-surface-variant">Lọc theo ngày</span>
            <span className="px-4 py-1 rounded-full bg-surface-container-high text-xs font-bold text-on-surface-variant">Tất cả trạng thái</span>
          </div>
        </div>
        
        <div className="grid gap-4">
          {/* Booking Row 1 */}
          <div className="group bg-surface-container-lowest p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:shadow-[0_8px_32px_0_rgba(25,28,29,0.06)] hover:translate-y-[-2px]">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                <img alt="Bình minh trên đỉnh Langbiang" className="w-full h-full object-cover" src="https://picsum.photos/seed/tour1/400/300"/>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-primary px-2 py-0.5 bg-primary/5 rounded-md">#BK-1934</span>
                  <span className="px-3 py-1 rounded-full bg-surface-container-lowest border border-primary/10 text-[10px] font-black uppercase text-[#00458e]">Đã xác nhận</span>
                </div>
                <h3 className="text-xl font-bold text-on-surface tracking-tight">Bình minh trên đỉnh Langbiang</h3>
                <p className="text-on-surface-variant text-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">calendar_today</span>
                  12 Thg 11, 2026 · 2 người lớn · Lâm Đồng, VN
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/my-bookings/BK-1934" className="px-5 py-2 text-sm font-bold text-primary hover:bg-primary/5 rounded-xl transition-colors">Chi tiết</Link>
              <button className="px-5 py-2 bg-secondary text-white text-sm font-bold rounded-xl shadow-sm hover:shadow-md transition-all">Quản lý chuyến đi</button>
            </div>
          </div>

          {/* Booking Row 2 */}
          <div className="group bg-surface-container-low p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all opacity-80 hover:opacity-100">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 grayscale hover:grayscale-0 transition-all">
                <img alt="Swiss Alps" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8AKlsilHlO7x55IgFCKLS2yq364u2rxTxEz9YXGP8RJzTr9c7mAbng9G7QF0Z46Y6RUeEJA4LN4VOTWIxhaxK19bWguFbVVRaea_1OS-j3Akkh4XnwfZc6ARoD2PXLdLqteUo7hzahiJ5D93iFGRIHxwJeqlM7Y_fGs5WagkOVp4BkwXQ-vMq-TfxU-AHUPkhAaA2KOMFOv56yvlDeYgSizf6QB7yO_PY9AqF5rfY1j5Y1p-X4oqUQHQgjc2lIjhesvtVuw4dR5Q"/>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 px-2 py-0.5 bg-slate-200 rounded-md">#HZ-2024-102</span>
                  <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-[10px] font-black uppercase">Đã Hủy</span>
                </div>
                <h3 className="text-xl font-bold text-slate-600 tracking-tight">Khám phá dãy Alps Thụy Sĩ</h3>
                <p className="text-slate-500 text-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">calendar_today</span>
                  05 Th12 - 10 Th12, 2024
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowRefundModal(true)} className="px-5 py-2 text-sm font-bold text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Xem hoàn tiền</button>
            </div>
          </div>

          {/* Booking Row 3 */}
          <div className="group bg-surface-container-lowest p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:shadow-[0_8px_32px_0_rgba(25,28,29,0.06)] hover:translate-y-[-2px]">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                <img alt="Lake Bled" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuR1visxLaX-kpcyGe0yl-e56ns-4AC9qy7pKp7ky9fvsWAB7rWlSnfmDKB8xcmDfQGCjyRwo44nQoEwGJJJCsYWnOxRd6S_Jqr3xPXhgaOI8rpbZG577dapGyhX119dn_RzLKMZbBv3ll8_bZdzdov4DPgqwgJUO-lX4TDO9j9NDkacGFMqhTFIPEbx8bJwOajeF2omXV3G7rcqNGoRBuTeLmO5ZAGzhcdbSxsp1dKq0z6H5pzqCtZQdlJzWFOJMlp70INkxe9s0"/>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-primary px-2 py-0.5 bg-primary/5 rounded-md">#HZ-2024-942</span>
                  <span className="px-3 py-1 rounded-full bg-[#af4900] text-white text-[10px] font-black uppercase">Chờ</span>
                </div>
                <h3 className="text-xl font-bold text-on-surface tracking-tight">Ljubljana & Bled Retreat</h3>
                <p className="text-on-surface-variant text-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">calendar_today</span>
                  15 Jan - 22 Jan, 2025
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/my-bookings/HZ-2024-942" className="px-5 py-2 text-sm font-bold text-primary hover:bg-primary/5 rounded-xl transition-colors">Chi tiết</Link>
              <Link to="/checkout" className="px-5 py-2 bg-slate-100 text-slate-800 text-sm font-bold rounded-xl shadow-sm hover:bg-slate-200 transition-colors">Hoàn tất thanh toán</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Form (Editorial Layout) */}
      <section className="mt-20 pt-16 border-t-2 border-surface-container-high">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="w-full lg:w-1/3">
            <h2 className="text-3xl font-black tracking-tight text-blue-900 mb-4">Hồ sơ cá nhân</h2>
            <p className="text-on-surface-variant mb-8 font-light">Cập nhật thông tin chi tiết của bạn để có trải nghiệm đặt chỗ mượt mà hơn. Hồ sơ của bạn sẽ giúp các đối tác của chúng tôi điều chỉnh kỳ nghỉ theo ý muốn của bạn.</p>
            
            <div className="relative group w-48 h-48 mx-auto lg:mx-0">
              <div className="absolute inset-0 signature-gradient rounded-3xl rotate-6 transition-transform group-hover:rotate-3"></div>
              <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-3xl"></div>
              <img alt="Alex PTIT" className="absolute inset-0 w-full h-full object-cover rounded-3xl p-1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6WXwV5SvN1TA30vr26q_cjY3-8CO-uhctsY3B78x1KTHVYoBM_fuZMpauD_EKJe9tUbqrBy0LYj1Ii5ybsQKhED-WKhv1H19x_c9UweQNO5yiT9yJR_KCSWqKqfDa2wxCbFgZf8NaNfYwM4q1rpK3u7tYIehjmEsEoVTYY0a0UXCCTgEPEMgV1oDbjuhroUpnPCZGhMg7fGYStNxAy-M3axPRlml5kBx9xhYrsZHgiA9j-Nby-c3L_38GorCDyH785XVQdGV0UZQ"/>
              <button className="absolute -bottom-2 -right-2 bg-white text-primary p-3 rounded-2xl shadow-xl hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">photo_camera</span>
              </button>
            </div>
          </div>
          
          <div className="w-full lg:w-2/3 bg-surface-container-low p-8 md:p-12 rounded-[2rem]">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant px-1">Họ và Tên</label>
                <input className="w-full bg-surface-container-lowest border-none rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary shadow-sm outline-none" type="text" defaultValue="Alex PTIT"/>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant px-1">Địa chỉ Email</label>
                <input className="w-full bg-surface-container-lowest border-none rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary shadow-sm outline-none" type="email" defaultValue="alex@ptittour.com"/>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant px-1">Số điện thoại</label>
                <input className="w-full bg-surface-container-lowest border-none rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary shadow-sm outline-none" type="tel" defaultValue="+1 (555) 012-3456"/>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant px-1">Địa chỉ thường trú</label>
                <input className="w-full bg-surface-container-lowest border-none rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary shadow-sm outline-none" type="text" defaultValue="San Francisco, USA"/>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant px-1">Sở thích du lịch</label>
                <textarea className="w-full bg-surface-container-lowest border-none rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary shadow-sm outline-none" rows={3} defaultValue="Ưu tiên khách sạn boutique thay vì resort lớn. Quan tâm đến các tour ẩm thực và leo núi buổi sáng. Phòng không hút thuốc."></textarea>
              </div>
              
              <div className="md:col-span-2 flex justify-end gap-4 pt-4">
                <button className="px-8 py-3 text-on-surface font-bold hover:bg-surface-container-high rounded-xl transition-colors" type="button">Hủy bỏ</button>
                <button className="px-10 py-3 signature-gradient text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all" type="submit">Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Refund Status Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowRefundModal(false)}></div>
          <div className="bg-surface-container-lowest p-8 w-full max-w-md rounded-[2rem] shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowRefundModal(false)}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center bg-surface-container-high hover:bg-surface-container-highest rounded-full text-on-surface-variant transition-colors"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-red-600">assignment_return</span>
              </div>
              <div>
                <h3 className="text-xl font-black text-on-surface">Trạng thái hoàn tiền</h3>
                <p className="text-xs text-on-surface-variant">Mã đặt chỗ: #HZ-2024-102</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-4 p-4 bg-surface-container-low rounded-xl">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-green-600 text-sm">check</span>
                </div>
                <div>
                  <p className="font-bold text-on-surface text-sm">Yêu cầu hủy đã được chấp nhận</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">03 Thg 12, 2024</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-surface-container-low rounded-xl">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-green-600 text-sm">check</span>
                </div>
                <div>
                  <p className="font-bold text-on-surface text-sm">Đã xác nhận số tiền hoàn</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">Hoàn 80% · 06 Thg 12, 2024</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-amber-600 text-sm">schedule</span>
                </div>
                <div>
                  <p className="font-bold text-on-surface text-sm">Đang xử lý qua ngân hàng</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">Dự kiến 5–7 ngày làm việc</p>
                </div>
              </div>
            </div>

            <div className="border-t border-surface-container-high pt-4 flex justify-between items-center">
              <span className="text-sm text-on-surface-variant font-medium">Số tiền hoàn trả</span>
              <span className="text-xl font-black text-green-600">đang xử lý</span>
            </div>

            <button
              onClick={() => setShowRefundModal(false)}
              className="mt-6 w-full py-3 bg-surface-container-low hover:bg-surface-container font-bold rounded-xl text-sm transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
