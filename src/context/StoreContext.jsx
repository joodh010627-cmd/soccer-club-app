import React, { createContext, useState, useEffect, useContext } from 'react';

const StoreContext = createContext();

export const useStore = () => useContext(StoreContext);

const initialMembers = [
  { id: '1', name: '손흥민', stats: { goals: 0, assists: 0, matchesPlayed: 0 } },
  { id: '2', name: '이강인', stats: { goals: 0, assists: 0, matchesPlayed: 0 } },
  { id: '3', name: '김민재', stats: { goals: 0, assists: 0, matchesPlayed: 0 } },
];

export const StoreProvider = ({ children }) => {
  // 전역 상태
  const [isAdmin, setIsAdmin] = useState(false);
  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem('soccer_members');
    return saved ? JSON.parse(saved) : initialMembers;
  });
  const [matches, setMatches] = useState(() => {
    const saved = localStorage.getItem('soccer_matches');
    return saved ? JSON.parse(saved) : [{ id: 'm1', date: '2026-05-01', time: '19:00', opponent: 'FC 강남', status: 'scheduled' }];
  });
  const [votes, setVotes] = useState(() => {
    const saved = localStorage.getItem('soccer_votes');
    return saved ? JSON.parse(saved) : {};
  });
  const [squads, setSquads] = useState(() => {
    const saved = localStorage.getItem('soccer_squads');
    return saved ? JSON.parse(saved) : {};
  });

  // 상태 변경 시 LocalStorage 저장
  useEffect(() => {
    localStorage.setItem('soccer_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('soccer_matches', JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem('soccer_votes', JSON.stringify(votes));
  }, [votes]);

  useEffect(() => {
    localStorage.setItem('soccer_squads', JSON.stringify(squads));
  }, [squads]);

  // 회원 추가
  const addMember = (name) => {
    const newMember = {
      id: Date.now().toString(),
      name,
      stats: { goals: 0, assists: 0, matchesPlayed: 0 }
    };
    setMembers((prev) => [...prev, newMember]);
  };

  // 회원 삭제
  const removeMember = (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const handleVote = (matchId, memberId, status) => {
    setVotes(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [memberId]: status
      }
    }));
  };

  const addMatch = (newMatch) => {
    setMatches(prev => [...prev, { ...newMatch, id: Date.now().toString(), status: 'scheduled' }]);
  };

  const updateSquad = (matchId, quarter, data) => {
    setSquads(prev => ({
      ...prev,
      [matchId]: {
        ...(prev[matchId] || {}),
        [quarter]: data
      }
    }));
  };

  const finishMatch = (matchId, score, playerStats) => {
    // 1. 경기 상태 업데이트
    setMatches(prev => prev.map(m => m.id === matchId ? { ...m, status: 'completed', score } : m));
    
    // 2. 출장 수(투표 'attending' 기반) 및 스탯 업데이트
    const matchVotes = votes[matchId] || {};
    setMembers(prev => prev.map(m => {
      const isAttending = matchVotes[m.id] === 'attending';
      const statsDelta = playerStats[m.id] || { goals: 0, assists: 0 };
      
      if (!isAttending && !statsDelta.goals && !statsDelta.assists) return m;

      return {
        ...m,
        stats: {
          matchesPlayed: m.stats.matchesPlayed + (isAttending ? 1 : 0),
          goals: m.stats.goals + (statsDelta.goals || 0),
          assists: m.stats.assists + (statsDelta.assists || 0)
        }
      };
    }));
  };

  const value = {
    isAdmin,
    setIsAdmin,
    members,
    addMember,
    removeMember,
    matches,
    addMatch,
    votes,
    handleVote,
    squads,
    updateSquad,
    finishMatch,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};
