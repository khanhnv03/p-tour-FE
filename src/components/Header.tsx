import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { listAdminBookings, listAdminOrders, listContacts } from '../api/admin';

const FALLBACK_AVATAR = 'https://picsum.photos/seed/admin/200/200';

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Vừa xong';
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  return `${Math.floor(hours / 24)} ngày trước`;
}

type AdminNotification = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  icon: string;
  iconClassName: string;
  to: string;
};

export default function Header() {
  const { user, logout } = useAuth();
  const displayName = user?.fullName || user?.email || 'Admin';
  const avatarSrc = user?.avatarUrl || FALLBACK_AVATAR;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [totalNew, setTotalNew] = useState(0);
  const [notifLoading, setNotifLoading] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    setNotifLoading(true);
    try {
      const [contacts, bookings, orders] = await Promise.all([
        listContacts({ status: 'NEW', size: 4, page: 0 }),
        listAdminBookings({ status: 'PENDING', size: 4, page: 0 }),
        listAdminOrders({ status: 'PENDING', size: 4, page: 0, sort: 'createdAt,desc' }),
      ]);

      const items: AdminNotification[] = [
        ...contacts.content.map(contact => ({
          id: `contact-${contact.id}`,
          title: `Liên hệ mới từ ${contact.fullName}`,
          description: contact.subject,
          createdAt: contact.createdAt,
          icon: 'mark_email_unread',
          iconClassName: 'bg-blue-100 text-blue-600',
          to: '/admin/support',
        })),
        ...bookings.content.map(booking => ({
          id: `booking-${booking.id}`,
          title: `Booking chờ xác nhận ${booking.bookingCode}`,
          description: `${booking.contactName} - ${booking.tourTitle}`,
          createdAt: booking.createdAt,
          icon: 'confirmation_number',
          iconClassName: 'bg-amber-100 text-amber-700',
          to: '/admin/orders',
        })),
        ...orders.content.map(order => ({
          id: `order-${order.id}`,
          title: `Đơn chờ thanh toán ${order.orderCode}`,
          description: `${order.userName} - ${order.tourTitle}`,
          createdAt: order.createdAt,
          icon: 'payments',
          iconClassName: 'bg-emerald-100 text-emerald-700',
          to: `/admin/orders/${order.id}`,
        })),
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8);

      setNotifications(items);
      setTotalNew(contacts.totalElements + bookings.totalElements + orders.totalElements);
    } catch {
      // silently fail — notification bell is non-critical
    } finally {
      setNotifLoading(false);
    }
  }, []);

  // Fetch on mount to populate badge count
  useEffect(() => {
    void fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotifToggle = () => {
    const opening = !isNotifOpen;
    setIsNotifOpen(opening);
    setIsDropdownOpen(false);
    if (opening) void fetchNotifications();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl px-8 py-4 flex justify-between items-center shadow-[0_8px_32px_0_rgba(25,28,29,0.06)]">
      <div className="flex items-center bg-surface-container-highest rounded-full px-4 py-2 w-96">
        <span className="material-symbols-outlined text-outline">search</span>
        <input
          className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-outline ml-2 outline-none"
          placeholder="Tìm kiếm tour, đặt chỗ, hoặc người dùng..."
          type="text"
        />
      </div>

      <div className="flex items-center space-x-6">
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={handleNotifToggle}
            className="relative p-2 text-on-surface-variant hover:bg-slate-100 rounded-full transition-colors focus:outline-none"
          >
            <span className="material-symbols-outlined">notifications</span>
            {totalNew > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-white" />
            )}
          </button>

          <AnimatePresence>
            {isNotifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-80 bg-surface-container-lowest rounded-2xl shadow-[0_8px_32px_0_rgba(25,28,29,0.12)] border border-outline-variant/20 py-2 z-50 overflow-hidden"
              >
                {/* Header */}
                <div className="px-4 py-3 border-b border-outline-variant/20 flex items-center justify-between">
                  <p className="font-black text-sm text-on-surface">Thông báo</p>
                  {totalNew > 0 && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-secondary text-white">
                      {totalNew} mới
                    </span>
                  )}
                </div>

                {/* List */}
                {notifLoading ? (
                  <div className="px-4 py-6 text-center text-sm text-slate-400 font-semibold">
                    Đang tải...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined text-3xl text-slate-300">inbox</span>
                    <p className="text-sm text-slate-400 font-semibold">Không có thông báo mới</p>
                  </div>
                ) : (
                  <div className="max-h-72 overflow-y-auto divide-y divide-outline-variant/10">
                    {notifications.map(item => (
                      <Link
                        key={item.id}
                        to={item.to}
                        onClick={() => setIsNotifOpen(false)}
                        className="block px-4 py-3 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${item.iconClassName}`}>
                            <span
                              className="material-symbols-outlined text-sm"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              {item.icon}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-on-surface truncate">{item.title}</p>
                            <p className="text-xs text-slate-500 font-medium truncate">{item.description}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                              {formatTimeAgo(item.createdAt)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Footer link */}
                <div className="px-4 py-3 border-t border-outline-variant/20">
                  <Link
                    to="/admin/support"
                    onClick={() => setIsNotifOpen(false)}
                    className="flex items-center justify-center gap-2 text-xs font-black text-primary hover:text-primary/80 transition-colors uppercase tracking-widest"
                  >
                    Xem trung tâm hỗ trợ
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-3 pl-4 border-l border-outline-variant/30 focus:outline-none group"
          >
            <div className="text-right">
              <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{displayName}</p>
              <p className="text-xs text-on-surface-variant">Quản trị viên</p>
            </div>
            <img
              alt={displayName}
              className={`w-10 h-10 rounded-full object-cover shadow-sm bg-white border-2 transition-colors ${isDropdownOpen ? 'border-primary' : 'border-transparent group-hover:border-primary/50'}`}
              src={avatarSrc}
              referrerPolicy="no-referrer"
            />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-56 bg-surface-container-lowest rounded-2xl shadow-[0_8px_32px_0_rgba(25,28,29,0.12)] border border-outline-variant/20 py-2 z-50 overflow-hidden"
              >
                <div className="py-2">
                  <Link
                    onClick={() => setIsDropdownOpen(false)}
                    to="/admin/settings?tab=profile"
                    className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">person</span>
                    Hồ sơ cá nhân
                  </Link>
                  <Link
                    onClick={() => setIsDropdownOpen(false)}
                    to="/admin/settings?tab=auth"
                    className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">password</span>
                    Đổi mật khẩu
                  </Link>
                  <Link
                    onClick={() => setIsDropdownOpen(false)}
                    to="/admin/settings?tab=notify"
                    className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">notifications</span>
                    Thông báo
                  </Link>
                </div>

                <div className="border-t border-outline-variant/20 pt-2">
                  <button
                    onClick={() => { setIsDropdownOpen(false); logout(); }}
                    className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-error hover:bg-error/10 transition-colors w-full text-left"
                  >
                    <span className="material-symbols-outlined text-lg">logout</span>
                    Đăng xuất
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
