import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useInView } from '../hooks/useInView';

const ITEMS = [
  {
    q: "What's included in a MyGreenHome package?",
    a: 'Curated indoor & outdoor plants, designer planters, ambient lighting, the Neobot smart system, plus expert setup and regular maintenance — everything your green space needs to thrive.',
  },
  {
    q: 'Do I have to take care of the plants myself?',
    a: 'No. Neobot automates watering and monitors soil & air quality, while our gardeners visit regularly. We Design. We Set Up. We Maintain. You Enjoy.',
  },
  {
    q: 'What is Neobot?',
    a: 'Neobot is our smart garden controller. It auto-waters your plants, tracks soil health and AQI in real time, and sends you app alerts and insights — 24/7.',
  },
  {
    q: 'How long does setup take?',
    a: 'After a quick consultation we finalise your design, then most homes are fully installed within a few days — with zero hassle for you.',
  },
  {
    q: 'Which spaces can you transform?',
    a: 'Indoor rooms, balconies, terraces, rooftops and kitchen gardens — from a cozy corner to a complete rooftop oasis.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);
  const [ref, inView] = useInView(0.12);

  return (
    <section id="faq" ref={ref} style={{ padding: 'clamp(80px,11vh,120px) clamp(24px,5vw,60px)' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <p className="font-body uppercase" style={{ fontSize: 11, letterSpacing: '0.3em', color: 'var(--c-gold-light)', opacity: inView ? 1 : 0, transition: 'opacity 0.7s ease' }}>
            Good to Know
          </p>
          <h2 className="font-display" style={{ fontWeight: 700, fontSize: 'clamp(32px,4.2vw,56px)', color: '#f5f0e8', marginTop: 12, opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(22px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}>
            Questions, answered.
          </h2>
        </div>

        <div>
          {ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                style={{
                  borderTop: i === 0 ? '1px solid rgba(245,240,232,0.14)' : 'none',
                  borderBottom: '1px solid rgba(245,240,232,0.14)',
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(18px)',
                  transition: `opacity 0.6s ease ${i * 0.06}s, transform 0.6s ease ${i * 0.06}s`,
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="font-display flex items-center justify-between"
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '22px 4px',
                    gap: 20,
                    fontSize: 'clamp(18px,2vw,23px)',
                    fontWeight: 600,
                    color: '#f5f0e8',
                  }}
                  aria-expanded={isOpen}
                >
                  {item.q}
                  <Plus
                    size={20}
                    style={{
                      flexShrink: 0,
                      color: 'var(--c-gold-light)',
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0)',
                      transition: 'transform 0.4s var(--ease-smooth)',
                    }}
                  />
                </button>
                <div className={`faq-answer${isOpen ? ' is-open' : ''}`}>
                  <div>
                    <p className="font-body" style={{ fontWeight: 300, fontSize: 15, lineHeight: 1.8, color: 'rgba(245,240,232,0.6)', padding: '0 4px 24px', maxWidth: 640 }}>
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
