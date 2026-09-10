export function scrollToTop(smooth = false) {
  const lenis = window.__boscoLenis;
  if (lenis) {
    lenis.scrollTo(0, { duration: smooth ? 0.85 : 0, immediate: !smooth });
  }

  const behavior = smooth ? 'smooth' : 'auto';
  try {
    window.scrollTo({ top: 0, left: 0, behavior });
  } catch {
    window.scrollTo(0, 0);
  }

  if (document.documentElement) document.documentElement.scrollTop = 0;
  if (document.body) document.body.scrollTop = 0;
}

export function onAppScroll(handler) {
  let offLenis = null;
  let tries = 0;

  const native = () => handler(window.scrollY || document.documentElement.scrollTop || 0);
  window.addEventListener('scroll', native, { passive: true });

  const attachLenis = () => {
    const lenis = window.__boscoLenis;
    if (!lenis) return false;
    const listen = ({ scroll }) => handler(scroll);
    lenis.on('scroll', listen);
    offLenis = () => lenis.off('scroll', listen);
    return true;
  };

  if (!attachLenis()) {
    const id = setInterval(() => {
      tries += 1;
      if (attachLenis() || tries > 50) clearInterval(id);
    }, 40);
  }

  return () => {
    window.removeEventListener('scroll', native);
    offLenis?.();
  };
}
