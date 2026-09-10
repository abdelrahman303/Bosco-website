import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { FiArrowRight, FiLock, FiMail } from 'react-icons/fi';
import ThemeLangToggles from '../../components/admin/ThemeLangToggles';
import Logo from '../../components/Logo';
import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';
import { LIVE_API_URL, STATIC_API } from '../../api/staticAdapter';

export default function AdminLogin() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const needsLiveApi = STATIC_API && !LIVE_API_URL;

  if (!loading && isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (needsLiveApi) {
      toast.error(t('admin.needsLiveApi'));
      return;
    }
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success(t('admin.welcome'));
      navigate(location.state?.from || '/admin', { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-8 sm:py-10 bg-[#f3f1ec] dark:bg-[#080808] text-gray-900 dark:text-white transition-colors">
      <img
        src="https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=1200&auto=format&fit=crop"
        alt=""
        className={`absolute inset-0 w-full h-full object-cover transition-opacity ${
          isDark ? 'opacity-30' : 'opacity-20'
        }`}
      />
      <div
        className={`absolute inset-0 transition-colors ${
          isDark
            ? 'bg-gradient-to-br from-black via-black/80 to-[#C63637]/20'
            : 'bg-gradient-to-br from-[#f3f1ec]/95 via-[#f3f1ec]/85 to-[#C63637]/15'
        }`}
      />

      <div className="absolute top-5 end-5 z-20">
        <ThemeLangToggles />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-6">
            <Logo onDark={isDark} size="login" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-3 text-gray-900 dark:text-white">
            {t('admin.loginTitle')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{t('admin.loginSubtitle')}</p>
        </div>

        {needsLiveApi ? (
          <div className="mb-5 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100">
            {t('admin.needsLiveApiHint')}
          </div>
        ) : null}

        <form
          onSubmit={handleSubmit}
          className="bg-white/90 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-[28px] p-6 sm:p-8 shadow-2xl space-y-5"
        >
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {t('admin.emailLabel')}
            </span>
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl px-4">
              <FiMail className="text-[#C63637] shrink-0" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent py-3.5 outline-none text-gray-900 dark:text-white placeholder:text-gray-400"
              />
            </div>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {t('admin.password')}
            </span>
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl px-4">
              <FiLock className="text-[#C63637] shrink-0" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent py-3.5 outline-none text-gray-900 dark:text-white placeholder:text-gray-400"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={submitting || needsLiveApi}
            className="w-full group flex items-center justify-center gap-2 bg-[#C63637] hover:bg-red-700 disabled:opacity-60 text-white py-3.5 rounded-2xl font-bold transition-colors"
          >
            {submitting ? t('admin.signingIn') : t('admin.signIn')}
            <FiArrowRight className="group-hover:translate-x-1 rtl:rotate-180 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
}
