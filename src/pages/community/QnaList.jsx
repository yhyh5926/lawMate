import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPostList, getTopLikedPosts } from "../../api/communityApi";
import "../../styles/community/Qnalist.css";
import { scrollToTop } from "../../utils/windowUtils";

const QnaList = () => {
  const [posts, setPosts] = useState([]);
  const [topLikedPosts, setTopLikedPosts] = useState([]);
  const [sortType, setSortType] = useState("latest");
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const fetchPosts = async () => {
    try {
      const data = await getPostList(sortType, currentPage);
      console.log(data);
      setPosts(data.posts);
      setTotalCount(data.totalCount);
      setPageSize(data.pageSize);
    } catch (error) {
      console.error("게시글 목록 조회 실패:", error);
    }
  };

  const fetchTopLikedPosts = async () => {
    try {
      const data = await getTopLikedPosts();
      console.log("인기글:", data);
      setTopLikedPosts(data);
    } catch (error) {
      console.error("인기글 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchTopLikedPosts();
    scrollToTop();
  }, [sortType, currentPage]);

  const topLikedList = topLikedPosts.map((post, idx) => (
    <li key={post.postId} className="top-liked-item">
      <span className="top-liked-rank">{idx + 1}</span>
      <Link className="top-liked-link" to={`/community/detail/${post.postId}`}>
        {post.title} [{post.commentCnt}]
      </Link>
      <span className="top-liked-count"> {post.likeCnt}</span>
    </li>
  ));

  let postTr = posts.map((post, idx) => (
    <tr key={post.postId} style={{ animationDelay: `${idx * 0.04}s` }}>
      <td className="td-no col-no">
        {totalCount - (currentPage - 1) * pageSize - idx}
      </td>
      <td>{post.caseType}</td>
      <td className="col-title">
        <Link className="post-link" to={`/community/detail/${post.postId}`}>
          {post.title}
        </Link>
      </td>
      <td>
        <span className="comment-badge">{post.commentCnt}</span>
      </td>
      <td className="td-author">{post.name}</td>
      <td className="td-views col-views">{post.viewCnt}</td>
      <td className="td-date">
        {post.updatedAt === null ? (
          post.createdAt
        ) : (
          <>
            {post.updatedAt}
            <span className="edited-tag">수정됨</span>
          </>
        )}
      </td>
    </tr>
  ));

  const totalPage = Math.ceil(totalCount / pageSize);

  const pageButtons = [];
  for (let i = 1; i <= totalPage; i++) {
    pageButtons.push(
      <button
        key={i}
        className={currentPage === i ? "page-btn active" : "page-btn"}
        onClick={() => setCurrentPage(i)}
      >
        {i}
      </button>,
    );
  }

  return (
    <div className="qna-wrapper">
      <div className="qna-container">
        <div className="board-header">
          <h2 className="board-title">💬 자유게시판</h2>

          <div className="board-controls">
            <select
              className="sort-selector"
              value={sortType}
              onChange={(e) => {
                setSortType(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="latest">최신순</option>
              <option value="views">조회수순</option>
              <option value="comments">댓글순</option>
            </select>

            <button
              className="write-btn"
              onClick={() => navigate("/community/write")}
            >
              ✏️ 글쓰기
            </button>
          </div>
        </div>

        {topLikedPosts.length > 0 && (
          <div className="top-liked-box">
            <h3 className="top-liked-title">인기글 TOP 3</h3>
            <ul className="top-liked-list">{topLikedList}</ul>
          </div>
        )}

        {posts.length > 0 && (
          <p className="board-stats">
            총 <span>{posts.length}</span>개의 게시물
          </p>
        )}

        {posts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <p className="empty-state-text">아직 등록된 글이 없습니다.</p>
          </div>
        ) : (
          <div className="board-table-wrap">
            <table className="board-table">
              <thead>
                <tr>
                  <th className="col-no">No</th>
                  <th>분류</th>
                  <th className="col-title">제목</th>
                  <th>댓글</th>
                  <th>작성자</th>
                  <th className="col-views">조회수</th>
                  <th>작성일</th>
                </tr>
              </thead>
              <tbody>{postTr}</tbody>
            </table>
          </div>
        )}
      </div>
      <div className="paging-box">
        <button
          className="page-btn"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          이전
        </button>

        {pageButtons}

        <button
          className="page-btn"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPage || totalPage === 0}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default QnaList;
