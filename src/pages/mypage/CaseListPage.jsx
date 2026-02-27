// vs코드
// 파일 위치: src/pages/mypage/CaseListPage.jsx
// 설명: 마이페이지 - 의뢰인이 접수한 내 사건 목록 화면

import React, { useEffect, useState } from "react";
import { caseApi } from "../../api/caseApi";
import CaseCard from "../../components/case/CaseCard";

const CaseListPage = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyCases();
  }, []);

  const fetchMyCases = async () => {
    try {
      // 실제 환경에서는 현재 로그인한 유저의 ID를 넘기거나, 백엔드에서 JWT를 통해 식별합니다.
      // 여기서는 임시로 memberId 1을 넘기는 형태로 작성합니다.
      const response = await caseApi.getMyCaseList(1);
      setCases(response.data || []);
    } catch (error) {
      console.error("사건 목록을 불러오는데 실패했습니다.", error);
      // API 연결 실패 시 보여줄 임시 모의 데이터 (테스트용)
      setCases([
        { caseId: 1, title: "전세금 반환 청구 소송", caseType: "민사", step: "IN_PROGRESS", createdAt: "2026-02-20" },
        { caseId: 2, title: "명예훼손 고소건", caseType: "형사", step: "RECEIVED", createdAt: "2026-02-25" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
      <h2 style={{ marginBottom: "30px", borderBottom: "2px solid #333", paddingBottom: "10px" }}>내 사건 목록</h2>
      
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px 0" }}>불러오는 중...</div>
      ) : cases.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px 0", color: "#888" }}>등록된 사건이 없습니다.</div>
      ) : (
        <div style={{ display: "grid", gap: "15px" }}>
          {cases.map((c) => (
            <CaseCard key={c.caseId} caseItem={c} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CaseListPage;