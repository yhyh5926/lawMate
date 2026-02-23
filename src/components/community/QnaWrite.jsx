import React, { useState } from "react";
import "../../styles/community/community.css";
const QnaWrite = () => {
  const [form, setForm] = useState({ title: "", content: "" });

  const handleSubmit = async () => {
    // 기존에 짰던 Spring/Flask 통신 로직 유지
    console.log("데이터 전송:", form);
    alert("질문이 등록되었습니다.");
  };

  return (
    <div className="container">
      <div className="form-group">
        <h2 className="title">⚖️ 법률 질문 등록</h2>

        <div className="input-wrapper">
          <input
            type="text"
            placeholder="질문의 핵심 내용을 제목으로 적어주세요"
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div className="input-wrapper">
          <textarea
            placeholder="상담 내용을 자세히 적어주시면, AI가 분석하여 가장 적합한 답변을 준비합니다."
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
        </div>

        <button className="btn-primary" onClick={handleSubmit}>
          <span>✨</span> AI 분석 및 질문 등록
        </button>

        <p
          style={{
            textAlign: "center",
            fontSize: "13px",
            color: "#7a8fa3",
            marginTop: "15px",
          }}
        >
          등록된 질문은 익명으로 처리되며, 변호사분들의 답변을 받을 수 있습니다.
        </p>
      </div>
    </div>
  );
};

export default QnaWrite;
