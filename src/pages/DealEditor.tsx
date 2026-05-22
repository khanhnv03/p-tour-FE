import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getAdminDeal, createAdminDeal, updateAdminDeal } from '../api/admin';
import type { SaveDealRequest } from '../api/admin';
import type { DealStatus, DiscountType, DisplayMode } from '../api/deals';
import { extractApiErrorMessage } from '../api/types';

const CATEGORIES = ['Theo mùa', 'Đặt sớm', 'Văn hóa', 'Ưu đãi chớp nhoáng', 'Luxury', 'Phiêu lưu'];

interface FormState {
  title: string;
  description: string;
  campaignImageUrl: string;
  badgeText: string;
  category: string;
  discountType: DiscountType;
  discountValue: string;
  promoCode: string;
  displayMode: DisplayMode;
  minOrderValue: string;
  maxDiscountAmount: string;
  usageLimit: string;
  validFrom: string;
  validTo: string;
  status: DealStatus;
}

const EMPTY_FORM: FormState = {
  title: '',
  description: '',
  campaignImageUrl: '',
  badgeText: '',
  category: CATEGORIES[0],
  discountType: 'PERCENTAGE',
  discountValue: '',
  promoCode: '',
  displayMode: 'COPY_CODE',
  minOrderValue: '',
  maxDiscountAmount: '',
  usageLimit: '',
  validFrom: '',
  validTo: '',
  status: 'ACTIVE',
};

function toDateInput(iso: string | null | undefined): string {
  if (!iso) return '';
  return iso.slice(0, 10);
}

function getPreviewStatus(validTo: string): string {
  if (!validTo) return '';
  const diffDays = Math.ceil((new Date(validTo).getTime() - Date.now()) / 86400000);
  if (diffDays < 0) return ' (Đã hết hạn)';
  if (diffDays <= 7) return ' (Sắp hết hạn)';
  return '';
}

export default function DealEditor() {
  const navigate    = useNavigate();
  const { id }      = useParams();
  const isEdit      = Boolean(id);

  const [activeTab,   setActiveTab]   = useState<'public' | 'conditions'>('public');
  const [form,        setForm]        = useState<FormState>(EMPTY_FORM);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [submitting,  setSubmitting]  = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const deal = await getAdminDeal(Number(id));
        setForm({
          title:            deal.title ?? '',
          description:      deal.description ?? '',
          campaignImageUrl: deal.campaignImageUrl ?? '',
          badgeText:        deal.badgeText ?? '',
          category:         deal.category ?? CATEGORIES[0],
          discountType:     deal.discountType,
          discountValue:    String(deal.discountValue),
          promoCode:        deal.promoCode ?? '',
          displayMode:      deal.displayMode,
          minOrderValue:    deal.minOrderValue != null ? String(deal.minOrderValue) : '',
          maxDiscountAmount: deal.maxDiscountAmount != null ? String(deal.maxDiscountAmount) : '',
          usageLimit:       deal.usageLimit != null ? String(deal.usageLimit) : '',
          validFrom:        toDateInput(deal.validFrom),
          validTo:          toDateInput(deal.validTo),
          status:           deal.status,
        });
      } catch {
        setError('Không thể tải dữ liệu ưu đãi.');
      } finally {
        setLoadingData(false);
      }
    })();
  }, [id, isEdit]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function failSubmit(message: string, tab: 'public' | 'conditions') {
    setSubmitError(message);
    setActiveTab(tab);
  }

  async function handleSubmit() {
    setSubmitError(null);
    if (!form.title.trim()) {
      failSubmit('Vui lòng nhập tiêu đề chiến dịch.', 'public');
      return;
    }
    if (!form.discountValue || Number(form.discountValue) <= 0) {
      failSubmit('Vui lòng nhập giá trị giảm giá hợp lệ.', 'conditions');
      return;
    }
    if (!form.validFrom || !form.validTo) {
      failSubmit('Vui lòng chọn ngày có hiệu lực và ngày hết hạn.', 'conditions');
      return;
    }
    if (form.validFrom > form.validTo) {
      failSubmit('Ngày hết hạn phải sau hoặc bằng ngày có hiệu lực.', 'conditions');
      return;
    }
    if (form.usageLimit && Number(form.usageLimit) < 1) {
      failSubmit('Giới hạn lượt dùng phải lớn hơn hoặc bằng 1, hoặc để trống nếu không giới hạn.', 'conditions');
      return;
    }

    const payload: SaveDealRequest = {
      title:             form.title.trim(),
      description:       form.description.trim() || null,
      campaignImageUrl:  form.campaignImageUrl.trim() || null,
      badgeText:         form.badgeText.trim() || null,
      category:          form.category || null,
      discountType:      form.discountType,
      discountValue:     Number(form.discountValue),
      promoCode:         form.promoCode.trim() || null,
      displayMode:       form.displayMode,
      minOrderValue:     form.minOrderValue     ? Number(form.minOrderValue)     : null,
      maxDiscountAmount: form.maxDiscountAmount ? Number(form.maxDiscountAmount) : null,
      usageLimit:        form.usageLimit        ? Number(form.usageLimit)        : null,
      validFrom:         form.validFrom,
      validTo:           form.validTo,
      status:            form.status,
    };

    setSubmitting(true);
    try {
      if (isEdit) {
        await updateAdminDeal(Number(id), payload);
      } else {
        await createAdminDeal(payload);
      }
      navigate('/admin/deals');
    } catch (submitFailure: unknown) {
      setSubmitError(extractApiErrorMessage(submitFailure, 'Lưu thất bại. Vui lòng thử lại.'));
    } finally {
      setSubmitting(false);
    }
  }

  const TABS = [
    { key: 'public'     as const, label: 'Hiển thị công khai', icon: 'public'              },
    { key: 'conditions' as const, label: 'Điều kiện mã giảm',  icon: 'confirmation_number' },
  ];

  const previewBadge = form.badgeText.trim()
    || (form.discountValue
        ? form.discountType === 'PERCENTAGE'
          ? `GIẢM ${form.discountValue}%`
          : `GIẢM ${Number(form.discountValue).toLocaleString('vi-VN')}₫`
        : 'OFFER BADGE');

  const previewDiscountLabel = form.discountValue
    ? form.discountType === 'PERCENTAGE'
      ? `Giảm ${form.discountValue}%`
      : `Giảm ${Number(form.discountValue).toLocaleString('vi-VN')}₫`
    : '—';

  const previewExpiry = form.validTo
    ? new Date(form.validTo).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
      + getPreviewStatus(form.validTo)
    : '—';

  if (loadingData) {
    return (
      <div className="flex items-center justify-center flex-1 py-32 gap-3 text-slate-400">
        <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
        <span className="text-sm font-bold">Đang tải...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 py-32 gap-3">
        <span className="material-symbols-outlined text-3xl text-red-400">error</span>
        <p className="text-sm text-red-500 font-bold">{error}</p>
        <Link to="/admin/deals" className="text-xs text-primary font-black hover:underline">Quay lại danh sách</Link>
      </div>
    );
  }

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
          <Link
            to="/admin/deals"
            className="px-5 py-2.5 font-bold text-sm text-slate-500 hover:bg-slate-100 rounded-xl transition-colors border border-black/10"
          >
            Hủy
          </Link>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="signature-gradient text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-xl transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
            {isEdit ? 'Lưu thay đổi' : 'Tạo mới'}
          </button>
        </div>
      </div>

      {submitError && (
        <div className="mx-6 lg:mx-8 mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {submitError}
        </div>
      )}

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

        {/* ── Tab: public ── */}
        {activeTab === 'public' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Form */}
            <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-6 space-y-5">
              <h3 className="font-black text-base text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>web</span>
                Nội dung hiển thị cho khách
              </h3>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Trạng thái</label>
                <select
                  value={form.status}
                  onChange={e => set('status', e.target.value as DealStatus)}
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold text-on-surface"
                >
                  <option value="ACTIVE">Đang hoạt động</option>
                  <option value="DRAFT">Bản nháp</option>
                  <option value="EXPIRED">Đã hết hạn</option>
                </select>
              </div>

              {/* Campaign image */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Ảnh chiến dịch (URL)</label>
                {form.campaignImageUrl && (
                  <img
                    src={form.campaignImageUrl}
                    alt="preview"
                    className="w-full aspect-video object-cover rounded-xl mb-2 border border-black/5"
                    onError={e => (e.currentTarget.style.display = 'none')}
                  />
                )}
                <input
                  type="text"
                  value={form.campaignImageUrl}
                  onChange={e => set('campaignImageUrl', e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-xs text-on-surface"
                  placeholder="https://... (dán URL ảnh)"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Nhãn danh mục</label>
                <select
                  value={form.category}
                  onChange={e => set('category', e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold text-on-surface"
                >
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Tiêu đề chiến dịch *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => set('title', e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-base font-bold text-on-surface"
                  placeholder="Tên hấp dẫn cho chiến dịch..."
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Mô tả công khai</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium text-on-surface resize-none"
                  placeholder="Nội dung hiển thị trên thẻ ưu đãi..."
                />
              </div>

              {/* Badge text */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Nhãn lợi ích</label>
                <input
                  type="text"
                  value={form.badgeText}
                  onChange={e => set('badgeText', e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-base font-black text-secondary uppercase"
                  placeholder="VD: GIẢM 20% | TẶNG 500.000₫ (để trống để tự tính)"
                />
                <p className="text-[10px] text-slate-400 mt-1">Để trống sẽ tự tính từ loại & giá trị giảm.</p>
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
                <div className="md:w-5/12 relative h-48 md:h-auto overflow-hidden bg-slate-100">
                  {form.campaignImageUrl ? (
                    <img
                      src={form.campaignImageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={e => (e.currentTarget.style.display = 'none')}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-3xl text-slate-300">image</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow border border-primary/10">
                      {form.category || 'Danh mục'}
                    </span>
                  </div>
                </div>
                <div className="md:w-7/12 p-6 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xl font-black tracking-tight text-on-surface mb-2 leading-tight">
                      {form.title || 'Tiêu đề chiến dịch.'}
                    </h4>
                    <p className="text-slate-400 text-sm leading-relaxed italic">
                      "{form.description || 'Mô tả chiến dịch sẽ hiển thị ở đây...'}"
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-black/5 pt-4 mt-4">
                    <div>
                      <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Quyền lợi</span>
                      <span className="text-xl font-black text-secondary tracking-tight">{previewBadge}</span>
                    </div>
                    <button className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm">Khám phá Ưu đãi</button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 space-y-2 border border-black/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tóm tắt mã giảm giá</p>
                {[
                  { label: 'Mã:',       value: form.promoCode || '—',  mono: true,  red: false },
                  { label: 'Loại giảm:', value: previewDiscountLabel,  mono: false, red: false },
                  {
                    label: 'Hết hạn:',
                    value: previewExpiry,
                    mono: false,
                    red: Boolean(form.validTo && new Date(form.validTo) < new Date()),
                  },
                ].map(row => (
                  <div key={row.label} className="flex justify-between text-sm">
                    <span className="text-slate-400">{row.label}</span>
                    <span className={`font-bold ${row.mono ? 'font-mono text-on-surface' : row.red ? 'text-red-500' : 'text-on-surface'}`}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: conditions ── */}
        {activeTab === 'conditions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Coupon config */}
            <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-6 space-y-5">
              <h3 className="font-black text-base text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>confirmation_number</span>
                Cấu hình mã giảm giá
              </h3>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Mã giảm giá</label>
                <input
                  type="text"
                  value={form.promoCode}
                  onChange={e => set('promoCode', e.target.value.toUpperCase())}
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-xl font-bold text-on-surface uppercase tracking-widest"
                  placeholder="VD: SUMMER26"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Loại giảm *</label>
                  <select
                    value={form.discountType}
                    onChange={e => set('discountType', e.target.value as DiscountType)}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold text-on-surface"
                  >
                    <option value="PERCENTAGE">Phần trăm (%)</option>
                    <option value="FIXED">Số tiền cố định (₫)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Giá trị *</label>
                  <input
                    type="number"
                    min="0"
                    value={form.discountValue}
                    onChange={e => set('discountValue', e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold text-on-surface"
                    placeholder={form.discountType === 'PERCENTAGE' ? 'VD: 20' : 'VD: 500000'}
                  />
                </div>
              </div>

              {/* Display mode */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Cách hiển thị mã cho khách</label>
                <div className="space-y-2">
                  {([
                    { value: 'COPY_CODE',   label: 'Hiển thị mã rõ ràng với nút "Sao chép mã"' },
                    { value: 'AUTO_APPLY',  label: 'Tự động áp dụng khi khách bấm CTA' },
                  ] as { value: DisplayMode; label: string }[]).map(opt => (
                    <label key={opt.value} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                      <input
                        type="radio"
                        name="displayMode"
                        value={opt.value}
                        checked={form.displayMode === opt.value}
                        onChange={() => set('displayMode', opt.value)}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="text-sm font-medium text-on-surface">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Conditions */}
            <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-6 space-y-5">
              <h3 className="font-black text-base text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>rule</span>
                Điều kiện áp dụng
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Ngày có hiệu lực</label>
                  <input
                    type="date"
                    value={form.validFrom}
                    onChange={e => set('validFrom', e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm text-on-surface font-medium"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Ngày hết hạn</label>
                  <input
                    type="date"
                    value={form.validTo}
                    onChange={e => set('validTo', e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm text-on-surface font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Giá trị ĐH tối thiểu (₫)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.minOrderValue}
                    onChange={e => set('minOrderValue', e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium text-on-surface"
                    placeholder="Không giới hạn"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Giảm tối đa (₫)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.maxDiscountAmount}
                    onChange={e => set('maxDiscountAmount', e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium text-on-surface"
                    placeholder="Không giới hạn"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Giới hạn lượt dùng</label>
                <input
                  type="number"
                  min="0"
                  value={form.usageLimit}
                  onChange={e => set('usageLimit', e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium text-on-surface"
                  placeholder="Không giới hạn"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
