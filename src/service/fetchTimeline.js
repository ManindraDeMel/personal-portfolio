// fetchTimelineData.js
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

async function fetchTimelineData() {
    const querySnapshot = await getDocs(collection(db, 'timeline'));
    const timelineData = querySnapshot.docs.map(doc => doc.data());
    return timelineData;
}

export default fetchTimelineData;
