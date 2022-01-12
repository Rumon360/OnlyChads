import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyD_9J_iGyYbqVoC5gfC62aETuWwuw1UbMI',
  authDomain: 'chadsonly-88ec6.firebaseapp.com',
  projectId: 'chadsonly-88ec6',
  storageBucket: 'chadsonly-88ec6.appspot.com',
  messagingSenderId: '452268657126',
  appId: '1:452268657126:web:23a7919208e39d16316e27',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();

export default app;
export { db };
