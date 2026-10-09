import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBMvwKQX5e7tadh-XGykNYvU38qhtyGGFU",
    authDomain: "balaji-dental-clinic-5c757.firebaseapp.com",
    projectId: "balaji-dental-clinic-5c757",
    storageBucket: "balaji-dental-clinic-5c757.firebasestorage.app",
    messagingSenderId: "16667774055",
    appId: "1:16667774055:web:334278ca6af605389dd8c2"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);