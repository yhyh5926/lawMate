import React from "react";
import { Link } from "react-router-dom";
import { scrollToTop } from "../../utils/windowUtils"; // 아까 만든 유틸리티
import "../../styles/common/Footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-inner">
        {/* 상단: 사이트 맵 / 주요 링크 */}
        <div className="footer-top">
          <div className="footer-brand">
            <img
              src="/lawMateLogo.png"
              alt="LawMate Logo"
              className="footer-logo"
            />
            <p className="brand-desc">
              당신의 곁에 있는 가장 가까운 법률 파트너, <strong>LawMate</strong>
            </p>
          </div>

          <div className="footer-links-group">
            <div className="link-column">
              <h4>법률 서비스</h4>
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
            <div className="link-column">
              <h4>커뮤니티</h4>
              <Link to="/community/qnalist" onClick={scrollToTop}>
                자유게시판
              </Link>
              <Link to="/community/pollList" onClick={scrollToTop}>
                모의 판결
              </Link>
            </div>
            <div className="link-column">
              <h4>고객지원</h4>
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
          </div>
        </div>

        <hr className="footer-divider" />

        {/* 하단: 사업자 정보 및 면책 공고 */}
        <div className="footer-bottom">
          <div className="company-info">
            <p>
              <span>(주)로우메이트</span> | <span>대표이사: 이은혁</span> |{" "}
              <span>사업자등록번호: 123-45-67890</span>
            </p>
            <p>
              서울특별시 강남구 테헤란로 (비트캠프 8층) | 대표번호: 1588-0000 |
              이메일: support@lawmate.com
            </p>
            <p className="copyright">© 2026 LawMate. All rights reserved.</p>
          </div>

          <div className="disclaimer-box">
            <p className="disclaimer-text">
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
