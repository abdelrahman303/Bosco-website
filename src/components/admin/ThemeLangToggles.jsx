import { FiMoon, FiSun } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import useTheme from '../../hooks/useTheme';
import useLanguage from '../../hooks/useLanguage';

export default function ThemeLangToggles() {
  const { t } = useTranslation();
  const { isDark, toggle } = useTheme();
  const { isAr, toggle: toggleLang } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggleLang}
        className="h-8 sm:h-10 min-w-8 sm:min-w-10 px-2.5 sm:px-3 rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-[10px] sm:text-xs font-black tracking-wider hover:border-[#C63637] hover:text-[#C63637] transition-colors"
        aria-label="Toggle language"
      >
        {isAr ? 'EN' : 'AR'}
      </button>
      <button
        type="button"
        onClick={toggle}
        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 flex items-center justify-center hover:border-[#C63637] hover:text-[#C63637] transition-colors"
        aria-label={isDark ? t('theme.light') : t('theme.dark')}
      >
        {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
      </button>
    </div>
  );
}
