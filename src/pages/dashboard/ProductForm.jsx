import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import ImageField from '../../components/admin/ImageField';
import { Field, FormStudio, LivePreview, SectionCard, ToggleRow } from '../../components/admin/FormPrimitives';
import { categoryService } from '../../services/categoryService';
import { productService } from '../../services/productService';
import { subcategoryService } from '../../services/subcategoryService';
import { formatPrice, mediaUrl } from '../../utils/media';

const emptyProduct = {
  name: '',
  name_ar: '',
  model: '',
  sku: '',
  category_id: '',
  subcategory_id: '',
  short_description: '',
  short_description_ar: '',
  description: '',
  description_ar: '',
  image: '',
  gallery: [],
  specs: [{ key: '', value: '' }],
  features: [''],
  price: '',
  currency: 'USD',
  price_on_request: true,
  brand: 'Bosco',
  origin: '',
  capacity: '',
  power: '',
  dimensions: '',
  warranty: '',
  featured: false,
  in_stock: true,
  status: 'published',
};

function toForm(product) {
  const specs = Object.entries(product.specs || {}).map(([key, value]) => ({ key, value }));
  return {
    ...emptyProduct,
    ...product,
    category_id: product.category_id || '',
    subcategory_id: product.subcategory_id || '',
    gallery: product.gallery || [],
    specs: specs.length ? specs : [{ key: '', value: '' }],
    features: product.features?.length ? product.features : [''],
    price: product.price ?? '',
    price_on_request: Boolean(product.price_on_request),
    featured: Boolean(product.featured),
    in_stock: Boolean(product.in_stock),
  };
}

export default function ProductForm() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyProduct);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(Boolean(id));
  const [step, setStep] = useState(0);

  const steps = [
    t('admin.stepDetails'),
    t('admin.stepPhotos'),
    t('admin.stepSpecs'),
    t('admin.stepPublish'),
  ];

  useEffect(() => {
    categoryService.list().then(setCategories).catch((error) => toast.error(error.message));
  }, []);

  useEffect(() => {
    if (id) return;
    const categoryId = params.get('categoryId');
    const subcategoryId = params.get('subcategoryId');
    if (!categoryId && !subcategoryId) return;
    setForm((prev) => ({
      ...prev,
      category_id: categoryId || prev.category_id,
      subcategory_id: subcategoryId || prev.subcategory_id,
    }));
  }, [id, params]);

  useEffect(() => {
    const top = document.getElementById('admin-studio-top');
    const y = top ? top.getBoundingClientRect().top + window.scrollY - 88 : 0;
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
  }, [step]);

  useEffect(() => {
    if (!form.category_id) {
      setSubcategories([]);
      return;
    }
    subcategoryService.list(form.category_id).then(setSubcategories).catch(() => setSubcategories([]));
  }, [form.category_id]);

  useEffect(() => {
    if (!id) return;
    productService
      .get(id)
      .then(({ data }) => setForm(toForm(data)))
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }, [id]);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const category = categories.find((item) => String(item.id) === String(form.category_id));
  const subcategory = subcategories.find((item) => String(item.id) === String(form.subcategory_id));
  const assignedName = [category?.name, subcategory?.name].filter(Boolean).join(' / ');

  const save = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setStep(0);
      toast.error(t('admin.nameHint'));
      return;
    }
    if (!form.category_id) {
      setStep(3);
      toast.error(t('admin.category'));
      return;
    }
    setSaving(true);
    const specs = Object.fromEntries(form.specs.filter((row) => row.key.trim()).map((row) => [row.key.trim(), row.value]));
    const payload = {
      ...form,
      specs,
      features: form.features.filter(Boolean),
      gallery: form.gallery.filter(Boolean),
      price: form.price === '' ? null : form.price,
    };

    try {
      if (id) await productService.update(id, payload);
      else await productService.create(payload);
      toast.success(t('admin.productLive'));
      navigate('/admin/products');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-gray-500">{t('admin.loadingProduct')}</div>;
  }

  return (
    <FormStudio
      eyebrow={t('admin.productDetails')}
      title={id ? t('admin.editProduct') : t('admin.newProduct')}
      subtitle={t('admin.studioProduct')}
      backTo="/admin/products"
      cancelLabel={t('admin.cancel')}
      saveLabel={saving ? t('admin.saving') : t('admin.savePublish')}
      saving={saving}
      onSubmit={save}
      preview={
        <LivePreview title={t('admin.appearsAs')}>
          <div className="overflow-hidden rounded-[22px] bg-[#111] text-white min-h-[360px] relative">
            {form.image ? (
              <img src={mediaUrl(form.image)} alt="" className="absolute inset-0 w-full h-full object-cover opacity-75" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#1c1c1c] to-[#C63637]/25" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="relative z-10 min-h-[360px] p-6 flex flex-col justify-end">
              <span className="self-start text-[10px] uppercase tracking-[0.2em] font-bold bg-white/10 border border-white/10 px-3 py-1 rounded-full mb-3">
                {category?.name || t('admin.category')}
              </span>
              <h3 className="text-2xl font-black leading-tight">{form.name || t('admin.untitled')}</h3>
              <p className="text-sm text-white/70 mt-2 line-clamp-2">{form.short_description || t('admin.descHint')}</p>
              <p className="font-bold mt-4 text-[#ffb4b4]">{formatPrice(form)}</p>
            </div>
          </div>
        </LivePreview>
      }
    >
      {assignedName && (
        <div className="rounded-2xl border border-[#C63637]/20 bg-[#C63637]/5 px-4 py-3 text-sm font-semibold text-[#C63637] text-start">
          {t('admin.assignedTo', { name: assignedName })}
        </div>
      )}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {steps.map((label, index) => (
          <button
            key={label}
            type="button"
            onClick={() => setStep(index)}
            className={`shrink-0 px-4 py-2.5 rounded-full text-sm font-bold transition-all ${
              step === index
                ? 'bg-[#C63637] text-white shadow-lg shadow-[#C63637]/20'
                : 'bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 text-gray-500'
            }`}
          >
            0{index + 1} {label}
          </button>
        ))}
      </div>

      {step === 0 && (
        <SectionCard step="01" title={t('admin.identity')} subtitle={t('admin.bilingualHint')}>
          <Field label={t('admin.name')} hint={t('admin.nameHint')}>
            <input className="admin-input text-lg font-semibold" value={form.name} onChange={(e) => update('name', e.target.value)} required />
          </Field>
          <Field label={t('admin.nameAr')}>
            <input className="admin-input text-lg font-semibold" dir="rtl" value={form.name_ar} onChange={(e) => update('name_ar', e.target.value)} />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label={t('admin.model')}>
              <input className="admin-input" value={form.model} onChange={(e) => update('model', e.target.value)} />
            </Field>
            <Field label={t('admin.sku')}>
              <input className="admin-input" value={form.sku} onChange={(e) => update('sku', e.target.value)} />
            </Field>
          </div>
          <Field label={t('admin.shortDescription')} hint={t('admin.descHint')}>
            <textarea className="admin-input min-h-24" value={form.short_description} onChange={(e) => update('short_description', e.target.value)} />
          </Field>
          <Field label={t('admin.shortDescriptionAr')}>
            <textarea className="admin-input min-h-24" dir="rtl" value={form.short_description_ar} onChange={(e) => update('short_description_ar', e.target.value)} />
          </Field>
          <Field label={t('admin.fullDescription')}>
            <textarea className="admin-input min-h-40" value={form.description} onChange={(e) => update('description', e.target.value)} />
          </Field>
          <Field label={t('admin.fullDescriptionAr')}>
            <textarea className="admin-input min-h-40" dir="rtl" value={form.description_ar} onChange={(e) => update('description_ar', e.target.value)} />
          </Field>
        </SectionCard>
      )}

      {step === 1 && (
        <SectionCard step="02" title={t('admin.media')} subtitle={t('admin.coverHint')}>
          <Field label={t('admin.mainImage')}>
            <ImageField value={form.image} onChange={(image) => update('image', image)} tall />
          </Field>
          <div className="flex items-center justify-between">
            <p className="font-bold">{t('admin.gallery')}</p>
            <button type="button" className="text-sm font-bold text-[#C63637] inline-flex items-center gap-1" onClick={() => update('gallery', [...form.gallery, ''])}>
              <FiPlus /> {t('admin.addImage')}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {form.gallery.map((url, index) => (
              <div key={index} className="relative">
                <ImageField
                  value={url}
                  onChange={(value) => {
                    const next = [...form.gallery];
                    next[index] = value;
                    update('gallery', next);
                  }}
                />
                <button
                  type="button"
                  className="absolute top-3 start-3 z-20 admin-icon-btn text-red-500 bg-white/90"
                  onClick={() => update('gallery', form.gallery.filter((_, i) => i !== index))}
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {step === 2 && (
        <>
          <SectionCard step="03" title={t('admin.specifications')}>
            {form.specs.map((row, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2">
                <input className="admin-input" placeholder={t('admin.label')} value={row.key} onChange={(e) => {
                  const next = [...form.specs];
                  next[index] = { ...row, key: e.target.value };
                  update('specs', next);
                }} />
                <input className="admin-input" placeholder={t('admin.value')} value={row.value} onChange={(e) => {
                  const next = [...form.specs];
                  next[index] = { ...row, value: e.target.value };
                  update('specs', next);
                }} />
                <button type="button" className="admin-icon-btn text-red-500" onClick={() => update('specs', form.specs.filter((_, i) => i !== index))}>
                  <FiTrash2 />
                </button>
              </div>
            ))}
            <button type="button" className="text-sm font-bold text-[#C63637]" onClick={() => update('specs', [...form.specs, { key: '', value: '' }])}>
              {t('admin.addSpec')}
            </button>
          </SectionCard>
          <SectionCard title={t('admin.features')}>
            {form.features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <input className="admin-input" placeholder={t('admin.feature')} value={feature} onChange={(e) => {
                  const next = [...form.features];
                  next[index] = e.target.value;
                  update('features', next);
                }} />
                <button type="button" className="admin-icon-btn text-red-500 shrink-0" onClick={() => update('features', form.features.filter((_, i) => i !== index))}>
                  <FiTrash2 />
                </button>
              </div>
            ))}
            <button type="button" className="text-sm font-bold text-[#C63637]" onClick={() => update('features', [...form.features, ''])}>
              {t('admin.addFeature')}
            </button>
          </SectionCard>
          <SectionCard title={t('admin.technical')}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label={t('admin.capacity')}><input className="admin-input" value={form.capacity} onChange={(e) => update('capacity', e.target.value)} /></Field>
              <Field label={t('admin.power')}><input className="admin-input" value={form.power} onChange={(e) => update('power', e.target.value)} /></Field>
              <Field label={t('admin.dimensions')}><input className="admin-input" value={form.dimensions} onChange={(e) => update('dimensions', e.target.value)} /></Field>
              <Field label={t('admin.warranty')}><input className="admin-input" value={form.warranty} onChange={(e) => update('warranty', e.target.value)} /></Field>
            </div>
          </SectionCard>
        </>
      )}

      {step === 3 && (
        <>
          <SectionCard step="04" title={t('admin.classification')}>
            <Field label={t('admin.category')}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, category_id: cat.id, subcategory_id: '' }))}
                    className={`text-start rounded-2xl border p-4 ${
                      String(form.category_id) === String(cat.id)
                        ? 'border-[#C63637] bg-[#C63637]/5'
                        : 'border-gray-200 dark:border-white/10'
                    }`}
                  >
                    <p className="font-bold">{cat.name}</p>
                  </button>
                ))}
              </div>
            </Field>
            <Field label={t('admin.subcategoryOptional')}>
              <select className="admin-input" value={form.subcategory_id || ''} onChange={(e) => update('subcategory_id', e.target.value)}>
                <option value="">{t('admin.subcategoryOptional')}</option>
                {subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </Field>
          </SectionCard>
          <SectionCard title={t('admin.commercial')}>
            <div className="grid grid-cols-2 gap-4">
              <Field label={t('admin.price')}><input className="admin-input" value={form.price} onChange={(e) => update('price', e.target.value)} /></Field>
              <Field label={t('admin.currency')}><input className="admin-input" value={form.currency} onChange={(e) => update('currency', e.target.value)} /></Field>
              <Field label={t('admin.brand')}><input className="admin-input" value={form.brand} onChange={(e) => update('brand', e.target.value)} /></Field>
              <Field label={t('admin.origin')}><input className="admin-input" value={form.origin} onChange={(e) => update('origin', e.target.value)} /></Field>
            </div>
            <ToggleRow checked={form.price_on_request} onChange={(value) => update('price_on_request', value)} title={t('admin.priceOnRequest')} />
            <ToggleRow checked={form.featured} onChange={(value) => update('featured', value)} title={t('admin.featuredHomepage')} subtitle={t('admin.homepageHint')} />
            <ToggleRow checked={form.in_stock} onChange={(value) => update('in_stock', value)} title={t('admin.inStock')} />
            <Field label={t('admin.status')}>
              <select className="admin-input" value={form.status} onChange={(e) => update('status', e.target.value)}>
                <option value="published">{t('admin.published')}</option>
                <option value="draft">{t('admin.draft')}</option>
              </select>
            </Field>
          </SectionCard>
        </>
      )}

      <div className="flex justify-between">
        <button type="button" disabled={step === 0} onClick={() => setStep((value) => value - 1)} className="px-5 py-3 rounded-2xl border border-gray-200 dark:border-white/10 font-semibold disabled:opacity-40">
          {t('admin.back')}
        </button>
        {step < steps.length - 1 && (
          <button type="button" onClick={() => setStep((value) => value + 1)} className="admin-primary">
            {t('admin.next')}
          </button>
        )}
      </div>
    </FormStudio>
  );
}
