import type { ReactNode } from 'react';

type ConfirmTone = 'default' | 'danger';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: ConfirmTone;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  detail?: ReactNode;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Hủy',
  tone = 'default',
  pending = false,
  onConfirm,
  onCancel,
  detail,
}: ConfirmDialogProps) {
  if (!open) return null;

  const confirmClass = tone === 'danger'
    ? 'bg-red-600 hover:bg-red-700 text-white'
    : 'bg-primary hover:bg-primary/90 text-white';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="absolute inset-0" onClick={onCancel} />
      <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl border border-black/5 overflow-hidden">
        <div className="px-6 py-5 border-b border-surface-container-low">
          <h3 className="text-lg font-black tracking-tight text-on-surface">{title}</h3>
          <p className="text-sm text-on-surface-variant mt-2">{message}</p>
        </div>
        {detail && (
          <div className="px-6 py-4 bg-surface-container-low/40 border-b border-surface-container-low text-sm text-on-surface-variant">
            {detail}
          </div>
        )}
        <div className="px-6 py-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            className="px-4 py-2.5 rounded-xl border border-surface-container-high text-sm font-bold text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-colors disabled:opacity-60 ${confirmClass}`}
          >
            {pending ? 'Đang xử lý...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
