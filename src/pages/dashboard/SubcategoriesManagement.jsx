import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { FiBox, FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { categoryService } from '../../services/categoryService';
import { subcategoryService } from '../../services/subcategoryService';
import { mediaUrl } from '../../utils/media';

export default function SubcategoriesManagement() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [pending, setPending] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    const [, subs] = await Promise.all([categoryService.list(), subcategoryService.list()]);
    setItems(subs);
  };

  useEffect(() => {
    load().catch((error) => toast.error(error.message));
  }, []);

  const remove = async () => {
    if (!pending) return;
    setDeleting(true);
    try {
      await subcategoryService.remove(pending.id);
      toast.success(t('admin.deleted'));
      setPending(null);
      await load();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeleting(false);
    }
  };

  const productLink = (item) => `/admin/products/new?categoryId=${item.category_id}&subcategoryId=${item.id}`;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div className="text-start">
          <p className="admin-eyebrow">{t('admin.catalog')}</p>
          <h1 className="admin-title">{t('admin.subcategories')}</h1>
          <p className="admin-subtitle">{t('admin.itemsCount', { count: items.length })}</p>
        </div>
        <Link to="/admin/subcategories/new" className="admin-primary justify-center">
          <FiPlus /> {t('admin.addSubcategory')}
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="admin-empty">
          <p className="text-lg font-black text-gray-800 dark:text-white">{t('admin.emptySubcategories')}</p>
          <p className="text-sm text-gray-500 mt-2 max-w-md">{t('admin.emptySubcategoriesHint')}</p>
          <Link to="/admin/subcategories/new" className="admin-primary mt-6">
            <FiPlus /> {t('admin.addSubcategory')}
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:hidden gap-3">
            {items.map((item) => (
              <article key={item.id} className="admin-card flex gap-3">
                <img src={mediaUrl(item.image)} alt="" className="w-16 h-16 rounded-xl object-cover bg-gray-100" />
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.category_name}</p>
                  <div className="flex gap-2 mt-2">
                    <Link to={productLink(item)} className="admin-icon-btn" title={t('admin.addProductInSubcategory')}><FiBox /></Link>
                    <Link to={`/admin/subcategories/${item.id}`} className="admin-icon-btn"><FiEdit2 /></Link>
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
                    <th>{t('admin.subcategories')}</th>
                    <th>{t('admin.parentCategory')}</th>
                    <th>{t('admin.sortOrder')}</th>
                    <th className="text-end">{t('admin.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <img src={mediaUrl(item.image)} alt="" className="w-12 h-12 rounded-xl object-cover bg-gray-100 ring-1 ring-black/5" />
                          <div>
                            <p className="font-bold">{item.name}</p>
                            <p className="text-xs text-gray-500 line-clamp-1">{item.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-sm font-medium">{item.category_name}</td>
                      <td className="text-sm">
                        <span className="admin-badge-muted">{item.sort_order}</span>
                      </td>
                      <td>
                        <div className="flex justify-end gap-2">
                          <Link to={productLink(item)} className="admin-icon-btn" title={t('admin.addProductInSubcategory')}><FiBox /></Link>
                          <Link to={`/admin/subcategories/${item.id}`} className="admin-icon-btn"><FiEdit2 /></Link>
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
        message={t('admin.deleteConfirm', { name: pending?.name || '' })}
        confirmLabel={t('admin.deleteNow')}
        cancelLabel={t('admin.keepItem')}
        loading={deleting}
        onCancel={() => setPending(null)}
        onConfirm={remove}
      />
    </div>
  );
}
