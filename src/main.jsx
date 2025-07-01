// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import './index.css'; // ملف CSS العام الذي أنشأه Vite
import LoginPage from './pages/LoginPage.jsx'; // استيراد مكون صفحة تسجيل الدخول

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} /> {/* مسار صفحة تسجيل الدخول */}
        <Route path="/dashboard" element={<div>لوحة التحكم الرئيسية (ستأتي لاحقاً)</div>} />
        {/* هنا ستضيف مسارات أخرى مثل /student, /teacher-dashboard, etc. */}
        <Route path="*" element={<div>404 - الصفحة غير موجودة</div>} /> {/* مسار لأي صفحات غير معرفة */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
