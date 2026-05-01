import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

async function fetchTimelineData() {
    try {
        const q = query(collection(db, 'timeline'), orderBy('year', 'desc'));
        const querySnapshot = await getDocs(q);

        const seen = new Set();
        const timelineData = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const identifier = `${data.year}-${data.subtitle}`;

            if (!seen.has(identifier)) {
                seen.add(identifier);
                timelineData.push(data);
            }
        });

        return timelineData;
    } catch (error) {
        console.error('Error fetching data from Firestore:', error);
        throw error; // Re-throw the error after logging it
    }
}

export default fetchTimelineData;
