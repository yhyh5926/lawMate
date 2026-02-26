import React, { useState } from 'react';
import axios from 'axios';

export default function FindIdPwPage() {
  const [activeTab, setActiveTab] = useState('ID'); // 'ID' or 'PW'
  const [form, setForm] = useState({ name: '', phone: '', loginId: '' });
  const [resultMsg, setResultMsg] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFindId = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/member/find-id', { name: form.name, phone: form.phone });
      setResultMsg(`고객님의 아이디는 [ ${res.data.data.loginId} ] 입니다.`);
    } catch (error) {
      setResultMsg('입력하신 정보와 일치하는 계정을 찾을 수 없습니다.');
    }
  };

  const handleFindPw = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/member/reset-pw', { loginId: form.loginId, phone: form.phone });
      setResultMsg('등록된 연락처로 임시 비밀번호를 발송했습니다.');
    } catch (error) {
      setResultMsg('계정 정보를 찾을 수 없거나 SMS 발송에 실패했습니다.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-center mb-6">아이디/비밀번호 찾기</h2>
      
      <div className="flex mb-6 border-b">
        <button onClick={() => { setActiveTab('ID'); setResultMsg(''); }} className={`flex-1 py-2 text-center font-semibold ${activeTab === 'ID' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>아이디 찾기</button>
        <button onClick={() => { setActiveTab('PW'); setResultMsg(''); }} className={`flex-1 py-2 text-center font-semibold ${activeTab === 'PW' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>비밀번호 찾기</button>
      </div>

      {activeTab === 'ID' ? (
        <form onSubmit={handleFindId} className="space-y-4">
          <input type="text" name="name" placeholder="가입한 이름" className="w-full px-4 py-2 border rounded" required onChange={handleChange} />
          <input type="tel" name="phone" placeholder="가입한 휴대전화번호" className="w-full px-4 py-2 border rounded" required onChange={handleChange} />
          <button type="submit" className="w-full bg-gray-800 text-white py-2 rounded">아이디 찾기</button>
        </form>
      ) : (
        <form onSubmit={handleFindPw} className="space-y-4">
          <input type="text" name="loginId" placeholder="아이디" className="w-full px-4 py-2 border rounded" required onChange={handleChange} />
          <input type="tel" name="phone" placeholder="가입한 휴대전화번호" className="w-full px-4 py-2 border rounded" required onChange={handleChange} />
          <button type="submit" className="w-full bg-gray-800 text-white py-2 rounded">임시 비밀번호 발송</button>
        </form>
      )}

      {resultMsg && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 text-center rounded text-blue-700 font-medium">
          {resultMsg}
        </div>
      )}
    </div>
  );
}