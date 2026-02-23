import { useParams, useNavigate } from "react-router-dom";
import { mockLawyers } from "../../mocks/lawyer/mockLawyers";
import "../../styles/lawyer/lawyerDetail.css";
import  useAuthStore  from "../../zustand/auth_store";

export default function LawyerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const lawyer = mockLawyers.find((l) => l.id === id);
  const user = useAuthStore((state) => state.user);

  if (!lawyer)
    return (
      <div className="lawyer-detail-empty">변호사를 찾을 수 없습니다.</div>
    );

  const handleConsultClick = () => {
    if (!user) {
      alert("로그인이 필요합니다");
      navigate("/login");
      return;
    }
    navigate(`/consult/${lawyer.id}`);
  };

  return (
    <div className="lawyer-detail-container">
      {/* 상단 프로필 영역 */}
      <div className="lawyer-detail-header">
        <img
          src={lawyer.image}
          alt={lawyer.name}
          className="lawyer-detail-image"
        />

        <div className="lawyer-detail-info">
          <h1 className="lawyer-detail-name">{lawyer.name}</h1>

          <p className="lawyer-detail-rating">
            ⭐ {lawyer.rating} ({lawyer.reviewCount}건 리뷰)
          </p>

          <p className="lawyer-detail-location">{lawyer.location}</p>

          <button className="lawyer-detail-button" onClick={handleConsultClick}>
            상담 신청하기
          </button>
        </div>
      </div>

      <div className="lawyer-detail-divider" />

      <div className="lawyer-detail-section">
        <h3 className="lawyer-detail-section-title">전문분야</h3>
        <p className="lawyer-detail-text">{lawyer.specialties.join(", ")}</p>
      </div>

      <div className="lawyer-detail-section">
        <h3 className="lawyer-detail-section-title">경력</h3>
        <p className="lawyer-detail-text">{lawyer.careerYears}년</p>
      </div>

      <div className="lawyer-detail-section">
        <h3 className="lawyer-detail-section-title">소개</h3>
        <p className="lawyer-detail-text">{lawyer.introduction}</p>
      </div>

      <div className="lawyer-detail-section">
        <h3 className="lawyer-detail-section-title">대표 성공 사례</h3>
        <ul className="lawyer-detail-case-list">
          {lawyer.cases.map((c, index) => (
            <li key={index} className="lawyer-detail-case-item">
              {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
