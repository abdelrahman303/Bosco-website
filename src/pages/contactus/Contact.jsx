import { useLayoutEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import gsap from 'gsap';
import { FiClock, FiMail, FiMapPin, FiPhone, FiSend } from 'react-icons/fi';
import SafeImage from '../../components/SafeImage';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { inquiryService } from '../../services/inquiryService';
import { COMPANY } from '../../utils/company';

const officeMeta = [
  { icon: FiMapPin, href: COMPANY.maps },
  { icon: FiPhone, href: `tel:${COMPANY.phoneTel}` },
  { icon: FiMail, href: `mailto:${COMPANY.email}` },
  { icon: FiClock, href: null },
];

export default function Contact() {
  const { t } = useTranslation();
  const location = useLocation();
  const isQuote = location.pathname.includes('quote');
  const needs = t('site.contact.needs', { returnObjects: true }) || [];
  const officeCopy = t('site.contact.offices', { returnObjects: true }) || [];
  const offices = officeMeta.map((item, index) => ({ ...item, ...(officeCopy[index] || {}) }));
  const steps = (t('site.contact.steps', { returnObjects: true }) || []).map((item, index) => ({
    ...item,
    id: String(index + 1).padStart(2, '0'),
  }));
  const chips = t('site.contact.chips', { returnObjects: true }) || [];
  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '', message: '' });
  const [need, setNeed] = useState('');
  const [sending, setSending] = useState(false);

  const pageRef = useRef(null);
  const cardsRef = useRef(null);
  const formRef = useRef(null);

  const activeNeed = need || needs[0] || '';
  const setField = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setSending(true);
    try {
      await inquiryService.create({
        ...form,
        type: isQuote ? 'quote' : 'contact',
        message: `${activeNeed} — ${form.message}`,
      });
      toast.success(t('site.contact.success'));
      setForm({ name: '', email: '', company: '', phone: '', message: '' });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSending(false);
    }
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-hero > *',
        { y: 32, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.85, stagger: 0.1, ease: 'power3.out', overwrite: true }
      );
    }, pageRef);
    return () => ctx.revert();
  }, [isQuote]);

  useScrollReveal(cardsRef, '.contact-card', [isQuote]);
  useScrollReveal(formRef, '.contact-form, .contact-step', [isQuote]);

  return (
    <div ref={pageRef} className="bg-[var(--bg)] min-h-screen">
      <Helmet>
        <title>{isQuote ? t('site.contact.quoteKicker') : t('site.contact.kicker')} | Bosco</title>
      </Helmet>

      <section className="relative overflow-hidden pt-24 sm:pt-32 pb-14 sm:pb-20 lg:pb-24">
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        <SafeImage
          src="https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=1600&auto=format&fit=crop"
          alt=""
          width={1600}
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/75 to-[#0a0a0a]" />
        <div className="absolute top-20 start-1/4 w-80 h-80 bg-[#C63637]/25 blur-[120px] rounded-full pointer-events-none" />

        <div className="contact-hero relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#C63637] mb-4">
            {isQuote ? t('site.contact.quoteKicker') : t('site.contact.kicker')}
          </p>
          <h1 className="text-3xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl leading-[0.95]">
            {isQuote ? t('site.contact.quoteTitle') : t('site.contact.title')}
          </h1>
          <p className="text-gray-300 text-lg mt-6 max-w-2xl">
            {t('site.contact.lead')}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            {chips.map((item) => (
              <span
                key={item}
                className="px-4 py-2 rounded-full bg-white/8 border border-white/15 text-sm font-semibold text-white"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 -mt-6 sm:-mt-8 pb-16 sm:pb-24">
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 mb-10">
          {offices.map((item) => {
            const Icon = item.icon;
            const inner = (
              <>
                <span className="w-11 h-11 rounded-2xl bg-[#C63637]/10 text-[#C63637] flex items-center justify-center">
                  <Icon size={18} />
                </span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500">{item.label}</p>
                  <p className="font-black text-lg text-gray-900 dark:text-white">{item.value}</p>
                </div>
              </>
            );
            const cls =
              'contact-card flex items-start gap-4 rounded-[24px] bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 p-2 text-start hover:-translate-y-1 transition-transform duration-300';
            return item.href ? (
              <a key={item.label} href={item.href} className={cls}>
                {inner}
              </a>
            ) : (
              <div key={item.label} className={cls}>
                {inner}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-[28px] overflow-hidden bg-[#111] min-h-[280px] relative">
              <SafeImage
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop"
                alt="Bosco engineering"
                width={1200}
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="relative z-10 p-8 min-h-[280px] flex flex-col justify-end">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#C63637]">{t('site.contact.floorKicker')}</p>
                <h2 className="text-3xl font-black text-white mt-2">{t('site.contact.floorTitle')}</h2>
              </div>
            </div>

            <div className="space-y-3">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className="contact-step rounded-[24px] bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 p-5 flex gap-4"
                >
                  <span className="text-[#C63637] font-black text-xl">{step.id}</span>
                  <div>
                    <h3 className="font-black text-lg">{step.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form
            ref={formRef}
            onSubmit={submit}
            className="contact-form lg:col-span-7 rounded-[24px] sm:rounded-[32px] bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 p-5 sm:p-9 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.45)] space-y-5"
          >
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#C63637]">{t('site.contact.formKicker')}</p>
              <h2 className="text-3xl font-black tracking-tight mt-2">
                {isQuote ? t('site.contact.quoteFormTitle') : t('site.contact.formTitle')}
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {needs.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setNeed(item)}
                  className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
                    activeNeed === item
                      ? 'bg-[#C63637] text-white border-[#C63637]'
                      : 'bg-transparent border-gray-200 dark:border-white/10 hover:border-[#C63637]/50'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <label className="block text-start">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{t('site.common.fullName')}</span>
              <input
                className="admin-input mt-2"
                required
                value={form.name}
                onChange={setField('name')}
                placeholder={t('site.contact.namePh')}
              />
            </label>

            <label className="block text-start">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{t('site.common.workEmail')}</span>
              <input
                className="admin-input mt-2"
                type="email"
                required
                value={form.email}
                onChange={setField('email')}
                placeholder={t('site.contact.emailPh')}
              />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block text-start">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{t('site.common.company')}</span>
                <input className="admin-input mt-2" value={form.company} onChange={setField('company')} placeholder={t('site.contact.companyPh')} />
              </label>
              <label className="block text-start">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{t('site.common.phone')}</span>
                <input className="admin-input mt-2" value={form.phone} onChange={setField('phone')} placeholder="+20 …" />
              </label>
            </div>

            <label className="block text-start">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{t('site.contact.needLabel')}</span>
              <textarea
                className="admin-input mt-2 min-h-36"
                required
                value={form.message}
                onChange={setField('message')}
                placeholder={t('site.contact.messagePh')}
              />
            </label>

            <button disabled={sending} className="btn-pump admin-primary w-full justify-center text-base py-4">
              {sending ? t('site.common.sending') : isQuote ? t('site.contact.quoteSubmit') : t('site.contact.submit')}
              <FiSend />
            </button>
            <a
              href={COMPANY.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="btn-pump inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] text-white font-bold py-3.5"
            >
              WhatsApp · {COMPANY.phoneDisplay}
            </a>
            <p className="text-xs text-gray-500 text-center">
              {t('site.contact.note')}
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
