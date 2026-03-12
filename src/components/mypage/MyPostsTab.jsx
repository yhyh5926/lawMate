// src/components/mypage/MyPostsTab.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { memberApi } from "../../api/memberApi"; // 💡 axios 대신 정의된 memberApi 사용
import { useAuthStore } from "../../store/authStore.js";
import "../../styles/mypage/MyPostsTab.css"; // 💡 분리된 CSS 임포트

const MyPostsTab = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [subTab, setSubTab] = useState("question");
  const [posts, setPosts] = useState([]); // 초기값은 빈 배열
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.memberId) {
      fetchMyPosts(subTab);
    }
  }, [subTab, user?.memberId]);

  const fetchMyPosts = async (type) => {
    setLoading(true);
    try {
      // 💡 [수정] memberApi.getMyPosts를 호출하여 데이터 요청
      const response = await memberApi.getMyPosts(user.memberId, type);

      // 💡 [중요] 응답 데이터가 배열인지 확인 후 세팅 (TypeError 방어)
      if (Array.isArray(response.data)) {
        setPosts(response.data);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error("내 글 목록을 불러오는데 실패했습니다.", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = (id) => {
    const routeMap = {
      question: "/question/detail/",
      community: "/community/detail/",
      // 💡 [수정] 어드민 페이지 및 타 팀원의 경로에 맞게 상세 페이지 링크를 /poll/detail/ 로 수정했습니다.
      mockTrial: "/poll/detail/", 
    };
    navigate(`${routeMap[subTab]}${id}`);
  };

  return (
    <div className="mypost-wrapper">
      <h3 className="content-title">내가 쓴 글</h3>

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
        <button
          className={`mypost-subtab-btn ${subTab === "mockTrial" ? "active" : ""}`}
          onClick={() => setSubTab("mockTrial")}
        >
          의견 조사 판결 게시판
        </button>
      </div>

      <div className="mypost-content">
        {loading ? (
          <div className="empty-tab-content">데이터를 불러오는 중입니다...</div>
        ) : !Array.isArray(posts) || posts.length === 0 ? (
          <div className="empty-tab-content">작성하신 내역이 없습니다.</div>
        ) : (
          <ul className="mypost-list">
            {posts.map((post) => (
              <li
                key={post.id}
                className="mypost-item"
                onClick={() => handlePostClick(post.id)}
              >
                <div className="mypost-item-main">
                  <span
                    className={`mypost-badge ${
                      // 💡 [수정] 모의판결 상태인 '투표종료'가 넘어올 때도 초록색 배지가 나오도록 추가
                      post.status === "답변완료" || post.status === "판결완료" || post.status === "투표종료"
                        ? "badge-success"
                        : "badge-pending"
                    }`}
                  >
                    {post.status || "대기중"}
                  </span>
                  <h4 className="mypost-title">{post.title}</h4>
                </div>

                <div className="mypost-item-meta">
                  <span className="mypost-date">{post.date}</span>
                  <span className="mypost-comments">
                    💬 댓글 {post.commentCount || 0}
                  </span>
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