import { Link, useParams } from 'react-router-dom';

export default function CustomerDetails() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container-lowest px-8 py-6 rounded-[2rem] shadow-sm">
        <div>
          <Link to="/admin/customers" className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors mb-2">
            <span className="material-symbols-outlined">arrow_back</span>
            Danh sách Khách hàng
          </Link>
          <div className="flex items-center gap-4">
            <img src="https://picsum.photos/seed/cx/100/100" alt="Avatar" className="w-14 h-14 rounded-full shadow-sm object-cover" />
            <div>
              <h1 className="text-2xl font-black text-on-surface leading-tight">Liam Harper</h1>
              <p className="text-sm font-medium text-on-surface-variant">liam.harper@example.com <span className="mx-2">•</span> +1 (555) 123-4567</p>
            </div>
          </div>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-6 py-2.5 font-bold text-on-surface-variant hover:bg-surface-container-high hover:text-red-600 rounded-xl transition-colors">Đình chỉ</button>
          <button className="flex-1 md:flex-none bg-primary text-on-primary px-8 py-2.5 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all">Sửa thông tin</button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-[2rem] shadow-sm">
            <h3 className="font-black text-lg text-on-surface mb-6">Thống kê</h3>
            <div className="space-y-4">
              <div className="bg-surface-container-low p-4 rounded-xl flex items-center justify-between">
                <span className="text-sm font-bold text-on-surface-variant">Tổng chi tiêu</span>
                <span className="text-xl font-black text-primary">$4,250</span>
              </div>
              <div className="bg-surface-container-low p-4 rounded-xl flex items-center justify-between">
                <span className="text-sm font-bold text-on-surface-variant">Tour đã đi</span>
                <span className="text-xl font-black text-on-surface">3 Chuyến</span>
              </div>
              <div className="bg-surface-container-low p-4 rounded-xl flex items-center justify-between">
                <span className="text-sm font-bold text-on-surface-variant">Trạng thái</span>
                <span className="bg-green-100 text-green-700 font-bold px-2 py-1 rounded text-xs">VIP Member</span>
              </div>
            </div>
            
            <div className="mt-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-4">Ghi chú nội bộ</h4>
              <textarea 
                className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium text-on-surface resize-none" 
                rows={4}
                placeholder="Thêm ghi chú về sở thích, dị ứng..."
                defaultValue="Khách hàng thích ăn chay. Yêu cầu phòng view biển nếu có thể."
              ></textarea>
              <button className="w-full mt-2 font-bold text-sm text-primary hover:underline text-right relative right-2">Lưu ghi chú</button>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-[2rem] shadow-sm">
            <h3 className="font-black text-lg text-on-surface mb-6">Lịch sử đặt tour</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[500px]">
                <thead>
                  <tr className="border-b border-outline-variant/30 text-[10px] uppercase tracking-widest text-on-surface-variant">
                    <th className="pb-4 font-black">Mã ĐC</th>
                    <th className="pb-4 font-black">Tour</th>
                    <th className="pb-4 font-black">Ngày xuất phát</th>
                    <th className="pb-4 font-black">Trạng thái</th>
                    <th className="pb-4 font-black text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium">
                  <tr className="border-b border-outline-variant/10 hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-4">#BK-8821</td>
                    <td className="py-4 text-on-surface font-bold">Thung lũng Bắc Đảo</td>
                    <td className="py-4 text-on-surface-variant">10 Thg 12, 2025</td>
                    <td className="py-4"><span className="bg-green-100 text-green-700 px-2 py-1 flex w-fit rounded-lg text-xs font-bold">Hoàn tất</span></td>
                    <td className="py-4 text-right"><Link to="/admin/orders/BK-8821" className="text-primary hover:underline">Chi tiết</Link></td>
                  </tr>
                  <tr className="border-b border-outline-variant/10 hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-4">#BK-9302</td>
                    <td className="py-4 text-on-surface font-bold">Lễ hội Sapa</td>
                    <td className="py-4 text-on-surface-variant">05 Thg 01, 2026</td>
                    <td className="py-4"><span className="bg-blue-100 text-blue-700 px-2 py-1 flex w-fit rounded-lg text-xs font-bold">Sắp đi</span></td>
                    <td className="py-4 text-right"><Link to="/admin/orders/BK-9302" className="text-primary hover:underline">Chi tiết</Link></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
