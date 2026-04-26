import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

function Home() {
  const { isAdmin, matches, votes, handleVote, members, addMatch } = useStore();
  
  // 상태: 투표자 선택
  const [selectedMemberId, setSelectedMemberId] = useState('');
  // 상태: 새 경기 등록 (Admin)
  const [newMatch, setNewMatch] = useState({ date: '', time: '', opponent: '' });

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

  return (
    <>
      <header className="mb-4">
        <h1 className="text-headline">축구 동호회 관리 시스템</h1>
        <p className="text-body" style={{ color: 'var(--color-text-secondary)', marginTop: '8px' }}>
          {isAdmin 
            ? '관리자 모드입니다. 전체 회원 관리 및 스쿼드 편성을 할 수 있습니다.' 
            : '새로운 경기 일정에 참석 투표를 하고, 기록을 확인해 보세요.'}
        </p>
      </header>

      {isAdmin && (
        <form onSubmit={onAddMatch} className="card p-6 mt-8 mb-8 flex gap-4 items-end flex-wrap">
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
                  <div className="flex gap-2">
                    <span className="chip chip-success">참석 {counts.attending}명</span>
                    <span className="chip chip-error">불참 {counts.absent}명</span>
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
    </>
  );
}

export default Home;
