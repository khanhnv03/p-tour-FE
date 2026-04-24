import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile, type UserProfile } from '../api/users';

export default function UserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    getProfile()
      .then((p) => {
        setProfile(p);
        setFullName(p.fullName ?? '');
        setPhone(p.phone ?? '');
        setAddress(p.address ?? '');
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    try {
      const updated = await updateProfile({ fullName, phone, address });
      setProfile(updated);
      setMessage({ type: 'success', text: 'Đã lưu thay đổi.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.response?.data?.message ?? 'Có lỗi xảy ra.' });
    } finally {
      setSaving(false);
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <header>
        <h1 className="text-3xl font-black tracking-tight text-on-surface">Hồ sơ cá nhân</h1>
        <p className="text-on-surface-variant text-sm mt-2">Quản lý thông tin liên hệ và tùy chọn cá nhân của bạn.</p>
      </header>

      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0_8px_32px_0_rgba(25,28,29,0.04)] border border-surface-container-low/50">
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            <div className="relative">
              <div className="w-32 h-32 rounded-[2rem] overflow-hidden shadow-lg border-4 border-white object-cover">
                <img
                  src={profile?.avatarUrl ?? `https://picsum.photos/seed/${profile?.id ?? 'user'}/200/200`}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <button type="button" className="absolute -bottom-2 -right-2 bg-primary text-on-primary p-2 rounded-xl shadow-lg hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-sm">photo_camera</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1 w-full mt-2">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant px-1">Tên đầy đủ</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-on-surface"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant px-1">Email</label>
                <input
                  type="email"
                  value={profile?.email ?? ''}
                  readOnly
                  className="w-full bg-surface-container cursor-not-allowed border-none rounded-xl px-4 py-3 outline-none font-medium text-on-surface-variant"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant px-1">Số điện thoại</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none font-medium text-on-surface"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant px-1">Địa chỉ</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none font-medium text-on-surface"
                />
              </div>
            </div>
          </div>
        </div>

        {message && (
          <p className={`text-sm font-medium ${message.type === 'success' ? 'text-green-600' : 'text-error'}`}>
            {message.text}
          </p>
        )}

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => { setFullName(profile?.fullName ?? ''); setPhone(profile?.phone ?? ''); setAddress(profile?.address ?? ''); setMessage(null); }}
            className="px-8 py-3 text-on-surface-variant font-bold hover:bg-surface-container-high rounded-xl transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={saving}
            className="signature-gradient text-white px-10 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all scale-100 active:scale-95 disabled:opacity-60"
          >
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </form>
    </div>
  );
}
