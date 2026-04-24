import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyWishlist, removeFromWishlist, type WishlistItem } from '../api/wishlist';

const fmt = (n: number) => n.toLocaleString('vi-VN') + '₫';

export default function Wishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<number | null>(null);

  useEffect(() => {
    getMyWishlist()
      .then(res => setItems(res.content))
      .finally(() => setLoading(false));
  }, []);

  async function handleRemove(tourId: number) {
    setRemoving(tourId);
    try {
      await removeFromWishlist(tourId);
      setItems(prev => prev.filter(i => i.tour.id !== tourId));
    } finally {
      setRemoving(null);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-on-surface">Danh sách Yêu thích</h1>
          <p className="text-on-surface-variant font-medium mt-2">Những chuyến đi đang chờ bạn quyết định khám phá.</p>
        </div>
        <span className="bg-primary/10 text-primary px-4 py-2 rounded-xl font-bold text-sm shadow-sm border border-primary/10">
          {items.length} Tour đã lưu
        </span>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-on-surface-variant">
          <span className="material-symbols-outlined text-6xl">favorite_border</span>
          <p className="font-semibold">Chưa có tour nào trong danh sách yêu thích.</p>
          <Link to="/tours" className="primary-gradient text-white px-6 py-2.5 rounded-xl font-bold text-sm">
            Khám phá tours
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {items.map((item) => (
            <div key={item.wishlistId} className="group bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-[0_8px_32px_0_rgba(25,28,29,0.04)] border border-surface-container-low/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={item.tour.coverImageUrl ?? `https://picsum.photos/seed/${item.tour.id}/600/400`}
                  alt={item.tour.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <button
                  onClick={() => handleRemove(item.tour.id)}
                  disabled={removing === item.tour.id}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-lg text-red-500 hover:bg-white transition-colors flex items-center justify-center disabled:opacity-50"
                  title="Xóa khỏi danh sách"
                >
                  {removing === item.tour.id
                    ? <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                    : <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                  }
                </button>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="bg-white/90 backdrop-blur-md text-on-surface px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm uppercase tracking-widest">
                    {item.tour.destinationName}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black text-on-surface mb-1 leading-tight group-hover:text-primary transition-colors">
                  {item.tour.title}
                </h3>
                <p className="text-xs text-on-surface-variant mb-4">
                  {item.tour.durationDays} ngày {item.tour.durationNights} đêm
                  {item.tour.rating > 0 && (
                    <span className="ml-2">· ★ {item.tour.rating}</span>
                  )}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest">Từ</span>
                    <span className="text-lg font-black text-primary">{fmt(item.tour.pricePerPerson)}</span>
                  </div>
                  <Link
                    to={`/tour/${item.tour.slug || item.tour.id}`}
                    className="bg-surface-container-high hover:bg-surface-dim text-on-surface px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
