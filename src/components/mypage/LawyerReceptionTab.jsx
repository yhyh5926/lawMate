// src/components/mypage/LawyerReceptionTab.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { caseApi } from "../../api/caseApi"; 
import { useAuthStore } from "../../store/authStore";
import "../../styles/mypage/LawyerReceptionTab.css"; 

const LawyerReceptionTab = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  // 컴포넌트 열릴 때 내(변호사) 사건 목록 불러오기
  useEffect(() => {
    const fetchLawyerCases = async () => {
      if (!user?.memberId) return;
      
      setLoading(true);
      try {
        const response = await caseApi.getMyCaseList(user.memberId);
        
        // 백엔드 응답 형태에 맞춰 데이터 추출
        const data = response.data?.data || response.data || [];
        setCases(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("접수된 사건 목록을 불러오는데 실패했습니다.", error);
        setCases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLawyerCases();
  }, [user]);

  // 진행 단계에 따른 배지(Badge) 클래스명 매핑
  const getStatusBadgeClass = (status) => {
    const statusMap = {
      0: "step-receive", 1: "step-assign", 2: "step-progress", 3: "step-opinion", 4: "step-end",
      "접수": "step-receive", "배정": "step-assign", "진행 중": "step-progress", "의견 완료": "step-opinion", "종료": "step-end"
    };
    return statusMap[status] || "step-default";
  };

  const getStatusText = (status) => {
    const textMap = {
      0: "접수", 1: "배정", 2: "진행 중", 3: "의견 완료", 4: "종료"
    };
    return textMap[status] || status || "알 수 없음";
  };

  return (
    <div className="reception-mgmt-wrapper">
      {/* 상단 헤더 영역 */}
      <div className="reception-header">
        <h3 className="content-title">접수 관리 (사건 목록)</h3>
        {/* 💡 기획 변경으로 인한 '정식 사건 등록' 버튼 제거됨 */}
      </div>

      {/* 접수 내역 테이블 영역 */}
      <div className="reception-content">
        {loading ? (
          <div className="reception-message">데이터를 불러오는 중입니다...</div>
        ) : cases.length === 0 ? (
          <div className="reception-message empty">
            현재 접수/담당 중인 사건 내역이 없습니다.
          </div>
        ) : (
          <table className="reception-table">
            <thead>
              <tr>
                <th className="th-title">사건 제목</th>
                <th className="th-type">유형</th>
                <th className="th-status">진행 단계</th>
                <th className="th-date">접수일</th>
                <th className="th-action">상세</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((item) => (
                <tr key={item.caseId || item.id}>
                  <td className="td-title">
                    {item.title || "제목 없음"}
                  </td>
                  <td className="td-type">
                    {item.caseType || item.type || "일반"}
                  </td>
                  <td className="td-status">
                    <span className={`status-badge ${getStatusBadgeClass(item.status)}`}>
                      {getStatusText(item.status)}
                    </span>
                  </td>
                  <td className="td-date">
                    {item.createdAt || item.date || "-"}
                  </td>
                  <td className="td-action">
                    {/* 상세 보기 버튼 */}
                    <button 
                      className="btn-detail-view"
                      onClick={() => navigate(`/mypage/case/detail/${item.caseId || item.id}`)}
                    >
                      상세 보기
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LawyerReceptionTab;