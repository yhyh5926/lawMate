import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { questionApi } from "../../api/questionApi.js";

const QuestionListPage = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchQuestions();
  }, [filter]);

  const fetchQuestions = async () => {
    try {
      const response = await questionApi.getQuestionList(
        filter ? { caseType: filter } : {},
      );
      setQuestions(response.data.data || []);
    } catch (error) {
      console.error("질문 목록 조회 실패", error);
      // 테스트용 모의 데이터 (memberName, answerCount 추가)
      setQuestions([
        {
          questionId: 1,
          title: "전세금 반환을 받지 못하고 있습니다.",
          caseType: "민사",
          status: "ADOPTED",
          memberName: "김철수",
          answerCount: 3,
          createdAt: "2026-02-27",
        },
        {
          questionId: 2,
          title: "음주운전 초범인데 어떻게 해야 하나요?",
          caseType: "형사",
          status: "WAITING",
          memberName: "이영희",
          answerCount: 0,
          createdAt: "2026-02-26",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          borderBottom: "2px solid #333",
          paddingBottom: "10px",
        }}
      >
        <h2 style={{ margin: 0 }}>⚖️ 법률 질문 게시판</h2>
        <button
          onClick={() => navigate("/question/write")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          질문 작성하기
        </button>
      </div>

      {/* 필터 영역 */}
      <div style={{ marginBottom: "20px" }}>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        >
          <option value="">전체 유형</option>
          <option value="민사">민사</option>
          <option value="형사">형사</option>
          <option value="가사">가사</option>
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          불러오는 중...
        </div>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#f8f9fa",
                borderBottom: "2px solid #ddd",
              }}
            >
              <th style={{ padding: "15px 10px", width: "8%" }}>번호</th>
              <th style={{ padding: "15px 10px", width: "12%" }}>유형</th>
              <th style={{ padding: "15px 10px", width: "40%" }}>제목</th>
              <th style={{ padding: "15px 10px", width: "12%" }}>작성자</th>
              <th style={{ padding: "15px 10px", width: "13%" }}>상태</th>
              <th style={{ padding: "15px 10px", width: "15%" }}>등록일</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q.questionId} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "15px 10px" }}>{q.questionId}</td>
                <td style={{ padding: "15px 10px" }}>
                  <span
                    style={{
                      backgroundColor: "#e9ecef",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                    }}
                  >
                    {q.caseType}
                  </span>
                </td>
                <td style={{ padding: "15px 10px" }}>
                  <Link
                    to={`/question/detail/${q.questionId}`}
                    style={{
                      textDecoration: "none",
                      color: "#333",
                      fontWeight: "bold",
                    }}
                  >
                    {q.title}
                    {/* 답변 개수 표시 */}
                    {q.answerCount > 0 && (
                      <span
                        style={{
                          color: "#007BFF",
                          marginLeft: "8px",
                          fontSize: "13px",
                        }}
                      >
                        [{q.answerCount}]
                      </span>
                    )}
                  </Link>
                </td>
                {/* 작성자 이름 컬럼 */}
                <td style={{ padding: "15px 10px", color: "#555" }}>
                  {q.memberName}
                </td>
                <td
                  style={{
                    padding: "15px 10px",
                    color: q.status === "ADOPTED" ? "#28a745" : "#fd7e14",
                    fontWeight: "bold",
                  }}
                >
                  {q.status === "ADOPTED" ? "채택완료" : "채택대기"}
                </td>
                <td
                  style={{
                    padding: "15px 10px",
                    fontSize: "14px",
                    color: "#666",
                  }}
                >
                  {q.createdAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default QuestionListPage;
