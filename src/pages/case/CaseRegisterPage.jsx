// src/pages/case/CaseRegisterPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { caseApi } from "../../api/caseApi";
import { useAuthStore } from "../../store/authStore";
// 필요에 따라 CSS 파일을 연결하세요
// import "../../styles/case/CaseRegisterPage.css";

const CASE_TYPES = ["민사", "형사", "가사", "이혼", "노동", "행정", "기업", "부동산"];

const CaseRegisterPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    title: "",
    caseType: "민사",
    clientName: "",
    clientPhone: "",
    content: "",
    files: "", // 파일명 또는 링크를 쉼표로 구분하여 입력
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 변호사 계정이 아닌 경우 접근 차단
  if (!user || user.role !== "LAWYER") {
    return (
      <div style={{ textAlign: "center", padding: "50px", fontSize: "18px" }}>
        변호사 전용 메뉴입니다. 접근 권한이 없습니다.
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.clientName || !formData.content) {
      alert("필수 항목(제목, 의뢰인명, 사건 내용)을 모두 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // DB 저장을 위한 데이터 구성 (변호사 ID 포함)
      const payload = {
        ...formData,
        lawyerId: user.memberId,
        lawyerName: user.name,
        status: 0, // 0: '접수' 상태로 초기화
      };

      // 💡 실제 API 호출: 정식 사건 등록
      await caseApi.registerCase(payload);
      
      alert("정식 사건으로 성공적으로 등록되었습니다.");
      navigate("/mypage"); // 등록 후 마이페이지(접수 관리 탭)로 이동
    } catch (error) {
      console.error("사건 등록 실패:", error);
      alert("사건 등록 중 서버 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px", borderBottom: "2px solid #333", paddingBottom: "10px" }}>
        정식 사건 등록 (사건 전환)
      </h2>
      <p style={{ color: "#666", marginBottom: "30px" }}>
        💡 채택된 답변이나 상담을 기반으로 정식 사건(TB_CASE) 데이터를 생성합니다.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>사건 제목 *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="사건의 핵심 내용을 알 수 있는 제목을 입력하세요."
            style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>

        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>사건 유형 *</label>
            <select
              name="caseType"
              value={formData.caseType}
              onChange={handleChange}
              style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
            >
              {CASE_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>의뢰인 성함 *</label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              placeholder="예: 홍길동"
              style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>사건 상세 내용 *</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="사건의 상세 내용을 기재해주세요."
            rows="8"
            style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px", resize: "vertical" }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>관련 첨부파일 (선택)</label>
          <input
            type="text"
            name="files"
            value={formData.files}
            onChange={handleChange}
            placeholder="첨부할 파일명이나 링크를 쉼표(,)로 구분하여 입력하세요."
            style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{ padding: "12px 24px", backgroundColor: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "4px", cursor: "pointer" }}
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{ padding: "12px 24px", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: isSubmitting ? "not-allowed" : "pointer" }}
          >
            {isSubmitting ? "등록 중..." : "사건 등록하기"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CaseRegisterPage;