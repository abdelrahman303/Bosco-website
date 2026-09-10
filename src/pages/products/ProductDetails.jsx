import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { FiCheck, FiMail } from 'react-icons/fi';
import ProductCard from '../../components/cards/ProductCard';
import { inquiryService } from '../../services/inquiryService';
import { productService } from '../../services/productService';
import { formatPrice, mediaUrl } from '../../utils/media';
import { localized } from '../../utils/localize';

export default function ProductDetails() {
  const { t, i18n } = useTranslation();
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [activeImage, setActiveImage] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    productService
      .get(slug)
      .then(({ data, similar: related }) => {
        setProduct(data);
        setSimilar(related || []);
        setActiveImage(data.image);
        setForm((prev) => ({
          ...prev,
          message: t('site.productDetails.quotePrefill', {
            name: localized(data, 'name', i18n.language),
            model: data.model || data.sku,
          }),
        }));
      })
      .catch((err) => setError(err.message));
  }, [slug, t, i18n.language]);

  const sendQuote = async (event) => {
    event.preventDefault();
    setSending(true);
    try {
      const result = await inquiryService.create({ ...form, product_id: product.id, type: 'quote' });
      toast.success(t('site.contact.success'));
      setForm({ name: '', email: '', company: '', phone: '', message: form.message });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSending(false);
    }
  };

  if (error) return <div className="pt-40 pb-24 text-center text-red-500">{error}</div>;
  if (!product) return <div className="pt-40 pb-24 text-center text-gray-500">{t('site.productDetails.loading')}</div>;

  const gallery = [product.image, ...(product.gallery || [])].filter(Boolean);
  const productName = localized(product, 'name', i18n.language);
  const productDescription = localized(product, 'description', i18n.language);
  const categoryName = localized(product.category, 'name', i18n.language);

  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-24 bg-[var(--bg)] min-h-screen">
      <Helmet>
        <title>{productName} | Bosco International Trade</title>
      </Helmet>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link to="/categories" className="hover:text-[#C63637]">{t('site.common.categories')}</Link>
          {product.category && (
            <>
              {' / '}
              <Link to={`/categories/${product.category.slug}`} className="hover:text-[#C63637]">{categoryName}</Link>
            </>
          )}
          {product.subcategory?.slug && product.category?.slug && (
            <>
              {' / '}
              <Link
                to={`/categories/${product.category.slug}/${product.subcategory.slug}`}
                className="hover:text-[#C63637]"
              >
                {localized(product.subcategory, 'name', i18n.language)}
              </Link>
            </>
          )}
          {' / '}
          <span>{productName}</span>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <div className="rounded-[22px] sm:rounded-[32px] overflow-hidden bg-black min-h-[260px] sm:min-h-[420px]">
              <img src={mediaUrl(activeImage)} alt={productName} className="w-full h-[260px] sm:h-[520px] object-cover" />
            </div>
            <div className="flex gap-3 mt-4 overflow-x-auto">
              {gallery.map((url) => (
                <button key={url} onClick={() => setActiveImage(url)} className={`w-24 h-24 rounded-2xl overflow-hidden border-2 ${activeImage === url ? 'border-[#C63637]' : 'border-transparent'}`}>
                  <img src={mediaUrl(url)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#C63637]">{categoryName}</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mt-3 leading-tight text-gray-900 dark:text-white">{productName}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">{product.model} · {product.sku}</p>
            <p className="text-2xl font-black text-[#C63637] mt-5">
              {formatPrice(product, {
                quoteLabel: t('site.common.requestQuote'),
                locale: i18n.language?.startsWith('ar') ? 'ar-EG' : 'en-US',
              })}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mt-5 leading-relaxed">{productDescription}</p>

            <div className="grid grid-cols-2 gap-3 mt-8">
              {[
                [t('site.common.brand'), product.brand],
                [t('site.common.origin'), product.origin],
                [t('site.common.capacity'), product.capacity],
                [t('site.common.power'), product.power],
                [t('site.common.dimensions'), product.dimensions],
                [t('site.common.warranty'), product.warranty],
              ].filter(([, value]) => value && value !== '—').map(([label, value]) => (
                <div key={label} className="bg-white dark:bg-[#141414] rounded-2xl p-4 border border-gray-200 dark:border-white/5">
                  <p className="text-xs uppercase tracking-widest text-gray-400">{label}</p>
                  <p className="font-bold mt-1">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-16">
          <div className="lg:col-span-7 space-y-8">
            {product.features?.length > 0 && (
              <section className="admin-card">
                <h2 className="text-2xl font-black mb-4">{t('site.productDetails.features')}</h2>
                <ul className="space-y-3">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <FiCheck className="text-[#C63637]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {Object.keys(product.specs || {}).length > 0 && (
              <section className="admin-card">
                <h2 className="text-2xl font-black mb-4">{t('site.productDetails.specs')}</h2>
                <div className="divide-y divide-gray-100 dark:divide-white/5">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-3 gap-6">
                      <span className="text-gray-500">{key}</span>
                      <span className="font-semibold text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <form onSubmit={sendQuote} className="lg:col-span-5 admin-card space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#C63637] text-white flex items-center justify-center">
                <FiMail />
              </div>
              <div>
                <h2 className="text-2xl font-black">{t('site.productDetails.quoteTitle')}</h2>
                <p className="text-sm text-gray-500">{t('site.productDetails.quoteLead')}</p>
              </div>
            </div>
            <input className="admin-input" placeholder={t('site.common.fullName')} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="admin-input" type="email" placeholder={t('site.common.workEmail')} required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <input className="admin-input" placeholder={t('site.common.company')} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              <input className="admin-input" placeholder={t('site.common.phone')} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <textarea className="admin-input min-h-28" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            <button disabled={sending} className="admin-primary w-full justify-center">
              {sending ? t('site.common.sending') : t('site.common.sendInquiry')}
            </button>
          </form>
        </div>

        {similar.length > 0 && (
          <section className="mt-20">
            <h2 className="text-3xl font-black mb-8">{t('site.productDetails.similar')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {similar.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
