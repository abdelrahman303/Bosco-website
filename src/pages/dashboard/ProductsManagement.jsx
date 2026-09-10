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
    <div className="admin-page">
      <div className="admin-page-header">
        <div className="text-start">
          <p className="admin-eyebrow">{t('admin.catalog')}</p>
          <h1 className="admin-title">{t('admin.products')}</h1>
          <p className="admin-subtitle">{t('admin.itemsIn', { count: products.length, label: filteredLabel })}</p>
        </div>
        <Link to="/admin/products/new" className="admin-primary justify-center">
          <FiPlus /> {t('admin.addProduct')}
        </Link>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search">
          <FiSearch className="text-gray-400 shrink-0" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('admin.searchProducts')}
            className="w-full bg-transparent py-2 outline-none"
          />
        </div>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="admin-input md:w-64">
          <option value="">{t('admin.allCategories')}</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {products.length === 0 ? (
        <div className="admin-empty">
          <p className="text-lg font-black text-gray-800 dark:text-white">{t('admin.emptyProducts')}</p>
          <p className="text-sm text-gray-500 mt-2 max-w-md">{t('admin.emptyProductsHint')}</p>
          <Link to="/admin/products/new" className="admin-primary mt-6">
            <FiPlus /> {t('admin.addProduct')}
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:hidden gap-3">
            {products.map((item) => (
              <article key={item.id} className="admin-card flex gap-3">
                <img src={mediaUrl(item.image)} alt="" className="w-20 h-20 rounded-xl object-cover bg-gray-100" />
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.category?.name}</p>
                  <p className="text-sm text-[#C63637] mt-1 font-semibold">{formatPrice(item)}</p>
                  <div className="flex gap-2 mt-2">
                    <Link to={`/admin/products/${item.id}`} className="admin-icon-btn"><FiEdit2 /></Link>
                    <button onClick={() => setPending(item)} className="admin-icon-btn-danger"><FiTrash2 /></button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden md:block admin-table-wrap">
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t('admin.product')}</th>
                    <th>{t('admin.category')}</th>
                    <th>{t('admin.status')}</th>
                    <th>{t('admin.price')}</th>
                    <th className="text-end">{t('admin.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <img src={mediaUrl(item.image)} alt="" className="w-14 h-14 rounded-xl object-cover bg-gray-100 ring-1 ring-black/5" />
                          <div>
                            <p className="font-bold">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.model} · {item.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-sm">
                        <p className="font-medium">{item.category?.name}</p>
                        <p className="text-xs text-gray-500">{item.subcategory?.name}</p>
                      </td>
                      <td>
                        <span className={item.status === 'published' ? 'admin-badge-success' : 'admin-badge-muted'}>
                          {item.status === 'published' ? t('admin.published') : t('admin.draft')}
                        </span>
                        {item.featured ? <span className="ms-2 text-xs font-bold text-[#C63637]">{t('admin.featured')}</span> : null}
                      </td>
                      <td className="text-sm font-semibold">{formatPrice(item)}</td>
                      <td>
                        <div className="flex justify-end gap-2">
                          <Link to={`/admin/products/${item.id}`} className="admin-icon-btn"><FiEdit2 /></Link>
                          <button onClick={() => setPending(item)} className="admin-icon-btn-danger"><FiTrash2 /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

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
