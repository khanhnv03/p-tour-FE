import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function BookingDetails() {
  const { id } = useParams();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <Link to="/my-bookings" className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors mb-4">
            <span className="material-symbols-outlined">arrow_back</span>
            Danh sách chuyến đi
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-on-surface">Chi tiết Đặt chỗ</h1>
          <p className="text-on-surface-variant font-medium mt-2">Mã tham chiếu: <span className="font-mono text-primary bg-primary/10 px-2 py-0.5 rounded ml-1">#{id || 'BK-1934'}</span></p>
        </div>
        <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-xl font-bold text-sm shadow-sm w-fit">
          <span className="material-symbols-outlined text-sm mr-2">check_circle</span>
          Đã thanh toán (Hoàn tất)
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Tour Overview Card */}
          <div className="bg-surface-container-lowest p-4 sm:p-6 rounded-[2rem] shadow-[0_8px_32px_0_rgba(25,28,29,0.04)] border border-surface-container-low/50 flex flex-col sm:flex-row gap-6">
            <img src="https://picsum.photos/seed/tour1/400/300" alt="Tour" className="w-full sm:w-48 h-48 object-cover rounded-2xl" />
            <div className="flex flex-col justify-center">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary mb-2">Thám hiểm 5 ngày</span>
              <h3 className="text-2xl font-black text-on-surface mb-4 leading-tight">Bình minh trên đỉnh Langbiang</h3>
              <div className="flex flex-wrap gap-4 text-sm font-medium text-on-surface-variant">
                <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">calendar_today</span> 12 Thg 11, 2026</div>
                <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">group</span> 2 Người lớn</div>
                <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">location_on</span> Lâm Đồng, VN</div>
              </div>
            </div>
          </div>

          {/* Itinerary Summary */}
          <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-[2rem] shadow-[0_8px_32px_0_rgba(25,28,29,0.04)] border border-surface-container-low/50">
            <h4 className="text-lg font-black text-on-surface mb-6">Thông tin Dịch vụ</h4>
            <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-[19px] before:w-[2px] before:bg-surface-container-high ml-2">
              <div className="relative pl-12 -ml-2">
                <div className="absolute left-0 top-0.5 w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-black shadow-sm ring-4 ring-white">1</div>
                <h5 className="font-bold text-on-surface">Khởi hành</h5>
                <p className="text-sm text-on-surface-variant mt-1">06:00 AM - Sân bay Tân Sơn Nhất, Cổng D2</p>
              </div>
              <div className="relative pl-12 -ml-2">
                <div className="absolute left-0 top-0.5 w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-black shadow-sm ring-4 ring-white">2</div>
                <h5 className="font-bold text-on-surface">Lưu trú</h5>
                <p className="text-sm text-on-surface-variant mt-1">Swiss-Belresort Tuyen Lam (4 đêm)</p>
              </div>
              <div className="relative pl-12 -ml-2">
                <div className="absolute left-0 top-0.5 w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-black shadow-sm ring-4 ring-white">3</div>
                <h5 className="font-bold text-on-surface">Hướng dẫn viên</h5>
                <p className="text-sm text-on-surface-variant mt-1">Trần Quang (Chuyên gia leo núi/Cứu hộ)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Ticket / QR */}
          <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0_8px_32px_0_rgba(25,28,29,0.04)] border border-surface-container-low/50 flex flex-col items-center text-center">
             <h4 className="font-black text-on-surface mb-2">Vé Điện tử</h4>
             <p className="text-xs text-on-surface-variant mb-6">Trình mã QR này cho HDV khi tập trung</p>
             <div className="w-48 h-48 bg-white p-2 rounded-2xl shadow-inner border border-surface-container-high mb-6">
                <div className="w-full h-full border-4 border-dashed border-slate-300 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-slate-300">qr_code_2</span>
                </div>
             </div>
             <button className="flex items-center justify-center gap-2 w-full py-3 bg-surface-container-low hover:bg-surface-container font-bold rounded-xl transition-colors">
                <span className="material-symbols-outlined text-[18px]">download</span> Tải xuống PDF
             </button>
             <button 
                onClick={() => setIsReviewModalOpen(true)}
                className="flex items-center justify-center gap-2 w-full py-3 mt-4 border-2 border-primary/20 text-primary hover:bg-primary/5 font-bold rounded-xl transition-colors"
             >
                <span className="material-symbols-outlined text-[18px]">rate_review</span> Đánh giá chuyến đi
             </button>
          </div>

          {/* Price Breakdown */}
          <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0_8px_32px_0_rgba(25,28,29,0.04)] border border-surface-container-low/50">
            <h4 className="font-black text-on-surface mb-4">Tổng hóa đơn</h4>
            <div className="space-y-3 text-sm font-medium mb-6">
              <div className="flex justify-between text-on-surface-variant"><span>Giá tour (x2 khách)</span><span>26,600,000₫</span></div>
              <div className="flex justify-between text-on-surface-variant"><span>Thuế & Phí (5%)</span><span>1,330,000₫</span></div>
            </div>
            <div className="border-t border-surface-container-high pt-4 flex justify-between items-center">
              <span className="font-bold text-on-surface">Đã thanh toán</span>
              <span className="text-2xl font-black text-primary">27,930,000₫</span>
            </div>
          </div>
        </div>
      </div>

      {/* Review Submitted Toast */}
      {reviewSubmitted && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300">
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          <span className="font-bold text-sm">Đánh giá đã gửi, đang chờ duyệt</span>
          <button onClick={() => setReviewSubmitted(false)} className="ml-2 hover:opacity-70 transition-opacity">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsReviewModalOpen(false)}></div>
          <div className="bg-surface-container-lowest p-8 w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center bg-surface-container-high hover:bg-surface-container-highest rounded-full text-on-surface-variant transition-colors"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
            
            <h3 className="text-2xl font-black text-on-surface mb-2">Đánh giá trải nghiệm</h3>
            <p className="text-on-surface-variant text-sm mb-8">Chia sẻ cảm nhận của bạn về chuyến đi "Bình minh trên đỉnh Langbiang". Ý kiến của bạn luôn vô giá!</p>
            
            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform focus:outline-none"
                >
                  <span 
                    className="material-symbols-outlined text-4xl" 
                    style={{ 
                      fontVariationSettings: (hoveredRating || rating) >= star ? "'FILL' 1" : "'FILL' 0",
                      color: (hoveredRating || rating) >= star ? '#eab308' : '#cbd5e1'
                    }}
                  >
                    star
                  </span>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <textarea 
                rows={4} 
                className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium text-on-surface resize-none"
                placeholder="HDV rất nhiệt tình và cảnh đẹp tuyệt vời..."
              ></textarea>
              <button
                onClick={() => { setIsReviewModalOpen(false); setReviewSubmitted(true); }}
                className="w-full signature-gradient text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all text-sm"
              >
                Gửi đánh giá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
