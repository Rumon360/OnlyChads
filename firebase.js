import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {

};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();

export default app;
export { db };
