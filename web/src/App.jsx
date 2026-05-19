import { Link, Route, Routes } from 'react-router-dom';

const styles = {
  page: { fontFamily: 'Inter, Segoe UI, Arial, sans-serif', background: '#f8fafc', minHeight: '100vh', color: '#0f172a' },
  container: { width: 'min(1100px, 92%)', margin: '0 auto' },
  navWrap: { background: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 10 },
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0' },
  navLinks: { display: 'flex', gap: 14, flexWrap: 'wrap' },
  brand: { display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700 },
  shield: { background: '#0ea5e9', color: '#fff', borderRadius: 8, padding: '4px 8px', fontSize: 12 },
  hero: { background: 'linear-gradient(135deg,#0f172a,#1d4ed8)', color: '#fff', borderRadius: 16, padding: 28, marginTop: 18 },
  heroSub: { color: '#dbeafe', maxWidth: 760 },
  badgeRow: { display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 },
  badge: { border: '1px solid rgba(255,255,255,.4)', borderRadius: 999, padding: '6px 12px', fontSize: 13 },
  section: { marginTop: 22 },
  grid4: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12 },
  card: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 16 },
  cardTitle: { margin: '0 0 8px 0', fontSize: 18 },
  muted: { color: '#475569', margin: 0 },
  stepNum: { width: 28, height: 28, borderRadius: 999, background: '#dbeafe', color: '#1e3a8a', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, marginRight: 10 },
  notice: { background: '#ecfeff', border: '1px solid #a5f3fc', borderRadius: 12, padding: 14 },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' },
  thtd: { padding: 12, borderBottom: '1px solid #e2e8f0', textAlign: 'left' },
  cta: { background: '#16a34a', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 14px', fontWeight: 600 }
};

function TopNav() {
  return (
    <div style={styles.navWrap}>
      <div style={{ ...styles.container, ...styles.nav }}>
        <div style={styles.brand}>
          <span style={styles.shield}>Verified</span>
          <span>Edu Notes Marketplace</span>
        </div>
        <nav style={styles.navLinks}>
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/my-orders">My Orders</Link>
          <Link to="/admin">Admin</Link>
          <Link to="/remaining">Roadmap</Link>
        </nav>
      </div>
    </div>
  );
}

function Home() {
  return (
    <main style={styles.container}>
      <section style={styles.hero}>
        <h1 style={{ marginTop: 0 }}>Trusted Notes Store for SPPU & DBATU Students</h1>
        <p style={styles.heroSub}>
          Buy genuine subject-wise notes, PYQs, microcopy sets, and star questions. Every purchase is linked to your account so only paid students can access files.
        </p>
        <div style={styles.badgeRow}>
          <span style={styles.badge}>Owner-verified uploads</span>
          <span style={styles.badge}>Private file access</span>
          <span style={styles.badge}>Simple UPI payment</span>
        </div>
      </section>

      <section style={styles.section}>
        <h2>Browse by University & Year</h2>
        <div style={styles.grid4}>
          <div style={styles.card}><h3 style={styles.cardTitle}>SPPU FY</h3><p style={styles.muted}>Maths, BEE, Mechanics</p></div>
          <div style={styles.card}><h3 style={styles.cardTitle}>SPPU SY</h3><p style={styles.muted}>DSA, OOP, DMS</p></div>
          <div style={styles.card}><h3 style={styles.cardTitle}>DBATU TY</h3><p style={styles.muted}>DBMS, CN, Software Engg</p></div>
          <div style={styles.card}><h3 style={styles.cardTitle}>Final Year</h3><p style={styles.muted}>Project/viva packs & PYQ bundles</p></div>
        </div>
      </section>

      <section style={styles.section}>
        <h2>How It Works (Easy)</h2>
        <div style={styles.card}><p><span style={styles.stepNum}>1</span>Choose your product and pay exact amount on shown UPI ID / QR.</p><p><span style={styles.stepNum}>2</span>Submit UPI transaction ID (and screenshot if requested).</p><p><span style={styles.stepNum}>3</span>Owner verifies payment and unlocks download in your account.</p></div>
      </section>

      <section style={styles.section}>
        <h2>Why students can trust this</h2>
        <div style={styles.grid4}>
          <div style={styles.card}><h3 style={styles.cardTitle}>Secure access</h3><p style={styles.muted}>Only approved buyers get download access.</p></div>
          <div style={styles.card}><h3 style={styles.cardTitle}>Clear status</h3><p style={styles.muted}>Track pending/approved/rejected in My Orders.</p></div>
          <div style={styles.card}><h3 style={styles.cardTitle}>Transparent pricing</h3><p style={styles.muted}>Each product has visible fixed price in INR.</p></div>
          <div style={styles.card}><h3 style={styles.cardTitle}>Owner support</h3><p style={styles.muted}>Direct owner-managed catalog and updates.</p></div>
        </div>
      </section>
    </main>
  );
}

function Products() {
  const rows = [
    ['SPPU EM-III Notes', 'SPPU / SY', 'Notes', '₹99'],
    ['DBATU DBMS PYQ Pack', 'DBATU / TY', 'PYQ', '₹149'],
    ['Microcopy Star Bundle', 'Mixed', 'Microcopy', '₹79']
  ];
  return (
    <main style={{ ...styles.container, marginTop: 18 }}>
      <h2>Products</h2>
      <p style={styles.muted}>Simple catalog preview (Firestore integration is next).</p>
      <table style={styles.table}>
        <thead><tr><th style={styles.thtd}>Product</th><th style={styles.thtd}>Category</th><th style={styles.thtd}>Type</th><th style={styles.thtd}>Price</th></tr></thead>
        <tbody>
          {rows.map((r) => <tr key={r[0]}>{r.map((c) => <td key={c} style={styles.thtd}>{c}</td>)}</tr>)}
        </tbody>
      </table>
    </main>
  );
}

function MyOrders() {
  return (
    <main style={{ ...styles.container, marginTop: 18 }}>
      <h2>My Orders</h2>
      <div style={styles.notice}>
        <strong>Order statuses:</strong> pending_approval → approved (download unlocked) / rejected.
      </div>
      <div style={{ ...styles.card, marginTop: 12 }}>No orders yet. After checkout, your status will appear here.</div>
    </main>
  );
}

function Admin() {
  return (
    <main style={{ ...styles.container, marginTop: 18 }}>
      <h2>Admin Panel (Owner)</h2>
      <div style={styles.grid4}>
        <div style={styles.card}><h3 style={styles.cardTitle}>Products</h3><p style={styles.muted}>Add/edit files, title, category, and price.</p></div>
        <div style={styles.card}><h3 style={styles.cardTitle}>Orders</h3><p style={styles.muted}>Approve pending UPI transactions safely.</p></div>
        <div style={styles.card}><h3 style={styles.cardTitle}>Settings</h3><p style={styles.muted}>Update UPI ID, QR, and homepage text.</p></div>
        <div style={styles.card}><h3 style={styles.cardTitle}>Users</h3><p style={styles.muted}>View buyers and access records.</p></div>
      </div>
      <button style={{ ...styles.cta, marginTop: 14 }}>Open Admin Workflow (UI wiring pending)</button>
    </main>
  );
}

function Remaining() {
  const tasks = [
    'Connect Firebase Authentication (Google Sign-in)',
    'Implement Firestore CRUD for products and categories',
    'Implement checkout submit (UPI transaction ID + screenshot upload)',
    'Implement pending orders list + approve/reject UI',
    'Add secure purchase-verified downloads via Cloud Function',
    'Add form validation, loading states, and success/error toasts'
  ];
  return (
    <main style={{ ...styles.container, marginTop: 18, marginBottom: 40 }}>
      <h2>Implementation Roadmap</h2>
      <ul>
        {tasks.map((t) => <li key={t} style={{ marginBottom: 8 }}>{t}</li>)}
      </ul>
    </main>
  );
}

export default function App() {
  return (
    <div style={styles.page}>
      <TopNav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/remaining" element={<Remaining />} />
      </Routes>
    </div>
  );
}
