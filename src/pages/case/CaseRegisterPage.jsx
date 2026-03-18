import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { caseApi } from "../../api/caseApi";
import { useAuthStore } from "../../store/authStore";
import "../../styles/case/CaseRegisterPage.css";
import { categories } from "../../constants/categories";

const CASE_TYPES = categories.slice(1, categories.length - 1);

const CaseRegisterPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    title: "",
    caseType: "민사",
    clientName: "",
    clientPhone: "",
    content: "",
    files: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 권한 체크
  if (!user || user.role !== "LAWYER") {
    return (
      <div className="access-denied">
        <div className="denied-icon">⚠️</div>
        <p>변호사 전용 메뉴입니다. 접근 권한이 없습니다.</p>
        <button onClick={() => navigate("/")}>홈으로 이동</button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.clientName || !formData.content) {
      alert("필수 항목(제목, 의뢰인명, 사건 내용)을 모두 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        lawyerId: user.memberId,
        lawyerName: user.name,
        status: 0,
      };

      await caseApi.registerCase(payload);
      alert("정식 사건으로 성공적으로 등록되었습니다.");
      navigate("/mypage");
    } catch (error) {
      console.error("사건 등록 실패:", error);
      alert("사건 등록 중 서버 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="case-reg-container">
      <header className="case-reg-header">
        <h2 className="case-reg-title">정식 사건 등록</h2>
        <p className="case-reg-desc">
          <span>💡</span> 상담 내용을 기반으로 정식 사건 데이터를 생성하고
          관리합니다.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="case-reg-form">
        <div className="form-group">
          <label>
            사건 제목 <span className="required">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="사건의 핵심 내용을 입력하세요"
            className="form-input"
          />
        </div>

        <div className="form-row">
          <div className="form-group flex-1">
            <label>
              사건 유형 <span className="required">*</span>
            </label>
            <select
              name="caseType"
              value={formData.caseType}
              onChange={handleChange}
              className="form-select"
            >
              {CASE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group flex-1">
            <label>
              의뢰인 성함 <span className="required">*</span>
            </label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              placeholder="예: 홍길동"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label>
            사건 상세 내용 <span className="required">*</span>
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="사건의 경위 및 상세 내용을 기재해주세요."
            rows="10"
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <label>관련 첨부파일 (선택)</label>
          <div className="file-input-wrapper">
            <input
              type="text"
              name="files"
              value={formData.files}
              onChange={handleChange}
              placeholder="파일명 또는 링크를 쉼표(,)로 구분하여 입력"
              className="form-input"
            />
            <p className="input-helper">
              증거 자료나 참고 서류가 있다면 관련 정보를 입력하세요.
            </p>
          </div>
        </div>

        <footer className="form-footer">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate(-1)}
          >
            취소
          </button>
          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting ? "등록 중..." : "정식 사건 등록하기"}
          </button>
        </footer>
      </form>
    </div>
  );
};

export default CaseRegisterPage;
