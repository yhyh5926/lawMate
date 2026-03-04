// src/pages/admin/AdminCommunityPage.jsx
/**
 * 파일위치: src/pages/admin/AdminCommunityPage.jsx
 * 기능전체: 전체, 법률Q&A, 모의판결 게시글을 탭으로 분류해 관리하는 통합 대시보드.
 * 수정사항: 원본 글로 바로가는 버튼과 관리자 삭제 권한 버튼을 추가했습니다.
 */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../api/adminApi";
import { ExternalLink, Trash2 } from "lucide-react"; // 아이콘

const AdminCommunityPage = () => {
  const navigate = useNavigate();
  const [boardData, setBoardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL"); // ALL, POST, QUESTION, POLL

  useEffect(() => { fetchBoardData(); }, []);

  const fetchBoardData = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getBoardList();
      const { posts, questions } = response.data.data;

      // 1. 커뮤니티(일반 게시글) 데이터 정규화
      const normalizedPosts = (posts || []).map(p => ({
        id: p.postId,
        type: 'POST',
        typeLabel: '커뮤니티',
        badgeColor: '#e0e7ff', textColor: '#3730a3',
        title: p.title,
        author: p.name || `회원 ${p.memberId}`,
        status: p.status,
        createdAt: p.createdAt,
        detailUrl: `/community/detail/${p.postId}`
      }));

      // 2. 법률 Q&A 데이터 정규화
      const normalizedQs = (questions || []).map(q => ({
        id: q.questionId,
        type: 'QUESTION',
        typeLabel: '법률 Q&A',
        badgeColor: '#fce7f3', textColor: '#831843',
        title: q.title,
        author: `회원 ${q.memberId}`,
        status: q.status,
        createdAt: q.createdAt,
        detailUrl: `/question/detail/${q.questionId}`
      }));

      // 3. 모의 판결 데이터 (추후 Poll API 연결 시 여기에 추가)
      const normalizedPolls = []; 

      // 모든 데이터를 합치고 최신 날짜순으로 정렬
      const combined = [...normalizedPosts, ...normalizedQs, ...normalizedPolls].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setBoardData(combined);
    } catch (error) {
      console.error("게시글 데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 💡 관리자용 삭제 로직
  const handleDelete = async (item) => {
    if (!window.confirm(`[${item.typeLabel}] 해당 글을 정말 삭제하시겠습니까?\n삭제 후 복구할 수 없습니다.`)) return;
    
    try {
      const res = await adminApi.deleteBoardItem({ type: item.type, id: item.id });
      if(res.data.success) {
        alert("게시글이 성공적으로 삭제(비활성) 처리되었습니다.");
        fetchBoardData(); // 목록 새로고침
      }
    } catch (e) {
      alert("삭제 처리에 실패했습니다.");
    }
  };

  // 탭 필터 적용
  const filteredData = boardData.filter(item => {
    if (activeTab === "ALL") return true;
    return item.type === activeTab;
  });

  return (
    <>
      <style>{`
        .cm-wrap { font-family: 'Pretendard', sans-serif; padding: 20px; }
        .cm-tabs { display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
        .cm-tab-btn {
          padding: 10px 20px; border: none; background: #f8fafc; color: #64748b; font-weight: 700;
          border-radius: 8px; cursor: pointer; transition: 0.2s; font-size: 14px;
        }
        .cm-tab-btn.active { background: #0f172a; color: #fff; }

        .cm-card { background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
        .cm-table { width: 100%; border-collapse: collapse; font-size: 13.5px; text-align: center; }
        .cm-table th { padding: 14px; background: #f8fafc; font-weight: 700; color: #475569; border-bottom: 1px solid #e2e8f0; }
        .cm-table td { padding: 14px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; color: #334155; }
        .cm-table tbody tr:hover { background: #f8fafc; }

        .cm-title-cell { text-align: left; font-weight: 700; color: #0f172a; }
        .badge { padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 800; white-space: nowrap; }
        
        .cm-actions { display: flex; gap: 8px; justify-content: center; }
        .btn-link { 
          display: inline-flex; align-items: center; gap: 4px; padding: 6px 10px; 
          background: #eff6ff; color: #4f46e5; border: 1px solid #c7d2fe; border-radius: 6px; 
          font-size: 11px; font-weight: 700; cursor: pointer; transition: 0.15s;
        }
        .btn-link:hover { background: #e0e7ff; }
        .btn-del { 
          display: inline-flex; align-items: center; gap: 4px; padding: 6px 10px; 
          background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; border-radius: 6px; 
          font-size: 11px; font-weight: 700; cursor: pointer; transition: 0.15s;
        }
        .btn-del:hover { background: #fee2e2; }
      `}</style>

      <div className="cm-wrap">
        {/* 탭 네비게이션 */}
        <div className="cm-tabs">
          <button className={`cm-tab-btn ${activeTab === 'ALL' ? 'active' : ''}`} onClick={() => setActiveTab('ALL')}>전체 글 보기</button>
          <button className={`cm-tab-btn ${activeTab === 'POST' ? 'active' : ''}`} onClick={() => setActiveTab('POST')}>일반 커뮤니티</button>
          <button className={`cm-tab-btn ${activeTab === 'QUESTION' ? 'active' : ''}`} onClick={() => setActiveTab('QUESTION')}>법률 상담 Q&A</button>
          <button className={`cm-tab-btn ${activeTab === 'POLL' ? 'active' : ''}`} onClick={() => setActiveTab('POLL')}>모의 판결 게시판</button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8", fontWeight: "bold" }}>데이터를 융합하는 중입니다...</div>
        ) : (
          <div className="cm-card">
            <table className="cm-table">
              <thead>
                <tr>
                  <th style={{width: "80px"}}>번호</th>
                  <th style={{width: "120px"}}>구분(게시판)</th>
                  <th style={{textAlign: "left"}}>게시글 제목</th>
                  <th style={{width: "120px"}}>작성자</th>
                  <th style={{width: "100px"}}>상태</th>
                  <th style={{width: "120px"}}>작성일</th>
                  <th style={{width: "160px"}}>관리 옵션</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? filteredData.map((item, idx) => (
                  <tr key={`${item.type}-${item.id}-${idx}`}>
                    <td style={{color: "#94a3b8", fontWeight: 700}}>#{item.id}</td>
                    <td>
                      <span className="badge" style={{ background: item.badgeColor, color: item.textColor }}>
                        {item.typeLabel}
                      </span>
                    </td>
                    <td className="cm-title-cell">{item.title}</td>
                    <td style={{fontSize: "13px", color: "#64748b"}}>{item.author}</td>
                    <td>
                      <span style={{ fontSize: "12px", fontWeight: "bold", color: item.status === "DELETED" || item.status === "CLOSED" ? "#dc2626" : "#059669" }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{fontSize: "12px", color: "#94a3b8"}}>{item.createdAt?.split('T')[0]}</td>
                    <td>
                      <div className="cm-actions">
                        {/* 💡 1. 해당 게시물로 즉시 이동하는 버튼 */}
                        <button className="btn-link" onClick={() => navigate(item.detailUrl)}>
                          <ExternalLink size={12}/> 바로가기
                        </button>
                        {/* 💡 2. 관리자 권한 즉시 삭제 버튼 */}
                        <button className="btn-del" onClick={() => handleDelete(item)}>
                          <Trash2 size={12}/> 삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="7" style={{padding: "50px", color: "#94a3b8"}}>해당 탭에 등록된 게시물이 없습니다.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminCommunityPage;