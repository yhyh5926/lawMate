import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CommentList from "../../components/community/CommentList";
import {
  getPollDetail,
  getPollOptions,
  votePoll,
  checkVoted,
  deletePoll
} from "../../api/communityApi";
import "../../styles/community/PollDetail.css";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PollDetail = () => {
  const memberId = Number(localStorage.getItem("memberId"));
  const { pollId } = useParams();
  const navigate = useNavigate();

  const [poll, setPoll] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [totalVotes, setTotalVotes] = useState(0);
  const [alreadyVoted, setAlreadyVoted] = useState(false);

  useEffect(() => {
    getPollDetail(pollId).then(data => {
      console.log("poll detail 응답:", data);
      console.log("postId 값:", data.postId);
      setPoll(data);
    });

    getPollOptions(pollId).then(data => {
      setOptions(data);
      const total = data.reduce((sum, opt) => sum + opt.voteCnt, 0);
      setTotalVotes(total);
    });

    if (memberId) {
      checkVoted(pollId, memberId).then(res => {
        setAlreadyVoted(res);
      });
    }
  }, [pollId, memberId]);

  const handleVote = async () => {
    if (!memberId) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (alreadyVoted) {
      alert("이미 투표했습니다.");
      return;
    }

    if (!selectedOption) {
      alert("선택지를 선택하세요.");
      return;
    }

    try {
      await votePoll({
        pollId,
        optionId: selectedOption,
        memberId
      });

      alert("투표 완료!");
      setAlreadyVoted(true);

      const data = await getPollOptions(pollId);
      setOptions(data);
      const total = data.reduce((sum, opt) => sum + opt.voteCnt, 0);
      setTotalVotes(total);
    } catch (error) {
      console.error("투표 실패:", error);
      console.error("응답 데이터:", error.response?.data);
      alert("투표 처리 중 오류가 발생했습니다.");
    }
  };

  const handleEdit = () => {
    navigate(`/community/poll/edit/${pollId}`);
  };

  const handleDelete = async () => {
    const isConfirm = window.confirm("정말 삭제하시겠습니까?");
    if (!isConfirm) return;

    try {
      await deletePoll(pollId);
      alert("의견조사가 삭제되었습니다.");
      navigate("/community/pollList");
    } catch (error) {
      console.error("의견조사 삭제 실패:", error);
      console.error("응답 데이터:", error.response?.data);
      alert("의견조사 삭제 실패");
    }
  };

  if (!poll) return <div className="poll-loading">불러오는 중...</div>;

  const isWriter = memberId === poll.memberId;

  const labels = options.map(o => o.optionText);
  const values = options.map(o => o.voteCnt);
  const safeValues = values.every(v => v === 0) ? values.map(() => 1) : values;

  const doughnutData = {
    labels,
    datasets: [
      {
        data: safeValues,
        backgroundColor: ["#4f6ef7", "#f97316", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"],
        borderColor: "#ffffff",
        borderWidth: 3,
        hoverOffset: 6,
        cutout: "65%",
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 16,
          usePointStyle: true,
          font: { size: 13 },
          color: "#444869",
        }
      },
      tooltip: { enabled: true }
    }
  };

  return (
    <div className="poll-wrapper">
      <div className="poll-container">
        <div className="poll-card">

          <div className="poll-header">
            <h2 className="poll-title">{poll.title}</h2>

            <div className="poll-meta">
              <span className="poll-meta-item">
                <strong>작성자</strong> {poll.name}
              </span>
              <span className="poll-meta-divider" />
              <span className="poll-meta-item">
                <strong>마감일</strong> {poll.endDate}
              </span>
            </div>

            {isWriter && (
              <div className="poll-action-box">
                <button className="poll-edit-btn" onClick={handleEdit}>
                  수정
                </button>
                <button className="poll-delete-btn" onClick={handleDelete}>
                  삭제
                </button>
              </div>
            )}
          </div>

          {poll.disclaimer && (
            <p className="poll-disclaimer">⚠ {poll.disclaimer}</p>
          )}
          <p className="poll-description">{poll.description}</p>

          {!alreadyVoted ? (
            <div className="poll-vote-section">
              <h3 className="poll-vote-title">투표하기</h3>

              {options.map(opt => {
                const percent =
                  totalVotes === 0 ? 0 : ((opt.voteCnt / totalVotes) * 100).toFixed(1);

                return (
                  <div key={opt.optionId} className="poll-option">
                    <label className="poll-option-label">
                      <input
                        type="radio"
                        name="option"
                        value={opt.optionId}
                        onChange={() => setSelectedOption(opt.optionId)}
                      />
                      <span className="poll-option-text">{opt.optionText}</span>
                    </label>

                    <div className="poll-bar-wrap">
                      <div className="poll-bar-bg">
                        <div className="poll-bar-fill" style={{ width: `${percent}%` }} />
                      </div>
                      <span className="poll-bar-label">
                        {opt.voteCnt}표 ({percent}%)
                      </span>
                    </div>
                  </div>
                );
              })}

              <button className="poll-vote-btn" onClick={handleVote}>
                투표하기
              </button>

              <p className="poll-total">
                총 참여자 수 <span>{totalVotes}명</span>
              </p>
            </div>
          ) : (
            <div className="poll-result-section">
              <h3 className="poll-vote-title">투표 결과</h3>

              <div className="poll-chart-wrap">
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>

              <p className="poll-total">
                총 참여자 수 <span>{totalVotes}명</span>
              </p>
            </div>
          )}
        </div>
        <div className="poll-comment-section">
          <CommentList postId={poll.postId} boardType="POLL" />
        </div>
      </div>
    </div>
  );
};

export default PollDetail;