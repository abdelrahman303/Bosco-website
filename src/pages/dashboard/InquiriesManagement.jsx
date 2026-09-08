import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { inquiryService } from '../../services/inquiryService';

export default function InquiriesManagement() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);

  useEffect(() => {
    inquiryService.list().then(setItems).catch((error) => toast.error(error.message));
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C63637]">{t('admin.sales')}</p>
        <h1 className="text-3xl font-black">{t('admin.quoteInquiries')}</h1>
      </div>

      <div className="space-y-4">
        {items.length === 0 && (
          <div className="admin-card text-gray-500">{t('admin.noInquiries')}</div>
        )}
        {items.map((item) => (
          <article key={item.id} className="admin-card">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold">{item.name}</h3>
                <p className="text-sm text-gray-500 break-all">
                  {item.company || t('admin.independentBuyer')} · {item.email} · {item.phone || t('admin.noPhone')}
                </p>
              </div>
              <span className="text-xs uppercase tracking-widest text-gray-400">{item.created_at}</span>
            </div>
            <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">{item.message}</p>
            {item.product_name && (
              <Link to={`/products/${item.product_slug}`} className="inline-block mt-4 text-sm font-bold text-[#C63637]">
                {t('admin.aboutProduct', { name: item.product_name })}
              </Link>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
