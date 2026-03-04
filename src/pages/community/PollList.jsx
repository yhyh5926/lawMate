import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPollList } from '../../api/communityApi';
import '../../styles/community/Qnalist.css';

const PollList = () => {
  const [polls, setPolls] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getPollList().then(data => {
      console.log("poll list", data);
      setPolls(data);
    });
  }, []);

  const pollTr = polls.map((poll, idx) => (
    <tr key={poll.pollId} style={{ animationDelay: `${idx * 0.04}s` }}>
      <td className="td-no col-no">{poll.pollId}</td>

      <td className="col-title">
        <Link 
          className="post-link"
          to={`/community/poll/detail/${poll.pollId}`}
        >
          {poll.title}
        </Link>
      </td>

      <td>{poll.name}</td>

      <td>
        {poll.status === 'OPEN' ? 
          <span style={{ color: '#2ecc71' }}>진행중</span> :
          <span style={{ color: '#e74c3c' }}>종료</span>
        }
      </td>

      <td>{poll.endDate}</td>
      <td>{poll.createdAt}</td>
    </tr>
  ));

  return (
    <div className="qna-wrapper">
      <div className="qna-container">
        <div className="board-header">
          <h2 className="board-title">📊 의견조사 게시판</h2>
          <button 
            className="write-btn"
            onClick={() => navigate('/community/poll/write')}
          >
            ✏️ 의견조사 생성
          </button>
        </div>

        {polls.length > 0 && (
          <p className="board-stats">
            총 <span>{polls.length}</span>개의 의견조사
          </p>
        )}

        {polls.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <p className="empty-state-text">
              아직 등록된 의견조사가 없습니다.
            </p>
          </div>
        ) : (
          <div className="board-table-wrap">
            <table className="board-table">
              <thead>
                <tr>
                  <th className="col-no">No</th>
                  <th className="col-title">제목</th>
                  <th>작성자</th>
                  <th>상태</th>
                  <th>마감일</th>
                  <th>생성일</th>
                </tr>
              </thead>
              <tbody>{pollTr}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PollList;