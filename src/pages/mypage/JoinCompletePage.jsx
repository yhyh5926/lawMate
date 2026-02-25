import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function JoinCompletePage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white shadow-md rounded-md text-center">
      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
        🎉
      </div>
      <h2 className="text-2xl font-bold mb-4">회원가입이 완료되었습니다!</h2>
      <p className="text-gray-600 mb-8 leading-relaxed">
        LawMate의 회원이 되신 것을 환영합니다.<br />
        로그인 후 다양한 법률 서비스를 이용해 보세요.
      </p>
      
      <button 
        onClick={() => navigate('/member/login.do')} 
        className="w-full bg-blue-600 text-white py-3 rounded-md font-bold hover:bg-blue-700 transition"
      >
        로그인 페이지로 이동
      </button>
    </div>
  );
}