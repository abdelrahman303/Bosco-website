import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { FiPlus } from 'react-icons/fi';
import ImageField from '../../components/admin/ImageField';
import { Field, FormStudio, LivePreview, SectionCard } from '../../components/admin/FormPrimitives';
import { categoryService } from '../../services/categoryService';
import { subcategoryService } from '../../services/subcategoryService';
import { mediaUrl } from '../../utils/media';

const emptyForm = {
  name: '',
  category_id: '',
  description: '',
  image: '',
  sort_order: 0,
};

export default function SubcategoryForm() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(Boolean(id));

  useEffect(() => {
    categoryService.list().then((cats) => {
      setCategories(cats);
      if (!id && cats[0] && !form.category_id) {
        setForm((prev) => ({ ...prev, category_id: cats[0].id }));
      }
    }).catch((error) => toast.error(error.message));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    subcategoryService
      .get(id)
      .then((data) => {
        setForm({
          name: data.name || '',
          category_id: data.category_id || '',
          description: data.description || '',
          image: data.image || '',
          sort_order: data.sort_order || 0,
        });
      })
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }, [id]);

  const parent = categories.find((item) => String(item.id) === String(form.category_id));

  const saveSubcategory = async () => {
    if (id) {
      await subcategoryService.update(id, form);
      return { categoryId: form.category_id, subcategoryId: id };
    }
    const created = await subcategoryService.create(form);
    return { categoryId: form.category_id, subcategoryId: created.id };
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await saveSubcategory();
      toast.success(t('admin.saved'));
      navigate('/admin/subcategories');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const createProduct = async () => {
    if (!form.name.trim() || !form.category_id) {
      toast.error(t('admin.selectParent'));
      return;
    }
    setSaving(true);
    try {
      const ids = await saveSubcategory();
      navigate(`/admin/products/new?categoryId=${ids.categoryId}&subcategoryId=${ids.subcategoryId}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-gray-500">{t('admin.saving')}</div>;
  }

  return (
    <FormStudio
      eyebrow={t('admin.catalog')}
      title={id ? t('admin.editSubcategory') : t('admin.newSubcategory')}
      subtitle={t('admin.studioSubcategory')}
      backTo="/admin/subcategories"
      cancelLabel={t('admin.cancel')}
      saveLabel={saving ? t('admin.saving') : t('admin.saveSubcategory')}
      saving={saving}
      onSubmit={save}
      extraAction={
        <button type="button" onClick={createProduct} className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#111] dark:bg-white text-white dark:text-black font-bold inline-flex items-center justify-center gap-2">
          <FiPlus /> {t('admin.addProductInSubcategory')}
        </button>
      }
      preview={
        <LivePreview title={t('admin.appearsAs')}>
          <div className="overflow-hidden rounded-[22px] bg-white dark:bg-[#0f0f0f] border border-gray-100 dark:border-white/10">
            <div className="h-40 bg-gray-100 dark:bg-white/5">
              {form.image ? <img src={mediaUrl(form.image)} alt="" className="w-full h-full object-cover" /> : null}
            </div>
            <div className="p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C63637]">{parent?.name || t('admin.parentCategory')}</p>
              <p className="text-xl font-black mt-2">{form.name || t('admin.untitled')}</p>
              <p className="text-sm text-gray-500 mt-2 line-clamp-3">{form.description || t('admin.descHint')}</p>
            </div>
          </div>
        </LivePreview>
      }
    >
      <SectionCard step="01" title={t('admin.parentCategory')} subtitle={t('admin.parentHint')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setForm({ ...form, category_id: cat.id })}
              className={`text-start rounded-2xl border p-4 transition-all ${
                String(form.category_id) === String(cat.id)
                  ? 'border-[#C63637] bg-[#C63637]/5 shadow-sm'
                  : 'border-gray-200 dark:border-white/10 hover:border-[#C63637]/40'
              }`}
            >
              <p className="font-bold">{cat.name}</p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{cat.description}</p>
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard step="02" title={t('admin.identity')} subtitle={t('admin.nameHint')}>
        <Field label={t('admin.name')} hint={t('admin.nameHint')}>
          <input className="admin-input text-lg font-semibold" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </Field>
        <Field label={t('admin.description')} hint={t('admin.descHint')}>
          <textarea className="admin-input min-h-28" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </Field>
        <Field label={t('admin.sortOrder')}>
          <input type="number" className="admin-input max-w-[160px]" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
        </Field>
      </SectionCard>

      <SectionCard step="03" title={t('admin.coverImage')} subtitle={t('admin.coverHint')}>
        <ImageField value={form.image} onChange={(image) => setForm({ ...form, image })} tall />
      </SectionCard>
    </FormStudio>
  );
}
