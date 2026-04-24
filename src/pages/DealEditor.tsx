import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function DealEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [activeTab, setActiveTab] = useState<'public' | 'conditions'>('public');

  const TABS = [
    { key: 'public'     as const, label: 'Hiển thị công khai', icon: 'public'              },
    { key: 'conditions' as const, label: 'Điều kiện mã giảm',  icon: 'confirmation_number' },
  ];

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      {/* Page header */}
      <div className="px-6 lg:px-8 py-5 border-b border-black/5 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            to="/admin/deals"
            className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors mb-2"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Ưu đãi
          </Link>
          <h1 className="text-xl font-black text-on-surface">{isEdit ? 'Chỉnh sửa Ưu đãi' : 'Tạo Ưu đãi mới'}</h1>
        </div>
        <div className="flex gap-2">
          <button className="px-5 py-2.5 font-bold text-sm text-slate-500 hover:bg-slate-100 rounded-xl transition-colors border border-black/10">
            Lưu nháp
          </button>
          <button
            onClick={() => navigate('/admin/deals')}
            className="signature-gradient text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-xl transition-all active:scale-95"
          >
            {isEdit ? 'Lưu thay đổi' : 'Tạo mới'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 lg:px-8 pt-5 pb-0">
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab.key
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-slate-400 hover:text-on-surface'
              }`}
            >
              <span
                className="material-symbols-outlined text-base"
                style={{ fontVariationSettings: activeTab === tab.key ? "'FILL' 1" : "'FILL' 0" }}
              >{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 p-6 lg:p-8">
        {/* Tab: public */}
        {activeTab === 'public' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-6 space-y-5">
              <h3 className="font-black text-base text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>web</span>
                Nội dung hiển thị cho khách
              </h3>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Ảnh chiến dịch</label>
                <div className="relative aspect-video bg-slate-50 rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 hover:border-primary/40 transition-all group cursor-pointer">
                  {isEdit ? (
                    <>
                      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBA7z9szD5v1Q2Aq_LKLNlOy3CRK9XSXN0rXpRO7wygKltolDJmcSwDPcfipNat6nU-tcLbDRHzTMNWqLHZk0sNsWJcjwp5ujIdh7YjAX6L67lnNzCdlZ_uef1za35WI8kBLpA2HJ2zZS7SLTh_qxAv4MuGszLBap422Lu1aeNADAQsmjJXwaEAbei6dSJVN9k9bREBnm4r-Nu3V-AEDOu0Lhg2j0TxMVZutTqjHNEqiOE0HMImG5A-Anbpb50TkcygtvOCsdEtyGY" alt="Campaign" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                        <span className="bg-white/90 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">edit</span> Đổi ảnh
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-6">
                      <span className="material-symbols-outlined text-3xl text-slate-300" style={{ fontVariationSettings: "'FILL' 1" }}>add_photo_alternate</span>
                      <p className="text-sm font-bold text-slate-400">Thêm ảnh chiến dịch</p>
                      <p className="text-xs text-slate-300">Khuyên dùng: 1200 × 600px</p>
                      <input type="text" className="w-full bg-white border-none rounded-lg px-3 py-2 text-xs text-center shadow-sm focus:ring-1 focus:ring-primary outline-none" placeholder="Dán URL ảnh..." />
                    </div>
                  )}
                </div>
              </div>

              {[
                { label: 'Nhãn danh mục', type: 'select', options: ['Theo mùa', 'Văn hóa', 'Ưu đãi chớp nhoáng', 'Luxury', 'Phiêu lưu'] },
              ].map(field => (
                <div key={field.label}>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">{field.label}</label>
                  <select className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold text-on-surface">
                    {field.options?.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Tiêu đề công khai</label>
                <input type="text" defaultValue={isEdit ? 'Mùa thu tĩnh lặng giữa Dolomites' : ''} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-base font-bold text-on-surface" placeholder="Tên gọi hấp dẫn cho chiến dịch..." />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Mô tả công khai</label>
                <textarea rows={3} defaultValue={isEdit ? 'Tiết kiệm 20% cho tất cả các hành trình giữa tuần suốt tháng 11. Tìm kiếm sự tĩnh lặng giữa những rừng thông vàng.' : ''} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium text-on-surface resize-none" placeholder="Nội dung hiển thị trên thẻ ưu đãi..." />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Nhãn lợi ích</label>
                <input type="text" defaultValue={isEdit ? 'GIẢM 20%' : ''} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-base font-black text-secondary uppercase" placeholder="VD: GIẢM 20% | TẶNG 500.000₫" />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Nhãn nút CTA</label>
                <input type="text" defaultValue="Khám phá Ưu đãi" className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold text-on-surface" placeholder="VD: Đặt ngay | Xem chi tiết" />
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-6 space-y-5">
              <div>
                <h3 className="font-black text-base text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>preview</span>
                  Xem trước card ưu đãi
                </h3>
                <p className="text-xs text-slate-400 mt-1">Cách thẻ ưu đãi sẽ xuất hiện trên trang công khai.</p>
              </div>

              <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-black/5 flex flex-col md:flex-row items-stretch">
                <div className="md:w-5/12 relative h-48 md:h-auto overflow-hidden">
                  <img
                    src={isEdit ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuBA7z9szD5v1Q2Aq_LKLNlOy3CRK9XSXN0rXpRO7wygKltolDJmcSwDPcfipNat6nU-tcLbDRHzTMNWqLHZk0sNsWJcjwp5ujIdh7YjAX6L67lnNzCdlZ_uef1za35WI8kBLpA2HJ2zZS7SLTh_qxAv4MuGszLBap422Lu1aeNADAQsmjJXwaEAbei6dSJVN9k9bREBnm4r-Nu3V-AEDOu0Lhg2j0TxMVZutTqjHNEqiOE0HMImG5A-Anbpb50TkcygtvOCsdEtyGY' : 'https://picsum.photos/seed/deal/600/400'}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow border border-primary/10">
                      {isEdit ? 'Theo mùa' : 'Danh mục'}
                    </span>
                  </div>
                </div>
                <div className="md:w-7/12 p-6 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xl font-black tracking-tight text-on-surface mb-2 leading-tight">
                      {isEdit ? 'Mùa thu tĩnh lặng giữa Dolomites.' : 'Tiêu đề chiến dịch.'}
                    </h4>
                    <p className="text-slate-400 text-sm leading-relaxed italic">
                      "{isEdit ? 'Tiết kiệm 20% cho tất cả hành trình giữa tuần suốt tháng 11.' : 'Mô tả chiến dịch sẽ hiển thị ở đây...'}"
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-black/5 pt-4 mt-4">
                    <div>
                      <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Quyền lợi</span>
                      <span className="text-xl font-black text-secondary tracking-tight">{isEdit ? 'GIẢM 20%' : 'OFFER BADGE'}</span>
                    </div>
                    <button className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm">Khám phá Ưu đãi</button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 space-y-2 border border-black/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tóm tắt mã giảm giá</p>
                {[
                  { label: 'Mã:', value: isEdit ? 'SUMMER24' : '—', mono: true },
                  { label: 'Loại giảm:', value: isEdit ? 'Giảm 20%' : '—', mono: false },
                  { label: 'Hết hạn:', value: isEdit ? '30/11/2024 (Đã hết hạn)' : '—', red: true },
                ].map(row => (
                  <div key={row.label} className="flex justify-between text-sm">
                    <span className="text-slate-400">{row.label}</span>
                    <span className={`font-bold ${row.mono ? 'font-mono text-on-surface' : row.red ? 'text-red-500' : 'text-on-surface'}`}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: conditions */}
        {activeTab === 'conditions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-6 space-y-5">
              <h3 className="font-black text-base text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>confirmation_number</span>
                Cấu hình mã giảm giá
              </h3>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Tên chiến dịch (nội bộ)</label>
                <input type="text" defaultValue={isEdit ? 'Mùa thu tĩnh lặng giữa Dolomites' : ''} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-base font-bold text-on-surface" placeholder="VD: Khuyến mãi mùa Hè 2026" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Mã giảm giá</label>
                <input type="text" defaultValue={isEdit ? 'SUMMER24' : ''} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-xl font-bold text-on-surface uppercase" placeholder="VD: SUM26" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Loại giảm</label>
                  <select className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold text-on-surface">
                    <option>Phần trăm (%)</option>
                    <option>Số tiền cố định (₫)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Giá trị</label>
                  <input type="number" defaultValue={isEdit ? 20 : ''} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold text-on-surface" placeholder="VD: 20" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Mô tả nội bộ</label>
                <textarea rows={2} defaultValue={isEdit ? 'Giảm 20% cho tất cả các tour Mùa Thu 2024' : ''} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium text-on-surface resize-none" placeholder="Ghi chú nội bộ về chiến dịch..." />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-6 space-y-5">
              <h3 className="font-black text-base text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>rule</span>
                Điều kiện áp dụng
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Ngày có hiệu lực</label>
                  <input type="date" className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm text-on-surface font-medium" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Ngày hết hạn</label>
                  <input type="date" defaultValue={isEdit ? '2024-11-30' : ''} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm text-on-surface font-medium" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Giá trị ĐH tối thiểu</label>
                  <input type="number" defaultValue={isEdit ? 1000 : ''} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium text-on-surface" placeholder="VD: 500" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Áp dụng cho</label>
                  <select className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold text-on-surface">
                    <option>Tất cả chuyến đi</option>
                    <option>Tour cụ thể</option>
                    <option>Khu vực cụ thể</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Cách hiển thị mã cho khách</label>
                <div className="space-y-2">
                  {[
                    { id: 'show-code',   label: 'Hiển thị mã rõ ràng với nút "Sao chép mã"' },
                    { id: 'auto-apply',  label: 'Tự động áp dụng khi khách bấm CTA' },
                  ].map(opt => (
                    <label key={opt.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                      <input type="radio" name="display-mode" className="text-primary focus:ring-primary" defaultChecked={opt.id === 'show-code'} />
                      <span className="text-sm font-medium text-on-surface">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Trạng thái</label>
                <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl cursor-pointer">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                  </label>
                  <span className="font-bold text-sm text-on-surface">Kích hoạt (Active)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
