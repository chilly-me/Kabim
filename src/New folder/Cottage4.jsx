import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Model } from './Model.jsx';

// ─── DATA ─────────────────────────────────────────────────────────────────────

const boqItems = [
  { item: 'Strip foundation',       trade: 'Substructure',   unit: 'm³',  qty: 24,  rate: 12500,  amount: 300000 },
  { item: 'Hardcore filling',        trade: 'Substructure',   unit: 'm³',  qty: 18,  rate: 4200,   amount: 75600  },
  { item: 'Concrete slab (150mm)',  trade: 'Substructure',   unit: 'm²',  qty: 98,  rate: 3800,   amount: 372400 },
  { item: 'Burnt brick walling',    trade: 'Superstructure', unit: 'm²',  qty: 210, rate: 2900,   amount: 609000 },
  { item: 'Concrete ring beam',     trade: 'Superstructure', unit: 'm',   qty: 56,  rate: 4500,   amount: 252000 },
  { item: 'Roof truss (timber)',    trade: 'Roofing',        unit: 'm²',  qty: 120, rate: 2200,   amount: 264000 },
  { item: 'Corrugated iron sheets', trade: 'Roofing',        unit: 'm²',  qty: 120, rate: 1800,   amount: 216000 },
  { item: 'Cement plaster (int.)',  trade: 'Finishes',       unit: 'm²',  qty: 340, rate: 650,    amount: 221000 },
  { item: 'Ceramic floor tiles',    trade: 'Finishes',       unit: 'm²',  qty: 98,  rate: 1950,   amount: 191100 },
  { item: 'Aluminium windows',      trade: 'Joinery',        unit: 'Nr',  qty: 8,   rate: 18000,  amount: 144000 },
  { item: 'Steel door frames',      trade: 'Joinery',        unit: 'Nr',  qty: 5,   rate: 12500,  amount: 62500  },
  { item: 'Electrical installation',trade: 'M&E',            unit: 'Item',qty: 1,   rate: 280000, amount: 280000 },
  { item: 'Plumbing & sanitary',    trade: 'M&E',            unit: 'Item',qty: 1,   rate: 320000, amount: 320000 },
  { item: 'External painting',      trade: 'Finishes',       unit: 'm²',  qty: 210, rate: 480,    amount: 100800 },
];

const phases = [
  { name: 'Site preparation',    scope: 'Clearing, setting out, excavation',   weeks: '1–2',   status: 'done',        pct: 100 },
  { name: 'Foundation',          scope: 'Strip footing, hardcore, blinding',   weeks: '3–4',   status: 'done',        pct: 100 },
  { name: 'Ground floor slab',   scope: 'Reinforcement, pour, cure',           weeks: '5–6',   status: 'done',        pct: 100 },
  { name: 'Walling — ground',    scope: 'Brick courses to ring beam',          weeks: '7–9',   status: 'done',        pct: 100 },
  { name: 'Ring beam & columns', scope: 'Formwork, rebar, concrete pour',      weeks: '10–11', status: 'in-progress', pct: 60  },
  { name: 'Roofing',             scope: 'Trusses, battens, iron sheets',       weeks: '12–14', status: 'pending',     pct: 0   },
  { name: 'Doors & windows',     scope: 'Frames, glazing, ironmongery',        weeks: '15–16', status: 'pending',     pct: 0   },
  { name: 'Plaster & screed',    scope: 'Internal walls, floor screed',        weeks: '17–18', status: 'pending',     pct: 0   },
  { name: 'M&E rough-in',        scope: 'Electrical conduits, plumbing pipes', weeks: '16–18', status: 'pending',     pct: 0   },
  { name: 'Finishes',            scope: 'Tiles, painting, fittings',           weeks: '19–22', status: 'pending',     pct: 0   },
];

const envItems = [
  { icon: '💧', title: 'Rainwater harvesting',  rating: 4, body: 'Gutters channel runoff to a 5,000 L underground tank. Estimated saving of 40% on municipal water demand for a family of four.' },
  { icon: '☀️', title: 'Passive solar design',   rating: 4, body: "South-facing roof pitch optimised for Kenya's latitude. Roof prepared for 2 kWp PV panel installation without structural modifications." },
  { icon: '🌬️', title: 'Natural ventilation',    rating: 3, body: 'Cross-ventilation via opposing window placement. Ceiling height of 2.7 m aids stack-effect airflow, reducing mechanical cooling load.' },
  { icon: '♻️', title: 'Waste management',       rating: 3, body: 'Construction waste plan targets 70% diversion from landfill. Cut bricks reused as hardcore; timber offcuts reserved for joinery.' },
  { icon: '🌿', title: 'Local materials',         rating: 5, body: 'Burnt bricks, hardcore, and river sand sourced within 50 km. Reduces embodied transport carbon and supports the local supply chain.' },
];

// ─── SHARED STYLES ────────────────────────────────────────────────────────────

const s = {
  panel: {
    padding: '20px 16px',
    overflowY: 'auto',
    height: 'calc(100vh - 104px)',
    boxSizing: 'border-box',
  },
  metricGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 10,
    marginBottom: 24,
  },
  metricCard: {
    background: '#f9fafb',
    borderRadius: 8,
    padding: '12px 14px',
  },
  metricLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: '#9ca3af',
    marginBottom: 3,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 500,
    color: '#111827',
  },
  metricSub: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#9ca3af',
    marginBottom: 12,
  },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const fmt = (n) => n.toLocaleString('en-KE');

const StatusBadge = ({ status }) => {
  const map = {
    done:          { label: 'Done',        bg: '#d1fae5', color: '#065f46' },
    'in-progress': { label: 'In progress', bg: '#fef3c7', color: '#92400e' },
    pending:       { label: 'Pending',     bg: '#f3f4f6', color: '#6b7280' },
  };
  const cfg = map[status] || map.pending;
  return (
    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 500, background: cfg.bg, color: cfg.color }}>
      {cfg.label}
    </span>
  );
};

const RatingDots = ({ value, max = 5 }) => (
  <div style={{ display: 'flex', gap: 4 }}>
    {Array.from({ length: max }, (_, i) => (
      <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: i < value ? '#374151' : '#d1d5db' }} />
    ))}
  </div>
);

const MetricCard = ({ label, value, sub }) => (
  <div style={s.metricCard}>
    <div style={s.metricLabel}>{label}</div>
    <div style={s.metricValue}>{value}</div>
    <div style={s.metricSub}>{sub}</div>
  </div>
);

// ─── TAB PANELS ───────────────────────────────────────────────────────────────

const HousePlanPanel = () => (
  <div style={{ ...s.panel, display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div style={s.sectionLabel}>Floor plan — ground level</div>
    {/* Replace src with your actual floor plan image path in /public */}
    <div style={{
      width: '100%',
      aspectRatio: '4/3',
      background: '#f3f4f6',
      borderRadius: 12,
      border: '1px dashed #d1d5db',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      color: '#9ca3af',
    }}>
      <span style={{ fontSize: 36 }}>📐</span>
      <span style={{ fontSize: 13, fontWeight: 500 }}>Floor plan image</span>
      <span style={{ fontSize: 11 }}>Replace with: &lt;img src="/floorplan.png" /&gt;</span>
    </div>

    {/* Room schedule */}
    <div style={s.sectionLabel}>Room schedule</div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1, borderRadius: 8, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
      {[
        { room: 'Master bedroom',  area: '18.5 m²', dims: '4.3 × 4.3 m' },
        { room: 'Bedroom 2',       area: '12.0 m²', dims: '3.0 × 4.0 m' },
        { room: 'Bedroom 3',       area: '10.5 m²', dims: '3.0 × 3.5 m' },
        { room: 'Living / dining', area: '22.0 m²', dims: '5.5 × 4.0 m' },
        { room: 'Kitchen',         area: '9.0 m²',  dims: '3.0 × 3.0 m' },
        { room: 'Bathroom (en-suite)', area: '4.5 m²', dims: '1.8 × 2.5 m' },
        { room: 'Bathroom (common)',   area: '4.0 m²', dims: '2.0 × 2.0 m' },
        { room: 'Veranda',         area: '14.0 m²', dims: '7.0 × 2.0 m' },
        { room: 'Store',           area: '3.5 m²',  dims: '1.4 × 2.5 m' },
      ].map((r, i) => (
        <div key={r.room} style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '10px 14px',
          fontSize: 13,
          background: i % 2 === 0 ? '#fff' : '#f9fafb',
        }}>
          <span style={{ color: '#111827', fontWeight: 500 }}>{r.room}</span>
          <span style={{ color: '#6b7280' }}>{r.area} · {r.dims}</span>
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', fontSize: 13, background: '#f3f4f6', borderTop: '1px solid #e5e7eb' }}>
        <span style={{ color: '#111827', fontWeight: 500 }}>Total GIA</span>
        <span style={{ color: '#111827', fontWeight: 500 }}>98.0 m²</span>
      </div>
    </div>
  </div>
);

const ModelPanel = () => (
  <div style={{ width: '100%', height: 'calc(100vh - 104px)' }}>
    <Canvas
      shadows
      gl={{ useLegacyLights: false, toneMappingExposure: 0.8 }}
      // Pull the camera back so the entire cottage is visible on load.
      // The cottage mesh sits near the origin at roughly 5–6 units tall.
      // position [15, 8, 15] gives a nice 3/4 elevated view; fov 45 is wider than gltfjsx default.
      camera={{ position: [15, 8, 15], fov: 45, near: 0.1, far: 1000 }}
    >
      <Environment preset="dawn" background={true} />
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        // Allow full vertical orbit
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
      />
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
    <div style={s.panel}>
      <div style={s.metricGrid}>
        <MetricCard label="Total estimate"  value={`KSh ${fmt(total)}`}                      sub="Excl. contingency" />
        <MetricCard label="Contingency"     value="10%"                                       sub={`KSh ${fmt(contingency)}`} />
        <MetricCard label="Floor area"      value="98 m²"                                     sub="Gross internal" />
        <MetricCard label="Rate / m²"       value={fmt(Math.round(total / 98))}               sub="KSh per m²" />
      </div>

      <div style={s.sectionLabel}>Breakdown by trade</div>

      {/* Mobile: card list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {boqItems.map((row) => (
          <div key={row.item} style={{ background: '#f9fafb', borderRadius: 8, padding: '12px 14px', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{row.item}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>KSh {fmt(row.amount)}</span>
            </div>
            <div style={{ display: 'flex', gap: 8, fontSize: 11, color: '#9ca3af' }}>
              <span>{row.trade}</span>
              <span>·</span>
              <span>{row.qty} {row.unit}</span>
              <span>·</span>
              <span>@ {fmt(row.rate)}</span>
            </div>
          </div>
        ))}
        <div style={{ background: '#f3f4f6', borderRadius: 8, padding: '12px 14px', border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>Total (excl. contingency)</span>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>KSh {fmt(total)}</span>
        </div>
      </div>
    </div>
  );
};

const ProgressPanel = () => {
  const done = phases.filter((p) => p.status === 'done').length;
  const overall = Math.round(phases.reduce((s, p) => s + p.pct, 0) / phases.length);

  return (
    <div style={s.panel}>
      <div style={s.metricGrid}>
        <MetricCard label="Overall"       value={`${overall}%`}          sub="On schedule" />
        <MetricCard label="Weeks elapsed" value="6"                       sub="of 24 planned" />
        <MetricCard label="Completed"     value={`${done}`}               sub="phases done" />
        <MetricCard label="Remaining"     value={`${phases.length - done}`} sub="phases pending" />
      </div>

      <div style={s.sectionLabel}>Phase tracker</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {phases.map((p) => (
          <div key={p.name} style={{ background: '#f9fafb', borderRadius: 8, padding: '12px 14px', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{p.name}</span>
              <StatusBadge status={p.status} />
            </div>
            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 8 }}>{p.scope} · Wk {p.weeks}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${p.pct}%`, background: '#374151', borderRadius: 3 }} />
              </div>
              <span style={{ fontSize: 11, color: '#6b7280', minWidth: 28, textAlign: 'right' }}>{p.pct}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EnvPanel = () => (
  <div style={s.panel}>
    <div style={s.metricGrid}>
      <MetricCard label="EIA required"     value="No"  sub="<0.5 ha footprint" />
      <MetricCard label="Carbon rating"    value="B+"  sub="Est. 42 kgCO₂/m²" />
      <MetricCard label="Water harvesting" value="Yes" sub="5,000 L tank" />
      <MetricCard label="Solar ready"      value="Yes" sub="South-facing roof" />
    </div>

    <div style={s.sectionLabel}>Considerations</div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {envItems.map((e) => (
        <div key={e.title} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 15 }}>{e.icon}</span>
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
  { id: 'plan',     label: 'House plan' },
  { id: 'model',    label: '3D model' },
  { id: 'boq',      label: 'BoQ' },
  { id: 'progress', label: 'Progress' },
  { id: 'env',      label: 'Environmental' },
];

const Cottage = () => {
  const [activeTab, setActiveTab] = useState('plan');

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', background: '#fff', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ padding: '14px 16px 0', borderBottom: '1px solid #e5e7eb', flexShrink: 0 }}>
        <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 2 }}>Project</div>
        <div style={{ fontSize: 16, fontWeight: 500, color: '#111827', marginBottom: 10 }}>Cottage — type A</div>

        {/* Scrollable tab bar — handles 5 tabs on narrow screens */}
        <div style={{ display: 'flex', overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', gap: 0, marginBottom: -1 }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flexShrink: 0,
                padding: '8px 14px',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #111827' : '2px solid transparent',
                color: activeTab === tab.id ? '#111827' : '#6b7280',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Panel */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {activeTab === 'plan'     && <HousePlanPanel />}
        {activeTab === 'model'    && <ModelPanel />}
        {activeTab === 'boq'      && <BoqPanel />}
        {activeTab === 'progress' && <ProgressPanel />}
        {activeTab === 'env'      && <EnvPanel />}
      </div>
    </div>
  );
};

export default Cottage;
