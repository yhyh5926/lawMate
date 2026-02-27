import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";
import { memberApi } from "../../api/memberApi.js";

const MypageEditPage = () => {
  const navigate = useNavigate();
  const { user, login, isHydrated, isAuthenticated } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    phone1: "010",
    phone2: "",
    phone3: "",
    emailId: "",
    emailDomain: "naver.com",
  });
  const [message, setMessage] = useState("");
  const phone2Ref = useRef(null);
  const phone3Ref = useRef(null);

  useEffect(() => {
    if (isHydrated && !isAuthenticated) navigate("/member/login.do");
  }, [isHydrated, isAuthenticated, navigate]);

  useEffect(() => {
    if (isHydrated && user) {
      const rawPhone = user.phone || "";
      let p1 = "010",
        p2 = "",
        p3 = "";
      if (rawPhone.length >= 10) {
        p1 = rawPhone.substring(0, 3);
        p2 =
          rawPhone.length === 11
            ? rawPhone.substring(3, 7)
            : rawPhone.substring(3, 6);
        p3 = rawPhone.substring(rawPhone.length - 4);
      }
      const [eId, eDom] = (user.email || "").split("@");
      setFormData({
        name: user.name || "",
        phone1: p1,
        phone2: p2,
        phone3: p3,
        emailId: eId || "",
        emailDomain: eDom || "naver.com",
      });
    }
  }, [isHydrated, user]);

  if (!isHydrated)
    return <div style={loadingWrapperStyle}>정보를 불러오는 중입니다...</div>;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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
        memberId: user?.memberId,
        name: formData.name,
        phone: fullPhone,
        email: fullEmail,
      };
      const response = await memberApi.updateProfile(updateData);
      if (response.data) {
        setMessage("✅ 회원 정보가 성공적으로 수정되었습니다.");
        login(
          localStorage.getItem("token"),
          response.data.member || response.data,
        );
        setTimeout(() => navigate("/main.do"), 1500);
      }
    } catch (error) {
      setMessage("❌ 정보 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={pageContainerStyle}>
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <h2 style={titleStyle}>회원 정보 수정</h2>
          <p style={subtitleStyle}>
            LawMate의 소중한 정보를 최신으로 유지하세요.
          </p>
        </div>

        {message && <div style={msgBoxStyle}>{message}</div>}

        <div style={readOnlySectionStyle}>
          <div style={infoItemStyle}>
            <span style={infoLabelStyle}>계정 아이디</span>
            <span style={infoValueStyle}>{user?.loginId}</span>
          </div>
          <div style={infoItemStyle}>
            <span style={infoLabelStyle}>회원 유형</span>
            <span style={badgeStyle(user?.role)}>{user?.role}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>이름(실명)</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="실명을 입력해주세요"
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>휴대전화</label>
            <div style={phoneGridStyle}>
              <input
                type="text"
                name="phone1"
                value={formData.phone1}
                onChange={(e) => handlePhoneChange(e, phone2Ref)}
                maxLength={3}
                style={centerInputStyle}
              />
              <span style={dashStyle}>-</span>
              <input
                type="text"
                name="phone2"
                ref={phone2Ref}
                value={formData.phone2}
                onChange={(e) => handlePhoneChange(e, phone3Ref)}
                maxLength={4}
                style={centerInputStyle}
              />
              <span style={dashStyle}>-</span>
              <input
                type="text"
                name="phone3"
                ref={phone3Ref}
                value={formData.phone3}
                onChange={(e) => handlePhoneChange(e, null)}
                maxLength={4}
                style={centerInputStyle}
              />
            </div>
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>이메일 주소</label>
            <div style={emailGridStyle}>
              <input
                type="text"
                name="emailId"
                value={formData.emailId}
                onChange={handleChange}
                style={emailInputStyle}
                placeholder="아이디"
              />
              <span style={atStyle}>@</span>
              <select
                name="emailDomain"
                value={formData.emailDomain}
                onChange={handleChange}
                style={emailSelectStyle}
              >
                <option value="naver.com">naver.com</option>
                <option value="gmail.com">gmail.com</option>
                <option value="kakao.com">kakao.com</option>
                <option value="hanmail.net">hanmail.net</option>
              </select>
            </div>
          </div>

          <div style={buttonSectionStyle}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={secondaryBtnStyle}
            >
              취소
            </button>
            <button type="submit" style={primaryBtnStyle}>
              변경사항 저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Styles (Refined UX) ---
const pageContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "calc(100vh - 80px)",
  backgroundColor: "#f4f7fa",
  padding: "20px",
};
const cardStyle = {
  width: "100%",
  maxWidth: "500px",
  backgroundColor: "#ffffff",
  borderRadius: "24px",
  padding: "48px 40px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
  border: "1px solid #edf2f7",
};
const cardHeaderStyle = { textAlign: "center", marginBottom: "32px" };
const titleStyle = {
  fontSize: "26px",
  fontWeight: "850",
  color: "#1a202c",
  letterSpacing: "-1px",
  marginBottom: "8px",
};
const subtitleStyle = { fontSize: "14px", color: "#718096" };

const readOnlySectionStyle = {
  backgroundColor: "#f8fafc",
  padding: "20px",
  borderRadius: "16px",
  marginBottom: "32px",
  border: "1px solid #f1f5f9",
};
const infoItemStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "6px 0",
};
const infoLabelStyle = { fontSize: "14px", color: "#94a3b8" };
const infoValueStyle = {
  fontSize: "14px",
  fontWeight: "700",
  color: "#334155",
};
const badgeStyle = (role) => ({
  fontSize: "11px",
  fontWeight: "800",
  padding: "3px 10px",
  borderRadius: "8px",
  backgroundColor: role === "ADMIN" ? "#fff5f5" : "#ebf8ff",
  color: role === "ADMIN" ? "#e53e3e" : "#3182ce",
});

const formStyle = { display: "flex", flexDirection: "column", gap: "24px" };
const fieldGroupStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};
const labelStyle = {
  fontSize: "14px",
  fontWeight: "700",
  color: "#2d3748",
  paddingLeft: "4px",
};
const inputStyle = {
  width: "100%",
  padding: "14px 18px",
  border: "1.5px solid #e2e8f0",
  borderRadius: "12px",
  fontSize: "15px",
  outline: "none",
  transition: "border-color 0.2s ease",
};

const phoneGridStyle = { display: "flex", gap: "10px", alignItems: "center" };
const centerInputStyle = { ...inputStyle, textAlign: "center", flex: 1 };
const dashStyle = { color: "#cbd5e1", fontSize: "18px" };

const emailGridStyle = {
  display: "flex",
  gap: "8px",
  alignItems: "center",
  width: "100%",
};
const emailInputStyle = { ...inputStyle, flex: "1", minWidth: "0" };
const emailSelectStyle = {
  ...inputStyle,
  flex: "1.6", // 도메인 창을 넉넉하게 확장
  cursor: "pointer",
  backgroundColor: "#fff",
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%2724%27%20height%3D%2724%27%20viewBox%3D%270%200%2024%2024%27%20fill%3D%27none%27%20stroke%3D%27%23cbd5e1%27%20stroke-width%3D%272%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%3E%3Cpolyline%20points%3D%276%209%2012%2015%2018%209%27%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  backgroundSize: "16px",
};
const atStyle = { color: "#94a3b8", fontWeight: "600", flexShrink: 0 };

const buttonSectionStyle = { display: "flex", gap: "12px", marginTop: "12px" };
const primaryBtnStyle = {
  flex: 1.8,
  padding: "16px",
  backgroundColor: "#007BFF",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  fontSize: "16px",
  fontWeight: "750",
  cursor: "pointer",
  boxShadow: "0 10px 20px rgba(0,123,255,0.2)",
};
const secondaryBtnStyle = {
  flex: 1,
  padding: "16px",
  backgroundColor: "#edf2f7",
  color: "#4a5568",
  border: "none",
  borderRadius: "12px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
};

const msgBoxStyle = {
  padding: "16px",
  backgroundColor: "#ebf8ff",
  color: "#2b6cb0",
  borderRadius: "12px",
  textAlign: "center",
  fontWeight: "700",
  marginBottom: "24px",
  border: "1px solid #bee3f8",
};
const loadingWrapperStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  color: "#a0aec0",
};

export default MypageEditPage;
