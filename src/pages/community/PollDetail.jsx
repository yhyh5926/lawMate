import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPollDetail, getPollOptions, votePoll } from "../../api/communityApi";
import '../../styles/community/PollDetail.css';

const PollDetail = () => {
  const { pollId } = useParams();

  const [poll, setPoll] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    getPollDetail(pollId).then(data => {
      setPoll(data);
    });

    getPollOptions(pollId).then(data => {
      setOptions(data);
      const total = data.reduce((sum, opt) => sum + opt.voteCnt, 0);
      setTotalVotes(total);
    });
  }, [pollId]);

  const handleVote = async () => {
    if (!selectedOption) {
      alert("선택지를 선택하세요.");
      return;
    }

    await votePoll({ pollId, optionId: selectedOption });
    alert("투표 완료!");

    const data = await getPollOptions(pollId);
    setOptions(data);
    const total = data.reduce((sum, opt) => sum + opt.voteCnt, 0);
    setTotalVotes(total);
  };

  if (!poll) return <div className="poll-loading">불러오는 중...</div>;

  return (
    <div className="poll-wrapper">
      <div className="poll-container">

        <div className="poll-card">

          {/* 헤더 */}
          <div className="poll-header">
            <h2 className="poll-title">{poll.title}</h2>
            <p className="poll-description">{poll.description}</p>
            <div className="poll-meta">
              <span className="poll-meta-item"><strong>작성자</strong> {poll.name}</span>
              <span className="poll-meta-divider" />
              <span className="poll-meta-item"><strong>마감일</strong> {poll.endDate}</span>
            </div>
          </div>

          {/* 고지사항 */}
          {poll.disclaimer && (
            <p className="poll-disclaimer">⚠ {poll.disclaimer}</p>
          )}

          {/* 투표 영역 */}
          <div className="poll-vote-section">
            <h3 className="poll-vote-title">투표하기</h3>

            {options.map(opt => {
              const percent =
                totalVotes === 0
                  ? 0
                  : ((opt.voteCnt / totalVotes) * 100).toFixed(1);

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
                      <div
                        className="poll-bar-fill"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="poll-bar-label">{opt.voteCnt}표 ({percent}%)</span>
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

        </div>
      </div>
    </div>
  );
};

export default PollDetail;