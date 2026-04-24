import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { BRAND_NAME } from '../constants';
import {
  getAdminTour,
  createAdminTour,
  updateAdminTour,
  listAdminDestinations,
  type SaveTourRequest,
} from '../api/admin';
import type { TourDifficulty, TourStatus } from '../api/tours';
import type { Destination } from '../api/destinations';

const DIFFICULTY_LABEL: Record<TourDifficulty, string> = {
  EASY: 'Dễ',
  MEDIUM: 'Trung bình',
  HARD: 'Khó',
};

export default function AddTour() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  /* ── form state ── */
  const [tourTitle,      setTourTitle]      = useState('');
  const [description,    setDescription]    = useState('');
  const [durationDays,   setDurationDays]   = useState(1);
  const [durationNights, setDurationNights] = useState(0);
  const [maxGuests,      setMaxGuests]      = useState(12);
  const [destinationId,  setDestinationId]  = useState<number | ''>('');
  const [difficulty,     setDifficulty]     = useState<TourDifficulty>('EASY');
  const [tourPrice,      setTourPrice]      = useState('');
  const [heroImage,      setHeroImage]      = useState('');
  const [bentoImages,    setBentoImages]    = useState(['', '', '', '']);

  const [itinerary, setItinerary] = useState([
    { id: 1, dayTitle: '', activities: [{ id: 1, time: '08:00', desc: '' }, { id: 2, time: '10:00', desc: '' }], images: [''] },
    { id: 2, dayTitle: '', activities: [{ id: 3, time: '09:00', desc: '' }], images: [] },
  ]);

  const [inclusions, setInclusions] = useState([
    { id: 1, text: '', type: 'included' as 'included' | 'excluded' },
  ]);

  /* ── UI state ── */
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [saving,        setSaving]        = useState(false);
  const [saveError,     setSaveError]     = useState<string | null>(null);
  const [destinations,  setDestinations]  = useState<Destination[]>([]);

  /* ── load destinations for dropdown ── */
  useEffect(() => {
    listAdminDestinations({ size: 200 })
      .then(res => setDestinations(res.content))
      .catch(() => {});
  }, []);

  /* ── load tour data in edit mode ── */
  useEffect(() => {
    if (!isEdit || !id) return;
    getAdminTour(Number(id)).then(tour => {
      setTourTitle(tour.title);
      setDescription(tour.description || '');
      setDurationDays(tour.durationDays);
      setDurationNights(tour.durationNights);
      setMaxGuests(tour.maxGuests);
      setDifficulty(tour.difficulty);
      setTourPrice(String(tour.pricePerPerson));
      setHeroImage(tour.coverImageUrl || '');
      setDestinationId(tour.destination.id);
      const gallery = tour.galleryImages?.slice(0, 4).map(g => g.imageUrl) ?? [];
      setBentoImages([...gallery, ...Array(4).fill('')].slice(0, 4));
      setItinerary(
        tour.itineraryDays.length > 0
          ? tour.itineraryDays.map(day => ({
              id: day.id,
              dayTitle: day.title,
              activities: day.activities.map(act => ({
                id: act.id,
                time: act.activityTime.substring(0, 5),
                desc: act.description,
              })),
              images: [day.coverImageUrl || ''].filter(Boolean),
            }))
          : itinerary,
      );
      if (tour.inclusions.length > 0) {
        setInclusions(tour.inclusions.map(inc => ({
          id: inc.id,
          text: inc.description,
          type: (inc.type === 'INCLUDE' ? 'included' : 'excluded') as 'included' | 'excluded',
        })));
      }
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, id]);

  /* ── submit ── */
  async function handleSubmit(targetStatus: TourStatus) {
    if (!tourTitle.trim()) { setSaveError('Vui lòng nhập tiêu đề tour'); return; }
    if (!destinationId) { setSaveError('Vui lòng chọn điểm đến'); return; }
    if (!tourPrice || Number(tourPrice) <= 0) { setSaveError('Vui lòng nhập giá hợp lệ'); return; }

    setSaving(true);
    setSaveError(null);

    const payload: SaveTourRequest = {
      destinationId: Number(destinationId),
      title: tourTitle.trim(),
      description: description || null,
      durationDays,
      durationNights,
      maxGuests,
      difficulty,
      pricePerPerson: Number(tourPrice),
      coverImageUrl: heroImage || null,
      status: targetStatus,
      galleryImages: bentoImages
        .filter(url => url.trim())
        .map((url, i) => ({ imageUrl: url, sortOrder: i })),
      highlights: [],
      inclusions: inclusions
        .filter(inc => inc.text.trim())
        .map((inc, i) => ({
          type: inc.type === 'included' ? 'INCLUDE' : 'EXCLUDE',
          description: inc.text,
          sortOrder: i,
        })),
      itineraryDays: itinerary.map((day, i) => ({
        dayNumber: i + 1,
        title: day.dayTitle || `Ngày ${i + 1}`,
        summary: null,
        coverImageUrl: day.images[0] || null,
        activities: day.activities
          .filter(act => act.desc.trim())
          .map((act, j) => ({
            activityTime: act.time + ':00',
            title: null,
            description: act.desc,
            sortOrder: j,
          })),
      })),
    };

    try {
      if (isEdit && id) {
        await updateAdminTour(Number(id), payload);
      } else {
        await createAdminTour(payload);
      }
      navigate('/admin/tours');
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setSaveError(msg ?? 'Lưu thất bại, vui lòng thử lại');
    } finally {
      setSaving(false);
    }
  }

  /* ── itinerary helpers ── */
  const updateBentoImage = (index: number, url: string) => {
    const newImages = [...bentoImages];
    newImages[index] = url;
    setBentoImages(newImages);
  };

  const addImageToDay = (index: number) => {
    const newItinerary = [...itinerary];
    newItinerary[index].images = [...(newItinerary[index].images || []), ''];
    setItinerary(newItinerary);
  };

  const removeImageFromDay = (dayIndex: number, imgIndex: number) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIndex].images = newItinerary[dayIndex].images.filter((_, i) => i !== imgIndex);
    setItinerary(newItinerary);
  };

  const updateImageUrl = (dayIndex: number, imgIndex: number, url: string) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIndex].images[imgIndex] = url;
    setItinerary(newItinerary);
  };

  const addInclusion = (type: 'included' | 'excluded') => {
    setInclusions([...inclusions, { id: Date.now(), text: '', type }]);
  };

  const removeInclusion = (id: number) => {
    setInclusions(inclusions.filter(inc => inc.id !== id));
  };

  const addActivityToDay = (dayIndex: number) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIndex].activities = [...newItinerary[dayIndex].activities, { id: Date.now(), time: '08:00', desc: '' }];
    setItinerary(newItinerary);
  };

  const removeActivityFromDay = (dayIndex: number, actId: number) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIndex].activities = newItinerary[dayIndex].activities.filter(a => a.id !== actId);
    setItinerary(newItinerary);
  };

  const updateActivity = (dayIndex: number, actId: number, field: 'time' | 'desc', value: string) => {
    const newItinerary = [...itinerary];
    const act = newItinerary[dayIndex].activities.find(a => a.id === actId);
    if (act) (act as Record<string, string>)[field] = value;
    setItinerary(newItinerary);
  };

  const addDay = () => {
    const newId = Date.now();
    setItinerary([...itinerary, { id: newId, dayTitle: '', activities: [{ id: newId + 1, time: '08:00', desc: '' }], images: [] }]);
  };

  const removeDay = (id: number) => {
    setItinerary(itinerary.filter(day => day.id !== id));
  };

  const durationDisplay = durationDays > 0 ? `${durationDays} ngày ${durationNights} đêm` : '— Ngày';

  return (
    <div className="flex-1 min-h-screen bg-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-white/90 backdrop-blur-xl border-b border-surface-container-low/50">
        <div className="flex items-center gap-6">
          <Link to="/admin/tours" className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center hover:bg-primary/10 transition-colors group">
            <span className="material-symbols-outlined text-sm text-outline group-hover:text-primary">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-xl font-black tracking-tight text-on-surface">{isEdit ? 'Chỉnh sửa Chuyến thám hiểm' : 'Cấu hình Chuyến thám hiểm'}</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isEdit ? 'Cập nhật hành trình' : 'Sáng tạo hành trình tiếp theo'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {saveError && (
            <span className="text-xs font-bold text-error bg-red-50 px-3 py-1.5 rounded-xl border border-red-100 max-w-xs truncate">
              {saveError}
            </span>
          )}
          <button
            onClick={() => setIsPreviewOpen(!isPreviewOpen)}
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-primary bg-primary/5 hover:bg-primary/10 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">{isPreviewOpen ? 'visibility_off' : 'visibility'}</span>
            {isPreviewOpen ? 'Ẩn Xem trước' : 'Xem trước'}
          </button>
          <div className="w-px h-6 bg-surface-container-low mx-1" />
          <button
            onClick={() => handleSubmit('DRAFT')}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl font-bold text-xs text-on-surface-variant hover:bg-surface-container-high transition-all disabled:opacity-50"
          >
            {saving ? 'Đang lưu…' : 'Lưu nháp'}
          </button>
          <button
            onClick={() => handleSubmit('PUBLISHED')}
            disabled={saving}
            className="px-8 py-2.5 rounded-xl font-bold text-xs text-white signature-gradient shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Đang lưu…' : isEdit ? 'Cập nhật Tour' : 'Xuất bản Tour'}
          </button>
        </div>
      </header>

      <div className="p-8 max-w-[1400px] mx-auto w-full">
        <div className={`grid gap-8 transition-all duration-500 ${isPreviewOpen ? 'grid-cols-1 lg:grid-cols-[1fr_380px]' : 'grid-cols-1 max-w-4xl mx-auto'}`}>

          {/* Main Form Column */}
          <div className="space-y-8">

            {/* Basic Info Section */}
            <section className="p-8 rounded-3xl bg-surface-container-lowest shadow-sm border border-surface-container-low/50">
              <h3 className="text-lg font-black tracking-tight mb-6 flex items-center gap-2 text-on-surface">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Thông tin cơ bản
              </h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">
                    Tiêu đề Chuyến đi <span className="text-error">*</span>
                  </label>
                  <input
                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3.5 text-on-surface font-bold text-base placeholder:text-slate-400 focus:ring-1 focus:ring-primary/20 transition-all outline-none"
                    placeholder="ví dụ: Vịnh Sapphire của Na Uy"
                    type="text"
                    value={tourTitle}
                    onChange={(e) => setTourTitle(e.target.value)}
                  />
                </div>

                {/* Destination + Difficulty */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">
                      Điểm đến <span className="text-error">*</span>
                    </label>
                    <select
                      value={destinationId}
                      onChange={e => setDestinationId(e.target.value ? Number(e.target.value) : '')}
                      className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3.5 text-sm font-bold text-on-surface focus:ring-1 focus:ring-primary/20 outline-none"
                    >
                      <option value="">Chọn điểm đến…</option>
                      {destinations.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">
                      Độ khó <span className="text-error">*</span>
                    </label>
                    <select
                      value={difficulty}
                      onChange={e => setDifficulty(e.target.value as TourDifficulty)}
                      className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3.5 text-sm font-bold text-on-surface focus:ring-1 focus:ring-primary/20 outline-none"
                    >
                      {(Object.keys(DIFFICULTY_LABEL) as TourDifficulty[]).map(d => (
                        <option key={d} value={d}>{DIFFICULTY_LABEL[d]}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Mô tả chi tiết</label>
                  <textarea
                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 text-on-surface leading-normal text-sm placeholder:text-slate-400 focus:ring-1 focus:ring-primary/20 transition-all outline-none min-h-[160px] resize-none font-medium"
                    placeholder="Mô tả linh hồn của hành trình này..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Tour Listing Display Section */}
            <section className="p-8 rounded-3xl bg-surface-container-lowest shadow-sm border border-surface-container-low/50">
              <h3 className="text-lg font-black tracking-tight mb-2 flex items-center gap-2 text-on-surface">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                Hiển thị trên danh sách tour
              </h3>
              <p className="text-xs text-on-surface-variant mb-6 font-medium">Các trường này quyết định cách tour hiển thị trên trang tìm kiếm và trang chủ.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Nhãn nổi bật (badge)</label>
                  <select className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm font-bold text-on-surface focus:ring-1 focus:ring-primary/20 outline-none">
                    <option value="">Không có nhãn</option>
                    <option>Bán chạy nhất</option>
                    <option>Mới</option>
                    <option>Độc quyền</option>
                    <option>Phiêu lưu</option>
                    <option>Khuyến mãi</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">
                    Giá từ (VND) <span className="text-error">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="VD: 24000000"
                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-1 focus:ring-primary/20 outline-none"
                    value={tourPrice}
                    onChange={(e) => setTourPrice(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Số ngày</label>
                  <input
                    type="number"
                    min={1}
                    placeholder="VD: 5"
                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-1 focus:ring-primary/20 outline-none"
                    value={durationDays}
                    onChange={(e) => setDurationDays(Math.max(1, Number(e.target.value)))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Số đêm</label>
                  <input
                    type="number"
                    min={0}
                    placeholder="VD: 4"
                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-1 focus:ring-primary/20 outline-none"
                    value={durationNights}
                    onChange={(e) => setDurationNights(Math.max(0, Number(e.target.value)))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Số khách tối đa</label>
                  <input
                    type="number"
                    min={1}
                    placeholder="VD: 12"
                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-1 focus:ring-primary/20 outline-none"
                    value={maxGuests}
                    onChange={(e) => setMaxGuests(Math.max(1, Number(e.target.value)))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Giá gốc (để gạch ngang, nếu có)</label>
                  <input type="number" placeholder="Để trống nếu không có khuyến mãi" className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-1 focus:ring-primary/20 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Nhãn giảm giá (VD: -15%)</label>
                  <input type="text" placeholder="VD: -15%" className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-1 focus:ring-primary/20 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Rating hiển thị</label>
                  <div className="flex gap-2">
                    <input type="number" step="0.1" min="1" max="5" placeholder="4.9" className="flex-1 bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-1 focus:ring-primary/20 outline-none" />
                    <div className="flex items-center gap-1 px-3 bg-surface-container-low rounded-xl text-secondary">
                      {[1,2,3,4,5].map(s => <span key={s} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Tour nổi bật</label>
                  <label className="flex items-center gap-3 bg-surface-container-low px-4 py-3 rounded-xl cursor-pointer hover:bg-surface-container-high transition-colors">
                    <input type="checkbox" className="w-4 h-4 text-primary rounded focus:ring-primary" />
                    <div>
                      <span className="text-sm font-bold text-on-surface">Hiển thị nổi bật ở trang chủ</span>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">Tour sẽ xuất hiện trong section "Tour nổi bật"</p>
                    </div>
                  </label>
                </div>
              </div>
            </section>

            {/* Media Section: Bento Grid Configuration */}
            <section className="p-8 rounded-3xl bg-surface-container-lowest shadow-sm border border-surface-container-low/50">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-black tracking-tight flex items-center gap-2 text-on-surface">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    Gallery hiển thị ở trang chi tiết tour
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1 font-medium">Bố cục bento: 1 ảnh chính lớn bên trái và 4 ảnh phụ bên phải — đây là gallery hiển thị trên trang công khai.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-auto md:h-[400px]">
                {/* Hero Image */}
                <div className="md:col-span-8 relative group rounded-2xl overflow-hidden border-2 border-dashed border-outline-variant/30 hover:border-primary/40 transition-all bg-surface-container-low/50 flex flex-col items-center justify-center">
                  {heroImage ? (
                    <>
                      <img src={heroImage} alt="Hero" className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                        <input
                          className="w-full bg-white/10 backdrop-blur-md border-none rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/50 focus:ring-1 focus:ring-white outline-none"
                          placeholder="Thay đổi URL Ảnh chính..."
                          value={heroImage}
                          onChange={(e) => setHeroImage(e.target.value)}
                        />
                      </div>
                      <button onClick={() => setHeroImage('')} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-6 w-full max-w-sm">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-2xl text-primary">add_photo_alternate</span>
                      </div>
                      <p className="text-sm font-black text-on-surface tracking-tight mb-3">Tải ảnh chính (Hero)</p>
                      <input
                        className="w-full bg-white/80 border-none rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-primary outline-none text-center shadow-sm"
                        placeholder="Dán URL ảnh vào đây..."
                        value={heroImage}
                        onChange={(e) => setHeroImage(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                {/* Grid Images */}
                <div className="md:col-span-4 grid grid-cols-2 lg:grid-cols-2 gap-4 h-full">
                  {bentoImages.map((img, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden border-2 border-dashed border-outline-variant/30 hover:border-primary/40 transition-all bg-surface-container-low/50 flex flex-col items-center justify-center h-48 md:h-auto">
                      {img ? (
                        <>
                          <img src={img} alt={`Grid ${idx+1}`} className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                            <input
                              className="w-full bg-white/10 backdrop-blur-md border-none rounded-md px-2 py-1 text-[10px] text-white placeholder:text-white/50 focus:ring-1 focus:ring-white outline-none"
                              placeholder="Thay URL..."
                              value={img}
                              onChange={(e) => updateBentoImage(idx, e.target.value)}
                            />
                          </div>
                          <button onClick={() => updateBentoImage(idx, '')} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-[10px]">close</span>
                          </button>
                        </>
                      ) : (
                        <div className="text-center p-2 w-full">
                          <span className="material-symbols-outlined text-xl text-slate-400 mb-1">image</span>
                          <p className="text-[10px] font-bold text-slate-500 mb-2">Ảnh {idx+1}</p>
                          <input
                            className="w-full bg-white/80 border-none rounded-md px-2 py-1 text-[9px] focus:ring-1 focus:ring-primary outline-none shadow-sm"
                            placeholder="Dán URL..."
                            value={img}
                            onChange={(e) => updateBentoImage(idx, e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Itinerary Builder */}
            <section className="p-8 rounded-3xl bg-surface-container-lowest shadow-sm border border-surface-container-low/50">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black tracking-tight flex items-center gap-2 text-on-surface">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
                  Lịch trình chi tiết
                </h3>
                <button
                  onClick={addDay}
                  className="flex items-center gap-2 px-6 py-2.5 bg-surface-container-high rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-xs">add</span>
                  Thêm ngày mới
                </button>
              </div>
              <div className="space-y-4">
                {itinerary.map((day, index) => (
                  <div key={day.id} className="p-6 rounded-2xl bg-surface-container-low/40 border-l-4 border-primary group transition-all">
                    <div className="flex gap-6 items-start">
                      <div className="flex flex-col items-center shrink-0">
                        <div className="w-auto px-3 h-10 rounded-xl bg-primary text-white font-black text-xs flex items-center justify-center whitespace-nowrap">
                          Ngày {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 space-y-4">
                        <input
                          className="w-full bg-transparent border-none text-base font-black tracking-tight p-0 focus:ring-0 placeholder:text-slate-300 transition-all outline-none"
                          placeholder="Tóm tắt ngày (VD: Đà Lạt – Khởi hành & Check-in)..."
                          type="text"
                          value={day.dayTitle}
                          onChange={(e) => {
                            const newItinerary = [...itinerary];
                            newItinerary[index].dayTitle = e.target.value;
                            setItinerary(newItinerary);
                          }}
                        />
                        <div className="space-y-2 border-l-2 border-surface-container-high pl-4 ml-2">
                          {day.activities.map((act) => (
                            <div key={act.id} className="flex gap-3 items-center group/act">
                              <input
                                className="bg-surface-container-low border-none rounded-lg px-3 py-1.5 text-xs font-bold w-24 focus:ring-1 focus:ring-primary outline-none font-mono"
                                type="time"
                                value={act.time}
                                onChange={(e) => updateActivity(index, act.id, 'time', e.target.value)}
                              />
                              <input
                                className="flex-1 bg-surface-container-low border-none rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-primary outline-none font-medium"
                                placeholder="Mô tả hoạt động..."
                                type="text"
                                value={act.desc}
                                onChange={(e) => updateActivity(index, act.id, 'desc', e.target.value)}
                              />
                              {day.activities.length > 1 && (
                                <button
                                  onClick={() => removeActivityFromDay(index, act.id)}
                                  className="p-1 text-slate-300 hover:text-error transition-all opacity-0 group-hover/act:opacity-100"
                                >
                                  <span className="material-symbols-outlined text-xs">close</span>
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => addActivityToDay(index)}
                          className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                        >
                          <span className="material-symbols-outlined text-xs">add</span>
                          Thêm hoạt động trong ngày
                        </button>
                        <div className="pt-4 border-t border-surface-container-low/50">
                          <div className="flex justify-between items-center mb-4">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Hình ảnh ngày {index + 1}</label>
                            <button
                              onClick={() => addImageToDay(index)}
                              className="text-[9px] font-black text-primary hover:underline uppercase tracking-widest flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-[10px]">add_photo_alternate</span>
                              Thêm ảnh
                            </button>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {day.images && day.images.map((img, imgIdx) => (
                              <div key={imgIdx} className="space-y-2 group/img relative">
                                <div className="aspect-video rounded-lg overflow-hidden bg-surface-container-high relative">
                                  {img ? (
                                    <img src={img} alt="Activity" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                  ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-[8px] font-bold text-slate-300 uppercase tracking-tighter">
                                      <span className="material-symbols-outlined text-sm mb-1">image</span>
                                      Chưa có ảnh
                                    </div>
                                  )}
                                  <button
                                    onClick={() => removeImageFromDay(index, imgIdx)}
                                    className="absolute top-1 right-1 w-6 h-6 bg-error/90 text-white rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all scale-75 group-hover/img:scale-100"
                                  >
                                    <span className="material-symbols-outlined text-xs">close</span>
                                  </button>
                                </div>
                                <input
                                  className="w-full bg-white/50 border-none rounded-lg px-2 py-1.5 text-[10px] focus:ring-1 focus:ring-primary outline-none font-medium"
                                  placeholder="Dán URL ảnh vào đây..."
                                  value={img}
                                  onChange={(e) => updateImageUrl(index, imgIdx, e.target.value)}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeDay(day.id)}
                        className="p-1.5 text-slate-300 hover:text-error transition-all opacity-0 group-hover:opacity-100"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Inclusions & Exclusions */}
            <section className="p-8 rounded-3xl bg-surface-container-lowest shadow-sm border border-surface-container-low/50">
              <h3 className="text-lg font-black tracking-tight mb-6 flex items-center gap-2 text-on-surface">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Bao gồm & Không bao gồm
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-xs text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">check_circle</span>
                      Bao gồm
                    </h4>
                    <button onClick={() => addInclusion('included')} className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Thêm dòng</button>
                  </div>
                  <div className="space-y-2">
                    {inclusions.filter(inc => inc.type === 'included').map((inc) => (
                      <div key={inc.id} className="flex gap-2 group">
                        <input
                          className="flex-1 bg-surface-container-low border-none rounded-xl px-4 py-2.5 text-xs font-medium focus:ring-1 focus:ring-emerald-500/20 outline-none"
                          placeholder="VD: Phòng nghỉ sang trọng..."
                          value={inc.text}
                          onChange={(e) => {
                            const newInclusions = [...inclusions];
                            const target = newInclusions.find(i => i.id === inc.id);
                            if (target) target.text = e.target.value;
                            setInclusions(newInclusions);
                          }}
                        />
                        <button onClick={() => removeInclusion(inc.id)} className="p-1.5 text-slate-300 hover:text-error transition-all opacity-0 group-hover:opacity-100">
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-xs text-red-600 uppercase tracking-widest flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">cancel</span>
                      Không bao gồm
                    </h4>
                    <button onClick={() => addInclusion('excluded')} className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Thêm dòng</button>
                  </div>
                  <div className="space-y-2">
                    {inclusions.filter(inc => inc.type === 'excluded').map((inc) => (
                      <div key={inc.id} className="flex gap-2 group">
                        <input
                          className="flex-1 bg-surface-container-low border-none rounded-xl px-4 py-2.5 text-xs font-medium focus:ring-1 focus:ring-red-500/20 outline-none"
                          placeholder="VD: Đồ uống tự gọi..."
                          value={inc.text}
                          onChange={(e) => {
                            const newInclusions = [...inclusions];
                            const target = newInclusions.find(i => i.id === inc.id);
                            if (target) target.text = e.target.value;
                            setInclusions(newInclusions);
                          }}
                        />
                        <button onClick={() => removeInclusion(inc.id)} className="p-1.5 text-slate-300 hover:text-error transition-all opacity-0 group-hover:opacity-100">
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Reviews Management Table */}
            <section className="p-8 rounded-3xl bg-surface-container-lowest shadow-sm border border-surface-container-low/50">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black tracking-tight flex items-center gap-2 text-on-surface">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  Góc đánh giá
                </h3>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-low rounded-lg text-[10px] font-bold">
                  <span className="material-symbols-outlined text-xs text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  4.9 (128)
                </div>
              </div>
              <div className="overflow-x-auto rounded-xl border border-surface-container-low">
                <table className="w-full text-left">
                  <thead className="bg-surface-container-low font-black text-[10px] uppercase tracking-widest text-slate-500">
                    <tr>
                      <th className="px-5 py-3">Khách hàng</th>
                      <th className="px-5 py-3">Đánh giá</th>
                      <th className="px-5 py-3">Nội dung</th>
                      <th className="px-5 py-3">Trạng thái</th>
                      <th className="px-5 py-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-low text-xs">
                    {[
                      { name: 'Lê Minh Anh',   rating: 5, comment: 'Trải nghiệm tuyệt vời, HDV rất nhiệt tình!',    status: 'approved' },
                      { name: 'David Wilson',   rating: 4, comment: 'Magical bay, stunning views and great food.',   status: 'pending'  },
                      { name: 'Nguyễn Hà Linh', rating: 5, comment: 'Chuyến đi đáng nhớ nhất trong năm.',           status: 'hidden'   },
                    ].map((review, i) => (
                      <tr key={i} className="hover:bg-surface-container-low/20 transition-colors">
                        <td className="px-5 py-4 font-bold">{review.name}</td>
                        <td className="px-5 py-4">
                          <div className="flex text-secondary gap-0.5">
                            {[...Array(5)].map((_, j) => (
                              <span key={j} className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: j < review.rating ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-on-surface-variant max-w-[150px] truncate">{review.comment}</td>
                        <td className="px-5 py-4">
                          {review.status === 'approved' && <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">Đã hiển thị</span>}
                          {review.status === 'pending'  && <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-widest">Đang chờ</span>}
                          {review.status === 'hidden'   && <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest">Đã ẩn</span>}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            {review.status !== 'approved' && (
                              <button className="p-1.5 text-slate-300 hover:text-emerald-600 transition-all" title="Hiển thị">
                                <span className="material-symbols-outlined text-sm">visibility</span>
                              </button>
                            )}
                            {review.status !== 'hidden' && (
                              <button className="p-1.5 text-slate-300 hover:text-primary transition-all" title="Ẩn">
                                <span className="material-symbols-outlined text-sm">visibility_off</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Secondary Config Column (Preview) */}
          <AnimatePresence>
            {isPreviewOpen && (
              <motion.aside
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="hidden lg:block space-y-6"
              >
                <div className="sticky top-28 space-y-6">
                  <section className="p-8 rounded-3xl bg-surface-container-lowest shadow-sm border border-surface-container-low/50">
                    <h3 className="text-sm font-black tracking-tight mb-4 text-on-surface uppercase tracking-widest">Danh mục</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Phiêu lưu', 'Sang trọng', 'Văn hóa', 'Sức khỏe'].map((cat, i) => (
                        <button
                          key={i}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            cat === 'Phiêu lưu'
                              ? 'bg-primary text-white shadow-lg shadow-primary/10'
                              : 'bg-surface-container-high text-on-surface-variant hover:bg-slate-200'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                    <div className="mt-8 pt-6 border-t border-surface-container-low">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-10 h-5 rounded-full bg-slate-200 relative transition-all group-has-[:checked]:bg-primary">
                          <input checked type="checkbox" className="sr-only peer" />
                          <div className="absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white transition-all peer-checked:left-5.5 shadow-sm" />
                        </div>
                        <span className="text-xs font-bold text-on-surface-variant">Chuyến đi nổi bật</span>
                      </label>
                    </div>
                  </section>

                  <section className="p-6 rounded-[2rem] bg-indigo-900 text-white overflow-hidden relative shadow-2xl shadow-indigo-900/20 group">
                    <div className="absolute -top-6 -right-6 p-4 opacity-5">
                      <span className="material-symbols-outlined text-[100px]" style={{ fontVariationSettings: "'FILL' 1" }}>travel_explore</span>
                    </div>
                    <div className="relative z-10">
                      <p className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-200 mb-4 px-1">Xem trước thẻ Tour</p>
                      <div className="aspect-[16/10] rounded-2xl bg-white/5 mb-4 overflow-hidden backdrop-blur-md border border-white/10">
                        <img src={heroImage || 'https://picsum.photos/seed/santorini/800/600'} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                      </div>
                      <h4 className="text-lg font-black tracking-tight leading-tight mb-3">
                        {tourTitle || <span className="opacity-40 italic font-normal text-sm">Tiêu đề tour sẽ hiện ở đây...</span>}
                      </h4>
                      <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-blue-100/60">
                        <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-xs">schedule</span>{durationDisplay}</span>
                        <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-xs">payments</span>{tourPrice ? Number(tourPrice).toLocaleString('vi-VN') + '₫' : '—'}</span>
                      </div>
                    </div>
                  </section>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
