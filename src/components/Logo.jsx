import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { logoForLanguage } from '../utils/logo';

const sizeClasses = {
  nav: 'h-14 sm:h-16 w-auto max-w-[200px] sm:max-w-[260px]',
  sidebar: 'h-14 w-auto max-w-[240px]',
  login: 'h-24 sm:h-28 w-auto max-w-[280px] sm:max-w-[340px]',
  footer: 'h-14 sm:h-16 w-auto max-w-[240px]',
};

export default function Logo({
  to = '/',
  onDark = false,
  className = '',
  size = 'nav',
}) {
  const { i18n } = useTranslation();
  const src = logoForLanguage(i18n.language);
  const alt = i18n.language?.startsWith('ar')
    ? 'بوسكو للتجارة الدولية'
    : 'Bosco International Trade';

  return (
    <Link
      to={to}
      className={`inline-flex items-center min-w-0 shrink-0 ${className}`}
      aria-label={alt}
    >
      <img
        src={src}
        alt={alt}
        className={`object-contain object-left rtl:object-right ${sizeClasses[size] || sizeClasses.nav} ${
          onDark ? '' : 'rounded-lg'
        }`}
        draggable={false}
      />
    </Link>
  );
}
