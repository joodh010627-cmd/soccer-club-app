import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

function Members() {
  const { members, isAdmin, addMember, removeMember } = useStore();
  const [newMemberName, setNewMemberName] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (newMemberName.trim()) {
      addMember(newMemberName.trim());
      setNewMemberName('');
    }
  };

  return (
    <>
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-headline">회원 명단</h1>
          <p className="text-body mt-2" style={{ color: 'var(--color-text-secondary)' }}>
            총 {members.length}명의 회원이 등록되어 있습니다.
          </p>
        </div>
      </header>

      {isAdmin && (
        <form onSubmit={handleAdd} className="card p-6 mb-8 flex gap-4 items-center">
          <input 
            type="text" 
            className="input" 
            placeholder="새로운 회원 이름 입력" 
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            style={{ maxWidth: '300px' }}
          />
          <button type="submit" className="btn btn-primary btn-md">등록하기</button>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {members.map(member => (
          <div key={member.id} className="card interactive p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-subhead">{member.name}</h3>
              {isAdmin && (
                <button 
                  onClick={() => removeMember(member.id)}
                  className="btn btn-sm btn-ghost"
                  style={{ color: 'var(--color-error)' }}
                  title="회원 삭제"
                >
                  삭제
                </button>
              )}
            </div>
            
            <div className="flex justify-between items-center" style={{ padding: '12px 0', borderTop: '1px solid var(--color-border)' }}>
              <div>
                <div className="text-small" style={{ color: 'var(--color-text-secondary)' }}>출장 수</div>
                <div className="text-body font-bold mt-1">{member.stats.matchesPlayed} 경기</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div className="text-small" style={{ color: 'var(--color-text-secondary)' }}>득점</div>
                <div className="text-body font-bold mt-1">{member.stats.goals} 골</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="text-small" style={{ color: 'var(--color-text-secondary)' }}>도움</div>
                <div className="text-body font-bold mt-1">{member.stats.assists} 어시</div>
              </div>
            </div>
          </div>
        ))}
        {members.length === 0 && (
           <p className="text-body" style={{ color: 'var(--color-text-secondary)' }}>등록된 회원이 없습니다.</p>
        )}
      </div>
    </>
  );
}

export default Members;
