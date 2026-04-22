import React from 'react';
import { Link } from 'react-router-dom';

const blogPosts = [
  {
    id: 1,
    title: 'The Unseen Peaks of Iceland',
    author: 'Elena Vance',
    category: 'Adventure',
    status: 'Published',
    views: '12.4k',
    comments: 84,
    date: 'Oct 24, 2024',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5JPoM3NnHY-Twd6eRYvzNr3OIXsMNNwUfqZHG7xlgapRfa9kiEjHeZ-JYlHkLruf-wmeMdMcciCUgXzucQLdOFHHrKoKx2q56or4GBflqDYDet-JF2KWXS_SD8GQOqvSGU5miYQ-005jPg69Vi9WHMb386GPtGn_JsR4U2TnTIQDiF2mFxV7cE9b9ZmTq1VvvkZItaLuPA2fkCQigqSNkA7pHybOOLurJJ0JeJXKB7l-9dMGjZE6awppJKY2OyhGlY6Lkbhbio6o'
  },
  {
    id: 2,
    title: "Tokyo After Dark: A Curator's Guide",
    author: 'Marcus Thorne',
    category: 'City Life',
    status: 'Draft',
    views: '0',
    comments: 0,
    date: '2h ago',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA67B_KGngeWqkUEy-7iCBaYCJ97_SJGXYEB5pJFw0r7mLUWMMbxT3UKBftq1Gvmv7G47fc9OXxg27jkK0Gv85-qU7-aWYUgPg1bKGcsM5eV2RhgGGfPIgzvEKv9VkhA-gfoYZZrE8GJIHh5O4HEDnKB5DJIVuQl5YrUszUKLUkrkqkC1LRzSjwkV0x07Fd4xUm2e7hotRomwPv3JwI5mRFMOXMdgd25_wENzC9TJzcxtII_i124iJqT6YIzAgvYmsmIM-dEN0rFfA'
  },
  {
    id: 3,
    title: 'Venetian Morning Rituals',
    author: 'Sarah Jenkins',
    category: 'Culture',
    status: 'Scheduled',
    views: '0',
    comments: 0,
    date: 'Nov 12, 2024',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfe3gUvt0C5BwRhag_VZ_e182wpoxd-bKbKQf_aapClh4Rrk62On5GUKOJIfLpJS8xK58TetvUId6vzvu1sxkxKiHo593qt93qVJIrU9wUtyHt7Y3u9AtKl9zE-BtLeMSLiluOACo8zj5CpJ6WzCG99SlLmH911I7C783HoMn3ZhjW5HaDA41YaZLX9U2r_sNHpNuxtMlcECc9gsqVs7HAab8s20IgclLBTnuxkvtw0kLLSgLEJ_v-1o9Ib96N2mp_lf9BJH019lI'
  },
  {
    id: 4,
    title: 'Parisian Bistros: A Love Story',
    author: 'Elena Vance',
    category: 'Gastronomy',
    status: 'Published',
    views: '8.9k',
    comments: 142,
    date: 'Oct 18, 2024',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEis60ve3U-n0JAwKgFMrPMMBQvY1OUyh6icOiz5rJAF3PHZWoSYfSKfTVY3SAkguVEKFl2ijQU8d0cAneBr0GhV8GZJS0E9pywa7gOnV6sPqc4OudePkLIkOVdqvjwRN_QR0P7AH6hwFy4EgHQBDwL5vIPLbLTAT8e_vx5_PLUssjEnBjU3dCHhP6dcKswgx4L-LJOUHM_Y75C3cpQMQK7GCe9qG6szOLXUfM3DiAAoLwqhjQ7MUPXV7dtwe8GwsCirdhgs7bgQs'
  }
];

export default function ManageBlog() {
  return (
    <div className="p-10 max-w-[1600px] mx-auto space-y-10">
      {/* Page Header & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4">
        <div>
          <nav className="flex items-center space-x-2 text-on-surface-variant text-[10px] font-black uppercase tracking-[0.2em] mb-3">
            <span>Quản lý</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-secondary">Biên tập</span>
          </nav>
          <h1 className="text-5xl font-black tracking-tighter text-on-surface leading-none">Bài viết Blog</h1>
          <p className="text-on-surface-variant mt-3 max-w-md text-lg leading-relaxed font-light">
            Điều phối các bài viết về hành trình du lịch của bạn và theo dõi mức độ tương tác của độc giả trên tất cả các nội dung đã xuất bản.
          </p>
        </div>
        <Link 
          to="/admin/blog/new"
          className="signature-gradient text-white px-8 py-4 rounded-xl flex items-center gap-3 shadow-[0_8px_32px_rgba(0,78,159,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all font-bold tracking-tight"
        >
          <span className="material-symbols-outlined">add</span>
          <span>Bài viết mới</span>
        </Link>
      </div>

      {/* Dashboard Filters & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="bg-surface-container-low p-2 rounded-2xl flex items-center gap-1 overflow-x-auto no-scrollbar border border-outline-variant/10">
          <button className="bg-white text-primary font-bold px-6 py-3 rounded-xl shadow-sm text-sm whitespace-nowrap">Tất cả bài viết</button>
          <button className="text-on-surface-variant font-bold px-6 py-3 rounded-xl hover:bg-surface-container-high transition-colors text-sm whitespace-nowrap">Đã xuất bản</button>
          <button className="text-on-surface-variant font-bold px-6 py-3 rounded-xl hover:bg-surface-container-high transition-colors text-sm whitespace-nowrap">Bản nháp</button>
          <button className="text-on-surface-variant font-bold px-6 py-3 rounded-xl hover:bg-surface-container-high transition-colors text-sm whitespace-nowrap">Đã lên lịch</button>
          <div className="w-px h-6 bg-outline-variant/30 mx-2"></div>
          <button className="flex items-center gap-2 px-4 py-3 bg-white text-on-surface font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-slate-50 transition-all border border-outline-variant/10">
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            Danh mục
          </button>
        </div>
        <div className="flex items-center justify-end gap-3">
          <div className="bg-surface-container-lowest px-6 py-3 rounded-[2rem] border border-outline-variant/10 flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none">Tương tác hàng tháng</p>
              <p className="text-xl font-black text-secondary leading-none mt-1">+24.5k</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[20px]">trending_up</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bento-Style Editorial Table */}
      <div className="bg-surface-container-lowest rounded-[2rem] shadow-[0_8px_32px_rgba(25,28,29,0.04)] overflow-hidden border border-outline-variant/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Chi tiết bài viết</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Danh mục</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Trạng thái</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Tương tác</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Ngày</th>
                <th className="px-8 py-5 text-right font-black uppercase tracking-widest text-slate-400 text-[11px]">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {blogPosts.map((post) => (
                <tr key={post.id} className="group hover:bg-surface-container-low/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100">
                        <img 
                          src={post.image} 
                          alt={post.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                      </div>
                      <div>
                        <h4 className="text-on-surface font-bold text-base leading-tight group-hover:text-primary transition-colors cursor-pointer">{post.title}</h4>
                        <p className="text-slate-400 text-xs mt-1 font-medium italic">bởi {post.author}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-primary/10">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-6 font-bold text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        post.status === 'Published' || post.status === 'Đã xuất bản' ? 'bg-emerald-500' : 
                        post.status === 'Draft' || post.status === 'Bản nháp' ? 'bg-amber-400' : 'bg-blue-500'
                      }`} />
                      <span className={
                        post.status === 'Published' || post.status === 'Đã xuất bản' ? 'text-emerald-600' : 
                        post.status === 'Draft' || post.status === 'Bản nháp' ? 'text-amber-600' : 'text-blue-600'
                      }>
                        {post.status === 'Published' ? 'Đã xuất bản' : post.status === 'Draft' ? 'Bản nháp' : post.status === 'Scheduled' ? 'Đã lên lịch' : post.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                        <span className="material-symbols-outlined text-[16px] text-primary">visibility</span>
                        <span className="text-xs font-bold text-on-surface-variant font-mono">{post.views}</span>
                      </div>
                      <div className="flex items-center gap-1.5 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                        <span className="material-symbols-outlined text-[16px] text-secondary">chat_bubble</span>
                        <span className="text-xs font-bold text-on-surface-variant font-mono">{post.comments}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-[11px] font-black uppercase tracking-tight text-slate-500">{post.date}</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link 
                        to={`/admin/blog/edit/${post.id}`}
                        className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-base">edit</span>
                      </Link>
                      <button className="p-2 rounded-lg hover:bg-error/10 text-error transition-colors">
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Table Footer/Pagination */}
        <div className="px-8 py-6 bg-surface-container-low/30 border-t border-outline-variant/10 flex items-center justify-between">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Hiển thị 4 trong số 128 bài viết</p>
          <div className="flex items-center gap-1 font-mono">
            <button className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white transition-all">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-md text-primary font-bold text-sm">1</button>
            <button className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:bg-white transition-all text-sm font-bold">2</button>
            <button className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:bg-white transition-all text-sm font-bold">3</button>
            <button className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white transition-all">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contextual Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
        <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10 relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:scale-110 transition-transform duration-700">
             <span className="material-symbols-outlined text-[120px] text-primary">insights</span>
          </div>
          <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined">insights</span>
          </div>
          <h5 className="text-xl font-black tracking-tight text-on-surface">Xu hướng biên tập</h5>
          <p className="text-on-surface-variant text-sm mt-3 leading-relaxed font-light">
            Du lịch phiêu lưu vẫn là danh mục mạnh nhất của bạn trong tháng này, với mức tăng <span className="text-primary font-bold">30%</span> về tỷ lệ giữ chân độc giả.
          </p>
        </div>

        <div className="bg-secondary/5 p-8 rounded-[2.5rem] border border-secondary/10 relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:scale-110 transition-transform duration-700">
             <span className="material-symbols-outlined text-[120px] text-secondary">schedule</span>
          </div>
          <div className="w-12 h-12 bg-secondary text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-secondary/20">
            <span className="material-symbols-outlined">schedule</span>
          </div>
          <h5 className="text-xl font-black tracking-tight text-on-surface">Trạng thái hàng đợi</h5>
          <p className="text-on-surface-variant text-sm mt-3 leading-relaxed font-light">
            Bạn có <span className="text-secondary font-bold">5 bài viết</span> được lên lịch cho tuần tới. Loạt bài 'Amalfi Coast' đang chờ phê duyệt cuối cùng.
          </p>
        </div>

        <div className="bg-surface-container-low p-8 rounded-[2.5rem] flex flex-col justify-center overflow-hidden relative group border border-outline-variant/10">
          <img 
            className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:scale-105 transition-transform duration-1000" 
            src="https://picsum.photos/seed/journal/800/600?blur=10" 
            alt="Quick Draft Background"
          />
          <div className="relative z-10">
            <h5 className="text-xl font-black tracking-tight text-on-surface">Bản nháp nhanh</h5>
            <button className="mt-4 flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] group-hover:translate-x-1 transition-transform">
              Tiếp tục bài viết mới nhất
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
