// src/pages/mypage/MyPage.jsx
import React, { useState } from "react";
import { useAuthStore } from "../../store/authStore.js";
import MyInfoTab from "../../components/mypage/MyInfoTab.jsx";
import EditInfoTab from "../../components/mypage/EditInfoTab.jsx";
import MyPostsTab from "../../components/mypage/MyPostsTab.jsx";
import LawyerMgmtTab from "../../components/mypage/LawyerMgmtTab.jsx"; 
import ClientConsultTab from "../../components/mypage/ClientConsultTab.jsx";
import CaseMgmtTab from "../../components/mypage/CaseMgmtTab.jsx"; 
import ConsultListPage from "../mypage/ConsultListPage.jsx";
// 💡 [추가] 아까 새로 만든 변호사용 접수 관리(사건 목록) 컴포넌트 임포트
import LawyerReceptionTab from "../../components/mypage/LawyerReceptionTab.jsx"; 
import "../../styles/mypage/MyPage.css";

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

  // 💡 2. 변호사(LAWYER) 계정일 경우 탭 추가
  // user.role 이나 user.memberType 둘 다 대응할 수 있게 방어 로직 추가
  if (user.role === "LAWYER" || user.memberType === "LAWYER") {
    tabs.push({ id: "lawyerMgmt", label: "변호사 관리" });
    // 💡 [수정] 받은 상담 관리 -> 접수 관리로 이름 변경 및 id 변경
    tabs.push({ id: "receptionMgmt", label: "접수 관리" }); 
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
          {activeTab === "cases" && <CaseMgmtTab />}
          {activeTab === "clientConsult" && <ClientConsultTab />}
          {activeTab === "lawyerMgmt" && <LawyerMgmtTab />}
          {activeTab === "consult" && <ConsultListPage />}
          
          {/* 💡 [핵심 수정] 접수 관리 버튼을 눌렀을 때 화면이 나오도록 연결 한 줄 추가! */}
          {activeTab === "receptionMgmt" && <LawyerReceptionTab />}
        </section>
      </div>
    </div>
  );
};

export default MyPage;