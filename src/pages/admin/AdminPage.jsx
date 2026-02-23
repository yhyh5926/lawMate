// src/pages/admin/AdminPage.jsx


// ================================
// 관리자 페이지
// ================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth_api';
import { AUTH_USERS } from '../../mocks/auth/auth_mockData';
import { MOCK_QNA_LIST, MOCK_VOTE_LIST } from '../../mocks/community/communityData';
import '../../styles/auth/Admin.css';

const AdminPage = () => {
  const navigate = useNavigate();
  const [pendingLawyers, setPendingLawyers] = useState([]);
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState('LAWYER');
  const [userTab, setUserTab] = useState('USER');
  const [boardTab, setBoardTab] = useState('QNA');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const lawyers = await authApi.getPendingLawyers();
    const rpts = await authApi.getReports();
    setPendingLawyers(lawyers);
    setReports(rpts);
  };

  const getPostCount = (user) => {
    if (user.role === 'LAWYER') {
      return user.myAnswers?.length || 0; 
    } else {
      const qnaCount = MOCK_QNA_LIST.filter(post => post.writerName === user.name).length;
      const voteCount = MOCK_VOTE_LIST.filter(post => post.writerName === user.name).length;
      return qnaCount + voteCount; 
    }
  };

  const getUserPostsOrAnswers = (user) => {
    if (user.role === 'LAWYER') {
      return (user.myAnswers || []).map(ans => ({
        id: ans.questionId || ans.id, 
        title: ans.questionTitle,
        board: 'qna' 
      }));
    } else {
      const qnas = MOCK_QNA_LIST.filter(p => p.writerName === user.name).map(p => ({ ...p, board: 'qna' }));
      const votes = MOCK_VOTE_LIST.filter(v => v.writerName === user.name).map(v => ({ ...v, board: 'vote' }));
      return [...qnas, ...votes];
    }
  };

  const handleGoToUserBoard = (userName) => {
    setActiveTab('BOARD');
    setBoardTab('QNA');
    setSearchTerm(userName);
    setSelectedUserId(null);
  };

  const handleGoToUser = (userName) => {
    const foundUser = AUTH_USERS.find(u => u.name === userName || u.id === userName);
    if (foundUser) {
      setActiveTab('USER');
      setUserTab(foundUser.role === 'LAWYER' ? 'LAWYER' : 'USER');
      setSelectedUserId(foundUser.id);
    }
  };

  const handleBoardSearch = (e) => {
    if (e.key === 'Enter') {
      const list = boardTab === 'QNA' ? MOCK_QNA_LIST : MOCK_VOTE_LIST;
      const found = list.find(item => item.title.includes(searchTerm) || item.writerName.includes(searchTerm));
      if (found) {
        navigate(`/community/${boardTab.toLowerCase()}/${found.id}`);
      } else {
        alert("일치하는 조건의 게시글이 없습니다.");
      }
    }
  };

  const handleApprove = async (id) => {
    if (window.confirm('승인하시겠습니까?')) {
      await authApi.approveLawyer(id);
      loadData();
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('가입을 반려하시겠습니까?')) {
      if (authApi.rejectLawyer) {
        await authApi.rejectLawyer(id);
      } else {
        alert("반려 처리가 완료되었습니다.");
      }
      loadData();
    }
  };

  const handleBan = async (id) => {
    if (window.confirm('정지하시겠습니까?')) {
      await authApi.banUser(id);
      loadData();
    }
  };

  const toggleUserDetail = (userId) => {
    setSelectedUserId(selectedUserId === userId ? null : userId);
  };

  const generalUsers = AUTH_USERS.filter(u => u.role === 'USER');
  const lawyerUsers = AUTH_USERS.filter(u => u.role === 'LAWYER' && u.status === 'APPROVED');

  const filteredQna = MOCK_QNA_LIST.filter(post => post.title.includes(searchTerm) || post.writerName.includes(searchTerm));
  const filteredVote = MOCK_VOTE_LIST.filter(vote => vote.title.includes(searchTerm) || vote.writerName.includes(searchTerm));

  const renderUserDetailRow = (user, colSpan) => {
    const items = getUserPostsOrAnswers(user);
    const isLawyer = user.role === 'LAWYER';

    return (
      <tr key={`${user.id}-detail`} className="user-detail-row">
        <td colSpan={colSpan}>
          <div className="detail-inline-box">
            <div className="detail-flex-layout">
              <div className="detail-info-side">
                <div className="detail-item"><span>아이디:</span> {user.id}</div>
                <div className="detail-item"><span>이메일:</span> {user.email}</div>
                <div className="detail-item"><span>닉네임:</span> {user.nickname || '-'}</div>
                <div className="detail-item"><span>역할:</span> {user.role}</div>
                {isLawyer && (
                  <div className="detail-item"><span>자격:</span> {user.licenseName}</div>
                )}
              </div>
              
              <div className="detail-posts-side">
                <div className="posts-label">{isLawyer ? '답변글 목록' : '작성글 목록'}</div>
                <div className="posts-list">
                  {items.length > 0 ? items.map((item, idx) => (
                    <div 
                      key={`${item.id}-${idx}`} 
                      className="post-item-link" 
                      onClick={() => navigate(`/community/${item.board}/${item.id}`)}
                    >
                      {item.title}
                    </div>
                  )) : (
                    <div className="no-posts">{isLawyer ? '작성한 답변이 없습니다.' : '작성한 글이 없습니다.'}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2 className="admin-title">🛡️ 관리자 대시보드</h2>
        <p style={{ color: '#64748b' }}>사이트의 회원과 신고 내용을 관리합니다.</p>
      </div>

      <div className="admin-tab-group">
        <button className={`admin-tab-btn ${activeTab === 'LAWYER' ? 'active' : ''}`} onClick={() => { setActiveTab('LAWYER'); setSelectedUserId(null); setSearchTerm(''); }}>변호사 가입 승인 관리</button>
        <button className={`admin-tab-btn ${activeTab === 'REPORT' ? 'active' : ''}`} onClick={() => { setActiveTab('REPORT'); setSelectedUserId(null); setSearchTerm(''); }}>신고 및 제재 관리</button>
        <button className={`admin-tab-btn ${activeTab === 'USER' ? 'active' : ''}`} onClick={() => { setActiveTab('USER'); setSelectedUserId(null); setSearchTerm(''); }}>유저 관리</button>
        <button className={`admin-tab-btn ${activeTab === 'BOARD' ? 'active' : ''}`} onClick={() => { setActiveTab('BOARD'); setSelectedUserId(null); setSearchTerm(''); }}>게시판 관리</button>
      </div>

      <div className="admin-content">
        {/* ======================================= */}
        {/* 1. 변호사 가입 승인 대기 탭 */}
        {/* ======================================= */}
        {activeTab === 'LAWYER' && (
          <>
            <div className="section-title">⚖️ 변호사 가입 승인 대기</div>
            <table className="admin-table">
              <thead>
                <tr><th>이름</th><th>자격증명</th><th>학력</th><th>증빙</th><th>관리</th></tr>
              </thead>
              <tbody>
                {pendingLawyers.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', color: '#94a3b8' }}>대기 중인 요청이 없습니다.</td></tr>
                ) : (
                  pendingLawyers.map(u => (
                    <React.Fragment key={u.id}>
                      <tr>
                        <td className="clickable-name" onClick={() => toggleUserDetail(u.id)}>{u.name}</td>
                        <td>{u.licenseName}</td>
                        <td>{u.education}</td>
                        <td><button className="admin-btn" style={{ background: '#64748b' }}>이미지</button></td>
                        <td style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleApprove(u.id)} className="admin-btn btn-approve">승인</button>
                          <button onClick={() => handleReject(u.id)} className="admin-btn btn-reject">반려</button>
                        </td>
                      </tr>
                      {selectedUserId === u.id && renderUserDetailRow(u, 5)}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </>
        )}

        {/* ======================================= */}
        {/* 2. 유저 관리 탭 */}
        {/* ======================================= */}
        {activeTab === 'USER' && (
          <>
            <div className="section-title">👤 유저 관리</div>
            <div className="admin-sub-tab-group">
              <button className={`admin-sub-tab-btn ${userTab === 'USER' ? 'active' : ''}`} onClick={() => { setUserTab('USER'); setSelectedUserId(null); }}>일반 유저</button>
              <button className={`admin-sub-tab-btn ${userTab === 'LAWYER' ? 'active' : ''}`} onClick={() => { setUserTab('LAWYER'); setSelectedUserId(null); }}>변호사 유저</button>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>이름</th>
                  <th>유저 정보 (닉네임 / 이메일 / 역할)</th>
                  <th>{userTab === 'LAWYER' ? '답변 글' : '작성 글'}</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {(userTab === 'USER' ? generalUsers : lawyerUsers).map(u => (
                  <React.Fragment key={u.id}>
                    <tr>
                      <td className="clickable-name" onClick={() => toggleUserDetail(u.id)}>{u.name}</td>
                      <td>
                        <div className="user-info-cell">
                          <div className="info-nickname">{u.nickname || '-'}</div>
                          <div className="info-sub">{u.email}</div>
                          <div className="info-sub">{u.role}</div>
                        </div>
                      </td>
                      <td>
                        <button className="post-count-link" onClick={() => handleGoToUserBoard(u.name)}>
                          {getPostCount(u)}개
                        </button>
                      </td>
                      <td><button onClick={() => handleBan(u.id)} className="admin-btn btn-ban">정지</button></td>
                    </tr>
                    {selectedUserId === u.id && renderUserDetailRow(u, 4)}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* ======================================= */}
        {/* 3. 신고 및 제재 관리 탭 */}
        {/* ======================================= */}
        {activeTab === 'REPORT' && (
          <>
            <div className="section-title">🚨 신고 및 제재 관리</div>
            <table className="admin-table">
              <thead>
                <tr><th>신고대상</th><th>사유</th><th>상태</th><th>관리</th></tr>
              </thead>
              <tbody>
                {reports.map(r => (
                  <React.Fragment key={r.id}>
                    <tr>
                      <td className="clickable-name" onClick={() => handleGoToUser(r.targetUser)}>{r.targetUser}</td>
                      <td>{r.reason}</td>
                      <td><span className={`badge ${r.status === '대기' ? 'pending' : 'approved'}`}>{r.status}</span></td>
                      <td><button onClick={() => handleBan(r.targetUser)} className="admin-btn btn-ban">계정 정지</button></td>
                    </tr>
                    {selectedUserId === r.id && renderUserDetailRow(AUTH_USERS.find(u => u.id === r.targetUser) || { id: r.targetUser, name: r.targetUser, role: 'USER' }, 4)}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* ======================================= */}
        {/* 4. 게시판 관리 탭 */}
        {/* ======================================= */}
        {activeTab === 'BOARD' && (
          <>
            <div className="section-title">📋 게시판 관리</div>
            <div className="admin-board-controls">
              <div className="admin-sub-tab-group">
                <button className={`admin-sub-tab-btn ${boardTab === 'QNA' ? 'active' : ''}`} onClick={() => { setBoardTab('QNA'); setSelectedUserId(null); setSearchTerm(''); }}>법률 상담 Q&A</button>
                <button className={`admin-sub-tab-btn ${boardTab === 'VOTE' ? 'active' : ''}`} onClick={() => { setBoardTab('VOTE'); setSelectedUserId(null); setSearchTerm(''); }}>분쟁 투표</button>
              </div>
              <div className="admin-search-bar">
                <input 
                  type="text" 
                  className="admin-search-input" 
                  placeholder="제목 또는 작성자 검색 (Enter)" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleBoardSearch}
                />
              </div>
            </div>
            <table className="admin-table">
              <thead>
                {boardTab === 'QNA' ? (
                  <tr><th>제목</th><th>작성자</th><th>작성일</th><th>답변상태</th><th>관리</th></tr>
                ) : (
                  <tr><th>제목</th><th>참여수</th><th>상태</th><th>관리</th></tr>
                )}
              </thead>
              <tbody>
                {(boardTab === 'QNA' ? filteredQna : filteredVote).map(post => (
                  <tr key={post.id}>
                    <td className="clickable-name" onClick={() => navigate(`/community/${boardTab.toLowerCase()}/${post.id}`)} style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</td>
                    {boardTab === 'QNA' ? (
                      <>
                        <td className="clickable-name" onClick={() => handleGoToUser(post.writerName)}>{post.writerName}</td>
                        <td>{post.createdAt}</td>
                        <td><span className={`badge ${post.isAdopted ? 'approved' : 'pending'}`}>{post.isAdopted ? '답변완료' : '대기중'}</span></td>
                      </>
                    ) : (
                      <>
                        <td>{post.countA + post.countB}명</td>
                        <td><span className="badge approved">진행중</span></td>
                      </>
                    )}
                    <td><button className="admin-btn btn-ban">삭제</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPage;