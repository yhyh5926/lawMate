// src/components/mypage/MyPostsTab.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MyPostsTab = () => {
  const navigate = useNavigate();
  const [subTab, setSubTab] = useState("question"); // 'question' | 'community'
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 💡 서브 탭(법률질문/커뮤니티)이 바뀔 때마다 데이터를 새로 불러옵니다.
  useEffect(() => {
    fetchMyPosts(subTab);
  }, [subTab]);

  const fetchMyPosts = (type) => {
    setLoading(true);
    // TODO: 나중에 실제 백엔드 API로 교체할 부분입니다. (예: memberApi.getMyPosts(type))
    // 지금은 눈으로 확인하기 위해 0.5초 뒤에 가짜 데이터를 세팅합니다.
    setTimeout(() => {
      if (type === "question") {
        setPosts([
          { id: 101, title: "전세금 반환 내용증명 작성 방법이 궁금합니다.", date: "2026-03-05", commentCount: 2, status: "답변완료" },
          { id: 102, title: "퇴직금을 못 받고 퇴사했습니다. 노동청 신고 절차 질문드립니다.", date: "2026-02-28", commentCount: 0, status: "대기중" },
        ]);
      } else {
        setPosts([
          { id: 201, title: "오늘 변호사님 만나고 왔는데 속이 다 시원하네요!", date: "2026-03-04", commentCount: 5, category: "자유수다" },
          { id: 202, title: "다들 소송 기간 보통 얼마나 걸리셨나요?", date: "2026-02-15", commentCount: 12, category: "정보공유" },
        ]);
      }
      setLoading(false);
    }, 500);
  };

  // 게시글 클릭 시 해당 상세 페이지로 이동
  const handlePostClick = (id) => {
    if (subTab === "question") {
      // 💡 실제 법률 질문 상세페이지 경로에 맞게 수정하세요.
      navigate(`/question/detail.do/${id}`);
    } else {
      // 💡 실제 커뮤니티 상세페이지 경로에 맞게 수정하세요.
      navigate(`/community/detail/${id}`);
    }
  };

  return (
    <div className="mypost-wrapper">
      <h3 className="content-title">내가 쓴 글</h3>

      {/* 서브 탭 버튼 영역 */}
      <div className="mypost-subtabs">
        <button 
          className={`mypost-subtab-btn ${subTab === "question" ? "active" : ""}`}
          onClick={() => setSubTab("question")}
        >
          법률 질문
        </button>
        <button 
          className={`mypost-subtab-btn ${subTab === "community" ? "active" : ""}`}
          onClick={() => setSubTab("community")}
        >
          커뮤니티 (자유게시판)
        </button>
      </div>

      {/* 게시글 리스트 영역 */}
      <div className="mypost-content">
        {loading ? (
          <div className="empty-tab-content">데이터를 불러오는 중입니다...</div>
        ) : posts.length === 0 ? (
          <div className="empty-tab-content">작성하신 내역이 없습니다.</div>
        ) : (
          <ul className="mypost-list">
            {posts.map((post) => (
              <li key={post.id} className="mypost-item" onClick={() => handlePostClick(post.id)}>
                <div className="mypost-item-main">
                  {/* 카테고리 또는 상태 뱃지 */}
                  {subTab === "question" ? (
                    <span className={`mypost-badge ${post.status === "답변완료" ? "badge-success" : "badge-pending"}`}>
                      {post.status}
                    </span>
                  ) : (
                    <span className="mypost-badge badge-normal">{post.category}</span>
                  )}
                  <h4 className="mypost-title">{post.title}</h4>
                </div>
                
                <div className="mypost-item-meta">
                  <span className="mypost-date">{post.date}</span>
                  <span className="mypost-comments">💬 댓글 {post.commentCount}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyPostsTab;