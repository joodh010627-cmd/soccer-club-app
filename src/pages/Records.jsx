import React from 'react';
import { useStore } from '../context/StoreContext';

function Records() {
  const { matches, members } = useStore();
  
  const completedMatches = matches.filter(m => m.status === 'completed');

  // 기록 랭킹 정렬 (1. 출장 수, 2. 골, 3. 어시스트 기준으로 내림차순)
  const rankingByMatches = [...members].sort((a,b) => b.stats.matchesPlayed - a.stats.matchesPlayed);
  const rankingByGoals = [...members].sort((a,b) => b.stats.goals - a.stats.goals).filter(m => m.stats.goals > 0);
  const rankingByAssists = [...members].sort((a,b) => b.stats.assists - a.stats.assists).filter(m => m.stats.assists > 0);

  return (
    <>
      <header className="mb-8">
        <h1 className="text-headline">팀 및 개인 기록실</h1>
        <p className="text-body mt-2" style={{ color: 'var(--color-text-secondary)' }}>
          종료된 경기의 스코어 결과와 개인별 전체 기록을 확인합니다.
        </p>
      </header>

      <div className="flex gap-8 mt-8" style={{ flexWrap: 'wrap' }}>
        
        {/* 경기 결과 히스토리 */}
        <div style={{ flex: '1 1 400px' }}>
          <h2 className="text-section mb-4">최근 경기 결과</h2>
          <div className="flex flex-col gap-4">
            {completedMatches.length === 0 ? (
              <p className="text-body" style={{ color: 'var(--color-text-secondary)' }}>아직 종료된 경기가 없습니다.</p>
            ) : (
              completedMatches.slice().reverse().map(match => (
                <div key={match.id} className="card p-4 flex justify-between items-center bg-gray-50">
                  <div>
                    <div className="text-small" style={{ color: 'var(--color-text-secondary)' }}>{match.date}</div>
                    <div className="text-subhead mt-1">vs {match.opponent}</div>
                  </div>
                  <div className="text-section font-bold" style={{ color: 'var(--color-primary)' }}>
                    {match.score}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 랭킹보드 */}
        <div style={{ flex: '1 1 400px' }}>
          <h2 className="text-section mb-4">개인별 랭킹</h2>
          
          <div className="card p-6 mb-4">
            <h3 className="text-subhead mb-4 flex items-center gap-2">⚽ 득점 순위</h3>
            {rankingByGoals.length === 0 ? (
              <p className="text-small" style={{ color: 'var(--color-text-secondary)' }}>기록이 없습니다.</p>
            ) : (
              rankingByGoals.map((m, i) => (
                <div key={m.id} className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <span className="text-body"><span className="font-bold mr-2">{i + 1}.</span> {m.name}</span>
                  <span className="text-body font-bold">{m.stats.goals} 골</span>
                </div>
              ))
            )}
          </div>

          <div className="card p-6 mb-4">
            <h3 className="text-subhead mb-4 flex items-center gap-2">👟 도움 순위</h3>
            {rankingByAssists.length === 0 ? (
              <p className="text-small" style={{ color: 'var(--color-text-secondary)' }}>기록이 없습니다.</p>
            ) : (
              rankingByAssists.map((m, i) => (
                <div key={m.id} className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <span className="text-body"><span className="font-bold mr-2">{i + 1}.</span> {m.name}</span>
                  <span className="text-body font-bold">{m.stats.assists} 어시</span>
                </div>
              ))
            )}
          </div>

          <div className="card p-6">
            <h3 className="text-subhead mb-4 flex items-center gap-2">🏃 최다 출장 랭킹</h3>
            {rankingByMatches.length === 0 || rankingByMatches[0].stats.matchesPlayed === 0 ? (
              <p className="text-small" style={{ color: 'var(--color-text-secondary)' }}>기록이 없습니다.</p>
            ) : (
              rankingByMatches.filter(m => m.stats.matchesPlayed > 0).slice(0, 5).map((m, i) => (
                <div key={m.id} className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <span className="text-body"><span className="font-bold mr-2">{i + 1}.</span> {m.name}</span>
                  <span className="text-body font-bold">{m.stats.matchesPlayed} 경기</span>
                </div>
              ))
            )}
          </div>

        </div>

      </div>
    </>
  );
}

export default Records;
