import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/community/community.css";
const VoteWrite = () => {
  const [form, setForm] = useState({
    title: "",
    content: "",
    optA: "",
    optB: "",
  });
  const navigate = useNavigate();

  const handleSubmit = () => {
    console.log("투표 생성:", form);
    alert("투표가 생성되었습니다!");
    navigate("/community/vote");
  };

  // VoteWrite.jsx 수정 제안
  return (
    <div className="container">
      <div className="form-group">
        <h2 className="title">📊 분쟁 투표 만들기</h2>
        <input
          type="text"
          className="vote-title-input"
          placeholder="어떤 분쟁에 대해 투표를 받고 싶으신가요?"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          placeholder="상황을 자세히 설명해주세요. (예: 주차 시비, 전세 계약 분쟁 등)"
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />

        <div className="vote-option-group">
          <input
            type="text"
            placeholder="A 의견 (예: 임대인 책임)"
            onChange={(e) => setForm({ ...form, optA: e.target.value })}
          />
          <span>VS</span>
          <input
            type="text"
            placeholder="B 의견 (예: 임차인 책임)"
            onChange={(e) => setForm({ ...form, optB: e.target.value })}
          />
        </div>

        <button className="btn-primary" onClick={handleSubmit}>
          투표 등록하기
        </button>
      </div>
    </div>
  );
};

export default VoteWrite;
