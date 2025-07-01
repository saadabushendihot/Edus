// src/firebase/firestore.js
import { db } from "./config"; // استيراد db من ملف config
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot, // للاستماع للتغييرات في الوقت الفعلي
  orderBy
} from "firebase/firestore";

// دالة عامة لإضافة مستند جديد
const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
};

// دالة عامة لتعيين/تحديث مستند بمعرف محدد (بما في ذلك الإنشاء إذا لم يكن موجودًا)
const setDocument = async (collectionName, docId, data) => {
  try {
    await setDoc(doc(db, collectionName, docId), data, { merge: true }); // {merge: true} لتحديث البيانات الموجودة ودمج الجديدة
    return { id: docId, ...data };
  } catch (error) {
    console.error("Error setting document:", error);
    throw error;
  }
};

// دالة عامة لتحديث مستند موجود
const updateDocument = async (collectionName, docId, data) => {
  try {
    await updateDoc(doc(db, collectionName, docId), data);
    return { id: docId, ...data };
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
};

// دالة عامة لجلب مستند واحد بمعرفه
const getDocument = async (collectionName, docId) => {
  try {
    const docSnap = await getDoc(doc(db, collectionName, docId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
};

// دالة عامة لجلب جميع المستندات من مجموعة (مع إمكانية الفلترة والترتيب)
const getCollection = async (collectionName, queries = [], orderByField = null, orderDirection = "asc") => {
  try {
    let q = collection(db, collectionName);
    queries.forEach(qParam => {
      q = query(q, where(qParam.field, qParam.operator, qParam.value));
    });
    if (orderByField) {
      q = query(q, orderBy(orderByField, orderDirection));
    }
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data;
  } catch (error) {
    console.error("Error getting collection:", error);
    throw error;
  }
};

// دالة عامة لحذف مستند
const deleteDocument = async (collectionName, docId) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    return true;
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};

// دالة للاستماع للتغييرات في الوقت الفعلي لمجموعة
const listenToCollection = (collectionName, callback, queries = [], orderByField = null, orderDirection = "asc") => {
  let q = collection(db, collectionName);
  queries.forEach(qParam => {
    q = query(q, where(qParam.field, qParam.operator, qParam.value));
  });
  if (orderByField) {
    q = query(q, orderBy(orderByField, orderDirection));
  }
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const data = [];
    snapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    callback(data);
  }, (error) => {
    console.error("Error listening to collection:", error);
  });
  return unsubscribe; // أعد دالة إلغاء الاشتراك
};

// دالة للاستماع للتغييرات في الوقت الفعلي لمستند واحد
const listenToDocument = (collectionName, docId, callback) => {
  const docRef = doc(db, collectionName, docId);
  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() });
    } else {
      callback(null);
    }
  }, (error) => {
    console.error("Error listening to document:", error);
  });
  return unsubscribe;
};


export {
  addDocument,
  setDocument,
  updateDocument,
  getDocument,
  getCollection,
  deleteDocument,
  listenToCollection,
  listenToDocument
};
