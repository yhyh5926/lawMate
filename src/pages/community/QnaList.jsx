import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPostList } from '../../api/communityApi';
import '../../styles/community/Qnalist.css';

const QnaList = () => {
  const [posts, setPosts] = useState([]);
  const [sortType, setSortType] = useState('latest');
  const [caseType, setCaseType] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, [sortType, caseType]);

  const fetchPosts = async () => {
    try {
      const data = await getPostList(sortType, caseType);
      console.log(data);
      setPosts(data);
    } catch (error) {
      console.error("게시글 목록 조회 실패:", error);
    }
  };

  let postTr = posts.map((post, idx) => (
    <tr key={post.postId} style={{ animationDelay: `${idx * 0.04}s` }}>
      <td className="td-no col-no">{post.postId}</td>
      <td>{post.caseType}</td>
      <td className="col-title">
        <Link className="post-link" to={`/community/detail/${post.postId}`}>
          {post.title}
        </Link>
      </td>
      <td><span className="comment-badge">{post.commentCnt}</span></td>
      <td className="td-author">{post.name}</td>
      <td className="td-views col-views">{post.viewCnt}</td>
      <td className="td-date">
        {post.updatedAt === null
          ? post.createdAt
          : <>{post.updatedAt}<span className="edited-tag">수정됨</span></>
        }
      </td>
    </tr>
  ));

  return (
    <div className="qna-wrapper">
      <div className="qna-container">
        <div className="board-header">
          <h2 className="board-title">💬 자유게시판</h2>

          <div className="board-controls">
            <select
              className="sort-selector"
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
            >
              <option value="latest">최신순</option>
              <option value="views">조회수순</option>
              <option value="comments">댓글순</option>
            </select>

            <button
              className="write-btn"
              onClick={() => navigate('/community/write')}
            >
              ✏️ 글쓰기
            </button>
          </div>
        </div>

        {posts.length > 0 && (
          <p className="board-stats">총 <span>{posts.length}</span>개의 게시물</p>
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
    </div>
  );
};

export default QnaList;