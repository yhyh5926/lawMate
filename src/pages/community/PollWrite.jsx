import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { writePoll } from "../../api/communityApi";
import "../../styles/community/PollWrite.css";

const PollWrite = () => {
  const navigate = useNavigate();
  const memberId = Number(localStorage.getItem("memberId"));
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    title: "",
    description: "",
    disclaimer: "",
    endDate: "",
    options: ["", ""],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...form.options];
    newOptions[index] = value;

    setForm({
      ...form,
      options: newOptions,
    });
  };

  const handleAddOption = () => {
    if (form.options.length >= 6) {
      alert("선택지는 최대 6개까지 가능합니다.");
      return;
    }

    setForm({
      ...form,
      options: [...form.options, ""],
    });
  };

  const handleRemoveOption = (index) => {
    if (form.options.length <= 2) {
      alert("선택지는 최소 2개가 필요합니다.");
      return;
    }

    const newOptions = form.options.filter((_, i) => i !== index);

    setForm({
      ...form,
      options: newOptions,
    });
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

    const trimmedOptions = form.options
      .map((opt) => opt.trim())
      .filter((opt) => opt !== "");

    if (trimmedOptions.length < 2) {
      alert("선택지는 최소 2개 입력해주세요.");
      return;
    }

    try {
      const payload = {
        memberId,
        title: form.title,
        description: form.description,
        disclaimer: form.disclaimer.trim() || null,
        endDate: form.endDate,
        options: trimmedOptions,
      };

      console.log("투표 등록 payload:", payload);

      await writePoll(payload);

      alert("의견조사가 등록되었습니다.");
      navigate("/community/pollList");
    } catch (error) {
      console.error("의견조사 등록 실패:", error);
      console.error("응답 데이터:", error.response?.data);
      alert("의견조사 등록 실패");
    }
  };

  return (
    <div className="poll-write-wrapper">
      <div className="poll-write-container">
        <h2 className="poll-write-title">📊 의견조사 생성</h2>

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
              min={today}
            />
          </div>

          <div className="poll-write-group">
            <label>선택지</label>

            {form.options.map((option, index) => (
              <div key={index} className="poll-option-input-row">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`선택지 ${index + 1}`}
                />
                <button
                  type="button"
                  className="poll-option-remove-btn"
                  onClick={() => handleRemoveOption(index)}
                >
                  삭제
                </button>
              </div>
            ))}

            <button
              type="button"
              className="poll-option-add-btn"
              onClick={handleAddOption}
            >
              + 선택지 추가
            </button>
          </div>

          <div className="poll-write-button-box">
            <button
              type="button"
              className="poll-cancel-btn"
              onClick={() => navigate("/community/pollList")}
            >
              취소
            </button>
            <button type="submit" className="poll-submit-btn">
              등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PollWrite;
