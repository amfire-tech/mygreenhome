import { useEffect, useRef, useState } from 'react';
import { WHATSAPP_URL } from '../constants/pricing';

// Persistent floating WhatsApp button — reveals only once the visitor has
// scrolled into the lower part of the page (not over the hero).
export default function WhatsAppFab() {
  const [show, setShow] = useState(false);
  const rafRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? window.scrollY / max : 0;
        setShow(p > 0.6);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`wa-fab${show ? ' is-visible' : ''}`}
      aria-label="Chat with us on WhatsApp"
    >
      <span className="wa-fab__icon" aria-hidden="true">
        <svg width="26" height="26" viewBox="0 0 32 32" fill="currentColor">
          <path d="M16.04 4C9.93 4 4.98 8.95 4.98 15.06c0 2.04.55 4.02 1.6 5.76L4.5 28l7.36-1.93a11.04 11.04 0 0 0 4.18.82h.01c6.11 0 11.06-4.95 11.06-11.06C27.11 8.95 22.16 4 16.04 4Zm0 20.2h-.01a9.2 9.2 0 0 1-4.68-1.28l-.34-.2-3.49.92.93-3.4-.22-.35a9.13 9.13 0 0 1-1.4-4.84c0-5.06 4.12-9.18 9.19-9.18 2.45 0 4.76.96 6.49 2.69a9.12 9.12 0 0 1 2.69 6.5c0 5.06-4.12 9.18-9.19 9.18Zm5.04-6.88c-.28-.14-1.63-.8-1.88-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.59.07-.28-.14-1.16-.43-2.22-1.37-.82-.73-1.37-1.64-1.53-1.91-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.49.14-.16.18-.28.28-.46.09-.18.05-.35-.02-.49-.07-.14-.61-1.48-.84-2.02-.22-.53-.45-.46-.61-.46-.16-.01-.34-.01-.52-.01s-.49.07-.74.35c-.25.28-.97.95-.97 2.3s1 2.67 1.13 2.85c.14.18 1.96 2.99 4.75 4.2.66.28 1.18.45 1.58.58.66.21 1.27.18 1.74.11.53-.08 1.63-.67 1.86-1.31.23-.64.23-1.19.16-1.31-.07-.12-.25-.19-.53-.33Z" />
        </svg>
      </span>
      <span className="wa-fab__label font-body">Chat with us</span>
      <span className="wa-fab__dot" aria-hidden="true" />
    </a>
  );
}
