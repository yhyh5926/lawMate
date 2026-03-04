import React from "react";
import { Link } from "react-router-dom";
import "../../styles/common/Footer.css";

const Footer = () => {
  return (
    <footer className="lawmate-footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <h2 className="footer-logo">⚖️ LawMate</h2>
            <p className="footer-slogan">
              당신의 곁에 있는 가장 가까운 법률 파트너
            </p>
          </div>

          <div className="footer-nav">
            <div className="nav-group">
              <h4>법률 서비스</h4>
              <ul>
                {/* 💡 정의서의 .do 경로 반영 */}
                <li>
                  <Link to="/question/list.do">법률 Q&A</Link>
                </li>
                <li>
                  <Link to="/lawyer/list.do">변호사 찾기</Link>
                </li>
                <li>
                  <Link to="/precedent/search.do">판례 검색</Link>
                </li>
                <li>
                  <Link to="/community/qnalist">커뮤니티</Link>
                </li>
              </ul>
            </div>
            <div className="nav-group">
              <h4>마이페이지</h4>
              <ul>
                <li>
                  <Link to="/mypage/edit.do">정보수정</Link>
                </li>
                <li>
                  <Link to="/mypage/case/list.do">나의 사건목록</Link>
                </li>
                <li>
                  <Link to="/mypage/consult/list.do">상담 예약내역</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="footer-bottom">
          <div className="company-info">
            <div className="info-row">
              <span>
                <strong>(주)로메이트</strong>
              </span>
              <span>사업자등록번호: 2026-03-0303</span>
            </div>
            <div className="info-row">
              <span>
                주소: 서울특별시 금천구 가산디지털2로 115, 502호 (KOSMO 빌딩)
              </span>
              <span>통신판매업신고: 제 2026-서울가산-0001호</span>
            </div>
            <div className="info-row">
              <span>이메일: support@lawmate.com</span>
              <span>CS: 1588-0000 (평일 09:00~18:00)</span>
            </div>
          </div>

          <div className="footer-legal">
            <div className="legal-links">
              {/* 💡 정의서 기반 약관 동의 경로 */}
              <Link to="/member/join/terms.do">이용약관</Link>
              <Link to="/member/join/terms.do" className="bold">
                개인정보처리방침
              </Link>
            </div>
            <p className="copyright">© 2026 LawMate. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
