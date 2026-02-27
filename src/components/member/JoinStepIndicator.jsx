// vs코드
// 파일 위치: src/components/member/JoinStepIndicator.jsx
// 설명: 회원가입 시 현재 진행 중인 단계(약관동의 -> 정보입력 -> 가입완료)를 시각적으로 표시

import React from "react";

const JoinStepIndicator = ({ currentStep }) => {
  const steps = ["약관동의", "정보입력", "가입완료"];

  return (
    <div style={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
      {steps.map((step, index) => {
        const stepNum = index + 1;
        const isActive = currentStep === stepNum;
        const isPassed = currentStep > stepNum;

        return (
          <div key={index} style={{ display: "flex", alignItems: "center" }}>
            <div style={{
              width: "30px", height: "30px", borderRadius: "50%",
              backgroundColor: isActive || isPassed ? "#007BFF" : "#ccc",
              color: "#fff", display: "flex", justifyContent: "center", alignItems: "center",
              fontWeight: "bold", fontSize: "14px"
            }}>
              {stepNum}
            </div>
            <span style={{ 
              marginLeft: "8px", marginRight: "15px", 
              color: isActive ? "#007BFF" : (isPassed ? "#333" : "#ccc"),
              fontWeight: isActive ? "bold" : "normal"
            }}>
              {step}
            </span>
            {index < steps.length - 1 && (
              <div style={{ width: "40px", height: "2px", backgroundColor: isPassed ? "#007BFF" : "#ccc", marginRight: "15px" }} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default JoinStepIndicator;