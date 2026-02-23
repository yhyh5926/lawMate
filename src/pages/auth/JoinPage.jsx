import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/auth_api";
import "../../styles/auth/Auth.css";

const JoinPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("USER");
  const [form, setForm] = useState({
    id: "",
    pw: "",
    name: "",
    email: "",
    nickname: "",
    licenseName: "",
    education: "",
    phone: "",
    office: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleJoin = async () => {
    if (!form.id || !form.pw || !form.name)
      return alert("필수 정보를 입력하세요.");
    if (role === "LAWYER" && (!form.licenseName || !form.phone || !form.office))
      return alert("변호사 정보를 입력하세요.");

    const res = await authApi.join({ ...form, role });
    if (res.success) {
      alert("가입 완료!");
      navigate("/login");
    }
  };

  return (
    <div className="auth-outer-layout">
      <div className="auth-card-wide">
        <h2 className="auth-title">회원가입</h2>

        <div className="auth-tab-pill">
          <button
            onClick={() => setRole("USER")}
            className={role === "USER" ? "active" : ""}
          >
            일반
          </button>
          <button
            onClick={() => setRole("LAWYER")}
            className={role === "LAWYER" ? "active" : ""}
          >
            변호사
          </button>
        </div>

        <div className="auth-grid">
          <div className="auth-input-wrapper">
            <label className="auth-label">아이디</label>
            <input name="id" onChange={handleChange} className="auth-input" />
          </div>
          <div className="auth-input-wrapper">
            <label className="auth-label">비밀번호</label>
            <input
              type="password"
              name="pw"
              onChange={handleChange}
              className="auth-input"
            />
          </div>
          <div className="auth-input-wrapper">
            <label className="auth-label">이름</label>
            <input name="name" onChange={handleChange} className="auth-input" />
          </div>
          <div className="auth-input-wrapper">
            <label className="auth-label">닉네임</label>
            <input
              name="nickname"
              onChange={handleChange}
              className="auth-input"
            />
          </div>
          <div className="auth-input-wrapper span-2">
            <label className="auth-label">이메일</label>
            <input
              name="email"
              onChange={handleChange}
              className="auth-input"
            />
          </div>
        </div>

        {role === "LAWYER" && (
          <div className="lawyer-nested-box">
            <p className="box-title">⚖️ 전문 정보</p>
            <div className="auth-grid">
              <div className="auth-input-wrapper span-2">
                <label className="auth-label">자격증</label>
                <input
                  name="licenseName"
                  onChange={handleChange}
                  className="auth-input"
                />
              </div>
              <div className="auth-input-wrapper">
                <label className="auth-label">학력</label>
                <input
                  name="education"
                  onChange={handleChange}
                  className="auth-input"
                />
              </div>
              <div className="auth-input-wrapper">
                <label className="auth-label">번호</label>
                <input
                  name="phone"
                  onChange={handleChange}
                  className="auth-input"
                />
              </div>
              <div className="auth-input-wrapper span-2">
                <label className="auth-label">사무실</label>
                <input
                  name="office"
                  onChange={handleChange}
                  className="auth-input"
                />
              </div>
            </div>
          </div>
        )}

        <button onClick={handleJoin} className="auth-main-btn">
          가입 완료
        </button>
      </div>
    </div>
  );
};

export default JoinPage;
