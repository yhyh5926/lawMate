import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../zustand/auth_store';
import { authApi } from '../../api/auth_api';
import '../../styles/auth/MyPage.css';

const MyPageMain = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  if (!user) return <div style={{textAlign:'center', marginTop:'100px'}}>로그인이 필요합니다.</div>;

  const handleLogout = () => { logout(); navigate('/'); };
  const handleLeave = async () => {
    if(window.confirm("정말 탈퇴하시겠습니까?")) {
      await authApi.leaveUser(user.id);
      logout(); navigate('/');
    }
  };

  return (
    <div className="mypage-container">
      <div className="mypage-header">
        <h2 className="mypage-title">마이페이지 ({user.role === 'LAWYER' ? '변호사' : '일반'})</h2>
        <span style={{color:'#64748b'}}>나의 활동과 정보를 관리하세요.</span>
      </div>
      
      {/* 그리드 컨테이너 */}
      <div className="mypage-grid">
        
        {/* [1행 1열] 이름 */}
        <div className="mypage-card area-profile">
          <span className="card-label">이름</span>
          <span className="card-content" style={{fontSize:'20px', fontWeight:'bold'}}>
            {user.name} <span style={{fontSize:'16px', fontWeight:'normal'}}>({user.nickname})</span>
          </span>
        </div>

        {/* [1행 2열] 이메일 */}
        <div className="mypage-card area-email">
          <span className="card-label">이메일</span>
          <span className="card-content">{user.email}</span>
        </div>

        {/* [2행 전체] 변호사 정보 OR 찜한 변호사 */}
        <div className="mypage-card area-full text-left">
          <span className="card-label" style={{textAlign:'center'}}>
            {user.role === 'USER' ? '찜한 변호사 (최대 5명)' : '변호사 자격 및 사무실 정보'}
          </span>
          <div className="card-content" style={{marginTop:'10px'}}>
            {user.role === 'USER' ? (
               <div style={{textAlign:'center'}}>
                 {user.scraps?.length > 0 ? user.scraps.map((s, i) => (
                    <span key={i} style={{margin:'0 10px', color:'#2563eb', fontWeight:'600'}}>#{s}</span>
                 )) : "찜한 변호사가 없습니다."}
               </div>
            ) : (
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px', textAlign:'left'}}>
                <div><strong>자격증:</strong> {user.licenseName}</div>
                <div><strong>학력:</strong> {user.education}</div>
                <div><strong>전화번호:</strong> {user.phone || '입력되지 않음'}</div>
                <div><strong>사무실:</strong> {user.office || '입력되지 않음'}</div>
              </div>
            )}
          </div>
        </div>

        {/* [3행 전체] 내 사건 현황 OR 나의 답변 */}
        <div className="mypage-card area-full">
          <span className="card-label">
            {user.role === 'USER' ? '내 사건 현황 (최대 5개)' : '나의 답변 관리'}
          </span>
          <div style={{marginTop:'10px', textAlign:'left'}}>
            {user.role === 'USER' ? (
              user.myCases?.length > 0 ? user.myCases.map(c => (
                <div key={c.id} className="list-item">
                  <span style={{fontWeight:'bold', color:'#2563eb', marginRight:'10px'}}>[{c.status}]</span>
                  {c.title}
                </div>
              )) : <div style={{textAlign:'center', color:'#94a3b8'}}>진행 중인 사건이 없습니다.</div>
            ) : (
              user.myAnswers?.length > 0 ? user.myAnswers.map(a => (
                <div key={a.id} className="list-item">
                  <span style={{fontWeight:'bold', color:'#2563eb', marginRight:'10px'}}>[답변]</span>
                  {a.questionTitle} 
                  <span style={{float:'right', fontSize:'12px', color: a.selected ? 'green':'gray'}}>
                    {a.selected ? '채택됨' : '대기중'}
                  </span>
                </div>
              )) : <div style={{textAlign:'center', color:'#94a3b8'}}>작성한 답변이 없습니다.</div>
            )}
          </div>
        </div>

        {/* [4행 전체] 내가 쓴 글 */}
        <div className="mypage-card area-full">
          <span className="card-label">내가 쓴 글 (최대 5개)</span>
          <div style={{marginTop:'10px', textAlign:'left'}}>
             {user.myPosts?.length > 0 ? user.myPosts.map(p => (
               <div key={p.id} className="list-item">
                 [{p.type}] {p.title}
               </div>
             )) : <div style={{textAlign:'center', color:'#94a3b8'}}>작성한 글이 없습니다.</div>}
          </div>
        </div>

        {/* [5행 전체] 관심 내역 */}
        <div className="mypage-card area-profile" style={{gridColumn:'1 / 3'}}>
           <span className="card-label">관심 내역 / 태그</span>
           <span className="card-content">{user.interests?.join(', ') || '없음'}</span>
        </div>

      </div> 

      {/* 버튼 그룹 */}
      <div className="mypage-actions">
        <button onClick={() => navigate('/mypage/edit')} className="action-btn btn-edit">정보 수정</button>
        <button onClick={handleLogout} className="action-btn btn-logout">로그아웃</button>
        <button onClick={handleLeave} className="action-btn btn-leave">회원탈퇴</button>
      </div>
    </div>
  );
};

export default MyPageMain;