import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

// Bouncing "Scroll to Explore" cue at the bottom of Scene 0 (desktop only).
export default function ScrollCue({ visible }) {
  const [mounted, setMounted] = useState(false);

  // Delayed entrance (~1.2s after load).
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const show = visible && mounted;

  return (
    <div
      className="hidden md:flex flex-col items-center"
      style={{
        position: 'absolute',
        bottom: 36,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
        gap: 8,
        opacity: show ? 1 : 0,
        transition: 'opacity 0.6s var(--ease-smooth)',
        pointerEvents: 'none',
      }}
    >
      <span
        className="font-body uppercase text-cream/35"
        style={{ fontSize: 9, letterSpacing: '0.22em' }}
      >
        Scroll to Explore
      </span>
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: '50%',
          border: '1px solid rgba(245,240,232,0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'bobUp 1.8s ease-in-out infinite',
        }}
      >
        <ChevronDown size={14} color="rgba(245,240,232,0.45)" />
      </div>
    </div>
  );
}
