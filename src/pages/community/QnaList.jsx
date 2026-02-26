import React, { useState, useEffect } from 'react';
import {Link, useNavigate } from 'react-router-dom';
import { getPostList } from '../api/communityApi';

const QnaList = () => {
  const [posts, setPosts] = useState([]); // 게시물 객체
  const navigate = useNavigate();

  useEffect(() => {
   getPostList().then(data => setPosts(data));
  }, []);

  let postTr = posts.map(post => (
    <tr key={post.post_id}>
        <td>{post.post_id}</td>
        <td><Link to={'/detail/' + post.post_id}>{post.title}</Link></td>
        <td>{post.comment_cnt}</td>
        <td>{post.name}</td>
        <td>{post.view_cnt}</td>
        <td>
          {post.updated_at === null ? post.created_at : (post.updated_at + "(수정됨)")}
        </td>
      </tr>
  ));

  return (<>
    <div className="container">
      <div className="qna-list-page">
        <div className="board-header">
          <h2>💬 법률 상담 Q&A</h2>
          <button onClick={() => navigate('/community/qna/write')}>
            ✏️ 질문하기
          </button>
        </div>

        {posts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <p className="empty-state-text">아직 등록된 질문이 없습니다.</p>
          </div>
        ) : (<>
          <table border="1">
            <thead>
              <tr>
                <th>No</th>
                <th>제목</th>
                <th>댓글</th>
                <th>작성자</th>
                <th>조회수</th>
                <th>작성일</th>
              </tr>
            </thead>
            <tbody>{postTr}</tbody>
          </table>

          <Link to="/community/write">작성</Link>
        </>)}
      </div>
    </div>
  </>);
};

export default QnaList;