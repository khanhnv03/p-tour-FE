import { Link } from 'react-router-dom';

export default function Wishlist() {
  const savedTours = [
    {
      id: "T1",
      title: "Hành trình Maya cổ đại",
      image: "https://picsum.photos/seed/maya/600/400",
      price: "$1,850",
      location: "Guatemala"
    },
    {
      id: "T2",
      title: "Cực quang Iceland",
      image: "https://picsum.photos/seed/iceland/600/400",
      price: "$2,200",
      location: "Iceland"
    },
    {
      id: "T3",
      title: "Trại sa mạc Sahara",
      image: "https://picsum.photos/seed/sahara/600/400",
      price: "$950",
      location: "Morocco"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-on-surface">Danh sách Yêu thích</h1>
          <p className="text-on-surface-variant font-medium mt-2">Những chuyến đi đang chờ bạn quyết định khám phá.</p>
        </div>
        <span className="bg-primary/10 text-primary px-4 py-2 rounded-xl font-bold text-sm shadow-sm border border-primary/10">3 Tour đã lưu</span>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {savedTours.map((tour) => (
          <div key={tour.id} className="group bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-[0_8px_32px_0_rgba(25,28,29,0.04)] border border-surface-container-low/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img src={tour.image} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-lg text-red-500 cursor-pointer hover:bg-white transition-colors flex items-center justify-center" title="Xóa khỏi danh sách">
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="bg-white/90 backdrop-blur-md text-on-surface px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm uppercase tracking-widest">{tour.location}</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-black text-on-surface mb-2 leading-tight group-hover:text-primary transition-colors">{tour.title}</h3>
              <div className="flex items-center justify-between mt-6">
                <div className="flex flex-col">
                  <span className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest">Từ</span>
                  <span className="text-lg font-black text-primary">{tour.price}</span>
                </div>
                <Link to={`/tour/${tour.id}`} className="bg-surface-container-high hover:bg-surface-dim text-on-surface px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm">Xem chi tiết</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
