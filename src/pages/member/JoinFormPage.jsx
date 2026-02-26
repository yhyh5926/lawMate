import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { memberApi } from '../../api/memberApi';

export default function JoinFormPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    loginId: '', password: '', passwordConfirm: '', name: '', phone: '', email: ''
  });
  const [idCheckStatus, setIdCheckStatus] = useState(''); // 'success' | 'fail' | ''

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleIdCheck = async () => {
    if (form.loginId.length < 4) return alert('아이디는 4자 이상 입력해주세요.');
    try {
      const res = await memberApi.checkId(form.loginId);
      if (res.data.data.isAvailable) {
        setIdCheckStatus('success');
        alert('사용 가능한 아이디입니다.');
      } else {
        setIdCheckStatus('fail');
        alert('이미 사용중인 아이디입니다.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (idCheckStatus !== 'success') return alert('아이디 중복확인을 해주세요.');
    if (form.password !== form.passwordConfirm) return alert('비밀번호가 일치하지 않습니다.');
    
    // TODO: SMS 인증 검증 로직 추가 (PHONE_VERIFIED = 'Y' 필요)

    try {
      await memberApi.join({ ...form, memberType: 'PERSONAL', phoneVerified: 'Y' });
      navigate('/member/join/complete.do');
    } catch (e) {
      alert('회원가입에 실패했습니다.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6">회원 정보 입력</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-2">
          <input type="text" name="loginId" placeholder="아이디 (4자 이상)" className="flex-1 px-4 py-2 border rounded-md" value={form.loginId} onChange={handleChange} required />
          <button type="button" onClick={handleIdCheck} className="px-4 py-2 bg-gray-200 rounded-md">중복확인</button>
        </div>
        <input type="password" name="password" placeholder="비밀번호 (4자 이상)" className="w-full px-4 py-2 border rounded-md" value={form.password} onChange={handleChange} required />
        <input type="password" name="passwordConfirm" placeholder="비밀번호 확인" className="w-full px-4 py-2 border rounded-md" value={form.passwordConfirm} onChange={handleChange} required />
        <input type="text" name="name" placeholder="이름" className="w-full px-4 py-2 border rounded-md" value={form.name} onChange={handleChange} required />
        
        <div className="flex space-x-2">
          <input type="tel" name="phone" placeholder="휴대전화번호 (예: 010-1234-5678)" className="flex-1 px-4 py-2 border rounded-md" value={form.phone} onChange={handleChange} required />
          <button type="button" className="px-4 py-2 bg-gray-200 rounded-md">인증요청</button>
        </div>

        <input type="email" name="email" placeholder="이메일 (선택)" className="w-full px-4 py-2 border rounded-md" value={form.email} onChange={handleChange} />

        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md mt-4 font-bold">가입하기</button>
      </form>
    </div>
  );
}