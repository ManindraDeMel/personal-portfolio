import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

// Firestore `timeline` collection.
// Expected doc shape (new):  { year, subtitle, points: string[] }
// Backwards-compat (old):    { year, subtitle, achievements: string[] (HTML) }
// Both shapes are normalized into `{ year, subtitle, points: string[] }`.
async function fetchTimelineData() {
  try {
    const q = query(collection(db, 'timeline'), orderBy('year', 'desc'));
    const snap = await getDocs(q);

    const seen = new Set();
    const out = [];

    snap.forEach((doc) => {
      const data = doc.data();
      const id = `${data.year}-${data.subtitle}`;
      if (seen.has(id)) return;
      seen.add(id);

      const points = Array.isArray(data.points)
        ? data.points
        : Array.isArray(data.achievements)
          ? data.achievements
          : [];

      out.push({
        year: data.year,
        subtitle: data.subtitle,
        points,
      });
    });

    return out;
  } catch (error) {
    console.error('Error fetching timeline from Firestore:', error);
    return [];
  }
}

export default fetchTimelineData;
