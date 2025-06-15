import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider> {/* ✅ 감싸기 시작 */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider> {/* ✅ 감싸기 끝 */}
  </React.StrictMode>
);