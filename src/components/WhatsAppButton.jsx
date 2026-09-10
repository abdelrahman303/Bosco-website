import { COMPANY } from '../utils/company';

/** Floating WhatsApp CTA used on public layout pages. */
export default function WhatsAppButton({ className = '' }) {
  return (
    <a
      href={COMPANY.whatsapp}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className={`fixed bottom-5 end-5 z-[60] inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-4 py-3 shadow-[0_16px_40px_-12px_rgba(37,211,102,0.85)] hover:scale-[1.03] transition-transform ${className}`}
    >
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden>
        <path d="M20.52 3.48A11.78 11.78 0 0 0 12.04 0C5.5 0 .16 5.34.16 11.88c0 2.1.55 4.14 1.6 5.95L0 24l6.35-1.66a11.86 11.86 0 0 0 5.69 1.45h.01c6.54 0 11.88-5.34 11.88-11.88 0-3.17-1.24-6.16-3.41-8.43ZM12.05 21.2h-.01a9.3 9.3 0 0 1-4.74-1.3l-.34-.2-3.77.99 1.01-3.67-.22-.38a9.3 9.3 0 0 1-1.43-4.96c0-5.14 4.18-9.32 9.33-9.32 2.49 0 4.83.97 6.59 2.73a9.27 9.27 0 0 1 2.73 6.6c0 5.14-4.18 9.31-9.32 9.31Zm5.41-6.98c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.08-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z" />
      </svg>
      <span className="text-sm font-bold hidden sm:inline">WhatsApp</span>
    </a>
  );
}
