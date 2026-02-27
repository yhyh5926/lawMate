// src/pages/mypage/MypageEditPage.jsx
// 설명: 마이페이지 - 회원 정보(이름, 이메일, 전화번호 등)를 수정하는 화면입니다.
// Zustand의 isHydrated 상태를 체크하여 인증 정보 로드 전 중복 알림이나 오작동을 방지합니다.
// 경로 해석 오류 해결을 위해 임포트 경로에 확장자를 추가했습니다.

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";
import { memberApi } from "../../api/memberApi.js";

const MypageEditPage = () => {
  const navigate = useNavigate();
  // isHydrated: 스토리지에서 인증 정보를 모두 불러왔는지 확인하는 상태
  const { user, login, logout, isHydrated, isAuthenticated } = useAuthStore();

  // 폼 상태 관리
  const [formData, setFormData] = useState({
    name: "",
    phone1: "010",
    phone2: "",
    phone3: "",
    emailId: "",
    emailDomain: "naver.com",
  });

  const [message, setMessage] = useState(""); // 알림 메시지 상태

  const phone2Ref = useRef(null);
  const phone3Ref = useRef(null);

  // 1. 인증 체크 가드 (중복 알림 방지 로직)
  useEffect(() => {
    // 데이터 복원(Hydration)이 완료된 후에만 인증 여부를 확인합니다.
    if (isHydrated && !isAuthenticated) {
      // 이미 알림이 떴을 수 있는 상황(예: PrivateRoute)을 고려하여 
      // 이 페이지 자체에서도 안전하게 메인으로 보냅니다.
      navigate("/member/login.do");
    }
  }, [isHydrated, isAuthenticated, navigate]);

  // 2. 초기 데이터 세팅: Hydration이 완료되고 유저 정보가 있을 때 실행
  useEffect(() => {
    if (isHydrated && user) {
      const phoneMatch = user.phone?.match(/^(\d{3})(\d{3,4})(\d{4})$/);
      const emailParts = user.email?.split("@") || ["", "naver.com"];

      setFormData({
        name: user.name || "",
        phone1: phoneMatch ? phoneMatch[1] : "010",
        phone2: phoneMatch ? phoneMatch[2] : "",
        phone3: phoneMatch ? phoneMatch[3] : "",
        emailId: emailParts[0],
        emailDomain: emailParts[1],
      });
    }
  }, [isHydrated, user]);

  // 스토리지 데이터 로드 중일 때는 아무것도 렌더링하지 않거나 로딩 표시를 합니다.
  if (!isHydrated) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>데이터를 불러오는 중입니다...</div>;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (e, nextRef) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setFormData({ ...formData, [e.target.name]: val });
    if (nextRef && val.length >= 4) nextRef.current.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullPhone = `${formData.phone1}${formData.phone2}${formData.phone3}`;
    const fullEmail = `${formData.emailId}@${formData.emailDomain}`;

    try {
      const updateData = {
        loginId: user?.loginId,
        name: formData.name,
        phone: fullPhone,
        email: fullEmail,
        memberType: user?.role
      };

      const response = await memberApi.updateProfile(updateData);
      
      if (response.data) {
        setMessage("회원 정보가 성공적으로 수정되었습니다.");
        const currentToken = localStorage.getItem("token");
        login(currentToken, response.data); 
        setTimeout(() => navigate("/main.do"), 1500);
      }
    } catch (error) {
      setMessage("정보 수정 중 오류가 발생했습니다.");
    }
  };

  const handleLogoutClick = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      logout();
      navigate("/main.do");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", padding: "20px", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}>회원 정보 수정</h2>
      
      {message && (
        <div style={{ padding: "10px", marginBottom: "20px", backgroundColor: "#e7f3ff", color: "#007bff", borderRadius: "4px", textAlign: "center", fontWeight: "bold" }}>
          {message}
        </div>
      )}

      <div style={{ marginBottom: "25px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "8px", border: "1px solid #e9ecef" }}>
        <p style={{ margin: 0, fontSize: "14px" }}><strong>아이디:</strong> {user?.loginId}</p>
        <p style={{ margin: "8px 0 0 0", fontSize: "14px" }}><strong>회원 유형:</strong> {user?.role === 'LAWYER' ? '전문회원' : '일반회원'}</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <label style={labelStyle}>이름(실명)</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>휴대전화 번호</label>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input type="text" name="phone1" value={formData.phone1} onChange={(e) => handlePhoneChange(e, phone2Ref)} maxLength={3} style={{ ...inputStyle, textAlign: "center" }} />
            <span>-</span>
            <input type="text" name="phone2" ref={phone2Ref} value={formData.phone2} onChange={(e) => handlePhoneChange(e, phone3Ref)} maxLength={4} style={{ ...inputStyle, textAlign: "center" }} />
            <span>-</span>
            <input type="text" name="phone3" ref={phone3Ref} value={formData.phone3} onChange={(e) => handlePhoneChange(e, null)} maxLength={4} style={{ ...inputStyle, textAlign: "center" }} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>이메일 주소</label>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input type="text" name="emailId" value={formData.emailId} onChange={handleChange} placeholder="아이디" style={inputStyle} />
            <span>@</span>
            <select name="emailDomain" value={formData.emailDomain} onChange={handleChange} style={selectStyle}>
              <option value="naver.com">naver.com</option>
              <option value="gmail.com">gmail.com</option>
              <option value="kakao.com">kakao.com</option>
            </select>
          </div>
        </div>
        
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button type="button" onClick={() => navigate(-1)} style={cancelBtnStyle}>취소</button>
          <button type="submit" style={submitBtnStyle}>수정 완료</button>
        </div>
      </form>

      <div style={{ marginTop: "40px", paddingTop: "20px", borderTop: "1px dashed #eee", textAlign: "center" }}>
        <button onClick={handleLogoutClick} style={logoutBtnStyle}>로그아웃</button>
      </div>
    </div>
  );
};

const labelStyle = { display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "bold", color: "#444" };
const inputStyle = { width: "100%", padding: "12px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box", fontSize: "15px" };
const selectStyle = { padding: "12px", border: "1px solid #ccc", borderRadius: "4px", flex: 1, fontSize: "15px" };
const submitBtnStyle = { flex: 1, padding: "14px", backgroundColor: "#007BFF", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" };
const cancelBtnStyle = { flex: 1, padding: "14px", border: "1px solid #ccc", background: "#fff", borderRadius: "4px", cursor: "pointer" };
const logoutBtnStyle = { padding: "10px 20px", backgroundColor: "#f8f9fa", color: "#dc3545", border: "1px solid #dc3545", borderRadius: "4px", cursor: "pointer", fontSize: "14px", fontWeight: "bold" };

export default MypageEditPage;