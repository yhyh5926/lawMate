import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import lawyerApi from "../../api/lawyerApi";
import "../../styles/lawyer/LawyerListPage.css";

export const DEFAULT_IMAGE =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

const LawyerListPage = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        setLoading(true);
        const data = await lawyerApi.getAllLawyers();
        setLawyers(data);
      } catch (err) {
        console.error("데이터 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLawyers();
  }, []);

  if (loading)
    return (
      <div className="lawyer-list-loading-wrapper">
        <div className="lawyer-list-spinner" />
      </div>
    );

  console.log(lawyers);
  return (
    <div className="lawyer-list-page">
      <header className="lawyer-list-hero">
        <div className="lawyer-list-hero-inner">
          <h1 className="lawyer-list-hero-title">전문 변호사 찾기</h1>
          <p className="lawyer-list-hero-sub">
            분야별 최고의 전문가들이 당신의 권리를 지켜드립니다.
          </p>
        </div>
      </header>

      <main className="lawyer-list-grid">
        {lawyers.map((lawyer) => (
          <article
            key={lawyer.lawyerId}
            className="lawyer-list-card"
            onClick={() => navigate(`/lawyer/detail.do/${lawyer.lawyerId}`)}
          >
            {/* 1. 이미지 크기 최적화를 위한 래퍼 */}
            <div className="lawyer-list-img-wrap">
              <img
                src={
                  lawyer.savePath
                    ? `http://localhost:8080${lawyer.savePath}`
                    : DEFAULT_IMAGE
                }
                className="lawyer-list-img"
                alt={lawyer.name}
                onError={(e) => {
                  e.target.src = DEFAULT_IMAGE;
                }}
              />
              <div className="lawyer-list-specialty">{lawyer.specialty}</div>
            </div>

            <div className="lawyer-list-body">
              <div className="lawyer-list-name-row">
                <div>
                  <h3 className="lawyer-list-name">{lawyer.name}</h3>
                  <span className="lawyer-list-office">
                    {lawyer.officeName}
                  </span>
                </div>
                {/* 2. 별점 및 후기 표시 추가 */}
                <div className="lawyer-list-rating-box">
                  <span className="star-icon">⭐</span>
                  <span className="rating-value">
                    {lawyer.avgRating?.toFixed(1) || "0.0"}
                  </span>
                  <span className="review-count">
                    ({lawyer.reviewCnt || 0})
                  </span>
                </div>
              </div>

              <p className="lawyer-list-intro">{lawyer.intro}</p>

              <div className="lawyer-list-divider" />

              <div className="lawyer-list-btn-group">
              <button
                className="lawyer-list-cta-btn lawyer-list-btn-chat"
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    const { getOrCreateChatRoom } = await import('../../api/chatApi');
                    const res = await getOrCreateChatRoom(lawyer.memberId);
                    const roomNo = res.data.data.roomNo;
                    navigate(`/chat/room.do?roomNo=${roomNo}`);
                  } catch (err) {
                    alert('채팅방 생성에 실패했습니다. 로그인이 필요합니다.');
                  }
                }}
              >
                💬 채팅상담
              </button>
                <button className="lawyer-list-cta-btn lawyer-list-btn-apply">
                  상담신청
                </button>
              </div>
            </div>
          </article>
        ))}
      </main>
    </div>
  );
};

export default LawyerListPage;
