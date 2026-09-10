import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

export function Field({ label, hint, children }) {
  return (
    <label className="block space-y-2">
      {label && (
        <span className="block text-[13px] font-semibold text-gray-700 dark:text-gray-200">
          {label}
        </span>
      )}
      {children}
      {hint && <span className="block text-xs text-gray-400 leading-relaxed">{hint}</span>}
    </label>
  );
}

export function SectionCard({ step, title, subtitle, children }) {
  return (
    <section className="admin-card overflow-hidden p-0">
      <div className="px-5 sm:px-7 py-5 border-b border-gray-100 dark:border-white/5 flex items-start gap-4 bg-gradient-to-r from-gray-50/80 to-transparent dark:from-white/[0.03]">
        {step && (
          <span className="w-9 h-9 rounded-2xl bg-[#C63637] text-white text-sm font-black flex items-center justify-center shrink-0 shadow-md shadow-[#C63637]/25">
            {step}
          </span>
        )}
        <div className="text-start">
          <h2 className="text-lg font-black tracking-tight text-start">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 mt-1 text-start">{subtitle}</p>}
        </div>
      </div>
      <div className="p-5 sm:p-7 space-y-5">{children}</div>
    </section>
  );
}

export function ToggleRow({ checked, onChange, title, subtitle }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between gap-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 py-4 text-start hover:border-[#C63637]/30 transition-colors"
    >
      <span>
        <span className="block text-sm font-bold">{title}</span>
        {subtitle && <span className="block text-xs text-gray-500 mt-1">{subtitle}</span>}
      </span>
      <span className={`relative w-12 h-7 rounded-full transition-colors ${checked ? 'bg-[#C63637]' : 'bg-gray-300 dark:bg-white/20'}`}>
        <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all ${checked ? 'start-6' : 'start-1'}`} />
      </span>
    </button>
  );
}

export function FormStudio({ eyebrow, title, subtitle, backTo, cancelLabel, saveLabel, saving, onSubmit, children, preview, extraAction }) {
  return (
    <form id="admin-studio-top" onSubmit={onSubmit} className="max-w-[1280px] mx-auto pb-28 lg:pb-8 scroll-mt-24">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
        <div className="min-w-0 text-start lg:me-auto">
          {backTo && (
            <Link to={backTo} className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#C63637] mb-3">
              <FiArrowLeft className="rtl:rotate-180" />
              {cancelLabel}
            </Link>
          )}
          <p className="admin-eyebrow">{eyebrow}</p>
          <h1 className="admin-title">{title}</h1>
          {subtitle && <p className="admin-subtitle">{subtitle}</p>}
        </div>
        <div className="hidden sm:flex flex-wrap justify-end gap-3 shrink-0">
          {extraAction}
          {backTo && (
            <Link to={backTo} className="admin-secondary">
              {cancelLabel}
            </Link>
          )}
          <button type="submit" disabled={saving} className="admin-primary">
            {saveLabel}
          </button>
        </div>
      </div>

      <div className={`grid grid-cols-1 gap-6 ${preview ? 'xl:grid-cols-[minmax(0,1fr)_360px]' : ''}`}>
        <div className="space-y-6">{children}</div>
        {preview && <div className="xl:sticky xl:top-24 h-fit">{preview}</div>}
      </div>

      <div className="sm:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 dark:bg-[#111]/95 backdrop-blur border-t border-gray-200 dark:border-white/10 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] space-y-2 shadow-[0_-12px_40px_-20px_rgba(0,0,0,0.35)]">
        {extraAction && <div className="flex">{extraAction}</div>}
        <div className="flex gap-3">
          {backTo && (
            <Link to={backTo} className="admin-secondary flex-1">
              {cancelLabel}
            </Link>
          )}
          <button type="submit" disabled={saving} className="admin-primary flex-1 justify-center">
            {saveLabel}
          </button>
        </div>
      </div>
    </form>
  );
}

export function LivePreview({ title, children }) {
  return (
    <div className="admin-card p-0 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-white/5 bg-gradient-to-r from-[#C63637]/5 to-transparent">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C63637]">{title}</p>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
