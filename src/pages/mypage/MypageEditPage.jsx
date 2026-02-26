import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function MypageEditPage() {
  const [form, setForm] = useState({
    password: '', passwordConfirm: '', email: '', phone: ''
  });
  const [notifySet, setNotifySet] = useState({ inappYn: 'Y', emailYn: 'Y', smsYn: 'N' });

  useEffect(() => {
    // 기존 정보 불러오기
    const fetchMyInfo = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get('http://localhost:8080/api/mypage/info', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = res.data.data;
        setForm({ ...form, email: data.email, phone: data.phone });
        if (data.notifySetting) setNotifySet(data.notifySetting);
      } catch (error) {
        console.error('정보 로딩 실패');
      }
    };
    fetchMyInfo();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleNotifyChange = (e) => setNotifySet({ ...notifySet, [e.target.name]: e.target.checked ? 'Y' : 'N' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.passwordConfirm) {
      return alert('비밀번호가 일치하지 않습니다.');
    }

    try {
      const token = localStorage.getItem('accessToken');
      await axios.put('http://localhost:8080/api/mypage/edit', { ...form, notifySetting: notifySet }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('회원 정보가 성공적으로 수정되었습니다.');
    } catch (error) {
      alert('정보 수정에 실패했습니다.');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6">회원 정보 수정</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold mb-3">기본 정보</h3>
          <input type="password" name="password" placeholder="새 비밀번호 (변경시에만 입력)" className="w-full px-4 py-2 border rounded-md mb-2" value={form.password} onChange={handleChange} />
          <input type="password" name="passwordConfirm" placeholder="새 비밀번호 확인" className="w-full px-4 py-2 border rounded-md mb-2" value={form.passwordConfirm} onChange={handleChange} />
          <input type="tel" name="phone" placeholder="전화번호" className="w-full px-4 py-2 border rounded-md mb-2" value={form.phone} onChange={handleChange} required />
          <input type="email" name="email" placeholder="이메일" className="w-full px-4 py-2 border rounded-md" value={form.email} onChange={handleChange} />
        </div>

        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold mb-3">알림 수신 설정</h3>
          <div className="flex space-x-6">
            <label className="flex items-center space-x-2">
              <input type="checkbox" name="inappYn" checked={notifySet.inappYn === 'Y'} onChange={handleNotifyChange} />
              <span>앱/웹 푸시 알림</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" name="emailYn" checked={notifySet.emailYn === 'Y'} onChange={handleNotifyChange} />
              <span>이메일 알림</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" name="smsYn" checked={notifySet.smsYn === 'Y'} onChange={handleNotifyChange} />
              <span>SMS 알림</span>
            </label>
          </div>
        </div>

        <button type="submit" className="w-full bg-gray-800 text-white py-3 rounded-md mt-4 font-bold hover:bg-black">
          저장하기
        </button>
      </form>
    </div>
  );
}