import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { questionApi } from "../../api/questionApi.js";
import { useAuth } from "../../hooks/useAuth.js";
import "../../styles/question/QuestionWritePage.css"; // CSS 파일 연결 권장

const QuestionWritePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // 💡 카테고리 리스트 통합 (이전 페이지들과 일치)
  const categories = [
    "민사",
    "형사",
    "가사",
    "이혼",
    "노동",
    "행정",
    "기업",
    "부동산",
    "기타",
  ];

  const [formData, setFormData] = useState({
    title: "",
    caseType: "민사", // 기본값
    content: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      await questionApi.writeQuestion({
        ...formData,
        memberId: user?.memberId,
      });
      alert("질문이 성공적으로 등록되었습니다.");
      navigate("/question/list");
    } catch (error) {
      console.error("질문 등록 실패:", error);
      alert("질문 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="qw-container">
      <h2 className="qw-title">⚖️ 법률 질문 작성</h2>
      <p className="qw-subtitle">
        전문 변호사가 상세하고 정확한 답변을 도와드립니다.
      </p>

      <form onSubmit={handleSubmit} className="qw-form">
        {/* 사건 유형 선택 */}
        <div className="qw-field">
          <label className="qw-label">사건 유형</label>
          <select
            name="caseType"
            className="qw-select"
            value={formData.caseType}
            onChange={handleChange}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* 제목 입력 */}
        <div className="qw-field">
          <label className="qw-label">질문 제목</label>
          <input
            type="text"
            name="title"
            className="qw-input"
            placeholder="어떤 점이 궁금하신가요? 핵심 내용을 요약해주세요."
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        {/* 상세 내용 입력 */}
        <div className="qw-field">
          <label className="qw-label">상세 내용</label>
          <textarea
            name="content"
            className="qw-textarea"
            placeholder="사건의 발생 시점, 구체적인 피해 상황 등을 상세히 기록해주시면 더 정확한 법률 조언이 가능합니다."
            value={formData.content}
            onChange={handleChange}
          />
        </div>

        {/* 하단 버튼 영역 */}
        <div className="qw-actions">
          <button
            type="button"
            className="qw-cancel-btn"
            onClick={() => navigate(-1)}
          >
            취소
          </button>
          <button type="submit" className="qw-submit-btn">
            질문 등록하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionWritePage;
