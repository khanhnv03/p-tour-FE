import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { createBooking, getBooking, type Booking } from '../api/bookings';
import { applyPromoCode, findBestAutoApply, type ApplyDealResult } from '../api/deals';
import { createOrder, findOrderByBooking, mockPay, type Order, type PaymentMethod } from '../api/orders';
import { getTourById, type TourDetail } from '../api/tours';
import { extractApiErrorMessage } from '../api/types';
import { getProfile } from '../api/users';
import UserNavbar from '../components/UserNavbar';

type CheckoutState = {
  bookingId?: number;
  tourId?: number;
  departureId?: number;
  guestCount?: number;
};

type AppliedDeal = ApplyDealResult & { source: 'promo' | 'auto' };

const PAYMENT_OPTIONS: { value: PaymentMethod; title: string; description: string; icon: string }[] = [
  { value: 'CREDIT_CARD', title: 'Thẻ tín dụng / ghi nợ', description: 'Thanh toán nhanh bằng thẻ', icon: 'credit_card' },
  { value: 'BANK_TRANSFER', title: 'Chuyển khoản', description: 'Tạo đơn hàng và xác nhận thanh toán', icon: 'account_balance' },
  { value: 'MOMO', title: 'MoMo', description: 'Thanh toán qua ví điện tử', icon: 'smartphone' },
  { value: 'VNPAY', title: 'VNPay', description: 'Thanh toán qua cổng VNPay', icon: 'payments' },
];

const fmtCurrency = (value: number) => `${value.toLocaleString('vi-VN')}₫`;
const INPUT_CLASS = 'w-full rounded-2xl border border-surface-container-high bg-surface px-4 py-3.5 text-sm text-on-surface outline-none transition-colors focus:border-primary/40 focus:ring-2 focus:ring-primary/10';
const INPUT_STATIC_CLASS = 'w-full rounded-2xl border border-surface-container-high bg-surface px-4 py-3.5 text-sm';

const fmtDate = (value: string) =>
  new Date(value).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' });

function parsePositiveInt(value: string | null | undefined): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function toNumber(value: number | null | undefined): number {
  return Number(value ?? 0);
}

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const locationState = (location.state as CheckoutState | null) ?? null;

  const requestedBookingId = parsePositiveInt(searchParams.get('bookingId')) ?? locationState?.bookingId ?? null;
  const requestedTourId = parsePositiveInt(searchParams.get('tourId')) ?? locationState?.tourId ?? null;
  const requestedDepartureId = parsePositiveInt(searchParams.get('departureId')) ?? locationState?.departureId ?? null;
  const requestedGuests = parsePositiveInt(searchParams.get('guests')) ?? locationState?.guestCount ?? 1;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [tour, setTour] = useState<TourDetail | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [selectedDepartureId, setSelectedDepartureId] = useState<number | null>(requestedDepartureId);
  const [guestCount, setGuestCount] = useState(Math.max(1, requestedGuests));

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CREDIT_CARD');
  const [cardNumber, setCardNumber] = useState('');

  const [promoCode, setPromoCode] = useState('');
  const [appliedDeal, setAppliedDeal] = useState<AppliedDeal | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoMessage, setPromoMessage] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadCheckout() {
      setLoading(true);
      setError(null);
      try {
        const profilePromise = getProfile().catch(() => null);

        if (requestedBookingId) {
          const [bookingData, existingOrder, profile] = await Promise.all([
            getBooking(requestedBookingId),
            findOrderByBooking(requestedBookingId),
            profilePromise,
          ]);

          if (!mounted) return;

          setBooking(bookingData);
          setOrder(existingOrder);
          setPaymentMethod(existingOrder?.paymentMethod ?? 'CREDIT_CARD');
          setContactName(bookingData.contactName ?? profile?.fullName ?? '');
          setContactEmail(bookingData.contactEmail ?? profile?.email ?? '');
          setContactPhone(bookingData.contactPhone ?? profile?.phone ?? '');
          setNotes(bookingData.notes ?? '');

          try {
            const tourData = await getTourById(bookingData.tourId);
            if (!mounted) return;
            setTour(tourData);
            setSelectedDepartureId(bookingData.departureId);
            setGuestCount(bookingData.guestCount);
          } catch {
            // Keep checkout usable with booking payload only.
          }
        } else {
          if (!requestedTourId) {
            throw new Error('Thiếu thông tin tour để bắt đầu thanh toán.');
          }

          const [tourData, profile] = await Promise.all([
            getTourById(requestedTourId),
            profilePromise,
          ]);

          if (!mounted) return;

          const today = new Date(); today.setHours(0, 0, 0, 0);
          const availableDepartures = tourData.departures.filter((item) => item.status === 'OPEN' && item.availableSlots - item.bookedSlots > 0 && new Date(item.departureDate) >= today);
          const preferredDeparture = availableDepartures.find((item) => item.id === requestedDepartureId) ?? availableDepartures[0];

          if (!preferredDeparture) {
            throw new Error('Tour này hiện chưa có lịch khởi hành khả dụng.');
          }

          const remainingSlots = Math.max(preferredDeparture.availableSlots - preferredDeparture.bookedSlots, 1);

          setTour(tourData);
          setSelectedDepartureId(preferredDeparture.id);
          setGuestCount(Math.min(Math.max(1, requestedGuests), Math.min(tourData.maxGuests, remainingSlots)));
          setContactName(profile?.fullName ?? '');
          setContactEmail(profile?.email ?? '');
          setContactPhone(profile?.phone ?? '');
        }
      } catch (loadError: unknown) {
        setError(loadError instanceof Error ? loadError.message : extractApiErrorMessage(loadError, 'Không thể tải dữ liệu checkout.'));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void loadCheckout();
    return () => {
      mounted = false;
    };
  }, [requestedBookingId, requestedDepartureId, requestedGuests, requestedTourId]);

  const selectedDeparture = tour?.departures.find((item) => item.id === selectedDepartureId) ?? null;
  const remainingSlots = selectedDeparture ? Math.max(selectedDeparture.availableSlots - selectedDeparture.bookedSlots, 0) : 0;
  const unitPrice = selectedDeparture?.priceOverride ?? tour?.pricePerPerson ?? 0;
  const subtotal = booking ? toNumber(booking.subtotal) : unitPrice * guestCount;
  const taxAmount = booking ? toNumber(booking.taxAmount) : Math.round(subtotal * 0.05);

  const pricingKey = `${selectedDepartureId ?? 'none'}:${guestCount}`;

  useEffect(() => {
    if (booking || !tour || !selectedDeparture) return;
    if (appliedDeal?.source === 'promo') {
      setAppliedDeal(null);
      setPromoMessage({ ok: false, text: 'Thông tin chuyến đi đã thay đổi. Hãy áp dụng lại mã ưu đãi nếu cần.' });
    }
  }, [appliedDeal?.source, booking, pricingKey, selectedDeparture, tour]);

  useEffect(() => {
    let mounted = true;

    async function autoApplyDeal() {
      if (booking || !tour || !selectedDeparture) return;
      if (appliedDeal?.source === 'promo') return;
      try {
        const result = await findBestAutoApply(subtotal);
        if (!mounted) return;
        setAppliedDeal(result ? { ...result, source: 'auto' } : null);
      } catch {
        if (mounted && appliedDeal?.source === 'auto') {
          setAppliedDeal(null);
        }
      }
    }

    void autoApplyDeal();
    return () => {
      mounted = false;
    };
  }, [appliedDeal?.source, booking, selectedDeparture, subtotal, tour]);

  const discountAmount = booking ? toNumber(booking.discountAmount) : toNumber(appliedDeal?.discountAmount);
  const totalAmount = booking ? toNumber(booking.totalAmount) : Math.max(subtotal + taxAmount - discountAmount, 0);

  const departureOptions = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return tour?.departures.filter((item) => item.status === 'OPEN' && item.availableSlots - item.bookedSlots > 0 && new Date(item.departureDate) >= today) ?? [];
  }, [tour]);

  const canEditBookingSource = !booking;
  const cardLastFour = cardNumber.replace(/\D/g, '').slice(-4);
  const orderIsSettled = order?.paymentStatus === 'PAID' || order?.paymentStatus === 'REFUNDED';
  const bookingIsSettled = booking?.status === 'CONFIRMED' || booking?.status === 'COMPLETED';
  const existingOrderNotice = order ? (() => {
    switch (order.paymentStatus) {
      case 'PAID':
        return { className: 'border-green-200 bg-green-50 text-green-800', text: 'Order này đã được thanh toán thành công. Checkout hiện ở chế độ chỉ xem.' };
      case 'REFUNDED':
        return { className: 'border-amber-200 bg-amber-50 text-amber-800', text: 'Order này đã được hoàn tiền. Không thể thanh toán lại trên giao dịch hiện tại.' };
      case 'FAILED':
        return { className: 'border-red-200 bg-red-50 text-red-700', text: 'Lần thanh toán trước chưa thành công. Bạn có thể thử thanh toán lại trên cùng order.' };
      default:
        return { className: 'border-amber-200 bg-amber-50 text-amber-800', text: 'Order đã được tạo và đang chờ hoàn tất thanh toán.' };
    }
  })() : null;

  async function handleApplyPromo() {
    if (!promoCode.trim()) {
      setPromoMessage({ ok: false, text: 'Nhập mã ưu đãi trước khi áp dụng.' });
      return;
    }
    setPromoLoading(true);
    setPromoMessage(null);
    try {
      const result = await applyPromoCode(promoCode.trim(), subtotal);
      setAppliedDeal({ ...result, source: 'promo' });
      setPromoMessage({ ok: true, text: result.message });
    } catch (promoError: unknown) {
      setAppliedDeal((current) => (current?.source === 'promo' ? null : current));
      setPromoMessage({ ok: false, text: extractApiErrorMessage(promoError, 'Không thể áp dụng mã ưu đãi.') });
    } finally {
      setPromoLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || orderIsSettled || bookingIsSettled) return;

    setSubmitting(true);
    setError(null);

    try {
      let activeBooking = booking;
      if (!activeBooking) {
        if (!tour || !selectedDeparture) {
          throw new Error('Thiếu thông tin tour hoặc lịch khởi hành.');
        }
        activeBooking = await createBooking({
          tourId: tour.id,
          departureId: selectedDeparture.id,
          guestCount,
          contactName: contactName.trim() || undefined,
          contactEmail: contactEmail.trim() || undefined,
          contactPhone: contactPhone.trim() || undefined,
          notes: notes.trim() || undefined,
          promoCode: appliedDeal?.source === 'promo' ? appliedDeal.promoCode ?? promoCode.trim() : undefined,
          dealId: appliedDeal?.source === 'auto' ? appliedDeal.dealId : undefined,
        });
        setBooking(activeBooking);
      }

      let activeOrder = order;
      if (!activeOrder) {
        activeOrder = await createOrder({
          bookingId: activeBooking.id,
          paymentMethod,
          cardLastFour: paymentMethod === 'CREDIT_CARD' ? cardLastFour : undefined,
        });
        setOrder(activeOrder);
      }

      let finalOrder = activeOrder;
      let paymentState = finalOrder.paymentStatus === 'PAID' ? 'paid' : 'pending';

      if (finalOrder.paymentStatus === 'PENDING' || finalOrder.paymentStatus === 'FAILED') {
        try {
          finalOrder = await mockPay(finalOrder.id);
          setOrder(finalOrder);
          paymentState = finalOrder.paymentStatus === 'PAID' ? 'paid' : 'pending';
        } catch {
          paymentState = 'pending';
        }
      }

      navigate(`/success?bookingId=${activeBooking.id}&orderId=${finalOrder.id}&payment=${paymentState}`, {
        replace: true,
      });
    } catch (submitError: unknown) {
      setError(extractApiErrorMessage(submitError, 'Không thể hoàn tất checkout.'));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <UserNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error || (!booking && !tour)) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <UserNavbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-on-surface-variant px-6 text-center">
          <span className="material-symbols-outlined text-6xl">shopping_cart_checkout</span>
          <p className="text-lg font-semibold">{error ?? 'Không thể mở trang thanh toán.'}</p>
          <Link to="/tours" className="primary-gradient text-white px-6 py-3 rounded-xl font-bold text-sm">
            Chọn tour khác
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      <UserNavbar />

      <main className="max-w-7xl mx-auto w-full px-6 lg:px-8 py-10 flex-1">
        <div className="mb-8">
          <Link to={booking ? `/my-bookings/${booking.id}` : `/tour/${tour?.slug ?? tour?.id}`} className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-base">arrow_back</span>
            {booking ? 'Quay lại booking' : 'Quay lại chi tiết tour'}
          </Link>
          <div className="mt-4 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-secondary mb-2">
                {booking ? 'Thanh toán booking hiện có' : 'Checkout'}
              </p>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight">Hoàn tất đặt tour</h1>
              <p className="text-sm text-on-surface-variant mt-2 max-w-2xl">
                {booking
                  ? 'Booking đã được tạo. Hoàn tất thanh toán để xác nhận chỗ và khóa lịch khởi hành.'
                  : 'Xác nhận thông tin liên hệ, ưu đãi và phương thức thanh toán trước khi tạo booking.'}
              </p>
            </div>
            {booking && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-low text-sm font-semibold text-on-surface">
                <span className="material-symbols-outlined text-primary text-base">confirmation_number</span>
                {booking.bookingCode}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-8 items-start">
          <form onSubmit={handleSubmit} className="space-y-6">
            {booking && (
              <section className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
                <p className="text-sm font-semibold text-amber-800">
                  Booking đang ở trạng thái <strong>{booking.status}</strong>. Bạn đang thanh toán cho booking đã tạo trước đó.
                </p>
              </section>
            )}

            {(bookingIsSettled || orderIsSettled) && (
              <section className="rounded-2xl border border-green-200 bg-green-50 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-sm font-semibold text-green-800">
                  Booking này đã được xác nhận thanh toán. Bạn không cần tạo giao dịch mới.
                </p>
                <Link to={booking ? `/my-bookings/${booking.id}` : '/my-bookings'} className="text-sm font-bold text-green-700 hover:text-green-800">
                  Xem chi tiết
                </Link>
              </section>
            )}

            {existingOrderNotice && (
              <section className={`rounded-2xl border px-5 py-4 ${existingOrderNotice.className}`}>
                <p className="text-sm font-semibold">{existingOrderNotice.text}</p>
              </section>
            )}

            <section className="bg-surface-container-lowest rounded-3xl border border-surface-container-low/60 p-6 lg:p-8 space-y-6">
              <div>
                <h2 className="text-xl font-black tracking-tight">Thông tin liên hệ</h2>
                <p className="text-sm text-on-surface-variant mt-1">Thông tin này sẽ được dùng cho xác nhận booking và e-ticket.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Họ và tên">
                  <input
                    className={INPUT_CLASS}
                    value={contactName}
                    onChange={(event) => setContactName(event.target.value)}
                    placeholder="Nguyen Van A"
                    required
                    disabled={!!booking}
                  />
                </Field>
                <Field label="Email">
                  <input
                    className={INPUT_CLASS}
                    type="email"
                    value={contactEmail}
                    onChange={(event) => setContactEmail(event.target.value)}
                    placeholder="email@example.com"
                    required
                    disabled={!!booking}
                  />
                </Field>
                <Field label="Số điện thoại">
                  <input
                    className={INPUT_CLASS}
                    value={contactPhone}
                    onChange={(event) => setContactPhone(event.target.value)}
                    placeholder="0901 234 567"
                    disabled={!!booking}
                  />
                </Field>
                <Field label="Ghi chú thêm">
                  <input
                    className={INPUT_CLASS}
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Yêu cầu đặc biệt, thời gian liên hệ..."
                    disabled={!!booking}
                  />
                </Field>
              </div>
            </section>

            {tour && canEditBookingSource && (
              <section className="bg-surface-container-lowest rounded-3xl border border-surface-container-low/60 p-6 lg:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-black tracking-tight">Tùy chọn chuyến đi</h2>
                  <p className="text-sm text-on-surface-variant mt-1">Xác nhận lại lịch khởi hành và số lượng khách trước khi tạo booking.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Ngày khởi hành">
                    <select
                      className={INPUT_CLASS}
                      value={selectedDepartureId ?? ''}
                      onChange={(event) => setSelectedDepartureId(Number(event.target.value))}
                    >
                      {departureOptions.map((item) => (
                        <option key={item.id} value={item.id}>
                          {fmtDate(item.departureDate)} - còn {Math.max(item.availableSlots - item.bookedSlots, 0)} chỗ
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Số lượng khách">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="w-11 h-11 rounded-xl border border-surface-container-high bg-surface flex items-center justify-center hover:border-primary/40 hover:text-primary transition-colors"
                        onClick={() => setGuestCount((current) => Math.max(1, current - 1))}
                      >
                        <span className="material-symbols-outlined text-base">remove</span>
                      </button>
                      <div className={`${INPUT_STATIC_CLASS} text-center font-bold`}>{guestCount}</div>
                      <button
                        type="button"
                        className="w-11 h-11 rounded-xl border border-surface-container-high bg-surface flex items-center justify-center hover:border-primary/40 hover:text-primary transition-colors"
                        onClick={() => setGuestCount((current) => Math.min(current + 1, Math.min(tour.maxGuests, remainingSlots || tour.maxGuests)))}
                      >
                        <span className="material-symbols-outlined text-base">add</span>
                      </button>
                    </div>
                    {selectedDeparture && (
                      <p className="text-xs text-on-surface-variant mt-2">
                        Còn lại {remainingSlots} chỗ cho lịch {fmtDate(selectedDeparture.departureDate)}.
                      </p>
                    )}
                  </Field>
                </div>
              </section>
            )}

            {!booking && (
              <section className="bg-surface-container-lowest rounded-3xl border border-surface-container-low/60 p-6 lg:p-8 space-y-5">
                <div>
                  <h2 className="text-xl font-black tracking-tight">Ưu đãi</h2>
                  <p className="text-sm text-on-surface-variant mt-1">Bạn có thể nhập mã giảm giá hoặc dùng ưu đãi tự động nếu hệ thống tìm thấy deal phù hợp.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    className={`${INPUT_CLASS} flex-1`}
                    value={promoCode}
                    onChange={(event) => setPromoCode(event.target.value.toUpperCase())}
                    placeholder="Nhập mã giảm giá"
                  />
                  <button
                    type="button"
                    onClick={() => void handleApplyPromo()}
                    disabled={promoLoading}
                    className="px-5 py-3 rounded-xl font-bold bg-surface-container-high hover:bg-surface-dim transition-colors disabled:opacity-60"
                  >
                    {promoLoading ? 'Đang áp dụng...' : 'Áp dụng'}
                  </button>
                </div>
                {appliedDeal && (
                  <div className={`rounded-xl px-4 py-3 text-sm font-semibold ${appliedDeal.source === 'promo' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                    {appliedDeal.source === 'promo' ? 'Mã đã áp dụng. ' : 'Ưu đãi tự động. '}
                    {appliedDeal.message}
                  </div>
                )}
                {promoMessage && (
                  <p className={`text-sm font-semibold ${promoMessage.ok ? 'text-green-600' : 'text-red-500'}`}>
                    {promoMessage.text}
                  </p>
                )}
              </section>
            )}

            <section className="bg-surface-container-lowest rounded-3xl border border-surface-container-low/60 p-6 lg:p-8 space-y-5">
              <div>
                <h2 className="text-xl font-black tracking-tight">Phương thức thanh toán</h2>
                <p className="text-sm text-on-surface-variant mt-1">
                  {order
                    ? 'Đơn hàng đã được tạo. Bạn đang tiếp tục thanh toán theo phương thức đã chọn trước đó.'
                    : 'Chọn phương thức thanh toán để hoàn tất đặt tour và xác nhận booking.'}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PAYMENT_OPTIONS.map((option) => {
                  const active = paymentMethod === option.value;
                  const disabled = !!order;
                  return (
                    <label
                      key={option.value}
                      className={`rounded-2xl border px-5 py-4 transition-all ${active ? 'border-primary bg-primary/5' : 'border-surface-container-high bg-surface'} ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-primary/40'}`}
                    >
                      <input
                        type="radio"
                        name="payment-method"
                        className="sr-only"
                        checked={active}
                        onChange={() => setPaymentMethod(option.value)}
                        disabled={disabled}
                      />
                      <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-primary mt-0.5">{option.icon}</span>
                        <div>
                          <p className="font-bold text-sm">{option.title}</p>
                          <p className="text-xs text-on-surface-variant mt-1">{option.description}</p>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>

              {paymentMethod === 'CREDIT_CARD' && !order && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Số thẻ">
                    <input
                      className={INPUT_CLASS}
                      inputMode="numeric"
                      value={cardNumber}
                      onChange={(event) => setCardNumber(event.target.value)}
                      placeholder="0000 0000 0000 0000"
                      required
                    />
                  </Field>
                  <Field label="4 số cuối sẽ được lưu">
                    <div className={`${INPUT_STATIC_CLASS} font-semibold text-on-surface-variant`}>
                      {cardLastFour || 'Chưa có thông tin thẻ'}
                    </div>
                  </Field>
                </div>
              )}
            </section>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <p className="text-sm text-on-surface-variant">
                Sau khi thanh toán thành công, booking sẽ được chuyển sang trạng thái <strong>CONFIRMED</strong>.
              </p>
              <button
                type="submit"
                disabled={submitting || orderIsSettled || bookingIsSettled}
                className="primary-gradient text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Đang xử lý...' : booking ? 'Thanh toán và xác nhận' : 'Tạo booking và thanh toán'}
              </button>
            </div>
          </form>

          <aside className="xl:sticky xl:top-24">
            <div className="bg-surface-container-lowest rounded-3xl border border-surface-container-low/60 p-6 space-y-6 shadow-sm">
              <div className="flex gap-4">
                <img
                  src={tour?.coverImageUrl ?? booking?.tourCoverImage ?? `https://picsum.photos/seed/${booking?.tourId ?? tour?.id ?? 'checkout'}/600/400`}
                  alt={booking?.tourTitle ?? tour?.title ?? 'Tour'}
                  className="w-24 h-24 rounded-2xl object-cover"
                />
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary mb-1">
                    {tour ? `${tour.durationDays}N ${tour.durationNights}D` : 'Booking'}
                  </p>
                  <h2 className="font-black text-lg leading-snug">
                    {booking?.tourTitle ?? tour?.title}
                  </h2>
                  <p className="text-sm text-on-surface-variant mt-2">
                    {tour?.destination.name ?? 'Lịch khởi hành đã chọn'}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <SummaryRow label="Ngày khởi hành" value={booking ? fmtDate(booking.departureDate) : selectedDeparture ? fmtDate(selectedDeparture.departureDate) : '--'} />
                <SummaryRow label="Số khách" value={`${booking?.guestCount ?? guestCount} khách`} />
                <SummaryRow label="Trạng thái booking" value={booking?.status ?? 'Chưa tạo'} />
                <SummaryRow label="Trạng thái thanh toán" value={order?.paymentStatus ?? 'Chưa tạo'} />
              </div>

              <div className="border-t border-dashed border-surface-container-high pt-4 space-y-3">
                <SummaryRow label="Tạm tính" value={fmtCurrency(subtotal)} />
                <SummaryRow label="Thuế & phí (5%)" value={fmtCurrency(taxAmount)} />
                <SummaryRow label="Giảm giá" value={discountAmount > 0 ? `- ${fmtCurrency(discountAmount)}` : fmtCurrency(0)} />
                <div className="flex items-center justify-between pt-3 border-t border-surface-container-high">
                  <span className="text-base font-black">Tổng thanh toán</span>
                  <span className="text-2xl font-black text-primary tracking-tight">{fmtCurrency(totalAmount)}</span>
                </div>
              </div>

              {order?.orderCode && (
                <div className="rounded-2xl bg-surface-container-low px-4 py-3">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant mb-1">Mã đơn hàng</p>
                  <p className="font-semibold">{order.orderCode}</p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant">{label}</span>
      {children}
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-on-surface-variant">{label}</span>
      <span className="font-semibold text-right">{value}</span>
    </div>
  );
}
