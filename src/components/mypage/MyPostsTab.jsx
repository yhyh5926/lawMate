/**
 * 파일 위치: src/components/mypage/MyPostsTab.jsx
 * 수정사항: setTimeout 가짜 데이터를 삭제하고 axios를 이용해 백엔드 DB 데이터를 실시간으로 연동합니다.
 * 기존 주석 및 서브탭 구조를 100% 유지했습니다.
 */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // 💡 실제 연동을 위해 axios 추가
import { useAuthStore } from "../../store/authStore.js";

const MyPostsTab = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore(); // 로그인한 유저 정보 빼오기

  // 서브 탭 3개: question(법률질문), community(자유게시판), mockTrial(모의판결)
  const [subTab, setSubTab] = useState("question");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 서브 탭이 바뀔 때마다 데이터를 새로 불러옵니다.
  useEffect(() => {
    if (user?.memberId) {
      fetchMyPosts(subTab);
    }
  }, [subTab, user?.memberId]);

  const fetchMyPosts = async (type) => {
    setLoading(true);
    try {
      // 💡 [수정] 가짜 데이터(setTimeout)를 지우고 실제 API를 호출합니다.
      // XML의 findMyPosts 쿼리와 연결된 백엔드 엔드포인트를 호출합니다.
      const response = await axios.get(`/api/mypage/posts/${user.memberId}`, {
        params: { type: type } // question, community, mockTrial 전달
      });
      
      // XML에서 별칭(AS)으로 준 "id", "title", "date", "commentCount", "status"가 담깁니다.
      setPosts(response.data);
    } catch (error) {
      console.error("내 글 목록을 불러오는데 실패했습니다.", error);
      setPosts([]); // 에러 발생 시 목록 비우기
    } finally {
      setLoading(false);
    }
  };

  // 게시글 클릭 시 해당 상세 페이지로 이동
  const handlePostClick = (id) => {
    const routeMap = {
      question: "/question/detail/",
      community: "/community/detail/",
      mockTrial: "/mocktrial/detail/",
    };
    navigate(`${routeMap[subTab]}${id}`);
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
        <button
          className={`mypost-subtab-btn ${subTab === "mockTrial" ? "active" : ""}`}
          onClick={() => setSubTab("mockTrial")}
        >
          모의 판결 게시판
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
              <li
                key={post.id}
                className="mypost-item"
                onClick={() => handlePostClick(post.id)}
              >
                <div className="mypost-item-main">
                  {/* 카테고리 또는 상태 뱃지 */}
                  <span
                    className={`mypost-badge ${
                      post.status === "답변완료" || post.status === "판결완료"
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