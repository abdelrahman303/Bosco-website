import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import ProductCard from '../../components/cards/ProductCard';
import { categoryService } from '../../services/categoryService';
import { productService } from '../../services/productService';
import { mediaUrl } from '../../utils/media';

export default function CategoryDetails() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [activeSub, setActiveSub] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setActiveSub('');
    categoryService
      .get(slug)
      .then((data) => {
        setCategory(data);
        return productService.list({ categoryId: data.id });
      })
      .then(setProducts)
      .catch((err) => setError(err.message));
  }, [slug]);

  const visible = activeSub ? products.filter((item) => String(item.subcategory_id) === String(activeSub)) : products;

  if (error) {
    return <div className="pt-40 pb-24 text-center text-red-500">{error}</div>;
  }

  if (!category) {
    return <div className="pt-40 pb-24 text-center text-gray-500">{t('site.categoryDetails.loading')}</div>;
  }

  return (
    <div className="bg-[var(--bg)] min-h-screen">
      <Helmet>
        <title>{category.name} | Bosco International Trade</title>
      </Helmet>
      <section className="relative min-h-[52vh] flex items-end">
        <img src={mediaUrl(category.image)} alt={category.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
        <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 pb-10 sm:pb-16 pt-28 sm:pt-36 w-full">
          <p className="text-[#C63637] text-xs font-bold uppercase tracking-[0.25em] mb-3">{t('site.common.category')}</p>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white tracking-tight">{category.name}</h1>
          <p className="text-gray-300 text-lg max-w-2xl mt-4">{category.description}</p>
        </div>
      </section>

      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-16">
        <div className="flex flex-wrap gap-3 mb-10">
          <button
            onClick={() => setActiveSub('')}
            className={`px-5 py-2.5 rounded-full text-sm font-bold ${!activeSub ? 'bg-[#C63637] text-white' : 'bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10'}`}
          >
            {t('site.common.allProducts')}
          </button>
          {(category.subcategories || []).map((sub) => (
            <button
              key={sub.id}
              onClick={() => setActiveSub(sub.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold ${String(activeSub) === String(sub.id) ? 'bg-[#C63637] text-white' : 'bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10'}`}
            >
              {sub.name}
            </button>
          ))}
        </div>

        {(category.subcategories || []).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
            {category.subcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setActiveSub(sub.id)}
                className="text-left rounded-3xl overflow-hidden bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/5"
              >
                <img src={mediaUrl(sub.image)} alt={sub.name} className="w-full h-40 object-cover" />
                <div className="p-5">
                  <h3 className="text-xl font-black">{sub.name}</h3>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{sub.description}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {visible.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            {t('site.categoryDetails.empty')} {t('site.categoryDetails.emptyHint')}
            <div className="mt-4">
              <Link to="/admin/login" className="text-[#C63637] font-bold">{t('site.categoryDetails.goAdmin')}</Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
