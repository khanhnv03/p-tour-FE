import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { getMyBookings, type Booking } from '../api/bookings';
import { findOrderByBooking, type Order } from '../api/orders';
import { useAuth } from '../context/AuthContext';

interface NotifItem {
  id: string;
  title: string;
  body: string;
  icon: string;
  iconClass: string;
  href: string;
  time: string;
}

function deriveNotifications(bookings: Booking[], orderMap: Record<number, Order | null>): NotifItem[] {
  const items: NotifItem[] = [];

  for (const b of bookings) {
    if (b.status === 'CONFIRMED') {
      items.push({
        id: `booking-confirmed-${b.id}`,
        title: 'Booking đã xác nhận',
        body: `${b.bookingCode} · ${b.tourTitle}`,
        icon: 'verified',
        iconClass: 'bg-green-100 text-green-600',
        href: `/my-bookings/${b.id}`,
        time: b.createdAt,
      });
    } else if (b.status === 'COMPLETED') {
      items.push({
        id: `booking-completed-${b.id}`,
        title: 'Chuyến đi hoàn thành',
        body: `${b.bookingCode} · Hãy chia sẻ trải nghiệm!`,
        icon: 'check_circle',
        iconClass: 'bg-blue-100 text-blue-600',
        href: `/my-bookings/${b.id}`,
        time: b.createdAt,
      });
    } else if (b.status === 'CANCELLED') {
      items.push({
        id: `booking-cancelled-${b.id}`,
        title: 'Booking đã hủy',
        body: `${b.bookingCode} · ${b.tourTitle}`,
        icon: 'cancel',
        iconClass: 'bg-red-100 text-red-600',
        href: `/my-bookings/${b.id}`,
        time: b.createdAt,
      });
    }

    const order = orderMap[b.id];
    if (order?.paymentStatus === 'PAID') {
      items.push({
        id: `order-paid-${order.id}`,
        title: 'Thanh toán thành công',
        body: `${order.orderCode} · ${b.tourTitle}`,
        icon: 'payments',
        iconClass: 'bg-green-100 text-green-600',
        href: `/my-bookings/${b.id}`,
        time: order.paidAt ?? order.createdAt,
      });
    }

    if (order?.paymentStatus === 'REFUNDED') {
      items.push({
        id: `order-refunded-${order.id}`,
        title: 'Đơn hàng đã hoàn tiền',
        body: `${order.orderCode} · Khoản thanh toán đã hoàn`,
        icon: 'undo',
        iconClass: 'bg-amber-100 text-amber-600',
        href: `/my-bookings/${b.id}`,
        time: order.refundedAt ?? order.createdAt,
      });
    }
  }

  items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  return items;
}

function loadSeenIds(userId: number): Set<string> {
  try {
    const raw = localStorage.getItem(`ptit_seen_notifs_${userId}`);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function saveSeenIds(userId: number, ids: Set<string>): void {
  try {
    localStorage.setItem(`ptit_seen_notifs_${userId}`, JSON.stringify([...ids]));
  } catch { /* ignore */ }
}

function fmtRelTime(value: string): string {
  const diffMs = Date.now() - new Date(value).getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return 'Vừa xong';
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} giờ trước`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay} ngày trước`;
  return new Date(value).toLocaleDateString('vi-VN');
}

export default function NotificationBell() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<NotifItem[]>([]);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user || isAdmin) return;
    let mounted = true;
    setLoading(true);

    async function fetchNotifs() {
      try {
        const page = await getMyBookings({ page: 0, size: 20 });
        const pairs = await Promise.all(
          page.content.map(async (b) => [b.id, await findOrderByBooking(b.id)] as const),
        );
        if (!mounted) return;
        const derived = deriveNotifications(page.content, Object.fromEntries(pairs));
        setItems(derived);
        setSeenIds(loadSeenIds(user.id));
      } catch { /* non-critical */ } finally {
        if (mounted) setLoading(false);
      }
    }

    void fetchNotifs();
    return () => { mounted = false; };
  }, [isAuthenticated, isAdmin, user]);

  const unreadCount = items.filter((item) => !seenIds.has(item.id)).length;

  function handleToggle() {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen && user && items.length > 0) {
      const merged = new Set([...seenIds, ...items.map((i) => i.id)]);
      setSeenIds(merged);
      saveSeenIds(user.id, merged);
    }
  }

  if (!isAuthenticated || isAdmin) return null;

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={handleToggle}
        className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors focus:outline-none"
        aria-label="Thông báo"
      >
        <span className="material-symbols-outlined text-xl">notifications</span>

        {loading ? (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary/50 rounded-full border-2 border-white animate-pulse" />
        ) : unreadCount > 0 ? (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-secondary text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 border-2 border-white leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        ) : null}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-[0_12px_40px_0_rgba(25,28,29,0.16)] border border-slate-100 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900">Thông báo</h3>
              {items.length > 0 && (
                <span className="text-xs text-slate-400 font-medium">{items.length} hoạt động</span>
              )}
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto">
              {items.length === 0 ? (
                <div className="py-12 flex flex-col items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl">notifications_none</span>
                  <p className="text-sm font-medium">Chưa có thông báo nào</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {items.map((item) => {
                    const unread = !seenIds.has(item.id);
                    return (
                      <Link
                        key={item.id}
                        to={item.href}
                        onClick={() => setOpen(false)}
                        className={`flex items-start gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors ${unread ? 'bg-primary/[0.03]' : ''}`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${item.iconClass}`}>
                          <span
                            className="material-symbols-outlined text-[18px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            {item.icon}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm leading-snug ${unread ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5 truncate">{item.body}</p>
                          <p className="text-[10px] text-slate-400 mt-1 font-medium">{fmtRelTime(item.time)}</p>
                        </div>
                        {unread && (
                          <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/60">
              <Link
                to="/my-bookings"
                onClick={() => setOpen(false)}
                className="text-xs font-bold text-primary hover:underline"
              >
                Xem tất cả chuyến đi →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
