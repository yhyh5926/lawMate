import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/member/JoinTypePage.css"; // CSS 임포트

const JoinTypePage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [memberType, setMemberType] = useState(null);

  const handleRoleSelect = (role) => {
    setMemberType(role);
    setStep(2);
  };

  const handleMethodSelect = (method) => {
    if (method === "form") {
      navigate(
        memberType === "PERSONAL"
          ? "/member/join/terms"
          : "/member/lawyer/terms",
      );
    } else {
      if (method === "kakao" || method === "naver") {
        return alert(
          "현재 구글 가입만 지원하고 있습니다. 구글 가입을 이용해 주세요.",
        );
      }
      if (method === "google") {
        navigate(`/member/join/social/google?type=${memberType}`);
      }
    }
  };

  return (
    <div className="join-type-container">
      <h2>회원가입</h2>

      {step === 1 ? (
        <>
          <p className="join-type-subtitle">
            LawMate에 오신 것을 환영합니다.
            <br />
            회원 유형을 선택해주세요.
          </p>
          <div
            className="role-card"
            onClick={() => handleRoleSelect("PERSONAL")}
          >
            <h3>🙋‍♂️ 일반 회원</h3>
          </div>
          <div className="role-card" onClick={() => handleRoleSelect("LAWYER")}>
            <h3>⚖️ 변호사 회원</h3>
          </div>
        </>
      ) : (
        <>
          <p className="join-type-subtitle">
            <strong>{memberType === "PERSONAL" ? "일반" : "변호사"}</strong>{" "}
            가입 방식을 선택해주세요.
          </p>
          <div className="method-group">
            <button
              className="method-btn btn-form"
              onClick={() => handleMethodSelect("form")}
            >
              이메일로 직접 가입
            </button>
            <button
              className="method-btn btn-google"
              onClick={() => handleMethodSelect("google")}
            >
              Google 계정으로 시작
            </button>
            <button
              className="method-btn btn-kakao"
              onClick={() => handleMethodSelect("kakao")}
            >
              카카오로 시작
            </button>
            <button
              className="method-btn btn-naver"
              onClick={() => handleMethodSelect("naver")}
            >
              네이버로 시작
            </button>
          </div>
          <button className="btn-back" onClick={() => setStep(1)}>
            회원 유형 다시 선택하기
          </button>
        </>
      )}
    </div>
  );
};

export default JoinTypePage;
