import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BRAND_NAME, BRAND_LOGO } from '../constants';

export default function BlogPost() {
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="bg-surface text-on-surface font-sans selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col">
      {/* TopNavBar */}
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl docked full-width top-0 sticky z-50 shadow-[0_8px_32px_0_rgba(25,28,29,0.06)]">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto font-medium tracking-tight">
          <Link to="/" className="flex items-center gap-3">
            <img src={BRAND_LOGO} alt="PTIT Logo" className="h-10 w-auto" />
            <div className="text-xl font-black tracking-tighter text-blue-900 dark:text-blue-50">
              {BRAND_NAME}
            </div>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/">Điểm đến</Link>
            <Link className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/tours">Tour</Link>
            <Link className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" to="/deals">Ưu đãi</Link>
            <Link className="text-blue-700 dark:text-blue-400 font-bold border-b-2 border-blue-700 dark:border-blue-400 pb-1" to="/journal">Nhật ký</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="px-5 py-2 text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-100/50 rounded-lg transition-all active:scale-95">Đăng nhập</Link>
            <Link to="/login" className="px-6 py-2.5 signature-gradient text-white rounded-xl font-bold shadow-lg active:scale-95 transition-transform">Đăng ký</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-8 py-12 flex-grow w-full">
        <Link to="/journal" className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors mb-8">
          <span className="material-symbols-outlined">arrow_back</span>
          Quay lại Nhật ký
        </Link>
        
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-6 text-on-surface-variant">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Văn hóa</span>
            <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
            <span className="text-sm font-bold">14 Thg 10, 2024</span>
            <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
            <span className="text-sm font-bold">12 phút đọc</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-on-surface mb-8 leading-[1.1]">Thiền định giữa sắc chàm Kyoto: Vũ điệu cổ xưa.</h1>
          <div className="flex items-center justify-center gap-4">
            <img src="https://picsum.photos/seed/elena/100/100" alt="Author" className="w-12 h-12 rounded-full shadow-md object-cover" />
            <div className="text-left">
              <div className="font-bold text-on-surface">Elena Vance</div>
              <div className="text-xs text-on-surface-variant">Biên tập viên cao cấp</div>
            </div>
          </div>
        </header>

        <figure className="mb-12 rounded-[2rem] overflow-hidden shadow-2xl h-[400px] md:h-[600px] relative">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFtRqeB77oDe1ZkfEvT95wVTTs-GrQ4H-rrl_Fj2wZN2by7rEBif5DdLpB-23tt473yWuJM4doTxJuPjDZieFku6spa4DPDlFBliFE6PY_f-U6XnH3Oo1newmvq8tain52g4Dgvg0qcoboZJNgaMNDNwEDiw0QChvoBXdMGntaClePNpi-xBM1ez0KN9us3dh3vPb3KhPyIGwrBOouqm4MWcJ8EuSxyxjzNL8da8TZ6hQajnPW7vFrvfZe7V9nkJ-6h0hkczZhRUM" alt="Kyoto" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </figure>

        <article className="prose prose-lg dark:prose-invert prose-indigo max-w-none space-y-6 text-on-surface-variant leading-relaxed text-lg pb-20 border-b border-outline-variant/20">
          <p className="text-xl font-medium text-on-surface leading-loose">
            Có một sự tĩnh lặng đặc biệt len lỏi qua những con phố của Kyoto khi bình minh vừa ló dạng. Nó không phải là sự vắng lặng của một thành phố đang ngủ, mà là sự tĩnh lặng đầy chủ ý của một nơi đang thức dậy cùng với những truyền thống hàng thiên niên kỷ.
          </p>
          <p>
            Lang thang qua những con hẻm hẹp ở Gion, tôi bị cuốn hút bởi những bóng đổ nhịp nhàng của những chiếc đèn lồng giấy trên mặt đường lát đá cuội. Kyoto là một nghiên cứu về sự tương phản: những mặt tiền bằng gỗ sẫm màu với ánh sáng dịu nhẹ tỏa ra từ bên trong, tiếng lạch cạch nhẹ nhàng của đôi guốc gỗ xen lẫn tiếng vo ve xa xa của nhịp sống hiện đại.
          </p>
          <h3 className="text-2xl font-bold text-on-surface mt-10 mb-4">Nghệ thuật của sự chú tâm</h3>
          <p>
            Trọng tâm của sức hấp dẫn ở Kyoto nằm ở khái niệm 'Ma' – khoảng không gian âm, sự tĩnh lặng giữa những nốt nhạc. Nó thể hiện trong thiết kế tối giản của một khu vườn thiền, nơi các rãnh sỏi được cào tỉ mỉ tạo ra các dòng chảy biểu tượng quanh những hòn đá sắp đặt tưởng chừng ngẫu nhiên nhưng đầy cân nhắc.
          </p>
          <blockquote className="border-l-4 border-primary pl-6 py-2 my-8 italic font-medium text-xl text-on-surface bg-surface-container-lowest rounded-r-xl shadow-sm">
            "Thiền không phải là một đích đến, mà là cách bạn đặt chân lên mỗi viên đá cản đường."
          </blockquote>
          <p>
            Dành buổi chiều tại một quán trà nhỏ giấu mình trong rừng tre Arashiyama, tôi đã chứng kiến Trà đạo, không chỉ là pha trà, mà là một trải nghiệm tâm linh. Từng động tác của trà sư đều mượt mà, đầy chủ đích, nhắc nhở chúng ta trân trọng khoảnh khắc hiện tại – 'Ichi-go ichi-e' (Nhất kỳ nhất hội).
          </p>
          <div className="grid grid-cols-2 gap-6 my-10">
            <img src="https://picsum.photos/seed/k1/600/800" alt="Gallery 1" className="rounded-2xl object-cover w-full h-80" referrerPolicy="no-referrer" />
            <img src="https://picsum.photos/seed/k2/600/800" alt="Gallery 2" className="rounded-2xl object-cover w-full h-80" referrerPolicy="no-referrer" />
          </div>
          <p>
            Khi ráng chiều nhường chỗ cho màn đêm, Kyoto lại mang một lớp áo khác. Ánh đèn chàm sâu sắc hắt bóng lên những ngôi đền cổ kính. Tôi rời đi không chỉ với những bức ảnh đẹp, mà còn ở một trạng thái tinh thần hòa nhã, vượt ra ngoài mọi giới hạn thường nhật.
          </p>
        </article>
      </main>

      {/* Footer (Simplified from Journal) */}
      <footer className="bg-slate-50 dark:bg-slate-950 w-full mt-auto">
          <div className="border-t border-slate-200 dark:border-slate-800 py-8 px-8 text-center">
          <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">© 2026 {BRAND_NAME}. Vượt ra ngoài giới hạn.</p>
        </div>
      </footer>
    </div>
  );
}
