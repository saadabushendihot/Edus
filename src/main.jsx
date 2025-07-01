// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'; 
import LoginPage from './pages/LoginPage.jsx'; // تم استيراد مكون LoginPage

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} /> {/* تعيين LoginPage للمسار الجذر */}
        <Route path="/dashboard" element={<div>لوحة التحكم الرئيسية (ستأتي لاحقاً)</div>} />
        {/* يمكنك إضافة مسارات أخرى هنا لاحقاً مثل /student, /teacher-dashboard, وهكذا */}
        <Route path="*" element={<div>404 - الصفحة غير موجودة</div>} /> {/* مسار عام للصفحات غير الموجودة */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
