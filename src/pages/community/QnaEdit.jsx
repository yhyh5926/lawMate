import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPost, updatePost } from "../../api/communityApi";

const QnaEdit = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    postId: "",
    caseType: "",
    title: "",
    content: ""
  });

  useEffect(() => {
    fetchPostDetail();
  }, [postId]);

  const fetchPostDetail = async () => {
    try {
      const data = await getPost(postId);
      console.log("수정용 상세 데이터:", data);

      setForm({
        postId: data.postId,
        caseType: data.caseType || "",
        title: data.title || "",
        content: data.content || ""
      });
    } catch (error) {
      console.error("게시글 불러오기 실패:", error);
      alert("게시글 정보를 불러오지 못했습니다.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.caseType) {
      alert("분류를 선택해주세요.");
      return;
    }

    if (!form.title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!form.content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      const payload = {
        postId: form.postId,
        caseType: form.caseType,
        title: form.title,
        content: form.content
      };

      console.log("수정 payload:", payload);

      await updatePost(payload);

      alert("게시글이 수정되었습니다.");
      navigate(`/community/detail/${postId}`);
    } catch (error) {
      console.error("게시글 수정 실패:", error);
      console.error("응답 데이터:", error.response?.data);
      alert("게시글 수정 실패");
    }
  };

  return (
    <div className="write-wrapper">
      <h2>✏️ 게시글 수정</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>분류</label>
          <select
            name="caseType"
            value={form.caseType}
            onChange={handleChange}
          >
            <option value="">선택</option>
            <option value="민사">민사</option>
            <option value="형사">형사</option>
            <option value="행정">행정</option>
            <option value="자유">자유</option>
          </select>
        </div>

        <div>
          <label>제목</label>
          <input
            type="text"
            name="title"
            value={form.title}
            placeholder="제목을 입력하세요"
            onChange={handleChange}
          />
        </div>

        <div>
          <label>내용</label>
          <textarea
            name="content"
            value={form.content}
            placeholder="내용을 입력하세요"
            rows="10"
            onChange={handleChange}
          />
        </div>

        <button type="submit">수정완료</button>
      </form>
    </div>
  );
};

export default QnaEdit;