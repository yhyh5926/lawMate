import React from "react";
import "../../styles/case/CaseStepBar.css";

const CaseStepBar = ({ currentStep }) => {
  // 백엔드 STEP 상태 정의
  const steps = [
    { code: "RECEIVED", label: "접수완료" },
    { code: "ASSIGNED", label: "변호사배정" },
    { code: "IN_PROGRESS", label: "진행중" },
    { code: "REVIEW", label: "의견완료" },
    { code: "CLOSED", label: "사건종료" },
  ];

  const currentIndex = steps.findIndex((s) => s.code === currentStep);
  const activeIndex = currentIndex >= 0 ? currentIndex : 0;

  return (
    <div className="step-bar-container">
      {steps.map((step, index) => {
        const isCompleted = index < activeIndex; // 이미 지나온 단계
        const isCurrent = index === activeIndex; // 현재 진행중인 단계
        const isPending = index > activeIndex; // 아직 도달하지 않은 단계

        return (
          <React.Fragment key={step.code}>
            <div
              className={`step-item ${isCurrent ? "active" : ""} ${isCompleted ? "completed" : ""}`}
            >
              <div className="step-node">{isCompleted ? "✓" : index + 1}</div>
              <span className="step-label">{step.label}</span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`step-line ${index < activeIndex ? "filled" : ""}`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default CaseStepBar;
