import { useNavigate } from "react-router-dom";

export default function HeroBanner({ onWrite }) {
  const navigate = useNavigate();

  return (
    <section className="hero" aria-label="SmartLaw hero">
      <div className="heroInner">
        <div className="heroLeft">
          <div className="heroPills">
            <span className="pill">AI 맞춤 추천</span>
            <span className="pill">판례 검색</span>
            <span className="pill">법률 상담</span>
          </div>

          <h1 className="heroTitle">AI 기반 스마트 법률 플랫폼</h1>
          <p className="heroText">
            사건 통계부터 판례 검색, AI 추천까지 한 번에.
            <br />
            필요한 정보를 빠르게 찾고 상담 글도 바로 작성하세요.
          </p>

          <div className="heroActions">
            <button
              className="btn btnPrimary"
              type="button"
              onClick={() => navigate("/precedent")}
            >
              판례 검색하기
            </button>

            <button
              className="btn btnGhost"
              type="button"
              onClick={() => (onWrite ? onWrite() : navigate("/community/qna/write"))}
            >
              상담 글쓰기
            </button>
          </div>
        </div>

        <div className="heroRight" aria-hidden="true">
          <div className="heroStat">
            <div className="heroStatLabel">오늘의 사건</div>
            <div className="heroStatValue">+128</div>
          </div>
          <div className="heroStat">
            <div className="heroStatLabel">이번 주 판례</div>
            <div className="heroStatValue">3,420</div>
          </div>
          <div className="heroStat">
            <div className="heroStatLabel">AI 추천</div>
            <div className="heroStatValue">맞춤형</div>
          </div>
        </div>
      </div>
    </section>
  );
}
