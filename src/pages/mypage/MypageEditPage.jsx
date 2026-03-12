import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";
import { memberApi } from "../../api/memberApi.js";
import "../../styles/mypage/MypageEditPage.css"; 

const MypageEditPage = () => {
  const navigate = useNavigate();
  const { user, login } = useAuthStore();

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

  useEffect(() => {
    if (user) {
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
  }, [user]);

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
        loginId: user.loginId,
        name: formData.name,
        phone: fullPhone,
        email: fullEmail,
        memberType: user.role,
      };

      const response = await memberApi.updateProfile(updateData);
      if (response.data) {
        alert("회원 정보가 성공적으로 수정되었습니다.");
        const currentToken = localStorage.getItem("token");
        login(currentToken, response.data);
        navigate("/main");
      }
    } catch (error) {
      console.error("수정 실패:", error);
      alert("정보 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="edit-page-container">
      <h2 className="edit-page-title">회원 정보 수정</h2>

      <div className="info-readonly-box">
        <div className="info-readonly-item">
          <strong>아이디</strong>
          <span>{user?.loginId}</span>
        </div>
        <div className="info-readonly-item">
          <strong>회원 유형</strong>
          <span>{user?.role === "LAWYER" ? "전문회원" : "일반회원"}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="edit-form">
        <div className="input-group">
          <label>이름(실명)</label>
          <input
            type="text"
            name="name"
            className="edit-input"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>새로운 휴대전화 번호</label>
          <div className="flex-row">
            <input
              type="text"
              name="phone1"
              className="edit-input"
              style={{ textAlign: "center", flex: 0.8 }}
              value={formData.phone1}
              onChange={(e) => handlePhoneChange(e, phone2Ref)}
              maxLength={3}
            />
            <span>-</span>
            <input
              type="text"
              name="phone2"
              ref={phone2Ref}
              className="edit-input"
              style={{ textAlign: "center" }}
              value={formData.phone2}
              onChange={(e) => handlePhoneChange(e, phone3Ref)}
              maxLength={4}
            />
            <span>-</span>
            <input
              type="text"
              name="phone3"
              ref={phone3Ref}
              className="edit-input"
              style={{ textAlign: "center" }}
              value={formData.phone3}
              onChange={(e) => handlePhoneChange(e, null)}
              maxLength={4}
            />
          </div>
        </div>

        <div className="input-group">
          <label>새로운 이메일 주소</label>
          <div className="flex-row">
            <input
              type="text"
              name="emailId"
              className="edit-input"
              value={formData.emailId}
              onChange={handleChange}
              placeholder="아이디"
            />
            <span>@</span>
            <select
              name="emailDomain"
              className="edit-select"
              value={formData.emailDomain}
              onChange={handleChange}
            >
              <option value="naver.com">naver.com</option>
              <option value="gmail.com">gmail.com</option>
              <option value="kakao.com">kakao.com</option>
              <option value="daum.net">daum.net</option>
            </select>
          </div>
        </div>

        <div className="edit-actions">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-cancel"
          >
            취소
          </button>
          <button type="submit" className="btn-submit">
            수정 완료
          </button>
        </div>
      </form>
    </div>
  );
};

export default MypageEditPage;
