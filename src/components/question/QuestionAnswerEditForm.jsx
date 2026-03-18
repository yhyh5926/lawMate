import React, { useState } from "react";
import { answerApi } from "../../api/answerApi.js";
import "../../styles/question/QuestionAnswerEditForm.css";

const QuestionAnswerEditForm = ({
  answerId,
  initialContent,
  onSaveSuccess,
  onCancel,
}) => {
  const [content, setContent] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (content.trim().length < 10) {
      alert("법률 답변 내용을 최소 10자 이상 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      // API 호출 (PathVariable 기반)
      await answerApi.updateAnswer({
        answerId: answerId,
        content: content,
      });
      alert("답변이 수정되었습니다.");
      onSaveSuccess(); // 목록 새로고침 로직 호출
    } catch (error) {
      console.error("답변 수정 오류:", error);
      alert("수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="answer-edit-form-container">
      <form onSubmit={handleUpdate}>
        <textarea
          className="answer-edit-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="수정할 내용을 입력하세요."
          disabled={isSubmitting}
        />
        <div className="answer-edit-footer">
          <button
            type="button"
            className="ans-action-btn cancel"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            취소
          </button>
          <button
            type="submit"
            className="ans-action-btn save"
            disabled={isSubmitting}
          >
            {isSubmitting ? "저장 중..." : "수정 완료"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionAnswerEditForm;
