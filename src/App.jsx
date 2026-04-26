import React from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from './context/StoreContext';
import './index.css';

// Pages
import Home from './pages/Home';
import Members from './pages/Members';

function App() {
  const { isAdmin, setIsAdmin } = useStore();
  const location = useLocation();

  return (
    <div className="app">
      <nav className="nav">
        <div className="container nav-content">
          <div className="flex items-center gap-4">
            <span className="text-subhead" style={{ color: 'var(--color-primary)' }}>⚽ SoccerClub</span>
            <div className="nav-links">
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>홈</Link>
              <Link to="/members" className={`nav-link ${location.pathname === '/members' ? 'active' : ''}`}>회원 명단</Link>
              <Link to="/squad" className={`nav-link ${location.pathname === '/squad' ? 'active' : ''}`}>스쿼드 편성</Link>
              <Link to="/records" className={`nav-link ${location.pathname === '/records' ? 'active' : ''}`}>기록실</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-small" style={{ color: 'var(--color-text-secondary)' }}>회원 모드</span>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={isAdmin} 
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                />
              </label>
              <span className="text-small" style={{ color: isAdmin ? 'var(--color-primary)' : 'var(--color-text-secondary)', fontWeight: isAdmin ? 600 : 400 }}>관리자 모드</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '9999px', backgroundColor: 'var(--color-border)' }}></div>
          </div>
        </div>
      </nav>

      <main className="container mt-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/members" element={<Members />} />
          <Route path="/squad" element={<div className="text-section mt-8">스쿼드 기능 개발 중...</div>} />
          <Route path="/records" element={<div className="text-section mt-8">기록실 기능 개발 중...</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
