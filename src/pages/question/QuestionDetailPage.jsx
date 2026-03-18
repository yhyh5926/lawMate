import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { questionApi } from "../../api/questionApi.js";
import { useAuthStore } from "../../store/authStore.js";
import QuestionAnswerForm from "../../components/question/QuestionAnswerForm.jsx";
import QuestionEditForm from "../../components/question/QuestionEditForm.jsx";
import "../../styles/question/QuestionDetailPage.css";
import { formatDate } from "../../utils/formatDate.js";
import { baseURL } from "../../constants/baseURL.js";
import QuestionAnswerList from "../../components/question/QuestionAnswerList.jsx";
import { scrollToTop } from "../../utils/windowUtils.js";

const QuestionDetailPage = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // 💡 선택된 메인 이미지의 인덱스 상태 (기본값: 0)
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);

  const { user, isAuthenticated } = useAuthStore();

  const isLawyer = isAuthenticated && user?.role === "LAWYER";
  const isQuestionOwner =
    isAuthenticated && String(user?.memberId) === String(detail?.memberId);
  const isAlreadyAdopted = detail?.status === "ADOPTED";
  const hasAnswers = detail?.answers?.length > 0;
  const hasAlreadyAnswered = detail?.answers?.some(
    (ans) => ans.lawyerId === user?.lawyerId,
  );

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const response = await questionApi.getQuestionDetail(questionId);
      setDetail(response.data.data);
    } catch (error) {
      console.error("질문 상세 조회 실패", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
    scrollToTop();
  }, [questionId]);

  // 💡 이미지 파일과 일반 파일 분류
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
  const imageFiles =
    detail?.files?.filter((f) =>
      imageExtensions.includes(f.origName.split(".").pop().toLowerCase()),
    ) || [];
  const otherFiles =
    detail?.files?.filter(
      (f) =>
        !imageExtensions.includes(f.origName.split(".").pop().toLowerCase()),
    ) || [];

  const handleDeleteQuestion = async () => {
    if (hasAnswers)
      return alert("이미 답변이 등록된 질문은 삭제할 수 없습니다.");
    if (!window.confirm("정말로 이 질문을 삭제하시겠습니까?")) return;
    try {
      const res = await questionApi.deleteQuestion(questionId);
      if (res.data.success) {
        alert("삭제되었습니다.");
        navigate("/question/list");
      }
    } catch (error) {
      alert("삭제 실패", error);
    }
  };

  if (loading)
    return (
      <div className="loading-spinner-container">데이터를 불러오는 중...</div>
    );
  if (!detail) return <div className="error-msg">질문을 찾을 수 없습니다.</div>;

  console.log(detail);
  return (
    <div className="question-detail-container">
      <section className="question-card">
        {isEditing ? (
          <QuestionEditForm
            detail={detail}
            onSaveSuccess={() => {
              setIsEditing(false);
              fetchDetail();
            }}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <div className="question-header-top">
              <span className="case-type-badge">{detail.caseType}</span>
            </div>
            <h2 className="question-title">{detail.title}</h2>
            <div className="status-row">
              <div className="question-meta">
                작성자 <strong>{detail.memberName}</strong> |{" "}
                {formatDate(detail.createdAt)}
              </div>
              <div
                className={`status-badge ${isAlreadyAdopted ? "is-adopted" : "is-waiting"}`}
              >
                {isAlreadyAdopted ? "채택완료" : "채택대기"}
              </div>
            </div>

            {/* 🖼️ 갤러리 뷰 (큰 이미지 + 하단 썸네일) */}
            {imageFiles.length > 0 && (
              <div className="image-gallery-container">
                {/* 메인 이미지 영역 */}
                <div className="main-image-view">
                  <img
                    src={baseURL + imageFiles[selectedImgIdx]?.savePath}
                    alt="메인 이미지"
                    className="gallery-main-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/no-image.png";
                    }}
                  />
                </div>

                {/* 하단 썸네일 리스트 (이미지가 2개 이상일 때만 노출) */}
                {imageFiles.length > 1 && (
                  <div className="thumbnail-list">
                    {imageFiles.map((file, idx) => (
                      <button
                        key={file.attachId}
                        className={`thumb-item ${selectedImgIdx === idx ? "active" : ""}`}
                        onClick={() => setSelectedImgIdx(idx)}
                      >
                        <img
                          src={baseURL + file.savePath}
                          alt={`썸네일 ${idx}`}
                          className="thumb-img"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="question-content-text">{detail.content}</div>

            {/* 📎 일반 첨부 파일 리스트 (이미지 제외) */}
            {otherFiles.length > 0 && (
              <div className="detail-file-section">
                <p className="file-label">첨부파일 ({otherFiles.length})</p>
                <div className="file-list-box">
                  {otherFiles.map((file) => (
                    <a
                      key={file.attachId}
                      href={`/api/files/download/${file.attachId}`}
                      className="download-link"
                    >
                      <span className="icon">💾</span> {file.origName}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="question-footer-actions">
              {isQuestionOwner && !isAlreadyAdopted && (
                <div className="owner-control-group">
                  <button
                    className="action-btn edit"
                    onClick={() => setIsEditing(true)}
                  >
                    질문 수정
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={handleDeleteQuestion}
                  >
                    질문 삭제
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </section>

      {/* 2. 답변 작성 영역 (변호사) */}
      {isLawyer && !hasAlreadyAnswered && !isAlreadyAdopted && (
        <section className="answer-form-section">
          <QuestionAnswerForm
            questionId={questionId}
            onAnswerSuccess={fetchDetail}
          />
        </section>
      )}

      <QuestionAnswerList
        questionId={questionId}
        user={user}
        isQuestionOwner={isQuestionOwner}
        isAlreadyAdopted={isAlreadyAdopted}
        onAdoptSuccess={fetchDetail}
      />

      <div className="footer-nav">
        <button
          className="btn-back-list"
          onClick={() => navigate("/question/list")}
        >
          목록으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default QuestionDetailPage;
