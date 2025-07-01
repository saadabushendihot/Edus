// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import {
  loginWithEmailPassword,
  loginWithGoogle,
  registerWithEmailPassword
} from '../firebase/auth'; // استيراد وظائف المصادقة
import { useNavigate } from 'react-router-dom'; // لاستخدام التوجيه في React Router

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // لاسم المستخدم عند التسجيل
  const [isRegistering, setIsRegistering] = useState(false); // للتبديل بين تسجيل الدخول والتسجيل
  const [error, setError] = useState(null); // لعرض رسائل الخطأ
  const navigate = useNavigate(); // Hook من React Router DOM

  const handleLogin = async (e) => {
    e.preventDefault(); // منع إعادة تحميل الصفحة
    setError(null); // مسح الأخطاء السابقة
    try {
      const user = await loginWithEmailPassword(email, password);
      console.log('User logged in:', user);
      // هنا يمكننا جلب دور المستخدم وتحويله بناءً عليه
      // مبدئيا، سنفترض أنه سينتقل إلى صفحة رئيسية
      navigate('/dashboard'); // سيتم التعامل مع التوجيه بناءً على الدور لاحقاً
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      const user = await loginWithGoogle();
      console.log('User logged in with Google:', user);
      navigate('/dashboard'); // سيتم التعامل مع التوجيه بناءً على الدور لاحقاً
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // الدور الافتراضي 'student' للتسجيل الجديد
      const user = await registerWithEmailPassword(email, password, name, 'student');
      console.log('User registered:', user);
      navigate('/dashboard'); // سيتم التعامل مع التوجيه بناءً على الدور لاحقاً
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>{isRegistering ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
          {isRegistering && (
            <div style={styles.formGroup}>
              <label htmlFor="name">الاسم:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={styles.input}
              />
            </div>
          )}
          <div style={styles.formGroup}>
            <label htmlFor="email">البريد الإلكتروني:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="password">كلمة المرور:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>
            {isRegistering ? 'تسجيل' : 'تسجيل الدخول'}
          </button>
        </form>
        <button
          onClick={handleGoogleLogin}
          style={{ ...styles.button, ...styles.googleButton }}
        >
          تسجيل الدخول باستخدام Google
        </button>
        <p style={styles.toggleText}>
          {isRegistering ? 'لديك حساب بالفعل؟' : 'لا تملك حسابًا؟'}
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError(null);
            }}
            style={styles.toggleButton}
          >
            {isRegistering ? 'تسجيل الدخول' : 'سجل الآن'}
          </button>
        </p>
      </div>
    </div>
  );
}

// بعض الأنماط الأساسية (يمكن نقلها إلى ملف CSS لاحقًا)
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    width: '100%',
    maxWidth: '400px',
  },
  h2: {
    marginBottom: '20px',
    color: '#333',
  },
  formGroup: {
    marginBottom: '15px',
    textAlign: 'left',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    width: 'calc(100% - 20px)',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background-color 0.3s ease',
  },
  googleButton: {
    backgroundColor: '#db4437', // لون أحمر لجوجل
  },
  toggleText: {
    marginTop: '20px',
    color: '#666',
  },
  toggleButton: {
    background: 'none',
    border: 'none',
    color: '#007bff',
    cursor: 'pointer',
    fontSize: '16px',
    marginLeft: '5px',
    padding: '0',
    textDecoration: 'underline',
  },
  error: {
    color: 'red',
    marginBottom: '15px',
  },
};

export default LoginPage;
