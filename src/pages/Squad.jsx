import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

const FORMATIONS = {
  '4-3-3': [
    { id: 'GK', top: '90%', left: '50%' },
    { id: 'LB', top: '70%', left: '20%' },
    { id: 'LCB', top: '70%', left: '40%' },
    { id: 'RCB', top: '70%', left: '60%' },
    { id: 'RB', top: '70%', left: '80%' },
    { id: 'LCM', top: '45%', left: '25%' },
    { id: 'CM', top: '45%', left: '50%' },
    { id: 'RCM', top: '45%', left: '75%' },
    { id: 'LW', top: '20%', left: '25%' },
    { id: 'ST', top: '20%', left: '50%' },
    { id: 'RW', top: '20%', left: '75%' },
  ],
  '4-2-3-1': [
    { id: 'GK', top: '90%', left: '50%' },
    { id: 'LB', top: '70%', left: '20%' },
    { id: 'LCB', top: '70%', left: '40%' },
    { id: 'RCB', top: '70%', left: '60%' },
    { id: 'RB', top: '70%', left: '80%' },
    { id: 'LDM', top: '55%', left: '35%' },
    { id: 'RDM', top: '55%', left: '65%' },
    { id: 'LM', top: '35%', left: '20%' },
    { id: 'CAM', top: '35%', left: '50%' },
    { id: 'RM', top: '35%', left: '80%' },
    { id: 'ST', top: '15%', left: '50%' },
  ]
};

function Squad() {
  const { isAdmin, matches, votes, members, squads, updateSquad } = useStore();
  const scheduledMatches = matches.filter(m => m.status === 'scheduled');

  const [selectedMatch, setSelectedMatch] = useState(scheduledMatches[0]?.id || '');
  const [selectedQuarter, setSelectedQuarter] = useState('q1');
  const [selectedFormation, setSelectedFormation] = useState('4-3-3');
  
  // 편성 대기중인 선수 선택 (클릭 기반 플레이스먼트용)
  const [selectedPlayerToPlace, setSelectedPlayerToPlace] = useState(null);

  if (scheduledMatches.length === 0) {
    return <div className="text-section mt-8 container">다가오는 경기가 없습니다.</div>;
  }

  const matchVotes = votes[selectedMatch] || {};
  const attendingMemberIds = Object.keys(matchVotes).filter(vid => matchVotes[vid] === 'attending');
  const attendingMembers = members.filter(m => attendingMemberIds.includes(m.id));

  // 현재 스쿼드 상태 플럭스
  const currentMatchSquads = squads[selectedMatch] || {};
  const currentQuarterSquad = currentMatchSquads[selectedQuarter] || { formation: selectedFormation, players: {} };
  const currentPlayers = currentQuarterSquad.players || {};

  const handleSpotClick = (spotId) => {
    if (!isAdmin) return;
    
    // 만약 이미 배치할 선수가 선택되어 있다면 배치
    if (selectedPlayerToPlace) {
      updateSquad(selectedMatch, selectedQuarter, {
        formation: selectedFormation,
        players: { ...currentPlayers, [spotId]: selectedPlayerToPlace.id }
      });
      setSelectedPlayerToPlace(null);
    } else {
      // 선수가 선택되지 않은 상태로 덱 클릭하면 해당 자리 선수 제거 (배치 해제)
      if (currentPlayers[spotId]) {
        const newPlayers = { ...currentPlayers };
        delete newPlayers[spotId];
        updateSquad(selectedMatch, selectedQuarter, {
          formation: selectedFormation,
          players: newPlayers
        });
      }
    }
  };

  const positions = FORMATIONS[selectedFormation];

  return (
    <>
      <header className="mb-4">
        <h1 className="text-headline">스쿼드 편성</h1>
        <p className="text-body mt-2" style={{ color: 'var(--color-text-secondary)' }}>
          {isAdmin ? '선수를 클릭하고 필드의 위치를 클릭하여 스쿼드를 배치하세요.' : '현재 편성된 분기별 스쿼드를 확인합니다.'}
        </p>
      </header>

      <div className="card p-4 mb-4 flex gap-4 items-center">
        <select className="input" value={selectedMatch} onChange={e => setSelectedMatch(e.target.value)} style={{ width: '250px' }}>
          {scheduledMatches.map(m => (
            <option key={m.id} value={m.id}>{m.date} vs {m.opponent}</option>
          ))}
        </select>

        <div className="flex gap-2">
          {['q1', 'q2', 'q3', 'q4'].map((q, i) => (
            <button 
              key={q} 
              className={`btn btn-sm ${selectedQuarter === q ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedQuarter(q)}
            >
              {i + 1}쿼터
            </button>
          ))}
        </div>

        {isAdmin && (
          <select 
            className="input" 
            value={selectedFormation} 
            onChange={e => {
              setSelectedFormation(e.target.value);
              // 포메이션 변경 시 기존 배치 초기화
              updateSquad(selectedMatch, selectedQuarter, { formation: e.target.value, players: {} });
            }} 
            style={{ width: '150px', marginLeft: 'auto' }}
          >
            {Object.keys(FORMATIONS).map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        )}
      </div>

      <div className="flex gap-8 mt-8" style={{ flexWrap: 'wrap' }}>
        {/* 축구장 섹션 */}
        <div style={{ flex: '1 1 500px' }}>
          <div className="field">
            <div className="field-line-center"></div>
            <div className="field-circle-center"></div>
            <div className="field-box-top"></div>
            <div className="field-box-bottom"></div>

            {positions.map(pos => {
              const playerId = currentPlayers[pos.id];
              const player = members.find(m => m.id === playerId);
              
              return (
                <div 
                  key={pos.id} 
                  className={`player-spot ${player ? 'filled' : ''} ${!player && isAdmin && selectedPlayerToPlace ? 'selected' : ''}`}
                  style={{ top: pos.top, left: pos.left }}
                  onClick={() => handleSpotClick(pos.id)}
                >
                  {player ? (
                    <span className="player-name">{player.name.substring(0, 3)}</span>
                  ) : (
                    <span className="text-small" style={{ color: 'rgba(255,255,255,0.8)' }}>+</span>
                  )}
                  <div className="player-position-label">{pos.id}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 참석자 리스트 섹션 (관리자인 경우에만 상호작용 가능) */}
        <div style={{ flex: '1 1 300px' }}>
          <div className="card p-6 h-full">
            <h3 className="text-section mb-4">참석자 명단</h3>
            <p className="text-small mb-4" style={{ color: 'var(--color-text-secondary)' }}>
              총 {attendingMembers.length}명 참석 대기 중
            </p>
            
            <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
              {attendingMembers.map(m => {
                const isPlaced = Object.values(currentPlayers).includes(m.id);
                const isSelected = selectedPlayerToPlace?.id === m.id;
                
                return (
                  <button
                    key={m.id}
                    disabled={isPlaced && isAdmin}
                    onClick={() => isAdmin && setSelectedPlayerToPlace(isSelected ? null : m)}
                    className={`chip ${isPlaced ? 'chip-default' : isSelected ? 'chip-active' : 'chip-success'}`}
                    style={{ 
                      cursor: (isPlaced || !isAdmin) ? 'not-allowed' : 'pointer', 
                      opacity: isPlaced ? 0.5 : 1,
                      padding: '8px 16px', fontSize: '14px'
                    }}
                  >
                    {m.name} {isPlaced && '(배치됨)'}
                  </button>
                );
              })}
              {attendingMembers.length === 0 && (
                <p className="text-body w-full text-center py-4" style={{ color: 'var(--color-text-secondary)' }}>
                  아직 참석 투표한 회원이 없습니다.
                </p>
              )}
            </div>
            {isAdmin && (
              <div className="mt-8 p-4" style={{ backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-lg)' }}>
                <p className="text-small" style={{ color: 'var(--color-text-secondary)' }}>
                  💡 <strong>배치 방법:</strong> 위 참석자 목록에서 선수를 클릭한 뒤, 좌측 필드의 원하는 포지션을 클릭하세요. 잘못 배치한 경우 필드의 선수를 다시 클릭하면 해제됩니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Squad;
