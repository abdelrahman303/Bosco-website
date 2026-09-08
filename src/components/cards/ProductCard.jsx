import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowUpRight } from 'react-icons/fi';
import { formatPrice } from '../../utils/media';
import SafeImage from '../SafeImage';

export default function ProductCard({ product }) {
  const { t, i18n } = useTranslation();
  if (!product) return null;
  const price = formatPrice(product, {
    quoteLabel: t('site.common.requestQuote'),
    locale: i18n.language?.startsWith('ar') ? 'ar-EG' : 'en-US',
  });

  return (
    <Link
      to={`/products/${product.slug}`}
      className="catalog-product group relative overflow-hidden rounded-[16px] sm:rounded-[28px] bg-[#111] border border-white/10 min-h-[210px] sm:min-h-[360px] lg:min-h-[440px] flex flex-col justify-end"
    >
      <SafeImage
        src={product.image}
        alt={product.name}
        width={900}
        className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />

      <div className="relative z-10 p-3 sm:p-6">
        <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-4">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {product.category?.name && (
              <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.14em] sm:tracking-[0.18em] font-bold text-white bg-black/50 border border-white/20 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                {product.category.name}
              </span>
            )}
            {product.subcategory?.name && (
              <span className="hidden sm:inline-flex text-[10px] uppercase tracking-[0.18em] font-bold text-white bg-[#C63637] px-3 py-1 rounded-full">
                {product.subcategory.name}
              </span>
            )}
          </div>
          <span className="w-7 h-7 sm:w-10 sm:h-10 shrink-0 rounded-full bg-[#C63637] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
            <FiArrowUpRight size={14} />
          </span>
        </div>

        {product.model && (
          <p className="hidden sm:block text-[11px] font-bold uppercase tracking-[0.2em] text-white/70 mb-2">{product.model}</p>
        )}
        <h3 className="text-sm sm:text-2xl font-black text-white leading-tight line-clamp-2">{product.name}</h3>
        <p className="hidden sm:block text-gray-200 text-sm mt-2 line-clamp-2">{product.short_description}</p>
        <p className="text-white font-bold mt-2 sm:mt-4 text-xs sm:text-base">{price}</p>
      </div>
    </Link>
  );
}
