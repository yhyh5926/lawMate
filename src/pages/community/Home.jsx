import { useNavigate } from 'react-router-dom';

/**
useNavigate()는 페이지 이동을 위한 Hook
navigate('/경로')

gridTemplateColumns: '1fr 1fr'
열(column)을 2개 만들겠다
각각 1fr씩 나누겠다
fr = fraction (비율 단위)
남은 공간을 나눠 먹는 단위
 */

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1 className="title" style={{ fontSize: '32px', marginBottom: '10px' }}>
        ⚖️ 법률 커뮤니티
      </h1>
      <p style={{ color: '#64748b', marginBottom: '40px' }}>
        전문가 답변부터 시민들의 의견까지, 법률 고민을 해결해보세요.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Q&A 카드 */}
        <button type='button' className='qna-button'
          onClick={() => navigate('/community/qnalist')} style={{ padding: '40px' }} >
          <div style={{ fontSize: '40px', marginBottom: '20px' }}>💬</div>
          <h2 className="title">법률 상담 Q&A</h2>
          <p className="card-info">변호사에게 직접 질문하고<br/>전문적인 답변을 받아보세요.</p>
        </button>

        {/* 투표 카드 */}
        <button type='button' className='vote-button'
          onClick={() => navigate('/community/vote')} style={{ padding: '40px' }} >
          <div style={{ fontSize: '40px', marginBottom: '20px' }}>📊</div>
          <h2 className="title">모의 판결 게시판</h2>
          <p className="card-info">사건을 읽고 A 또는 B 중<br/>여러분의 판결을 내려보세요.</p>
        </button>
      </div>
    </div>
  );
};

export default Home;