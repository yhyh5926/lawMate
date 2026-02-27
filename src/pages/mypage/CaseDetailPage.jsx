// vs코드
// 파일 위치: src/pages/mypage/CaseDetailPage.jsx
// 설명: 마이페이지 - 내 사건의 상세 내용 및 진행 스텝을 확인하는 화면

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { caseApi } from "../../api/caseApi";
import CaseStepBar from "../../components/case/CaseStepBar";

const CaseDetailPage = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [caseDetail, setCaseDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetail();
  }, [caseId]);

  const fetchDetail = async () => {
    try {
      const response = await caseApi.getCaseDetail(caseId);
      setCaseDetail(response.data);
    } catch (error) {
      console.error("사건 상세 조회 실패", error);
      // API 오류 시 테스트를 위한 모의 데이터
      setCaseDetail({
        caseId: caseId,
        title: "전세금 반환 청구 소송",
        caseType: "민사",
        description: "집주인이 전세금을 돌려주지 않아 소송을 진행하고 싶습니다. 계약 만료일은 지난 달이었습니다.",
        step: "IN_PROGRESS",
        expertOpinion: "내용증명을 먼저 발송한 뒤, 반환 소송을 제기하는 것이 유리합니다.",
        createdAt: "2026-02-20",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "50px" }}>불러오는 중...</div>;
  if (!caseDetail) return <div style={{ textAlign: "center", padding: "50px" }}>사건 정보를 찾을 수 없습니다.</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
      <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#007BFF", cursor: "pointer", marginBottom: "20px" }}>
        &larr; 목록으로 돌아가기
      </button>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0 }}>{caseDetail.title}</h2>
        <span style={{ padding: "5px 10px", backgroundColor: "#e9ecef", borderRadius: "4px", fontSize: "14px", fontWeight: "bold" }}>
          {caseDetail.caseType}
        </span>
      </div>

      <div style={{ backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "8px", marginBottom: "30px" }}>
        <h4 style={{ marginTop: 0, color: "#333" }}>진행 상태</h4>
        {/* 사건 진행 단계 컴포넌트 출력 */}
        <CaseStepBar currentStep={caseDetail.step} />
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h4 style={{ borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>사건 상세 내용</h4>
        <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.6", color: "#555" }}>
          {caseDetail.description}
        </p>
      </div>

      <div style={{ backgroundColor: "#eef2f5", padding: "20px", borderRadius: "8px" }}>
        <h4 style={{ marginTop: 0, color: "#0056b3" }}>👨‍⚖️ 전문가 의견</h4>
        <p style={{ whiteSpace: "pre-wrap", margin: 0, lineHeight: "1.6" }}>
          {caseDetail.expertOpinion ? caseDetail.expertOpinion : "아직 등록된 전문가 의견이 없습니다."}
        </p>
      </div>
    </div>
  );
};

export default CaseDetailPage;