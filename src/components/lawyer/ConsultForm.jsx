import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import  useAuthStore  from "../../zustand/auth_store";
import { useConsultStore } from "../../zustand/useConsultStore";
import { mockLawyers } from "../../mocks/lawyer/mockLawyers";
import "../../styles/lawyer/consultForm.css";

export default function ConsultForm() {
  const { lawyerId } = useParams();
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const addConsult = useConsultStore((state) => state.addConsult);

  const lawyer = mockLawyers.find((l) => l.id === lawyerId);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  if (!lawyer) {
    return <div className="consult-form-empty">변호사를 찾을 수 없습니다.</div>;
  }

  const handleSubmit = () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!title || !content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    addConsult({
      userId: user.id,
      userName: user.name,
      lawyerId: lawyer.id,
      lawyerName: lawyer.name,
      title,
      content,
    });

    navigate("/lawyer");
  };

  return (
    <div className="consult-form-container">
      <h2 className="consult-form-title">{lawyer.name} 변호사 상담 신청</h2>

      <div className="consult-form-group">
        <label className="consult-form-label">상담 제목</label>
        <input
          type="text"
          className="consult-form-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="예) 이혼 재산분할 상담 요청"
        />
      </div>

      <div className="consult-form-group">
        <label className="consult-form-label">상담 내용</label>
        <textarea
          className="consult-form-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="상담 내용을 구체적으로 작성해주세요."
        />
      </div>

      <button className="consult-form-button" onClick={handleSubmit}>
        상담 신청하기
      </button>
    </div>
  );
}
