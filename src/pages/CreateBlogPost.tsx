import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function CreateBlogPost() {
  const navigate = useNavigate();
  const [content, setContent] = useState('');

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center bg-surface-container-lowest px-8 py-6 rounded-[2rem] shadow-sm">
        <div>
          <Link to="/admin/blog" className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors mb-2">
            <span className="material-symbols-outlined">arrow_back</span>
            Trở lại Thư viện
          </Link>
          <h1 className="text-2xl font-black text-on-surface">Khởi tạo Bài viết mới</h1>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-2.5 font-bold text-on-surface-variant hover:bg-surface-container-high rounded-xl transition-colors">Lưu Nháp</button>
          <button 
            onClick={() => navigate('/admin/blog')}
            className="signature-gradient text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
          >
            Xuất bản
          </button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">Tiêu đề bài viết</label>
              <input type="text" className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-xl font-black text-on-surface placeholder:text-on-surface-variant/40" placeholder="Viết tiêu đề gây ấn tượng..." />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">Tóm tắt / Meta Description</label>
              <textarea rows={3} className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium text-on-surface resize-none" placeholder="Mô tả ngắn gọn hiển thị trên thẻ bài viết..."></textarea>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">Nội dung (Trình soạn thảo)</label>
              <div className="bg-surface-container-low rounded-2xl overflow-hidden border border-surface-container flex flex-col">
                <div className="p-3 bg-surface-container border-b border-surface-container-high flex gap-1 overflow-x-auto text-slate-500">
                   <button className="p-1.5 hover:bg-white rounded-lg transition-colors"><span className="material-symbols-outlined text-sm">format_h1</span></button>
                   <button className="p-1.5 hover:bg-white rounded-lg transition-colors"><span className="material-symbols-outlined text-sm">format_bold</span></button>
                   <button className="p-1.5 hover:bg-white rounded-lg transition-colors"><span className="material-symbols-outlined text-sm">format_italic</span></button>
                   <div className="w-px h-5 bg-slate-300 my-auto mx-1"></div>
                   <button className="p-1.5 hover:bg-white rounded-lg transition-colors"><span className="material-symbols-outlined text-sm">format_list_bulleted</span></button>
                   <button className="p-1.5 hover:bg-white rounded-lg transition-colors"><span className="material-symbols-outlined text-sm">image</span></button>
                </div>
                <textarea 
                  className="w-full bg-transparent border-none p-6 text-base font-medium min-h-[400px] resize-y outline-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/40"
                  value={content} 
                  onChange={(e) => setContent(e.target.value)} 
                  placeholder="Bắt đầu kể câu chuyện của bạn (Hỗ trợ HTML/Markdown)..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-[2rem] shadow-sm space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">Chuyên mục</label>
              <select className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold text-on-surface">
                <option>Điểm đến ẩn giấu</option>
                <option>Văn hóa bản địa</option>
                <option>Hoang dã</option>
                <option>Ẩm thực</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">Ảnh Bìa (URL)</label>
              <input type="text" className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium text-on-surface" placeholder="https://..." />
              <div className="mt-4 aspect-video bg-surface-container rounded-xl border border-dashed border-outline-variant/30 flex items-center justify-center text-on-surface-variant">
                <span className="text-xs font-bold">Chưa có ảnh</span>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">Ngày xuất bản dự kiến</label>
              <input type="date" className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium text-on-surface" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
