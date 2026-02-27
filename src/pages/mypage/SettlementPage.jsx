// src/pages/mypage/MypageEditPage.jsx
// 설명: 마이페이지 - 회원 정보(이름, 이메일, 전화번호 등)를 수정하는 화면입니다.
// Zustand authStore를 통해 현재 로그인된 유저 정보를 가져와서 초기값으로 세팅합니다.
// 모듈 해석 오류 수정을 위해 임포트 경로에 확장자(.js)를 추가했습니다.

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";
import { memberApi } from "../../api/memberApi.js";

const MypageEditPage = () => {
  const navigate = useNavigate();
  const { user, login } = useAuthStore(); // login 함수를 통해 수정된 정보를 전역 상태에 반영 가능

  // 폼 상태 관리 (초기값은 유저 정보에서 추출)
  const [formData, setFormData] = useState({
    name: "",
    phone1: "010",
    phone2: "",
    phone3: "",
    emailId: "",
    emailDomain: "naver.com",
  });

  const phone2Ref = useRef(null);
  const phone3Ref = useRef(null);

  // 페이지 진입 시 기존 유저 정보를 폼에 채워넣음
  useEffect(() => {
    if (user) {
      // 전화번호 파싱 (예: 01012345678 -> 010, 1234, 5678)
      const phoneMatch = user.phone?.match(/^(\d{3})(\d{3,4})(\d{4})$/);
      // 이메일 파싱 (예: test@naver.com -> test, naver.com)
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
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 전화번호 자동 포커스 이동 로직
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
        loginId: user.loginId, // 식별자
        name: formData.name,
        phone: fullPhone,
        email: fullEmail,
        memberType: user.role // 기존 타입 유지
      };

      const response = await memberApi.updateProfile(updateData);
      
      if (response.data) {
        alert("회원 정보가 성공적으로 수정되었습니다.");
        // 수정 성공 후 전역 상태 업데이트 (토큰은 그대로 유지하거나 서버에서 새로 받음)
        // 여기서는 기존 토큰과 수정된 유저 정보를 다시 스토어에 저장
        const currentToken = localStorage.getItem("token");
        login(currentToken, response.data); 
        
        navigate("/main.do");
      }
    } catch (error) {
      console.error("수정 실패:", error);
      alert("정보 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", padding: "20px", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}>회원 정보 수정</h2>
      
      <div style={{ marginBottom: "25px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "8px", border: "1px solid #e9ecef" }}>
        <p style={{ margin: 0, fontSize: "14px" }}><strong>아이디:</strong> {user?.loginId} (변경 불가)</p>
        <p style={{ margin: "8px 0 0 0", fontSize: "14px" }}><strong>회원 유형:</strong> {user?.role === 'LAWYER' ? '전문회원' : '일반회원'}</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* 이름 수정 */}
        <div>
          <label style={labelStyle}>이름(실명)</label>
          <input 
            type="text" name="name" 
            value={formData.name} onChange={handleChange} required 
            style={inputStyle} 
          />
        </div>

        {/* 전화번호 수정 (분할 UI) */}
        <div>
          <label style={labelStyle}>새로운 휴대전화 번호</label>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input type="text" name="phone1" value={formData.phone1} onChange={(e) => handlePhoneChange(e, phone2Ref)} maxLength={3} style={{ ...inputStyle, textAlign: "center", flex: 0.8 }} />
            <span>-</span>
            <input type="text" name="phone2" ref={phone2Ref} value={formData.phone2} onChange={(e) => handlePhoneChange(e, phone3Ref)} maxLength={4} style={{ ...inputStyle, textAlign: "center" }} />
            <span>-</span>
            <input type="text" name="phone3" ref={phone3Ref} value={formData.phone3} onChange={(e) => handlePhoneChange(e, null)} maxLength={4} style={{ ...inputStyle, textAlign: "center" }} />
          </div>
        </div>

        {/* 이메일 수정 (도메인 선택 UI) */}
        <div>
          <label style={labelStyle}>새로운 이메일 주소</label>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input type="text" name="emailId" value={formData.emailId} onChange={handleChange} placeholder="아이디" style={inputStyle} />
            <span>@</span>
            <select name="emailDomain" value={formData.emailDomain} onChange={handleChange} style={selectStyle}>
              <option value="naver.com">naver.com</option>
              <option value="gmail.com">gmail.com</option>
              <option value="kakao.com">kakao.com</option>
              <option value="daum.net">daum.net</option>
            </select>
          </div>
        </div>
        
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button type="button" onClick={() => navigate(-1)} style={cancelBtnStyle}>취소</button>
          <button type="submit" style={submitBtnStyle}>수정 완료</button>
        </div>
      </form>
    </div>
  );
};

const labelStyle = { display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "bold", color: "#444" };
const inputStyle = { width: "100%", padding: "12px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box", fontSize: "15px" };
const selectStyle = { padding: "12px", border: "1px solid #ccc", borderRadius: "4px", flex: 1, fontSize: "15px" };
const submitBtnStyle = { flex: 1, padding: "14px", backgroundColor: "#007BFF", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" };
const cancelBtnStyle = { flex: 1, padding: "14px", border: "1px solid #ccc", background: "#fff", borderRadius: "4px", cursor: "pointer" };

export default MypageEditPage;