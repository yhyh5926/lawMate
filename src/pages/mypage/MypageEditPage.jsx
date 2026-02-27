// vs코드
// 파일 위치: src/pages/mypage/MypageEditPage.jsx
// 설명: 마이페이지 - 회원 정보(이메일, 전화번호 등) 수정 화면

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { memberApi } from "../../api/memberApi";
import { useAuth } from "../../hooks/useAuth";

const MypageEditPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 실제로는 user의 식별자 등을 함께 보내거나 JWT 토큰 기반으로 백엔드에서 처리합니다.
      await memberApi.editProfile(formData);
      alert("회원 정보가 성공적으로 수정되었습니다.");
      navigate("/main.do");
    } catch (error) {
      alert("정보 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>회원 정보 수정</h2>
      <div style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
        <p style={{ margin: 0 }}><strong>아이디:</strong> {user?.loginId}</p>
        <p style={{ margin: "5px 0 0 0" }}><strong>회원 유형:</strong> {user?.role === 'LAWYER' ? '전문회원' : '일반회원'}</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "bold" }}>새로운 이메일</label>
          <input 
            type="email" name="email" placeholder="example@lawmate.com" 
            value={formData.email} onChange={handleChange} 
            style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" }} 
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "bold" }}>새로운 휴대전화 번호</label>
          <input 
            type="text" name="phone" placeholder="- 없이 입력" 
            value={formData.phone} onChange={handleChange} 
            style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" }} 
          />
        </div>
        
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button type="button" onClick={() => navigate(-1)} style={{ flex: 1, padding: "12px", border: "1px solid #ccc", background: "#fff", borderRadius: "4px", cursor: "pointer" }}>취소</button>
          <button type="submit" style={{ flex: 1, padding: "12px", backgroundColor: "#007BFF", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}>수정 완료</button>
        </div>
      </form>
    </div>
  );
};

export default MypageEditPage;