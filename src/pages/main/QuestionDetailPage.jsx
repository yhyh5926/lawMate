import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { deleteQuestion, getQuestion } from "../api/questionApi";
import { isLoggedIn } from "../auth/auth";

export default function QuestionDetailPage() {
  const { id } = useParams();
  const qid = useMemo(() => Number(id), [id]);

  const [q, setQ] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!qid || Number.isNaN(qid)) {
      setErr("잘못된 접근입니다.");
      return;
    }

    (async () => {
      try {
        const data = await getQuestion(qid);
        setQ(data);
      } catch (e) {
        setErr("불러오기 실패");
      }
    })();
  }, [qid]);

  const onDelete = async () => {
    if (!window.confirm("삭제할까요?")) return;
    try {
      await deleteQuestion(qid);
      window.location.href = "/questions";
    } catch (e) {
      window.alert("삭제 실패 (작성자만 가능)");
    }
  };

  if (err) return <div style={{ padding: 24 }}>{err}</div>;
  if (!q) return <div style={{ padding: 24 }}>Loading...</div>;

  return (
    <div style={{ padding: 24, maxWidth: 920, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 6 }}>{q.title}</h2>

      <div style={{ fontSize: 12, color: "#64748b" }}>
        {new Date(q.createdAt).toLocaleString()} · {q.status} · {q.authorEmail}
      </div>

      <hr style={{ margin: "14px 0" }} />

      <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
        {q.content}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
        <button onClick={() => (window.location.href = "/questions")}>
          목록
        </button>

        {isLoggedIn() && (
          <>
            <button
              onClick={() =>
                (window.location.href = `/questions/${qid}/edit`)
              }
            >
              수정
            </button>
            <button onClick={onDelete}>삭제</button>
          </>
        )}
      </div>
    </div>
  );
}