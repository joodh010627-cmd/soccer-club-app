import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

function Home() {
  const { isAdmin, matches, votes, handleVote, members, addMatch, finishMatch } = useStore();
  
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [newMatch, setNewMatch] = useState({ date: '', time: '', opponent: '' });
  
  // 경기 종료 처리 모달/폼용 상태
  const [finishingMatchId, setFinishingMatchId] = useState(null);
  const [matchScore, setMatchScore] = useState('');
  const [playerStatsUpdate, setPlayerStatsUpdate] = useState({});

  const scheduledMatches = matches.filter(m => m.status === 'scheduled');

  const onAddMatch = (e) => {
    e.preventDefault();
    if (newMatch.date && newMatch.time && newMatch.opponent) {
      addMatch(newMatch);
      setNewMatch({ date: '', time: '', opponent: '' });
    }
  };

  const getVoteCounts = (matchId) => {
    const matchVotes = votes[matchId] || {};
    let attending = 0;
    let absent = 0;
    Object.values(matchVotes).forEach(v => {
      if (v === 'attending') attending++;
      if (v === 'absent') absent++;
    });
    return { attending, absent };
  };

  const handleFinishMatch = () => {
    if (finishingMatchId && matchScore) {
      finishMatch(finishingMatchId, matchScore, playerStatsUpdate);
      setFinishingMatchId(null);
      setMatchScore('');
      setPlayerStatsUpdate({});
    }
  };

  const handleStatChange = (memberId, field, val) => {
    const num = parseInt(val) || 0;
    setPlayerStatsUpdate(prev => ({
      ...prev,
      [memberId]: { ...(prev[memberId] || { goals: 0, assists: 0 }), [field]: num }
    }));
  };

  const handleStartFinish = (matchId) => {
    const firstState = {};
    const matchVotes = votes[matchId] || {};
    members.forEach(m => {
      if (matchVotes[m.id] === 'attending') {
        firstState[m.id] = { goals: 0, assists: 0 };
      }
    });
    setPlayerStatsUpdate(firstState);
    setFinishingMatchId(matchId);
  };

  return (
    <>
      <header className="mb-4">
        <h1 className="text-headline">축구 동호회 관리 시스템</h1>
        <p className="text-body" style={{ color: 'var(--color-text-secondary)', marginTop: '8px' }}>
          {isAdmin 
            ? '관리자 모드입니다. 전체 회원 관리 및 경기 일정을 생성하고 관리할 수 있습니다.' 
            : '새로운 경기 일정에 참석 투표를 하고, 기록을 확인해 보세요.'}
        </p>
      </header>

      {isAdmin && (
        <form onSubmit={onAddMatch} className="card p-6 mt-8 flex gap-4 items-end flex-wrap">
          <div>
            <label className="text-small mb-2 block">날짜</label>
            <input type="date" className="input" value={newMatch.date} onChange={e => setNewMatch({...newMatch, date: e.target.value})} />
          </div>
          <div>
            <label className="text-small mb-2 block">시간</label>
            <input type="time" className="input" value={newMatch.time} onChange={e => setNewMatch({...newMatch, time: e.target.value})} />
          </div>
          <div>
            <label className="text-small mb-2 block">상대팀</label>
            <input type="text" className="input" placeholder="FC 강남" value={newMatch.opponent} onChange={e => setNewMatch({...newMatch, opponent: e.target.value})} />
          </div>
          <button type="submit" className="btn btn-primary btn-md">일정 추가</button>
        </form>
      )}

      {/* 경기 종료 기록 입력 모달 역할 (간단히 인라인 렌더링) */}
      {isAdmin && finishingMatchId && (
        <div className="card p-6 mt-8" style={{ border: '2px solid var(--color-primary)' }}>
          <h2 className="text-section mb-4">경기 결과 입력</h2>
          
          <div className="mb-4">
            <label className="text-small mb-2 block">스코어 (예: 3 - 1)</label>
            <input type="text" className="input" value={matchScore} onChange={e=>setMatchScore(e.target.value)} placeholder="우리팀 점수 - 상대팀 점수" style={{ maxWidth: '300px' }} />
          </div>

          <h3 className="text-subhead mb-2 mt-6">참석자 득점/도움 기록</h3>
          <p className="text-small mb-4" style={{ color: 'var(--color-neutral)' }}>해당 경기에 참석 투표를 한 인원만 표시됩니다.</p>
          
          <div className="flex gap-4 flex-wrap mb-6">
            {Object.keys(playerStatsUpdate).map(mId => {
              const m = members.find(x => x.id === mId);
              if (!m) return null;
              return (
                <div key={mId} className="p-4" style={{ backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-lg)' }}>
                  <span className="text-body font-bold block mb-2">{m.name}</span>
                  <div className="flex gap-2">
                    <input type="number" min="0" placeholder="골" className="input" style={{ width: '80px' }}
                      value={playerStatsUpdate[mId].goals || ''} onChange={e=>handleStatChange(mId, 'goals', e.target.value)} />
                    <input type="number" min="0" placeholder="도움" className="input" style={{ width: '80px' }}
                      value={playerStatsUpdate[mId].assists || ''} onChange={e=>handleStatChange(mId, 'assists', e.target.value)} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-2">
            <button onClick={handleFinishMatch} className="btn btn-primary btn-md">결과 저장 및 경기 종료</button>
            <button onClick={() => setFinishingMatchId(null)} className="btn btn-ghost btn-md">취소</button>
          </div>
        </div>
      )}

      {!finishingMatchId && (
        <div className="flex gap-4 mt-8" style={{ flexDirection: 'column', gap: '24px' }}>
          {scheduledMatches.length === 0 ? (
            <p className="text-body" style={{ color: 'var(--color-text-secondary)' }}>예정된 경기 일정이 없습니다.</p>
          ) : (
            scheduledMatches.map(match => {
              const counts = getVoteCounts(match.id);
              const myVote = selectedMemberId ? (votes[match.id]?.[selectedMemberId] || 'pending') : null;

              return (
                <div key={match.id} className="card interactive p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-section mb-1">vs {match.opponent}</h2>
                      <p className="text-body" style={{ color: 'var(--color-text-secondary)' }}>
                        {match.date} {match.time}
                      </p>
                    </div>
                    <div className="flex gap-2" style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
                      <div className="flex gap-2">
                        <span className="chip chip-success">참석 {counts.attending}명</span>
                        <span className="chip chip-error">불참 {counts.absent}명</span>
                      </div>
                      {isAdmin && (
                        <button onClick={() => handleStartFinish(match.id)} className="btn btn-sm btn-secondary mt-2">
                          경기 종료 및 스코어 입력
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--color-border)' }}>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-small font-bold">내 권한으로 투표하기:</span>
                      <select 
                        className="input" 
                        style={{ width: '200px', display: 'inline-block' }}
                        value={selectedMemberId}
                        onChange={e => setSelectedMemberId(e.target.value)}
                      >
                        <option value="">본인을 선택하세요</option>
                        {members.map(m => (
                           <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => selectedMemberId && handleVote(match.id, selectedMemberId, 'attending')}
                        className={`btn btn-md ${myVote === 'attending' ? 'btn-primary' : 'btn-secondary'}`}
                        disabled={!selectedMemberId}
                      >
                        참석하기
                      </button>
                      <button 
                        onClick={() => selectedMemberId && handleVote(match.id, selectedMemberId, 'absent')}
                        className={`btn btn-md ${myVote === 'absent' ? 'btn-destructive' : 'btn-secondary'}`}
                        disabled={!selectedMemberId}
                      >
                        불참
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </>
  );
}

export default Home;
