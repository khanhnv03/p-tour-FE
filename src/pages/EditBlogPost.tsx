import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BRAND_NAME } from '../constants';

export default function EditBlogPost() {
  const [title, setTitle] = useState('Exploring Patagonia: The Silent Horizon');
  const [content, setContent] = useState('<p class="mb-8">The first light of dawn touched the peak of Fitz Roy, igniting the granite in a fierce shade of coral. It was a moment of silence that words often struggle to capture—the kind of stillness that only exists at the edge of the world...</p><h2>The Path Less Traveled</h2><p>For years, the trails of Patagonia remained the whispers of seasoned explorers.</p>');
  const [isPublic, setIsPublic] = useState(true);

  return (
    <div className="flex-1 min-h-screen bg-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Editorial Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-10 py-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-8">
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tighter text-slate-900 dark:text-slate-100 uppercase">{BRAND_NAME}</h1>
            <nav className="flex gap-4 mt-1">
              <Link to="/admin/blog" className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Quay lại danh sách
              </Link>
            </nav>
          </div>
          <div className="hidden lg:flex gap-6 ml-4">
            <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">Bản nháp</button>
            <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors underline decoration-2 underline-offset-8">Đã xuất bản</button>
            <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">Đã lên lịch</button>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-lg">search</span>
            <input 
              className="bg-surface-container-low border-none rounded-full pl-12 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 w-64 transition-all outline-none" 
              placeholder="Tìm kiếm bài viết..." 
              type="text"
            />
          </div>
          <button className="signature-gradient text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
            Xuất bản bài viết
          </button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-10 grid grid-cols-12 gap-12">
        {/* Editor Column */}
        <div className="col-span-12 xl:col-span-8 space-y-10">
          {/* Title Area */}
          <div className="space-y-4">
             <textarea 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent border-none text-5xl md:text-6xl font-black tracking-tighter focus:ring-0 placeholder:text-surface-dim resize-none p-0 overflow-hidden leading-tight" 
              placeholder="Nhập tiêu đề bài viết..." 
              rows={1}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "";
                target.style.height = target.scrollHeight + "px";
              }}
            />
          </div>

          {/* Cover Image Upload Area */}
          <div className="relative w-full aspect-[21/9] rounded-[2.5rem] overflow-hidden group shadow-2xl shadow-slate-200/50">
            <div className="absolute inset-0 bg-surface-container-low flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/30 transition-all group-hover:bg-surface-container-high/50">
              <img 
                src="https://picsum.photos/seed/patagonia/1200/600" 
                alt="Cover" 
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700 blur-[2px] group-hover:blur-0" 
              />
              <div className="relative z-10 text-center bg-white/40 backdrop-blur-xl p-8 rounded-3xl border border-white/40 shadow-2xl scale-95 group-hover:scale-100 transition-transform duration-500">
                <div className="w-16 h-16 bg-white/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-4xl text-on-surface" style={{ fontVariationSettings: "'FILL' 1" }}>add_a_photo</span>
                </div>
                <p className="font-black text-on-surface uppercase tracking-widest text-sm">Thay đổi ảnh bìa</p>
                <p className="text-[10px] font-black text-on-surface/60 mt-2 uppercase tracking-widest">Khuyên dùng: 1600 x 900px</p>
              </div>
            </div>
          </div>

          {/* Content Editor Container */}
          <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] overflow-hidden border border-slate-100 flex flex-col">
            <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex gap-2 overflow-x-auto text-slate-500">
               <button className="p-2 hover:bg-white rounded-lg transition-colors" title="Headers"><span className="material-symbols-outlined text-sm">format_h1</span></button>
               <button className="p-2 hover:bg-white rounded-lg transition-colors" title="Bold"><span className="material-symbols-outlined text-sm">format_bold</span></button>
               <button className="p-2 hover:bg-white rounded-lg transition-colors" title="Italic"><span className="material-symbols-outlined text-sm">format_italic</span></button>
               <button className="p-2 hover:bg-white rounded-lg transition-colors" title="Underline"><span className="material-symbols-outlined text-sm">format_underlined</span></button>
               <div className="w-px h-6 bg-slate-200 my-auto mx-2"></div>
               <button className="p-2 hover:bg-white rounded-lg transition-colors" title="Quote"><span className="material-symbols-outlined text-sm">format_quote</span></button>
               <button className="p-2 hover:bg-white rounded-lg transition-colors" title="List"><span className="material-symbols-outlined text-sm">format_list_bulleted</span></button>
               <button className="p-2 hover:bg-white rounded-lg transition-colors" title="Link"><span className="material-symbols-outlined text-sm">link</span></button>
               <button className="p-2 hover:bg-white rounded-lg transition-colors" title="Image"><span className="material-symbols-outlined text-sm">image</span></button>
            </div>
            <div className="p-8 md:p-12 h-full">
                <textarea 
                  className="w-full h-full min-h-[500px] bg-transparent border-none p-0 text-lg font-serif leading-relaxed text-on-surface/80 focus:ring-0 resize-y outline-none placeholder:text-slate-300"
                  value={content} 
                  onChange={(e) => setContent(e.target.value)} 
                  placeholder="Bắt đầu kể câu chuyện của bạn (Hỗ trợ HTML/Markdown)..."
                />
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <aside className="col-span-12 xl:col-span-4 space-y-8">
          {/* Status & Actions Card */}
          <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_32px_rgba(25,28,29,0.04)] space-y-8 border border-slate-50">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Trạng thái xuất bản</h3>
              <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Chỉnh sửa trạng thái</button>
            </div>
            
            <div className="flex items-center gap-3 bg-emerald-50 px-5 py-4 rounded-2xl border border-emerald-100">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="font-black text-emerald-700 text-xs uppercase tracking-widest">Bản nháp đang hoạt động</span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-widest">Đã lưu lần cuối</span>
                <span className="font-black text-on-surface">2 phút trước</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-widest">Tác giả</span>
                <span className="font-black text-on-surface">Julian Thorne</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="bg-surface-container-low text-on-surface py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-surface-container-high transition-all">Lưu nháp</button>
              <button className="bg-primary text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">Lên lịch</button>
            </div>
          </div>

          {/* Meta & Taxonomy Card */}
          <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_32px_rgba(25,28,29,0.04)] space-y-8 border border-slate-50">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Danh mục điểm đến</label>
              <div className="relative group">
                <select className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-5 text-sm font-black uppercase tracking-widest focus:ring-2 focus:ring-primary/20 appearance-none outline-none cursor-pointer hover:bg-surface-container-high transition-colors">
                  <option>Ngọc thô</option>
                  <option selected>Nghỉ dưỡng núi</option>
                  <option>Nghỉ dưỡng biển</option>
                  <option>Khám phá đô thị</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">expand_more</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Thẻ bài viết</label>
              <div className="flex flex-wrap gap-2 mb-6">
                {['PATAGONIA', 'LEO NÚI', 'PHIÊU LƯU'].map((tag, i) => (
                  <span key={i} className="bg-primary/5 text-primary text-[10px] font-black px-4 py-2 rounded-full flex items-center gap-2 border border-primary/10 group cursor-default">
                    {tag}
                    <span className="material-symbols-outlined text-sm cursor-pointer hover:text-red-500 transition-colors">close</span>
                  </span>
                ))}
              </div>
              <input 
                className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-5 text-xs font-bold focus:ring-2 focus:ring-primary/20 placeholder:text-slate-300 outline-none" 
                placeholder="Thêm thẻ mới..." 
                type="text"
              />
            </div>
          </div>

          {/* SEO Metadata Card */}
          <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_32px_rgba(25,28,29,0.04)] space-y-8 border-t-8 border-secondary border-slate-50">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Biên tập SEO</h3>
              <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tiêu đề Meta</label>
                <input 
                  className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-5 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none" 
                  type="text" 
                  defaultValue={`Khám phá Patagonia: Chân trời tĩnh lặng | ${BRAND_NAME}`}
                />
              </div>
              
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Mô tả Meta</label>
                <textarea 
                  className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-5 text-sm font-light leading-relaxed focus:ring-2 focus:ring-primary/20 resize-none outline-none" 
                  rows={4}
                  defaultValue="Khám phá vẻ đẹp chưa từng được chạm đến của những cung đường Patagonia. Hướng dẫn biên tập về những khung cảnh ngoạn mục nhất."
                />
              </div>
              
              <div className="bg-slate-50 p-6 rounded-[2rem] space-y-3 border border-slate-100">
                <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Xem trước tìm kiếm Google</p>
                <p className="text-secondary font-black truncate text-lg tracking-tight">Khám phá Patagonia: Chân trời tĩnh lặng...</p>
                <p className="text-[10px] text-emerald-600 font-bold tracking-widest uppercase">ptittour.com › blog › patagonia</p>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-light">Khám phá vẻ đẹp chưa từng được chạm đến của những cung đường Patagonia. Hướng dẫn biên tập về những khung cảnh ngoạn mục nhất...</p>
              </div>
            </div>
          </div>

          {/* Visibility Toggle */}
          <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-[0_8px_32px_rgba(25,28,29,0.04)] border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-black text-on-surface uppercase tracking-widest text-xs">Chế độ hiển thị công khai</h4>
                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">Hiển thị với tất cả khách truy cập</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner"></div>
              </label>
            </div>
          </div>
        </aside>
      </main>

      {/* Editorial Footer */}
      <footer className="mt-20 border-t border-slate-100 bg-white/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-10 py-12 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
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
