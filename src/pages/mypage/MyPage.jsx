// src/pages/mypage/MyPage.jsx
import React, { useState } from "react";
import { useAuthStore } from "../../store/authStore.js";
import MyInfoTab from "../../components/mypage/MyInfoTab.jsx";
import EditInfoTab from "../../components/mypage/EditInfoTab.jsx";
import MyPostsTab from "../../components/mypage/MyPostsTab.jsx"; // 💡 새로 만든 컴포넌트 임포트!
import "../../styles/mypage/MyPage.css";

const MyPage = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("info");

  if (!user) {
    return <div style={{ textAlign: "center", marginTop: "100px", fontSize: "18px" }}>로그인 정보가 없습니다.</div>;
  }

  const tabs = [
    { id: "info", label: "내 정보 출력" },
    { id: "edit", label: "정보 수정" },
    { id: "posts", label: "내가 쓴 글" },
    { id: "cases", label: "사건 기록" },
  ];

  return (
    <div className="mypage-container">
      <h2 className="mypage-title">마이페이지</h2>

      <div className="mypage-main-layout">
        {/* 왼쪽 사이드바 */}
        <aside className="mypage-sidebar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`mypage-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </aside>

        {/* 오른쪽 컨텐츠 영역 */}
        <section className="mypage-content">
          {activeTab === "info" && <MyInfoTab />}
          {activeTab === "edit" && <EditInfoTab />}
          {activeTab === "posts" && <MyPostsTab />} {/* 💡 내가 쓴 글 탭 컴포넌트 추가 */}
          
          {activeTab === "cases" && (
            <div className="empty-tab-content">⚖️ 진행 중인 사건 및 과거 기록을 불러오는 중입니다.</div>
          )}
        </section>
      </div>
    </div>
  );
};

export default MyPage;