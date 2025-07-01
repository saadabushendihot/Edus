// src/firebase/auth.js
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { auth, db } from "./config"; // استيراد auth و db من ملف config
import { doc, setDoc, getDoc } from "firebase/firestore";

// تسجيل الدخول بالبريد الإلكتروني وكلمة المرور
const loginWithEmailPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in with email/password:", error.message);
    throw error;
  }
};

// تسجيل الدخول باستخدام حساب Google
const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    // عند تسجيل الدخول أو التسجيل لأول مرة، تحقق من وجود المستخدم في Firestore
    await ensureUserDocExists(result.user);
    return result.user;
  } catch (error) {
    console.error("Error logging in with Google:", error.message);
    throw error;
  }
};

// تسجيل مستخدم جديد بالبريد الإلكتروني وكلمة المرور
const registerWithEmailPassword = async (email, password, name, role = "student") => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      name: name,
      role: role, // الدور الافتراضي للطالب عند التسجيل
    });
    // إنشاء مستند في مجموعة lectures للطالب الجديد
    if (role === "student") {
      await setDoc(doc(db, "lectures", user.uid), {
        uid: user.uid,
        email: user.email,
        name: name,
        course_number: "", // يمكن إضافته لاحقًا من قبل المعلم
        accepted: "pending", // حالة القبول الأولية
        teacher_notes: "",
        level1: false,
        level2: false,
        level3: false,
        level4: false,
        level5: false,
        level6: false,
        level7: false,
        exam1: false,
        exam2: false,
        exam3: false,
        exam4: false,
        exam5: false,
        exam6: false,
        exam7: false,
      });
    }
    return user;
  } catch (error) {
    console.error("Error registering user:", error.message);
    throw error;
  }
};

// التأكد من وجود مستند المستخدم في Firestore (يتم استدعاؤها بعد تسجيل الدخول)
const ensureUserDocExists = async (user) => {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // إذا لم يكن المستند موجودًا، قم بإنشائه بالدور الافتراضي 'student'
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      name: user.displayName || user.email, // استخدم الاسم المعروض أو البريد الإلكتروني
      role: "student", // الدور الافتراضي عند تسجيل الدخول لأول مرة عبر Google
    });
    // إنشاء مستند في مجموعة lectures للطالب الجديد
    await setDoc(doc(db, "lectures", user.uid), {
      uid: user.uid,
      email: user.email,
      name: user.displayName || user.email,
      course_number: "",
      accepted: "pending",
      teacher_notes: "",
      level1: false,
      level2: false,
      level3: false,
      level4: false,
      level5: false,
      level6: false,
      level7: false,
      exam1: false,
      exam2: false,
      exam3: false,
      exam4: false,
      exam5: false,
      exam6: false,
      exam7: false,
    });
  }
};

// تسجيل الخروج
const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out:", error.message);
    throw error;
  }
};

// مراقب حالة المصادقة
const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        callback({ ...user, role: userDoc.data().role });
      } else {
        console.warn("User authenticated but no Firestore document found.");
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};

export {
  loginWithEmailPassword,
  loginWithGoogle,
  registerWithEmailPassword,
  logout,
  onAuthChange,
  ensureUserDocExists
};
