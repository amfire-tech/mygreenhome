import { forwardRef, useState } from 'react';
import { Menu, X, Leaf } from 'lucide-react';

// Nav targets map to section ids handled by App.handleNavigate (string → anchor).
const LINKS = [
  { label: 'Home', target: 'hero' },
  { label: 'About Us', target: 'why' },
  { label: 'Solutions', target: 'ecosystem' },
  { label: 'Projects', target: 'transformations' },
  { label: 'Gallery', target: 'plants' },
  { label: 'Contact', target: 'contact' },
];

// forwardRef → <nav>. App.jsx toggles `.is-scrolled` once past the hero, which
// swaps the logo + link colours from light (over the dark hero) to dark.
const Nav = forwardRef(function Nav({ onNavigate }, ref) {
  const [open, setOpen] = useState(false);

  const go = (target) => {
    setOpen(false);
    onNavigate?.(target);
  };

  return (
    <nav ref={ref} className="mgh-nav">
      <div className="mgh-nav__inner">
        <button className="mgh-nav__logo" onClick={() => go('hero')} aria-label="MyGreenHome — home">
          <img className="mgh-nav__logo-img mgh-nav__logo-img--light" src="/logo.png" alt="MyGreenHome" />
          <img className="mgh-nav__logo-img mgh-nav__logo-img--dark" src="/logo-dark.png" alt="" aria-hidden="true" />
        </button>

        <div className="mgh-nav__links">
          {LINKS.map((l) => (
            <button key={l.label} type="button" className="mgh-nav__link font-body" onClick={() => go(l.target)}>
              {l.label}
            </button>
          ))}
        </div>

        <button type="button" className="mgh-nav__cta font-body" onClick={() => go('contact')}>
          <Leaf size={15} />
          Let's Green Your Space
        </button>

        <button
          type="button"
          className="mgh-nav__burger"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile overlay */}
      <div
        className="mgh-nav__overlay"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }}
      >
        {LINKS.map((l) => (
          <button key={l.label} type="button" className="mgh-nav__overlay-link font-body" onClick={() => go(l.target)}>
            {l.label}
          </button>
        ))}
        <button type="button" className="mgh-nav__cta mgh-nav__cta--overlay font-body" onClick={() => go('contact')}>
          <Leaf size={16} />
          Let's Green Your Space
        </button>
      </div>
    </nav>
  );
});

export default Nav;
