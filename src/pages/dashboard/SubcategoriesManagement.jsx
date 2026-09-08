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
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="text-start">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C63637]">{t('admin.catalog')}</p>
          <h1 className="text-3xl font-black text-start">{t('admin.subcategories')}</h1>
        </div>
        <Link to="/admin/subcategories/new" className="admin-primary justify-center">
          <FiPlus /> {t('admin.addSubcategory')}
        </Link>
      </div>

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
                <button onClick={() => setPending(item)} className="admin-icon-btn text-red-500"><FiTrash2 /></button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden md:block admin-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-start">
            <thead className="bg-gray-50 dark:bg-white/5 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-4">{t('admin.subcategories')}</th>
                <th className="px-5 py-4">{t('admin.parentCategory')}</th>
                <th className="px-5 py-4">{t('admin.sortOrder')}</th>
                <th className="px-5 py-4 text-end">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-gray-100 dark:border-white/5">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={mediaUrl(item.image)} alt="" className="w-12 h-12 rounded-xl object-cover bg-gray-100" />
                      <div>
                        <p className="font-bold">{item.name}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{item.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm">{item.category_name}</td>
                  <td className="px-5 py-4 text-sm">{item.sort_order}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link to={productLink(item)} className="admin-icon-btn" title={t('admin.addProductInSubcategory')}><FiBox /></Link>
                      <Link to={`/admin/subcategories/${item.id}`} className="admin-icon-btn"><FiEdit2 /></Link>
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
