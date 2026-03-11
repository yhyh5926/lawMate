import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPollDetail, updatePoll } from "../../api/communityApi";
import "../../styles/community/PollWrite.css";

const PollEdit = () => {
  const navigate = useNavigate();
  const { pollId } = useParams();
  const memberId = Number(localStorage.getItem("memberId"));

  const [form, setForm] = useState({
    pollId: "",
    title: "",
    description: "",
    disclaimer: "",
    endDate: ""
  });

  useEffect(() => {
    getPollDetail(pollId).then((data) => {
      setForm({
        pollId: data.pollId,
        title: data.title || "",
        description: data.description || "",
        disclaimer: data.disclaimer || "",
        endDate: data.endDate ? data.endDate.substring(0, 10) : ""
      });
    });
  }, [pollId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!memberId) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!form.title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!form.description.trim()) {
      alert("설명을 입력해주세요.");
      return;
    }

    if (!form.endDate) {
      alert("마감일을 선택해주세요.");
      return;
    }

    try {
      const payload = {
        pollId: Number(form.pollId),
        memberId,
        title: form.title,
        description: form.description,
        disclaimer: form.disclaimer.trim() || null,
        endDate: form.endDate
      };

      console.log("투표 수정 payload:", payload);

      await updatePoll(payload);

      alert("의견조사가 수정되었습니다.");
      navigate(`/community/poll/detail/${pollId}`);
    } catch (error) {
      console.error("의견조사 수정 실패:", error);
      console.error("응답 데이터:", error.response?.data);
      alert("의견조사 수정 실패");
    }
  };

  return (
    <div className="poll-write-wrapper">
      <div className="poll-write-container">
        <h2 className="poll-write-title">🛠 의견조사 수정</h2>

        <form className="poll-write-form" onSubmit={handleSubmit}>
          <div className="poll-write-group">
            <label>제목</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="의견조사 제목을 입력하세요"
            />
          </div>

          <div className="poll-write-group">
            <label>설명</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="의견조사 설명을 입력하세요"
              rows="4"
            />
          </div>

          <div className="poll-write-group">
            <label>고지사항</label>
            <input
              type="text"
              name="disclaimer"
              value={form.disclaimer}
              onChange={handleChange}
              placeholder="예: 중복 투표는 불가능합니다."
            />
          </div>

          <div className="poll-write-group">
            <label>마감일</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
            />
          </div>

          <div className="poll-write-button-box">
            <button
              type="button"
              className="poll-cancel-btn"
              onClick={() => navigate(`/community/poll/detail/${pollId}`)}
            >
              취소
            </button>
            <button type="submit" className="poll-submit-btn">
              수정
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PollEdit;