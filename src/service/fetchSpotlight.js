import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from '../firebase';

// Firestore `spotlight` collection — featured project for the Work section.
// Expected doc shape:
//   {
//     name: string,
//     year: string,
//     lang: string,
//     stars: number | null,
//     desc: string,
//     active: boolean,         // only the latest active doc is shown
//     order: number,           // tiebreaker, descending
//     featured: {
//       status: string,
//       role: string,
//       collaborators: string,
//       problem: string,
//       approach: string,
//       outcome: string,
//       stack: string[],
//     }
//   }
// Returns null if no active spotlight is configured.
async function fetchSpotlight() {
  try {
    const q = query(
      collection(db, 'spotlight'),
      where('active', '==', true),
      orderBy('order', 'desc'),
      limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const data = snap.docs[0].data();
    if (!data.featured) return null;
    return data;
  } catch (error) {
    // Most common cause: collection doesn't exist yet, or composite index
    // missing. Don't surface this to the user — just hide the spotlight.
    console.warn('Spotlight not available:', error?.message || error);
    return null;
  }
}

export default fetchSpotlight;
