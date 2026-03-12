import React, { useState } from "react";
import { answerApi } from "../../api/answerApi.js";
import { useAuthStore } from "../../store/authStore.js";
import "../../styles/question/QuestionAnswerForm.css";

const QuestionAnswerForm = ({ questionId, onAnswerSuccess }) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() || content.length < 10) {
      alert("법률 답변 내용을 최소 10자 이상 입력해주세요.");
      return;
    }

    if (!user || !user.lawyerId) {
      alert("변호사 정보를 확인할 수 없습니다. 다시 로그인해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      await answerApi.writeAnswer({
        questionId: questionId,
        lawyerId: user.lawyerId,
        content: content,
      });

      alert("법률 답변이 성공적으로 등록되었습니다.");
      setContent("");
      if (onAnswerSuccess) onAnswerSuccess();
    } catch (error) {
      console.error("답변 등록 중 오류 발생:", error);
      alert("답변 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="answer-form-container">
      <div className="answer-form-header">
        <div className="title-group">
          <h3 className="answer-form-title">법률 답변 작성</h3>
          <p className="answer-form-subtitle">
            전문가로서 신뢰할 수 있는 정보를 제공해 주세요.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          className="answer-form-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="법률 조언, 판례, 대응 방안 등을 상세히 입력해 주세요."
          disabled={isSubmitting}
        />
        <div className="answer-form-footer">
          <div className="policy-box">
            <p className="policy-text">
              • 답변 내용은 관련 법령에 근거해야 합니다.
            </p>
            <p className="policy-text">
              • 무분별한 홍보성 문구는 제한될 수 있습니다.
            </p>
          </div>
          <button
            type="submit"
            className={`answer-submit-btn ${isSubmitting ? "disabled" : ""}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "게시 중..." : "답변 완료"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionAnswerForm;
