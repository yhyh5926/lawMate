// vs코드
// 파일 위치: src/components/case/CaseStepBar.jsx
// 설명: 마이페이지 사건 상세 화면에서 사건의 진행 단계(접수~종료)를 선과 배지로 보여주는 UI

import React from "react";

const CaseStepBar = ({ currentStep }) => {
  // 백엔드 STEP 상태: RECEIVED -> ASSIGNED -> IN_PROGRESS -> REVIEW -> CLOSED
  const steps = [
    { code: "RECEIVED", label: "접수완료" },
    { code: "ASSIGNED", label: "변호사배정" },
    { code: "IN_PROGRESS", label: "진행중" },
    { code: "REVIEW", label: "의견완료" },
    { code: "CLOSED", label: "사건종료" }
  ];

  const currentIndex = steps.findIndex(s => s.code === currentStep) >= 0 
                       ? steps.findIndex(s => s.code === currentStep) : 0;

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "20px 0" }}>
      {steps.map((step, index) => {
        const isCompleted = index <= currentIndex;
        return (
          <React.Fragment key={step.code}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{
                width: "20px", height: "20px", borderRadius: "50%",
                backgroundColor: isCompleted ? "#28a745" : "#e9ecef",
                marginBottom: "8px"
              }}></div>
              <span style={{ fontSize: "12px", color: isCompleted ? "#28a745" : "#6c757d", fontWeight: isCompleted ? "bold" : "normal" }}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div style={{ flex: 1, height: "4px", backgroundColor: index < currentIndex ? "#28a745" : "#e9ecef", margin: "0 10px", marginTop: "-20px" }}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default CaseStepBar;