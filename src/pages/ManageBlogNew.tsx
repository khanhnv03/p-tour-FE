import { useState } from 'react';
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5JPoM3NnHY-Twd6eRYvzNr3OIXsMNNwUfqZHG7xlgapRfa9kiEjHeZ-JYlHkLruf-wmeMdMcciCUgXzucQLdOFHHrKoKx2q56or4GBflqDYDet-JF2KWXS_SD8GQOqvSGU5miYQ-005jPg69Vi9WHMb386GPtGn_JsR4U2TnTIQDiF2mFxV7cE9b9ZmTq1VvvkZItaLuPA2fkCQigqSNkA7pHybOOLurJJ0JeJXKB7l-9dMGjZE6awppJKY2OyhGlY6Lkbhbio6o',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA67B_KGngeWqkUEy-7iCBaYCJ97_SJGXYEB5pJFw0r7mLUWMMbxT3UKBftq1Gvmv7G47fc9OXxg27jkK0Gv85-qU7-aWYUgPg1bKGcsM5eV2RhgGGfPIgzvEKv9VkhA-gfoYZZrE8GJIHh5O4HEDnKB5DJIVuQl5YrUszUKLUkrkqkC1LRzSjwkV0x07Fd4xUm2e7hotRomwPv3JwI5mRFMOXMdgd25_wENzC9TJzcxtII_i124iJqT6YIzAgvYmsmIM-dEN0rFfA',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfe3gUvt0C5BwRhag_VZ_e182wpoxd-bKbKQf_aapClh4Rrk62On5GUKOJIfLpJS8xK58TetvUId6vzvu1sxkxKiHo593qt93qVJIrU9wUtyHt7Y3u9AtKl9zE-BtLeMSLiluOACo8zj5CpJ6WzCG99SlLmH911I7C783HoMn3ZhjW5HaDA41YaZLX9U2r_sNHpNuxtMlcECc9gsqVs7HAab8s20IgclLBTnuxkvtw0kLLSgLEJ_v-1o9Ib96N2mp_lf9BJH019lI',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEis60ve3U-n0JAwKgFMrPMMBQvY1OUyh6icOiz5rJAF3PHZWoSYfSKfTVY3SAkguVEKFl2ijQU8d0cAneBr0GhV8GZJS0E9pywa7gOnV6sPqc4OudePkLIkOVdqvjwRN_QR0P7AH6hwFy4EgHQBDwL5vIPLbLTAT8e_vx5_PLUssjEnBjU3dCHhP6dcKswgx4L-LJOUHM_Y75C3cpQMQK7GCe9qG6szOLXUfM3DiAAoLwqhjQ7MUPXV7dtwe8GwsCirdhgs7bgQs',
  },
];

const TABS = ['Tất cả', 'Đã xuất bản', 'Bản nháp', 'Đã lên lịch'] as const;

const STATUS_MAP: Record<string, { dot: string; text: string; label: string }> = {
  Published:  { dot: 'bg-emerald-500', text: 'text-emerald-700', label: 'Đã xuất bản' },
  Draft:      { dot: 'bg-amber-400',   text: 'text-amber-700',   label: 'Bản nháp'    },
  Scheduled:  { dot: 'bg-blue-500',    text: 'text-blue-700',    label: 'Đã lên lịch' },
};

const publishedCount = blogPosts.filter(p => p.status === 'Published').length;

export default function ManageBlog() {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('Tất cả');

  const filtered = blogPosts.filter(p => {
    if (activeTab === 'Tất cả') return true;
    const map: Record<string, string> = {
      'Đã xuất bản': 'Published',
      'Bản nháp': 'Draft',
      'Đã lên lịch': 'Scheduled',
    };
    return p.status === map[activeTab];
  });

  return (
    <div className="flex flex-col flex-1 p-6 lg:p-8 overflow-y-auto gap-6">
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 mb-2">
            <span>Quản trị</span>
            <span className="material-symbols-outlined text-[11px]">chevron_right</span>
            <span className="text-secondary">Biên tập</span>
          </nav>
          <h1 className="text-3xl font-black text-on-surface tracking-tight leading-none">Bài viết Blog</h1>
          <p className="text-slate-400 text-sm font-medium mt-1.5">Điều phối nội dung du lịch và theo dõi mức độ tương tác của độc giả.</p>
        </div>
        <Link
          to="/admin/blog/new"
          className="inline-flex items-center gap-2 signature-gradient text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl transition-all active:scale-95 whitespace-nowrap self-start lg:self-auto"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Bài viết mới
        </Link>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Đã xuất bản</span>
            <span className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-600 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-on-surface tracking-tight">{publishedCount}</span>
            <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">bài viết</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tổng lượt xem</span>
            <span className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>visibility</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-on-surface tracking-tight">21.3k</span>
            <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">lượt</span>
          </div>
        </div>

        <div className="primary-gradient text-white rounded-2xl shadow-xl shadow-primary/20 p-5 flex flex-col gap-3 relative overflow-hidden">
          <span className="material-symbols-outlined absolute -right-3 -bottom-3 text-[72px] text-white/10 select-none" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Tương tác tháng này</span>
          <div className="flex items-baseline gap-2 mt-auto">
            <span className="text-3xl font-black tracking-tight">+24.5k</span>
            <span className="text-white/60 font-bold text-[10px] uppercase tracking-widest">Lượt</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs + Table */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col flex-1 min-h-0">
        {/* Tab bar */}
        <div className="px-6 pt-4 pb-0 flex items-center justify-between gap-4 border-b border-black/5">
          <div className="flex items-center gap-1">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-xs font-black uppercase tracking-widest rounded-t-xl transition-all border-b-2 -mb-px ${
                  activeTab === tab
                    ? 'text-primary border-primary bg-primary/5'
                    : 'text-slate-400 border-transparent hover:text-on-surface'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 pb-2">{filtered.length} bài viết</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Bài viết</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Danh mục</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Trạng thái</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Tương tác</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Ngày</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(post => {
                const s = STATUS_MAP[post.status] ?? STATUS_MAP['Draft'];
                return (
                  <tr key={post.id} className="border-t border-black/5 hover:bg-slate-50/60 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-on-surface text-sm group-hover:text-primary transition-colors">{post.title}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 italic">bởi {post.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border border-primary/10">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                        <span className={`text-xs font-bold ${s.text}`}>{s.label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 opacity-50 group-hover:opacity-100 transition-all">
                          <span className="material-symbols-outlined text-base text-primary">visibility</span>
                          <span className="text-xs font-bold font-mono text-slate-500">{post.views}</span>
                        </div>
                        <div className="flex items-center gap-1.5 opacity-50 group-hover:opacity-100 transition-all">
                          <span className="material-symbols-outlined text-base text-secondary">chat_bubble</span>
                          <span className="text-xs font-bold font-mono text-slate-500">{post.comments}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[11px] font-black uppercase tracking-tight text-slate-400">{post.date}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-20 group-hover:opacity-100 transition-all">
                        <Link
                          to={`/admin/blog/edit/${post.id}`}
                          className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-all"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </Link>
                        <button className="p-2 hover:bg-red-50 text-red-400 rounded-lg transition-all">
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-black/5 flex items-center justify-between gap-4 mt-auto">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            Hiển thị <span className="text-on-surface">{filtered.length}</span> trong <span className="text-on-surface">128</span> bài viết
          </p>
          <div className="flex items-center gap-1 font-mono">
            <button className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:bg-white transition-all" disabled>
              <span className="material-symbols-outlined text-base">chevron_left</span>
            </button>
            <button className="w-9 h-9 rounded-lg bg-primary text-white text-sm font-black shadow-sm shadow-primary/20">1</button>
            <button className="w-9 h-9 rounded-lg hover:bg-white text-slate-400 text-sm font-bold transition-all border border-black/5">2</button>
            <button className="w-9 h-9 rounded-lg hover:bg-white text-slate-400 text-sm font-bold transition-all border border-black/5">3</button>
            <button className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:bg-white transition-all border border-black/5">
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Insight cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 relative overflow-hidden group">
          <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[80px] text-primary/5 group-hover:scale-110 transition-transform duration-700 select-none" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
          <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-lg">insights</span>
          </div>
          <h5 className="text-base font-black tracking-tight text-on-surface">Xu hướng biên tập</h5>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed font-light">
            Du lịch phiêu lưu vẫn là danh mục mạnh nhất tháng này, tăng <span className="text-primary font-bold">30%</span> về tỷ lệ giữ chân độc giả.
          </p>
        </div>

        <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-6 relative overflow-hidden group">
          <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[80px] text-secondary/5 group-hover:scale-110 transition-transform duration-700 select-none" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
          <div className="w-10 h-10 bg-secondary text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-secondary/20">
            <span className="material-symbols-outlined text-lg">schedule</span>
          </div>
          <h5 className="text-base font-black tracking-tight text-on-surface">Hàng đợi bài đăng</h5>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed font-light">
            <span className="text-secondary font-bold">5 bài viết</span> lên lịch cho tuần tới. Loạt bài 'Amalfi Coast' đang chờ phê duyệt cuối.
          </p>
        </div>

        <div className="bg-white border border-black/5 rounded-2xl p-6 flex flex-col justify-center relative overflow-hidden group shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
          <img
            className="absolute inset-0 w-full h-full object-cover opacity-5 group-hover:scale-105 transition-transform duration-700"
            src="https://picsum.photos/seed/journal/800/600?blur=10"
            alt=""
          />
          <div className="relative z-10">
            <h5 className="text-base font-black tracking-tight text-on-surface">Bản nháp nhanh</h5>
            <Link to="/admin/blog/new" className="mt-3 inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] group-hover:translate-x-1 transition-transform">
              Tiếp tục bài viết mới nhất
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
