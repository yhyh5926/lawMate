import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import FileUpload from '../../components/common/FileUpload';

export default function QuestionWritePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', caseType: '', content: '' });
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // FormData를 사용하여 파일과 함께 전송
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('caseType', form.caseType);
    formData.append('content', form.content);
    if (file) formData.append('file', file);

    try {
      // API 분리 시 questionApi.js 사용 권장
      const token = localStorage.getItem('accessToken');
      await axios.post('http://localhost:8080/api/question/write', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      alert('질문이 등록되었습니다.');
      navigate('/question/list.do');
    } catch (e) {
      alert('질문 등록 실패');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6">법률 질문 작성</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-4">
          <select 
            name="caseType" required
            className="w-1/4 px-4 py-2 border rounded-md"
            value={form.caseType} onChange={(e) => setForm({...form, caseType: e.target.value})}
          >
            <option value="">사건 유형 선택</option>
            <option value="CIVIL">민사</option>
            <option value="CRIMINAL">형사</option>
            <option value="FAMILY">가사/이혼</option>
            <option value="REAL_ESTATE">부동산</option>
          </select>
          <input 
            type="text" name="title" placeholder="제목을 입력하세요" required
            className="flex-1 px-4 py-2 border rounded-md"
            value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} 
          />
        </div>
        
        <textarea 
          name="content" rows="10" required
          placeholder="구체적인 상황을 작성해주세요. 개인정보가 포함되지 않도록 주의해주세요."
          className="w-full px-4 py-2 border rounded-md resize-none"
          value={form.content} onChange={(e) => setForm({...form, content: e.target.value})}
        />

        <div className="border p-4 rounded-md bg-gray-50">
          <p className="text-sm text-gray-600 mb-2">첨부파일 (옵션)</p>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </div>

        <div className="flex justify-end space-x-2">
          <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 border rounded-md">취소</button>
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md">등록</button>
        </div>
      </form>
    </div>
  );
}