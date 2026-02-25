import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LawyerJoinFormPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    loginId: '', password: '', passwordConfirm: '', name: '', phone: '', email: '',
    licenseNo: '', specialty: '', officeName: '', officeAddr: ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.passwordConfirm) return alert('비밀번호가 일치하지 않습니다.');
    
    try {
      // 일반 회원(TB_MEMBER) 정보 + 전문 회원(TB_LAWYER) 정보를 함께 전송
      await axios.post('http://localhost:8080/api/member/lawyer/join', {
        ...form, memberType: 'LAWYER', approveStatus: 'PENDING'
      });
      navigate('/member/lawyer/complete.do');
    } catch (error) {
      alert('전문회원 가입 신청에 실패했습니다.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6">전문회원(변호사) 정보 입력</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="font-semibold border-b pb-2">기본 정보</h3>
        <input type="text" name="loginId" placeholder="아이디" className="w-full px-4 py-2 border rounded-md" required onChange={handleChange} />
        <input type="password" name="password" placeholder="비밀번호" className="w-full px-4 py-2 border rounded-md" required onChange={handleChange} />
        <input type="password" name="passwordConfirm" placeholder="비밀번호 확인" className="w-full px-4 py-2 border rounded-md" required onChange={handleChange} />
        <input type="text" name="name" placeholder="이름 (실명)" className="w-full px-4 py-2 border rounded-md" required onChange={handleChange} />
        <input type="tel" name="phone" placeholder="휴대전화번호" className="w-full px-4 py-2 border rounded-md" required onChange={handleChange} />
        
        <h3 className="font-semibold border-b pb-2 mt-6">변호사 자격 정보</h3>
        <input type="text" name="licenseNo" placeholder="변호사 자격번호 (예: 12345)" className="w-full px-4 py-2 border rounded-md" required onChange={handleChange} />
        <input type="text" name="specialty" placeholder="주요 전문 분야 (예: 민사, 형사, 이혼)" className="w-full px-4 py-2 border rounded-md" required onChange={handleChange} />
        <input type="text" name="officeName" placeholder="소속 사무소/법무법인명" className="w-full px-4 py-2 border rounded-md" required onChange={handleChange} />
        <input type="text" name="officeAddr" placeholder="사무소 주소" className="w-full px-4 py-2 border rounded-md" required onChange={handleChange} />

        <div className="bg-blue-50 text-blue-800 p-4 rounded-md text-sm mt-4">
          안내: 가입 신청 후 관리자의 <strong>자격 승인 절차</strong>를 거친 뒤 서비스 이용이 가능합니다. (보통 1~2영업일 소요)
        </div>

        <button type="submit" className="w-full bg-blue-800 text-white py-3 rounded-md mt-6 font-bold hover:bg-blue-900">
          가입 신청하기
        </button>
      </form>
    </div>
  );
}