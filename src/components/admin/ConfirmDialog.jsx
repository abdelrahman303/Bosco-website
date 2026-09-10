import { FiAlertTriangle } from 'react-icons/fi';

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/55 backdrop-blur-md" onClick={onCancel} aria-label="Close" />
      <div className="relative w-full max-w-[440px] bg-white dark:bg-[#141414] rounded-[28px] p-6 sm:p-8 shadow-[0_30px_80px_rgba(0,0,0,0.28)] border border-white/10">
        <div className="w-16 h-16 rounded-3xl bg-[#C63637]/10 text-[#C63637] flex items-center justify-center mb-5">
          <FiAlertTriangle size={28} />
        </div>
        <h3 className="text-2xl font-black tracking-tight text-start text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-3 text-start leading-relaxed">{message}</p>
        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3.5 rounded-2xl border border-gray-200 dark:border-white/10 font-bold hover:bg-gray-50 dark:hover:bg-white/5"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="admin-primary flex-1 justify-center"
          >
            {loading ? '...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
