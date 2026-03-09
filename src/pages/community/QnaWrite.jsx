import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { writePost } from "../../api/communityApi";
import "../../styles/community/QnaWrite.css";

const QnaWrite = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    caseType: "",
    title: "",
    content: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const memberId = Number(localStorage.getItem("memberId"));

    if (!memberId) { alert("로그인 정보가 없습니다."); return; }
    if (!form.caseType) { alert("분류를 선택해주세요."); return; }
    if (!form.title.trim()) { alert("제목을 입력해주세요."); return; }
    if (!form.content.trim()) { alert("내용을 입력해주세요."); return; }

    const payload = { memberId, caseType: form.caseType, title: form.title, content: form.content };

    try {
      await writePost(payload);
      alert("게시글이 등록되었습니다.");
      navigate("/community/qnalist");
    } catch (error) {
      console.error("게시글 등록 실패:", error);
      alert("게시글 등록 실패");
    }
  };

  const contentLength = form.content.length;

  return (
    <div className="write-wrapper">
      <div className="write-container">

        <h2 className="write-page-title">게시글 작성</h2>

        <div className="write-card">
          <form className="write-form" onSubmit={handleSubmit}>

            {/* 분류 */}
            <div className="write-field">
              <label className="write-label">
                분류 <span className="required">*</span>
              </label>
              <select
                className="write-select"
                name="caseType"
                value={form.caseType}
                onChange={handleChange}
              >
                <option value="">선택하세요</option>
                <option value="민사">민사</option>
                <option value="형사">형사</option>
                <option value="행정">행정</option>
                <option value="자유">자유</option>
              </select>
            </div>

            {/* 제목 */}
            <div className="write-field">
              <label className="write-label">
                제목 <span className="required">*</span>
              </label>
              <input
                className="write-input"
                type="text"
                name="title"
                value={form.title}
                placeholder="제목을 입력하세요"
                onChange={handleChange}
              />
            </div>

            {/* 내용 */}
            <div className="write-field">
              <label className="write-label">
                내용 <span className="required">*</span>
              </label>
              <textarea
                className="write-textarea"
                name="content"
                value={form.content}
                placeholder="내용을 입력하세요"
                rows="10"
                onChange={handleChange}
              />
              <span className={`write-counter ${contentLength > 1800 ? "warn" : ""}`}>
                {contentLength} / 2000
              </span>
            </div>

            <div className="write-divider" />

            {/* 버튼 */}
            <div className="write-actions">
              <button
                type="button"
                className="write-btn-cancel"
                onClick={() => navigate(-1)}
              >
                취소
              </button>
              <button type="submit" className="write-btn-submit">
                등록하기
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default QnaWrite;