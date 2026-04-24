import { Link } from 'react-router-dom';

export default function OrderDetails() {
  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      {/* Page header */}
      <div className="px-6 lg:px-8 py-5 border-b border-black/5 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors mb-2"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Đơn hàng
          </Link>
          <h1 className="text-xl font-black text-on-surface leading-tight">Đơn hàng #BK-1934</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Ngày đặt: 12 Thg 11, 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-5 py-2.5 font-bold text-sm text-slate-500 hover:bg-slate-100 rounded-xl transition-colors border border-black/10">
            Hủy đặt chỗ
          </button>
          <button className="signature-gradient text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-xl transition-all active:scale-95 flex items-center gap-1.5">
            Cập nhật trạng thái
            <span className="material-symbols-outlined text-sm">expand_more</span>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-6 lg:p-8 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">

          {/* Tour info */}
          <section className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-6">
            <div className="flex justify-between items-start mb-5">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">explore</span>
                Thông tin Tour
              </h3>
              <span className="bg-primary/5 border border-primary/20 text-primary px-3 py-1 rounded-full text-xs font-black uppercase tracking-tight">
                Đã xác nhận
              </span>
            </div>
            <div className="flex flex-col md:flex-row gap-5">
              <div className="w-full md:w-44 h-28 rounded-xl overflow-hidden flex-shrink-0">
                <img className="w-full h-full object-cover" alt="Langbiang" src="https://picsum.photos/seed/tour1/400/300" />
              </div>
              <div className="flex-1 space-y-2">
                <h4 className="text-lg font-bold text-on-surface">Bình minh trên đỉnh Langbiang</h4>
                <p className="text-slate-400 text-sm leading-relaxed max-w-md">5 ngày 4 đêm chinh phục đỉnh Langbiang huyền thoại, lưu trú Swiss-Belresort Tuyen Lam và trải nghiệm ẩm thực vùng cao.</p>
                <div className="flex flex-wrap gap-4 pt-1">
                  {[
                    { icon: 'calendar_today', text: '12 Thg 11, 2026' },
                    { icon: 'group',          text: '2 Người lớn' },
                    { icon: 'location_on',    text: 'Lâm Đồng, VN' },
                  ].map(item => (
                    <div key={item.icon} className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-slate-400">{item.icon}</span>
                      <span className="text-sm font-semibold text-on-surface">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer info */}
            <section className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-6">
              <h3 className="text-base font-bold text-on-surface mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">person</span>
                Thông tin khách hàng
              </h3>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-base">AP</div>
                <div>
                  <p className="font-bold text-on-surface">Alex PTIT</p>
                  <p className="text-xs text-slate-400">Gia nhập từ năm 2024</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Email',        value: 'alex@ptittour.com' },
                  { label: 'Điện thoại',   value: '+84 912 345 678' },
                  { label: 'Địa chỉ',      value: 'Hà Nội, Việt Nam' },
                ].map(item => (
                  <div key={item.label} className="flex justify-between border-b border-black/5 pb-2">
                    <span className="text-sm text-slate-400">{item.label}</span>
                    <span className="text-sm font-semibold text-on-surface">{item.value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Payment */}
            <section className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-6">
              <h3 className="text-base font-bold text-on-surface mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">payments</span>
                Trạng thái thanh toán
              </h3>
              <div className="bg-slate-50 p-4 rounded-xl mb-5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Tổng tiền</p>
                <p className="text-3xl font-black text-on-surface">27.930.000₫</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Trạng thái</span>
                  <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Đã thanh toán
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Phương thức</span>
                  <span className="text-sm font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">credit_card</span> Visa •••• 4412
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Mã giao dịch</span>
                  <span className="text-sm font-mono text-slate-400">TXN-90210-XC</span>
                </div>
              </div>
            </section>
          </div>

          {/* Activity log */}
          <section className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-6">
            <h3 className="text-base font-bold text-on-surface mb-7 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">history</span>
              Nhật ký hoạt động
            </h3>
            <div className="relative space-y-6 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
              {[
                { icon: 'done', primary: true, title: 'Thanh toán đã xác thực', time: '24 thg 10, 2024 · 14:22', desc: 'Xác thực tự động qua Stripe Gateway thành công.' },
                { icon: '',     primary: false, title: 'Đã nhận đơn đặt chỗ',   time: '24 thg 10, 2024 · 14:15', desc: "Khách hàng hoàn tất thanh toán cho 'Bình minh trên đỉnh Langbiang'." },
                { icon: '',     primary: false, title: 'Đã khởi tạo giỏ hàng',  time: '24 thg 10, 2024 · 13:58', desc: 'Bản nháp đơn hàng được tạo từ trang khám phá điểm đến.' },
              ].map((event, i) => (
                <div key={i} className="relative pl-9">
                  <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center z-10 ${event.primary ? 'bg-primary' : 'bg-slate-100'}`}>
                    {event.primary
                      ? <span className="material-symbols-outlined text-xs text-white" style={{ fontVariationSettings: "'wght' 700" }}>done</span>
                      : <span className="w-2 h-2 rounded-full bg-slate-400" />
                    }
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-1">
                    <h4 className="font-bold text-on-surface text-sm">{event.title}</h4>
                    <span className="text-xs text-slate-400 font-medium">{event.time}</span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">{event.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="col-span-12 lg:col-span-4 space-y-6">
          {/* Internal notes */}
          <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-5">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Ghi chú nội bộ</h3>
            <div className="space-y-3">
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-sm text-on-surface font-medium mb-2 leading-relaxed italic">"Khách hàng yêu cầu tầng cao hoặc bungalow cách xa bến tàu chính."</p>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-primary uppercase">Mark T. (Concierge)</span>
                  <span className="text-[10px] text-slate-400">2 ngày trước</span>
                </div>
              </div>
              <textarea className="w-full bg-slate-50 outline-none border-0 focus:ring-2 focus:ring-primary/20 rounded-xl p-4 text-sm placeholder:text-slate-400 resize-none h-28" placeholder="Thêm ghi chú nội bộ..." />
              <button className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-500 border border-black/5 font-bold text-xs rounded-xl transition-all uppercase tracking-widest">
                Lưu ghi chú
              </button>
            </div>
          </div>

          {/* Support */}
          <div className="primary-gradient rounded-2xl p-6 text-white relative overflow-hidden group">
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[80px] text-white/10 group-hover:scale-110 transition-transform duration-700 select-none">support_agent</span>
            <div className="relative z-10">
              <h3 className="text-base font-bold mb-1.5">Hỗ trợ khách hàng</h3>
              <p className="text-white/70 text-sm mb-5 leading-relaxed">Liên hệ người quản lý điểm đến để sắp xếp dịch vụ bổ sung.</p>
              <button className="inline-flex items-center gap-2 font-bold text-sm bg-white text-primary px-5 py-2.5 rounded-xl transition-transform active:scale-95">
                <span className="material-symbols-outlined text-lg">chat_bubble</span>
                Mở kênh chat
              </button>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-5">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Thao tác nhanh</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: 'receipt',      label: 'Gửi lại hóa đơn',  danger: false },
                { icon: 'mail',         label: 'Nhắn tin cho khách', danger: false },
                { icon: 'event_repeat', label: 'Thay đổi ngày',     danger: false },
                { icon: 'block',        label: 'Báo cáo tranh chấp', danger: true  },
              ].map(action => (
                <button
                  key={action.label}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all group ${action.danger ? 'hover:bg-red-50' : 'hover:bg-slate-50'}`}
                >
                  <span className={`material-symbols-outlined text-xl text-slate-300 ${action.danger ? 'group-hover:text-red-400' : 'group-hover:text-primary'} transition-colors`}>{action.icon}</span>
                  <span className="text-[10px] font-bold text-slate-500 text-center leading-tight">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
