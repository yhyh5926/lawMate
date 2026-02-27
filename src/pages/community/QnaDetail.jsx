import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPost } from '../../api/communityApi';
import CommentList from '../../components/community/CommentList';

const QnaDetail = () => {
  
  const { postId } = useParams(); // URL에서 게시물 ID 가져오기
  const [qnaDetail, setQnaDetail] = useState(null);
  
  useEffect(() => {
  getPost(postId).then(data => {
    console.log(data);
    setQnaDetail(data)
  });
  }, [postId]);

  if (!qnaDetail) return <div>Loading...</div>;
  
  return (<>
  
    <h2>{qnaDetail.title}</h2>
    <p>사건유형: {qnaDetail.caseType}</p>
    <p>작성자: {qnaDetail.name}</p>
    <p>작성일: {qnaDetail.createdAt}</p>
    <p>조회수: {qnaDetail.viewCnt}</p>
    <p>{qnaDetail.content}</p>
    
    <CommentList postId={postId} />
  </>); 
}
export default QnaDetail; 