import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuestion, updateQuestion } from "../api/questionApi";

export default function QuestionEditPage() {
  const { id } = useParams();
  const qid = useMemo(() => Number(id), [id]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("OPEN");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!qid || Number.isNaN(qid)) {
      setErr("잘못된 접근입니다.");
      return;
    }

    (async () => {
      try {
        const q = await getQuestion(qid);
        setTitle(q.title || "");
        setContent(q.content || "");
        setStatus(q.status || "OPEN");
      } catch (e) {
        setErr("불러오기 실패");
      }
    })();
  }, [qid]);

  const onSave = async () => {
    setErr("");
    try {
      const q = await updateQuestion(qid, title, content, status);
      window.location.href = `/questions/${q.id}`;
    } catch (e) {
      setErr("저장 실패 (작성자만 가능)");
    }
  };

  if (err) return <div style={{ padding: 24 }}>{err}</div>;

  return (
    <div style={{ padding: 24, maxWidth: 920, margin: "0 auto" }}>
      <h2 style={{ margin: "0 0 14px" }}>질문 수정</h2>

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

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        style={{
          padding: 10,
          marginBottom: 10,
          border: "1px solid #cbd5e1",
          borderRadius: 10,
        }}
      >
        <option value="OPEN">OPEN</option>
        <option value="ANSWERED">ANSWERED</option>
        <option value="CLOSED">CLOSED</option>
      </select>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={10}
        placeholder="내용"
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

      <button
        onClick={onSave}
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
        저장
      </button>

      <div style={{ marginTop: 12 }}>
        <a href={`/questions/${qid}`}>← 상세</a>
      </div>
    </div>
  );
}