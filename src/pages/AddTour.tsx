import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { BRAND_NAME } from '../constants';
import ConfirmDialog from '../components/ConfirmDialog';
import {
  getAdminTour,
  createAdminTour,
  updateAdminTour,
  listAdminDestinations,
  createAdminDeparture,
  updateAdminDeparture,
  deleteAdminDeparture,
  type SaveTourRequest,
  type TourDeparture,
  type DepartureStatus,
} from '../api/admin';
import type { TourDifficulty, TourStatus } from '../api/tours';
import type { Destination } from '../api/destinations';

const DIFFICULTY_LABEL: Record<TourDifficulty, string> = {
  EASY: 'Dễ',
  MEDIUM: 'Trung bình',
  HARD: 'Khó',
};

const TOUR_STATUS_LABEL: Record<TourStatus, string> = {
  DRAFT: 'Bản nháp',
  PUBLISHED: 'Đang hoạt động',
  ARCHIVED: 'Lưu trữ',
};

const DEPARTURE_STATUS_LABEL: Record<DepartureStatus, string> = {
  OPEN: 'Mở đặt chỗ',
  FULL: 'Hết chỗ',
  CANCELLED: 'Đã hủy',
};

const DEPARTURE_STATUS_CLASS: Record<DepartureStatus, string> = {
  OPEN: 'bg-emerald-100 text-emerald-700',
  FULL: 'bg-amber-100 text-amber-700',
  CANCELLED: 'bg-slate-100 text-slate-500',
};

type NewDep = { departureDate: string; availableSlots: number; priceOverride: string; status: DepartureStatus };
type EditDep = NewDep & { id: number };

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
  const [tourStatus,     setTourStatus]     = useState<TourStatus>('DRAFT');
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

  /* ── departure state (edit mode only) ── */
  const [departures,    setDepartures]    = useState<TourDeparture[]>([]);
  const [newDep,        setNewDep]        = useState<NewDep | null>(null);
  const [editingDep,    setEditingDep]    = useState<EditDep | null>(null);
  const [depSaving,     setDepSaving]     = useState(false);
  const [depError,      setDepError]      = useState<string | null>(null);
  const [deletingDepId, setDeletingDepId] = useState<number | null>(null);
  const [deleteDepTarget, setDeleteDepTarget] = useState<TourDeparture | null>(null);

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
      setTourStatus(tour.status);
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
      setDepartures(tour.departures || []);
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, id]);

  /* ── submit tour ── */
  async function handleSubmit(targetStatus = tourStatus) {
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
        navigate('/admin/tours');
      } else {
        const created = await createAdminTour(payload);
        // Redirect to edit mode so departures can be added right away
        navigate(`/admin/tours/edit/${created.id}`);
      }
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setSaveError(msg ?? 'Lưu thất bại, vui lòng thử lại');
    } finally {
      setSaving(false);
    }
  }

  /* ── departure handlers ── */
  async function handleCreateDeparture() {
    if (!newDep || !id) return;
    if (!newDep.departureDate) { setDepError('Vui lòng chọn ngày khởi hành'); return; }
    if (newDep.availableSlots <= 0) { setDepError('Số chỗ phải lớn hơn 0'); return; }
    setDepSaving(true);
    setDepError(null);
    try {
      const dep = await createAdminDeparture(Number(id), {
        departureDate: newDep.departureDate,
        availableSlots: newDep.availableSlots,
        priceOverride: newDep.priceOverride ? Number(newDep.priceOverride) : null,
        status: newDep.status,
      });
      setDepartures(prev => [...prev, dep]);
      setNewDep(null);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setDepError(msg ?? 'Thêm lịch thất bại');
    } finally {
      setDepSaving(false);
    }
  }

  async function handleUpdateDeparture() {
    if (!editingDep || !id) return;
    setDepSaving(true);
    setDepError(null);
    try {
      const dep = await updateAdminDeparture(Number(id), editingDep.id, {
        departureDate: editingDep.departureDate,
        availableSlots: editingDep.availableSlots,
        priceOverride: editingDep.priceOverride ? Number(editingDep.priceOverride) : null,
        status: editingDep.status,
      });
      setDepartures(prev => prev.map(d => d.id === dep.id ? dep : d));
      setEditingDep(null);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setDepError(msg ?? 'Cập nhật lịch thất bại');
    } finally {
      setDepSaving(false);
    }
  }

  async function handleDeleteDeparture() {
    if (!id || !deleteDepTarget) return;
    setDeletingDepId(deleteDepTarget.id);
    setDepError(null);
    try {
      await deleteAdminDeparture(Number(id), deleteDepTarget.id);
      setDepartures(prev => prev.filter(d => d.id !== deleteDepTarget.id));
      setDeleteDepTarget(null);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setDepError(msg ?? 'Xóa lịch thất bại');
    } finally {
      setDeletingDepId(null);
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
    <>
      <ConfirmDialog
        open={Boolean(deleteDepTarget)}
        title="Xóa lịch khởi hành"
        message="Lịch khởi hành này sẽ bị gỡ khỏi tour. Hãy kiểm tra trước khi xóa nếu đã có booking liên quan."
        confirmLabel="Xóa lịch"
        cancelLabel="Hủy"
        tone="danger"
        pending={deleteDepTarget != null && deletingDepId === deleteDepTarget.id}
        onCancel={() => {
          if (deletingDepId == null) setDeleteDepTarget(null);
        }}
        onConfirm={() => void handleDeleteDeparture()}
        detail={deleteDepTarget ? (
          <div>
            <p className="font-semibold text-on-surface">
              {new Date(deleteDepTarget.departureDate).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
            <p className="text-xs mt-1">Đã đặt: {deleteDepTarget.bookedSlots} / {deleteDepTarget.availableSlots} chỗ</p>
          </div>
        ) : undefined}
      />

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
          {!isEdit && (
            <p className="text-[10px] font-bold text-slate-400 hidden lg:block">
              Sau khi lưu, bạn có thể thêm lịch khởi hành
            </p>
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
            onClick={() => handleSubmit(tourStatus)}
            disabled={saving}
            className="px-8 py-2.5 rounded-xl font-bold text-xs text-white signature-gradient shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Đang lưu…' : isEdit ? 'Lưu thay đổi' : 'Lưu Tour'}
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

                {/* Destination + Difficulty + Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">
                      Trạng thái <span className="text-error">*</span>
                    </label>
                    <select
                      value={tourStatus}
                      onChange={e => setTourStatus(e.target.value as TourStatus)}
                      className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3.5 text-sm font-bold text-on-surface focus:ring-1 focus:ring-primary/20 outline-none"
                    >
                      {(Object.keys(TOUR_STATUS_LABEL) as TourStatus[]).map(status => (
                        <option key={status} value={status}>{TOUR_STATUS_LABEL[status]}</option>
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

            {/* Pricing & Capacity */}
            <section className="p-8 rounded-3xl bg-surface-container-lowest shadow-sm border border-surface-container-low/50">
              <h3 className="text-lg font-black tracking-tight mb-2 flex items-center gap-2 text-on-surface">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                Giá & Thông số
              </h3>
              <p className="text-xs text-on-surface-variant mb-6 font-medium">Các thông số cơ bản hiển thị trên trang tìm kiếm và trang chi tiết tour.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* Departure Management (edit mode only) */}
            {isEdit && (
              <section className="p-8 rounded-3xl bg-surface-container-lowest shadow-sm border border-surface-container-low/50">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-black tracking-tight flex items-center gap-2 text-on-surface">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Lịch khởi hành
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-1 font-medium">
                      Quản lý các ngày khởi hành, số chỗ và giá cho từng lịch.
                    </p>
                  </div>
                  {!newDep && (
                    <button
                      onClick={() => { setNewDep({ departureDate: '', availableSlots: 12, priceOverride: '', status: 'OPEN' }); setDepError(null); }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all active:scale-95"
                    >
                      <span className="material-symbols-outlined text-xs">add</span>
                      Thêm lịch
                    </button>
                  )}
                </div>

                {depError && (
                  <div className="mb-4 px-4 py-2.5 rounded-xl bg-red-50 border border-red-100 text-sm font-bold text-error">
                    {depError}
                  </div>
                )}

                {/* New departure form */}
                {newDep && (
                  <div className="mb-6 p-5 rounded-2xl bg-surface-container-low/40 border border-primary/20">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Lịch mới</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ngày khởi hành *</label>
                        <input
                          type="date"
                          value={newDep.departureDate}
                          onChange={e => setNewDep({ ...newDep, departureDate: e.target.value })}
                          className="w-full bg-white border-none rounded-xl px-3 py-2.5 text-sm font-medium focus:ring-1 focus:ring-primary/20 outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Số chỗ trống *</label>
                        <input
                          type="number"
                          min={1}
                          value={newDep.availableSlots}
                          onChange={e => setNewDep({ ...newDep, availableSlots: Math.max(1, Number(e.target.value)) })}
                          className="w-full bg-white border-none rounded-xl px-3 py-2.5 text-sm font-medium focus:ring-1 focus:ring-primary/20 outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Giá riêng (VND)</label>
                        <input
                          type="number"
                          min={0}
                          placeholder="Để trống = giá tour"
                          value={newDep.priceOverride}
                          onChange={e => setNewDep({ ...newDep, priceOverride: e.target.value })}
                          className="w-full bg-white border-none rounded-xl px-3 py-2.5 text-sm font-medium focus:ring-1 focus:ring-primary/20 outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</label>
                        <select
                          value={newDep.status}
                          onChange={e => setNewDep({ ...newDep, status: e.target.value as DepartureStatus })}
                          className="w-full bg-white border-none rounded-xl px-3 py-2.5 text-sm font-bold focus:ring-1 focus:ring-primary/20 outline-none"
                        >
                          {(Object.keys(DEPARTURE_STATUS_LABEL) as DepartureStatus[]).map(s => (
                            <option key={s} value={s}>{DEPARTURE_STATUS_LABEL[s]}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={handleCreateDeparture}
                        disabled={depSaving}
                        className="px-5 py-2 bg-primary text-white rounded-xl text-xs font-black hover:bg-primary/90 transition-all disabled:opacity-50"
                      >
                        {depSaving ? 'Đang lưu...' : 'Lưu lịch'}
                      </button>
                      <button
                        onClick={() => { setNewDep(null); setDepError(null); }}
                        className="px-5 py-2 text-xs font-black text-on-surface-variant hover:bg-surface-container-high rounded-xl transition-all"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                )}

                {departures.length === 0 && !newDep ? (
                  <div className="text-center py-12 text-slate-400">
                    <span className="material-symbols-outlined text-3xl mb-2 block">event_upcoming</span>
                    <p className="text-sm font-bold">Chưa có lịch khởi hành nào.</p>
                    <p className="text-xs font-medium mt-1">Thêm ít nhất một lịch để khách có thể đặt chỗ.</p>
                  </div>
                ) : departures.length > 0 && (
                  <div className="rounded-xl border border-surface-container-low overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-surface-container-low">
                        <tr>
                          <th className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Ngày khởi hành</th>
                          <th className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Chỗ trống</th>
                          <th className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Đã đặt</th>
                          <th className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Giá riêng</th>
                          <th className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Trạng thái</th>
                          <th className="px-5 py-3" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-container-low text-xs">
                        {departures.map(dep => (
                          editingDep?.id === dep.id ? (
                            <tr key={dep.id} className="bg-primary/5">
                              <td className="px-3 py-3">
                                <input
                                  type="date"
                                  value={editingDep.departureDate}
                                  onChange={e => setEditingDep({ ...editingDep, departureDate: e.target.value })}
                                  className="bg-white rounded-lg px-2 py-1.5 text-xs focus:ring-1 focus:ring-primary outline-none w-full"
                                />
                              </td>
                              <td className="px-3 py-3">
                                <input
                                  type="number"
                                  min={1}
                                  value={editingDep.availableSlots}
                                  onChange={e => setEditingDep({ ...editingDep, availableSlots: Math.max(1, Number(e.target.value)) })}
                                  className="bg-white rounded-lg px-2 py-1.5 text-xs focus:ring-1 focus:ring-primary outline-none w-20"
                                />
                              </td>
                              <td className="px-3 py-3 text-slate-500">{dep.bookedSlots}</td>
                              <td className="px-3 py-3">
                                <input
                                  type="number"
                                  min={0}
                                  placeholder="Giá tour"
                                  value={editingDep.priceOverride}
                                  onChange={e => setEditingDep({ ...editingDep, priceOverride: e.target.value })}
                                  className="bg-white rounded-lg px-2 py-1.5 text-xs focus:ring-1 focus:ring-primary outline-none w-28"
                                />
                              </td>
                              <td className="px-3 py-3">
                                <select
                                  value={editingDep.status}
                                  onChange={e => setEditingDep({ ...editingDep, status: e.target.value as DepartureStatus })}
                                  className="bg-white rounded-lg px-2 py-1.5 text-xs focus:ring-1 focus:ring-primary outline-none"
                                >
                                  {(Object.keys(DEPARTURE_STATUS_LABEL) as DepartureStatus[]).map(s => (
                                    <option key={s} value={s}>{DEPARTURE_STATUS_LABEL[s]}</option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-3 py-3 text-right">
                                <div className="flex justify-end gap-1">
                                  <button
                                    onClick={handleUpdateDeparture}
                                    disabled={depSaving}
                                    className="px-3 py-1 bg-primary text-white rounded-lg text-[10px] font-black hover:bg-primary/90 disabled:opacity-50"
                                  >
                                    {depSaving ? '...' : 'Lưu'}
                                  </button>
                                  <button
                                    onClick={() => { setEditingDep(null); setDepError(null); }}
                                    className="px-3 py-1 bg-surface-container-high rounded-lg text-[10px] font-black hover:bg-slate-200"
                                  >
                                    Hủy
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            <tr key={dep.id} className="hover:bg-surface-container-low/20 transition-colors">
                              <td className="px-5 py-4 font-bold">
                                {new Date(dep.departureDate).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </td>
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold">{dep.availableSlots}</span>
                                  <div className="flex-1 h-1.5 bg-surface-container-low rounded-full max-w-[60px]">
                                    <div
                                      className="h-full bg-primary rounded-full"
                                      style={{ width: `${Math.min(100, dep.availableSlots > 0 ? (dep.bookedSlots / dep.availableSlots) * 100 : 0)}%` }}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-4 text-on-surface-variant">{dep.bookedSlots}</td>
                              <td className="px-5 py-4">
                                {dep.priceOverride != null ? (
                                  <span className="font-bold text-primary">{Number(dep.priceOverride).toLocaleString('vi-VN')}₫</span>
                                ) : (
                                  <span className="text-slate-400 italic text-[10px]">Giá tour</span>
                                )}
                              </td>
                              <td className="px-5 py-4">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${DEPARTURE_STATUS_CLASS[dep.status]}`}>
                                  {DEPARTURE_STATUS_LABEL[dep.status]}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-right">
                                <div className="flex justify-end gap-1">
                                  <button
                                    onClick={() => {
                                      setEditingDep({
                                        id: dep.id,
                                        departureDate: dep.departureDate,
                                        availableSlots: dep.availableSlots,
                                        priceOverride: dep.priceOverride != null ? String(dep.priceOverride) : '',
                                        status: dep.status,
                                      });
                                      setDepError(null);
                                    }}
                                    className="p-1.5 text-slate-300 hover:text-primary transition-all"
                                  >
                                    <span className="material-symbols-outlined text-sm">edit</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setDeleteDepTarget(dep);
                                      setDepError(null);
                                    }}
                                    disabled={deletingDepId === dep.id}
                                    className="p-1.5 text-slate-300 hover:text-error transition-all disabled:opacity-40"
                                  >
                                    <span className="material-symbols-outlined text-sm">
                                      {deletingDepId === dep.id ? 'progress_activity' : 'delete'}
                                    </span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}

            {/* Create-mode departure hint */}
            {!isEdit && (
              <div className="px-6 py-4 rounded-2xl bg-primary/5 border border-primary/15 flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-lg mt-0.5">info</span>
                <div>
                  <p className="text-sm font-black text-primary">Lịch khởi hành</p>
                  <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                    Sau khi lưu tour, bạn sẽ được chuyển sang trang chỉnh sửa để thêm lịch khởi hành. Khách không thể đặt chỗ nếu tour chưa có lịch.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Preview Column */}
          <AnimatePresence>
            {isPreviewOpen && (
              <motion.aside
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="hidden lg:block space-y-6"
              >
                <div className="sticky top-28 space-y-6">
                  <section className="p-6 rounded-[2rem] bg-indigo-900 text-white overflow-hidden relative shadow-2xl shadow-indigo-900/20 group">
                    <div className="absolute -top-6 -right-6 p-4 opacity-5">
                      <span className="material-symbols-outlined text-[100px]" style={{ fontVariationSettings: "'FILL' 1" }}>travel_explore</span>
                    </div>
                    <div className="relative z-10">
                      <p className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-200 mb-4 px-1">Xem trước thẻ Tour</p>
                      <div className="aspect-[16/10] rounded-2xl bg-white/5 mb-4 overflow-hidden backdrop-blur-md border border-white/10">
                        <img
                          src={heroImage || 'https://picsum.photos/seed/santorini/800/600'}
                          alt="Preview"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <h4 className="text-lg font-black tracking-tight leading-tight mb-3">
                        {tourTitle || <span className="opacity-40 italic font-normal text-sm">Tiêu đề tour sẽ hiện ở đây...</span>}
                      </h4>
                      <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-blue-100/60">
                        <span className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-xs">schedule</span>
                          {durationDisplay}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-xs">payments</span>
                          {tourPrice ? Number(tourPrice).toLocaleString('vi-VN') + '₫' : '—'}
                        </span>
                      </div>
                    </div>
                  </section>

                  {isEdit && departures.length > 0 && (
                    <section className="p-5 rounded-2xl bg-white border border-black/5 shadow-sm">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                        {departures.length} lịch khởi hành
                      </p>
                      <div className="space-y-2">
                        {departures.slice(0, 4).map(dep => (
                          <div key={dep.id} className="flex items-center justify-between text-xs">
                            <span className="font-bold text-on-surface">
                              {new Date(dep.departureDate).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short' })}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${DEPARTURE_STATUS_CLASS[dep.status]}`}>
                              {DEPARTURE_STATUS_LABEL[dep.status]}
                            </span>
                          </div>
                        ))}
                        {departures.length > 4 && (
                          <p className="text-[10px] text-slate-400 font-medium">+{departures.length - 4} lịch khác</p>
                        )}
                      </div>
                    </section>
                  )}
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </div>
      </div>
    </>
  );
}
