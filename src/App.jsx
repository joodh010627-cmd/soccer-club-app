import React, { useState } from 'react';
import './index.css';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="app">
      <nav className="nav">
        <div className="container nav-content">
          <div className="flex items-center gap-4">
            <span className="text-subhead" style={{ color: 'var(--color-primary)' }}>⚽ SoccerClub</span>
            <div className="nav-links">
              <a href="#" className="nav-link active">홈</a>
              <a href="#" className="nav-link">스쿼드 구성</a>
              <a href="#" className="nav-link">기록실</a>
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
        <header className="mb-4">
          <h1 className="text-headline">축구 동호회 관리 시스템</h1>
          <p className="text-body" style={{ color: 'var(--color-text-secondary)', marginTop: '8px' }}>
            {isAdmin 
              ? '관리자 모드입니다. 전체 회원 관리 및 스쿼드 편성을 할 수 있습니다.' 
              : '새로운 경기 일정에 참석 투표를 하고, 기록을 확인해 보세요.'}
          </p>
        </header>

        <div className="flex gap-4 mt-8">
          <div className="card interactive p-6" style={{ flex: 1 }}>
            <h2 className="text-section mb-4">다음 경기 투표</h2>
            <p className="text-body mb-4" style={{ color: 'var(--color-text-secondary)' }}>
              2026년 5월 1일 (금) 19:00 vs FC 강남
            </p>
            <div className="flex gap-2">
              <button className="btn btn-primary btn-md">참석하기</button>
              <button className="btn btn-secondary btn-md">불참</button>
            </div>
          </div>
          
          <div className="card interactive p-6" style={{ flex: 1 }}>
            <h2 className="text-section mb-4">현재 스쿼드</h2>
            <p className="text-body mb-4" style={{ color: 'var(--color-text-secondary)' }}>
              1쿼터 스쿼드가 편성되었습니다.
            </p>
            <button className="btn btn-secondary btn-md">스쿼드 확인하기</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
