import React, { useState } from "react";
import { questionApi } from "../../api/questionApi.js";

const QuestionAnswerForm = ({ questionId, onAnswerSuccess }) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      alert("법률 답변 내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      // TB_ANSWER 테이블 구조에 맞게 데이터 전송
      // 보통 로그인된 변호사의 ID는 서버에서 토큰으로 식별하거나 DTO에 담아 보냅니다.
      await questionApi.writeAnswer({
        questionId: questionId,
        content: content,
      });

      alert("답변이 성공적으로 등록되었습니다.");
      setContent("");
      if (onAnswerSuccess) onAnswerSuccess();
    } catch (error) {
      alert("답변 등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={answerFormContainer}>
      <div style={formHeader}>
        <span style={lawyerIcon}>👨‍⚖️</span>
        <h3 style={formTitle}>전문 변호사 답변 등록</h3>
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="질문자에 대한 법률 조언을 입력하세요. 상세한 답변은 채택 확률을 높입니다."
          style={answerTextarea}
        />
        <div style={submitWrapper}>
          <p style={noticeText}>
            * 등록된 답변은 수정이 가능하나, 채택 후에는 제한될 수 있습니다.
          </p>
          <button type="submit" disabled={isSubmitting} style={answerSubmitBtn}>
            {isSubmitting ? "등록 중..." : "법률 답변 게시"}
          </button>
        </div>
      </form>
    </div>
  );
};

// --- 스타일 정의 ---
const answerFormContainer = {
  marginTop: "30px",
  padding: "25px",
  backgroundColor: "#f8fafc",
  borderRadius: "16px",
  border: "1px solid #e2e8f0",
};
const formHeader = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "15px",
};
const lawyerIcon = { fontSize: "20px" };
const formTitle = {
  fontSize: "17px",
  fontWeight: "700",
  color: "#1e293b",
  margin: 0,
};
const answerTextarea = {
  width: "100%",
  height: "180px",
  padding: "15px",
  borderRadius: "12px",
  border: "1.5px solid #cbd5e1",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};
const submitWrapper = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "15px",
};
const noticeText = { fontSize: "12px", color: "#94a3b8", margin: 0 };
const answerSubmitBtn = {
  padding: "12px 24px",
  backgroundColor: "#1e293b",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontWeight: "700",
  cursor: "pointer",
};

export default QuestionAnswerForm;
