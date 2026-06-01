import { useState, useEffect, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProfile, updateProfile, changePassword, type UserProfile } from '../api/users';
import { useAuth } from '../context/AuthContext';
import { extractApiErrorMessage } from '../api/types';

const FALLBACK_AVATAR = 'https://picsum.photos/seed/user/200/200';

export default function UserProfilePage() {
  const { refreshUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    getProfile()
      .then(p => {
        setProfile(p);
        setFullName(p.fullName ?? '');
        setPhone(p.phone ?? '');
        setAddress(p.address ?? '');
        setAvatarUrl(p.avatarUrl ?? '');
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleProfileSave(e: FormEvent) {
    e.preventDefault();
    setProfileMsg(null);
    setProfileSaving(true);
    try {
      const updated = await updateProfile({ fullName, phone, address, avatarUrl });
      setProfile(updated);
      await refreshUser();
      setProfileMsg({ ok: true, text: 'Cập nhật thông tin thành công.' });
    } catch (err) {
      setProfileMsg({ ok: false, text: extractApiErrorMessage(err, 'Không thể cập nhật thông tin.') });
    } finally {
      setProfileSaving(false);
    }
  }

  async function handlePasswordSave(e: FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPwdMsg({ ok: false, text: 'Mật khẩu xác nhận không khớp.' });
      return;
    }
    setPwdMsg(null);
    setPwdSaving(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPwdMsg({ ok: true, text: 'Đổi mật khẩu thành công.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPwdMsg({ ok: false, text: extractApiErrorMessage(err, 'Không thể đổi mật khẩu.') });
    } finally {
      setPwdSaving(false);
    }
  }

  const tabs = [
    { key: 'profile', label: 'Thông tin cá nhân', icon: 'person' },
    { key: 'password', label: 'Đổi mật khẩu', icon: 'lock' },
  ];

  if (loading) {
    return <div className="p-10 text-center text-slate-400 font-semibold">Đang tải...</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-black text-on-surface mb-6">Trang cá nhân</h2>

      <div className="flex gap-1 mb-8 border-b border-outline-variant/20">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setSearchParams({ tab: tab.key })}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold transition-colors border-b-2 -mb-px ${
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-base">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="max-w-xl">
          <div className="flex items-center gap-5 mb-8 p-5 bg-surface-container-low rounded-2xl">
            <img
              src={avatarUrl || FALLBACK_AVATAR}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md shrink-0"
            />
            <div>
              <p className="font-black text-on-surface text-lg">{profile?.fullName || '—'}</p>
              <p className="text-sm text-slate-500">{profile?.email}</p>
              <p className="text-xs text-slate-400 mt-1">
                Thành viên từ {profile ? new Date(profile.createdAt).toLocaleDateString('vi-VN') : ''}
              </p>
            </div>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-on-surface mb-1.5">Họ và tên</label>
              <input
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full rounded-xl border border-outline-variant/30 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-1.5">Số điện thoại</label>
              <input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full rounded-xl border border-outline-variant/30 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="0912 345 678"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-1.5">Địa chỉ</label>
              <input
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full rounded-xl border border-outline-variant/30 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="123 Đường ABC, Quận 1, TP.HCM"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-1.5">URL ảnh đại diện</label>
              <input
                value={avatarUrl}
                onChange={e => setAvatarUrl(e.target.value)}
                className="w-full rounded-xl border border-outline-variant/30 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="https://..."
              />
            </div>

            {profileMsg && (
              <div className={`rounded-xl px-4 py-3 text-sm font-semibold ${profileMsg.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                {profileMsg.text}
              </div>
            )}

            <button
              type="submit"
              disabled={profileSaving}
              className="primary-gradient text-white px-8 py-3 rounded-xl font-bold text-sm disabled:opacity-60 transition-opacity"
            >
              {profileSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'password' && (
        <div className="max-w-md">
          <form onSubmit={handlePasswordSave} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-on-surface mb-1.5">Mật khẩu hiện tại</label>
              <input
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-outline-variant/30 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-1.5">Mật khẩu mới</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-xl border border-outline-variant/30 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-1.5">Xác nhận mật khẩu mới</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-outline-variant/30 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {pwdMsg && (
              <div className={`rounded-xl px-4 py-3 text-sm font-semibold ${pwdMsg.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                {pwdMsg.text}
              </div>
            )}

            <button
              type="submit"
              disabled={pwdSaving}
              className="primary-gradient text-white px-8 py-3 rounded-xl font-bold text-sm disabled:opacity-60 transition-opacity"
            >
              {pwdSaving ? 'Đang đổi...' : 'Đổi mật khẩu'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
