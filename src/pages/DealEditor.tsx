import { Link, useNavigate, useParams } from 'react-router-dom';

export default function DealEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center bg-surface-container-lowest px-8 py-6 rounded-[2rem] shadow-sm">
        <div>
          <Link to="/admin/deals" className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors mb-2">
            <span className="material-symbols-outlined">arrow_back</span>
            Danh sách Ưu đãi
          </Link>
          <h1 className="text-2xl font-black text-on-surface">{isEdit ? 'Chỉnh sửa Mã Ưu đãi' : 'Tạo Mã Ưu đãi mới'}</h1>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/admin/deals')}
            className="signature-gradient text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
          >
            {isEdit ? 'Lưu thay đổi' : 'Tạo mới'}
          </button>
        </div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm space-y-6">
          <h3 className="font-black text-lg text-on-surface">Thông tin cơ bản</h3>
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">Tên Chiến dịch</label>
            <input type="text" defaultValue={isEdit ? "Mùa thu tĩnh lặng giữa Dolomites" : ""} className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-base font-bold text-on-surface placeholder:normal-case placeholder:text-sm" placeholder="VD: Khuyến mãi mùa Hè 2026" />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">Mã giảm giá (Code)</label>
            <input type="text" defaultValue={isEdit ? "SUMMER24" : ""} className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-xl font-bold text-on-surface uppercase placeholder:normal-case placeholder:text-sm" placeholder="VD: SUM26" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">Loại giảm</label>
              <select className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold text-on-surface">
                <option>Phần trăm (%)</option>
                <option>Số tiền cố định ($)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">Giá trị</label>
              <input type="number" defaultValue={isEdit ? 20 : ""} className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold text-on-surface" placeholder="VD: 20" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">Mô tả dành cho Khách hàng</label>
            <textarea rows={3} defaultValue={isEdit ? "Giảm 20% cho tất cả các tour Mùa Thu 2024" : ""} className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium text-on-surface resize-none" placeholder="Nhập tóm tắt ưu đãi hiển thị trên trang chủ..."></textarea>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm space-y-6">
          <h3 className="font-black text-lg text-on-surface">Điều kiện áp dụng</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">Ngày có hiệu lực</label>
               <input type="date" className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm text-on-surface font-medium" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">Ngày hết hạn</label>
              <input type="date" defaultValue={isEdit ? "2024-11-30" : ""} className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm text-on-surface font-medium" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">Giá trị Đơn hàng Tối thiểu</label>
              <input type="number" defaultValue={isEdit ? 1000 : ""} className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium text-on-surface" placeholder="VD: 500" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">Áp dụng cho</label>
              <select className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold text-on-surface">
                <option>Tất cả chuyến đi</option>
                <option>Tour cụ thể</option>
                <option>Khu vực cụ thể</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">Trạng thái</label>
            <div className="flex items-center gap-3 bg-surface-container-low p-4 rounded-xl cursor-pointer">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
              <span className="font-bold text-sm text-on-surface">Kích hoạt (Active)</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
