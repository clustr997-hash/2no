import { useEffect, useState } from 'react';
import { Link, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch
} from 'firebase/firestore';
import { getIdTokenResult, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { httpsCallable } from 'firebase/functions';
import { ADMIN_EMAILS } from './config/admin';
import {
  ALL_CATALOG_SUBJECTS,
  BRANCHES,
  CATALOG_SOURCES,
  CONTENT_KEYWORDS,
  UNIVERSITIES,
  YEARS,
  getBranch,
  getCatalogSubjectById,
  getCatalogSubjects,
  getSubjectCatalogKey,
  getUniversity,
  getYear
} from './data/catalog';
import { auth, cloudFunctions, db, firebaseReady, googleProvider, storage } from './firebase';
import './styles.css';

const DOCUMENT_TYPES = ['important-notes', 'solved-pyq', 'star-questions', 'high-chance', 'upcoming-focus', 'formula-sheet', 'pdf', 'image', 'assignment', 'other'];

const DEFAULT_SETTINGS = {
  upiId: 'your-upi-id@bank',
  collectNote: 'Pay with Google Pay, PhonePe, Paytm, or any UPI app. Add the transaction ID, then admin approval unlocks your exam pack.',
  supportText: 'Approval is manual so students get the correct files tied to their account.'
};

function safeFileName(name) {
  return name.toLowerCase().replace(/[^a-z0-9.-]+/g, '-').replace(/^-+|-+$/g, '') || 'file';
}

function subjectKey(subject) {
  return subject.catalogKey || getSubjectCatalogKey(subject.university, subject.year, subject.branch, subject.name || '');
}

function makeDemoSubjects(universityId, yearId, branchId) {
  return getCatalogSubjects(universityId, yearId, branchId);
}

function makeDemoDocuments(subject) {
  return [
    {
      id: `${subject.id}-notes`,
      title: `${subject.name} important notes`,
      type: 'important-notes',
      fileName: 'Important notes PDF',
      isFreePreview: false,
      demo: true
    },
    {
      id: `${subject.id}-pyq`,
      title: `${subject.name} solved PYQs and star questions`,
      type: 'solved-pyq',
      fileName: 'Solved PYQ pack',
      isFreePreview: false,
      demo: true
    }
  ];
}

function PaymentLogos() {
  return (
    <div className="payment-logos" aria-label="Supported UPI apps">
      <span className="pay-logo">
        <img src="/logos/google-pay.svg" alt="Google Pay" />
      </span>
      <span className="pay-logo">
        <img src="/logos/phonepe.svg" alt="PhonePe" />
      </span>
      <span className="pay-logo">
        <img src="/logos/paytm.svg" alt="Paytm" />
      </span>
    </div>
  );
}

function useAuthProfile() {
  const [profile, setProfile] = useState({
    user: null,
    loading: firebaseReady,
    isAdmin: false,
    hasAdminClaim: false
  });

  useEffect(() => {
    if (!firebaseReady || !auth) {
      setProfile({ user: null, loading: false, isAdmin: false, hasAdminClaim: false });
      return undefined;
    }

    return onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setProfile({ user: null, loading: false, isAdmin: false, hasAdminClaim: false });
        return;
      }

      let hasAdminClaim = false;
      try {
        const token = await getIdTokenResult(user, true);
        hasAdminClaim = token.claims.admin === true;
      } catch (error) {
        console.error('Unable to read admin claim', error);
      }

      const emailAdmin = ADMIN_EMAILS.includes(user.email || '');
      setProfile({ user, loading: false, isAdmin: hasAdminClaim || emailAdmin, hasAdminClaim });
    });
  }, []);

  return profile;
}

function useSiteSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    if (!firebaseReady || !db) return undefined;
    return onSnapshot(doc(db, 'settings', 'site'), (snapshot) => {
      setSettings({ ...DEFAULT_SETTINGS, ...(snapshot.exists() ? snapshot.data() : {}) });
    });
  }, []);

  return settings;
}

async function loginWithGoogle() {
  if (!firebaseReady || !auth) {
    window.alert('Project connection is not configured yet. Fill web/.env first.');
    return null;
  }
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (error) {
    window.alert(error.message);
    return null;
  }
}

function TopNav({ profile }) {
  return (
    <header className="topbar">
      <Link className="brand" to="/">
        <span className="brand-mark">MM</span>
        <span className="brand-copy">
          <strong>MicroMall</strong>
          <span>SPPU and DBATU exam cheats</span>
        </span>
      </Link>

      <nav className="nav-links" aria-label="Main navigation">
        <Link to="/">Browse</Link>
        <Link to="/my-access">My Access</Link>
        {profile.isAdmin ? <Link to="/admin">Admin</Link> : null}
        {profile.user ? (
          <button className="link-button" type="button" onClick={() => signOut(auth)}>
            Sign out
          </button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  );
}

function Home({ settings }) {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">SPPU and DBATU study content</p>
          <h1>MicroMall exam packs & cheats for engineering students</h1>
          <p>
            Choose your university, year, branch, and subject. Get important notes, solved PYQs,
            star questions, high-chance question sets, and upcoming exam focus packs after approval.
          </p>
          <div className="keyword-strip">
            {CONTENT_KEYWORDS.map((keyword) => <span key={keyword}>{keyword}</span>)}
          </div>
          <PaymentLogos />
        </div>
        <div className="collect-card">
          <h2>How to collect your items</h2>
          <ol>
            <li>Select university, year, branch, and subject.</li>
            <li>Pay the shown price with any UPI app.</li>
            <li>Submit transaction ID and wait for approval.</li>
            <li>Download unlocked notes, solved PYQs, images, and revision packs.</li>
          </ol>
          <p>{settings.collectNote}</p>
        </div>
      </section>

      <section className="section-head">
        <p className="eyebrow">Browse by university</p>
        <h2>Pick your year</h2>
      </section>

      <div className="university-grid">
        {UNIVERSITIES.map((university) => (
          <article className="university-panel" key={university.id}>
            <div>
              <span className="university-code">{university.shortName}</span>
              <h3>{university.name}</h3>
            </div>
            <div className="year-grid">
              {YEARS.map((year) => (
                <Link className="year-card" key={year.id} to={`/browse/${university.id}/${year.id}`}>
                  <strong>{university.shortName} {year.label}</strong>
                  <span>{year.name}</span>
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>

      <section className="micro-card">
        <div>
          <p className="eyebrow">Payment ready</p>
          <h2>Google Pay, PhonePe, and Paytm supported</h2>
          <p>
            The site keeps browsing simple for students and keeps paid files private until approve of
            transaction from the admin.
          </p>
        </div>
        <PaymentLogos />
      </section>
    </main>
  );
}

function BranchPage() {
  const { universityId, yearId } = useParams();
  const university = getUniversity(universityId);
  const year = getYear(yearId);

  if (!university || !year) return <NotFound />;

  return (
    <main>
      <Breadcrumbs items={[['Browse', '/'], [university.shortName], [year.label]]} />
      <section className="section-head">
        <p className="eyebrow">{university.shortName} {year.label}</p>
        <h1>Select your branch</h1>
        <p>Branch pages have their own URLs, so students can share the exact path.</p>
      </section>
      <div className="branch-grid">
        {BRANCHES.map((branch) => (
          <Link className="branch-card" key={branch.id} to={`/browse/${university.id}/${year.id}/${branch.id}`}>
            <strong>{branch.name}</strong>
            <span>View subject packs</span>
          </Link>
        ))}
      </div>
    </main>
  );
}

function SubjectsPage() {
  const { universityId, yearId, branchId } = useParams();
  const university = getUniversity(universityId);
  const year = getYear(yearId);
  const branch = getBranch(branchId);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(firebaseReady);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!firebaseReady || !db || !university || !year || !branch) {
      setLoading(false);
      return undefined;
    }

    const q = query(
      collection(db, 'subjects'),
      where('active', '==', true),
      where('university', '==', university.id),
      where('year', '==', year.id),
      where('branch', '==', branch.id),
      orderBy('name')
    );

    return onSnapshot(
      q,
      (snapshot) => {
        setSubjects(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
        setLoading(false);
      },
      (snapshotError) => {
        setError(snapshotError.message);
        setLoading(false);
      }
    );
  }, [university, year, branch]);

  if (!university || !year || !branch) return <NotFound />;

  const catalogSubjects = makeDemoSubjects(university.id, year.id, branch.id);
  const liveSubjectKeys = new Set(subjects.map(subjectKey));
  const visibleSubjects = [
    ...(firebaseReady ? subjects : []),
    ...catalogSubjects.filter((subject) => !liveSubjectKeys.has(subject.catalogKey))
  ];

  return (
    <main>
      <Breadcrumbs
        items={[
          ['Browse', '/'],
          [university.shortName, `/browse/${university.id}/${year.id}`],
          [year.label],
          [branch.name]
        ]}
      />
      <section className="section-head">
        <p className="eyebrow">{university.shortName} {year.label} / {branch.name}</p>
        <h1>Select subject</h1>
        <p>Each subject can hold important notes, solved PYQ PDFs, star questions, formula sheets, images, assignments, and owner-uploaded documents.</p>
      </section>

      {loading ? <p className="notice">Loading subjects...</p> : null}
      {error ? <p className="error">{error}</p> : null}
      {!loading && visibleSubjects.length === 0 ? (
        <p className="notice">No subjects are live here yet. Admin can add subjects and documents from the dashboard.</p>
      ) : null}

      <div className="subject-grid">
        {visibleSubjects.map((subject) => (
          <Link className="subject-card" key={subject.id} to={`/subjects/${subject.id}`}>
            <span className={subject.catalogOnly ? 'catalog-pill' : subject.isPaid === false ? 'free-pill' : 'paid-pill'}>
              {subject.catalogOnly ? 'Syllabus catalog' : subject.isPaid === false ? 'Free' : `Paid Rs. ${subject.price || 0}`}
            </span>
            <h2>{subject.name}</h2>
            <p>{subject.description || 'Admin-uploaded documents for this subject.'}</p>
            {subject.sourcePattern ? <small>{subject.sourcePattern}</small> : null}
          </Link>
        ))}
      </div>
    </main>
  );
}

function SubjectDetails({ profile, settings }) {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const isCatalog = subjectId.startsWith('catalog-');
  const [subject, setSubject] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(!isCatalog && firebaseReady);
  const [orderForm, setOrderForm] = useState({ utr: '', payerName: '', payerPhone: '', upiApp: 'GPay' });
  const [screenshot, setScreenshot] = useState(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isCatalog) {
      const catalogSubject = getCatalogSubjectById(subjectId);
      setSubject(catalogSubject || null);
      setDocuments(catalogSubject ? makeDemoDocuments(catalogSubject) : []);
      setLoading(false);
      return undefined;
    }

    if (!firebaseReady || !db) {
      setLoading(false);
      return undefined;
    }

    const unsubSubject = onSnapshot(doc(db, 'subjects', subjectId), (snapshot) => {
      setSubject(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
      setLoading(false);
    });

    const docsQuery = query(
      collection(db, 'documents'),
      where('subjectId', '==', subjectId),
      where('active', '==', true),
      orderBy('createdAt', 'desc')
    );
    const unsubDocs = onSnapshot(docsQuery, (snapshot) => {
      setDocuments(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    });

    return () => {
      unsubSubject();
      unsubDocs();
    };
  }, [subjectId, isCatalog]);

  useEffect(() => {
    if (!firebaseReady || !db || !profile.user || isCatalog) {
      setPurchase(null);
      return undefined;
    }

    const purchaseQuery = query(
      collection(db, 'purchases'),
      where('userId', '==', profile.user.uid),
      where('subjectId', '==', subjectId)
    );
    return onSnapshot(purchaseQuery, (snapshot) => {
      setPurchase(snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
    });
  }, [profile.user, subjectId, isCatalog]);

  const hasAccess = subject?.isPaid === false || Boolean(purchase);

  async function submitOrder(event) {
    event.preventDefault();
    setMessage('');

    if (!firebaseReady || !db || !storage) {
      setMessage('Project connection is not configured yet. Fill web/.env and deploy rules first.');
      return;
    }

    if (isCatalog) {
      setMessage('This subject is in the syllabus catalog. Owner must import it, upload files, and mark it live before payment.');
      return;
    }

    if (!profile.user) {
      await loginWithGoogle();
      return;
    }

    if (!orderForm.utr.trim()) {
      setMessage('Add the UPI transaction ID before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      let screenshotPath = '';
      if (screenshot) {
        screenshotPath = `payment-screenshots/${profile.user.uid}/${Date.now()}-${safeFileName(screenshot.name)}`;
        await uploadBytes(ref(storage, screenshotPath), screenshot, {
          contentType: screenshot.type || 'application/octet-stream'
        });
      }

      await addDoc(collection(db, 'orders'), {
        userId: profile.user.uid,
        userEmail: profile.user.email || '',
        subjectId,
        subjectName: subject.name,
        amount: Number(subject.price || 0),
        utr: orderForm.utr.trim(),
        payerName: orderForm.payerName.trim(),
        payerPhone: orderForm.payerPhone.trim(),
        upiApp: orderForm.upiApp,
        screenshotPath,
        status: 'pending_approval',
        createdAt: serverTimestamp()
      });

      setOrderForm({ utr: '', payerName: '', payerPhone: '', upiApp: 'GPay' });
      setScreenshot(null);
      setMessage('Payment proof submitted. Admin approval will unlock this subject.');
      navigate('/my-access');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function downloadDocument(item) {
    setMessage('');

    if (item.demo || isCatalog) {
      setMessage('This is a catalog preview. Owner can import the subject and upload real files from Admin.');
      return;
    }

    if (!hasAccess && item.isFreePreview !== true) {
      setMessage('This is paid content. Submit payment and wait for admin approval first.');
      return;
    }

    try {
      const getDownloadUrl = httpsCallable(cloudFunctions, 'getDownloadUrl');
      const result = await getDownloadUrl({ documentId: item.id });
      window.open(result.data.url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      setMessage(error.message);
    }
  }

  if (loading) return <main><p className="notice">Loading subject...</p></main>;
  if (!subject) return <NotFound />;

  return (
    <main>
      <Breadcrumbs
        items={[
          ['Browse', '/'],
          [getUniversity(subject.university)?.shortName || 'University'],
          [getYear(subject.year)?.label || 'Year'],
          [getBranch(subject.branch)?.name || 'Branch'],
          [subject.name]
        ]}
      />

      <section className="subject-detail">
        <div>
          <span className={subject.catalogOnly ? 'catalog-pill' : subject.isPaid === false ? 'free-pill' : 'paid-pill'}>
            {subject.catalogOnly ? 'Syllabus catalog' : subject.isPaid === false ? 'Free subject' : `Paid subject Rs. ${subject.price || 0}`}
          </span>
          <h1>{subject.name}</h1>
          <p>{subject.description || 'Documents are controlled by admin and can include notes, PDFs, PYQs, and images.'}</p>
          {subject.sourcePattern ? <small className="source-note">{subject.sourcePattern}</small> : null}
        </div>
        <div className="pay-panel">
          <h2>Access status</h2>
          <p>{subject.catalogOnly ? 'Owner setup required before students can buy or download.' : hasAccess ? 'Unlocked for download.' : 'Payment approval required before download.'}</p>
          <PaymentLogos />
        </div>
      </section>

      {message ? <p className="notice">{message}</p> : null}

      <section className="content-split">
        <div className="document-list">
          <h2>Subject documents</h2>
          {documents.length === 0 ? <p className="notice">No documents uploaded yet.</p> : null}
          {documents.map((item) => (
            <article className="doc-row" key={item.id}>
              <div>
                <span className="doc-type">{item.type || 'document'}</span>
                <h3>{item.title}</h3>
                <p>{item.fileName || 'Uploaded file'} {item.isFreePreview ? '- free preview' : ''}</p>
              </div>
              <button type="button" onClick={() => downloadDocument(item)}>
                {hasAccess || item.isFreePreview ? 'Download' : 'Locked'}
              </button>
            </article>
          ))}
        </div>

        {subject.catalogOnly || subject.isPaid === false || hasAccess ? null : (
          <form className="checkout-card" onSubmit={submitOrder}>
            <h2>Pay and request approval</h2>
            <p>UPI ID: <strong>{settings.upiId}</strong></p>
            <PaymentLogos />
            <label>
              Payment app
              <select value={orderForm.upiApp} onChange={(event) => setOrderForm({ ...orderForm, upiApp: event.target.value })}>
                <option>GPay</option>
                <option>PhonePe</option>
                <option>Paytm</option>
                <option>Other UPI</option>
              </select>
            </label>
            <label>
              Transaction ID
              <input value={orderForm.utr} onChange={(event) => setOrderForm({ ...orderForm, utr: event.target.value })} placeholder="UPI / UTR ID" />
            </label>
            <label>
              Name on payment
              <input value={orderForm.payerName} onChange={(event) => setOrderForm({ ...orderForm, payerName: event.target.value })} placeholder="Student name" />
            </label>
            <label>
              Phone number
              <input value={orderForm.payerPhone} onChange={(event) => setOrderForm({ ...orderForm, payerPhone: event.target.value })} placeholder="Optional" />
            </label>
            <label>
              Payment screenshot
              <input type="file" accept="image/*,application/pdf" onChange={(event) => setScreenshot(event.target.files?.[0] || null)} />
            </label>
            <button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit for approval'}</button>
            {!profile.user ? <p className="hint">Paid packs need student login so approval can unlock your account.</p> : null}
          </form>
        )}
      </section>
    </main>
  );
}

function MyAccess({ profile }) {
  const [orders, setOrders] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!firebaseReady || !db || !profile.user) return undefined;

    const orderQuery = query(collection(db, 'orders'), where('userId', '==', profile.user.uid), orderBy('createdAt', 'desc'));
    const purchaseQuery = query(collection(db, 'purchases'), where('userId', '==', profile.user.uid), orderBy('purchasedAt', 'desc'));

    const unsubOrders = onSnapshot(orderQuery, (snapshot) => {
      setOrders(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    }, (snapshotError) => setError(snapshotError.message));

    const unsubPurchases = onSnapshot(purchaseQuery, (snapshot) => {
      setPurchases(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    }, (snapshotError) => setError(snapshotError.message));

    return () => {
      unsubOrders();
      unsubPurchases();
    };
  }, [profile.user]);

  if (!profile.user) {
    return (
      <main className="center-card">
        <h1>Student login</h1>
        <p>Login to see payment approvals and unlocked subject packs.</p>
        <button type="button" onClick={loginWithGoogle}>Continue with Google</button>
      </main>
    );
  }

  return (
    <main>
      <section className="section-head">
        <p className="eyebrow">Student area</p>
        <h1>My Access</h1>
        <p>Pending approvals and unlocked subject documents appear here.</p>
      </section>
      {error ? <p className="error">{error}</p> : null}
      <div className="content-split">
        <section className="panel">
          <h2>Approved subjects</h2>
          {purchases.length === 0 ? <p className="notice">No approved subjects yet.</p> : null}
          {purchases.map((purchase) => (
            <article className="list-row" key={purchase.id}>
              <div>
                <strong>{purchase.subjectName || purchase.subjectId}</strong>
                <span>Approved</span>
              </div>
              <Link to={`/subjects/${purchase.subjectId}`}>Open</Link>
            </article>
          ))}
        </section>
        <section className="panel">
          <h2>Orders</h2>
          {orders.length === 0 ? <p className="notice">No orders submitted.</p> : null}
          {orders.map((order) => (
            <article className="list-row" key={order.id}>
              <div>
                <strong>{order.subjectName || order.subjectId}</strong>
                <span>{order.status} - Rs. {order.amount || 0}</span>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

function LoginPage({ profile }) {
  if (profile.user && profile.isAdmin) return <Navigate to="/admin" replace />;
  if (profile.user) return <Navigate to="/my-access" replace />;

  return (
    <main>
      <section className="section-head">
        <p className="eyebrow">Login</p>
        <h1>Choose student or admin login</h1>
        <p>Students can track approvals. Admin sees the dashboard only after admin login.</p>
      </section>
      <div className="login-grid">
        <article className="login-card">
          <h2>Student login</h2>
          <p>Browse is public. Login is needed for paid packs and approval tracking.</p>
          <button type="button" onClick={loginWithGoogle}>Continue as student</button>
        </article>
        <article className="login-card admin-login">
          <h2>Admin login</h2>
          <p>Only owner-approved accounts can add documents, change prices, and approve orders.</p>
          <button type="button" onClick={loginWithGoogle}>Continue as admin</button>
        </article>
      </div>
      {!firebaseReady ? <p className="notice">Project connection is not configured yet. Add values in web/.env to enable login.</p> : null}
    </main>
  );
}

function AdminDashboard({ profile, settings }) {
  const [subjects, setSubjects] = useState([]);
  const [orders, setOrders] = useState([]);
  const [docs, setDocs] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [subjectForm, setSubjectForm] = useState({
    university: 'sppu',
    year: 'fy',
    branch: 'computer-science',
    name: '',
    description: '',
    price: '99',
    isPaid: true,
    active: true
  });
  const [editingSubjectId, setEditingSubjectId] = useState('');
  const [docForm, setDocForm] = useState({ title: '', type: 'important-notes', isFreePreview: false, active: true });
  const [docFile, setDocFile] = useState(null);
  const [siteForm, setSiteForm] = useState(settings);
  const [message, setMessage] = useState('');
  const [importingCatalog, setImportingCatalog] = useState(false);

  useEffect(() => setSiteForm(settings), [settings]);

  useEffect(() => {
    if (!firebaseReady || !db || !profile.isAdmin) return undefined;
    const q = query(collection(db, 'subjects'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const nextSubjects = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
      setSubjects(nextSubjects);
      if (!selectedSubjectId && nextSubjects[0]) setSelectedSubjectId(nextSubjects[0].id);
    });
  }, [profile.isAdmin, selectedSubjectId]);

  useEffect(() => {
    if (!firebaseReady || !db || !profile.isAdmin) return undefined;
    const q = query(collection(db, 'orders'), where('status', '==', 'pending_approval'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    });
  }, [profile.isAdmin]);

  useEffect(() => {
    if (!firebaseReady || !db || !profile.isAdmin || !selectedSubjectId) {
      setDocs([]);
      return undefined;
    }
    const q = query(collection(db, 'documents'), where('subjectId', '==', selectedSubjectId), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setDocs(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    });
  }, [profile.isAdmin, selectedSubjectId]);

  const existingCatalogKeys = new Set(subjects.map(subjectKey));
  const missingCatalogSubjects = ALL_CATALOG_SUBJECTS.filter((subject) => !existingCatalogKeys.has(subject.catalogKey));
  const liveSubjectCount = subjects.filter((subject) => subject.active !== false).length;

  async function importCatalogSubjects() {
    if (!firebaseReady || !db) {
      setMessage('Project connection is not configured yet.');
      return;
    }
    if (missingCatalogSubjects.length === 0) {
      setMessage('Syllabus catalog is already imported.');
      return;
    }

    setImportingCatalog(true);
    setMessage('');
    try {
      let batch = writeBatch(db);
      let batchCount = 0;
      const commits = [];
      const subjectsRef = collection(db, 'subjects');

      missingCatalogSubjects.forEach((subject) => {
        const refDoc = doc(subjectsRef);
        batch.set(refDoc, {
          university: subject.university,
          year: subject.year,
          branch: subject.branch,
          name: subject.name,
          description: subject.description,
          price: subject.price,
          isPaid: true,
          active: false,
          catalogKey: subject.catalogKey,
          sourcePattern: subject.sourcePattern,
          catalogSource: CATALOG_SOURCES[subject.university],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        batchCount += 1;

        if (batchCount === 450) {
          commits.push(batch.commit());
          batch = writeBatch(db);
          batchCount = 0;
        }
      });

      if (batchCount > 0) commits.push(batch.commit());
      await Promise.all(commits);
      setMessage(`Imported ${missingCatalogSubjects.length} hidden syllabus subjects. Edit price, upload files, then mark selected subjects live.`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setImportingCatalog(false);
    }
  }

  if (profile.loading) return <main><p className="notice">Checking admin session...</p></main>;
  if (!profile.user) return <Navigate to="/login" replace />;
  if (!profile.isAdmin) {
    return (
      <main className="center-card">
        <h1>Admin access required</h1>
        <p>This account is signed in as a student. Use the admin account to view this page.</p>
      </main>
    );
  }

  async function saveSubject(event) {
    event.preventDefault();
    setMessage('');
    const payload = {
      university: subjectForm.university,
      year: subjectForm.year,
      branch: subjectForm.branch,
      name: subjectForm.name.trim(),
      description: subjectForm.description.trim(),
      price: Number(subjectForm.price || 0),
      isPaid: subjectForm.isPaid,
      active: subjectForm.active,
      catalogKey: getSubjectCatalogKey(subjectForm.university, subjectForm.year, subjectForm.branch, subjectForm.name.trim()),
      updatedAt: serverTimestamp()
    };

    try {
      if (editingSubjectId) {
        await updateDoc(doc(db, 'subjects', editingSubjectId), payload);
        setMessage('Subject updated.');
      } else {
        const created = await addDoc(collection(db, 'subjects'), { ...payload, createdAt: serverTimestamp() });
        setSelectedSubjectId(created.id);
        setMessage('Subject created.');
      }
      setSubjectForm({ university: 'sppu', year: 'fy', branch: 'computer-science', name: '', description: '', price: '99', isPaid: true, active: true });
      setEditingSubjectId('');
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function saveDocument(event) {
    event.preventDefault();
    setMessage('');
    if (!selectedSubjectId) {
      setMessage('Select a subject first.');
      return;
    }
    if (!docFile) {
      setMessage('Choose a PDF or image to upload.');
      return;
    }

    try {
      const filePath = `subject-documents/${selectedSubjectId}/${Date.now()}-${safeFileName(docFile.name)}`;
      await uploadBytes(ref(storage, filePath), docFile, { contentType: docFile.type || 'application/octet-stream' });
      await addDoc(collection(db, 'documents'), {
        subjectId: selectedSubjectId,
        title: docForm.title.trim() || docFile.name,
        type: docForm.type,
        filePath,
        fileName: docFile.name,
        mimeType: docFile.type || '',
        size: docFile.size,
        isFreePreview: docForm.isFreePreview,
        active: docForm.active,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setDocForm({ title: '', type: 'important-notes', isFreePreview: false, active: true });
      setDocFile(null);
      setMessage('Document uploaded.');
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function editSubject(subject) {
    setEditingSubjectId(subject.id);
    setSelectedSubjectId(subject.id);
    setSubjectForm({
      university: subject.university || 'sppu',
      year: subject.year || 'fy',
      branch: subject.branch || 'computer-science',
      name: subject.name || '',
      description: subject.description || '',
      price: String(subject.price ?? 0),
      isPaid: subject.isPaid !== false,
      active: subject.active !== false
    });
  }

  async function deleteSubject(id) {
    if (!window.confirm('Delete this subject? Documents stay in storage until removed separately.')) return;
    try {
      await deleteDoc(doc(db, 'subjects', id));
      setMessage('Subject deleted.');
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function updateDocument(item, patch) {
    try {
      await updateDoc(doc(db, 'documents', item.id), { ...patch, updatedAt: serverTimestamp() });
      setMessage('Document updated.');
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function deleteDocument(item) {
    if (!window.confirm('Delete this document and its storage file?')) return;
    try {
      if (item.filePath) await deleteObject(ref(storage, item.filePath)).catch(() => undefined);
      await deleteDoc(doc(db, 'documents', item.id));
      setMessage('Document deleted.');
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function saveSettings(event) {
    event.preventDefault();
    try {
      await setDoc(doc(db, 'settings', 'site'), { ...siteForm, updatedAt: serverTimestamp() }, { merge: true });
      setMessage('Settings saved.');
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function approveOrder(id) {
    try {
      const fn = httpsCallable(cloudFunctions, 'approveOrder');
      await fn({ orderId: id });
      setMessage('Order approved.');
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function rejectOrder(id) {
    try {
      const fn = httpsCallable(cloudFunctions, 'rejectOrder');
      await fn({ orderId: id });
      setMessage('Order rejected.');
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main>
      <section className="admin-head">
        <div>
          <p className="eyebrow">Admin dashboard</p>
          <h1>Manage exam packs, prices, and approvals</h1>
          <p>Only admin login can see this dashboard. Server rules still require the owner admin permission.</p>
        </div>
        {!profile.hasAdminClaim ? <p className="warning">This email is allowed in the UI, but the owner admin permission is still needed for production writes.</p> : null}
      </section>
      {message ? <p className="notice">{message}</p> : null}
      {!firebaseReady ? <p className="error">Project connection is not configured. Add web/.env values before using admin tools.</p> : null}

      <div className="admin-grid">
        <section className="panel owner-panel">
          <h2>Owner quick setup</h2>
          <div className="metric-grid">
            <span><strong>{subjects.length}</strong> total subjects</span>
            <span><strong>{liveSubjectCount}</strong> live</span>
            <span><strong>{orders.length}</strong> pending approvals</span>
            <span><strong>{missingCatalogSubjects.length}</strong> catalog missing</span>
          </div>
          <p className="hint">
            Import creates hidden SPPU and DBATU syllabus subjects. Upload files, check the price, then turn on Live on site.
          </p>
          <button type="button" onClick={importCatalogSubjects} disabled={importingCatalog || missingCatalogSubjects.length === 0}>
            {importingCatalog ? 'Importing catalog...' : 'Import missing syllabus catalog'}
          </button>
        </section>

        <section className="panel">
          <h2>{editingSubjectId ? 'Edit subject' : 'Add subject'}</h2>
          <form className="stack-form" onSubmit={saveSubject}>
            <label>
              University
              <select value={subjectForm.university} onChange={(event) => setSubjectForm({ ...subjectForm, university: event.target.value })}>
                {UNIVERSITIES.map((item) => <option value={item.id} key={item.id}>{item.shortName}</option>)}
              </select>
            </label>
            <label>
              Year
              <select value={subjectForm.year} onChange={(event) => setSubjectForm({ ...subjectForm, year: event.target.value })}>
                {YEARS.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}
              </select>
            </label>
            <label>
              Branch
              <select value={subjectForm.branch} onChange={(event) => setSubjectForm({ ...subjectForm, branch: event.target.value })}>
                {BRANCHES.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
              </select>
            </label>
            <label>
              Subject name
              <input value={subjectForm.name} onChange={(event) => setSubjectForm({ ...subjectForm, name: event.target.value })} required />
            </label>
            <label>
              Description
              <textarea value={subjectForm.description} onChange={(event) => setSubjectForm({ ...subjectForm, description: event.target.value })} rows="3" />
            </label>
            <label>
              Price
              <input type="number" min="0" value={subjectForm.price} onChange={(event) => setSubjectForm({ ...subjectForm, price: event.target.value })} />
            </label>
            <label className="check-row">
              <input type="checkbox" checked={subjectForm.isPaid} onChange={(event) => setSubjectForm({ ...subjectForm, isPaid: event.target.checked })} />
              Paid subject
            </label>
            <label className="check-row">
              <input type="checkbox" checked={subjectForm.active} onChange={(event) => setSubjectForm({ ...subjectForm, active: event.target.checked })} />
              Live on site
            </label>
            <button type="submit">{editingSubjectId ? 'Update subject' : 'Create subject'}</button>
          </form>
        </section>

        <section className="panel">
          <h2>Subjects</h2>
          <div className="admin-list">
            {subjects.map((subject) => (
              <article className="admin-row" key={subject.id}>
                <button type="button" className="row-main" onClick={() => setSelectedSubjectId(subject.id)}>
                  <strong>{subject.name}</strong>
                  <span>{getUniversity(subject.university)?.shortName} {getYear(subject.year)?.label} / {getBranch(subject.branch)?.name} / Rs. {subject.price || 0} / {subject.active === false ? 'hidden' : 'live'}</span>
                </button>
                <button type="button" onClick={() => editSubject(subject)}>Edit</button>
                <button type="button" className="danger" onClick={() => deleteSubject(subject.id)}>Delete</button>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2>Upload document</h2>
          <form className="stack-form" onSubmit={saveDocument}>
            <label>
              Subject
              <select value={selectedSubjectId} onChange={(event) => setSelectedSubjectId(event.target.value)}>
                <option value="">Select subject</option>
                {subjects.map((subject) => <option value={subject.id} key={subject.id}>{subject.name}</option>)}
              </select>
            </label>
            <label>
              Title
              <input value={docForm.title} onChange={(event) => setDocForm({ ...docForm, title: event.target.value })} placeholder="Solved PYQ 2025, Unit 1 star questions, formula sheet" />
            </label>
            <label>
              Type
              <select value={docForm.type} onChange={(event) => setDocForm({ ...docForm, type: event.target.value })}>
                {DOCUMENT_TYPES.map((type) => <option value={type} key={type}>{type}</option>)}
              </select>
            </label>
            <label>
              File
              <input type="file" accept="application/pdf,image/*" onChange={(event) => setDocFile(event.target.files?.[0] || null)} />
            </label>
            <label className="check-row">
              <input type="checkbox" checked={docForm.isFreePreview} onChange={(event) => setDocForm({ ...docForm, isFreePreview: event.target.checked })} />
              Free preview
            </label>
            <button type="submit">Upload document</button>
          </form>
        </section>

        <section className="panel">
          <h2>Documents</h2>
          {docs.length === 0 ? <p className="notice">Select a subject with uploaded documents.</p> : null}
          <div className="admin-list">
            {docs.map((item) => (
              <article className="admin-row" key={item.id}>
                <div className="row-main">
                  <strong>{item.title}</strong>
                  <span>{item.type} / {item.active === false ? 'hidden' : 'live'} / {item.isFreePreview ? 'free preview' : 'locked with subject'}</span>
                </div>
                <button type="button" onClick={() => updateDocument(item, { active: item.active === false })}>{item.active === false ? 'Show' : 'Hide'}</button>
                <button type="button" onClick={() => updateDocument(item, { isFreePreview: !item.isFreePreview })}>{item.isFreePreview ? 'Lock' : 'Free'}</button>
                <button type="button" className="danger" onClick={() => deleteDocument(item)}>Delete</button>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2>Pending approvals</h2>
          {orders.length === 0 ? <p className="notice">No pending orders.</p> : null}
          <div className="admin-list">
            {orders.map((order) => (
              <OrderRow order={order} key={order.id} onApprove={approveOrder} onReject={rejectOrder} />
            ))}
          </div>
        </section>

        <section className="panel">
          <h2>Payment settings</h2>
          <form className="stack-form" onSubmit={saveSettings}>
            <label>
              UPI ID
              <input value={siteForm.upiId || ''} onChange={(event) => setSiteForm({ ...siteForm, upiId: event.target.value })} />
            </label>
            <label>
              Collection note
              <textarea rows="3" value={siteForm.collectNote || ''} onChange={(event) => setSiteForm({ ...siteForm, collectNote: event.target.value })} />
            </label>
            <label>
              Support text
              <textarea rows="3" value={siteForm.supportText || ''} onChange={(event) => setSiteForm({ ...siteForm, supportText: event.target.value })} />
            </label>
            <button type="submit">Save settings</button>
          </form>
        </section>
      </div>
    </main>
  );
}

function OrderRow({ order, onApprove, onReject }) {
  const [screenshotUrl, setScreenshotUrl] = useState('');

  useEffect(() => {
    if (!order.screenshotPath || !storage) return undefined;
    getDownloadURL(ref(storage, order.screenshotPath)).then(setScreenshotUrl).catch(() => setScreenshotUrl(''));
    return undefined;
  }, [order.screenshotPath]);

  return (
    <article className="admin-row">
      <div className="row-main">
        <strong>{order.subjectName}</strong>
        <span>{order.userEmail} / Rs. {order.amount || 0} / {order.upiApp} / {order.utr}</span>
        {screenshotUrl ? <a href={screenshotUrl} target="_blank" rel="noreferrer">View screenshot</a> : null}
      </div>
      <button type="button" onClick={() => onApprove(order.id)}>Approve</button>
      <button type="button" className="danger" onClick={() => onReject(order.id)}>Reject</button>
    </article>
  );
}

function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const [label, to] = item;
        return to ? <Link key={`${label}-${index}`} to={to}>{label}</Link> : <span key={`${label}-${index}`}>{label}</span>;
      })}
    </nav>
  );
}

function NotFound() {
  return (
    <main className="center-card">
      <h1>Page not found</h1>
      <p>Choose a university and year from the browse page.</p>
      <Link to="/">Go to browse</Link>
    </main>
  );
}

export default function App() {
  const profile = useAuthProfile();
  const settings = useSiteSettings();

  return (
    <div className="app-shell">
      <TopNav profile={profile} />
      <Routes>
        <Route path="/" element={<Home settings={settings} />} />
        <Route path="/browse/:universityId/:yearId" element={<BranchPage />} />
        <Route path="/browse/:universityId/:yearId/:branchId" element={<SubjectsPage />} />
        <Route path="/subjects/:subjectId" element={<SubjectDetails profile={profile} settings={settings} />} />
        <Route path="/my-access" element={<MyAccess profile={profile} />} />
        <Route path="/login" element={<LoginPage profile={profile} />} />
        <Route path="/admin" element={<AdminDashboard profile={profile} settings={settings} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
