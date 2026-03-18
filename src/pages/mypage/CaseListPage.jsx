import React, { useEffect, useState } from "react";
import { caseApi } from "../../api/caseApi";
import CaseCard from "../../components/case/CaseCard";
import "../../styles/mypage/CaseListPage.css"; // CSS 연결

const CaseListPage = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyCases();
  }, []);

  const fetchMyCases = async () => {
    try {
      const response = await caseApi.getMyCaseList(1);
      setCases(response.data || []);
    } catch (error) {
      console.error("사건 목록 조회 실패", error);
      setCases([
        {
          caseId: 1,
          title: "전세금 반환 청구 소송",
          caseType: "민사",
          step: "IN_PROGRESS",
          createdAt: "2026-02-20",
        },
        {
          caseId: 2,
          title: "명예훼손 고소건",
          caseType: "형사",
          step: "RECEIVED",
          createdAt: "2026-02-25",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="case-list-container">
      <div className="case-list-header">
        <h2>내 사건 목록</h2>
        <span className="case-count">
          총 <b>{cases.length}</b>건의 사건이 있습니다.
        </span>
      </div>

      {loading ? (
        <div className="case-list-loading">
          ⚖️ 사건 정보를 불러오는 중입니다...
        </div>
      ) : cases.length === 0 ? (
        <div className="case-list-empty">등록된 사건이 없습니다.</div>
      ) : (
        <div className="case-grid">
          {cases.map((c) => (
            <CaseCard key={c.caseId} caseItem={c} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CaseListPage;
