import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function QuestionDetailPage() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/question/${id}`);
        setQuestion(res.data.data);
      } catch (error) {
        alert('질문을 불러올 수 없습니다.');
        navigate('/question/list.do');
      }
    };
    if (id) fetchQuestion();
  }, [id, navigate]);

  if (!question) return <div className="text-center mt-20">로딩중...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md mb-10">
      <div className="border-b pb-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-blue-600 font-bold">{question.caseType}</span>
          <span className="text-sm text-gray-500">{question.createdAt?.substring(0, 10)}</span>
        </div>
        <h2 className="text-2xl font-bold mb-4">{question.title}</h2>
        <div className="text-gray-700 whitespace-pre-wrap min-h-[150px]">
          {question.content}
        </div>
      </div>

      {/* 답변 영역 */}
      <div className="bg-gray-50 border p-6 rounded-md">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm mr-2">변호사 답변</span>
          {question.status === 'ANSWERED' ? '답변이 완료되었습니다.' : '아직 답변이 등록되지 않았습니다.'}
        </h3>
        
        {question.status === 'ANSWERED' ? (
          <div>
            <div className="flex items-center mb-4 pb-4 border-b">
              {/* 전문회원 정보 노출 */}
              <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
              <div>
                <p className="font-bold">{question.lawyerName} 변호사</p>
                <p className="text-xs text-gray-500">{question.lawyerOffice}</p>
              </div>
            </div>
            <div className="text-gray-800 whitespace-pre-wrap">
              {question.answerContent}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">전문 변호사가 내용을 검토 중입니다.</p>
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <button onClick={() => navigate('/question/list.do')} className="px-6 py-2 border rounded-md hover:bg-gray-100">
          목록으로
        </button>
      </div>
    </div>
  );
}