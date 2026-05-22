import { useState, useEffect, useRef, useCallback } from 'react';
import type { ChangeEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  listAdminTours,
  deleteAdminTour,
  listAdminDestinations,
  getAdminDestinationSummary,
  getAdminDestination,
  createAdminDestination,
  updateAdminDestination,
  deleteAdminDestination,
  uploadMedia,
} from '../api/admin';
import type { DestinationSummary } from '../api/admin';
import ConfirmDialog from '../components/ConfirmDialog';
import type { Destination, SaveDestinationRequest } from '../api/destinations';
import type { TourStatus, TourSummary } from '../api/tours';

const TOUR_STATUS_CFG: Record<TourStatus, { label: string; bg: string; text: string; dot: string }> = {
  PUBLISHED: { label: 'Đang hoạt động', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  DRAFT:     { label: 'Bản nháp',       bg: 'bg-slate-100',  text: 'text-slate-600',   dot: 'bg-slate-400' },
  ARCHIVED:  { label: 'Lưu trữ',        bg: 'bg-red-50',     text: 'text-red-600',     dot: 'bg-red-400' },
};

const PLACEHOLDER_IMG = 'https://placehold.co/400x300/e2e8f0/94a3b8?text=No+Image';

type Tab      = 'tours' | 'destinations';
type ViewMode = 'grid'  | 'list';
type DestinationFeaturedFilter = 'all' | 'featured' | 'normal';

const DESTINATION_SORT_OPTIONS = [
  { value: 'createdAt,desc', label: 'Mới nhất' },
  { value: 'name,asc', label: 'Tên A-Z' },
  { value: 'tourCount,desc', label: 'Nhiều tour' },
  { value: 'featured,desc', label: 'Nổi bật' },
];

const EMPTY_FORM: SaveDestinationRequest = {
  name: '',
  description: null,
  coverImageUrl: null,
  country: 'Việt Nam',
  region: null,
  featured: false,
};

function formatCurrency(value: number) {
  return `${Number(value || 0).toLocaleString('vi-VN')}đ`;
}

export default function ManageToursNew() {
  const location = useLocation();
  const navigate = useNavigate();
  const routeTab: Tab = location.pathname.startsWith('/admin/destinations') ? 'destinations' : 'tours';
  const [tab,  setTab]  = useState<Tab>(routeTab);
  const [view, setView] = useState<ViewMode>('grid');

  /* ── tour list state ── */
  const [tours,            setTours]            = useState<TourSummary[]>([]);
  const [tourLoading,      setTourLoading]      = useState(false);
  const [tourError,        setTourError]        = useState<string | null>(null);
  const [tourKeyword,      setTourKeyword]      = useState('');
  const [tourStatus,       setTourStatus]       = useState<TourStatus | 'all'>('all');
  const [tourPage,         setTourPage]         = useState(0);
  const [tourTotalPages,   setTourTotalPages]   = useState(0);
  const [tourTotalElements,setTourTotalElements]= useState(0);
  const [tourDeleteTarget, setTourDeleteTarget] = useState<TourSummary | null>(null);
  const [deletingTourId,   setDeletingTourId]   = useState<number | null>(null);

  /* ── destination list state ── */
  const [destinations,       setDestinations]       = useState<Destination[]>([]);
  const [destLoading,        setDestLoading]        = useState(false);
  const [destError,          setDestError]          = useState<string | null>(null);
  const [destKeyword,        setDestKeyword]        = useState('');
  const [destFeaturedFilter, setDestFeaturedFilter] = useState<DestinationFeaturedFilter>('all');
  const [destRegion,         setDestRegion]         = useState('');
  const [destSort,           setDestSort]           = useState('createdAt,desc');
  const [destSummary,        setDestSummary]        = useState<DestinationSummary | null>(null);
  const [destPage,           setDestPage]           = useState(0);
  const [destTotalPages,     setDestTotalPages]     = useState(0);
  const [destTotalElements,  setDestTotalElements]  = useState(0);

  /* ── create/edit modal state ── */
  const [modalOpen,     setModalOpen]     = useState(false);
  const [modalMode,     setModalMode]     = useState<'create' | 'edit'>('create');
  const [editingId,     setEditingId]     = useState<number | null>(null);
  const [form,          setForm]          = useState<SaveDestinationRequest>(EMPTY_FORM);
  const [formSaving,    setFormSaving]    = useState(false);
  const [formError,     setFormError]     = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchTours = useCallback(async (keyword: string, status: TourStatus | 'all', page: number) => {
    setTourLoading(true);
    setTourError(null);
    try {
      const res = await listAdminTours({
        keyword: keyword || undefined,
        status: status === 'all' ? undefined : status,
        page,
        size: 12,
        sort: 'createdAt,desc',
      });
      setTours(res.content);
      setTourTotalPages(res.totalPages);
      setTourTotalElements(res.totalElements);
    } catch {
      setTourError('Không thể tải danh sách tour. Vui lòng thử lại.');
    } finally {
      setTourLoading(false);
    }
  }, []);

  /* ── delete confirm state ── */
  const [deleteTarget, setDeleteTarget] = useState<Destination | null>(null);
  const [deleting,     setDeleting]     = useState(false);
  const [deleteError,  setDeleteError]  = useState<string | null>(null);

  /* ── fetch ── */
  const fetchDestinations = useCallback(async (
    keyword: string,
    page: number,
    featuredFilter: DestinationFeaturedFilter,
    region: string,
    sort: string,
  ) => {
    setDestLoading(true);
    setDestError(null);
    try {
      const [summary, res] = await Promise.all([
        getAdminDestinationSummary(),
        listAdminDestinations({
          keyword: keyword || undefined,
          featured: featuredFilter === 'all' ? undefined : featuredFilter === 'featured',
          region: region || undefined,
          sort,
          page,
          size: 12,
        }),
      ]);
      setDestSummary(summary);
      setDestinations(res.content);
      setDestTotalPages(res.totalPages);
      setDestTotalElements(res.totalElements);
    } catch {
      setDestError('Không thể tải danh sách điểm đến. Vui lòng thử lại.');
    } finally {
      setDestLoading(false);
    }
  }, []);

  useEffect(() => {
    setTab(routeTab);
  }, [routeTab]);

  useEffect(() => {
    if (tab === 'destinations') {
      fetchDestinations(destKeyword, destPage, destFeaturedFilter, destRegion, destSort);
    }
  }, [tab, destKeyword, destPage, destFeaturedFilter, destRegion, destSort, fetchDestinations]);

  useEffect(() => {
    if (tab === 'tours') {
      fetchTours(tourKeyword, tourStatus, tourPage);
    }
  }, [tab, tourKeyword, tourStatus, tourPage, fetchTours]);

  function switchTab(nextTab: Tab) {
    setTab(nextTab);
    navigate(nextTab === 'destinations' ? '/admin/destinations' : '/admin/tours');
  }

  /* ── modal helpers ── */
  function openCreate() {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setModalMode('create');
    setFormError(null);
    setModalOpen(true);
  }

  async function openEdit(dest: Destination) {
    setModalMode('edit');
    setEditingId(dest.id);
    setFormError(null);
    setModalOpen(true);
    try {
      const latest = await getAdminDestination(dest.id);
      setForm({
        name: latest.name,
        description: latest.description,
        coverImageUrl: latest.coverImageUrl,
        country: latest.country ?? 'Việt Nam',
        region: latest.region,
        featured: latest.featured,
      });
    } catch {
      setForm({
        name: dest.name,
        description: dest.description,
        coverImageUrl: dest.coverImageUrl,
        country: dest.country ?? 'Việt Nam',
        region: dest.region,
        featured: dest.featured,
      });
    }
  }

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    setFormError(null);
    try {
      const asset = await uploadMedia(file, form.name || 'destination');
      setForm(f => ({ ...f, coverImageUrl: asset.url }));
    } catch {
      setFormError('Upload ảnh thất bại. Vui lòng thử lại.');
    } finally {
      setImageUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleSubmit() {
    if (!form.name.trim()) { setFormError('Tên điểm đến không được để trống'); return; }
    if (form.name.length > 255) { setFormError('Tên điểm đến tối đa 255 ký tự'); return; }
    setFormSaving(true);
    setFormError(null);
    try {
      if (modalMode === 'create') {
        const created = await createAdminDestination(form);
        setDestinations(prev => [created, ...prev]);
        setDestTotalElements(n => n + 1);
        setDestSummary(prev => prev ? {
          ...prev,
          totalDestinations: prev.totalDestinations + 1,
          featuredDestinations: prev.featuredDestinations + (created.featured ? 1 : 0),
          emptyDestinations: prev.emptyDestinations + 1,
        } : prev);
      } else if (editingId != null) {
        const updated = await updateAdminDestination(editingId, form);
        setDestinations(prev => prev.map(d => d.id === editingId ? updated : d));
        fetchDestinations(destKeyword, destPage, destFeaturedFilter, destRegion, destSort);
      }
      setModalOpen(false);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setFormError(msg ?? 'Lưu thất bại, vui lòng thử lại');
    } finally {
      setFormSaving(false);
    }
  }

  function confirmDelete(dest: Destination) {
    setDeleteTarget(dest);
    setDeleteError(null);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    if (deleteTarget.tourCount > 0) {
      setDeleteError(`Không thể xóa điểm đến đang có ${deleteTarget.tourCount} tour`);
      return;
    }
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteAdminDestination(deleteTarget.id);
      setDestinations(prev => prev.filter(d => d.id !== deleteTarget.id));
      setDestTotalElements(n => Math.max(0, n - 1));
      setDestSummary(prev => prev ? {
        ...prev,
        totalDestinations: Math.max(0, prev.totalDestinations - 1),
        featuredDestinations: Math.max(0, prev.featuredDestinations - (deleteTarget.featured ? 1 : 0)),
        destinationsWithTours: deleteTarget.tourCount > 0 ? Math.max(0, prev.destinationsWithTours - 1) : prev.destinationsWithTours,
        emptyDestinations: deleteTarget.tourCount === 0 ? Math.max(0, prev.emptyDestinations - 1) : prev.emptyDestinations,
      } : prev);
      setDeleteTarget(null);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setDeleteError(msg ?? 'Xóa thất bại, vui lòng thử lại');
    } finally {
      setDeleting(false);
    }
  }

  async function handleDeleteTour() {
    if (!tourDeleteTarget) return;
    setDeletingTourId(tourDeleteTarget.id);
    try {
      await deleteAdminTour(tourDeleteTarget.id);
      await fetchTours(tourKeyword, tourStatus, tourPage);
      setTourDeleteTarget(null);
    } catch {
      setTourError('Xóa tour thất bại. Tour có đặt chỗ sẽ được lưu trữ thay vì xóa.');
    } finally {
      setDeletingTourId(null);
    }
  }

  const activeDestinationRate = destSummary && destSummary.totalDestinations > 0
    ? Math.round((destSummary.destinationsWithTours / destSummary.totalDestinations) * 1000) / 10
    : 0;
  const publishedTours = tours.filter(t => t.status === 'PUBLISHED').length;

  return (
    <div className="flex flex-col flex-1 p-6 lg:p-8 overflow-y-auto gap-6">
      <ConfirmDialog
        open={Boolean(tourDeleteTarget)}
        title="Xóa hoặc lưu trữ tour"
        message="Backend sẽ tự quyết định xóa hẳn hay lưu trữ tour nếu dữ liệu đã phát sinh booking."
        confirmLabel="Tiếp tục"
        cancelLabel="Hủy"
        tone="danger"
        pending={tourDeleteTarget != null && deletingTourId === tourDeleteTarget.id}
        onCancel={() => {
          if (deletingTourId == null) setTourDeleteTarget(null);
        }}
        onConfirm={() => void handleDeleteTour()}
        detail={tourDeleteTarget ? (
          <div>
            <p className="font-semibold text-on-surface">{tourDeleteTarget.title}</p>
            <p className="text-xs mt-1">Điểm đến: {tourDeleteTarget.destinationName}</p>
          </div>
        ) : undefined}
      />

      {/* ── Delete Confirm Modal ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
              </div>
              <div>
                <h3 className="font-black text-on-surface">Xóa điểm đến</h3>
                <p className="text-xs text-slate-500">Hành động này không thể hoàn tác</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Bạn có chắc muốn xóa <strong>{deleteTarget.name}</strong>?
            </p>
            {deleteTarget.tourCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-amber-50 border border-amber-100 mb-4">
                <span className="material-symbols-outlined text-amber-500 text-sm shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
                <p className="text-xs font-bold text-amber-700">
                  Điểm đến này đang có {deleteTarget.tourCount} tour — không thể xóa.
                </p>
              </div>
            )}
            {deleteError && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-100 mb-4">
                <span className="material-symbols-outlined text-error text-sm shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
                <p className="text-xs font-bold text-error">{deleteError}</p>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => { setDeleteTarget(null); setDeleteError(null); }}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting || deleteTarget.tourCount > 0}
                className="flex-1 py-2.5 rounded-xl bg-error text-white text-sm font-bold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? 'Đang xóa…' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Create / Edit Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
            {/* header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">
              <h2 className="font-black text-on-surface text-lg">
                {modalMode === 'create' ? 'Thêm Điểm đến mới' : 'Chỉnh sửa Điểm đến'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-all text-slate-400"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            {/* body */}
            <div className="px-6 py-4 flex flex-col gap-4 overflow-y-auto">
              {formError && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-100">
                  <span className="material-symbols-outlined text-error text-sm shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
                  <p className="text-xs font-bold text-error">{formError}</p>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
                  Tên điểm đến <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Vd: Vịnh Hạ Long"
                  maxLength={255}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-on-surface focus:outline-none focus:border-primary/60 transition-colors"
                />
              </div>

              {/* Country & Region */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Quốc gia</label>
                  <input
                    type="text"
                    value={form.country ?? ''}
                    onChange={e => setForm(f => ({ ...f, country: e.target.value || null }))}
                    placeholder="Việt Nam"
                    maxLength={100}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-on-surface focus:outline-none focus:border-primary/60 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Khu vực</label>
                  <input
                    type="text"
                    value={form.region ?? ''}
                    onChange={e => setForm(f => ({ ...f, region: e.target.value || null }))}
                    placeholder="Miền Bắc"
                    maxLength={100}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-on-surface focus:outline-none focus:border-primary/60 transition-colors"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Mô tả</label>
                <textarea
                  value={form.description ?? ''}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value || null }))}
                  placeholder="Mô tả ngắn về điểm đến…"
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-on-surface focus:outline-none focus:border-primary/60 transition-colors resize-none"
                />
              </div>

              {/* Cover image */}
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Ảnh đại diện</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={form.coverImageUrl ?? ''}
                    onChange={e => setForm(f => ({ ...f, coverImageUrl: e.target.value || null }))}
                    placeholder="https://…"
                    maxLength={500}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-on-surface focus:outline-none focus:border-primary/60 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={imageUploading}
                    title="Upload ảnh"
                    className="shrink-0 w-11 flex items-center justify-center rounded-xl border border-gray-200 text-slate-500 hover:border-primary/60 hover:text-primary transition-all disabled:opacity-50"
                  >
                    {imageUploading
                      ? <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                      : <span className="material-symbols-outlined text-sm">upload</span>
                    }
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </div>
                {form.coverImageUrl && (
                  <div className="mt-2 relative w-full aspect-video rounded-xl overflow-hidden border border-gray-100 bg-slate-50">
                    <img
                      src={form.coverImageUrl}
                      alt="preview"
                      className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMG; }}
                    />
                  </div>
                )}
              </div>

              {/* Featured toggle */}
              <div className="flex items-center justify-between px-3.5 py-3 rounded-xl border border-gray-200">
                <div>
                  <p className="text-sm font-bold text-on-surface">Nổi bật</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Hiển thị trong section điểm đến nổi bật ở trang chủ</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, featured: !f.featured }))}
                  className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${form.featured ? 'bg-primary' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.featured ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            {/* footer */}
            <div className="px-6 pb-6 pt-2 flex gap-3 shrink-0 border-t border-gray-100">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                disabled={formSaving || imageUploading}
                className="flex-1 py-2.5 rounded-xl settings-btn-primary text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formSaving ? 'Đang lưu…' : modalMode === 'create' ? 'Tạo điểm đến' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <header className="shrink-0 flex items-end justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2">
            <span>Quản trị</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-secondary">Điểm đến</span>
          </nav>
          <h1 className="text-3xl font-black text-on-surface tracking-tight">
            {tab === 'tours' ? 'Quản lý Tour' : 'Quản lý Điểm đến'}
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            {tab === 'tours'
              ? 'Gói tour có thể đặt, lịch trình, giá và lịch khởi hành.'
              : 'Vùng địa lý, ảnh giới thiệu và thông tin khu vực.'}
          </p>
        </div>
        {tab === 'tours' ? (
          <Link
            to="/admin/tours/new"
            className="shrink-0 settings-btn-primary flex items-center gap-2 px-5 py-2.5"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            Thêm Tour mới
          </Link>
        ) : (
          <button
            onClick={openCreate}
            className="shrink-0 settings-btn-primary flex items-center gap-2 px-5 py-2.5"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            <span className="material-symbols-outlined text-[16px]">add_location_alt</span>
            Thêm Điểm đến
          </button>
        )}
      </header>

      {/* ── Tabs ── */}
      <div className="shrink-0 flex items-center justify-between gap-4">
        <div className="flex gap-1 bg-surface-container-low p-1 rounded-xl w-fit">
          {([
            { key: 'tours' as Tab,        icon: 'travel_explore', label: 'Tour'     },
            { key: 'destinations' as Tab, icon: 'location_on',    label: 'Điểm đến' },
          ] as const).map(t => (
            <button
              key={t.key}
              onClick={() => switchTab(t.key)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                tab === t.key ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-base"
                style={{ fontVariationSettings: tab === t.key ? "'FILL' 1" : "'FILL' 0" }}>
                {t.icon}
              </span>
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex gap-1 bg-surface-container-low p-1 rounded-xl">
          {(['grid', 'list'] as ViewMode[]).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center ${
                view === v ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className="material-symbols-outlined text-sm"
                style={{ fontVariationSettings: view === v ? "'FILL' 1" : "'FILL' 0" }}>
                {v === 'grid' ? 'grid_view' : 'list'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Destinations info banner ── */}
      {tab === 'destinations' && (
        <div className="shrink-0 flex items-start gap-3 px-4 py-3.5 rounded-xl bg-blue-50 border border-blue-100">
          <span className="material-symbols-outlined text-blue-500 text-[18px] mt-0.5 shrink-0"
            style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
          <div>
            <p className="text-sm font-bold text-blue-800">Điểm đến là khu vực địa lý (Vịnh Hạ Long, Sapa…)</p>
            <p className="text-xs text-blue-600 mt-0.5 font-medium">Mỗi điểm đến có thể chứa nhiều gói tour.</p>
          </div>
        </div>
      )}

      {/* ── KPI row ── */}
      <div className="grid grid-cols-3 gap-4 shrink-0">
        <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-2">
          <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">
            {tab === 'tours' ? 'Gói tour hiện có' : 'Điểm đến hiện hữu'}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-primary tracking-tight">
              {tab === 'tours' ? (tourLoading ? '…' : tourTotalElements) : destLoading ? '…' : (destSummary?.totalDestinations ?? destTotalElements)}
            </span>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-2">
          <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">
            {tab === 'tours' ? 'Chuyến đi đã xuất bản' : 'Nổi bật'}
          </p>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-on-surface tracking-tight">
              {tab === 'tours' ? publishedTours : (destSummary?.featuredDestinations ?? 0)}
            </span>
            <span className="material-symbols-outlined text-primary">
              {tab === 'tours' ? 'trending_up' : 'star'}
            </span>
          </div>
        </div>
        <div className="primary-gradient rounded-2xl p-5 flex flex-col gap-2 shadow-[0_4px_20px_rgba(0,78,159,0.18)] relative overflow-hidden">
          <p className="text-[9px] font-black uppercase tracking-[0.15em] text-white/70">
            {tab === 'tours' ? 'Hiệu suất vận hành' : 'Đã gắn tour'}
          </p>
          <span className="text-3xl font-black text-white tracking-tight">
            {tab === 'tours' ? '84.2%' : `${activeDestinationRate}%`}
          </span>
          <div className="absolute -right-2 -bottom-2 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[56px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              monitoring
            </span>
          </div>
        </div>
      </div>

      {/* ── Search (destinations tab only) ── */}
      {tab === 'tours' && (
        <div className="shrink-0 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 px-3.5 py-2.5 w-full max-w-md focus-within:border-primary/60 transition-colors">
            <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
            <input
              type="text"
              value={tourKeyword}
              onChange={e => { setTourKeyword(e.target.value); setTourPage(0); }}
              placeholder="Tìm kiếm tour…"
              className="flex-1 text-sm text-on-surface bg-transparent focus:outline-none placeholder:text-slate-400"
            />
            {tourKeyword && (
              <button onClick={() => { setTourKeyword(''); setTourPage(0); }} className="text-slate-400 hover:text-slate-600 transition-colors">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>
          <select
            value={tourStatus}
            onChange={e => { setTourStatus(e.target.value as TourStatus | 'all'); setTourPage(0); }}
            className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm font-semibold text-slate-600 focus:outline-none focus:border-primary/60"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="PUBLISHED">Đang hoạt động</option>
            <option value="DRAFT">Bản nháp</option>
            <option value="ARCHIVED">Lưu trữ</option>
          </select>
        </div>
      )}

      {tab === 'destinations' && (
        <div className="shrink-0 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 px-3.5 py-2.5 w-full max-w-md focus-within:border-primary/60 transition-colors">
            <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
            <input
              type="text"
              value={destKeyword}
              onChange={e => { setDestKeyword(e.target.value); setDestPage(0); }}
              placeholder="Tìm theo tên, quốc gia, khu vực hoặc slug…"
              className="flex-1 text-sm text-on-surface bg-transparent focus:outline-none placeholder:text-slate-400"
            />
            {destKeyword && (
              <button onClick={() => { setDestKeyword(''); setDestPage(0); }} className="text-slate-400 hover:text-slate-600 transition-colors">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>
          <select
            value={destFeaturedFilter}
            onChange={e => { setDestFeaturedFilter(e.target.value as DestinationFeaturedFilter); setDestPage(0); }}
            className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm font-semibold text-slate-600 focus:outline-none focus:border-primary/60"
          >
            <option value="all">Tất cả</option>
            <option value="featured">Nổi bật</option>
            <option value="normal">Không nổi bật</option>
          </select>
          <input
            value={destRegion}
            onChange={e => { setDestRegion(e.target.value); setDestPage(0); }}
            placeholder="Khu vực"
            className="h-11 w-36 rounded-xl border border-gray-200 bg-white px-3 text-sm font-semibold text-slate-600 focus:outline-none focus:border-primary/60"
          />
          <select
            value={destSort}
            onChange={e => { setDestSort(e.target.value); setDestPage(0); }}
            className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm font-semibold text-slate-600 focus:outline-none focus:border-primary/60"
          >
            {DESTINATION_SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* ── Section title ── */}
      <div className="shrink-0 flex items-center gap-3">
        <h3 className="text-base font-black text-on-surface tracking-tight">
          {tab === 'tours' ? 'Gói Tour đang quản lý' : 'Bộ sưu tập Điểm đến'}
        </h3>
        <div className="h-3.5 w-px bg-slate-200" />
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          {tab === 'tours'
            ? tourLoading ? '…' : `${tourTotalElements} gói`
            : destLoading ? '…' : `${destTotalElements} khu vực`}
        </span>
      </div>

      {tab === 'tours' && tourLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <span className="material-symbols-outlined text-4xl text-primary" style={{ animation: 'spin 1s linear infinite' }}>progress_activity</span>
          <p className="text-sm text-slate-500 font-medium">Đang tải tour…</p>
        </div>
      )}

      {tab === 'tours' && !tourLoading && tourError && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <span className="material-symbols-outlined text-5xl text-error" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
          <p className="text-sm text-slate-600 font-medium">{tourError}</p>
          <button
            onClick={() => fetchTours(tourKeyword, tourStatus, tourPage)}
            className="px-4 py-2 rounded-xl bg-primary/8 text-primary text-sm font-bold hover:bg-primary/15 transition-all"
          >
            Thử lại
          </button>
        </div>
      )}

      {tab === 'tours' && !tourLoading && !tourError && tours.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <span className="material-symbols-outlined text-5xl text-slate-300" style={{ fontVariationSettings: "'FILL' 1" }}>travel_explore</span>
          <p className="text-sm text-slate-500 font-medium">
            {tourKeyword ? `Không tìm thấy tour cho "${tourKeyword}"` : 'Chưa có tour nào'}
          </p>
          {!tourKeyword && (
            <Link to="/admin/tours/new" className="px-4 py-2 rounded-xl settings-btn-primary text-sm font-bold">
              Tạo tour đầu tiên
            </Link>
          )}
        </div>
      )}

      {/* ── Destinations: loading state ── */}
      {tab === 'destinations' && destLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <span className="material-symbols-outlined text-4xl text-primary" style={{ animation: 'spin 1s linear infinite' }}>progress_activity</span>
          <p className="text-sm text-slate-500 font-medium">Đang tải điểm đến…</p>
        </div>
      )}

      {/* ── Destinations: error state ── */}
      {tab === 'destinations' && !destLoading && destError && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <span className="material-symbols-outlined text-5xl text-error" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
          <p className="text-sm text-slate-600 font-medium">{destError}</p>
          <button
            onClick={() => fetchDestinations(destKeyword, destPage, destFeaturedFilter, destRegion, destSort)}
            className="px-4 py-2 rounded-xl bg-primary/8 text-primary text-sm font-bold hover:bg-primary/15 transition-all"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* ── Destinations: empty state ── */}
      {tab === 'destinations' && !destLoading && !destError && destinations.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <span className="material-symbols-outlined text-5xl text-slate-300" style={{ fontVariationSettings: "'FILL' 1" }}>location_off</span>
          <p className="text-sm text-slate-500 font-medium">
            {destKeyword ? `Không tìm thấy kết quả cho "${destKeyword}"` : 'Chưa có điểm đến nào'}
          </p>
          {!destKeyword && (
            <button onClick={openCreate} className="px-4 py-2 rounded-xl settings-btn-primary text-sm font-bold">
              Tạo điểm đến đầu tiên
            </button>
          )}
        </div>
      )}

      {/* ── Content (Tours always, Destinations when loaded) ── */}
      {((tab === 'tours' && !tourLoading && !tourError && tours.length > 0) || (!destLoading && !destError && destinations.length > 0)) && (
        <>
          {view === 'grid' ? (
            /* ── Grid view ── */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {tab === 'tours'
                ? tours.map(tour => {
                    const s = TOUR_STATUS_CFG[tour.status];
                    return (
                      <div key={tour.id} className="group bg-white rounded-2xl overflow-hidden border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.04)] hover:border-primary/25 hover:shadow-[0_4px_24px_rgba(0,78,159,0.10)] transition-all">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img alt={tour.title} src={tour.coverImageUrl ?? PLACEHOLDER_IMG}
                            onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMG; }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest backdrop-blur-sm bg-white/90 ${s.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                            {s.label}
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="text-sm font-black text-on-surface mb-0.5 line-clamp-2 leading-snug">{tour.title}</h4>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                            {tour.destinationName} · {tour.durationDays} ngày {tour.durationNights} đêm
                          </p>
                          <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
                            <span className="text-primary font-black text-sm">
                              {formatCurrency(tour.pricePerPerson)}<span className="text-[9px] text-slate-400 font-bold">/khách</span>
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px]">confirmation_number</span>
                              {tour.bookingCount}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Link to={`/admin/tours/edit/${tour.id}`}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-bold bg-surface-container-low hover:bg-primary/8 hover:text-primary text-slate-600 transition-all">
                              <span className="material-symbols-outlined text-xs">edit_note</span>Sửa
                            </Link>
                            <button
                              onClick={() => setTourDeleteTarget(tour)}
                              className="w-9 flex items-center justify-center rounded-xl bg-red-50 hover:bg-error text-error hover:text-white transition-all"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                : destinations.map(dest => (
                    <div key={dest.id} className="group bg-white rounded-2xl overflow-hidden border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.04)] hover:border-primary/25 hover:shadow-[0_4px_24px_rgba(0,78,159,0.10)] transition-all">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          alt={dest.name}
                          src={dest.coverImageUrl ?? PLACEHOLDER_IMG}
                          onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMG; }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {dest.region && (
                          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[9px] font-black text-primary bg-white/90 backdrop-blur-sm uppercase tracking-widest">
                            {dest.region}
                          </div>
                        )}
                        {dest.featured && (
                          <div className="absolute top-3 right-3 px-2 py-1 rounded-lg text-[9px] font-black text-amber-700 bg-amber-50/90 backdrop-blur-sm flex items-center gap-1">
                            <span className="material-symbols-outlined text-[10px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            Nổi bật
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="text-sm font-black text-on-surface line-clamp-1">{dest.name}</h4>
                          <div className="shrink-0 text-right ml-2">
                            <span className="text-lg font-black text-primary leading-none">{dest.tourCount}</span>
                            <span className="block text-[8px] font-black text-slate-400 uppercase tracking-tight">Tours</span>
                          </div>
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3 pb-3 border-b border-gray-100">
                          {[dest.country, dest.region].filter(Boolean).join(' · ') || 'Chưa có khu vực'}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEdit(dest)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-bold bg-surface-container-low hover:bg-primary/8 hover:text-primary text-slate-600 transition-all"
                          >
                            <span className="material-symbols-outlined text-xs">edit_note</span>Sửa
                          </button>
                          <button
                            onClick={() => confirmDelete(dest)}
                            className="w-9 flex items-center justify-center rounded-xl bg-red-50 hover:bg-error text-error hover:text-white transition-all"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
              }

              {/* Add new card */}
              {tab === 'destinations' ? (
                <button
                  onClick={openCreate}
                  className="group border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 hover:border-primary/40 hover:bg-primary/[0.02] transition-all min-h-[260px]"
                >
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white text-slate-400 transition-all">
                    <span className="material-symbols-outlined">add</span>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors text-center">
                    Tạo khu vực mới
                  </p>
                </button>
              ) : (
                <Link to="/admin/tours/new"
                  className="group border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 hover:border-primary/40 hover:bg-primary/[0.02] transition-all min-h-[260px]"
                >
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white text-slate-400 transition-all">
                    <span className="material-symbols-outlined">add</span>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors text-center">
                    Thêm gói tour mới
                  </p>
                </Link>
              )}
            </div>
          ) : (
            /* ── List view ── */
            <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] overflow-hidden">
              {/* Table head */}
              <div className="grid grid-cols-12 px-6 py-3 bg-slate-50/70 border-b border-gray-100">
                {tab === 'tours' ? (
                  <>
                    <span className="col-span-5 text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">Tên Tour</span>
                    <span className="col-span-2 text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">Giá / khách</span>
                    <span className="col-span-2 text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">Trạng thái</span>
                    <span className="col-span-1 text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">Bookings</span>
                    <span className="col-span-2" />
                  </>
                ) : (
                  <>
                    <span className="col-span-4 text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">Điểm đến</span>
                    <span className="col-span-2 text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">Khu vực</span>
                    <span className="col-span-2 text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">Số tour</span>
                    <span className="col-span-2 text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">Nổi bật</span>
                    <span className="col-span-2" />
                  </>
                )}
              </div>

              {tab === 'tours'
                ? tours.map(tour => {
                    const s = TOUR_STATUS_CFG[tour.status];
                    return (
                      <div key={tour.id} className="grid grid-cols-12 px-6 py-3.5 items-center border-b border-gray-50 hover:bg-slate-50/50 transition-colors last:border-b-0">
                        <div className="col-span-5 flex items-center gap-3">
                          <img
                            src={tour.coverImageUrl ?? PLACEHOLDER_IMG}
                            alt={tour.title}
                            onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMG; }}
                            className="w-10 h-10 rounded-xl object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-800 truncate">{tour.title}</p>
                            <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-widest">{tour.destinationName} · {tour.durationDays} ngày {tour.durationNights} đêm</p>
                          </div>
                        </div>
                        <span className="col-span-2 text-sm font-black text-primary">{formatCurrency(tour.pricePerPerson)}</span>
                        <div className="col-span-2">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${s.bg} ${s.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                            {s.label}
                          </span>
                        </div>
                        <span className="col-span-1 text-sm font-black text-on-surface text-center">{tour.bookingCount}</span>
                        <div className="col-span-2 flex justify-end gap-1.5">
                          <Link to={`/admin/tours/edit/${tour.id}`}
                            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/8 rounded-lg transition-all">
                            <span className="material-symbols-outlined text-sm">edit</span>
                          </Link>
                          <button
                            onClick={() => setTourDeleteTarget(tour)}
                            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-error hover:bg-error/8 rounded-lg transition-all"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                : destinations.map(dest => (
                    <div key={dest.id} className="grid grid-cols-12 px-6 py-3.5 items-center border-b border-gray-50 hover:bg-slate-50/50 transition-colors last:border-b-0">
                      <div className="col-span-4 flex items-center gap-3">
                        <img
                          src={dest.coverImageUrl ?? PLACEHOLDER_IMG}
                          alt={dest.name}
                          onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMG; }}
                          className="w-10 h-10 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-800 truncate">{dest.name}</p>
                          <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-widest">{dest.country ?? 'Việt Nam'}</p>
                        </div>
                      </div>
                      <span className="col-span-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{dest.region ?? '—'}</span>
                      <span className="col-span-2 text-sm font-black text-on-surface text-center">{dest.tourCount}</span>
                      <div className="col-span-2 flex justify-center">
                        {dest.featured ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-black text-amber-700 bg-amber-50 uppercase tracking-widest">
                            <span className="material-symbols-outlined text-[10px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            Nổi bật
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-300 font-bold">—</span>
                        )}
                      </div>
                      <div className="col-span-2 flex justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(dest)}
                          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/8 rounded-lg transition-all"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button
                          onClick={() => confirmDelete(dest)}
                          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-error hover:bg-error/8 rounded-lg transition-all"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </div>
                  ))
              }
            </div>
          )}

          {/* ── Pagination ── */}
          {tab === 'tours' && tourTotalPages > 1 && (
            <div className="shrink-0 flex items-center justify-center gap-2">
              <button
                onClick={() => setTourPage(p => Math.max(0, p - 1))}
                disabled={tourPage === 0}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-slate-400 hover:border-primary/60 hover:text-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <span className="text-sm font-bold text-slate-500 px-3">
                Trang {tourPage + 1} / {tourTotalPages}
              </span>
              <button
                onClick={() => setTourPage(p => Math.min(tourTotalPages - 1, p + 1))}
                disabled={tourPage >= tourTotalPages - 1}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-slate-400 hover:border-primary/60 hover:text-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          )}

          {tab === 'destinations' && destTotalPages > 1 && (
            <div className="shrink-0 flex items-center justify-center gap-2">
              <button
                onClick={() => setDestPage(p => Math.max(0, p - 1))}
                disabled={destPage === 0}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-slate-400 hover:border-primary/60 hover:text-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <span className="text-sm font-bold text-slate-500 px-3">
                Trang {destPage + 1} / {destTotalPages}
              </span>
              <button
                onClick={() => setDestPage(p => Math.min(destTotalPages - 1, p + 1))}
                disabled={destPage >= destTotalPages - 1}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-slate-400 hover:border-primary/60 hover:text-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
