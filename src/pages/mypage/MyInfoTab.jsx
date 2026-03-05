// src/components/mypage/MyInfoTab.jsx
import React from "react";
import { useAuthStore } from "../../store/authStore.js";

const MyInfoTab = () => {
  const { user } = useAuthStore();

  // 전화번호 포맷팅 함수
  const formatPhone = (phone) => {
    if (!phone) return "미등록";
    if (phone.length === 11) return phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    if (phone.length === 10) return phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    return phone;
  };

  // 첨부파일 보기 핸들러
  const handleViewFile = () => {
    const fileUrl = user.licenseFileUrl; 
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    } else {
      alert("등록된 자격증 첨부파일이 없습니다.");
    }
  };

  return (
    <div className="myinfo-wrapper">
      <h3 className="content-title">기본 회원 정보</h3>
      <ul className="myinfo-list">
        <li className="myinfo-item">
          <span className="myinfo-label">{user.role === "LAWYER" ? "이름(실명)" : "이름"}</span>
          <span className="myinfo-value">{user.name}</span>
        </li>
        <li className="myinfo-item">
          <span className="myinfo-label">아이디</span>
          <span className="myinfo-value">{user.loginId}</span>
        </li>
        <li className="myinfo-item">
          <span className="myinfo-label">비밀번호</span>
          <span className="myinfo-value">
            {user.provider === "GOOGLE" ? "구글 계정은 비밀번호가 없습니다." : "********"}
          </span>
        </li>
        <li className="myinfo-item">
          <span className="myinfo-label">이메일</span>
          <span className="myinfo-value">{user.email}</span>
        </li>
        <li className="myinfo-item">
          <span className="myinfo-label">전화번호</span>
          <span className="myinfo-value">{formatPhone(user.phone)}</span>
        </li>

        {user.role === "LAWYER" ? (
          <>
            <li className="myinfo-item">
              <span className="myinfo-label">사무실 주소</span>
              <span className="myinfo-value">
                {user.officeAddr ? `${user.officeAddr} ${user.officeDetailAddr || ""}` : "미등록"}
              </span>
            </li>
            <li className="myinfo-item">
              <span className="myinfo-label">변호사 자격증</span>
              <span className="myinfo-value">
                {user.licenseNo || "미등록"}
                <button onClick={handleViewFile} className="view-file-btn">첨부파일 보기</button>
              </span>
            </li>
            <li className="myinfo-item">
              <span className="myinfo-label">변호사 카테고리</span>
              <span className="myinfo-value">{user.specialty || "미등록"}</span>
            </li>
          </>
        ) : (
          <li className="myinfo-item">
            <span className="myinfo-label">주소</span>
            <span className="myinfo-value">
              {user.address ? `${user.address} ${user.detailAddress || ""}` : "미등록"}
            </span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default MyInfoTab;