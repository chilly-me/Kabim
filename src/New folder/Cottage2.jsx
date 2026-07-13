import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Model } from './Model.jsx';

// ─── DATA ────────────────────────────────────────────────────────────────────

const boqItems = [
  { item: 'Strip foundation',      trade: 'Substructure',   unit: 'm³',  qty: 24,  rate: 12500,  amount: 300000  },
  { item: 'Hardcore filling',       trade: 'Substructure',   unit: 'm³',  qty: 18,  rate: 4200,   amount: 75600   },
  { item: 'Concrete slab (150mm)', trade: 'Substructure',   unit: 'm²',  qty: 98,  rate: 3800,   amount: 372400  },
  { item: 'Burnt brick walling',   trade: 'Superstructure', unit: 'm²',  qty: 210, rate: 2900,   amount: 609000  },
  { item: 'Concrete ring beam',    trade: 'Superstructure', unit: 'm',   qty: 56,  rate: 4500,   amount: 252000  },
  { item: 'Roof truss (timber)',   trade: 'Roofing',        unit: 'm²',  qty: 120, rate: 2200,   amount: 264000  },
  { item: 'Corrugated iron sheets',trade: 'Roofing',        unit: 'm²',  qty: 120, rate: 1800,   amount: 216000  },
  { item: 'Cement plaster (int.)', trade: 'Finishes',       unit: 'm²',  qty: 340, rate: 650,    amount: 221000  },
  { item: 'Ceramic floor tiles',   trade: 'Finishes',       unit: 'm²',  qty: 98,  rate: 1950,   amount: 191100  },
  { item: 'Aluminium windows',     trade: 'Joinery',        unit: 'Nr',  qty: 8,   rate: 18000,  amount: 144000  },
  { item: 'Steel door frames',     trade: 'Joinery',        unit: 'Nr',  qty: 5,   rate: 12500,  amount: 62500   },
  { item: 'Electrical installation',trade: 'M&E',           unit: 'Item',qty: 1,   rate: 280000, amount: 280000  },
  { item: 'Plumbing & sanitary',   trade: 'M&E',            unit: 'Item',qty: 1,   rate: 320000, amount: 320000  },
  { item: 'External painting',     trade: 'Finishes',       unit: 'm²',  qty: 210, rate: 480,    amount: 100800  },
];

const phases = [
  { name: 'Site preparation',    scope: 'Clearing, setting out, excavation',  weeks: '1–2',   status: 'done',        pct: 100 },
  { name: 'Foundation',          scope: 'Strip footing, hardcore, blinding',  weeks: '3–4',   status: 'done',        pct: 100 },
  { name: 'Ground floor slab',   scope: 'Reinforcement, pour, cure',          weeks: '5–6',   status: 'done',        pct: 100 },
  { name: 'Walling — ground',    scope: 'Brick courses to ring beam',         weeks: '7–9',   status: 'done',        pct: 100 },
  { name: 'Ring beam & columns', scope: 'Formwork, rebar, concrete pour',     weeks: '10–11', status: 'in-progress', pct: 60  },
  { name: 'Roofing',             scope: 'Trusses, battens, iron sheets',      weeks: '12–14', status: 'pending',     pct: 0   },
  { name: 'Doors & windows',     scope: 'Frames, glazing, ironmongery',       weeks: '15–16', status: 'pending',     pct: 0   },
  { name: 'Plaster & screed',    scope: 'Internal walls, floor screed',       weeks: '17–18', status: 'pending',     pct: 0   },
  { name: 'M&E rough-in',        scope: 'Electrical conduits, plumbing pipes',weeks: '16–18', status: 'pending',     pct: 0   },
  { name: 'Finishes',            scope: 'Tiles, painting, fittings',          weeks: '19–22', status: 'pending',     pct: 0   },
];

const envItems = [
  {
    icon: '💧',
    title: 'Rainwater harvesting',
    body: 'Gutters channel runoff to a 5,000 L underground tank. Estimated saving of 40% on municipal water demand for a family of four.',
    rating: 4,
  },
  {
    icon: '☀️',
    title: 'Passive solar design',
    body: 'South-facing roof pitch optimised for Kenya\'s latitude. Roof prepared for 2 kWp PV panel installation without structural modifications.',
    rating: 4,
  },
  {
    icon: '🌬️',
    title: 'Natural ventilation',
    body: 'Cross-ventilation via opposing window placement. Ceiling height of 2.7 m aids stack-effect airflow, reducing mechanical cooling load.',
    rating: 3,
  },
  {
    icon: '♻️',
    title: 'Waste management',
    body: 'Construction waste plan targets 70% diversion from landfill. Cut bricks reused as hardcore; timber offcuts reserved for joinery.',
    rating: 3,
  },
  {
    icon: '🌿',
    title: 'Local materials',
    body: 'Burnt bricks, hardcore, and river sand sourced within 50 km. Reduces embodied transport carbon and supports the local supply chain.',
    rating: 5,
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const fmt = (n) => n.toLocaleString('en-KE');

const StatusBadge = ({ status }) => {
  const map = {
    done:        { label: 'Done',        bg: '#d1fae5', color: '#065f46' },
    'in-progress':{ label: 'In progress', bg: '#fef3c7', color: '#92400e' },
    pending:     { label: 'Pending',     bg: '#f3f4f6', color: '#6b7280' },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: 4,
      fontSize: 12,
      fontWeight: 500,
      background: s.bg,
      color: s.color,
    }}>
      {s.label}
    </span>
  );
};

const RatingDots = ({ value, max = 5 }) => (
  <div style={{ display: 'flex', gap: 4 }}>
    {Array.from({ length: max }, (_, i) => (
      <div key={i} style={{
        width: 8, height: 8, borderRadius: '50%',
        background: i < value ? '#374151' : '#d1d5db',
      }} />
    ))}
  </div>
);

// ─── TAB PANELS ───────────────────────────────────────────────────────────────

const ModelPanel = () => (
  <div style={{ width: '100%', height: 'calc(100vh - 120px)' }}>
    <Canvas shadows gl={{ useLegacyLights: false, toneMappingExposure: 0.8 }}>
      <Environment preset="dawn" background={true} />
      <OrbitControls />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
      <ambientLight intensity={1} />
    </Canvas>
  </div>
);

const BoqPanel = () => {
  const total = boqItems.reduce((sum, r) => sum + r.amount, 0);
  const contingency = Math.round(total * 0.1);

  return (
    <div style={{ padding: '24px 32px', overflowY: 'auto', height: 'calc(100vh - 120px)' }}>

      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Total estimate',  value: `KSh ${fmt(total)}`,       sub: 'Excl. contingency' },
          { label: 'Contingency',     value: '10%',                      sub: `KSh ${fmt(contingency)}` },
          { label: 'Floor area',      value: '98 m²',                    sub: 'Gross internal' },
          { label: 'Rate / m²',       value: `${fmt(Math.round(total / 98))}`, sub: 'KSh per m²' },
        ].map((c) => (
          <div key={c.label} style={{ background: '#f9fafb', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9ca3af', marginBottom: 4 }}>{c.label}</div>
            <div style={{ fontSize: 22, fontWeight: 500, color: '#111827' }}>{c.value}</div>
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: 12 }}>Breakdown by trade</div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            {['Item', 'Trade', 'Unit', 'Qty', 'Rate (KSh)', 'Amount (KSh)'].map((h, i) => (
              <th key={h} style={{
                textAlign: i >= 3 ? 'right' : 'left',
                padding: '8px 12px',
                fontSize: 11,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: '#9ca3af',
                borderBottom: '1px solid #e5e7eb',
                fontWeight: 500,
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {boqItems.map((row) => (
            <tr key={row.item} style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ padding: '10px 12px', color: '#111827' }}>{row.item}</td>
              <td style={{ padding: '10px 12px', color: '#6b7280' }}>{row.trade}</td>
              <td style={{ padding: '10px 12px', color: '#6b7280' }}>{row.unit}</td>
              <td style={{ padding: '10px 12px', color: '#111827', textAlign: 'right' }}>{row.qty}</td>
              <td style={{ padding: '10px 12px', color: '#111827', textAlign: 'right' }}>{fmt(row.rate)}</td>
              <td style={{ padding: '10px 12px', color: '#111827', textAlign: 'right' }}>{fmt(row.amount)}</td>
            </tr>
          ))}
          <tr style={{ background: '#f9fafb', borderTop: '2px solid #e5e7eb' }}>
            <td colSpan={5} style={{ padding: '10px 12px', fontWeight: 500, color: '#111827' }}>Total (excl. contingency)</td>
            <td style={{ padding: '10px 12px', fontWeight: 500, color: '#111827', textAlign: 'right' }}>{fmt(total)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const ProgressPanel = () => {
  const done = phases.filter((p) => p.status === 'done').length;
  const overall = Math.round(phases.reduce((s, p) => s + p.pct, 0) / phases.length);

  return (
    <div style={{ padding: '24px 32px', overflowY: 'auto', height: 'calc(100vh - 120px)' }}>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Overall',       value: `${overall}%`,        sub: 'On schedule' },
          { label: 'Weeks elapsed', value: '6',                  sub: 'of 24 planned' },
          { label: 'Completed',     value: `${done}`,            sub: 'phases done' },
          { label: 'Remaining',     value: `${phases.length - done}`, sub: 'phases pending' },
        ].map((c) => (
          <div key={c.label} style={{ background: '#f9fafb', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9ca3af', marginBottom: 4 }}>{c.label}</div>
            <div style={{ fontSize: 22, fontWeight: 500, color: '#111827' }}>{c.value}</div>
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: 12 }}>Phase tracker</div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            {['Phase', 'Scope', 'Duration', 'Status', 'Completion'].map((h) => (
              <th key={h} style={{
                textAlign: 'left',
                padding: '8px 12px',
                fontSize: 11,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: '#9ca3af',
                borderBottom: '1px solid #e5e7eb',
                fontWeight: 500,
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {phases.map((p) => (
            <tr key={p.name} style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ padding: '10px 12px', fontWeight: 500, color: '#111827' }}>{p.name}</td>
              <td style={{ padding: '10px 12px', color: '#6b7280' }}>{p.scope}</td>
              <td style={{ padding: '10px 12px', color: '#6b7280', whiteSpace: 'nowrap' }}>Wk {p.weeks}</td>
              <td style={{ padding: '10px 12px' }}><StatusBadge status={p.status} /></td>
              <td style={{ padding: '10px 12px', minWidth: 140 }}>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 3 }}>{p.pct}%</div>
                <div style={{ height: 6, background: '#f3f4f6', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${p.pct}%`, background: '#374151', borderRadius: 3 }} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const EnvPanel = () => (
  <div style={{ padding: '24px 32px', overflowY: 'auto', height: 'calc(100vh - 120px)' }}>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
      {[
        { label: 'EIA required',     value: 'No',    sub: '<0.5 ha footprint' },
        { label: 'Carbon rating',    value: 'B+',    sub: 'Est. 42 kgCO₂/m²' },
        { label: 'Water harvesting', value: 'Yes',   sub: '5,000 L tank' },
        { label: 'Solar ready',      value: 'Yes',   sub: 'South-facing roof' },
      ].map((c) => (
        <div key={c.label} style={{ background: '#f9fafb', borderRadius: 8, padding: '14px 16px' }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9ca3af', marginBottom: 4 }}>{c.label}</div>
          <div style={{ fontSize: 22, fontWeight: 500, color: '#111827' }}>{c.value}</div>
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{c.sub}</div>
        </div>
      ))}
    </div>

    <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: 16 }}>Considerations</div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {envItems.map((e) => (
        <div key={e.title} style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          padding: '14px 16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 16 }}>{e.icon}</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{e.title}</span>
            <div style={{ marginLeft: 'auto' }}><RatingDots value={e.rating} /></div>
          </div>
          <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>{e.body}</p>
        </div>
      ))}
    </div>
  </div>
);

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────

const TABS = [
  { id: 'model',    label: '3D model' },
  { id: 'boq',      label: 'Bill of quantities' },
  { id: 'progress', label: 'Progress' },
  { id: 'env',      label: 'Environmental' },
];

const Cottage = () => {
  const [activeTab, setActiveTab] = useState('model');

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', background: '#fff' }}>

      {/* Header */}
      <div style={{ padding: '16px 32px 0', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 4 }}>Project</div>
        <div style={{ fontSize: 18, fontWeight: 500, color: '#111827', marginBottom: 12 }}>Cottage — type A</div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0 }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 20px',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #111827' : '2px solid transparent',
                color: activeTab === tab.id ? '#111827' : '#6b7280',
                letterSpacing: '0.01em',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Panel */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {activeTab === 'model'    && <ModelPanel />}
        {activeTab === 'boq'      && <BoqPanel />}
        {activeTab === 'progress' && <ProgressPanel />}
        {activeTab === 'env'      && <EnvPanel />}
      </div>
    </div>
  );
};

export default Cottage;
