import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Logo({ to = '/', onDark = false, className = '' }) {
  const { t } = useTranslation();
  return (
    <Link to={to} className={`inline-flex items-center gap-2 sm:gap-2.5 min-w-0 ${className}`} aria-label="Bosco International Trade">
      <img
        src={`${import.meta.env.BASE_URL}favicon.png`}
        alt=""
        className="h-8 w-8 sm:h-11 sm:w-11 rounded-xl sm:rounded-2xl object-cover shadow-[0_8px_20px_rgba(198,54,55,0.25)]"
      />
      <span className="leading-none">
        <span className={`block text-base sm:text-xl font-black tracking-tight ${onDark ? 'text-white' : 'text-[#1a1a1a] dark:text-white'}`}>
          BOSCO<span className="text-[#C63637]">.</span>
        </span>
        <span className={`hidden sm:block text-[9px] font-bold uppercase tracking-[0.22em] mt-1 ${onDark ? 'text-white/55' : 'text-gray-500'}`}>
          {t('site.logoTag')}
        </span>
      </span>
    </Link>
  );
}
