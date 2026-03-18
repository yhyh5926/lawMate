import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPollList } from "../../api/communityApi";
import "../../styles/community/Qnalist.css";
import { scrollToTop } from "../../utils/windowUtils";

const PollList = () => {
  const [polls, setPolls] = useState([]);
  const [sortType, setSortType] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  const fetchPolls = async () => {
    try {
      const data = await getPollList(sortType, currentPage);
      console.log("poll list", data);
      setPolls(data.polls);
      setTotalCount(data.totalCount);
      setPageSize(data.pageSize);
    } catch (error) {
      console.error("투표 목록 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchPolls();
    scrollToTop();
  }, [sortType, currentPage]);

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

  const pollTr = polls.map((poll, idx) => (
    <tr key={poll.pollId} style={{ animationDelay: `${idx * 0.04}s` }}>
      <td className="td-no col-no">
        {totalCount - (currentPage - 1) * pageSize - idx}
      </td>

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
        {poll.status === "OPEN" ? (
          <span style={{ color: "#2ecc71" }}>진행중</span>
        ) : (
          <span style={{ color: "#e74c3c" }}>종료</span>
        )}
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
              <option value="endDate">마감임일순</option>
              <option value="status">진행중 우선</option>
            </select>

            <button
              className="write-btn"
              onClick={() => navigate("/community/poll/write")}
            >
              ✏️ 의견조사 생성
            </button>
          </div>
        </div>

        {polls.length > 0 && (
          <p className="board-stats">
            총 <span>{totalCount}</span>개의 의견조사
          </p>
        )}

        {polls.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <p className="empty-state-text">아직 등록된 의견조사가 없습니다.</p>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default PollList;
