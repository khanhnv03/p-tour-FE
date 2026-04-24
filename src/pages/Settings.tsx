import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  changePassword, getNotificationPreferences, updateNotificationPreferences,
  getProfile, updateProfile,
  type NotificationPreferences, type UserProfile,
} from '../api/users';

const TABS = [
  { id: 'profile', label: 'Hồ sơ cá nhân', icon: 'manage_accounts' },
  { id: 'auth',    label: 'Đổi mật khẩu',  icon: 'lock' },
  { id: 'notify',  label: 'Thông báo',      icon: 'notifications' },
] as const;

type TabId = typeof TABS[number]['id'];

function tabFromSearch(s: string): TabId {
  const p = new URLSearchParams(s).get('tab');
  if (p === 'auth' || p === 'notify') return p;
  return 'profile';
}

export default function Settings() {
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState<TabId>(() => tabFromSearch(location.search));
  useEffect(() => { setActive(tabFromSearch(location.search)); }, [location.search]);

  function handleTab(id: TabId) {
    setActive(id);
    navigate(`/admin/settings?tab=${id}`, { replace: true });
  }

  return (
    <div className="flex flex-col flex-1 p-6 lg:p-8 min-h-0">
      {/* Page header */}
      <header className="mb-6 shrink-0">
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2">
          <span>Quản trị</span>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-secondary">Cài đặt</span>
        </nav>
        <h1 className="text-3xl font-black text-on-surface tracking-tight">Cài đặt</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Tinh chỉnh hệ thống và quản lý quyền truy cập quản trị.
        </p>
      </header>

      {/* Main card — fills all remaining vertical space */}
      <div className="flex flex-1 min-h-0 rounded-2xl overflow-hidden shadow-[0_4px_32px_rgba(0,0,0,0.08)] border border-black/5">
        {/* Left sidebar */}
        <aside className="w-60 shrink-0 bg-[#f5f6f8] border-r border-black/5 flex flex-col">
          <div className="px-5 pt-6 pb-2">
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-gray-400">Tài khoản</p>
          </div>

          <nav className="flex flex-col px-3 gap-0.5 flex-1 pt-1">
            {TABS.map((tab) => {
              const isActive = active === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-left transition-all duration-150 ${
                    isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'text-gray-500 hover:bg-white hover:text-gray-800 hover:shadow-sm'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[18px] shrink-0 ${
                      isActive ? 'text-white' : 'text-gray-400'
                    }`}
                  >
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Version badge */}
          <div className="px-4 pb-5 pt-3 border-t border-black/5 mt-3">
            <div className="rounded-xl bg-blue-50 border border-blue-100 px-3 py-2.5">
              <p className="text-xs font-bold text-blue-700">Phiên bản hệ thống</p>
              <p className="text-[11px] text-blue-500 mt-0.5">v2.4.1 · Ổn định</p>
            </div>
          </div>
        </aside>

        {/* Right content — scrollable */}
        <div className="flex-1 min-h-0 overflow-y-auto bg-white flex flex-col">
          <AnimatePresence mode="wait">
            {active === 'profile' && <ProfileTab key="profile" />}
            {active === 'auth'    && <PasswordTab key="auth" />}
            {active === 'notify'  && <NotificationsTab key="notify" />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ─── shared tab wrapper ─── */
function TabPane({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 14 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -14 }}
      transition={{ duration: 0.18 }}
      className="flex flex-col flex-1"
    >
      {children}
    </motion.div>
  );
}

/* ─── Profile ─── */
function ProfileTab() {
  const [profile,   setProfile]   = useState<UserProfile | null>(null);
  const [lastName,  setLastName]  = useState('');
  const [firstName, setFirstName] = useState('');
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    getProfile().then((p) => {
      setProfile(p);
      const parts = (p.fullName ?? '').split(' ');
      setLastName(parts[0] ?? '');
      setFirstName(parts.slice(1).join(' '));
    }).finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setSaving(true);
    try {
      const updated = await updateProfile({
        fullName: [lastName, firstName].filter(Boolean).join(' '),
      });
      setProfile(updated);
      setMsg({ ok: true, text: 'Đã lưu hồ sơ thành công.' });
    } catch (err: any) {
      setMsg({ ok: false, text: err?.response?.data?.message ?? 'Có lỗi xảy ra.' });
    } finally {
      setSaving(false);
    }
  }

  const displayName = [lastName, firstName].filter(Boolean).join(' ') || 'Quản trị viên';

  return (
    <TabPane>
      <div className="px-8 py-5 border-b border-gray-100 shrink-0">
        <h2 className="text-lg font-bold text-gray-900">Hồ sơ cá nhân</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Cập nhật thông tin hiển thị công khai của bạn.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        <div className="flex-1 px-8 py-7 flex flex-col gap-8">

          {/* Avatar banner */}
          <div className="flex items-center gap-6 p-6 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-sky-50 border border-blue-100">
            <div className="relative shrink-0 group cursor-pointer">
              <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-white shadow-lg">
                <img
                  src={
                    profile?.avatarUrl ??
                    `https://picsum.photos/seed/${profile?.id ?? 'admin'}/200/200`
                  }
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 rounded-2xl bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white text-[18px]">photo_camera</span>
                <span className="text-white text-[9px] font-bold mt-0.5">Thay đổi</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-black text-gray-900 truncate">{displayName}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{profile?.email ?? ''}</p>
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                  <span className="material-symbols-outlined text-[12px]">verified</span>
                  Quản trị viên
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                  <span className="material-symbols-outlined text-[12px]">circle</span>
                  Hoạt động
                </span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center py-16">
              <div className="w-8 h-8 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Personal info section */}
              <section>
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-4">
                  Thông tin cá nhân
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                  <Field label="Họ">
                    <input
                      className="settings-input"
                      type="text"
                      value={lastName}
                      placeholder="Nhập họ"
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </Field>
                  <Field label="Tên">
                    <input
                      className="settings-input"
                      type="text"
                      value={firstName}
                      placeholder="Nhập tên"
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </Field>
                  <Field label="Địa chỉ email" hint="Email không thể thay đổi">
                    <input
                      className="settings-input opacity-55 cursor-not-allowed"
                      type="email"
                      value={profile?.email ?? ''}
                      readOnly
                    />
                  </Field>
                  <Field label="Số điện thoại">
                    <input
                      className="settings-input"
                      type="tel"
                      placeholder="+84 xxx xxx xxx"
                    />
                  </Field>
                </div>
              </section>

              {/* Account info section */}
              <section>
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-4">
                  Thông tin tài khoản
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                  <Field label="Vai trò">
                    <div className="settings-input opacity-55 cursor-not-allowed flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[16px]">
                        admin_panel_settings
                      </span>
                      Quản trị viên
                    </div>
                  </Field>
                  <Field label="Mã người dùng">
                    <div className="settings-input opacity-55 cursor-not-allowed font-mono text-xs tracking-wide">
                      {profile?.id ? `#${profile.id}` : '—'}
                    </div>
                  </Field>
                </div>
              </section>

              {msg && (
                <p
                  className={`text-xs font-semibold px-4 py-2.5 rounded-lg w-fit ${
                    msg.ok
                      ? 'bg-green-50 text-green-600 border border-green-200'
                      : 'bg-red-50 text-red-500 border border-red-200'
                  }`}
                >
                  {msg.ok ? '✓ ' : '✕ '}{msg.text}
                </p>
              )}
            </>
          )}
        </div>

        {/* Sticky bottom actions */}
        <div className="shrink-0 px-8 py-4 border-t border-gray-100 bg-white flex justify-end items-center gap-3">
          <button
            type="button"
            className="px-5 py-2 text-sm text-gray-500 font-semibold hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={saving || loading}
            className="settings-btn-primary flex items-center gap-2"
          >
            {saving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">save</span>
                Lưu hồ sơ
              </>
            )}
          </button>
        </div>
      </form>
    </TabPane>
  );
}

/* ─── Password ─── */
function PasswordTab() {
  const [current, setCurrent] = useState('');
  const [next,    setNext]    = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext,    setShowNext]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (next !== confirm) {
      setMsg({ ok: false, text: 'Mật khẩu xác nhận không khớp.' });
      return;
    }
    setLoading(true);
    try {
      await changePassword(current, next);
      setMsg({ ok: true, text: 'Đổi mật khẩu thành công!' });
      setCurrent(''); setNext(''); setConfirm('');
    } catch (err: any) {
      setMsg({ ok: false, text: err?.response?.data?.message ?? 'Có lỗi xảy ra.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <TabPane>
      <div className="px-8 py-5 border-b border-gray-100 shrink-0">
        <h2 className="text-lg font-bold text-gray-900">Đổi mật khẩu</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Đảm bảo tài khoản được bảo vệ bằng mật khẩu mạnh.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        <div className="flex-1 px-8 py-7 flex flex-col gap-6">
          {/* Security notice */}
          <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-amber-50 border border-amber-100">
            <span className="material-symbols-outlined text-amber-500 text-[18px] mt-0.5 shrink-0">
              shield
            </span>
            <p className="text-xs text-amber-700 leading-relaxed">
              Mật khẩu mới phải có ít nhất <strong>6 ký tự</strong>. Sau khi đổi, bạn sẽ
              cần đăng nhập lại trên các thiết bị khác.
            </p>
          </div>

          <section>
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-4">
              Thay đổi mật khẩu
            </p>
            <div className="flex flex-col gap-5 max-w-lg">
              <Field label="Mật khẩu hiện tại">
                <PasswordInput
                  value={current}
                  show={showCurrent}
                  onToggle={() => setShowCurrent((v) => !v)}
                  onChange={(e) => setCurrent(e.target.value)}
                  placeholder="Nhập mật khẩu hiện tại"
                  required
                />
              </Field>
              <div className="h-px bg-gray-100" />
              <Field label="Mật khẩu mới">
                <PasswordInput
                  value={next}
                  show={showNext}
                  onToggle={() => setShowNext((v) => !v)}
                  onChange={(e) => setNext(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  required
                  minLength={6}
                />
              </Field>
              <Field label="Xác nhận mật khẩu mới">
                <PasswordInput
                  value={confirm}
                  show={showConfirm}
                  onToggle={() => setShowConfirm((v) => !v)}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  required
                />
              </Field>
            </div>
          </section>

          {msg && (
            <p
              className={`text-xs font-semibold px-4 py-2.5 rounded-lg w-fit ${
                msg.ok
                  ? 'bg-green-50 text-green-600 border border-green-200'
                  : 'bg-red-50 text-red-500 border border-red-200'
              }`}
            >
              {msg.ok ? '✓ ' : '✕ '}{msg.text}
            </p>
          )}
        </div>

        <div className="shrink-0 px-8 py-4 border-t border-gray-100 bg-white flex justify-end items-center gap-3">
          <button
            type="button"
            className="px-5 py-2 text-sm text-gray-500 font-semibold hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="settings-btn-primary flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang cập nhật...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">lock_reset</span>
                Cập nhật mật khẩu
              </>
            )}
          </button>
        </div>
      </form>
    </TabPane>
  );
}

/* ─── Notifications ─── */
function NotificationsTab() {
  const [prefs, setPrefs] = useState<NotificationPreferences>({
    bookingAlerts: true,
    editorialComments: true,
    systemStatus: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  useEffect(() => {
    getNotificationPreferences().then(setPrefs).finally(() => setLoading(false));
  }, []);

  async function handleToggle(key: keyof NotificationPreferences) {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    setSaving(true);
    setSaved(false);
    try {
      await updateNotificationPreferences(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  const groups: {
    label: string;
    icon: string;
    items: { key: keyof NotificationPreferences; title: string; desc: string }[];
  }[] = [
    {
      label: 'Hoạt động',
      icon: 'bolt',
      items: [
        {
          key: 'bookingAlerts',
          title: 'Đặt chỗ mới',
          desc: 'Nhận thông báo ngay khi có lượt đặt tour mới từ khách hàng.',
        },
        {
          key: 'editorialComments',
          title: 'Bình luận biên tập',
          desc: 'Cảnh báo khi cộng tác viên bình luận hoặc phản hồi bản nháp bài viết.',
        },
      ],
    },
    {
      label: 'Hệ thống',
      icon: 'settings_applications',
      items: [
        {
          key: 'systemStatus',
          title: 'Trạng thái hệ thống',
          desc: 'Báo cáo hàng tháng về thời gian hoạt động và hiệu suất.',
        },
      ],
    },
  ];

  return (
    <TabPane>
      <div className="px-8 py-5 border-b border-gray-100 shrink-0 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Thông báo</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Tùy chỉnh cách bạn nhận cảnh báo từ hệ thống.
          </p>
        </div>
        <AnimatePresence>
          {saving && (
            <motion.span
              key="saving"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-xs text-gray-400 flex items-center gap-1"
            >
              <span className="w-3 h-3 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
              Đang lưu...
            </motion.span>
          )}
          {saved && !saving && (
            <motion.span
              key="saved"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs text-green-600 font-bold flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              Đã lưu
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 px-8 py-7 flex flex-col gap-8">
        {loading ? (
          <div className="flex-1 flex items-center justify-center py-20">
            <div className="w-8 h-8 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : groups.map((group) => (
          <section key={group.label}>
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-gray-400 text-[16px]">
                {group.icon}
              </span>
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">
                {group.label}
              </p>
            </div>
            <div className="flex flex-col gap-2.5">
              {group.items.map((item) => (
                <label
                  key={item.key}
                  className="flex items-center justify-between px-5 py-4 rounded-xl bg-gray-50 hover:bg-gray-100/80 cursor-pointer transition-colors border border-black/4"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                        prefs[item.key] ? 'bg-primary' : 'bg-gray-300'
                      }`}
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  <div className="relative shrink-0 ml-8">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={prefs[item.key]}
                      onChange={() => handleToggle(item.key)}
                    />
                    <div className="w-10 h-[22px] rounded-full bg-gray-200 peer-checked:bg-primary transition-colors relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-[18px] after:h-[18px] after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-[18px]" />
                  </div>
                </label>
              ))}
            </div>
          </section>
        ))}
      </div>
    </TabPane>
  );
}

/* ─── helpers ─── */
function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-600">{label}</span>
        {hint && <span className="text-[10px] text-gray-400">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function PasswordInput({
  value,
  show,
  onToggle,
  onChange,
  placeholder,
  required,
  minLength,
}: {
  value: string;
  show: boolean;
  onToggle: () => void;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <div className="relative">
      <input
        className="settings-input pr-10"
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">
          {show ? 'visibility_off' : 'visibility'}
        </span>
      </button>
    </div>
  );
}
