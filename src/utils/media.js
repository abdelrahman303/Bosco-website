const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=800&auto=format&fit=crop';

export function mediaUrl(url) {
  if (!url) return FALLBACK_IMAGE;
  if (/^https?:\/\//i.test(url) || url.startsWith('data:')) return url;

  const api = import.meta.env.VITE_API_URL || '/api';
  const origin = api.replace(/\/?api\/?$/, '');
  if (url.startsWith('/') && /^https?:\/\//i.test(origin)) {
    return `${origin}${url}`;
  }
  return url;
}

export function catalogImage(url, width = 800) {
  const source = mediaUrl(url);
  if (!source.includes('images.unsplash.com')) return source;
  if (source.includes('w=')) return source.replace(/w=\d+/, `w=${width}`);
  const join = source.includes('?') ? '&' : '?';
  return `${source}${join}w=${width}&auto=format&fit=crop`;
}

export function formatPrice(product, { quoteLabel = 'Request quote', locale = 'en-US' } = {}) {
  if (!product) return quoteLabel;
  if (product.price_on_request || product.price == null) return quoteLabel;
  const amount = Number(product.price);
  if (!Number.isFinite(amount)) return quoteLabel;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: product.currency || 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export { FALLBACK_IMAGE };
