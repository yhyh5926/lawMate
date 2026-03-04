import { useState } from "react";

const QnaWrite = () => {
  const [form, setForm] = useState({
    title: "",
    content: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("게시글 작성:", form);
  };

  return (
    <div>
      <h2>✏️ 게시글 작성</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="제목"
          onChange={handleChange}
        />
        <br />
        <textarea
          name="content"
          placeholder="내용"
          onChange={handleChange}
        />
        <br />
        <button type="submit">등록</button>
      </form>
    </div>
  );
};

export default QnaWrite;