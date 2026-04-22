import { Link } from 'react-router-dom';
import { BRAND_NAME } from '../constants';

export default function NotFound() {
  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 lg:px-24 bg-background text-on-surface font-sans overflow-hidden">
      {/* Background Editorial Element: Overlapping Map Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <img 
            className="w-full h-full object-cover grayscale" 
            alt="Map texture" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrm7Wf_FvoxKjx-D35LrXuMxFOZ7UlecgR12CydKxfaBm9iTy4m5yn3k8HlDnzTDf_6tKt-NgL7TkaotFfyWcC_r88RdDh9MP62k2wBhEcPTQjfJwZFLgW2VuGv1o82i8e8xRAcA2DxWEAVWxZ_uwqz9YrLhgKab6uIY9xmC-4xgFeF9tVyXAjbm84Cy5HigDs4vYZ-f1Crv34UxqMomXyKPQZrVl8ysBbwbh1cYSlrhckqTJkH9Iq49V4qfqOqrlVUlaKgf7M_Ys"
        />
      </div>

      <div className="relative w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Content Section: Minimalist & Focused */}
        <div className="lg:col-span-6 z-10 order-2 lg:order-1 text-center lg:text-left">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-surface-container-low text-primary text-sm font-semibold tracking-widest uppercase">
            Lỗi 404
          </div>
          <h1 className="text-6xl lg:text-8xl font-black tracking-tighter text-on-surface mb-6 leading-tight">
            Trang không <br/> tìm thấy.
          </h1>
          <p className="text-lg text-on-surface-variant max-w-md mb-12 leading-relaxed opacity-80 mx-auto lg:mx-0">
            Có vẻ như hành trình của bạn đã đi chệch khỏi bản đồ. Đừng lo lắng, ngay cả những người khám phá vĩ đại nhất đôi khi cũng lạc đường.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            {/* Featured Home Button */}
            <Link 
              className="signature-gradient text-on-primary px-8 py-4 rounded-xl font-bold text-lg shadow-[0_8px_32px_0_rgba(0,78,159,0.2)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2" 
              to="/"
            >
              <span className="material-symbols-outlined">home</span>
              Về Trang Chủ
            </Link>
            
            {/* Secondary Search/Help */}
            <Link 
                to="/tours" 
                className="bg-surface-container-low text-on-surface px-8 py-4 rounded-xl font-semibold text-lg hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">explore</span>
              Khám phá điểm đến
            </Link>
          </div>
        </div>

        {/* Illustration Section: Asymmetric Airplane/Cloud Layout */}
        <div className="lg:col-span-6 relative order-1 lg:order-2 flex justify-center items-center h-[400px] lg:h-[600px]">
          {/* Floating Glass Card for Illustration */}
          <div className="relative w-full max-w-lg aspect-square">
            {/* Background Soft Glow */}
            <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full"></div>
            
            {/* The Main Visual: Airplane above clouds */}
            <div className="relative w-full h-full rounded-[32px] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
              <img 
                className="w-full h-full object-cover" 
                alt="Airplane above clouds" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJljgOzVAzBCHDdm8rFm9Xpux7-kjmesf62kc_B0JnYUokX36LpVAgBgShESmqlqpjUbTygBu_3dogS7D5zGmvwKnnIc3amRn-M-RjSnhsCg9mJ6J7XNl1O-1lgBipcF8LHd-2ugKv-ufi5b14P14qAkYtDqf1J8os0GiG13HCZftPmQjOUCfjfTzqDEfTa05arIhQnrkZ2yIrwOUt4NJVfRUxQeqKSXL7pKgyPdb7vFR0q2q48WA8ZE51F2yNNlHm6KaIyaFVyGQ"
              />
              {/* Floating Glass Tag */}
              <div className="absolute bottom-8 left-8 glass-panel p-6 rounded-2xl max-w-[240px] shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Vị trí hiện tại</span>
                </div>
                <p className="text-lg font-bold text-on-surface">Giữa Những Tầng Mây</p>
              </div>
            </div>

            {/* Decorative Floating Elements */}
            <div className="absolute -top-12 -right-12 w-32 h-32 glass-panel rounded-3xl hidden lg:flex items-center justify-center shadow-xl -rotate-6">
              <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>flight_takeoff</span>
            </div>
            
            <div className="absolute -bottom-6 -left-12 w-48 h-16 glass-panel rounded-2xl hidden lg:flex items-center justify-center shadow-lg rotate-12 px-4">
              <span className="text-xs font-medium text-on-surface-variant tracking-tighter uppercase">{BRAND_NAME}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Minimal Branded Footer for 404 */}
      <div className="absolute bottom-8 left-0 w-full px-6 lg:px-24 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-on-surface-variant/60 z-20">
        <div className="flex items-center gap-2">
          <span className="font-black text-primary text-lg tracking-tighter">{BRAND_NAME}</span>
          <span className="mx-2">|</span>
          <span>Beyond the grid.</span>
        </div>
        <div className="flex gap-8">
          <Link to="/" className="hover:text-primary transition-colors">Trung tâm hỗ trợ</Link>
          <Link to="/" className="hover:text-primary transition-colors">Báo cáo sự cố</Link>
        </div>
      </div>
    </main>
  );
}
