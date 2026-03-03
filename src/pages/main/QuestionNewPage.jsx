import { useState } from "react";
import { createQuestion } from "../api/questionApi";

export default function QuestionNewPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [err, setErr] = useState("");

  const onSubmit = async () => {
    setErr("");
    try {
      const q = await createQuestion(title, content);
      window.location.href = `/questions/${q.id}`;
    } catch (e) {
      setErr("등록 실패 (제목/내용을 확인하세요)");
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 920, margin: "0 auto" }}>
      <h2 style={{ margin: "0 0 14px" }}>질문 등록</h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목"
        style={{
          width: "100%",
          padding: 12,
          marginBottom: 10,
          border: "1px solid #cbd5e1",
          borderRadius: 10,
          outline: "none",
        }}
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="내용"
        rows={10}
        style={{
          width: "100%",
          padding: 12,
          marginBottom: 12,
          border: "1px solid #cbd5e1",
          borderRadius: 10,
          outline: "none",
          resize: "vertical",
        }}
      />

      {err && (
        <div style={{ color: "crimson", marginBottom: 10, fontSize: 14 }}>
          {err}
        </div>
      )}

      <button
        onClick={onSubmit}
        style={{
          padding: "10px 12px",
          borderRadius: 10,
          border: "none",
          background: "#2563eb",
          color: "#fff",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        등록
      </button>

      <div style={{ marginTop: 12 }}>
        <a href="/questions">← 목록</a>
      </div>
    </div>
  );
}