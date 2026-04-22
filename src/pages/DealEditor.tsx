import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function DealEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [activeTab, setActiveTab] = useState<'public' | 'conditions'>('public');

  const TABS = [
    { key: 'public' as const,     label: 'Hiển thị công khai', icon: 'public' },
    { key: 'conditions' as const, label: 'Điều kiện mã giảm',  icon: 'confirmation_number' },
  ];

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center bg-surface-container-lowest px-8 py-6 rounded-[2rem] shadow-sm">
        <div>
          <Link to="/admin/deals" className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors mb-2">
            <span className="material-symbols-outlined">arrow_back</span>
            Danh sách Ưu đãi
          </Link>
          <h1 className="text-2xl font-black text-on-surface">{isEdit ? 'Chỉnh sửa Ưu đãi' : 'Tạo Ưu đãi mới'}</h1>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 font-bold text-on-surface-variant hover:bg-surface-container-high rounded-xl transition-colors text-sm">
            Lưu nháp
          </button>
          <button
            onClick={() => navigate('/admin/deals')}
            className="signature-gradient text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all text-sm"
          >
            {isEdit ? 'Lưu thay đổi' : 'Tạo mới'}
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-surface-container-low p-1 rounded-2xl w-fit">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.key
                ? 'bg-white text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className={`material-symbols-outlined text-base ${activeTab === tab.key ? '' : 'opacity-60'}`} style={{ fontVariationSettings: activeTab === tab.key ? "'FILL' 1" : "'FILL' 0" }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Hiển thị công khai */}
      {activeTab === 'public' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Public fields */}
          <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm space-y-6">
            <h3 className="font-black text-lg text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>web</span>
              Nội dung hiển thị cho khách
            </h3>

            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">Ảnh chiến dịch</label>
              <div className="relative aspect-video bg-surface-container-low rounded-2xl overflow-hidden border-2 border-dashed border-outline-variant/30 hover:border-primary/40 transition-all group cursor-pointer">
                {isEdit ? (
                  <>
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBA7z9szD5v1Q2Aq_LKLNlOy3CRK9XSXN0rXpRO7wygKltolDJmcSwDPcfipNat6nU-tcLbDRHzTMNWqLHZk0sNsWJcjwp5ujIdh7YjAX6L67lnNzCdlZ_uef1za35WI8kBLpA2HJ2zZS7SLTh_qxAv4MuGszLBap422Lu1aeNADAQsmjJXwaEAbei6dSJVN9k9bREBnm4r-Nu3V-AEDOu0Lhg2j0TxMVZutTqjHNEqiOE0HMImG5A-Anbpb50TkcygtvOCsdEtyGY"
                      alt="Campaign"
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                      <span className="bg-white/90 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">edit</span> Đổi ảnh
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-center p-6">
                    <span className="material-symbols-outlined text-3xl text-slate-400" style={{ fontVariationSettings: "'FILL' 1" }}>add_photo_alternate</span>
                    <p className="text-sm font-black text-slate-500">Thêm ảnh chiến dịch</p>
                    <p className="text-xs text-slate-400">Khuyên dùng: 1200 × 600px</p>
                    <input type="text" className="w-full bg-white border-none rounded-lg px-3 py-2 text-xs text-center shadow-sm focus:ring-1 focus:ring-primary outline-none" placeholder="Dán URL ảnh..." />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">Nhãn danh mục (category pill)</label>
              <select className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold text-on-surface">
                <option>Theo mùa</option>
                <option>Văn hóa</option>
                <option>Ưu đãi chớp nhoáng</option>
                <option>Luxury</option>
                <option>Phiêu lưu</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">Tiêu đề công khai</label>
              <input type="text" defaultValue={isEdit ? "Mùa thu tĩnh lặng giữa Dolomites" : ""} className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-base font-bold text-on-surface" placeholder="Tên gọi hấp dẫn cho chiến dịch..." />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">Mô tả công khai</label>
              <textarea rows={3} defaultValue={isEdit ? "Tiết kiệm 20% cho tất cả các hành trình giữa tuần suốt tháng 11. Tìm kiếm sự tĩnh lặng giữa những rừng thông vàng." : ""} className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium text-on-surface resize-none" placeholder="Nội dung hiển thị trên thẻ ưu đãi..."></textarea>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">Nhãn lợi ích (offer badge)</label>
              <input type="text" defaultValue={isEdit ? "GIẢM 20%" : ""} className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-base font-black text-secondary uppercase" placeholder="VD: GIẢM 20% | TẶNG 500.000₫ | NÂNG CẤP MIỄN PHÍ" />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">Nhãn nút CTA</label>
              <input type="text" defaultValue="Khám phá Ưu đãi" className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold text-on-surface" placeholder="VD: Đặt ngay | Xem chi tiết | Khám phá" />
            </div>
          </div>

          {/* Right: Preview Card */}
          <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm space-y-6">
            <h3 className="font-black text-lg text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>preview</span>
              Xem trước card ưu đãi
            </h3>
            <p className="text-xs text-on-surface-variant -mt-4">Đây là cách thẻ ưu đãi sẽ xuất hiện trên trang công khai.</p>

            {/* Preview Card Mock */}
            <div className="group relative bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_48px_0_rgba(25,28,29,0.08)] border border-outline-variant/10 flex flex-col md:flex-row items-stretch">
              <div className="md:w-5/12 relative h-56 md:h-auto overflow-hidden">
                <img
                  src={isEdit
                    ? "https://lh3.googleusercontent.com/aida-public/AB6AXuBA7z9szD5v1Q2Aq_LKLNlOy3CRK9XSXN0rXpRO7wygKltolDJmcSwDPcfipNat6nU-tcLbDRHzTMNWqLHZk0sNsWJcjwp5ujIdh7YjAX6L67lnNzCdlZ_uef1za35WI8kBLpA2HJ2zZS7SLTh_qxAv4MuGszLBap422Lu1aeNADAQsmjJXwaEAbei6dSJVN9k9bREBnm4r-Nu3V-AEDOu0Lhg2j0TxMVZutTqjHNEqiOE0HMImG5A-Anbpb50TkcygtvOCsdEtyGY"
                    : "https://picsum.photos/seed/deal/600/400"
                  }
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase text-primary shadow border border-primary/10">
                    {isEdit ? 'Theo mùa' : 'Danh mục'}
                  </span>
                </div>
              </div>
              <div className="md:w-7/12 p-7 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-black tracking-tight text-on-surface mb-3 leading-tight">
                    {isEdit ? 'Mùa thu tĩnh lặng giữa Dolomites.' : 'Tiêu đề chiến dịch.'}
                  </h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed font-light italic">
                    "{isEdit ? 'Tiết kiệm 20% cho tất cả các hành trình giữa tuần suốt tháng 11.' : 'Mô tả chiến dịch sẽ hiển thị ở đây...'}"
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-outline-variant/10 pt-5 mt-5">
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Quyền lợi</span>
                    <span className="text-xl font-black text-secondary tracking-tighter">{isEdit ? 'GIẢM 20%' : 'OFFER BADGE'}</span>
                  </div>
                  <button className="bg-primary text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md">
                    Khám phá Ưu đãi
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-low rounded-2xl p-5 space-y-2 border border-outline-variant/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Thông tin mã giảm giá (tóm tắt)</p>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Mã:</span>
                <span className="font-mono font-black text-on-surface">{isEdit ? 'SUMMER24' : '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Loại giảm:</span>
                <span className="font-bold text-on-surface">{isEdit ? 'Giảm 20%' : '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Hết hạn:</span>
                <span className="font-bold text-red-500">{isEdit ? '30/11/2024 (Đã hết hạn)' : '—'}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-2">Cấu hình chi tiết mã giảm ở tab "Điều kiện mã giảm".</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Điều kiện mã giảm */}
      {activeTab === 'conditions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm space-y-6">
            <h3 className="font-black text-lg text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>confirmation_number</span>
              Cấu hình mã giảm giá
            </h3>

            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">Tên Chiến dịch (nội bộ)</label>
              <input type="text" defaultValue={isEdit ? "Mùa thu tĩnh lặng giữa Dolomites" : ""} className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-base font-bold text-on-surface placeholder:normal-case placeholder:text-sm" placeholder="VD: Khuyến mãi mùa Hè 2026" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">Mã giảm giá (Code)</label>
              <input type="text" defaultValue={isEdit ? "SUMMER24" : ""} className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-xl font-bold text-on-surface uppercase placeholder:normal-case placeholder:text-sm" placeholder="VD: SUM26" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">Loại giảm</label>
                <select className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold text-on-surface">
                  <option>Phần trăm (%)</option>
                  <option>Số tiền cố định (₫)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">Giá trị</label>
                <input type="number" defaultValue={isEdit ? 20 : ""} className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold text-on-surface" placeholder="VD: 20" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">Mô tả nội bộ</label>
              <textarea rows={2} defaultValue={isEdit ? "Giảm 20% cho tất cả các tour Mùa Thu 2024" : ""} className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium text-on-surface resize-none" placeholder="Ghi chú nội bộ về chiến dịch..."></textarea>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm space-y-6">
            <h3 className="font-black text-lg text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>rule</span>
              Điều kiện áp dụng
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">Ngày có hiệu lực</label>
                <input type="date" className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm text-on-surface font-medium" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">Ngày hết hạn</label>
                <input type="date" defaultValue={isEdit ? "2024-11-30" : ""} className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm text-on-surface font-medium" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">Giá trị ĐH tối thiểu</label>
                <input type="number" defaultValue={isEdit ? 1000 : ""} className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium text-on-surface" placeholder="VD: 500" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">Áp dụng cho</label>
                <select className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold text-on-surface">
                  <option>Tất cả chuyến đi</option>
                  <option>Tour cụ thể</option>
                  <option>Khu vực cụ thể</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">Cách hiển thị mã cho khách</label>
              <div className="space-y-2">
                {[
                  { id: 'show-code', label: 'Hiển thị mã rõ ràng với nút "Sao chép mã"' },
                  { id: 'auto-apply', label: 'Tự động áp dụng khi khách bấm CTA (không cần nhập mã)' },
                ].map(opt => (
                  <label key={opt.id} className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl cursor-pointer hover:bg-surface-container-high transition-colors">
                    <input type="radio" name="display-mode" className="text-primary focus:ring-primary" defaultChecked={opt.id === 'show-code'} />
                    <span className="text-sm font-medium text-on-surface">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">Trạng thái</label>
              <div className="flex items-center gap-3 bg-surface-container-low p-4 rounded-xl cursor-pointer">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
                <span className="font-bold text-sm text-on-surface">Kích hoạt (Active)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
