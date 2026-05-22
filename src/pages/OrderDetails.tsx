import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAdminOrder, refundOrder, type Order, type PaymentMethod, type PaymentStatus } from '../api/orders';
import ConfirmDialog from '../components/ConfirmDialog';
import { extractApiErrorMessage } from '../api/types';

function formatCurrency(value: number | null | undefined) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return 'Chưa có';
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function formatDate(value: string | null | undefined) {
  if (!value) return 'Chưa có';
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(new Date(value));
}

function paymentStatusLabel(status: PaymentStatus) {
  const labels: Record<PaymentStatus, string> = {
    PENDING: 'Chờ thanh toán',
    PAID: 'Đã thanh toán',
    FAILED: 'Thất bại',
    REFUNDED: 'Đã hoàn tiền',
  };
  return labels[status];
}

function paymentMethodLabel(method: PaymentMethod) {
  const labels: Record<PaymentMethod, string> = {
    CREDIT_CARD: 'Thẻ tín dụng',
    BANK_TRANSFER: 'Chuyển khoản',
    MOMO: 'MoMo',
    VNPAY: 'VNPay',
  };
  return labels[method];
}

function StatusBadge({ status }: { status: PaymentStatus }) {
  const map: Record<PaymentStatus, string> = {
    PAID: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    PENDING: 'bg-amber-50 text-amber-700 border-amber-100',
    FAILED: 'bg-slate-100 text-slate-600 border-slate-200',
    REFUNDED: 'bg-red-50 text-red-700 border-red-100',
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-black uppercase tracking-tight ${map[status]}`}>
      {paymentStatusLabel(status)}
    </span>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase();
}

export default function OrderDetails() {
  const { id } = useParams();
  const orderId = Number(id);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refunding, setRefunding] = useState(false);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);

  useEffect(() => {
    if (!Number.isFinite(orderId)) {
      setError('ID đơn hàng không hợp lệ');
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);
    getAdminOrder(orderId)
      .then(data => {
        if (active) setOrder(data);
      })
      .catch(err => {
        if (active) setError(err instanceof Error ? err.message : 'Không thể tải chi tiết đơn hàng');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [orderId]);

  const events = useMemo(() => {
    if (!order) return [];
    const items = [
      {
        title: 'Đã tạo đơn hàng',
        time: order.createdAt,
        desc: `Đơn hàng được tạo từ booking ${order.bookingCode}.`,
        primary: false,
      },
    ];
    if (order.paidAt) {
      items.unshift({
        title: 'Thanh toán thành công',
        time: order.paidAt,
        desc: order.transactionRef ? `Mã giao dịch: ${order.transactionRef}` : 'Đơn hàng đã được ghi nhận thanh toán.',
        primary: order.paymentStatus === 'PAID',
      });
    }
    if (order.refundedAt) {
      items.unshift({
        title: 'Đã hoàn tiền',
        time: order.refundedAt,
        desc: 'Đơn hàng đã được hoàn tiền và booking liên quan đã bị hủy.',
        primary: true,
      });
    }
    return items;
  }, [order]);

  const handleRefund = async () => {
    if (!order) return;
    setRefunding(true);
    setError(null);
    try {
      const refunded = await refundOrder(order.id);
      setOrder(refunded);
      setRefundDialogOpen(false);
    } catch (err: unknown) {
      setError(extractApiErrorMessage(err, 'Hoàn tiền thất bại'));
    } finally {
      setRefunding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-sm font-bold text-slate-400">Đang tải chi tiết đơn hàng...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col flex-1 p-6 lg:p-8 gap-4">
        <Link to="/admin/orders" className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Đơn hàng
        </Link>
        <div className="rounded-xl border border-red-100 bg-red-50 text-red-700 px-4 py-3 text-sm font-semibold">
          {error ?? 'Không tìm thấy đơn hàng'}
        </div>
      </div>
    );
  }

  return (
    <>
      <ConfirmDialog
        open={refundDialogOpen}
        title="Hoàn tiền đơn hàng"
        message="Hệ thống sẽ hoàn tiền và cập nhật booking liên quan theo trạng thái mới."
        confirmLabel="Hoàn tiền"
        cancelLabel="Hủy"
        tone="danger"
        pending={refunding}
        onCancel={() => {
          if (!refunding) setRefundDialogOpen(false);
        }}
        onConfirm={() => void handleRefund()}
        detail={order ? (
          <div>
            <p className="font-semibold text-on-surface">#{order.orderCode}</p>
            <p className="text-xs mt-1">Số tiền: {formatCurrency(order.amount)}</p>
          </div>
        ) : undefined}
      />

      <div className="flex flex-col flex-1 overflow-y-auto">
      <div className="px-6 lg:px-8 py-5 border-b border-black/5 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors mb-2"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Đơn hàng
          </Link>
          <h1 className="text-xl font-black text-on-surface leading-tight">Đơn hàng #{order.orderCode}</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Ngày tạo: {formatDateTime(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={order.paymentStatus} />
          {order.paymentStatus === 'PAID' && (
            <button
              onClick={() => setRefundDialogOpen(true)}
              disabled={refunding}
              className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all active:scale-95 disabled:opacity-60"
            >
              {refunding ? 'Đang hoàn tiền...' : 'Hoàn tiền'}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 p-6 lg:p-8 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <section className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-6">
            <div className="flex justify-between items-start mb-5 gap-3">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">explore</span>
                Thông tin tour
              </h3>
              <span className="bg-primary/5 border border-primary/20 text-primary px-3 py-1 rounded-full text-xs font-black uppercase tracking-tight">
                Booking {order.bookingCode}
              </span>
            </div>
            <div className="flex flex-col md:flex-row gap-5">
              <div className="w-full md:w-44 h-28 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                {order.tourCoverImage ? (
                  <img className="w-full h-full object-cover" alt={order.tourTitle} src={order.tourCoverImage} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <span className="material-symbols-outlined text-4xl">image</span>
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <h4 className="text-lg font-bold text-on-surface">{order.tourTitle}</h4>
                <div className="flex flex-wrap gap-4 pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-slate-400">calendar_today</span>
                    <span className="text-sm font-semibold text-on-surface">{formatDate(order.departureDate)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-slate-400">group</span>
                    <span className="text-sm font-semibold text-on-surface">{order.guestCount} khách</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-slate-400">confirmation_number</span>
                    <span className="text-sm font-semibold text-on-surface">Booking ID {order.bookingId}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-6">
              <h3 className="text-base font-bold text-on-surface mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">person</span>
                Khách hàng
              </h3>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-base">
                  {initials(order.userName)}
                </div>
                <div>
                  <p className="font-bold text-on-surface">{order.userName}</p>
                  <p className="text-xs text-slate-400">User ID {order.userId}</p>
                </div>
              </div>
              <Link
                to={`/admin/customers/${order.userId}`}
                className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-slate-100 hover:bg-primary hover:text-white text-slate-600 px-3 py-2 rounded-lg transition-all"
              >
                Mở hồ sơ khách hàng
              </Link>
            </section>

            <section className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-6">
              <h3 className="text-base font-bold text-on-surface mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">payments</span>
                Thanh toán
              </h3>
              <div className="bg-slate-50 p-4 rounded-xl mb-5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Tổng tiền</p>
                <p className="text-3xl font-black text-on-surface">{formatCurrency(order.amount)}</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between gap-4">
                  <span className="text-sm text-slate-400">Trạng thái</span>
                  <span className="text-sm font-bold text-on-surface">{paymentStatusLabel(order.paymentStatus)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-sm text-slate-400">Phương thức</span>
                  <span className="text-sm font-semibold text-on-surface">{paymentMethodLabel(order.paymentMethod)}</span>
                </div>
                {order.cardLastFour && (
                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-slate-400">Thẻ</span>
                    <span className="text-sm font-semibold text-on-surface">•••• {order.cardLastFour}</span>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <span className="text-sm text-slate-400">Mã giao dịch</span>
                  <span className="text-sm font-mono text-slate-500 text-right">{order.transactionRef ?? 'Chưa có'}</span>
                </div>
              </div>
            </section>
          </div>

          <section className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-6">
            <h3 className="text-base font-bold text-on-surface mb-7 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">history</span>
              Nhật ký hoạt động
            </h3>
            <div className="relative space-y-6 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
              {events.map((event, index) => (
                <div key={`${event.title}-${index}`} className="relative pl-9">
                  <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center z-10 ${event.primary ? 'bg-primary' : 'bg-slate-100'}`}>
                    {event.primary ? (
                      <span className="material-symbols-outlined text-xs text-white" style={{ fontVariationSettings: "'wght' 700" }}>done</span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-400" />
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-1">
                    <h4 className="font-bold text-on-surface text-sm">{event.title}</h4>
                    <span className="text-xs text-slate-400 font-medium">{formatDateTime(event.time)}</span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">{event.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-5">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Mốc thanh toán</h3>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-black/5 pb-2">
                <span className="text-sm text-slate-400">Đã thanh toán lúc</span>
                <span className="text-sm font-semibold text-on-surface text-right">{formatDateTime(order.paidAt)}</span>
              </div>
              <div className="flex justify-between border-b border-black/5 pb-2">
                <span className="text-sm text-slate-400">Đã hoàn tiền lúc</span>
                <span className="text-sm font-semibold text-on-surface text-right">{formatDateTime(order.refundedAt)}</span>
              </div>
            </div>
          </div>

          <div className="primary-gradient rounded-2xl p-6 text-white relative overflow-hidden group">
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[80px] text-white/10 group-hover:scale-110 transition-transform duration-700 select-none">receipt_long</span>
            <div className="relative z-10">
              <h3 className="text-base font-bold mb-1.5">Tổng quan đơn</h3>
              <p className="text-white/70 text-sm mb-5 leading-relaxed">Đơn hàng liên kết với booking {order.bookingCode} và khách hàng {order.userName}.</p>
              <Link
                to={`/admin/customers/${order.userId}`}
                className="inline-flex items-center gap-2 font-bold text-sm bg-white text-primary px-5 py-2.5 rounded-xl transition-transform active:scale-95"
              >
                <span className="material-symbols-outlined text-lg">person</span>
                Hồ sơ khách
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] p-5">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Thao tác khả dụng</h3>
            <div className="grid grid-cols-1 gap-2">
              {order.paymentStatus === 'PAID' ? (
                <button
                  onClick={() => setRefundDialogOpen(true)}
                  disabled={refunding}
                  className="flex items-center justify-center gap-2 p-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-all font-bold text-xs uppercase tracking-widest disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-xl">undo</span>
                  {refunding ? 'Đang hoàn tiền' : 'Hoàn tiền đơn hàng'}
                </button>
              ) : (
                <div className="rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">
                  Không có thao tác thanh toán bổ sung cho trạng thái hiện tại.
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
      </div>
    </>
  );
}
