// vs코드
// 파일 위치: src/pages/question/QuestionWritePage.jsx
// 설명: 법률 질문 등록 화면

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { questionApi } from "../../api/questionApi.js";
import { useAuth } from "../../hooks/useAuth.js";

const QuestionWritePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    caseType: "민사", // 기본값
    content: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      // 실제 구현 시 파일 첨부 로직 등도 함께 처리할 수 있습니다.
      await questionApi.writeQuestion({
        ...formData,
        memberId: user?.loginId // 실제 DB의 member PK를 넘기도록 수정 필요
      });
      alert("질문이 성공적으로 등록되었습니다.");
      navigate("/question/list.do");
    } catch (error) {
      alert("질문 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
      <h2 style={{ borderBottom: "2px solid #333", paddingBottom: "10px", marginBottom: "30px" }}>법률 질문 작성</h2>
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px" }}>사건 유형</label>
          <select 
            name="caseType" 
            value={formData.caseType} 
            onChange={handleChange}
            style={{ width: "200px", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          >
            <option value="민사">민사</option>
            <option value="형사">형사</option>
            <option value="가사">가사</option>
            <option value="행정">행정</option>
            <option value="기타">기타</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px" }}>제목</label>
          <input 
            type="text" 
            name="title" 
            placeholder="질문 제목을 입력해주세요" 
            value={formData.title} 
            onChange={handleChange}
            style={{ width: "100%", padding: "12px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" }} 
          />
        </div>

        <div>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px" }}>상세 내용</label>
          <textarea 
            name="content" 
            placeholder="구체적인 상황을 설명해주시면 더욱 정확한 답변을 받을 수 있습니다." 
            value={formData.content} 
            onChange={handleChange}
            style={{ width: "100%", height: "300px", padding: "12px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box", resize: "vertical" }} 
          />
        </div>

        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button type="button" onClick={() => navigate(-1)} style={{ padding: "12px 24px", backgroundColor: "#6c757d", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>취소</button>
          <button type="submit" style={{ padding: "12px 24px", backgroundColor: "#007BFF", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}>등록하기</button>
        </div>
      </form>
    </div>
  );
};

export default QuestionWritePage;