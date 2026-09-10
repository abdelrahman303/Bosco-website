import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import {
  FiMail,
  FiSend,
  FiEye,
  FiRefreshCw,
  FiShield,
  FiUser,
  FiArrowRight,
  FiAlertCircle,
  FiCheckCircle,
} from 'react-icons/fi';
import { Field, SectionCard } from '../../components/admin/FormPrimitives';
import { mailService } from '../../services/mailService';
import { EmailHistoryCard } from './EmailHistory';

const FROM_EMAIL = 'bosco.intertrade@outlook.com';
const PREVIEW_HISTORY_COUNT = 2;

const emptyForm = {
  to: '',
  cc: '',
  recipientName: '',
  subject: '',
  content: '',
};

const templates = [
  {
    id: 'intro',
    subjectEn: 'Introduction from Bosco International Trade',
    subjectAr: 'تعريف من بوسكو للتجارة الدولية',
    contentEn:
      'Thank you for your interest in Bosco International Trade.\n\nWe supply industrial machinery, raw materials, and production solutions for food and pharmaceutical manufacturers.\n\nPlease let us know how we can support your next project.',
    contentAr:
      'شكراً لاهتمامكم ببوسكو للتجارة الدولية.\n\nنوفر الآلات الصناعية والمواد الخام وحلول الإنتاج لمصانع الأغذية والأدوية.\n\nيسعدنا معرفة كيف يمكننا دعم مشروعكم القادم.',
  },
  {
    id: 'quote',
    subjectEn: 'Your quotation from Bosco International Trade',
    subjectAr: 'عرض السعر من بوسكو للتجارة الدولية',
    contentEn:
      'Please find below the details related to your quotation request.\n\nWe remain available to adjust specifications, lead time, or commercial terms as needed.\n\nLooking forward to your confirmation.',
    contentAr:
      'نرفق لكم تفاصيل عرض السعر المطلوب.\n\nنحن جاهزون لتعديل المواصفات أو مدة التوريد أو الشروط التجارية حسب احتياجكم.\n\nبانتظار تأكيدكم.',
  },
  {
    id: 'followup',
    subjectEn: 'Following up on your Bosco inquiry',
    subjectAr: 'متابعة لاستفساركم لدى بوسكو',
    contentEn:
      'We are following up on your recent inquiry with Bosco International Trade.\n\nIf you need additional information, product options, or a revised proposal, our team is ready to assist.',
    contentAr:
      'نتابع معكم بخصوص استفساركم الأخير لدى بوسكو للتجارة الدولية.\n\nإذا كنتم بحاجة إلى معلومات إضافية أو خيارات منتجات أو عرض محدّث، فريقنا جاهز للمساعدة.',
  },
];

function EmailPreview({ form, t }) {
  const lines = (form.content || t('admin.email.previewBody')).split('\n');

  return (
    <div className="rounded-[24px] overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0f0f0f] shadow-[0_20px_50px_-28px_rgba(0,0,0,0.35)]">
      <div className="bg-gradient-to-br from-[#111] via-[#1a1a1a] to-[#C63637] px-5 py-5 text-white">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/70">
          Bosco International Trade
        </p>
        <h3 className="mt-2 text-xl font-black leading-snug">
          {form.subject || t('admin.email.previewSubject')}
        </h3>
      </div>
      <div className="p-5 sm:p-6 space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {form.recipientName
            ? t('admin.email.dearName', { name: form.recipientName })
            : t('admin.email.dearGeneric')}
        </p>
        <div className="text-sm leading-7 text-gray-800 dark:text-gray-200 space-y-1">
          {lines.map((line, index) => (
            <p key={`${line}-${index}`}>{line || '\u00A0'}</p>
          ))}
        </div>
        <div className="pt-4 border-t border-gray-100 dark:border-white/10 text-sm text-gray-500">
          <p>{t('admin.email.regards')}</p>
          <p className="font-bold text-gray-900 dark:text-white mt-1">Bosco International Trade</p>
          <p className="text-[#C63637] mt-1">{FROM_EMAIL}</p>
        </div>
      </div>
      <div className="bg-[#111] px-5 py-3 text-center text-[11px] text-white/60">
        {t('admin.email.footer')}
      </div>
    </div>
  );
}

export default function EmailServices() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');
  const [form, setForm] = useState(emptyForm);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [showPreview, setShowPreview] = useState(true);
  const [resendingId, setResendingId] = useState(null);

  const loadMeta = async () => {
    try {
      const [mailStatus, mailHistory] = await Promise.all([
        mailService.status(),
        mailService.history(),
      ]);
      setStatus(mailStatus);
      setHistory(mailHistory || []);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleResend = async (item) => {
    setResendingId(item.id);
    try {
      await mailService.resend(item.id);
      toast.success(t('admin.email.resent'));
      await loadMeta();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setResendingId(null);
    }
  };

  useEffect(() => {
    loadMeta();
  }, []);

  const canSend = useMemo(() => {
    return (
      form.to.trim() &&
      form.subject.trim().length >= 3 &&
      form.content.trim().length >= 10 &&
      !sending
    );
  }, [form, sending]);

  const applyTemplate = (template) => {
    setForm((prev) => ({
      ...prev,
      subject: isAr ? template.subjectAr : template.subjectEn,
      content: isAr ? template.contentAr : template.contentEn,
    }));
  };

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const send = async (event) => {
    event.preventDefault();
    if (!canSend) return;

    setSending(true);
    try {
      const result = await mailService.send({
        to: form.to.trim(),
        cc: form.cc.trim(),
        recipientName: form.recipientName.trim(),
        subject: form.subject.trim(),
        content: form.content.trim(),
      });
      toast.success(result.message || t('admin.email.sent'));
      setForm(emptyForm);
      await loadMeta();
    } catch (error) {
      toast.error(error.message);
      await loadMeta();
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto space-y-6 sm:space-y-8">
      <div className="admin-page-header">
        <div className="text-start">
          <p className="admin-eyebrow">{t('admin.email.eyebrow')}</p>
          <h1 className="admin-title">{t('admin.email.title')}</h1>
          <p className="admin-subtitle">{t('admin.email.subtitle')}</p>
        </div>
        <button
          type="button"
          onClick={loadMeta}
          className="admin-secondary"
        >
          <FiRefreshCw /> {t('admin.email.refresh')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="admin-card flex items-start gap-3">
          <span className="w-11 h-11 rounded-2xl bg-[#C63637]/10 text-[#C63637] flex items-center justify-center">
            <FiMail />
          </span>
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">
              {t('admin.email.from')}
            </p>
            <p className="font-bold mt-1 break-all">{status?.from || FROM_EMAIL}</p>
          </div>
        </div>
        <div className="admin-card flex items-start gap-3">
          <span
            className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
              status?.ok
                ? 'bg-emerald-500/10 text-emerald-500'
                : status?.configured
                  ? 'bg-amber-500/10 text-amber-500'
                  : 'bg-gray-200 dark:bg-white/10 text-gray-500'
            }`}
          >
            {status?.ok ? <FiCheckCircle /> : <FiAlertCircle />}
          </span>
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">
              {t('admin.email.smtpStatus')}
            </p>
            <p className="font-bold mt-1">
              {status?.ok
                ? t('admin.email.ready')
                : status?.configured
                  ? t('admin.email.checkCredentials')
                  : t('admin.email.notConfigured')}
            </p>
          </div>
        </div>
        <div className="admin-card flex items-start gap-3">
          <span className="w-11 h-11 rounded-2xl bg-black/5 dark:bg-white/10 flex items-center justify-center">
            <FiShield />
          </span>
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">
              {t('admin.email.security')}
            </p>
            <p className="font-bold mt-1">{t('admin.email.securityHint')}</p>
          </div>
        </div>
      </div>

      {!status?.configured && (
        <div className="rounded-3xl border border-amber-300/50 bg-amber-50 dark:bg-amber-500/10 px-5 py-4 text-sm text-amber-800 dark:text-amber-200">
          {t('admin.email.envHint')}
        </div>
      )}

      <form onSubmit={send} className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-7 space-y-6">
          <SectionCard step="01" title={t('admin.email.compose')} subtitle={t('admin.email.composeHint')}>
            <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 py-3 flex items-center gap-3">
              <FiMail className="text-[#C63637]" />
              <div>
                <p className="text-[11px] uppercase tracking-widest text-gray-400 font-bold">
                  {t('admin.email.from')}
                </p>
                <p className="font-semibold">{FROM_EMAIL}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label={t('admin.email.to')} hint={t('admin.email.toHint')}>
                <input
                  type="email"
                  required
                  className="admin-input"
                  placeholder="client@company.com"
                  value={form.to}
                  onChange={(e) => update('to', e.target.value)}
                />
              </Field>
              <Field label={t('admin.email.cc')} hint={t('admin.email.ccHint')}>
                <input
                  type="email"
                  className="admin-input"
                  placeholder="optional@company.com"
                  value={form.cc}
                  onChange={(e) => update('cc', e.target.value)}
                />
              </Field>
            </div>

            <Field label={t('admin.email.recipientName')} hint={t('admin.email.recipientHint')}>
              <div className="relative">
                <FiUser className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="admin-input ps-11"
                  placeholder={t('admin.email.recipientPlaceholder')}
                  value={form.recipientName}
                  onChange={(e) => update('recipientName', e.target.value)}
                />
              </div>
            </Field>

            <Field label={t('admin.email.subject')}>
              <input
                required
                className="admin-input text-lg font-semibold"
                placeholder={t('admin.email.subjectPlaceholder')}
                value={form.subject}
                onChange={(e) => update('subject', e.target.value)}
              />
            </Field>

            <Field
              label={t('admin.email.content')}
              hint={t('admin.email.contentHint', { count: form.content.length })}
            >
              <textarea
                required
                className="admin-input min-h-[240px] leading-7"
                placeholder={t('admin.email.contentPlaceholder')}
                value={form.content}
                onChange={(e) => update('content', e.target.value)}
              />
            </Field>

            <div>
              <p className="text-[13px] font-semibold mb-3">{t('admin.email.templates')}</p>
              <div className="flex flex-wrap gap-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => applyTemplate(template)}
                    className="px-3.5 py-2 rounded-full text-xs font-bold border border-gray-200 dark:border-white/10 hover:border-[#C63637] hover:text-[#C63637] transition-colors"
                  >
                    {t(`admin.email.template.${template.id}`)}
                  </button>
                ))}
              </div>
            </div>
          </SectionCard>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => setShowPreview((value) => !value)}
              className="px-5 py-3 rounded-2xl border border-gray-200 dark:border-white/10 font-semibold inline-flex items-center justify-center gap-2"
            >
              <FiEye /> {showPreview ? t('admin.email.hidePreview') : t('admin.email.showPreview')}
            </button>
            <button
              type="submit"
              disabled={!canSend}
              className="admin-primary flex-1 justify-center disabled:opacity-50"
            >
              <FiSend /> {sending ? t('admin.email.sending') : t('admin.email.send')}
            </button>
          </div>
        </div>

        <div className="xl:col-span-5 space-y-6 xl:sticky xl:top-24">
          {showPreview && (
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">
                {t('admin.email.livePreview')}
              </p>
              <EmailPreview form={form} t={t} />
            </div>
          )}

          <SectionCard title={t('admin.email.history')} subtitle={t('admin.email.historyHint')}>
            <div className="space-y-3 pe-1">
              {history.length === 0 && (
                <p className="text-sm text-gray-500">{t('admin.email.noHistory')}</p>
              )}
              {history.slice(0, PREVIEW_HISTORY_COUNT).map((item) => (
                <EmailHistoryCard
                  key={item.id}
                  item={item}
                  resendingId={resendingId}
                  onResend={handleResend}
                  t={t}
                />
              ))}
              {history.length > PREVIEW_HISTORY_COUNT && (
                <Link
                  to="/admin/email/history"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 font-bold text-sm hover:border-[#C63637]/40 hover:text-[#C63637] transition-colors"
                >
                  {t('admin.email.viewAll')} ({history.length})
                  <FiArrowRight />
                </Link>
              )}
            </div>
          </SectionCard>
        </div>
      </form>
    </div>
  );
}
