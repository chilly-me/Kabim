import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── HOUSE TYPES ──────────────────────────────────────────────────────────────

const houseTypes = [
  {
    id: 'bungalow-a',
    label: 'Bungalow A',
    tag: 'Most popular',
    description: 'A compact, well-proportioned single-storey home with generous verandas and natural ventilation.',
    minBed: 2, maxBed: 4,
    bathrooms: 2,
    area: '98 m²',
    route: '/cottage',
    accent: '#c9a96e',
    disabled: false,
  },
  {
    id: 'bungalow-b',
    label: 'Bungalow B',
    tag: null,
    description: 'Sprawling single-level layout with open-plan living, ideal for a larger plot with garden access.',
    minBed: 3, maxBed: 5,
    bathrooms: 3,
    area: '142 m²',
    route: '/cottage',
    accent: '#7eb8a4',
    disabled: false,
  },
  {
    id: 'bungalow-c',
    label: 'Bungalow C',
    tag: 'Coming soon',
    description: 'Premium layout with double-volume living room, en-suite to every bedroom, and a home office.',
    minBed: 4, maxBed: 6,
    bathrooms: 4,
    area: '185 m²',
    route: '/cottage',
    accent: '#8fa8c8',
    disabled: true,
  },
];

// ─── LOADING SCREEN ───────────────────────────────────────────────────────────

const LoadingScreen = ({ label }) => (
  <div style={{
    position: 'fixed', inset: 0,
    background: '#1a1a1a',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    zIndex: 100, gap: 32,
  }}>
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <style>{`
        @keyframes draw { to { stroke-dashoffset: 0; } }
        .ln  { stroke-dasharray:200; stroke-dashoffset:200; animation: draw 1.2s ease forwards; }
        .ln2 { animation-delay:.3s }
        .ln3 { animation-delay:.6s }
        .ln4 { animation-delay:.9s }
      `}</style>
      <polyline className="ln"  points="40,8 72,32 72,72 8,72 8,32 40,8"  stroke="#c9a96e" strokeWidth="2"   fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <line     className="ln ln2" x1="8"  y1="32" x2="72" y2="32" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round"/>
      <line     className="ln ln3" x1="32" y1="72" x2="32" y2="48" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round"/>
      <line     className="ln ln3" x1="32" y1="48" x2="48" y2="48" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round"/>
      <line     className="ln ln3" x1="48" y1="48" x2="48" y2="72" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round"/>
      <line     className="ln ln4" x1="52" y1="32" x2="52" y2="56" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round"/>
      <line     className="ln ln4" x1="52" y1="56" x2="64" y2="56" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round"/>
      <line     className="ln ln4" x1="64" y1="56" x2="64" y2="32" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: 8 }}>
        Generating your {label}
      </div>
      <div style={{ width: 200, height: 2, background: '#333', borderRadius: 1, overflow: 'hidden', margin: '0 auto' }}>
        <div style={{ height: '100%', background: '#c9a96e', borderRadius: 1, animation: 'progress 1.8s ease-in-out forwards' }} />
      </div>
    </div>
    <style>{`@keyframes progress { 0%{width:0%} 60%{width:75%} 100%{width:100%} }`}</style>
  </div>
);

// ─── ICONS ────────────────────────────────────────────────────────────────────

const HomeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
    <path d="M9 21V12h6v9"/>
  </svg>
);

const BedIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 20v-6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6"/>
    <path d="M2 14V8a2 2 0 0 1 2-2h4v8"/>
    <path d="M2 20h20"/>
  </svg>
);

const BathIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/>
    <line x1="4" y1="13" x2="22" y2="13"/>
  </svg>
);

const AreaIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M3 9h18M9 3v18"/>
  </svg>
);

// ─── STEPPER ──────────────────────────────────────────────────────────────────

const Stepper = ({ label, value, min, max, onChange }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <label style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#888' }}>{label}</label>
    <div style={{ display: 'flex', alignItems: 'center', background: '#2a2a2a', borderRadius: 8, border: '1px solid #3a3a3a', overflow: 'hidden' }}>
      <button onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}
        style={{ width: 44, height: 44, background: 'none', border: 'none', color: value <= min ? '#444' : '#ccc', fontSize: 20, cursor: value <= min ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
      <div style={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 500, color: '#fff' }}>{value}</div>
      <button onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}
        style={{ width: 44, height: 44, background: 'none', border: 'none', color: value >= max ? '#444' : '#ccc', fontSize: 20, cursor: value >= max ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
    </div>
  </div>
);

// ─── HOUSE CARD ───────────────────────────────────────────────────────────────

const HouseCard = ({ house, selected, bedrooms, onClick }) => (
  <button onClick={() => !house.disabled && onClick(house)}
    style={{
      background: selected ? '#222' : '#1e1e1e',
      border: `1.5px solid ${selected ? house.accent : '#2e2e2e'}`,
      borderRadius: 12, padding: '20px', textAlign: 'left',
      cursor: house.disabled ? 'not-allowed' : 'pointer',
      opacity: house.disabled ? 0.5 : 1, width: '100%',
      transition: 'border-color 0.15s, background 0.15s', position: 'relative',
    }}>
    {house.tag && (
      <div style={{
        position: 'absolute', top: 14, right: 14,
        fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase',
        padding: '3px 8px', borderRadius: 4, fontWeight: 500,
        background: house.disabled ? '#2a2a2a' : house.accent + '22',
        color: house.disabled ? '#555' : house.accent,
      }}>{house.tag}</div>
    )}
    <div style={{
      width: 16, height: 16, borderRadius: '50%',
      border: `2px solid ${selected ? house.accent : '#3a3a3a'}`,
      background: selected ? house.accent : 'transparent',
      marginBottom: 14, transition: 'all 0.15s',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {selected && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#111' }} />}
    </div>
    <div style={{ fontSize: 16, fontWeight: 500, color: '#f0f0f0', marginBottom: 6 }}>{house.label}</div>
    <div style={{ fontSize: 12, color: '#888', lineHeight: 1.5, marginBottom: 16 }}>{house.description}</div>
    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
      {[
        { icon: <BedIcon />,  val: `${house.minBed}–${house.maxBed} bed` },
        { icon: <BathIcon />, val: `${house.bathrooms} bath` },
        { icon: <AreaIcon />, val: house.area },
      ].map((spec) => (
        <div key={spec.val} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#777' }}>
          <span style={{ color: house.accent }}>{spec.icon}</span>{spec.val}
        </div>
      ))}
    </div>
  </button>
);

// ─── MAIN ─────────────────────────────────────────────────────────────────────

const Home = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(houseTypes[0]);
  const [bedrooms, setBedrooms] = useState(houseTypes[0].minBed);
  const [loading, setLoading]   = useState(false);

  const handleSelect = (house) => {
    setSelected(house);
    setBedrooms(house.minBed);
  };

  const handleGenerate = () => {
    if (!selected || selected.disabled) return;
    setLoading(true);
    setTimeout(() => navigate(selected.route), 2200);
  };

  return (
    <>
      {loading && <LoadingScreen label={selected?.label?.toLowerCase() || 'bungalow'} />}

      <div style={{ minHeight: '100vh', background: '#1a1a1a', color: '#f0f0f0', fontFamily: 'helvetica neue, helvetica, arial, sans-serif', display: 'flex', flexDirection: 'column' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #2a2a2a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <HomeIcon />
            <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: '0.04em', color: '#f0f0f0' }}>KABIM AI Homes</span>
          </div>
          <div style={{ fontSize: 11, color: '#555', letterSpacing: '0.06em', textTransform: 'uppercase' }}>House configurator</div>
        </div>

        {/* Hero */}
        <div style={{ padding: '40px 24px 32px', maxWidth: 680, margin: '0 auto', width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: 16 }}>Design your home</div>
          <h1 style={{ fontSize: 'clamp(24px, 5vw, 40px)', fontWeight: 400, lineHeight: 1.2, color: '#f0f0f0', margin: '0 0 14px' }}>
            Choose the bungalow<br />that fits your life
          </h1>
          <p style={{ fontSize: 14, color: '#888', lineHeight: 1.7, margin: '0 auto', maxWidth: 440 }}>
            Select a layout, set your number of bedrooms, and we'll generate a full 3D model, floor plan, and bill of quantities — ready to build.
          </p>
        </div>

        {/* Steps */}
        <div style={{ flex: 1, maxWidth: 800, margin: '0 auto', width: '100%', padding: '0 16px 48px', display: 'flex', flexDirection: 'column', gap: 32 }}>

          {/* Step 1 — type */}
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#555', marginBottom: 14 }}>1 — Bungalow type</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
              {houseTypes.map((h) => (
                <HouseCard key={h.id} house={h} selected={selected?.id === h.id} bedrooms={bedrooms} onClick={handleSelect} />
              ))}
            </div>
          </div>

          {/* Step 2 — bedrooms only */}
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#555', marginBottom: 14 }}>2 — Number of bedrooms</div>
            <div style={{ background: '#1e1e1e', border: '1px solid #2e2e2e', borderRadius: 12, padding: '24px', maxWidth: 260 }}>
              <Stepper
                label="Bedrooms"
                value={bedrooms}
                min={selected?.minBed ?? 2}
                max={selected?.maxBed ?? 6}
                onChange={setBedrooms}
              />
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: '#555', display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Range for {selected?.label}: {selected?.minBed}–{selected?.maxBed} bedrooms
            </div>
          </div>

          {/* Step 3 — generate */}
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#555', marginBottom: 14 }}>3 — Generate</div>
            {selected && !selected.disabled && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                {[selected.label, `${bedrooms} bed`, `${selected.bathrooms} bath`, selected.area].map((tag) => (
                  <span key={tag} style={{ fontSize: 12, padding: '4px 12px', borderRadius: 20, background: '#2a2a2a', color: '#aaa', border: '1px solid #3a3a3a' }}>{tag}</span>
                ))}
              </div>
            )}
            <button onClick={handleGenerate} disabled={!selected || selected.disabled}
              style={{
                width: '100%', padding: '16px',
                background: selected && !selected.disabled ? selected.accent : '#2a2a2a',
                color: selected && !selected.disabled ? '#111' : '#444',
                border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600,
                letterSpacing: '0.04em',
                cursor: selected && !selected.disabled ? 'pointer' : 'not-allowed',
                transition: 'background 0.2s',
              }}>
              {selected?.disabled ? `${selected.label} coming soon` : `Generate ${selected?.label || 'bungalow'} →`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
