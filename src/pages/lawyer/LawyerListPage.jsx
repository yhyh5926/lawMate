import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import lawyerApi from "../../api/lawyerApi";

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
        console.error("변호사 목록 로드 중 오류 발생:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLawyers();
  }, []);

  if (loading)
    return (
      <div style={styles.loadingWrapper}>
        <div style={styles.spinner} />
        <p style={styles.loadingText}>변호사 정보를 불러오는 중입니다...</p>
        <style>{spinnerKeyframes}</style>
      </div>
    );

  return (
    <div style={styles.page}>
      <style>{globalStyles}</style>

      {/* Hero Header */}
      <div style={styles.hero}>
        <div style={styles.heroInner}>
          <span style={styles.heroEyebrow}>LEGAL EXPERTS</span>
          <h1 style={styles.heroTitle}>전문 변호사 찾기</h1>
          <p style={styles.heroSub}>
            분야별 검증된 변호사와 신뢰할 수 있는 법률 상담을 시작하세요
          </p>
        </div>
        <div style={styles.heroDeco1} />
        <div style={styles.heroDeco2} />
      </div>

      {/* Count Badge */}
      {lawyers.length > 0 && (
        <div style={styles.countRow}>
          <span style={styles.countBadge}>{lawyers.length}명의 변호사</span>
        </div>
      )}

      {/* Grid */}
      {lawyers.length === 0 ? (
        <p style={styles.empty}>등록된 변호사가 없습니다.</p>
      ) : (
        <div style={styles.grid}>
          {lawyers.map((lawyer, i) => (
            <LawyerCard
              key={lawyer.lawyerId}
              lawyer={lawyer}
              index={i}
              onClick={() => navigate(`/lawyer/detail.do/${lawyer.lawyerId}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────── Card ─────────────────────────────── */

const LawyerCard = ({ lawyer, index, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...styles.card,
        transform: hovered
          ? "translateY(-8px) scale(1.01)"
          : "translateY(0) scale(1)",
        boxShadow: hovered
          ? "0 24px 56px rgba(15, 30, 60, 0.18)"
          : "0 4px 20px rgba(15, 30, 60, 0.07)",
        animationDelay: `${index * 0.06}s`,
      }}
      className="lawyer-card"
    >
      {/* Image */}
      <div style={styles.imgWrap}>
        <img
          src={
            lawyer.savePath
              ? `http://localhost:8080${lawyer.savePath}`
              : DEFAULT_IMAGE
          }
          alt={lawyer.name}
          style={{
            ...styles.img,
            transform: hovered ? "scale(1.06)" : "scale(1)",
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DEFAULT_IMAGE;
          }}
        />
        {/* Specialty badge over image */}
        <div style={styles.specialty}>{lawyer.specialty}</div>
      </div>

      {/* Body */}
      <div style={styles.body}>
        <div style={styles.nameRow}>
          <h3 style={styles.name}>{lawyer.name}</h3>
          <span style={styles.nameLabel}>변호사</span>
        </div>

        <p style={styles.office}>{lawyer.officeName}</p>

        <p style={styles.intro}>{lawyer.intro}</p>

        {/* Rating */}
        <div style={styles.ratingRow}>
          <span style={styles.stars}>
            {"★".repeat(Math.round(lawyer.avgRating || 0))}
            {"☆".repeat(5 - Math.round(lawyer.avgRating || 0))}
          </span>
          <span style={styles.ratingNum}>{lawyer.avgRating?.toFixed(1)}</span>
          <span style={styles.reviewCnt}>({lawyer.reviewCnt}개 후기)</span>
        </div>

        {/* Divider */}
        <div style={styles.divider} />

        {/* Price + CTA */}
        <div style={styles.footer}>
          <div>
            <span style={styles.feeLabel}>상담료</span>
            <span style={styles.fee}>
              {lawyer.consultFee?.toLocaleString()}
              <span style={styles.feeUnit}>원</span>
            </span>
          </div>
          <div
            style={{
              ...styles.ctaBtn,
              background: hovered ? "#1a3a6e" : "#1e4d8c",
            }}
          >
            상담 신청 →
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────── Styles ─────────────────────────────── */

const spinnerKeyframes = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;600;700&family=Noto+Sans+KR:wght@400;500;600&display=swap');

  .lawyer-card {
    animation: fadeUp 0.55s ease both;
    transition: transform 0.35s cubic-bezier(.22,.84,.44,1),
                box-shadow 0.35s cubic-bezier(.22,.84,.44,1);
  }
`;

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6fb",
    fontFamily: "'Noto Sans KR', sans-serif",
    paddingBottom: "60px",
  },

  /* Loading */
  loadingWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    gap: "16px",
  },
  spinner: {
    width: "44px",
    height: "44px",
    border: "4px solid #dde3f0",
    borderTopColor: "#1e4d8c",
    borderRadius: "50%",
    animation: "spin 0.85s linear infinite",
  },
  loadingText: {
    color: "#667",
    fontSize: "0.95rem",
    fontFamily: "'Noto Sans KR', sans-serif",
  },

  /* Hero */
  hero: {
    position: "relative",
    overflow: "hidden",
    background:
      "linear-gradient(135deg, #0f2244 0%, #1e4d8c 55%, #2d6bc4 100%)",
    padding: "72px 32px 64px",
    textAlign: "center",
    marginBottom: "0",
  },
  heroInner: {
    position: "relative",
    zIndex: 2,
    maxWidth: "640px",
    margin: "0 auto",
  },
  heroEyebrow: {
    display: "inline-block",
    letterSpacing: "0.3em",
    fontSize: "0.72rem",
    color: "#8ab4f8",
    fontWeight: "600",
    marginBottom: "14px",
    textTransform: "uppercase",
  },
  heroTitle: {
    fontFamily: "'Noto Serif KR', serif",
    fontSize: "clamp(2rem, 5vw, 3rem)",
    fontWeight: "700",
    color: "#ffffff",
    margin: "0 0 16px",
    lineHeight: "1.2",
  },
  heroSub: {
    color: "#a8c4e8",
    fontSize: "1rem",
    lineHeight: "1.7",
    margin: "0",
  },
  heroDeco1: {
    position: "absolute",
    top: "-80px",
    right: "-80px",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.04)",
    zIndex: 1,
  },
  heroDeco2: {
    position: "absolute",
    bottom: "-60px",
    left: "-60px",
    width: "220px",
    height: "220px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.05)",
    zIndex: 1,
  },

  /* Count */
  countRow: {
    padding: "20px 40px 0",
    maxWidth: "1280px",
    margin: "0 auto",
  },
  countBadge: {
    display: "inline-block",
    background: "#e8eef8",
    color: "#1e4d8c",
    fontSize: "0.8rem",
    fontWeight: "700",
    padding: "5px 14px",
    borderRadius: "20px",
    letterSpacing: "0.03em",
  },

  /* Grid */
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "28px",
    padding: "24px 40px 0",
    maxWidth: "1280px",
    margin: "0 auto",
  },

  empty: {
    textAlign: "center",
    marginTop: "80px",
    color: "#999",
  },

  /* Card */
  card: {
    background: "#ffffff",
    borderRadius: "20px",
    overflow: "hidden",
    cursor: "pointer",
    border: "1px solid #e8edf5",
    display: "flex",
    flexDirection: "column",
  },

  /* Image area */
  imgWrap: {
    position: "relative",
    width: "100%",
    height: "240px",
    overflow: "hidden",
    background: "#e8edf5",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center top",
    transition: "transform 0.45s cubic-bezier(.22,.84,.44,1)",
  },
  specialty: {
    position: "absolute",
    bottom: "12px",
    left: "14px",
    background: "rgba(255,255,255,0.95)",
    color: "#1e4d8c",
    fontSize: "0.73rem",
    fontWeight: "700",
    padding: "4px 12px",
    borderRadius: "20px",
    letterSpacing: "0.04em",
    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
  },

  /* Card body */
  body: {
    padding: "20px 22px 22px",
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  nameRow: {
    display: "flex",
    alignItems: "baseline",
    gap: "6px",
    marginBottom: "4px",
  },
  name: {
    fontFamily: "'Noto Serif KR', serif",
    fontSize: "1.2rem",
    fontWeight: "700",
    color: "#0f2244",
    margin: 0,
  },
  nameLabel: {
    fontSize: "0.8rem",
    color: "#8899bb",
    fontWeight: "500",
  },
  office: {
    fontSize: "0.82rem",
    color: "#2d6bc4",
    fontWeight: "600",
    margin: "0 0 10px",
  },
  intro: {
    fontSize: "0.87rem",
    color: "#667",
    lineHeight: "1.55",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    margin: "0 0 12px",
    flex: 1,
  },

  /* Rating */
  ratingRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "14px",
  },
  stars: {
    color: "#f5a623",
    fontSize: "0.85rem",
    letterSpacing: "1px",
  },
  ratingNum: {
    fontWeight: "700",
    fontSize: "0.88rem",
    color: "#0f2244",
  },
  reviewCnt: {
    fontSize: "0.78rem",
    color: "#aab",
  },

  divider: {
    height: "1px",
    background: "#edf0f7",
    margin: "0 0 14px",
  },

  /* Footer */
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "auto",
  },
  feeLabel: {
    display: "block",
    fontSize: "0.7rem",
    color: "#aab",
    fontWeight: "500",
    letterSpacing: "0.05em",
    marginBottom: "2px",
  },
  fee: {
    fontSize: "1.18rem",
    fontWeight: "800",
    color: "#c0392b",
    fontFamily: "'Noto Serif KR', serif",
  },
  feeUnit: {
    fontSize: "0.8rem",
    fontWeight: "600",
    marginLeft: "2px",
  },
  ctaBtn: {
    padding: "8px 16px",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "0.8rem",
    fontWeight: "700",
    letterSpacing: "0.03em",
    transition: "background 0.2s ease",
    flexShrink: 0,
  },
};

export default LawyerListPage;
