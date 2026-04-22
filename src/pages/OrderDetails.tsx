import { Link } from 'react-router-dom';

export default function OrderDetails() {
  return (
    <div className="pb-20 font-sans text-on-surface">
      {/* Page Specific Header */}
      <div className="px-8 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/50 dark:bg-slate-900/50 border-b border-surface-container-low/50">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="p-2 hover:bg-surface-container-low rounded-full transition-all active:scale-90">
            <span className="material-symbols-outlined text-on-surface">arrow_back</span>
          </Link>
          <div className="flex flex-col">
            <h2 className="text-2xl font-black tracking-tighter text-blue-900 dark:text-blue-50">Đơn hàng #BK-1934</h2>
            <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">Ngày đặt: 12 Thg 11, 2026</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-surface-container-low text-on-surface px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-surface-container-high transition-all active:scale-95">
            Hủy đặt chỗ
          </button>
          <button className="signature-gradient text-on-primary px-8 py-2.5 rounded-xl font-bold text-sm shadow-[0_8px_20px_-4px_rgba(0,78,159,0.4)] transition-all active:scale-90 flex items-center gap-2 border-0">
            Cập nhật trạng thái <span className="material-symbols-outlined text-sm">expand_more</span>
          </button>
        </div>
      </div>

      <div className="px-8 mt-8 grid grid-cols-12 gap-8 max-w-7xl mx-auto w-full">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          
          {/* Tour Information */}
          <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-[0_8px_32px_0_rgba(25,28,29,0.04)]">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">explore</span>
                Thông tin Tour
              </h3>
              <span className="bg-surface-container-lowest border-2 border-primary-fixed-dim text-on-primary-fixed-variant px-3 py-1 rounded-full text-xs font-black uppercase tracking-tighter">
                Đã xác nhận
              </span>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                <img
                    className="w-full h-full object-cover"
                    alt="Bình minh trên đỉnh Langbiang"
                    src="https://picsum.photos/seed/tour1/400/300"
                />
              </div>
              <div className="flex-1 space-y-2">
                <h4 className="text-xl font-bold text-blue-900">Bình minh trên đỉnh Langbiang</h4>
                <p className="text-on-surface-variant text-sm leading-relaxed max-w-md">5 ngày 4 đêm chinh phục đỉnh Langbiang huyền thoại, lưu trú Swiss-Belresort Tuyen Lam và trải nghiệm ẩm thực vùng cao.</p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-slate-400">calendar_today</span>
                    <span className="text-sm font-semibold">12 Thg 11, 2026</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-slate-400">group</span>
                    <span className="text-sm font-semibold">2 Người lớn</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-slate-400">location_on</span>
                    <span className="text-sm font-semibold">Lâm Đồng, VN</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Customer Details */}
            <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-[0_8px_32px_0_rgba(25,28,29,0.04)]">
              <h3 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">person</span>
                Thông tin khách hàng
              </h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                  AP
                </div>
                <div>
                  <p className="font-bold text-on-surface">Alex PTIT</p>
                  <p className="text-xs text-on-surface-variant">Gia nhập từ năm 2024</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-surface-container pb-2">
                  <span className="text-sm text-on-surface-variant">Email</span>
                  <span className="text-sm font-semibold">alex@ptittour.com</span>
                </div>
                <div className="flex justify-between border-b border-surface-container pb-2">
                  <span className="text-sm text-on-surface-variant">Số điện thoại</span>
                  <span className="text-sm font-semibold">+84 912 345 678</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-on-surface-variant">Địa chỉ</span>
                  <span className="text-sm font-semibold">Hà Nội, Việt Nam</span>
                </div>
              </div>
            </section>

            {/* Payment Status */}
            <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-[0_8px_32px_0_rgba(25,28,29,0.04)]">
              <h3 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">payments</span>
                Trạng thái thanh toán
              </h3>
              <div className="mb-6 p-4 rounded-xl bg-surface-container-low">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Tổng tiền</p>
                <p className="text-3xl font-black text-blue-900">27.930.000₫</p>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-on-surface-variant">Trạng thái</span>
                  <span className="flex items-center gap-1.5 text-sm font-bold text-green-600">
                    <span className="w-2 h-2 rounded-full bg-green-600"></span> Đã thanh toán
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-on-surface-variant">Phương thức</span>
                  <span className="text-sm font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">credit_card</span> Visa •••• 4412
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-on-surface-variant">Mã giao dịch</span>
                  <span className="text-sm font-mono font-medium text-slate-500">TXN-90210-XC</span>
                </div>
              </div>
            </section>
          </div>

          {/* Order Activity Log */}
          <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-[0_8px_32px_0_rgba(25,28,29,0.04)]">
            <h3 className="text-lg font-bold text-on-surface mb-8 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">history</span>
              Nhật ký hoạt động đơn hàng
            </h3>
            <div className="relative space-y-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-surface-container">
              
              <div className="relative pl-10">
                <div className="absolute left-0 top-1 w-[24px] h-[24px] rounded-full bg-primary flex items-center justify-center z-10">
                  <span className="material-symbols-outlined text-xs text-white" style={{ fontVariationSettings: "'wght' 700" }}>done</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-1">
                  <h4 className="font-bold text-on-surface">Thanh toán đã xác thực</h4>
                  <span className="text-xs font-medium text-on-surface-variant">24 thg 10, 2024 • 14:22 PM</span>
                </div>
                <p className="text-sm text-on-surface-variant mt-1">Xác thực tự động qua Stripe Gateway thành công.</p>
              </div>

              <div className="relative pl-10">
                <div className="absolute left-0 top-1 w-[24px] h-[24px] rounded-full bg-surface-container-high flex items-center justify-center z-10">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-1">
                  <h4 className="font-bold text-on-surface">Đã nhận đơn đặt chỗ</h4>
                  <span className="text-xs font-medium text-on-surface-variant">24 thg 10, 2024 • 14:15 PM</span>
                </div>
                <p className="text-sm text-on-surface-variant mt-1">Khách hàng hoàn tất thanh toán cho 'Bình minh trên đỉnh Langbiang'.</p>
              </div>

              <div className="relative pl-10">
                <div className="absolute left-0 top-1 w-[24px] h-[24px] rounded-full bg-surface-container-high flex items-center justify-center z-10">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-1">
                  <h4 className="font-bold text-on-surface">Đã khởi tạo giỏ hàng</h4>
                  <span className="text-xs font-medium text-on-surface-variant">24 thg 10, 2024 • 13:58 PM</span>
                </div>
                <p className="text-sm text-on-surface-variant mt-1">Bản nháp đơn hàng được tạo từ trang khám phá điểm đến.</p>
              </div>
            </div>
          </section>

        </div>

        <aside className="col-span-12 lg:col-span-4 space-y-8">
          {/* Internal Notes */}
          <div className="bg-surface-container-low rounded-2xl p-6 border border-white/40">
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6">Ghi chú nội bộ</h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <p className="text-sm text-on-surface font-medium mb-2 leading-relaxed italic">"Khách hàng yêu cầu tầng cao hoặc bungalow cách xa bến tàu chính để có thêm sự riêng tư."</p>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-primary uppercase">Mark T. (Concierge)</span>
                  <span className="text-[10px] text-slate-400 font-medium">2 ngày trước</span>
                </div>
              </div>
              <textarea 
                  className="w-full bg-white outline-none border-0 focus:ring-2 focus:ring-primary/20 rounded-xl p-4 text-sm placeholder:text-slate-400 resize-none h-32" 
                  placeholder="Thêm ghi chú nội bộ...">
              </textarea>
              <button className="w-full py-3 bg-white text-on-surface border border-surface-container font-bold text-xs rounded-xl hover:bg-slate-50 transition-all uppercase tracking-widest">
                Lưu ghi chú
              </button>
            </div>
          </div>

          {/* Concierge Support Module */}
          <div className="bg-blue-900 rounded-2xl p-8 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Hỗ trợ khách hàng</h3>
              <p className="text-blue-100/80 text-sm mb-6">Liên hệ với người quản lý điểm đến để sắp xếp các dịch vụ bổ sung hoặc giải đáp thắc mắc.</p>
              <button className="flex items-center justify-center w-max gap-2 font-bold text-sm bg-white text-blue-900 px-6 py-3 rounded-xl transition-transform active:scale-95 border-0">
                <span className="material-symbols-outlined text-lg">chat_bubble</span>
                Mở kênh chat
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <span className="material-symbols-outlined text-[120px]">support_agent</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container-low">
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">Thao tác nhanh</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center justify-center p-4 rounded-xl hover:bg-surface-container-low transition-all gap-2 group flex-1">
                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">receipt</span>
                <span className="text-[11px] font-bold">Gửi lại hóa đơn</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-xl hover:bg-surface-container-low transition-all gap-2 group flex-1">
                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">mail</span>
                <span className="text-[11px] font-bold">Nhắn tin cho khách</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-xl hover:bg-surface-container-low transition-all gap-2 group flex-1">
                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">event_repeat</span>
                <span className="text-[11px] font-bold">Thay đổi ngày</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-xl hover:bg-surface-container-low transition-all gap-2 group flex-1 border-0 outline-none">
                <span className="material-symbols-outlined text-slate-400 group-hover:text-error">block</span>
                <span className="text-[11px] font-bold">Báo cáo tranh chấp</span>
              </button>
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}
