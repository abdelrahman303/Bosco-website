import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { FiBox, FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { categoryService } from '../../services/categoryService';
import { CategoryIcon } from '../../utils/icons';
import { mediaUrl } from '../../utils/media';

export default function CategoriesManagement() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [pending, setPending] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setItems(await categoryService.list());
  };

  useEffect(() => {
    load().catch((error) => toast.error(error.message));
  }, []);

  const remove = async () => {
    if (!pending) return;
    setDeleting(true);
    try {
      await categoryService.remove(pending.id);
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
          <h1 className="text-3xl font-black text-start">{t('admin.categories')}</h1>
        </div>
        <Link to="/admin/categories/new" className="admin-primary justify-center">
          <FiPlus /> {t('admin.addCategory')}
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        {items.map((item) => (
          <article key={item.id} className="admin-card overflow-hidden p-0">
            <div className="h-40 relative">
              <img src={mediaUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 start-4 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <CategoryIcon name={item.icon} size={18} />
                  <span className="text-xs uppercase tracking-widest">{t('admin.productsCount', { count: item.product_count })}</span>
                </div>
                <h3 className="text-xl font-black">{item.name}</h3>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">{t('admin.subcategoriesCount', { count: item.subcategory_count })}</p>
              <div className="flex gap-2">
                <Link to={`/admin/products/new?categoryId=${item.id}`} className="admin-icon-btn" title={t('admin.addProductInCategory')}><FiBox /></Link>
                <Link to={`/admin/categories/${item.id}`} className="admin-icon-btn"><FiEdit2 /></Link>
                <button onClick={() => setPending(item)} className="admin-icon-btn text-red-500"><FiTrash2 /></button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <ConfirmDialog
        open={Boolean(pending)}
        title={t('admin.deleteTitle')}
        message={t('admin.deleteCategoryConfirm', { name: pending?.name || '' })}
        confirmLabel={t('admin.deleteNow')}
        cancelLabel={t('admin.keepItem')}
        loading={deleting}
        onCancel={() => setPending(null)}
        onConfirm={remove}
      />
    </div>
  );
}
