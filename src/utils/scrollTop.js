export function scrollToTop(smooth = true) {
  const lenis = window.__boscoLenis;
  if (lenis) {
    lenis.scrollTo(0, { duration: smooth ? 1.15 : 0, immediate: !smooth });
    return;
  }
  window.scrollTo({ top: 0, left: 0, behavior: smooth ? 'smooth' : 'auto' });
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
