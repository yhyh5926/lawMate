/**
 * 파일 위치: src/components/mypage/EditInfoTab.jsx
 * 수정사항:
 * 1. memberApi 임포트 추가
 * 2. handleEditSubmit에 폼 데이터를 백엔드로 전송하는 API 연동 로직 추가
 */
import React, { useState, useRef } from "react";
import { useAuthStore } from "../../store/authStore.js";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { memberApi } from "../../api/memberApi.js"; // 💡 API 연동을 위해 임포트 추가

const GOOGLE_CLIENT_ID =
  "244554224995-kcgsjp47k8flns89ldv9stpfga219kut.apps.googleusercontent.com";

// 💡 전문 분야 카테고리 배열 ("전체" 제외)
const SPECIALTIES = [
  "민사",
  "형사",
  "가사",
  "이혼",
  "노동",
  "행정",
  "기업",
  "부동산",
];

const EditInfoContent = ({ onVerifyReset }) => {
  const { user } = useAuthStore();
  const [isVerified, setIsVerified] = useState(false);
  const [verifyPassword, setVerifyPassword] = useState("");

  const [editData, setEditData] = useState({
    name: "",
    password: "",
    passwordConfirm: "",
    phone1: "010",
    phone2: "",
    phone3: "",
    address: "",
    detailAddress: "",
    licenseNo: "",
    specialty: "",
    officeAddress: "",
    officeDetailAddress: "",
  });
  const [files, setFiles] = useState([]);
  const phone2Ref = useRef(null);
  const phone3Ref = useRef(null);

  // 1. 일반 로그인 본인 인증
  const handleLocalVerify = (e) => {
    e.preventDefault();
    if (!verifyPassword) return alert("비밀번호를 입력해주세요.");
    alert("본인 확인이 완료되었습니다.");
    setIsVerified(true);
    initEditForm();
  };

  // 2. 구글 로그인 본인 인증
  const handleGoogleVerify = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          },
        ).then((res) => res.json());

        if (userInfo.email === user.email) {
          alert("구글 본인 확인이 완료되었습니다.");
          setIsVerified(true);
          initEditForm();
        } else {
          alert("로그인된 계정과 일치하지 않는 구글 계정입니다.");
        }
      } catch (error) {
        alert("구글 인증 정보를 불러오는 데 실패했습니다.");
      }
    },
    onError: () => alert("구글 인증을 취소하셨거나 실패했습니다."),
  });

  // 3. 인증 완료 시 폼 초기 세팅
  const initEditForm = () => {
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

    setEditData({
      name: user.name || "",
      password: "",
      passwordConfirm: "",
      phone1: p1,
      phone2: p2,
      phone3: p3,
      address: user.address || "",
      detailAddress: user.detailAddress || "",
      licenseNo: user.licenseNo || "",
      specialty: user.specialty || "",
      officeAddress: user.officeAddr || "",
      officeDetailAddress: user.officeDetailAddr || "",
    });
  };

  const handleEditChange = (e) =>
    setEditData({ ...editData, [e.target.name]: e.target.value });

  // 💡 전문 분야 다중 선택 토글 핸들러 추가
  const handleSpecialtyToggle = (spec) => {
    let currentList = editData.specialty ? editData.specialty.split(",") : [];

    if (currentList.includes(spec)) {
      currentList = currentList.filter((item) => item !== spec); // 이미 선택되어 있으면 제거
    } else {
      currentList.push(spec); // 선택되어 있지 않으면 추가
    }

    setEditData({ ...editData, specialty: currentList.join(",") });
  };

  const handleEditPhoneChange = (e, nextRef) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setEditData({ ...editData, [e.target.name]: val });
    if (val.length === 4 && nextRef) nextRef.current.focus();
  };

  // 💡 API 호출 로직으로 교체
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (editData.password && editData.password !== editData.passwordConfirm) {
      return alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
    }

    try {
      // 1. 전화번호 3칸을 하나의 문자열로 합침
      const fullPhone = `${editData.phone1}${editData.phone2}${editData.phone3}`;

      // 2. 백엔드로 보낼 데이터 조립
      const submitData = {
        loginId: user.loginId, // 업데이트할 회원의 ID 필수 포함
        name: editData.name,
        password: editData.password || null, // 비밀번호를 변경하지 않으면 null
        phone: fullPhone,
        address: editData.address,
        detailAddress: editData.detailAddress,
        // 아래는 변호사 전용 데이터 (백엔드에서 조건부 처리)
        licenseNo: editData.licenseNo,
        specialty: editData.specialty,
        officeName: editData.officeAddress, // 기획에 따라 필드명 매핑 확인 필요
      };
      // 3. memberApi.js 에 있는 함수 호출
      await memberApi.editProfile(submitData);

      alert("정보 수정 요청이 완료되었습니다.");

      // 필요 시 여기서 전역 user 정보를 갱신하거나 창을 새로고침 할 수 있습니다.
    } catch (error) {
      console.error("정보 수정 실패:", error);
      alert("정보 수정 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handleViewFile = () => {
    if (user.licenseFileUrl) window.open(user.licenseFileUrl, "_blank");
    else alert("등록된 첨부파일이 없습니다.");
  };

  return (
    <div className="edit-wrapper">
      <h3 className="content-title">정보 수정</h3>

      {!isVerified ? (
        <div className="verify-container">
          <div className="verify-icon">🔒</div>
          <h4 className="verify-title">회원 정보 보호를 위한 본인 확인</h4>
          <p className="verify-desc">
            안전한 정보 변경을 위해{" "}
            {user.provider === "GOOGLE"
              ? "구글 계정을 다시 인증해주세요."
              : "비밀번호를 다시 입력해주세요."}
          </p>

          {user.provider === "GOOGLE" ? (
            <button
              type="button"
              onClick={() => handleGoogleVerify()}
              className="verify-google-btn"
            >
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="G"
                style={{ width: "20px" }}
              />
              구글 계정으로 본인 인증
            </button>
          ) : (
            <form onSubmit={handleLocalVerify} className="verify-input-group">
              <input
                type="password"
                placeholder="현재 비밀번호 입력"
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)}
                className="verify-input"
              />
              <button type="submit" className="verify-btn">
                확인
              </button>
            </form>
          )}
        </div>
      ) : (
        <form onSubmit={handleEditSubmit} className="edit-form">
          <div className="form-group">
            <label className="form-label">아이디 (변경 불가)</label>
            <input
              type="text"
              value={user.loginId}
              className="form-input"
              disabled
            />
          </div>
          <div className="form-group">
            <label className="form-label">이메일 (변경 불가)</label>
            <input
              type="text"
              value={user.email}
              className="form-input"
              disabled
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              {user.role === "LAWYER" ? "이름 (실명 필수)" : "이름"}
            </label>
            <input
              type="text"
              name="name"
              value={editData.name}
              onChange={handleEditChange}
              className="form-input"
              required
            />
          </div>

          {user.provider !== "GOOGLE" && (
            <>
              <div className="form-group">
                <label className="form-label">새 비밀번호</label>
                <input
                  type="password"
                  name="password"
                  value={editData.password}
                  onChange={handleEditChange}
                  className="form-input"
                  placeholder="변경하지 않으려면 빈칸으로 두세요."
                />
              </div>
              <div className="form-group">
                <label className="form-label">새 비밀번호 확인</label>
                <input
                  type="password"
                  name="passwordConfirm"
                  value={editData.passwordConfirm}
                  onChange={handleEditChange}
                  className="form-input"
                  placeholder="새 비밀번호를 한번 더 입력해주세요."
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">전화번호</label>
            <div className="form-row">
              <input
                type="text"
                name="phone1"
                value={editData.phone1}
                readOnly
                className="form-input"
                style={{
                  flex: 1,
                  textAlign: "center",
                  backgroundColor: "#f8fafc",
                }}
              />
              <span>-</span>
              <input
                type="text"
                name="phone2"
                ref={phone2Ref}
                value={editData.phone2}
                onChange={(e) => handleEditPhoneChange(e, phone3Ref)}
                maxLength={4}
                className="form-input"
                style={{ flex: 1, textAlign: "center" }}
              />
              <span>-</span>
              <input
                type="text"
                name="phone3"
                ref={phone3Ref}
                value={editData.phone3}
                onChange={(e) => handleEditPhoneChange(e, null)}
                maxLength={4}
                className="form-input"
                style={{ flex: 1, textAlign: "center" }}
              />
            </div>
          </div>

          {user.role === "LAWYER" ? (
            <>
              <div className="form-group">
                <label className="form-label">사무소 기본 주소</label>
                <input
                  type="text"
                  name="officeAddress"
                  value={editData.officeAddress}
                  onChange={handleEditChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">사무소 상세 주소</label>
                <input
                  type="text"
                  name="officeDetailAddress"
                  value={editData.officeDetailAddress}
                  onChange={handleEditChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  변호사 자격증 번호 (변경 시 재승인 필요)
                </label>
                <div className="form-row">
                  <input
                    type="text"
                    name="licenseNo"
                    value={editData.licenseNo}
                    onChange={handleEditChange}
                    className="form-input"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={handleViewFile}
                    className="view-file-btn"
                    style={{ padding: "14px" }}
                  >
                    기존 파일 보기
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">자격증 증빙서류 다시 첨부</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setFiles(Array.from(e.target.files))}
                  className="form-input"
                  style={{ padding: "10px" }}
                />
              </div>

              {/* 💡 전문 분야 다중 선택 버튼 UI 적용 */}
              <div className="form-group">
                <label className="form-label">
                  주요 전문 분야 (다중 선택 가능)
                </label>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginTop: "8px",
                  }}
                >
                  {SPECIALTIES.map((spec) => {
                    const isSelected = editData.specialty
                      ? editData.specialty.split(",").includes(spec)
                      : false;
                    return (
                      <button
                        type="button"
                        key={spec}
                        onClick={() => handleSpecialtyToggle(spec)}
                        style={{
                          padding: "8px 16px",
                          borderRadius: "20px",
                          border: isSelected
                            ? "1px solid #007BFF"
                            : "1px solid #ddd",
                          backgroundColor: isSelected ? "#007BFF" : "#fff",
                          color: isSelected ? "#fff" : "#555",
                          cursor: "pointer",
                          fontWeight: isSelected ? "bold" : "normal",
                          transition: "all 0.2s ease-in-out",
                        }}
                      >
                        {spec}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">기본 주소</label>
                <input
                  type="text"
                  name="address"
                  value={editData.address}
                  onChange={handleEditChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">상세 주소</label>
                <input
                  type="text"
                  name="detailAddress"
                  value={editData.detailAddress}
                  onChange={handleEditChange}
                  className="form-input"
                />
              </div>
            </>
          )}

          <button type="submit" className="submit-edit-btn">
            수정 완료
          </button>
        </form>
      )}
    </div>
  );
};

const EditInfoTab = () => (
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <EditInfoContent />
  </GoogleOAuthProvider>
);

export default EditInfoTab;
