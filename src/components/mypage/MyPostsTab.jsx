// src/components/mypage/MyPostsTab.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// 💡 현재 로그인한 유저 정보를 가져오기 위해 authStore 추가
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
    fetchMyPosts(subTab);
  }, [subTab]);

  const fetchMyPosts = async (type) => {
    setLoading(true);

    try {
      /* * 🚨 [실제 백엔드 연동 시 사용할 코드] 🚨
       * 백엔드가 완성되면 아래 주석을 풀고, setTimeout 가짜 데이터를 지워주세요!
       * user.memberId 를 넘겨서 딱 "현재 로그인한 계정"이 쓴 글만 가져오게 됩니다.
       */
      // const response = await memberApi.getMyPosts(user.memberId, type);
      // setPosts(response.data);

      // --- [임시 가짜 데이터] 백엔드 연결 전까지 화면 확인용 ---
      setTimeout(() => {
        if (type === "question") {
          setPosts([
            {
              id: 101,
              title: `${user.name}님이 작성하신 전세금 반환 질문입니다.`,
              date: "2026-03-05",
              commentCount: 2,
              status: "답변완료",
            },
            {
              id: 102,
              title: "노동청 신고 절차 질문드립니다.",
              date: "2026-02-28",
              commentCount: 0,
              status: "대기중",
            },
          ]);
        } else if (type === "community") {
          setPosts([
            {
              id: 201,
              title: `${user.name}님이 쓰신 자유게시판 글!`,
              date: "2026-03-04",
              commentCount: 5,
              category: "자유수다",
            },
          ]);
        } else if (type === "mockTrial") {
          // 💡 새로 추가된 모의 판결 게시판 가짜 데이터
          setPosts([
            {
              id: 301,
              title: "층간소음 문제, 과연 누구의 잘못일까요? (모의 판결)",
              date: "2026-03-01",
              commentCount: 15,
              category: "투표진행중",
            },
            {
              id: 302,
              title: "주차장 문콕 뺑소니건 판결 결과입니다.",
              date: "2026-02-20",
              commentCount: 8,
              category: "판결완료",
            },
          ]);
        }
        setLoading(false);
      }, 500);
      // ---------------------------------------------------------
    } catch (error) {
      console.error("내 글 목록을 불러오는데 실패했습니다.", error);
      setLoading(false);
    }
  };

  // 게시글 클릭 시 해당 상세 페이지로 이동
  const handlePostClick = (id) => {
    if (subTab === "question") {
      navigate(`/question/detail/${id}`);
    } else if (subTab === "community") {
      navigate(`/community/detail/${id}`);
    } else if (subTab === "mockTrial") {
      // 💡 모의 판결 상세페이지 경로에 맞게 수정하세요.
      navigate(`/mocktrial/detail/${id}`);
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
        {/* 💡 모의 판결 게시판 탭 추가 */}
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
                  {subTab === "question" ? (
                    <span
                      className={`mypost-badge ${post.status === "답변완료" ? "badge-success" : "badge-pending"}`}
                    >
                      {post.status}
                    </span>
                  ) : subTab === "mockTrial" ? (
                    <span
                      className={`mypost-badge ${post.category === "판결완료" ? "badge-success" : "badge-normal"}`}
                    >
                      {post.category}
                    </span>
                  ) : (
                    <span className="mypost-badge badge-normal">
                      {post.category}
                    </span>
                  )}
                  <h4 className="mypost-title">{post.title}</h4>
                </div>

                <div className="mypost-item-meta">
                  <span className="mypost-date">{post.date}</span>
                  <span className="mypost-comments">
                    💬 댓글 {post.commentCount}
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
