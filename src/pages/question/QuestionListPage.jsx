import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function QuestionListPage() {
  const [questions, setQuestions] = useState([]);
  const [filter, setFilter] = useState({ caseType: '', status: '' });

  const fetchQuestions = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/question/list', { params: filter });
      setQuestions(res.data.data.list || []);
    } catch (error) {
      console.error('질문 목록 로딩 실패', error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [filter]);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">법률 질문</h2>
        <Link to="/question/write.do" className="bg-blue-600 text-white px-4 py-2 rounded">
          질문 작성하기
        </Link>
      </div>

      <div className="flex space-x-2 mb-4">
        <select className="border p-2 rounded" value={filter.caseType} onChange={(e) => setFilter({...filter, caseType: e.target.value})}>
          <option value="">사건 유형 전체</option>
          <option value="CIVIL">민사</option>
          <option value="CRIMINAL">형사</option>
          <option value="FAMILY">가사/이혼</option>
          <option value="REAL_ESTATE">부동산</option>
        </select>
        <select className="border p-2 rounded" value={filter.status} onChange={(e) => setFilter({...filter, status: e.target.value})}>
          <option value="">답변 상태 전체</option>
          <option value="OPEN">답변 대기</option>
          <option value="ANSWERED">답변 완료</option>
        </select>
      </div>

      <table className="w-full border-collapse border text-center">
        <thead className="bg-gray-50">
          <tr>
            <th className="border p-3 w-20">번호</th>
            <th className="border p-3 w-32">유형</th>
            <th className="border p-3">제목</th>
            <th className="border p-3 w-32">상태</th>
            <th className="border p-3 w-32">등록일</th>
          </tr>
        </thead>
        <tbody>
          {questions.map(q => (
            <tr key={q.questionId} className="hover:bg-gray-50">
              <td className="border p-3 text-gray-500">{q.questionId}</td>
              <td className="border p-3">{q.caseType}</td>
              <td className="border p-3 text-left">
                <Link to={`/question/detail.do?id=${q.questionId}`} className="hover:underline font-medium">
                  {q.title}
                </Link>
              </td>
              <td className="border p-3">
                <span className={`px-2 py-1 rounded text-sm ${q.status === 'ANSWERED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {q.status === 'ANSWERED' ? '답변완료' : '답변대기'}
                </span>
              </td>
              <td className="border p-3 text-gray-500">{q.createdAt?.substring(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}