import React from "react";
import { Link } from "react-router-dom";
import { scrollToTop } from "../../utils/windowUtils";
import "../../styles/common/Footer.css";

const Footer = () => {
  return (
    <footer className="ft-container">
      <div className="ft-inner">
        {/* ── TOP: Brand & Site Map ── */}
        <div className="ft-top">
          <div className="ft-brand">
            <div className="ft-logo-wrap">
              <img src="/lawMateLogo.png" alt="LawMate" className="ft-logo" />
              <span className="ft-logo-text">LAWMATE</span>
            </div>
            <p className="ft-brand-desc">
              당신의 곁에 있는 가장 가까운 법률 파트너
              <br />
              <strong>LawMate</strong>가 함께하겠습니다.
            </p>
          </div>

          <nav className="ft-nav">
            <div className="ft-link-col">
              <h4 className="ft-link-title">법률 서비스</h4>
              <Link to="/precedent/search" onClick={scrollToTop}>
                판례검색
              </Link>
              <Link to="/lawyer/list" onClick={scrollToTop}>
                변호사 찾기
              </Link>
              <Link to="/question/list" onClick={scrollToTop}>
                법률질문
              </Link>
            </div>
            <div className="ft-link-col">
              <h4 className="ft-link-title">커뮤니티</h4>
              <Link to="/community/qnalist" onClick={scrollToTop}>
                자유 게시판
              </Link>
              <Link to="/community/pollList" onClick={scrollToTop}>
                의견 조사 게시판
              </Link>
            </div>
            <div className="ft-link-col">
              <h4 className="ft-link-title">고객지원</h4>
              <Link to="/member/join/terms" onClick={scrollToTop}>
                이용약관
              </Link>
              <Link to="/member/join/terms" onClick={scrollToTop}>
                개인정보처리방침
              </Link>
              <Link to="/mypage/main" onClick={scrollToTop}>
                마이페이지
              </Link>
            </div>
          </nav>
        </div>

        <hr className="ft-divider" />

        {/* ── BOTTOM: Company Info & Disclaimer ── */}
        <div className="ft-bottom">
          <div className="ft-company-info">
            <div className="ft-company-row">
              <span>(주)로우메이트</span>
              <span className="ft-sep"></span>
              <span>대표이사: 이은혁</span>
              <span className="ft-sep"></span>
              <span>사업자등록번호: 123-45-67890</span>
            </div>
            <p className="ft-address">
              서울특별시 강남구 테헤란로 (비트캠프 8층) | 대표번호: 1588-0000 |
              이메일: support@lawmate.com
            </p>
            <p className="ft-copyright">© 2026 LawMate. All rights reserved.</p>
          </div>

          <div className="ft-disclaimer">
            <p>
              <strong>[면책공고]</strong> LawMate에서 제공하는 법률 정보 및
              변호사의 답변은 참고용이며, 어떠한 경우에도 법적 책임의 근거가 될
              수 없습니다. 정확한 법률 판단을 위해서는 반드시 변호사와 유료
              상담을 진행하시기 바랍니다.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
