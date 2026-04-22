import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BRAND_NAME } from '../constants';

type BlockType = 'paragraph' | 'heading' | 'quote' | 'image' | 'gallery';
interface ContentBlock {
  id: number;
  type: BlockType;
  content: string;
  caption?: string;
}

const BLOCK_LABELS: Record<BlockType, { label: string; icon: string; color: string }> = {
  paragraph: { label: 'Đoạn văn', icon: 'notes', color: 'text-slate-500' },
  heading:   { label: 'Tiêu đề',  icon: 'title', color: 'text-blue-600' },
  quote:     { label: 'Trích dẫn', icon: 'format_quote', color: 'text-violet-600' },
  image:     { label: 'Ảnh đơn',  icon: 'image', color: 'text-emerald-600' },
  gallery:   { label: 'Gallery 2 cột', icon: 'grid_view', color: 'text-orange-500' },
};

// Post đang ở trạng thái "Đã xuất bản" — đồng bộ với tab đang chọn
const POST_STATUS = 'published';
const STATUS_CONFIG = {
  published: { label: 'Đã xuất bản', dot: 'bg-primary', bg: 'bg-primary/10 border-primary/20', text: 'text-primary', btn: 'Cập nhật bài viết' },
  draft:     { label: 'Bản nháp',    dot: 'bg-slate-400', bg: 'bg-slate-50 border-slate-200',   text: 'text-slate-600', btn: 'Xuất bản bài viết' },
  scheduled: { label: 'Đã lên lịch', dot: 'bg-secondary', bg: 'bg-secondary/10 border-secondary/20', text: 'text-secondary', btn: 'Cập nhật lịch' },
};

export default function EditBlogPost() {
  const [title, setTitle] = useState('Thiền định giữa sắc chàm Kyoto: Vũ điệu cổ xưa.');
  const [isPublic, setIsPublic] = useState(true);
  const [activeStatusTab, setActiveStatusTab] = useState<keyof typeof STATUS_CONFIG>(POST_STATUS);
  const [showImageModal, setShowImageModal] = useState(false);
  const [insertingToBlock, setInsertingToBlock] = useState<number | null>(null);
  const [imageLayout, setImageLayout] = useState<'single' | 'gallery' | 'fullwidth'>('single');

  const [blocks, setBlocks] = useState<ContentBlock[]>([
    { id: 1, type: 'paragraph', content: 'Có một sự tĩnh lặng đặc biệt len lỏi qua những con phố của Kyoto khi bình minh vừa ló dạng. Nó không phải là sự vắng lặng của một thành phố đang ngủ, mà là sự tĩnh lặng đầy chủ ý của một nơi đang thức dậy cùng với những truyền thống hàng thiên niên kỷ.' },
    { id: 2, type: 'heading',   content: 'Nghệ thuật của sự chú tâm' },
    { id: 3, type: 'paragraph', content: 'Lang thang qua những con hẻm hẹp ở Gion, tôi bị cuốn hút bởi những bóng đổ nhịp nhàng của những chiếc đèn lồng giấy. Kyoto là một nghiên cứu về sự tương phản: những mặt tiền bằng gỗ sẫm màu với ánh sáng dịu nhẹ tỏa ra từ bên trong.' },
    { id: 4, type: 'quote',     content: 'Thiền không phải là một đích đến, mà là cách bạn đặt chân lên mỗi viên đá cản đường.' },
    { id: 5, type: 'image',     content: 'https://picsum.photos/seed/kyoto2/1200/700', caption: 'Khu vườn thiền Arashiyama trong ánh sáng sớm mai.' },
    { id: 6, type: 'gallery',   content: 'https://picsum.photos/seed/kyoto3/600/400|https://picsum.photos/seed/kyoto4/600/400', caption: 'Những con hẻm mang kiến trúc thời Edo ở quận Gion.' },
  ]);

  const addBlock = (type: BlockType) => {
    setBlocks(prev => [...prev, { id: Date.now(), type, content: '', caption: '' }]);
  };

  const updateBlock = (id: number, field: keyof ContentBlock, value: string) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const removeBlock = (id: number) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
  };

  const openImageModal = (blockId: number) => {
    setInsertingToBlock(blockId);
    setShowImageModal(true);
  };

  const status = STATUS_CONFIG[activeStatusTab];

  return (
    <div className="flex-1 min-h-screen bg-surface selection:bg-primary-fixed selection:text-on-primary-fixed">

      {/* Sticky Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-10 py-5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-8">
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tighter text-slate-900 dark:text-slate-100 uppercase">{BRAND_NAME}</h1>
            <Link to="/admin/blog" className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Quay lại danh sách
            </Link>
          </div>
          <div className="hidden lg:flex gap-6 ml-4">
            {(Object.keys(STATUS_CONFIG) as Array<keyof typeof STATUS_CONFIG>).map(key => (
              <button
                key={key}
                onClick={() => setActiveStatusTab(key)}
                className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                  activeStatusTab === key
                    ? 'text-primary underline decoration-2 underline-offset-8'
                    : 'text-slate-400 hover:text-primary'
                }`}
              >
                {STATUS_CONFIG[key].label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-5 py-2.5 rounded-xl text-sm font-bold text-on-surface-variant hover:bg-surface-container-high transition-all">Lưu nháp</button>
          <button className="signature-gradient text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
            {status.btn}
          </button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-10 grid grid-cols-12 gap-12">
        {/* Editor Column */}
        <div className="col-span-12 xl:col-span-8 space-y-10">

          {/* Title */}
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent border-none text-5xl md:text-6xl font-black tracking-tighter focus:ring-0 placeholder:text-surface-dim resize-none p-0 overflow-hidden leading-tight outline-none"
            placeholder="Nhập tiêu đề bài viết..."
            rows={1}
            onInput={(e) => {
              const t = e.target as HTMLTextAreaElement;
              t.style.height = '';
              t.style.height = t.scrollHeight + 'px';
            }}
          />

          {/* Cover Image */}
          <div className="relative w-full aspect-[21/9] rounded-[2.5rem] overflow-hidden group shadow-2xl shadow-slate-200/50">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFtRqeB77oDe1ZkfEvT95wVTTs-GrQ4H-rrl_Fj2wZN2by7rEBif5DdLpB-23tt473yWuJM4doTxJuPjDZieFku6spa4DPDlFBliFE6PY_f-U6XnH3Oo1newmvq8tain52g4Dgvg0qcoboZJNgaMNDNwEDiw0QChvoBXdMGntaClePNpi-xBM1ez0KN9us3dh3vPb3KhPyIGwrBOouqm4MWcJ8EuSxyxjzNL8da8TZ6hQajnPW7vFrvfZe7V9nkJ-6h0hkczZhRUM"
              alt="Cover"
              className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => openImageModal(-1)}
                className="bg-white/80 backdrop-blur-xl px-6 py-3 rounded-2xl font-black text-on-surface text-sm flex items-center gap-2 shadow-xl"
              >
                <span className="material-symbols-outlined text-lg">add_a_photo</span>
                Thay đổi ảnh bìa
              </button>
            </div>
            <div className="absolute top-4 right-4 bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-600">
              Ảnh bìa · 1600×900px
            </div>
          </div>

          {/* Block Builder */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Nội dung bài viết</h3>
              <div className="flex gap-1 flex-wrap">
                {(Object.keys(BLOCK_LABELS) as BlockType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => addBlock(type)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-surface-container-low hover:bg-surface-container-high rounded-lg transition-all text-[10px] font-black uppercase tracking-widest"
                  >
                    <span className={`material-symbols-outlined text-sm ${BLOCK_LABELS[type].color}`}>{BLOCK_LABELS[type].icon}</span>
                    {BLOCK_LABELS[type].label}
                  </button>
                ))}
              </div>
            </div>

            {blocks.map((block, idx) => (
              <div key={block.id} className="group relative border border-transparent hover:border-outline-variant/20 rounded-2xl transition-all">
                {/* Block Type Badge */}
                <div className="flex items-start gap-3 p-4">
                  <div className="flex flex-col items-center gap-1 pt-1 shrink-0">
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container-low text-[9px] font-black uppercase tracking-widest ${BLOCK_LABELS[block.type].color}`}>
                      <span className={`material-symbols-outlined text-[11px]`}>{BLOCK_LABELS[block.type].icon}</span>
                      {BLOCK_LABELS[block.type].label}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 flex flex-col gap-1 transition-opacity">
                      {idx > 0 && (
                        <button onClick={() => {
                          const arr = [...blocks];
                          [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
                          setBlocks(arr);
                        }} className="p-1 text-slate-300 hover:text-slate-600 transition-colors">
                          <span className="material-symbols-outlined text-sm">arrow_upward</span>
                        </button>
                      )}
                      {idx < blocks.length - 1 && (
                        <button onClick={() => {
                          const arr = [...blocks];
                          [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
                          setBlocks(arr);
                        }} className="p-1 text-slate-300 hover:text-slate-600 transition-colors">
                          <span className="material-symbols-outlined text-sm">arrow_downward</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    {block.type === 'paragraph' && (
                      <textarea
                        value={block.content}
                        onChange={e => updateBlock(block.id, 'content', e.target.value)}
                        className="w-full bg-transparent border-none p-0 text-base font-serif leading-relaxed text-on-surface/80 focus:ring-0 resize-none outline-none placeholder:text-slate-300 min-h-[80px]"
                        placeholder="Nhập nội dung đoạn văn..."
                      />
                    )}
                    {block.type === 'heading' && (
                      <input
                        value={block.content}
                        onChange={e => updateBlock(block.id, 'content', e.target.value)}
                        className="w-full bg-transparent border-none p-0 text-2xl font-black tracking-tight text-on-surface focus:ring-0 outline-none placeholder:text-slate-300"
                        placeholder="Nhập tiêu đề phần..."
                      />
                    )}
                    {block.type === 'quote' && (
                      <div className="pl-4 border-l-4 border-secondary/40">
                        <textarea
                          value={block.content}
                          onChange={e => updateBlock(block.id, 'content', e.target.value)}
                          className="w-full bg-transparent border-none p-0 text-lg italic font-serif text-violet-700 focus:ring-0 resize-none outline-none placeholder:text-slate-300 min-h-[60px]"
                          placeholder="Nhập câu trích dẫn nổi bật..."
                        />
                      </div>
                    )}
                    {block.type === 'image' && (
                      <div className="space-y-3">
                        {block.content ? (
                          <div className="relative rounded-xl overflow-hidden group/img">
                            <img src={block.content} alt="Block" className="w-full object-cover rounded-xl max-h-[400px]" />
                            <div className="absolute inset-0 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center bg-black/20">
                              <button
                                onClick={() => openImageModal(block.id)}
                                className="bg-white px-4 py-2 rounded-xl font-bold text-xs shadow-lg flex items-center gap-2"
                              >
                                <span className="material-symbols-outlined text-sm">edit</span>
                                Đổi ảnh
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => openImageModal(block.id)}
                            className="w-full aspect-video rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/30 hover:bg-emerald-50 transition-all flex flex-col items-center justify-center gap-3"
                          >
                            <span className="material-symbols-outlined text-3xl text-emerald-400">add_photo_alternate</span>
                            <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">Thêm ảnh</span>
                          </button>
                        )}
                        <input
                          value={block.caption || ''}
                          onChange={e => updateBlock(block.id, 'caption', e.target.value)}
                          className="w-full bg-surface-container-low border-none rounded-lg px-3 py-2 text-xs text-slate-500 italic focus:ring-1 focus:ring-primary/20 outline-none"
                          placeholder="Chú thích ảnh (alt text)..."
                        />
                      </div>
                    )}
                    {block.type === 'gallery' && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          {(block.content ? block.content.split('|') : ['', '']).map((url, gi) => (
                            <div key={gi} className="relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-dashed border-orange-300 bg-orange-50/30 hover:bg-orange-50 transition-all group/g">
                              {url ? (
                                <img src={url} alt={`Gallery ${gi + 1}`} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                                  <span className="material-symbols-outlined text-2xl text-orange-400">add_photo_alternate</span>
                                  <span className="text-[10px] font-black text-orange-500 uppercase">Ảnh {gi + 1}</span>
                                </div>
                              )}
                              <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/g:opacity-100 transition-opacity">
                                <input
                                  value={url}
                                  onChange={e => {
                                    const parts = (block.content || '|').split('|');
                                    parts[gi] = e.target.value;
                                    updateBlock(block.id, 'content', parts.join('|'));
                                  }}
                                  className="w-full bg-white/20 backdrop-blur text-[10px] text-white border-none rounded-md px-2 py-1 placeholder:text-white/50 outline-none"
                                  placeholder="Dán URL ảnh..."
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <input
                          value={block.caption || ''}
                          onChange={e => updateBlock(block.id, 'caption', e.target.value)}
                          className="w-full bg-surface-container-low border-none rounded-lg px-3 py-2 text-xs text-slate-500 italic focus:ring-1 focus:ring-primary/20 outline-none"
                          placeholder="Chú thích cho gallery..."
                        />
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => removeBlock(block.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-error transition-all shrink-0"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            ))}

            {blocks.length === 0 && (
              <div className="py-16 text-center text-slate-300">
                <span className="material-symbols-outlined text-4xl">add_circle</span>
                <p className="text-sm font-bold mt-2">Bấm thêm block ở trên để bắt đầu soạn nội dung</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="col-span-12 xl:col-span-4 space-y-6">

          {/* Status & Actions */}
          <div className="bg-white rounded-[2rem] p-7 shadow-[0_8px_32px_rgba(25,28,29,0.04)] space-y-6 border border-slate-50">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Trạng thái xuất bản</h3>
            <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl border ${status.bg}`}>
              <div className={`w-2.5 h-2.5 ${status.dot} rounded-full animate-pulse`}></div>
              <span className={`font-black text-xs uppercase tracking-widest ${status.text}`}>{status.label}</span>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-bold uppercase tracking-widest">Đã lưu lần cuối</span>
                <span className="font-black text-on-surface">2 phút trước</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-bold uppercase tracking-widest">Tác giả</span>
                <select className="bg-surface-container-low border-none rounded-lg px-2 py-1 text-xs font-bold focus:ring-1 focus:ring-primary/20 outline-none">
                  <option>Julian Thorne</option>
                  <option>Alex PTIT</option>
                  <option>Minh Anh</option>
                </select>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-bold uppercase tracking-widest">Thời gian đọc</span>
                <input type="text" defaultValue="8 phút" className="w-20 bg-surface-container-low border-none rounded-lg px-2 py-1 text-xs font-bold text-center focus:ring-1 focus:ring-primary/20 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-surface-container-low text-on-surface py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-surface-container-high transition-all">Lưu nháp</button>
              <button className="bg-primary text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">Lên lịch</button>
            </div>
          </div>

          {/* Thông tin hiển thị ngoài danh sách */}
          <div className="bg-white rounded-[2rem] p-7 shadow-[0_8px_32px_rgba(25,28,29,0.04)] space-y-5 border border-slate-50">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Hiển thị ngoài danh sách</h3>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Danh mục</label>
              <select className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm font-bold appearance-none focus:ring-1 focus:ring-primary/20 outline-none">
                <option>Nghỉ dưỡng núi</option>
                <option>Ngọc thô</option>
                <option>Nghỉ dưỡng biển</option>
                <option>Khám phá đô thị</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Slug (đường dẫn)</label>
              <input
                type="text"
                defaultValue="exploring-patagonia-silent-horizon"
                className="w-full bg-surface-container-low border-none rounded-xl py-2.5 px-4 text-xs font-mono focus:ring-1 focus:ring-primary/20 outline-none text-slate-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tóm tắt (excerpt)</label>
              <textarea
                rows={3}
                defaultValue="Khám phá vẻ đẹp chưa từng được chạm đến của những cung đường Patagonia. Hướng dẫn biên tập về những khung cảnh ngoạn mục nhất."
                className="w-full bg-surface-container-low border-none rounded-xl py-2.5 px-4 text-xs font-medium resize-none focus:ring-1 focus:ring-primary/20 outline-none leading-relaxed"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Thẻ bài viết</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {['PATAGONIA', 'LEO NÚI', 'PHIÊU LƯU'].map((tag) => (
                  <span key={tag} className="bg-primary/5 text-primary text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-primary/10">
                    {tag}
                    <span className="material-symbols-outlined text-sm cursor-pointer hover:text-error transition-colors">close</span>
                  </span>
                ))}
              </div>
              <input
                className="w-full bg-surface-container-low border-none rounded-xl py-2.5 px-4 text-xs focus:ring-1 focus:ring-primary/20 placeholder:text-slate-300 outline-none"
                placeholder="Thêm thẻ mới..."
              />
            </div>

            {/* Preview card */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Xem trước card</label>
              <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                <img src="https://picsum.photos/seed/patagonia/400/200" alt="preview" className="w-full h-28 object-cover" />
                <div className="p-3 bg-white">
                  <span className="text-[10px] font-black uppercase tracking-widest text-secondary">Nghỉ dưỡng núi</span>
                  <p className="text-sm font-black text-slate-800 leading-snug mt-1 line-clamp-2">Exploring Patagonia: The Silent Horizon</p>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400 font-bold">
                    <span>Julian Thorne</span>
                    <span>·</span>
                    <span>8 phút đọc</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-[2rem] p-7 shadow-[0_8px_32px_rgba(25,28,29,0.04)] space-y-5 border-t-8 border-secondary border-slate-50">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Biên tập SEO</h3>
              <span className="material-symbols-outlined text-secondary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Tiêu đề Meta</label>
                <input className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-1 focus:ring-primary/20 outline-none" type="text" defaultValue={`Khám phá Patagonia: Chân trời tĩnh lặng | ${BRAND_NAME}`} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Mô tả Meta</label>
                <textarea className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm font-light leading-relaxed focus:ring-1 focus:ring-primary/20 resize-none outline-none" rows={3} defaultValue="Khám phá vẻ đẹp chưa từng được chạm đến của những cung đường Patagonia. Hướng dẫn biên tập về những khung cảnh ngoạn mục nhất." />
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Google Preview</p>
                <p className="text-secondary font-black truncate text-lg tracking-tight mt-1">Khám phá Patagonia: Chân trời tĩnh lặng...</p>
                <p className="text-[10px] text-emerald-600 font-bold tracking-widest uppercase">ptittour.com › blog › patagonia</p>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-light mt-1">Khám phá vẻ đẹp chưa từng được chạm đến...</p>
              </div>
            </div>
          </div>

          {/* Visibility */}
          <div className="bg-surface-container-lowest rounded-[2rem] p-7 border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-black text-on-surface uppercase tracking-widest text-xs">Hiển thị công khai</h4>
                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">Hiển thị với tất cả khách</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} className="sr-only peer" />
                <div className="w-14 h-7 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner"></div>
              </label>
            </div>
          </div>
        </aside>
      </main>

      {/* Image Insert Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowImageModal(false)}></div>
          <div className="bg-white p-8 w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-on-surface">Thêm ảnh vào bài</h3>
              <button onClick={() => setShowImageModal(false)} className="w-8 h-8 flex items-center justify-center bg-surface-container-high hover:bg-surface-container-highest rounded-full transition-colors">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            {/* Layout Selector */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-3">Kiểu bố cục</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'single', icon: 'crop_square', label: 'Ảnh đơn' },
                  { key: 'gallery', icon: 'grid_view', label: 'Gallery 2 cột' },
                  { key: 'fullwidth', icon: 'panorama', label: 'Full width' },
                ].map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setImageLayout(opt.key as typeof imageLayout)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${imageLayout === opt.key ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                  >
                    <span className="material-symbols-outlined text-2xl">{opt.icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">URL ảnh</label>
              <input
                type="text"
                className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="https://..."
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">Chú thích (caption / alt)</label>
              <input
                type="text"
                className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="Mô tả ngắn về ảnh..."
              />
            </div>

            <button
              onClick={() => setShowImageModal(false)}
              className="w-full signature-gradient text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all"
            >
              Chèn ảnh vào bài
            </button>
          </div>
        </div>
      )}

      <footer className="mt-20 border-t border-slate-100 bg-white/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-10 py-10 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
          <span>Project: PTIT Tour Admin v2.1</span>
          <div className="flex gap-8">
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Cloud Sync Active</span>
            <span>© 2026 {BRAND_NAME}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
