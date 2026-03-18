import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPost, updatePost } from "../../api/communityApi";
import "../../styles/community/QnaWrite.css";

const QnaEdit = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    postId: "",
    caseType: "",
    title: "",
    content: "",
  });

  const fetchPostDetail = async () => {
    try {
      const data = await getPost(postId);
      setForm({
        postId: data.postId,
        caseType: data.caseType || "",
        title: data.title || "",
        content: data.content || "",
      });
    } catch (error) {
      console.error("게시글 불러오기 실패:", error);
      alert("게시글 정보를 불러오지 못했습니다.");
    }
  };
  useEffect(() => {
    fetchPostDetail();
  }, [postId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.caseType) {
      alert("분류를 선택해주세요.");
      return;
    }
    if (!form.title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!form.content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      await updatePost({
        postId: form.postId,
        caseType: form.caseType,
        title: form.title,
        content: form.content,
      });
      alert("게시글이 수정되었습니다.");
      navigate(`/community/detail/${postId}`);
    } catch (error) {
      console.error("게시글 수정 실패:", error);
      alert("게시글 수정 실패");
    }
  };

  const contentLength = form.content.length;

  return (
    <div className="write-wrapper">
      <div className="write-container">
        <h2 className="write-page-title">게시글 수정</h2>

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
              <span
                className={`write-counter ${contentLength > 1800 ? "warn" : ""}`}
              >
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
                수정완료
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QnaEdit;
