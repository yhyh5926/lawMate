// vs코드
// 파일 위치: src/pages/question/QuestionDetailPage.jsx
// 설명: 법률 질문 상세 내용 및 변호사 답변 확인 화면

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { questionApi } from "../../api/questionApi.js";

const QuestionDetailPage = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetail();
  }, [questionId]);

  const fetchDetail = async () => {
    try {
      const response = await questionApi.getQuestionDetail(questionId);
      setDetail(response.data.data);
    } catch (error) {
      console.error("질문 상세 조회 실패", error);
      // 테스트용 모의 데이터
      setDetail({
        questionId,
        title: "전세금 반환을 받지 못하고 있습니다.",
        content: "집주인이 다음 세입자가 들어와야 돈을 줄 수 있다고 배째라 식으로 나옵니다. 어떻게 법적으로 대응해야 하나요?",
        caseType: "민사",
        status: "ANSWERED",
        createdAt: "2026-02-27",
        answer: {
          lawyerName: "김변호",
          content: "우선 내용증명을 발송하여 심리적 압박을 가하고, 임차권등기명령을 신청하시는 것이 좋습니다. 이후 지급명령이나 반환소송을 진행할 수 있습니다.",
          createdAt: "2026-02-27 14:00"
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "50px" }}>불러오는 중...</div>;
  if (!detail) return <div style={{ textAlign: "center", padding: "50px" }}>질문을 찾을 수 없습니다.</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
      <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#007BFF", cursor: "pointer", marginBottom: "20px" }}>
        &larr; 목록으로 돌아가기
      </button>

      <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "30px", marginBottom: "30px", backgroundColor: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "15px" }}>
          <h2 style={{ margin: 0 }}>{detail.title}</h2>
          <span style={{ backgroundColor: "#e9ecef", padding: "6px 12px", borderRadius: "4px", fontSize: "14px", fontWeight: "bold" }}>
            {detail.caseType}
          </span>
        </div>
        
        <div style={{ display: "flex", gap: "15px", fontSize: "14px", color: "#888", marginBottom: "20px" }}>
          <span>작성일: {detail.createdAt}</span>
          <span>상태: <strong style={{ color: detail.status === 'ANSWERED' ? '#28a745' : '#dc3545' }}>{detail.status === 'ANSWERED' ? '답변완료' : '답변대기'}</strong></span>
        </div>

        <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.6", color: "#333", minHeight: "150px" }}>
          {detail.content}
        </p>
      </div>

      <h3 style={{ borderBottom: "2px solid #333", paddingBottom: "10px", marginBottom: "20px" }}>변호사 답변</h3>
      
      {detail.answer ? (
        <div style={{ backgroundColor: "#f8f9fa", borderLeft: "4px solid #28a745", padding: "20px", borderRadius: "4px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
            <strong style={{ fontSize: "16px", color: "#28a745" }}>👨‍⚖️ {detail.answer.lawyerName} 변호사</strong>
            <span style={{ fontSize: "14px", color: "#888" }}>{detail.answer.createdAt}</span>
          </div>
          <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.6", margin: 0, color: "#444" }}>
            {detail.answer.content}
          </p>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#f8f9fa", borderRadius: "8px", color: "#666" }}>
          아직 등록된 답변이 없습니다. 변호사님이 답변을 검토 중입니다.
        </div>
      )}
    </div>
  );
};

export default QuestionDetailPage;