import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { categoryService } from '../../services/categoryService';
import { productService } from '../../services/productService';
import { formatPrice, mediaUrl } from '../../utils/media';

export default function ProductsManagement() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [pending, setPending] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    const [items, cats] = await Promise.all([
      productService.list({ admin: 1, q, categoryId: categoryId || undefined }),
      categoryService.list(),
    ]);
    setProducts(items);
    setCategories(cats);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      load().catch((error) => toast.error(error.message));
    }, 250);
    return () => clearTimeout(timer);
  }, [q, categoryId]);

  const filteredLabel = useMemo(() => {
    const cat = categories.find((item) => String(item.id) === String(categoryId));
    return cat ? cat.name : t('admin.allCategories');
  }, [categories, categoryId, t]);

  const remove = async () => {
    if (!pending) return;
    setDeleting(true);
    try {
      await productService.remove(pending.id);
      toast.success(t('admin.deleted'));
      setPending(null);
      await load();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="text-start">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C63637]">{t('admin.catalog')}</p>
          <h1 className="text-3xl font-black text-start">{t('admin.products')}</h1>
          <p className="text-gray-500 mt-1 text-start">{t('admin.itemsIn', { count: products.length, label: filteredLabel })}</p>
        </div>
        <Link to="/admin/products/new" className="admin-primary justify-center">
          <FiPlus /> {t('admin.addProduct')}
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 flex items-center gap-3 bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/5 rounded-2xl px-4">
          <FiSearch className="text-gray-400 shrink-0" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('admin.searchProducts')}
            className="w-full bg-transparent py-3 outline-none"
          />
        </div>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="admin-input md:w-64">
          <option value="">{t('admin.allCategories')}</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:hidden gap-3">
        {products.map((item) => (
          <article key={item.id} className="admin-card flex gap-3">
            <img src={mediaUrl(item.image)} alt="" className="w-20 h-20 rounded-xl object-cover bg-gray-100" />
            <div className="min-w-0 flex-1">
              <p className="font-bold">{item.name}</p>
              <p className="text-xs text-gray-500">{item.category?.name}</p>
              <p className="text-sm text-[#C63637] mt-1">{formatPrice(item)}</p>
              <div className="flex gap-2 mt-2">
                <Link to={`/admin/products/${item.id}`} className="admin-icon-btn"><FiEdit2 /></Link>
                <button onClick={() => setPending(item)} className="admin-icon-btn text-red-500"><FiTrash2 /></button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden md:block admin-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-start min-w-[720px]">
            <thead className="bg-gray-50 dark:bg-white/5 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-4">{t('admin.product')}</th>
                <th className="px-5 py-4">{t('admin.category')}</th>
                <th className="px-5 py-4">{t('admin.status')}</th>
                <th className="px-5 py-4">{t('admin.price')}</th>
                <th className="px-5 py-4 text-end">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.id} className="border-t border-gray-100 dark:border-white/5">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={mediaUrl(item.image)} alt="" className="w-14 h-14 rounded-xl object-cover bg-gray-100" />
                      <div>
                        <p className="font-bold">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.model} · {item.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm">
                    <p>{item.category?.name}</p>
                    <p className="text-xs text-gray-500">{item.subcategory?.name}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.status === 'published' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' : 'bg-gray-100 text-gray-600 dark:bg-white/10'}`}>
                      {item.status === 'published' ? t('admin.published') : t('admin.draft')}
                    </span>
                    {item.featured ? <span className="ms-2 text-xs font-bold text-[#C63637]">{t('admin.featured')}</span> : null}
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold">{formatPrice(item)}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/products/${item.id}`} className="admin-icon-btn"><FiEdit2 /></Link>
                      <button onClick={() => setPending(item)} className="admin-icon-btn text-red-500"><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(pending)}
        title={t('admin.deleteTitle')}
        message={t('admin.deleteProductConfirm', { name: pending?.name || '' })}
        confirmLabel={t('admin.deleteNow')}
        cancelLabel={t('admin.keepItem')}
        loading={deleting}
        onCancel={() => setPending(null)}
        onConfirm={remove}
      />
    </div>
  );
}
