import React from "react";
import "../../styles/member/JoinStepIndicator.css";

const JoinStepIndicator = ({ currentStep }) => {
  const steps = ["약관동의", "정보입력", "가입완료"];

  return (
    <div className="join-step-container">
      {steps.map((step, index) => {
        const stepNum = index + 1;
        const isActive = currentStep === stepNum;
        const isPassed = currentStep > stepNum;

        return (
          <React.Fragment key={index}>
            <div
              className={`join-step-item ${isActive ? "active" : ""} ${isPassed ? "passed" : ""}`}
            >
              <div className="step-circle">{isPassed ? "✓" : stepNum}</div>
              <span className="step-text">{step}</span>
            </div>

            {index < steps.length - 1 && (
              <div className={`step-connector ${isPassed ? "passed" : ""}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default JoinStepIndicator;
