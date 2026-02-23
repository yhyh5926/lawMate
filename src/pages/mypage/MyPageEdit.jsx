import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../zustand/auth_store";
import { authApi } from "../../api/auth_api";
import "../../styles/auth/Auth.css";

const MyPageEdit = () => {
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
    nickname: "",
    education: "",
    phone: "",
    office: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        password: user.password || "",
        confirmPassword: user.password || "",
        nickname: user.nickname || "",
        education: user.role === "LAWYER" ? user.education || "" : "",
        phone: user.role === "LAWYER" ? user.phone || "" : "",
        office: user.role === "LAWYER" ? user.office || "" : "",
      });
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword)
      return alert("비밀번호가 일치하지 않습니다.");

    try {
      const updateData = {
        id: user.id,
        password: form.password,
        nickname: form.nickname,
        ...(user.role === "LAWYER" && {
          education: form.education,
          phone: form.phone,
          office: form.office,
        }),
      };

      const updatedUser = await authApi.updateUser(updateData);
      updateUser(updatedUser);
      alert("정보가 수정되었습니다.");
      navigate("/mypage");
    } catch (error) {
      alert("수정 실패: " + error);
    }
  };

  if (!user) return null;

  return (
    <div className="auth-outer-layout">
      <div className="auth-card-wide">
        <h2 className="auth-title">내 정보 수정</h2>

        <form className="auth-form-stack" onSubmit={handleSubmit}>
          <div className="auth-grid">
            <div className="auth-input-wrapper span-2">
              <label className="auth-label">아이디 (수정 불가)</label>
              <input className="auth-input readonly" value={user.id} disabled />
            </div>

            <div className="auth-input-wrapper">
              <label className="auth-label">닉네임</label>
              <input
                name="nickname"
                className="auth-input"
                value={form.nickname}
                onChange={handleChange}
              />
            </div>

            <div className="auth-input-wrapper">
              <label className="auth-label">비밀번호</label>
              <input
                type="password"
                name="password"
                className="auth-input"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <div className="auth-input-wrapper span-2">
              <label className="auth-label">비밀번호 확인</label>
              <input
                type="password"
                name="confirmPassword"
                className="auth-input"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          {user.role === "LAWYER" && (
            <div className="lawyer-nested-box edit-mode">
              <p className="box-title">⚖️ 변호사 정보 수정</p>
              <div className="auth-grid">
                <div className="auth-input-wrapper">
                  <label className="auth-label">최종 학력</label>
                  <input
                    name="education"
                    className="auth-input"
                    value={form.education}
                    onChange={handleChange}
                  />
                </div>
                <div className="auth-input-wrapper">
                  <label className="auth-label">전화번호</label>
                  <input
                    name="phone"
                    className="auth-input"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="auth-input-wrapper span-2">
                  <label className="auth-label">사무실 위치</label>
                  <input
                    name="office"
                    className="auth-input"
                    value={form.office}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <p className="helper-text-red">
                * 자격증명은 관리자 승인 사항이므로 수정할 수 없습니다.
              </p>
            </div>
          )}

          <div className="auth-button-group">
            <button type="submit" className="auth-main-btn">
              수정 완료
            </button>
            <button
              type="button"
              onClick={() => navigate("/mypage")}
              className="auth-main-btn secondary"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyPageEdit;
