import { useEffect, useState } from "react";
import { listQuestions } from "../api/questionApi";
import { isLoggedIn } from "../auth/auth";

export default function QuestionsListPage() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      setErr("");
      try {
        const res = await listQuestions(page, 10);
        if (!alive) return;
        setItems(Array.isArray(res?.content) ? res.content : []);
        setTotalPages(Number.isFinite(res?.totalPages) ? res.totalPages : 1);
      } catch (e) {
        if (!alive) return;
        setErr("목록 불러오기 실패");
        setItems([]);
        setTotalPages(1);
      }
    })();

    return () => {
      alive = false;
    };
  }, [page]);

  return (
    <div style={{ padding: 24, maxWidth: 920, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <h2 style={{ margin: 0 }}>법률 질문</h2>

        <button
          onClick={() =>
            (window.location.href = isLoggedIn() ? "/questions/new" : "/login")
          }
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            border: "none",
            background: "#2563eb",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          질문 등록
        </button>
      </div>

      {err && (
        <div style={{ marginTop: 12, color: "crimson", fontSize: 14 }}>
          {err}
        </div>
      )}

      <div
        style={{
          marginTop: 14,
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          overflow: "hidden",
          background: "#fff",
        }}
      >
        {items.map((q) => (
          <div
            key={q.id}
            style={{
              padding: 14,
              borderBottom: "1px solid #f1f5f9",
              cursor: "pointer",
            }}
            onClick={() => (window.location.href = `/questions/${q.id}`)}
          >
            <div style={{ fontWeight: 800 }}>{q.title}</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>
              {new Date(q.createdAt).toLocaleString()} · {q.status} ·{" "}
              {q.authorEmail}
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div style={{ padding: 14, color: "#64748b" }}>질문이 없습니다.</div>
        )}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        <button
          disabled={page <= 0}
          onClick={() => setPage((p) => p - 1)}
          style={{ padding: "8px 10px" }}
        >
          Prev
        </button>

        <div style={{ alignSelf: "center" }}>
          {page + 1} / {Math.max(1, totalPages)}
        </div>

        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          style={{ padding: "8px 10px" }}
        >
          Next
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        <a href="/main.do">← 메인</a>
      </div>
    </div>
  );
}