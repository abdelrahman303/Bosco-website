import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import {
  FiAlertCircle,
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiMail,
  FiRefreshCw,
} from 'react-icons/fi';
import { SectionCard } from '../../components/admin/FormPrimitives';
import { mailService } from '../../services/mailService';

export function EmailHistoryCard({ item, resendingId, onResend, t }) {
  return (
    <article className="rounded-2xl border border-gray-200 dark:border-white/10 p-4 bg-gray-50 dark:bg-white/5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-bold truncate">{item.subject}</p>
          <p className="text-xs text-gray-500 mt-1 break-all">{item.to_email}</p>
        </div>
        <span
          className={`shrink-0 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
            item.status === 'sent'
              ? 'bg-emerald-500/10 text-emerald-600'
              : 'bg-red-500/10 text-red-500'
          }`}
        >
          {item.status === 'sent' ? <FiCheckCircle /> : <FiAlertCircle />}
          {item.status}
        </span>
      </div>
      {item.content && (
        <p className="text-xs text-gray-500 mt-3 line-clamp-3 whitespace-pre-wrap">{item.content}</p>
      )}
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs text-gray-400 inline-flex items-center gap-1">
          <FiClock /> {item.created_at}
        </p>
        <button
          type="button"
          onClick={() => onResend(item)}
          disabled={resendingId === item.id || !item.content}
          className="text-xs font-bold inline-flex items-center gap-1 text-[#C63637] hover:underline disabled:opacity-40"
        >
          <FiRefreshCw className={resendingId === item.id ? 'animate-spin' : ''} />
          {resendingId === item.id ? t('admin.email.resending') : t('admin.email.resend')}
        </button>
      </div>
      {item.error_message && <p className="text-xs text-red-500 mt-2">{item.error_message}</p>}
    </article>
  );
}

export default function EmailHistoryPage() {
  const { t } = useTranslation();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resendingId, setResendingId] = useState(null);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const mailHistory = await mailService.history();
      setHistory(mailHistory || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleResend = async (item) => {
    setResendingId(item.id);
    try {
      await mailService.resend(item.id);
      toast.success(t('admin.email.resent'));
      await loadHistory();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setResendingId(null);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">
            {t('admin.email.eyebrow')}
          </p>
          <h1 className="admin-title flex items-center gap-3">
            <FiMail className="text-[#C63637]" />
            {t('admin.email.allHistoryTitle')}
          </h1>
          <p className="admin-subtitle">{t('admin.email.allHistoryHint')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/email"
            className="admin-secondary"
          >
            <FiArrowLeft /> {t('admin.email.backToCompose')}
          </Link>
          <button
            type="button"
            onClick={loadHistory}
            className="admin-secondary"
          >
            <FiRefreshCw /> {t('admin.email.refresh')}
          </button>
        </div>
      </div>

      <SectionCard title={t('admin.email.history')} subtitle={t('admin.email.historyHint')}>
        {loading ? (
          <p className="text-sm text-gray-500">Loading…</p>
        ) : history.length === 0 ? (
          <div className="py-10 text-center text-gray-500">{t('admin.email.noHistory')}</div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <EmailHistoryCard
                key={item.id}
                item={item}
                resendingId={resendingId}
                onResend={handleResend}
                t={t}
              />
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
