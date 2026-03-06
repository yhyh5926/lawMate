import React, { useState } from "react";
import { questionApi } from "../../api/questionApi.js";
import { useAuthStore } from "../../store/authStore.js"; // 💡 Zustand 스토어 임포트

const QuestionAnswerForm = ({ questionId, onAnswerSuccess }) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 💡 Zustand에서 유저 정보 가져오기
  const { user } = useAuthStore();

  console.log(user);
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!content.trim() || content.length < 10) {
      alert("법률 답변 내용을 최소 10자 이상 입력해주세요.");
      return;
    }

    // 💡 로그인 체크 및 변호사 ID 확인
    if (!user || !user.lawyerId) {
      alert("변호사 정보를 확인할 수 없습니다. 다시 로그인해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 💡 API 호출 시 lawyerId를 명시적으로 포함
      await questionApi.writeAnswer({
        questionId: questionId,
        lawyerId: user.lawyerId, // 스토어에서 가져온 ID 주입
        content: content,
      });

      alert("법률 답변이 성공적으로 등록되었습니다.");
      setContent("");
      if (onAnswerSuccess) onAnswerSuccess();
    } catch (error) {
      console.error("답변 등록 중 오류 발생:", error);
      alert("답변 등록에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // ... 기존 return 코드와 동일 ...
    <div style={styles.container}>
      {/* (기존 JSX 구조 유지) */}
      <form onSubmit={handleSubmit}>
        <textarea
          style={styles.textarea}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="법률 조언, 판례, 대응 방안 등을 상세히 입력해 주세요."
          disabled={isSubmitting}
        />
        <div style={styles.footer}>
          <button
            type="submit"
            style={isSubmitting ? styles.submitBtnDisabled : styles.submitBtn}
          >
            {isSubmitting ? "게시 중..." : "답변 완료"}
          </button>
        </div>
      </form>
    </div>
  );
};

// --- AnswerVO와 매칭되는 모던 스타일 ---
const styles = {
  container: {
    marginTop: "32px",
    padding: "24px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  header: {
    marginBottom: "20px",
    borderLeft: "4px solid #1e293b",
    paddingLeft: "12px",
  },
  titleGroup: { display: "flex", flexDirection: "column", gap: "4px" },
  title: { fontSize: "18px", fontWeight: "700", color: "#1e293b", margin: 0 },
  subtitle: { fontSize: "13px", color: "#64748b", margin: 0 },
  textarea: {
    width: "100%",
    height: "200px",
    padding: "16px",
    borderRadius: "8px",
    border: "1.5px solid #cbd5e1",
    fontSize: "15px",
    lineHeight: "1.6",
    boxSizing: "border-box",
    outline: "none",
    resize: "vertical",
    backgroundColor: "#f8fafc",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "16px",
  },
  policyBox: { display: "flex", flexDirection: "column", gap: "2px" },
  policyText: { fontSize: "11px", color: "#94a3b8", margin: 0 },
  submitBtn: {
    padding: "12px 32px",
    backgroundColor: "#1e293b",
    color: "#ffffff",
    borderRadius: "6px",
    fontWeight: "600",
    fontSize: "14px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  submitBtnDisabled: {
    padding: "12px 32px",
    backgroundColor: "#94a3b8",
    color: "#ffffff",
    borderRadius: "6px",
    border: "none",
    cursor: "not-allowed",
  },
};

export default QuestionAnswerForm;
