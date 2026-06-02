import { useEffect, useId, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createAdminBlogPost,
  getAdminBlogPost,
  updateAdminBlogPost,
  type BlogPostStatus,
  type BlockType,
  type SaveBlogPostRequest,
} from '../api/admin';
import { extractApiErrorMessage } from '../api/types';

// ── helpers ────────────────────────────────────────────────────────────────

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

let _keyCounter = 0;
function newKey() { return `block-${++_keyCounter}`; }

// ── local block types ──────────────────────────────────────────────────────

interface LocalImage {
  _key: string;
  imageUrl: string;
  altText: string;
}

interface LocalBlock {
  _key: string;
  type: BlockType;
  content: string;
  imageUrl: string;
  caption: string;
  images: LocalImage[];
}

function emptyBlock(type: BlockType): LocalBlock {
  return { _key: newKey(), type, content: '', imageUrl: '', caption: '', images: [] };
}

function emptyImage(): LocalImage {
  return { _key: newKey(), imageUrl: '', altText: '' };
}

// ── block type config ──────────────────────────────────────────────────────

const BLOCK_CONFIG: Record<BlockType, { label: string; icon: string; color: string }> = {
  PARAGRAPH: { label: 'Đoạn văn',   icon: 'notes',        color: 'bg-slate-100 text-slate-600' },
  HEADING:   { label: 'Tiêu đề',    icon: 'title',        color: 'bg-blue-100 text-blue-700'   },
  QUOTE:     { label: 'Trích dẫn',  icon: 'format_quote', color: 'bg-amber-100 text-amber-700' },
  IMAGE:     { label: 'Hình ảnh',   icon: 'image',        color: 'bg-emerald-100 text-emerald-700' },
  GALLERY:   { label: 'Bộ ảnh',     icon: 'collections',  color: 'bg-purple-100 text-purple-700' },
};

const STATUS_OPTIONS: { value: BlogPostStatus; label: string; icon: string }[] = [
  { value: 'DRAFT',     label: 'Bản nháp',     icon: 'draft'    },
  { value: 'PUBLISHED', label: 'Xuất bản ngay', icon: 'publish'  },
  { value: 'SCHEDULED', label: 'Lên lịch',      icon: 'schedule' },
];

// ── meta form ─────────────────────────────────────────────────────────────

interface Meta {
  title:         string;
  slug:          string;
  coverImageUrl: string;
  excerpt:       string;
  status:        BlogPostStatus;
  scheduledAt:   string;
}

const INITIAL_META: Meta = {
  title: '', slug: '', coverImageUrl: '', excerpt: '', status: 'DRAFT', scheduledAt: '',
};

// ── sub-components ────────────────────────────────────────────────────────

function BlockBadge({ type }: { type: BlockType }) {
  const c = BLOCK_CONFIG[type];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${c.color}`}>
      <span className="material-symbols-outlined text-[12px]">{c.icon}</span>
      {c.label}
    </span>
  );
}

function BlockControls({
  onUp, onDown, onDelete, isFirst, isLast,
}: {
  onUp: () => void; onDown: () => void; onDelete: () => void; isFirst: boolean; isLast: boolean;
}) {
  return (
    <div className="flex items-center gap-0.5 flex-shrink-0">
      <button type="button" onClick={onUp} disabled={isFirst}
        className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 disabled:opacity-30 transition-colors">
        <span className="material-symbols-outlined text-base">arrow_upward</span>
      </button>
      <button type="button" onClick={onDown} disabled={isLast}
        className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 disabled:opacity-30 transition-colors">
        <span className="material-symbols-outlined text-base">arrow_downward</span>
      </button>
      <button type="button" onClick={onDelete}
        className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors ml-1">
        <span className="material-symbols-outlined text-base">delete</span>
      </button>
    </div>
  );
}

// ── block editors ─────────────────────────────────────────────────────────

function ParagraphEditor({ block, onChange }: { block: LocalBlock; onChange: (b: LocalBlock) => void }) {
  return (
    <textarea
      value={block.content}
      onChange={e => onChange({ ...block, content: e.target.value })}
      rows={5}
      placeholder="Nhập nội dung đoạn văn..."
      className="w-full bg-slate-50 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y transition-all"
    />
  );
}

function HeadingEditor({ block, onChange }: { block: LocalBlock; onChange: (b: LocalBlock) => void }) {
  return (
    <input
      type="text"
      value={block.content}
      onChange={e => onChange({ ...block, content: e.target.value })}
      placeholder="Nhập tiêu đề..."
      className="w-full bg-slate-50 rounded-xl py-3 px-4 text-lg font-black focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
    />
  );
}

function QuoteEditor({ block, onChange }: { block: LocalBlock; onChange: (b: LocalBlock) => void }) {
  return (
    <div className="relative">
      <span className="material-symbols-outlined absolute left-3 top-3 text-amber-400 text-2xl select-none">format_quote</span>
      <textarea
        value={block.content}
        onChange={e => onChange({ ...block, content: e.target.value })}
        rows={3}
        placeholder="Nhập nội dung trích dẫn..."
        className="w-full bg-amber-50 border border-amber-200 rounded-xl py-3 pl-10 pr-4 text-sm italic font-medium text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-300 resize-y transition-all"
      />
    </div>
  );
}

function ImageEditor({ block, onChange }: { block: LocalBlock; onChange: (b: LocalBlock) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        value={block.imageUrl}
        onChange={e => onChange({ ...block, imageUrl: e.target.value })}
        placeholder="URL hình ảnh (https://...)"
        className="w-full bg-slate-50 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
      />
      {block.imageUrl && (
        <img
          src={block.imageUrl}
          alt="preview"
          className="rounded-xl h-48 object-cover w-full"
          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      )}
      <input
        type="text"
        value={block.caption}
        onChange={e => onChange({ ...block, caption: e.target.value })}
        placeholder="Chú thích ảnh (tùy chọn)..."
        className="w-full bg-slate-50 rounded-xl py-2.5 px-4 text-sm text-slate-500 italic focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
      />
    </div>
  );
}

function GalleryEditor({ block, onChange }: { block: LocalBlock; onChange: (b: LocalBlock) => void }) {
  function updateImage(idx: number, field: keyof LocalImage, value: string) {
    const imgs = block.images.map((img, i) => i === idx ? { ...img, [field]: value } : img);
    onChange({ ...block, images: imgs });
  }
  function addImage() {
    onChange({ ...block, images: [...block.images, emptyImage()] });
  }
  function removeImage(idx: number) {
    onChange({ ...block, images: block.images.filter((_, i) => i !== idx) });
  }

  return (
    <div className="flex flex-col gap-3">
      {block.images.length === 0 && (
        <p className="text-slate-400 text-sm italic">Chưa có ảnh nào. Thêm ảnh bên dưới.</p>
      )}
      {block.images.map((img, idx) => (
        <div key={img._key} className="flex gap-2 items-start">
          <div className="flex-1 flex flex-col gap-1.5">
            <input
              type="text"
              value={img.imageUrl}
              onChange={e => updateImage(idx, 'imageUrl', e.target.value)}
              placeholder={`URL ảnh ${idx + 1} (https://...)`}
              className="w-full bg-slate-50 rounded-xl py-2.5 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <input
              type="text"
              value={img.altText}
              onChange={e => updateImage(idx, 'altText', e.target.value)}
              placeholder="Mô tả ảnh (alt text)..."
              className="w-full bg-slate-50 rounded-xl py-2 px-4 text-xs text-slate-500 italic focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            {img.imageUrl && (
              <img
                src={img.imageUrl}
                alt={img.altText}
                className="rounded-lg h-24 object-cover w-full"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
          </div>
          <button type="button" onClick={() => removeImage(idx)}
            className="mt-1 p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors flex-shrink-0">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addImage}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-purple-300 text-purple-600 font-bold text-xs hover:bg-purple-50 transition-all self-start"
      >
        <span className="material-symbols-outlined text-sm">add_photo_alternate</span>
        Thêm ảnh
      </button>
    </div>
  );
}

function BlockCard({
  block, index, total, onChange, onUp, onDown, onDelete,
}: {
  block: LocalBlock;
  index: number;
  total: number;
  onChange: (b: LocalBlock) => void;
  onUp: () => void;
  onDown: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/5 bg-slate-50/60">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-slate-300 tracking-widest">#{index + 1}</span>
          <BlockBadge type={block.type} />
        </div>
        <BlockControls
          onUp={onUp} onDown={onDown} onDelete={onDelete}
          isFirst={index === 0} isLast={index === total - 1}
        />
      </div>
      <div className="p-4">
        {block.type === 'PARAGRAPH' && <ParagraphEditor block={block} onChange={onChange} />}
        {block.type === 'HEADING'   && <HeadingEditor   block={block} onChange={onChange} />}
        {block.type === 'QUOTE'     && <QuoteEditor     block={block} onChange={onChange} />}
        {block.type === 'IMAGE'     && <ImageEditor     block={block} onChange={onChange} />}
        {block.type === 'GALLERY'   && <GalleryEditor   block={block} onChange={onChange} />}
      </div>
    </div>
  );
}

// ── add-block toolbar ─────────────────────────────────────────────────────

const ADD_TYPES: BlockType[] = ['PARAGRAPH', 'HEADING', 'QUOTE', 'IMAGE', 'GALLERY'];

function AddBlockBar({ onAdd }: { onAdd: (type: BlockType) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2 px-1">
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Thêm block:</span>
      {ADD_TYPES.map(type => {
        const c = BLOCK_CONFIG[type];
        return (
          <button
            key={type}
            type="button"
            onClick={() => onAdd(type)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-slate-300 text-slate-500 font-bold text-[11px] hover:bg-slate-50 hover:border-slate-400 hover:text-slate-700 transition-all"
          >
            <span className="material-symbols-outlined text-sm">{c.icon}</span>
            {c.label}
          </button>
        );
      })}
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────

export default function BlogEditor() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit   = Boolean(id);
  const _id      = useId();

  const [meta,        setMeta]        = useState<Meta>(INITIAL_META);
  const [blocks,      setBlocks]      = useState<LocalBlock[]>([]);
  const [slugManual,  setSlugManual]  = useState(false);
  const [loading,     setLoading]     = useState(isEdit);
  const [submitting,  setSubmitting]  = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof Meta, string>>>({});

  // ── load for edit ──────────────────────────────────────────────────────

  useEffect(() => {
    if (!isEdit || !id) return;
    let cancelled = false;
    setLoading(true);
    getAdminBlogPost(Number(id))
      .then(post => {
        if (cancelled) return;
        setMeta({
          title:         post.title,
          slug:          post.slug,
          coverImageUrl: post.coverImageUrl ?? '',
          excerpt:       post.excerpt ?? '',
          status:        post.status,
          scheduledAt:   post.scheduledAt
            ? new Date(post.scheduledAt).toISOString().slice(0, 16)
            : '',
        });
        setSlugManual(true);
        if (post.blocks && post.blocks.length > 0) {
          setBlocks(post.blocks.map(b => ({
            _key:     newKey(),
            type:     b.blockType,
            content:  b.content ?? '',
            imageUrl: b.imageUrl ?? '',
            caption:  b.content ?? '',
            images:   (b.images ?? []).map(img => ({
              _key:     newKey(),
              imageUrl: img.imageUrl,
              altText:  img.altText ?? '',
            })),
          })));
        }
      })
      .catch(() => setError('Không thể tải bài viết.'))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id, isEdit]);

  // ── meta helpers ───────────────────────────────────────────────────────

  function setMetaField<K extends keyof Meta>(key: K, value: Meta[K]) {
    setMeta(prev => ({ ...prev, [key]: value }));
    setFieldErrors(prev => ({ ...prev, [key]: undefined }));
  }

  function handleTitleChange(title: string) {
    setMetaField('title', title);
    if (!slugManual) setMetaField('slug', toSlug(title));
  }

  // ── block helpers ──────────────────────────────────────────────────────

  function addBlock(type: BlockType) {
    setBlocks(prev => [...prev, emptyBlock(type)]);
  }

  function updateBlock(key: string, updated: LocalBlock) {
    setBlocks(prev => prev.map(b => b._key === key ? updated : b));
  }

  function moveBlock(index: number, dir: -1 | 1) {
    setBlocks(prev => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function deleteBlock(key: string) {
    setBlocks(prev => prev.filter(b => b._key !== key));
  }

  // ── validation ─────────────────────────────────────────────────────────

  function validate(): boolean {
    const errs: Partial<Record<keyof Meta, string>> = {};
    if (!meta.title.trim()) errs.title = 'Vui lòng nhập tiêu đề.';
    if (!meta.slug.trim())  errs.slug  = 'Vui lòng nhập slug.';
    if (meta.status === 'SCHEDULED' && !meta.scheduledAt) {
      errs.scheduledAt = 'Vui lòng chọn thời gian xuất bản.';
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // ── submit ─────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setError(null);

    const payload: SaveBlogPostRequest = {
      title:         meta.title.trim(),
      slug:          meta.slug.trim() || undefined,
      coverImageUrl: meta.coverImageUrl.trim() || undefined,
      excerpt:       meta.excerpt.trim() || undefined,
      status:        meta.status,
      scheduledAt:   meta.status === 'SCHEDULED' && meta.scheduledAt
        ? new Date(meta.scheduledAt).toISOString()
        : undefined,
      blocks: blocks.map((b, idx) => ({
        blockType: b.type,
        content:   (b.type === 'IMAGE' ? b.caption : b.content) || undefined,
        imageUrl:  b.imageUrl || undefined,
        sortOrder: idx + 1,
        images: b.type === 'GALLERY'
          ? b.images
              .filter(img => img.imageUrl.trim())
              .map((img, i) => ({ imageUrl: img.imageUrl, altText: img.altText || undefined, sortOrder: i + 1 }))
          : undefined,
      })),
    };

    try {
      if (isEdit && id) {
        await updateAdminBlogPost(Number(id), payload);
      } else {
        await createAdminBlogPost(payload);
      }
      navigate('/admin/blogs');
    } catch (err: unknown) {
      setError(extractApiErrorMessage(err, 'Lưu thất bại. Vui lòng thử lại.'));
    } finally {
      setSubmitting(false);
    }
  }

  // ── render ─────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-slate-400 gap-3">
        <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
        <span className="text-sm font-bold">Đang tải bài viết...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 p-6 lg:p-8 overflow-y-auto gap-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 mb-2">
            <span>Quản trị</span>
            <span className="material-symbols-outlined text-[11px]">chevron_right</span>
            <button onClick={() => navigate('/admin/blogs')} className="hover:text-primary transition-colors">Blog</button>
            <span className="material-symbols-outlined text-[11px]">chevron_right</span>
            <span className="text-secondary">{isEdit ? 'Chỉnh sửa' : 'Bài viết mới'}</span>
          </nav>
          <h1 className="text-3xl font-black text-on-surface tracking-tight leading-none">
            {isEdit ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}
          </h1>
        </div>
        <button onClick={() => navigate('/admin/blogs')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-black/10 text-slate-500 font-bold text-xs hover:bg-slate-50 transition-all self-start sm:self-auto">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Quay lại
        </button>
      </header>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 text-red-700 px-4 py-3 text-sm font-semibold">
          {error}
        </div>
      )}

      <form id={_id} onSubmit={e => void handleSubmit(e)} className="flex flex-col lg:flex-row gap-6 items-start">
        {/* ── Left: meta + blocks ── */}
        <div className="flex-1 flex flex-col gap-5 min-w-0">

          {/* Meta card */}
          <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-6 flex flex-col gap-5">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Thông tin bài viết</h2>

            {/* Title */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">
                Tiêu đề <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={meta.title}
                onChange={e => handleTitleChange(e.target.value)}
                placeholder="Nhập tiêu đề bài viết..."
                className={`w-full bg-slate-50 rounded-xl py-3 px-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${fieldErrors.title ? 'ring-2 ring-red-300' : ''}`}
              />
              {fieldErrors.title && <p className="text-red-500 text-xs mt-1 font-semibold">{fieldErrors.title}</p>}
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">
                Slug (URL) <span className="text-red-500">*</span>
              </label>
              <div className="flex rounded-xl overflow-hidden border border-black/5">
                <span className="flex items-center px-3 bg-slate-100 text-xs text-slate-400 font-mono border-r border-black/5 whitespace-nowrap">
                  /journal/
                </span>
                <input
                  type="text"
                  value={meta.slug}
                  onChange={e => { setSlugManual(true); setMetaField('slug', e.target.value); }}
                  placeholder="tieu-de-bai-viet"
                  className={`flex-1 bg-slate-50 py-3 px-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${fieldErrors.slug ? 'ring-2 ring-red-300' : ''}`}
                />
              </div>
              {fieldErrors.slug && <p className="text-red-500 text-xs mt-1 font-semibold">{fieldErrors.slug}</p>}
            </div>

            {/* Cover */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Ảnh bìa (URL)</label>
              <input
                type="text"
                value={meta.coverImageUrl}
                onChange={e => setMetaField('coverImageUrl', e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-50 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              {meta.coverImageUrl && (
                <img src={meta.coverImageUrl} alt="preview"
                  className="mt-3 rounded-xl h-36 object-cover w-full"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              )}
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Tóm tắt</label>
              <textarea
                value={meta.excerpt}
                onChange={e => setMetaField('excerpt', e.target.value)}
                rows={2}
                placeholder="Mô tả ngắn hiển thị trên trang danh sách..."
                className="w-full bg-slate-50 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              />
            </div>
          </div>

          {/* Blocks area */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">
                Nội dung ({blocks.length} block)
              </h2>
              {blocks.length === 0 && (
                <span className="text-xs text-slate-400 italic">Chưa có block nào. Thêm từ bên dưới.</span>
              )}
            </div>

            {blocks.map((block, idx) => (
              <BlockCard
                key={block._key}
                block={block}
                index={idx}
                total={blocks.length}
                onChange={updated => updateBlock(block._key, updated)}
                onUp={() => moveBlock(idx, -1)}
                onDown={() => moveBlock(idx, 1)}
                onDelete={() => deleteBlock(block._key)}
              />
            ))}

            <AddBlockBar onAdd={addBlock} />
          </div>
        </div>

        {/* ── Right: sidebar panel ── */}
        <div className="lg:w-72 flex flex-col gap-5 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-6 flex flex-col gap-5 sticky top-6">

            {/* Status */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                Trạng thái <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col gap-2">
                {STATUS_OPTIONS.map(opt => (
                  <label key={opt.value}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      meta.status === opt.value
                        ? 'border-primary bg-blue-50 text-primary'
                        : 'border-black/5 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}>
                    <input type="radio" name="blog-status" value={opt.value}
                      checked={meta.status === opt.value}
                      onChange={() => setMetaField('status', opt.value)}
                      className="accent-primary" />
                    <span className="material-symbols-outlined text-base">{opt.icon}</span>
                    <span className="font-bold text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Scheduled at */}
            {meta.status === 'SCHEDULED' && (
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">
                  Thời gian xuất bản <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={meta.scheduledAt}
                  onChange={e => setMetaField('scheduledAt', e.target.value)}
                  className={`w-full bg-slate-50 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${fieldErrors.scheduledAt ? 'ring-2 ring-red-300' : ''}`}
                />
                {fieldErrors.scheduledAt && (
                  <p className="text-red-500 text-xs mt-1 font-semibold">{fieldErrors.scheduledAt}</p>
                )}
              </div>
            )}

            {/* Block count summary */}
            {blocks.length > 0 && (
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Cấu trúc bài viết</p>
                <div className="flex flex-col gap-1">
                  {(['HEADING', 'PARAGRAPH', 'QUOTE', 'IMAGE', 'GALLERY'] as BlockType[]).map(type => {
                    const count = blocks.filter(b => b.type === type).length;
                    if (count === 0) return null;
                    const c = BLOCK_CONFIG[type];
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${c.color.replace('bg-', 'text-').split(' ')[0]}`}>
                          <span className="material-symbols-outlined text-[10px]">{c.icon}</span>
                          {c.label}
                        </span>
                        <span className="text-[10px] font-black text-slate-500">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-2 pt-2 border-t border-black/5">
              <button
                type="submit"
                form={_id}
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-secondary text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-secondary/25 hover:shadow-xl hover:shadow-secondary/30 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <><span className="material-symbols-outlined animate-spin text-base">progress_activity</span>Đang lưu...</>
                ) : (
                  <><span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>save</span>
                  {isEdit ? 'Lưu thay đổi' : 'Đăng bài viết'}</>
                )}
              </button>
              <button type="button" onClick={() => navigate('/admin/blogs')} disabled={submitting}
                className="w-full py-3 rounded-xl border border-black/10 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all disabled:opacity-50">
                Hủy
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
