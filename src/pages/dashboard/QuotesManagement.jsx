import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import {
  FiBox,
  FiCheckCircle,
  FiClock,
  FiExternalLink,
  FiMail,
  FiPhone,
  FiSearch,
  FiUser,
} from 'react-icons/fi';
import SafeImage from '../../components/SafeImage';
import { inquiryService } from '../../services/inquiryService';
import { localized } from '../../utils/localize';
import { formatPrice, mediaUrl } from '../../utils/media';

const STATUSES = ['new', 'reviewed', 'contacted', 'closed'];

function statusClass(status) {
  if (status === 'new') return 'bg-[#C63637]/10 text-[#C63637]';
  if (status === 'reviewed') return 'bg-amber-500/10 text-amber-600';
  if (status === 'contacted') return 'bg-sky-500/10 text-sky-600';
  return 'bg-emerald-500/10 text-emerald-600';
}

export default function QuotesManagement() {
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data = await inquiryService.list();
      setItems(data || []);
      if (!selectedId && data?.[0]) setSelectedId(data[0].id);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      if (filter !== 'all' && item.status !== filter) return false;
      if (!q) return true;
      const haystack = [
        item.name,
        item.email,
        item.company,
        item.phone,
        item.message,
        item.product?.name,
        item.product?.model,
        item.product?.sku,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [items, filter, search]);

  const selected = filtered.find((item) => item.id === selectedId) || filtered[0] || null;

  useEffect(() => {
    if (selected && selected.id !== selectedId) setSelectedId(selected.id);
  }, [filtered, selected, selectedId]);

  const updateStatus = async (id, status) => {
    try {
      const updated = await inquiryService.updateStatus(id, status);
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
      toast.success(t('admin.quotes.statusUpdated'));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const counts = useMemo(() => {
    return {
      all: items.length,
      new: items.filter((item) => item.status === 'new').length,
      reviewed: items.filter((item) => item.status === 'reviewed').length,
      contacted: items.filter((item) => item.status === 'contacted').length,
      closed: items.filter((item) => item.status === 'closed').length,
    };
  }, [items]);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 sm:space-y-8">
      <div className="admin-page-header">
        <div className="text-start">
          <p className="admin-eyebrow">{t('admin.quotes.eyebrow')}</p>
          <h1 className="admin-title">{t('admin.quotes.title')}</h1>
          <p className="admin-subtitle">{t('admin.quotes.subtitle')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', ...STATUSES].map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`px-3.5 py-2 rounded-full text-xs font-bold border transition-colors ${
                filter === key
                  ? 'bg-[#C63637] text-white border-[#C63637] shadow-md shadow-[#C63637]/20'
                  : 'border-gray-200 dark:border-white/10 bg-white dark:bg-[#141414] hover:border-[#C63637]/40'
              }`}
            >
              {t(`admin.quotes.filter.${key}`)} ({counts[key] || 0})
            </button>
          ))}
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search">
          <FiSearch className="text-gray-400 shrink-0" />
          <input
            className="w-full bg-transparent py-2 outline-none"
            placeholder={t('admin.quotes.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="admin-empty text-gray-500">{t('admin.saving')}</div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty">
          <p className="text-lg font-black text-gray-800 dark:text-white">{t('admin.quotes.empty')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          <div className="xl:col-span-5 space-y-3 max-h-[78vh] overflow-y-auto pe-1">
            {filtered.map((item) => {
              const active = selected?.id === item.id;
              const productName = localized(item.product, 'name', i18n.language) || t('admin.quotes.general');
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full text-start rounded-[24px] border p-4 transition-all shadow-[0_8px_24px_-20px_rgba(15,23,42,0.35)] ${
                    active
                      ? 'border-[#C63637] bg-[#C63637]/5 shadow-sm'
                      : 'border-gray-200 dark:border-white/10 bg-white dark:bg-[#141414] hover:border-[#C63637]/35'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-black truncate">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-1 truncate">{item.email}</p>
                    </div>
                    <span className={`shrink-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${statusClass(item.status)}`}>
                      {t(`admin.quotes.status.${item.status}`)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 line-clamp-2">{item.message}</p>
                  <div className="mt-3 flex items-center justify-between gap-3 text-xs text-gray-400">
                    <span className="inline-flex items-center gap-1 truncate">
                      <FiBox /> {productName}
                    </span>
                    <span className="inline-flex items-center gap-1 shrink-0">
                      <FiClock /> {item.created_at}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {selected && (
            <div className="xl:col-span-7 space-y-5 xl:sticky xl:top-24">
              <section className="admin-card space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C63637]">
                      {t('admin.quotes.customer')}
                    </p>
                    <h2 className="text-2xl font-black mt-1">{selected.name}</h2>
                    <div className="mt-3 space-y-1.5 text-sm text-gray-600 dark:text-gray-300">
                      <p className="inline-flex items-center gap-2 break-all">
                        <FiMail className="text-[#C63637]" /> {selected.email}
                      </p>
                      <p className="inline-flex items-center gap-2">
                        <FiPhone className="text-[#C63637]" /> {selected.phone || t('admin.noPhone')}
                      </p>
                      <p className="inline-flex items-center gap-2">
                        <FiUser className="text-[#C63637]" /> {selected.company || t('admin.independentBuyer')}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {STATUSES.map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => updateStatus(selected.id, status)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border ${
                          selected.status === status
                            ? 'bg-[#111] text-white border-[#111] dark:bg-white dark:text-black'
                            : 'border-gray-200 dark:border-white/10'
                        }`}
                      >
                        {t(`admin.quotes.status.${status}`)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                    {t('admin.quotes.message')}
                  </p>
                  <p className="leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                    {selected.message}
                  </p>
                </div>
              </section>

              <section className="admin-card overflow-hidden p-0">
                <div className="px-5 sm:px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C63637]">
                      {t('admin.quotes.productDetails')}
                    </p>
                    <h3 className="text-xl font-black mt-1">
                      {selected.product
                        ? localized(selected.product, 'name', i18n.language)
                        : t('admin.quotes.general')}
                    </h3>
                  </div>
                  {selected.product?.slug && (
                    <Link
                      to={`/products/${selected.product.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-[#C63637]"
                    >
                      {t('admin.quotes.viewProduct')} <FiExternalLink />
                    </Link>
                  )}
                </div>

                {selected.product ? (
                  <div className="p-5 sm:p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                      <div className="md:col-span-5">
                        <div className="rounded-2xl overflow-hidden bg-black min-h-[220px]">
                          <SafeImage
                            src={mediaUrl(selected.product.image)}
                            alt={localized(selected.product, 'name', i18n.language)}
                            className="w-full h-full min-h-[220px] object-cover"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-7 space-y-3">
                        <p className="text-sm text-gray-500">
                          {selected.product.model || '—'} · {selected.product.sku || '—'}
                        </p>
                        <p className="text-2xl font-black text-[#C63637]">
                          {formatPrice(selected.product, {
                            quoteLabel: t('site.common.requestQuote'),
                            locale: i18n.language?.startsWith('ar') ? 'ar-EG' : 'en-US',
                          })}
                        </p>
                        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                          {localized(selected.product, 'short_description', i18n.language) ||
                            localized(selected.product, 'description', i18n.language)}
                        </p>
                        {selected.product.category && (
                          <p className="text-sm">
                            <span className="text-gray-400">{t('admin.category')}: </span>
                            <span className="font-semibold">
                              {localized(selected.product.category, 'name', i18n.language)}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        [t('site.common.brand'), selected.product.brand],
                        [t('site.common.origin'), selected.product.origin],
                        [t('site.common.capacity'), selected.product.capacity],
                        [t('site.common.power'), selected.product.power],
                        [t('site.common.dimensions'), selected.product.dimensions],
                        [t('site.common.warranty'), selected.product.warranty],
                      ]
                        .filter(([, value]) => value)
                        .map(([label, value]) => (
                          <div
                            key={label}
                            className="rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 p-3"
                          >
                            <p className="text-[11px] uppercase tracking-widest text-gray-400">{label}</p>
                            <p className="font-bold mt-1 text-sm">{value}</p>
                          </div>
                        ))}
                    </div>

                    {selected.product.features?.length > 0 && (
                      <div>
                        <p className="text-sm font-bold mb-2">{t('site.productDetails.features')}</p>
                        <ul className="space-y-2">
                          {selected.product.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <FiCheckCircle className="text-[#C63637] mt-0.5 shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {Object.keys(selected.product.specs || {}).length > 0 && (
                      <div>
                        <p className="text-sm font-bold mb-2">{t('site.productDetails.specs')}</p>
                        <div className="divide-y divide-gray-100 dark:divide-white/5 rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
                          {Object.entries(selected.product.specs).map(([key, value]) => (
                            <div key={key} className="flex justify-between gap-4 px-4 py-2.5 text-sm bg-white dark:bg-[#111]">
                              <span className="text-gray-500">{key}</span>
                              <span className="font-semibold text-end">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 text-gray-500">{t('admin.quotes.noProduct')}</div>
                )}
              </section>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
