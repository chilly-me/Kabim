import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── CONFIG ───────────────────────────────────────────────────────────────────
// Update these counts as you add more variants to each bedroom folder.
// e.g. when you add folders 1-5 under /public/houses/two/, set two: 5
const VARIANT_COUNTS = { 1: 1, 2: 1, 3: 1 };
const MIN_BED = 1;
const MAX_BED = 3;

// ─── LOADING SCREEN ───────────────────────────────────────────────────────────
const LoadingScreen = ({ bedrooms }) => (
  <div style={{ position: 'fixed', inset: 0, background: '#1a1a1a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 100, gap: 32 }}>
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <style>{`
        @keyframes draw { to { stroke-dashoffset: 0; } }
        .ln  { stroke-dasharray:200; stroke-dashoffset:200; animation: draw 1.2s ease forwards; }
        .ln2 { animation-delay:.3s } .ln3 { animation-delay:.6s } .ln4 { animation-delay:.9s }
      `}</style>
      <polyline className="ln"  points="40,8 72,32 72,72 8,72 8,32 40,8" stroke="#c9a96e" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <line className="ln ln2" x1="8"  y1="32" x2="72" y2="32" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round"/>
      <line className="ln ln3" x1="32" y1="72" x2="32" y2="48" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round"/>
      <line className="ln ln3" x1="32" y1="48" x2="48" y2="48" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round"/>
      <line className="ln ln3" x1="48" y1="48" x2="48" y2="72" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round"/>
      <line className="ln ln4" x1="52" y1="32" x2="52" y2="56" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round"/>
      <line className="ln ln4" x1="52" y1="56" x2="64" y2="56" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round"/>
      <line className="ln ln4" x1="64" y1="56" x2="64" y2="32" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: 8 }}>
        Generating your {bedrooms}-bedroom bungalow
      </div>
      <div style={{ width: 200, height: 2, background: '#333', borderRadius: 1, overflow: 'hidden', margin: '0 auto' }}>
        <div style={{ height: '100%', background: '#c9a96e', borderRadius: 1, animation: 'progress 1.8s ease-in-out forwards' }} />
      </div>
    </div>
    <style>{`@keyframes progress { 0%{width:0%} 60%{width:75%} 100%{width:100%} }`}</style>
  </div>
);

// ─── STEPPER ──────────────────────────────────────────────────────────────────
const Stepper = ({ value, min, max, onChange }) => (
  <div style={{ display: 'flex', alignItems: 'center', background: '#2a2a2a', borderRadius: 12, border: '1px solid #3a3a3a', overflow: 'hidden', width: '100%', maxWidth: 280 }}>
    <button onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}
      style={{ width: 56, height: 56, background: 'none', border: 'none', color: value <= min ? '#444' : '#ccc', fontSize: 24, cursor: value <= min ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
    <div style={{ flex: 1, textAlign: 'center' }}>
      <div style={{ fontSize: 28, fontWeight: 500, color: '#f0f0f0', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: '#666', marginTop: 3 }}>bedroom{value !== 1 ? 's' : ''}</div>
    </div>
    <button onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}
      style={{ width: 56, height: 56, background: 'none', border: 'none', color: value >= max ? '#444' : '#ccc', fontSize: 24, cursor: value >= max ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
  </div>
);

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const Home = () => {
  const navigate   = useNavigate();
  const [bedrooms, setBedrooms] = useState(2);
  const [loading, setLoading]   = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      navigate('/cottage', { state: { bedrooms } });
    }, 2200);
  };

  return (
    <>
      {loading && <LoadingScreen bedrooms={bedrooms} />}

      <div style={{ minHeight: '100vh', background: '#1a1a1a', color: '#f0f0f0', fontFamily: 'helvetica neue, helvetica, arial, sans-serif', display: 'flex', flexDirection: 'column' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #2a2a2a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><path d="M9 21V12h6v9"/>
            </svg>
            <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: '0.04em' }}>KABIM AI Homes</span>
          </div>
          <div style={{ fontSize: 11, color: '#555', letterSpacing: '0.06em', textTransform: 'uppercase' }}>House configurator</div>
        </div>

        {/* Hero */}
        <div style={{ padding: '48px 24px 40px', maxWidth: 600, margin: '0 auto', width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: 16 }}>Design your home</div>
          <h1 style={{ fontSize: 'clamp(26px, 5vw, 42px)', fontWeight: 400, lineHeight: 1.2, color: '#f0f0f0', margin: '0 0 16px' }}>
            How many bedrooms<br />do you need?
          </h1>
          <p style={{ fontSize: 14, color: '#777', lineHeight: 1.7, margin: '0 auto', maxWidth: 400 }}>
            We'll generate a bungalow floor plan, 3D model, and full bill of quantities tailored to your selection.
          </p>
        </div>

        {/* Configurator card */}
        <div style={{ flex: 1, maxWidth: 480, margin: '0 auto', width: '100%', padding: '0 16px 48px', display: 'flex', flexDirection: 'column', gap: 24 }}>

          <div style={{ background: '#1e1e1e', border: '1px solid #2e2e2e', borderRadius: 16, padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>

            {/* Stepper */}
            <Stepper value={bedrooms} min={MIN_BED} max={MAX_BED} onChange={setBedrooms} />

            {/* Visual bed indicators */}
            <div style={{ display: 'flex', gap: 8 }}>
              {Array.from({ length: MAX_BED }, (_, i) => (
                <div key={i} style={{
                  width: 36, height: 24, borderRadius: 4,
                  background: i < bedrooms ? '#c9a96e' : '#2a2a2a',
                  border: `1px solid ${i < bedrooms ? '#c9a96e' : '#3a3a3a'}`,
                  transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {i < bedrooms && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 20v-6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6"/><path d="M2 14V8a2 2 0 0 1 2-2h4v8"/><path d="M2 20h20"/>
                    </svg>
                  )}
                </div>
              ))}
            </div>

            {/* Summary tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {[
                `${bedrooms} bedroom${bedrooms !== 1 ? 's' : ''}`,
                bedrooms === 1 ? '1 bathroom' : bedrooms === 2 ? '2 bathrooms' : '2–3 bathrooms',
                bedrooms === 1 ? '~65 m²' : bedrooms === 2 ? '~98 m²' : '~130 m²',
                'Single storey',
              ].map((tag) => (
                <span key={tag} style={{ fontSize: 12, padding: '4px 12px', borderRadius: 20, background: '#2a2a2a', color: '#aaa', border: '1px solid #3a3a3a' }}>{tag}</span>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button onClick={handleGenerate} style={{
            width: '100%', padding: '16px',
            background: '#c9a96e', color: '#111',
            border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600,
            letterSpacing: '0.04em', cursor: 'pointer',
          }}>
            Generate {bedrooms}-bedroom bungalow →
          </button>

          <p style={{ textAlign: 'center', fontSize: 12, color: '#444', margin: 0 }}>
            A random layout will be selected from our available plans
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;
