import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase';
import RESEARCH_DEFAULTS from '../data/research';

// Firestore `research` collection — featured ML / academic projects.
// Doc shape: see src/data/research.js for the canonical fields.
//
// The collection acts as an override surface: if Firestore is configured and
// has active docs, those are returned. Otherwise the local defaults are used
// so the section renders even before Firestore is populated.
//
// Required composite index: (active ASC, order DESC). Firestore prints the
// index-creation URL in the console the first time the query runs.
async function fetchResearch() {
  try {
    const q = query(
      collection(db, 'research'),
      where('active', '==', true),
      orderBy('order', 'desc')
    );
    const snap = await getDocs(q);
    if (snap.empty) return RESEARCH_DEFAULTS;
    const docs = snap.docs.map((d) => ({ slug: d.id, ...d.data() }));
    // De-dupe by slug, preferring Firestore over local defaults.
    const seen = new Set(docs.map((d) => d.slug));
    const merged = [...docs];
    for (const def of RESEARCH_DEFAULTS) {
      if (!seen.has(def.slug)) merged.push(def);
    }
    return merged.sort((a, b) => (b.order ?? 0) - (a.order ?? 0));
  } catch (error) {
    console.warn('Research not available, using local defaults:', error?.message || error);
    return RESEARCH_DEFAULTS;
  }
}

export default fetchResearch;
