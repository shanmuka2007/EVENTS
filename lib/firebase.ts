import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDocs, getDocFromServer } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  };
}

export interface EventItem {
  id: string;
  title: string;
  headline: string;
  description: string;
  longDescription: string;
  date: string;
  location: string;
  tags: string[];
  imageUrl: string;
  themeColor: 'cyan' | 'pink' | 'purple';
  metrics: { label: string; value: string }[];
}

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'jodhpur-sangeet',
    title: 'The Royal Jodhpur Cyber-Sangeet // Grand Gala',
    headline: 'A grand synthesis of Rajasthani architectural heritage and interactive neon art.',
    description: 'An ultra-luxurious celebration featuring holographic folk dancers, a live cyber-shehnai band, and grand multi-frequency projections over the Mehrangarh Fort walls.',
    longDescription: 'Blending timeless royal heritage with modern sci-fi luxury, the sangeet hosted 2,500 royal attendees. Precision lasers mapped the historic sandstone forts, while synchronized drones painted traditional designs like peacocks, diyas, and mandalas across the dark desert night sky.',
    date: '2026-03-12',
    location: 'Mehrangarh Fortress // Jodhpur',
    tags: ['Royal Marriage', 'Sangeet Gala', 'Heritage Tech'],
    imageUrl: 'https://picsum.photos/seed/jodhpurevent/650/450',
    themeColor: 'pink',
    metrics: [
      { label: 'Royal Guest Count', value: '2,500' },
      { label: 'Mapped Projection Area', value: '1.2 Sq-Km' },
    ],
  },
  {
    id: 'vedic-astro',
    title: 'Electric Vedic Astro-Marriage',
    headline: 'Synchronized astrological alignments under interactive quantum stardust domes.',
    description: 'A Vedic ceremony hosted inside a 360-degree glass planetarium dome projecting real-time planetary transits matching the couple\'s sacred compatibility scores.',
    longDescription: 'This unique wedding combined cosmic physics with ancient scriptural alignment. Seven sacred vows (\'Pheras\') were taken around a high-frequency solar ritual fire (\'Havan\'), while digital constellations responded to the holy chanting of the priests (\'Shlokas\').',
    date: '2026-04-19',
    location: 'Galaxy Astro-Pavilion // Bengaluru',
    tags: ['Vedic Wedding', 'Cosmic Astro', 'Aura Domes'],
    imageUrl: 'https://picsum.photos/seed/vedicastro/600/400',
    themeColor: 'purple',
    metrics: [
      { label: 'Astro-Sanskrit Sync', value: '100%' },
      { label: 'Planetarium Nodes', value: '512 Nodes' },
    ],
  },
  {
    id: 'laser-mehendi',
    title: 'Neo-Delhi Laser-Mehendi Ceremony',
    headline: 'Interactive biological dye art paired with neon laser aesthetics.',
    description: 'An immersive outdoor pavilion decorated with luminescent flora, interactive henna designs, and laser-guided visual decor.',
    longDescription: 'Bridesmaids enjoyed henna art using organic, temperature-releasing indigo dyes that illuminate subtly under safe UV blacklight, representing inner light and eternal bond. Paired with fine North Indian fusion catering and electric sitar grooves.',
    date: '2026-05-02',
    location: 'Meadow Farms // New Delhi',
    tags: ['Mehendi', 'Indigo Laser', 'Flora Design'],
    imageUrl: 'https://picsum.photos/seed/lasermehendi/600/850',
    themeColor: 'cyan',
    metrics: [
      { label: 'UV Henna Formula', value: '100% Organic' },
      { label: 'Sitar Wave Intensity', value: '340 Watts' },
    ],
  },
  {
    id: 'holographic-baraat',
    title: 'Royal Rajputana Holographic Baraat',
    headline: 'A Majestic entry featuring cybernetic elephants and floating musical bands.',
    description: 'The groom\'s grand procession accompanied by light-weight kinetic floats, traditional drums, and giant safe holographic displays.',
    longDescription: 'This spectacular celebration featured a majestic procession of 30 kinetic-light drums, modern synthesizers, and grand translucent holograms of grand royal heraldry. Guests marched along a dynamic illuminated path synchronized with festive beats.',
    date: '2026-05-15',
    location: 'City Palace Gardens // Jaipur',
    tags: ['Baraat Procession', 'Hologram Elephants', 'Grand Entry'],
    imageUrl: 'https://picsum.photos/seed/rajasthani/600/550',
    themeColor: 'pink',
    metrics: [
      { label: 'Drum Synchrony', value: '99.9%' },
      { label: 'Holographic Scale', value: '15 Meters' },
    ],
  },
  {
    id: 'chitra-mandap',
    title: 'Quantum Chitra-Lekha Mandap',
    headline: 'Responsive architectural mandala canopies that adapt to Sanskrit chants.',
    description: 'A sacred mandap composed of lightweight interactive fiber-optics, adapting colors and floral density dynamically.',
    longDescription: 'This modern mandap transformed traditional floral design into a living work of dynamic architecture. Custom voice-recognition algorithms translated sacred holy mantras into gentle ripples of glowing peach, crimson, and golden light, creating a deep spiritual experience.',
    date: '2026-05-24',
    location: 'Tech-Lotus Arena // Hyderabad',
    tags: ['Sanskrit Mandap', 'Fiber-Optics', 'Digital Altar'],
    imageUrl: 'https://picsum.photos/seed/mandap/600/480',
    themeColor: 'purple',
    metrics: [
      { label: 'Audio Response Speed', value: '15ms' },
      { label: 'Chant Recognition', value: 'Sanskrit V1' },
    ],
  },
  {
    id: 'mumbai-drones',
    title: 'Mumbai Lights: Shehnai & Drones',
    headline: 'A glorious modern wedding reception over the ocean with 1,250 synchronized drones.',
    description: 'A marine-drive reception venue featuring celestial classical wind instruments paired with coordinated drone-lit night sky art.',
    longDescription: 'To honor traditional roots, a celestial double-reed oboe (\'Shehnai\') master played classical morning ragas, while overhead drones rendered animated stories of the couple meeting across various stellar landscapes. Guest tables adjusted visual themes to match the rhythm.',
    date: '2026-05-30',
    location: 'Marine Horizon Deck // Mumbai',
    tags: ['Drone Symphony', 'Shehnai Classics', 'Mumbai Bay'],
    imageUrl: 'https://picsum.photos/seed/dronewedding/600/650',
    themeColor: 'cyan',
    metrics: [
      { label: 'Active Drones', value: '1,200 Units' },
      { label: 'Wind Stability Lock', value: '100% Verified' },
    ],
  },
];

let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;
let isRealFirebase = false;

if (firebaseConfig && firebaseConfig.apiKey && firebaseConfig.projectId) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    isRealFirebase = true;
  } catch (e) {
    console.warn("Real Firebase failed initialization, using simulated mode", e);
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

if (isRealFirebase && db) {
  const testConnection = async () => {
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
    } catch {
      // offline fallback
    }
  };
  testConnection();
}

export { auth, db, storage, isRealFirebase };

export function isFirebaseConfigured(): boolean {
  return isRealFirebase;
}

export async function loginWithGoogle() {
  if (isRealFirebase && auth) {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider).then(res => res.user);
  } else {
    const mockUser = {
      uid: 'shanmuka_mock_admin_uid',
      email: 'guturuhemashanmuka@gmail.com',
      emailVerified: true,
      displayName: 'Shanmuka Admin (Simulated)',
    };
    localStorage.setItem('shanmuka_mock_auth', JSON.stringify(mockUser));
    return mockUser;
  }
}

export async function logoutUser() {
  if (isRealFirebase && auth) {
    await signOut(auth);
  } else {
    localStorage.removeItem('shanmuka_mock_auth');
  }
}

export async function getStoredEvents(): Promise<EventItem[]> {
  if (isRealFirebase && db) {
    try {
      const snap = await getDocs(collection(db, 'events'));
      if (snap.empty) {
        const batch: EventItem[] = [];
        for (const ev of INITIAL_EVENTS) {
          await setDoc(doc(db, 'events', ev.id), ev);
          batch.push(ev);
        }
        return batch;
      }
      return snap.docs.map(d => d.data() as EventItem);
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, 'events');
    }
  } else {
    const raw = localStorage.getItem('shanmuka_events');
    if (!raw) {
      localStorage.setItem('shanmuka_events', JSON.stringify(INITIAL_EVENTS));
      return INITIAL_EVENTS;
    }
    return JSON.parse(raw);
  }
}

export async function updateStoredEvent(event: EventItem): Promise<void> {
  if (isRealFirebase && db) {
    try {
      await setDoc(doc(db, 'events', event.id), event);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `events/${event.id}`);
    }
  } else {
    const events = await getStoredEvents();
    const updated = events.map(e => e.id === event.id ? event : e);
    localStorage.setItem('shanmuka_events', JSON.stringify(updated));
    window.dispatchEvent(new Event('shanmuka_events_updated'));
  }
}

export async function uploadMediaAsset(file: File, filename: string): Promise<string> {
  if (isRealFirebase && storage) {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `media/${Date.now()}_${filename}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        null,
        (error) => reject(error),
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        }
      );
    });
  } else {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }
}
