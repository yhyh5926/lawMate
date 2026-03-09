// src/pages/mypage/MyPage.jsx
import React, { useState } from "react";
import { useAuthStore } from "../../store/authStore.js";
import MyInfoTab from "../../components/mypage/MyInfoTab.jsx";
import EditInfoTab from "../../components/mypage/EditInfoTab.jsx";
import MyPostsTab from "../../components/mypage/MyPostsTab.jsx";
import LawyerMgmtTab from "../../components/mypage/LawyerMgmtTab.jsx"; 
import ClientConsultTab from "../../components/mypage/ClientConsultTab.jsx";
import CaseMgmtTab from "../../components/mypage/CaseMgmtTab.jsx"; // 💡 새로 만든 사건 기록 탭 임포트
import "../../styles/mypage/MyPage.css";
import ConsultListPage from "../mypage/ConsultListPage.jsx";

const MyPage = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("info");

  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px", fontSize: "18px" }}>
        로그인 정보가 없습니다.
      </div>
    );
  }

  // 💡 1. 기본 탭 (일반/전문 회원 공통)
  const tabs = [
    { id: "info", label: "내 정보 출력" },
    { id: "edit", label: "정보 수정" },
    { id: "posts", label: "내가 쓴 글" },
    { id: "cases", label: "사건 기록" },
    { id: "consult", label: "상담 내역" },
  ];

  // 💡 2. 변호사(LAWYER) 계정일 경우에만 '변호사 관리' 및 '받은 상담 관리' 탭 추가
  if (user.role === "LAWYER") {
    tabs.push({ id: "lawyerMgmt", label: "변호사 관리" });
    tabs.push({ id: "consultMgmt", label: "받은 상담 관리" }); 
  }

  return (
    <div className="mypage-container">
      <h2 className="mypage-title">마이페이지</h2>

      <div className="mypage-main-layout">
        {/* 왼쪽 사이드바 (메뉴) */}
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
          {activeTab === "posts" && <MyPostsTab />}
          
          {/* 💡 사건 기록 탭 렌더링 */}
          {activeTab === "cases" && <CaseMgmtTab />}
          
          {activeTab === "clientConsult" && <ClientConsultTab />}
          {activeTab === "lawyerMgmt" && <LawyerMgmtTab />}
          {activeTab === "consult" && <ConsultListPage />}
        </section>
      </div>
    </div>
  );
};

export default MyPage;