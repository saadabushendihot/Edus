
// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getFunctions } from "firebase/functions"; // إذا كنت ستستخدم Cloud Functions مباشرةً من الكود

// بيانات تهيئة Firebase التي قدمتها
const firebaseConfig = {
  apiKey: "AIzaSyC-fKLGpFy0tmGS9fNJp3NnYjd1cgVMFEk",
  authDomain: "edus-c7313.firebaseapp.com",
  projectId: "edus-c7313",
  storageBucket: "edus-c7313.firebasestorage.app",
  messagingSenderId: "314521320352",
  appId: "1:314521320352:web:59a5a767a808937c6fc2c5"
};

// تهيئة Firebase App
const app = initializeApp(firebaseConfig);

// الحصول على مثيلات الخدمات
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
// const functions = getFunctions(app); // إذا لزم الأمر

// تصدير المثيلات لاستخدامها في جميع أنحاء التطبيق
export { app, auth, db, storage, /* functions */ };
