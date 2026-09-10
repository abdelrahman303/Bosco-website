import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { FiPlus } from 'react-icons/fi';
import ImageField from '../../components/admin/ImageField';
import { Field, FormStudio, LivePreview, SectionCard, ToggleRow } from '../../components/admin/FormPrimitives';
import { categoryService } from '../../services/categoryService';
import { CategoryIcon, ICON_OPTIONS } from '../../utils/icons';
import { mediaUrl } from '../../utils/media';

const emptyForm = {
  name: '',
  name_ar: '',
  description: '',
  description_ar: '',
  image: '',
  icon: 'FiBox',
  sort_order: 0,
  featured: true,
};

export default function CategoryForm() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(Boolean(id));

  useEffect(() => {
    if (!id) return;
    categoryService
      .get(id)
      .then((data) => {
        setForm({
          name: data.name || '',
          name_ar: data.name_ar || '',
          description: data.description || '',
          description_ar: data.description_ar || '',
          image: data.image || '',
          icon: data.icon || 'FiBox',
          sort_order: data.sort_order || 0,
          featured: Boolean(data.featured),
        });
      })
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }, [id]);

  const saveCategory = async () => {
    if (id) {
      await categoryService.update(id, form);
      return id;
    }
    const created = await categoryService.create(form);
    return created.id;
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await saveCategory();
      toast.success(t('admin.saved'));
      navigate('/admin/categories');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const createProduct = async () => {
    if (!form.name.trim()) {
      toast.error(t('admin.nameHint'));
      return;
    }
    setSaving(true);
    try {
      const categoryId = await saveCategory();
      navigate(`/admin/products/new?categoryId=${categoryId}`);
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
      title={id ? t('admin.editCategory') : t('admin.newCategory')}
      subtitle={t('admin.studioCategory')}
      backTo="/admin/categories"
      cancelLabel={t('admin.cancel')}
      saveLabel={saving ? t('admin.saving') : t('admin.saveCategory')}
      saving={saving}
      onSubmit={save}
      extraAction={
        <button type="button" onClick={createProduct} className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#111] dark:bg-white text-white dark:text-black font-bold inline-flex items-center justify-center gap-2">
          <FiPlus /> {t('admin.addProductInCategory')}
        </button>
      }
      preview={
        <LivePreview title={t('admin.appearsAs')}>
          <div className="relative overflow-hidden rounded-[22px] min-h-[280px] bg-[#111] text-white">
            {form.image ? (
              <img src={mediaUrl(form.image)} alt="" className="absolute inset-0 w-full h-full object-cover opacity-80" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#C63637]/30" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="relative z-10 h-full min-h-[280px] p-6 flex flex-col justify-end">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mb-4">
                <CategoryIcon name={form.icon} />
              </div>
              <p className="text-2xl font-black leading-tight">{form.name || t('admin.untitled')}</p>
              <p className="text-sm text-white/70 mt-2 line-clamp-2">{form.description || t('admin.descHint')}</p>
            </div>
          </div>
        </LivePreview>
      }
    >
      <SectionCard step="01" title={t('admin.identity')} subtitle={t('admin.bilingualHint')}>
        <Field label={t('admin.name')} hint={t('admin.nameHint')}>
          <input className="admin-input text-lg font-semibold" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </Field>
        <Field label={t('admin.nameAr')}>
          <input className="admin-input text-lg font-semibold" dir="rtl" value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} />
        </Field>
        <Field label={t('admin.description')} hint={t('admin.descHint')}>
          <textarea className="admin-input min-h-28" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </Field>
        <Field label={t('admin.descriptionAr')}>
          <textarea className="admin-input min-h-28" dir="rtl" value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} />
        </Field>
      </SectionCard>

      <SectionCard step="02" title={t('admin.coverImage')} subtitle={t('admin.coverHint')}>
        <ImageField value={form.image} onChange={(image) => setForm({ ...form, image })} tall />
      </SectionCard>

      <SectionCard step="03" title={t('admin.visibility')} subtitle={t('admin.homepageHint')}>
        <Field label={t('admin.chooseIcon')}>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {ICON_OPTIONS.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => setForm({ ...form, icon })}
                className={`h-14 rounded-2xl flex items-center justify-center border transition-all ${
                  form.icon === icon
                    ? 'bg-[#C63637] text-white border-[#C63637] shadow-lg shadow-[#C63637]/20'
                    : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-[#C63637]/50'
                }`}
              >
                <CategoryIcon name={icon} />
              </button>
            ))}
          </div>
        </Field>
        <Field label={t('admin.sortOrder')}>
          <input type="number" className="admin-input max-w-[160px]" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
        </Field>
        <ToggleRow
          checked={form.featured}
          onChange={(featured) => setForm({ ...form, featured })}
          title={t('admin.showHomepage')}
          subtitle={t('admin.homepageHint')}
        />
      </SectionCard>
    </FormStudio>
  );
}
