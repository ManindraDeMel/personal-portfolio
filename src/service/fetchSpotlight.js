import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase';

// Firestore `spotlight` collection — featured projects rendered above the
// Selected Work table. Each active doc renders as a Featured card, ordered
// descending by `order`.
//
// Doc shape:
//   {
//     name: string,
//     year: string,
//     lang: string,
//     stars: number | null,
//     desc: string,
//     url?: string,
//     active: boolean,
//     order: number,
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
//
// Required composite index: (active ASC, order DESC). Firestore prints the
// index-creation URL in the console the first time the query runs.
async function fetchSpotlight() {
  try {
    const q = query(
      collection(db, 'spotlight'),
      where('active', '==', true),
      orderBy('order', 'desc')
    );
    const snap = await getDocs(q);
    if (snap.empty) return [];
    return snap.docs.map((d) => d.data()).filter((data) => data.featured);
  } catch (error) {
    console.warn('Spotlight not available:', error?.message || error);
    return [];
  }
}

export default fetchSpotlight;
