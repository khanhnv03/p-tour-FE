export default function UserProfile() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <header>
        <h1 className="text-3xl font-black tracking-tight text-on-surface">Hồ sơ cá nhân</h1>
        <p className="text-on-surface-variant text-sm mt-2">Quản lý thông tin liên hệ và tùy chọn cá nhân của bạn.</p>
      </header>

      <form className="space-y-8" onSubmit={e => e.preventDefault()}>
        <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0_8px_32px_0_rgba(25,28,29,0.04)] border border-surface-container-low/50">
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            <div className="relative">
              <div className="w-32 h-32 rounded-[2rem] overflow-hidden shadow-lg border-4 border-white object-cover">
                <img src="https://picsum.photos/seed/customer/200/200" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <button className="absolute -bottom-2 -right-2 bg-primary text-on-primary p-2 rounded-xl shadow-lg hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-sm">photo_camera</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1 w-full mt-2">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant px-1">Tên đẩy đủ</label>
                <input type="text" defaultValue="Alex Explorer" className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-on-surface" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant px-1">Email</label>
                <input type="email" defaultValue="alex@horizon.com" readOnly className="w-full bg-surface-container cursor-not-allowed border-none rounded-xl px-4 py-3 outline-none font-medium text-on-surface-variant" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant px-1">Số điện thoại</label>
                <input type="tel" defaultValue="+84 987 654 321" className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none font-medium text-on-surface" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant px-1">Quốc gia</label>
                <input type="text" defaultValue="Việt Nam" className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none font-medium text-on-surface" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button className="px-8 py-3 text-on-surface-variant font-bold hover:bg-surface-container-high rounded-xl transition-colors">Hủy</button>
          <button className="signature-gradient text-white px-10 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all scale-100 active:scale-95">Lưu thay đổi</button>
        </div>
      </form>
    </div>
  );
}
